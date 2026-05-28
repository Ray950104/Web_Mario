const { ccclass, property } = cc._decorator;

/**
 * EnemyAnimator - 敵人走路動畫
 * 掛在 Enemy 節點上（和 Enemy.ts 掛同一個節點）
 */
@ccclass
export default class EnemyAnimator extends cc.Component {

    @property([cc.SpriteFrame]) walkFrames: cc.SpriteFrame[] = [];
    @property(cc.SpriteFrame) deadFrame: cc.SpriteFrame = null;
    @property animInterval: number = 0.2;

    private _sprite: cc.Sprite = null;
    private _index: number = 0;
    private _timer: number = 0;
    private _alive: boolean = true;

    onLoad() {
        this._sprite = this.getComponentInChildren(cc.Sprite);
    }

    update(dt: number) {
        if (!this._alive || !this._sprite || this.walkFrames.length === 0) return;
        this._timer += dt;
        if (this._timer >= this.animInterval) {
            this._timer = 0;
            this._index = (this._index + 1) % this.walkFrames.length;
            this._sprite.spriteFrame = this.walkFrames[this._index];
        }
    }

    /** 由 Enemy.ts 的 onStomped 呼叫 */
    playDead() {
        this._alive = false;
        if (this._sprite && this.deadFrame) {
            this._sprite.spriteFrame = this.deadFrame;
        }
    }
}
