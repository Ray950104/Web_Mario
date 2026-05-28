import GameManager from "./GameManager";
import AudioManager from "./AudioManager";
import PlayerAnimator from "./PlayerAnimator";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property moveSpeed: number = 200;
    @property jumpSpeed: number = 550;
    @property maxSpeed: number = 300;
    @property leftBound: number = -460;

    private _rb: cc.RigidBody = null;
    private _anim: PlayerAnimator = null;
    private _onGround: boolean = false;
    private _groundCount: number = 0;
    private _isBig: boolean = false;
    private _isDead: boolean = false;
    private _isInvincible: boolean = false;
    private _facingRight: boolean = true;
    private _spawnPos: cc.Vec2 = cc.v2(0, 0);

    private _left: boolean = false;
    private _right: boolean = false;
    private _jump: boolean = false;

    private getAudio(): any {
        // 優先用單例
        if (AudioManager.instance) return AudioManager.instance;
        // 備用：用 cc.find
        let node = cc.find("Canvas/AudioManagerNode");
        if (!node) node = cc.find("AudioManagerNode");
        if (node) return node.getComponent("AudioManager");
        return null;
    }

    onLoad() {
        const pm = cc.director.getPhysicsManager();
        pm.enabled = true;
        pm.gravity = cc.v2(0, -960);

        if (!GameManager.instance) {
            const gmNode = new cc.Node("GameManager");
            gmNode.addComponent("GameManager");
            cc.director.getScene().addChild(gmNode);
        }

        this._rb = this.getComponent(cc.RigidBody);
        this._anim = this.getComponent(PlayerAnimator);
        this._spawnPos = cc.v2(this.node.x, this.node.y);

        const collider = this.getComponent(cc.PhysicsBoxCollider);
        if (collider) {
            collider.friction = 0;
            collider.apply();
        }

        this._rb.enabledContactListener = true;

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start() {
        const audio = this.getAudio();
        if (audio) {
            if (!cc.audioEngine.isMusicPlaying()) {
                audio.playBGM();
            }
        }
        if (GameManager.instance) GameManager.instance.startTimer();
    }

    update(dt: number) {
        if (this._isDead) return;
        if (!this._rb) {
            this._rb = this.getComponent(cc.RigidBody);
            return;
        }
        this.handleMovement();
        if (this.node.y < -500) this.die();
    }

    private onKeyDown(e: cc.Event.EventKeyboard) {
        switch (e.keyCode) {
            case cc.macro.KEY.left: case cc.macro.KEY.a: this._left = true; break;
            case cc.macro.KEY.right: case cc.macro.KEY.d: this._right = true; break;
            case cc.macro.KEY.up: case cc.macro.KEY.w: case cc.macro.KEY.space:
                this._jump = true; break;
        }
    }

    private onKeyUp(e: cc.Event.EventKeyboard) {
        switch (e.keyCode) {
            case cc.macro.KEY.left: case cc.macro.KEY.a: this._left = false; break;
            case cc.macro.KEY.right: case cc.macro.KEY.d: this._right = false; break;
            case cc.macro.KEY.up: case cc.macro.KEY.w: case cc.macro.KEY.space:
                this._jump = false; break;
        }
    }

    private handleMovement() {
        let lv = this._rb.linearVelocity;

        if (this._left) {
            lv.x = -this.moveSpeed;
            this._facingRight = false;
        } else if (this._right) {
            lv.x = this.moveSpeed;
            this._facingRight = true;
        } else {
            lv.x *= 0.85;
            if (Math.abs(lv.x) < 10) lv.x = 0;
        }
        lv.x = cc.misc.clampf(lv.x, -this.maxSpeed, this.maxSpeed);

        if (this._jump && this._onGround) {
            lv.y = this.jumpSpeed;
            this._onGround = false;
            this._jump = false;
            const audio = this.getAudio();
            if (audio) audio.playJump();
        }

        this._rb.linearVelocity = lv;
        this.node.scaleX = this._facingRight ? Math.abs(this.node.scaleX) : -Math.abs(this.node.scaleX);

        if (this.node.x < this.leftBound) {
            this.node.x = this.leftBound;
        }
    }

    onBeginContact(contact: cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider) {
        
        if (this._isDead) return;

        const otherNode = other.node;
        cc.log("=== contact with:", otherNode.name, "group:", otherNode.group);

        if (otherNode.group === "ground" || otherNode.group === "platform") {
            if (this._rb.linearVelocity.y <= 0) {
                if (this.node.y > otherNode.y) {
                    this._groundCount++;
                    this._onGround = true;
                }
            }
        }

        // 碰到敵人
        if (otherNode.group === "enemy") {
            const enemy = otherNode.getComponent("Enemy");
            if (!enemy || !enemy.isAlive()) return;

            // 用位置判斷：玩家腳底在敵人頭頂以上就算踩頭
            const playerBottom = this.node.y - 13;
            const enemyTop = otherNode.y + 12;

            cc.log("=== playerBottom:", playerBottom, "enemyTop:", enemyTop);

            if (playerBottom >= enemyTop) {
                cc.log("=== STOMP!");
                enemy.onStomped();
                let lv = this._rb.linearVelocity;
                lv.y = this.jumpSpeed * 0.7;
                this._rb.linearVelocity = lv;
                const audio = this.getAudio();
                cc.log("=== audio:", audio);
                cc.log("=== stompClip:", audio ? audio.stompClip : "null");
                if (audio) audio.playStomp();
                if (GameManager.instance) GameManager.instance.addScore(100);
            } else {
                // 受傷
                this.getHurt();
            }
        }

        if (otherNode.group === "item") {
            const mush = otherNode.getComponent("Mushroom");
            if (mush) {
                this.makeBig();
                mush.onCollected();
                const audio = this.getAudio();
                if (audio) audio.playPowerup();
                if (GameManager.instance) GameManager.instance.addScore(1000);
            }
        }

        if (otherNode.group === "flag") {
            this.onReachFlag();
        }
    }

    onEndContact(contact: cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider) {
        const otherNode = other.node;
        if (otherNode.group === "ground" || otherNode.group === "platform") {
            this._groundCount--;
            if (this._groundCount <= 0) {
                this._groundCount = 0;
                this._onGround = false;
            }
        }
    }

    getHurt() {
        if (this._isInvincible || this._isDead) return;
        if (this._isBig) {
            this.makeSmall();
            this.startInvincible();
            const audio = this.getAudio();
            if (audio) audio.playHurt();
        } else {
            this.die();
        }
    }

    die() {
        if (this._isDead) return;
        this._isDead = true;
    
        // 不在這裡播音效了，改在 GameManager.loseLife 裡播
        if (this._anim) this._anim.playDead();
    
        this._rb.linearVelocity = cc.v2(0, 400);
        const colliders = this.getComponents(cc.PhysicsCollider);
        colliders.forEach(c => c.enabled = false);
    
        if (GameManager.instance) {
            GameManager.instance.loseLife();
        } else {
            const audio = this.getAudio();
            if (audio) {
                audio.stopBGM();
                audio.playDie();
            }
            this.scheduleOnce(() => {
                cc.director.loadScene(cc.director.getScene().name);
            }, 2);
        }
    }

    makeBig() {
        if (this._isBig) return;
        this._isBig = true;
        this.node.scaleY = Math.abs(this.node.scaleY) * 1.5;
        const col = this.getComponent(cc.PhysicsBoxCollider);
        if (col) {
            col.size.height *= 1.5;
            col.offset.y += col.size.height * 0.15;
            col.apply();
        }
        if (this._anim) this._anim.setBig(true);
    }

    makeSmall() {
        if (!this._isBig) return;
        this._isBig = false;
        this.node.scaleY = Math.abs(this.node.scaleY) / 1.5;
        const col = this.getComponent(cc.PhysicsBoxCollider);
        if (col) {
            col.offset.y -= col.size.height * 0.15;
            col.size.height /= 1.5;
            col.apply();
        }
        if (this._anim) this._anim.setBig(false);
    }

    isBig(): boolean { return this._isBig; }

    private startInvincible() {
        this._isInvincible = true;
        // 用 cc.tween 做閃爍效果
        let blinkCount = 0;
        this.schedule(() => {
            this.node.opacity = this.node.opacity === 255 ? 100 : 255;
            blinkCount++;
            if (blinkCount >= 16) {
                this.unscheduleAllCallbacks();
                this.node.opacity = 255;
                this._isInvincible = false;
            }
        }, 0.1);
    }

    private onReachFlag() {
        if (this._isDead) return;
        this._isDead = true;

        const audio = this.getAudio();
        if (audio) audio.stopBGM();

        if (GameManager.instance) {
            GameManager.instance.stopTimer();
            GameManager.instance.addScore(GameManager.instance.getTimeLeft() * 50);
        }
        this._rb.linearVelocity = cc.v2(0, 0);
        this.scheduleOnce(() => {
            cc.director.loadScene("WinScene");
        }, 2);
    }
}