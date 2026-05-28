const { ccclass, property } = cc._decorator;

@ccclass
export default class FlyingGoomba extends cc.Component {

    @property flySpeed: number = 2;
    @property flyHeight: number = 40;
    @property moveSpeed: number = 60;
    @property leftX: number = 0;
    @property rightX: number = 400;

    private _rb: cc.RigidBody = null;
    private _alive: boolean = true;
    private _direction: number = -1;
    private _startY: number = 0;
    private _time: number = 0;

    onLoad() {
        this._rb = this.getComponent(cc.RigidBody);
        this._rb.enabledContactListener = true;
        this._rb.gravityScale = 0;
        this._startY = this.node.y;
    }

    update(dt: number) {
        if (!this._alive) return;

        this._time += dt;

        // 水平來回移動
        let lv = this._rb.linearVelocity;
        lv.x = this._direction * this.moveSpeed;

        // 到達左右邊界就反轉
        if (this.node.x <= this.leftX) {
            this._direction = 1;
            this.node.x = this.leftX + 1;
        }
        if (this.node.x >= this.rightX) {
            this._direction = -1;
            this.node.x = this.rightX - 1;
        }

        // 上下飄動（固定軌跡，用 sin 波）
        const targetY = this._startY + Math.sin(this._time * this.flySpeed) * this.flyHeight;
        lv.y = (targetY - this.node.y) * 5;

        this._rb.linearVelocity = lv;
        this.node.scaleX = this._direction > 0 ? -1 : 1;
    }

    isAlive(): boolean { return this._alive; }

    onStomped() {
        if (!this._alive) return;
        this._alive = false;

        this._rb.gravityScale = 1;
        this.node.scaleY = 0.3;

        this.scheduleOnce(() => {
            if (this._rb) {
                this._rb.linearVelocity = cc.v2(0, 0);
                this._rb.type = cc.RigidBodyType.Static;
            }
            const colliders = this.getComponents(cc.PhysicsCollider);
            colliders.forEach(c => c.enabled = false);
        }, 0);

        this.scheduleOnce(() => this.node.destroy(), 0.5);
    }
}