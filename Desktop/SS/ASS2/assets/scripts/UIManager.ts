import GameManager from "./GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIManager extends cc.Component {

    @property(cc.Label) scoreLabel: cc.Label = null;
    @property(cc.Label) coinLabel: cc.Label = null;
    @property(cc.Label) livesLabel: cc.Label = null;
    @property(cc.Label) timerLabel: cc.Label = null;

    update(dt: number) {
        if (!GameManager.instance) return;
        const gm = GameManager.instance;

        if (this.scoreLabel) this.scoreLabel.string = String(gm.score).padStart(6, '0');
        if (this.coinLabel) this.coinLabel.string = "× " + gm.coins;
        if (this.livesLabel) this.livesLabel.string = "× " + gm.lives;
        if (this.timerLabel) {
            const time = gm.getTimeLeft();
            this.timerLabel.string = String(time);
            
        }
    }
}