const { ccclass, property } = cc._decorator;

@ccclass
export default class MenuScene extends cc.Component {

    @property(cc.Button) startBtn: cc.Button = null;
    @property(cc.Button) levelSelectBtn: cc.Button = null;

    onLoad() {
        const pm = cc.director.getPhysicsManager();
        pm.enabled = true;
        pm.gravity = cc.v2(0, -960);

        if (this.startBtn) {
            this.startBtn.node.on('click', this.onStartGame, this);
        }
        if (this.levelSelectBtn) {
            this.levelSelectBtn.node.on('click', this.onLevelSelect, this);
        }

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    private onKeyDown(event: cc.Event.EventKeyboard) {
        if (event.keyCode === cc.macro.KEY.enter) {
            this.onStartGame();
        }
    }

    onStartGame() {
        cc.audioEngine.stopMusic();
        cc.director.loadScene("Level1");
    }
    onLevelSelect() {
        cc.director.loadScene("LevelSelectScene");
    }
}``