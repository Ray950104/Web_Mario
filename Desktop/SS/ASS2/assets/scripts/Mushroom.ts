const { ccclass, property } = cc._decorator;

@ccclass
export default class Mushroom extends cc.Component {

    @property moveSpeed: number = 100;

    private _rb: cc.RigidBody = null;
    private _direction: number = 1;

    onLoad() {
        this._rb = this.getComponent(cc.RigidBody);
        this._rb.enabledContactListener = true;
        const startY = this.node.y;
        this.node.y -= 30;
        cc.tween(this.node).to(0.4, { y: startY }, { easing: 'quadOut' }).start();
    }

    update(dt: number) {
        if (!this._rb) return;
        let lv = this._rb.linearVelocity;
        lv.x = this._direction * this.moveSpeed;
        this._rb.linearVelocity = lv;
        if (this.node.y < -500) this.node.destroy();
    }

    onBeginContact(contact: cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider) {
        if (other.node.group === "ground" || other.node.group === "platform") {
            const normal = contact.getWorldManifold().normal;
            const selfIsA = contact.colliderA === self;
            const nx = selfIsA ? normal.x : -normal.x;
            if (Math.abs(nx) > 0.7) this._direction = -this._direction;
        }
    }

    onCollected() { this.node.destroy(); }
}
