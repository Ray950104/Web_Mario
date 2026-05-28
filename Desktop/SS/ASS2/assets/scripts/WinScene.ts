const { ccclass, property } = cc._decorator;

@ccclass
export default class WinScene extends cc.Component {

    @property(cc.Label) scoreLabel: cc.Label = null;
    @property(cc.Button) nextBtn: cc.Button = null;
    @property(cc.Button) menuBtn: cc.Button = null;
    @property nextSceneName: string = "Level1";

    onLoad() {
        const gm = cc.find("GameManagerNode");
        if (gm && this.scoreLabel) {
            const gmScript = gm.getComponent("GameManager");
            if (gmScript) {
                this.scoreLabel.string = "SCORE: " + gmScript.score;
            }
        }

        if (this.nextBtn) this.nextBtn.node.on('click', this.onNext, this);
        if (this.menuBtn) this.menuBtn.node.on('click', this.onMenu, this);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    private onKeyDown(e: cc.Event.EventKeyboard) {
        if (e.keyCode === cc.macro.KEY.enter) this.onNext();
    }

    onNext() {
        cc.director.loadScene(this.nextSceneName);
    }

    onMenu() {
        const gm = cc.find("GameManagerNode");
        if (gm) {
            const gmScript = gm.getComponent("GameManager");
            if (gmScript) gmScript.resetGame();
        }
        cc.director.loadScene("MenuScene");
    }
}