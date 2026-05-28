const { ccclass, property } = cc._decorator;

@ccclass
export default class ChasingGoomba extends cc.Component {

    @property walkSpeed: number = 60;
    @property chaseSpeed: number = 200;
    @property detectRange: number = 400;

    private _rb: cc.RigidBody = null;
    private _alive: boolean = true;
    private _direction: number = -1;
    private _isChasing: boolean = false;
    private _hp: number = 2;
    private _playerNode: cc.Node = null;
    private _turnCooldown: number = 0;
    private _onGround: boolean = true;
    private _groundCount: number = 0;
    onLoad() {
        this._rb = this.getComponent(cc.RigidBody);
        this._rb.enabledContactListener = true;
    }

    start() {
        this.scheduleOnce(() => {
            this._playerNode = this.findPlayer();
        }, 0);
    }

    private findPlayer(): cc.Node {
        let node = cc.find("Canvas/Map/Player");
        if (node) return node;
        node = cc.find("Canvas/Player");
        if (node) return node;
        // 遍歷場景
        const scene = cc.director.getScene();
        if (scene) {
            for (const child of scene.children) {
                const comp = child.getComponentInChildren("Player");
                if (comp) return comp.node;
            }
        }
        return null;
    }

    private getPlayerWorldX(): number {
        if (!this._playerNode || !this._playerNode.isValid) return null;
        const worldPos = this._playerNode.parent.convertToWorldSpaceAR(this._playerNode.position);
        return worldPos.x;
    }

    private getMyWorldX(): number {
        const worldPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
        return worldPos.x;
    }

    update(dt: number) {
        if (!this._alive) return;
    
        if (this._turnCooldown > 0) this._turnCooldown -= dt;
    
        if (!this._playerNode || !this._playerNode.isValid) {
            this._playerNode = this.findPlayer();
        }
    
        let speed = this.walkSpeed;
    
        if (!this._isChasing && this._playerNode && this._playerNode.activeInHierarchy) {
            const playerX = this.getPlayerWorldX();
            const myX = this.getMyWorldX();
            if (playerX !== null) {
                const dist = Math.abs(playerX - myX);
                if (dist < this.detectRange) {
                    this._isChasing = true;
                    this._direction = playerX > myX ? 1 : -1;
                    this.node.color = new cc.Color(255, 100, 100);
                }
            }
        }
    
        if (this._isChasing) {
            speed = this.chaseSpeed;
        }
    
        let lv = this._rb.linearVelocity;
        lv.x = this._direction * speed;
        this._rb.linearVelocity = lv;
    
        this.node.scaleX = this._direction > 0 ? -1 : 1;
    
        // 只有巡邏時才偵測懸崖
        if (!this._isChasing && this._turnCooldown <= 0) {
            this.checkCliffSimple();
        }
    
        // 邊界
        if (this.node.x < -480) { this.node.x = -479; this._direction = 1; this._turnCooldown = 0.3; }
        if (this.node.x > 4500) { this.node.x = 4499; this._direction = -1; this._turnCooldown = 0.3; }
    
        if (this.node.y < -500) this.node.destroy();
    }

    

    onBeginContact(contact: cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider) {
        if (!this._alive) return;
    
        const otherNode = other.node;
    
        // 追蹤地面（我在對方上面 = 踩在地上）
        if (otherNode.group === "ground" || otherNode.group === "platform") {
            if (this.node.y > otherNode.y) {
                this._groundCount++;
                this._onGround = true;
                return; // 踩在上面不算撞牆，直接 return
            }
        }
    
        if (this._turnCooldown > 0) return;
    
        // 撞到側面才反轉
        if (otherNode.group === "ground" || otherNode.group === "platform") {
            if (this.node.x < otherNode.x) {
                this._direction = -1;
            } else if (this.node.x > otherNode.x) {
                this._direction = 1;
            }
            this._turnCooldown = 0.3;
        }
    
        if (otherNode.group === "enemy" && otherNode !== this.node) {
            this._direction = -this._direction;
            this._turnCooldown = 0.3;
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
    private checkCliffSimple() {
        if (!this._onGround) {
            this._direction = -this._direction;
            this._turnCooldown = 0.5;
        }
    }

    isAlive(): boolean { return this._alive; }

    onStomped() {
        if (!this._alive) return;

        this._hp--;

        if (this._hp <= 0) {
            this._alive = false;
            this.node.scaleY = 0.3;
            this.node.color = cc.Color.WHITE;

            this.scheduleOnce(() => {
                if (this._rb) {
                    this._rb.linearVelocity = cc.v2(0, 0);
                    this._rb.type = cc.RigidBodyType.Static;
                }
                const colliders = this.getComponents(cc.PhysicsCollider);
                colliders.forEach(c => c.enabled = false);
            }, 0);

            this.scheduleOnce(() => this.node.destroy(), 0.5);
        } else {
            this.chaseSpeed *= 0.7;
            this.walkSpeed *= 0.7;
            this.node.color = new cc.Color(255, 255, 100);

            let blinkCount = 0;
            this.schedule(() => {
                this.node.opacity = this.node.opacity === 255 ? 100 : 255;
                blinkCount++;
                if (blinkCount >= 6) {
                    this.node.opacity = 255;
                }
            }, 0.1, 5);
        }
    }
}