const { ccclass, property } = cc._decorator;

/**
 * LevelSelectScene - 關卡選擇
 * 
 * 場景結構：
 * Canvas
 *   ├── Title (Label - "SELECT WORLD")
 *   ├── Level1Btn (Button + Label - "WORLD 1-1")
 *   ├── Level2Btn (Button + Label - "WORLD 1-2")
 *   └── BackBtn (Button + Label - "BACK")
 */
@ccclass
export default class LevelSelect extends cc.Component {

    @property(cc.Node) level1Btn: cc.Node = null;
    @property(cc.Node) level2Btn: cc.Node = null;
    @property(cc.Node) backBtn: cc.Node = null;

    onLoad() {
        if (this.level1Btn) this.level1Btn.on('click', () => cc.director.loadScene("Level1"), this);
        if (this.level2Btn) this.level2Btn.on('click', () => cc.director.loadScene("Level2"), this);
        if (this.backBtn) this.backBtn.on('click', () => cc.director.loadScene("MenuScene"), this);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    private onKeyDown(event: cc.Event.EventKeyboard) {
        if (event.keyCode === cc.macro.KEY.escape) {
            cc.director.loadScene("MenuScene");
        }
    }
}
