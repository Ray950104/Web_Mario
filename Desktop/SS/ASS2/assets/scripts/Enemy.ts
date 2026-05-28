const { ccclass, property } = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {

    @property moveSpeed: number = 80;
    @property leftBound: number = -480;
    @property rightBound: number = 4500;

    private _rb: cc.RigidBody = null;
    private _direction: number = -1;
    private _alive: boolean = true;
    private _turnCooldown: number = 0;

    onLoad() {
        this._rb = this.getComponent(cc.RigidBody);
        this._rb.enabledContactListener = true;
    }

    update(dt: number) {
        if (!this._alive) return;

        if (this._turnCooldown > 0) this._turnCooldown -= dt;

        let lv = this._rb.linearVelocity;
        lv.x = this._direction * this.moveSpeed;
        this._rb.linearVelocity = lv;
        this.node.scaleX = this._direction > 0 ? -1 : 1;

        // 邊界反轉
        if (this.node.x <= this.leftBound) {
            this.node.x = this.leftBound + 1;
            this._direction = 1;
        }
        if (this.node.x >= this.rightBound) {
            this.node.x = this.rightBound - 1;
            this._direction = -1;
        }

        // 懸崖偵測：檢查前方腳下有沒有地面
        if (this._turnCooldown <= 0) {
            this.checkCliff();
        }

        if (this.node.y < -500) this.node.destroy();
    }

    private checkCliff() {
        const pm = cc.director.getPhysicsManager();
        // 從 Goomba 前方腳下往下射一條線
        const frontX = this.node.x + this._direction * 20;
        const footY = this.node.y - 15;
        const start = cc.v2(frontX, footY);
        const end = cc.v2(frontX, footY - 30);

        const results = pm.rayCast(start, end, cc.RayCastType.Closest);

        // 如果前方腳下沒有任何東西，代表是懸崖
        let hasGround = false;
        for (const r of results) {
            if (r.collider.node.group === "ground" || r.collider.node.group === "platform") {
                hasGround = true;
                break;
            }
        }

        if (!hasGround) {
            this._direction = -this._direction;
            this._turnCooldown = 0.5;
        }
    }

    onBeginContact(contact: cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider) {
        if (!this._alive) return;
        if (this._turnCooldown > 0) return;

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

    isAlive(): boolean {
        return this._alive;
    }

    onStomped() {
        if (!this._alive) return;
        this._alive = false;
    
        const anim = this.getComponent("EnemyAnimator");
        if (anim) anim.playDead();
    
        this.node.scaleY = 0.3;
    
        // 延遲到下一幀才修改物理屬性，避免在碰撞回調裡改出錯
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