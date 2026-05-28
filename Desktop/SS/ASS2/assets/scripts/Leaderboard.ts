const { ccclass, property } = cc._decorator;

@ccclass
export default class Leaderboard extends cc.Component {

    @property(cc.Label) boardLabel: cc.Label = null;
    @property(cc.Button) closeBtn: cc.Button = null;

    private _scores: { name: string, score: number }[] = [];

    onLoad() {
        this.loadScores();
        this.updateDisplay();

        if (this.closeBtn) this.closeBtn.node.on('click', this.onClose, this);
    }

    show() {
        this.node.active = true;
        this.loadScores();
        this.updateDisplay();
    }

    onClose() {
        this.node.active = false;
    }

    private updateDisplay() {
        if (!this.boardLabel) return;

        if (this._scores.length === 0) {
            this.boardLabel.string = "No scores yet!";
            return;
        }

        let text = "";
        this._scores.forEach((entry, i) => {
            text += (i + 1) + ". " + entry.name + " - " + entry.score + "\n";
        });
        this.boardLabel.string = text;
    }

    private loadScores() {
        const data = cc.sys.localStorage.getItem("leaderboard");
        if (data) {
            try {
                this._scores = JSON.parse(data);
            } catch (e) {
                this._scores = [];
            }
        }
        if (this._scores.length > 5) this._scores.length = 5;
    }
}