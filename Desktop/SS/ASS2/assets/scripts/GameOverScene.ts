const { ccclass, property } = cc._decorator;

@ccclass
export default class GameOverScene extends cc.Component {

    @property(cc.Label) scoreLabel: cc.Label = null;
    @property(cc.Button) retryBtn: cc.Button = null;

    onLoad() {
        const gm = cc.find("GameManagerNode");
        if (gm && this.scoreLabel) {
            const gmScript = gm.getComponent("GameManager");
            if (gmScript) {
                this.scoreLabel.string = "SCORE: " + gmScript.score;
            }
        }

        if (this.retryBtn) this.retryBtn.node.on('click', this.onRetry, this);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    private onKeyDown(e: cc.Event.EventKeyboard) {
        if (e.keyCode === cc.macro.KEY.enter) this.onRetry();
    }

    onRetry() {
        const gm = cc.find("GameManagerNode");
        if (gm) {
            const gmScript = gm.getComponent("GameManager");
            if (gmScript) gmScript.resetGame();
        }
        cc.director.loadScene("MenuScene");
    }
}