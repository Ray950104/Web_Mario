const { ccclass, property } = cc._decorator;

@ccclass
export default class ChasingGoomba extends cc.Component {

    @property walkSpeed: number = 60;
    @property chaseSpeed: number = 150;
    @property detectRange: number = 300;

    private _rb: cc.RigidBody = null;
    private _alive: boolean = true;
    private _direction: number = -1;
    private _turnCooldown: number = 0;
    private _isChasing: boolean = false;

    onLoad() {
        this._rb = this.getComponent(cc.RigidBody);
        this._rb.enabledContactListener = true;
    }

    update(dt: number) {
        if (!this._alive) return;

        if (this._turnCooldown > 0) this._turnCooldown -= dt;

        // 找玩家
        const player = cc.find("Canvas/Player");
        let speed = this.walkSpeed;

        if (player) {
            const dist = Math.abs(player.x - this.node.x);
            if (dist < this.detectRange) {
                // 追人模式
                this._isChasing = true;
                speed = this.chaseSpeed;
                if (player.x < this.node.x) {
                    this._direction = -1;
                } else {
                    this._direction = 1;
                }
            } else {
                this._isChasing = false;
            }
        }

        let lv = this._rb.linearVelocity;
        lv.x = this._direction * speed;
        this._rb.linearVelocity = lv;

        this.node.scaleX = this._direction > 0 ? -1 : 1;

        // 追人時顏色變紅（閃爍效果）
        if (this._isChasing) {
            this.node.color = new cc.Color(255, 150, 150);
        } else {
            this.node.color = cc.Color.WHITE;
        }

        // 邊界
        if (this.node.x < -480) { this.node.x = -479; this._direction = 1; }
        if (this.node.x > 4500) { this.node.x = 4499; this._direction = -1; }

        if (this.node.y < -500) this.node.destroy();
    }

    onBeginContact(contact: cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider) {
        if (!this._alive) return;
        if (this._turnCooldown > 0) return;
        if (this._isChasing) return; // 追人時不因碰牆反轉

        const otherNode = other.node;

        if (otherNode.group === "ground" || otherNode.group === "platform") {
            if (this.node.x < otherNode.x) {
                this._direction = -1;
            } else if (this.node.x > otherNode.x) {
                this._direction = 1;
            }
            this._turnCooldown = 0.3;
        }

        if (otherNode.group === "enemy" && otherNode !== this.node) {
            if (this.node.x < otherNode.x) {
                this._direction = -1;
            } else {
                this._direction = 1;
            }
            this._turnCooldown = 0.5;
        }
    }

    isAlive(): boolean { return this._alive; }

    onStomped() {
        if (!this._alive) return;
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
    }
}