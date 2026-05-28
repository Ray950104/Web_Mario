const { ccclass, property } = cc._decorator;

@ccclass
export default class GameStart extends cc.Component {

    @property(cc.Label) countdownLabel: cc.Label = null;

    onLoad() {
        // 暫停物理
        cc.director.getPhysicsManager().enabled = false;

        if (this.countdownLabel) {
            this.countdownLabel.string = "READY?";
            this.countdownLabel.node.active = true;
        }

        this.schedule(() => {
            this.startCountdown();
        }, 0.5, 0);
    }

    private startCountdown() {
        let count = 3;

        this.schedule(() => {
            if (count > 0) {
                if (this.countdownLabel) this.countdownLabel.string = "" + count;
                count--;
            } else {
                if (this.countdownLabel) this.countdownLabel.string = "GO!";
                
                // 0.5 秒後開始遊戲
                this.scheduleOnce(() => {
                    if (this.countdownLabel) this.countdownLabel.node.active = false;
                    // 啟動物理
                    cc.director.getPhysicsManager().enabled = true;
                    cc.director.getPhysicsManager().gravity = cc.v2(0, -960);
                }, 0.5);
            }
        }, 1, 3);
    }
}