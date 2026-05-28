const { ccclass, property } = cc._decorator;

/**
 * ParallaxBackground - 視差背景捲動
 * 掛在背景圖節點上，讓背景以較慢速度跟隨相機，產生深度感
 */
@ccclass
export default class ParallaxBackground extends cc.Component {

    /** 要跟隨的相機節點 */
    @property(cc.Node) cameraNode: cc.Node = null;

    /** 視差比例：0=完全不動 0.5=移動一半速度 1=跟相機同速 */
    @property({ range: [0, 1, 0.05] }) parallaxRatio: number = 0.3;

    private _startX: number = 0;
    private _camStartX: number = 0;

    onLoad() {
        this._startX = this.node.x;
        if (this.cameraNode) {
            this._camStartX = this.cameraNode.x;
        }
    }

    lateUpdate(dt: number) {
        if (!this.cameraNode) return;
        const camDelta = this.cameraNode.x - this._camStartX;
        this.node.x = this._startX + camDelta * this.parallaxRatio;
    }
}
