const { ccclass, property } = cc._decorator;

/**
 * PlayerAnimator - 控制 Mario 的走路/跳躍/待機動畫
 * 掛在 Player 節點上（和 Player.ts 掛同一個節點）
 * 透過讀取 RigidBody 速度來自動切換動畫
 */
@ccclass
export default class PlayerAnimator extends cc.Component {

    // 小 Mario 動畫幀
    @property(cc.SpriteFrame) smallIdle: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) smallJump: cc.SpriteFrame = null;
    @property([cc.SpriteFrame]) smallWalk: cc.SpriteFrame[] = [];

    // 大 Mario 動畫幀
    @property(cc.SpriteFrame) bigIdle: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) bigJump: cc.SpriteFrame = null;
    @property([cc.SpriteFrame]) bigWalk: cc.SpriteFrame[] = [];

    // 死亡幀
    @property(cc.SpriteFrame) deadFrame: cc.SpriteFrame = null;

    /** 走路動畫切換間隔（秒） */
    @property walkAnimInterval: number = 0.1;

    private _sprite: cc.Sprite = null;
    private _rb: cc.RigidBody = null;
    private _walkIndex: number = 0;
    private _walkTimer: number = 0;
    private _isBig: boolean = false;
    private _isDead: boolean = false;
    private _onGround: boolean = true;

    onLoad() {
        this._sprite = this.getComponentInChildren(cc.Sprite);
        this._rb = this.getComponent(cc.RigidBody);
    }

    update(dt: number) {
        if (!this._sprite || !this._rb) return;
        if (this._isDead) return;

        const vx = this._rb.linearVelocity.x;
        const vy = this._rb.linearVelocity.y;

        // 取得對應的動畫幀集
        const idle = this._isBig ? this.bigIdle : this.smallIdle;
        const jump = this._isBig ? this.bigJump : this.smallJump;
        const walk = this._isBig ? this.bigWalk : this.smallWalk;

        // 在空中
        if (Math.abs(vy) > 50) {
            if (jump) this._sprite.spriteFrame = jump;
            this._onGround = false;
            return;
        }

        this._onGround = true;

        // 在走路
        if (Math.abs(vx) > 10 && walk.length > 0) {
            this._walkTimer += dt;
            if (this._walkTimer >= this.walkAnimInterval) {
                this._walkTimer = 0;
                this._walkIndex = (this._walkIndex + 1) % walk.length;
            }
            this._sprite.spriteFrame = walk[this._walkIndex];
        } else {
            // 待機
            if (idle) this._sprite.spriteFrame = idle;
            this._walkIndex = 0;
            this._walkTimer = 0;
        }
    }

    /** 由 Player.ts 呼叫 */
    setBig(big: boolean) {
        this._isBig = big;
    }

    /** 由 Player.ts 呼叫 */
    playDead() {
        this._isDead = true;
        if (this._sprite && this.deadFrame) {
            this._sprite.spriteFrame = this.deadFrame;
        }
    }

    reset() {
        this._isDead = false;
        this._isBig = false;
        this._walkIndex = 0;
    }
}
