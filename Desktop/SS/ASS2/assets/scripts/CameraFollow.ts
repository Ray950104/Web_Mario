const { ccclass, property } = cc._decorator;

/**
 * CameraFollow - 相機跟隨
 * 掛在 Main Camera 節點上，讓相機跟隨玩家水平移動。
 * 
 * 設置：將 Player 節點拖到 target 欄位
 */
@ccclass
export default class CameraFollow extends cc.Component {

    @property(cc.Node) target: cc.Node = null;

    /** 相機左邊界（世界座標 X） */
    @property minX: number = 0;
    /** 相機右邊界（地圖寬度 - 半螢幕寬） */
    @property maxX: number = 5000;
    /** 相機偏移（玩家在畫面偏左的位置） */
    @property offsetX: number = -150;

    /** 是否平滑跟隨 */
    @property smooth: boolean = true;
    @property smoothSpeed: number = 5;

    lateUpdate(dt: number) {
        if (!this.target) return;

        const targetX = this.target.x + this.offsetX;
        const clampedX = cc.misc.clampf(targetX, this.minX, this.maxX);

        if (this.smooth) {
            this.node.x += (clampedX - this.node.x) * this.smoothSpeed * dt;
        } else {
            this.node.x = clampedX;
        }

        // Y 軸固定不動（橫向捲軸遊戲）
    }
}
