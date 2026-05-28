const { ccclass, property } = cc._decorator;

@ccclass
export default class GameOverScene extends cc.Component {

    @property(cc.Label) scoreLabel: cc.Label = null;
    @property(cc.Button) retryBtn: cc.Button = null;
    @property(cc.Button) nextBtn: cc.Button = null;
    @property(cc.EditBox) nameInput: cc.EditBox = null;
    @property(cc.Button) submitBtn: cc.Button = null;
    @property(cc.Label) submitMsg: cc.Label = null;
    @property(cc.Button) leaderboardBtn: cc.Button = null;
    @property(cc.Node) leaderboardPanel: cc.Node = null;
    @property(cc.Label) boardLabel: cc.Label = null;
    @property(cc.Button) closeBoardBtn: cc.Button = null;

    private _score: number = 0;

    onLoad() {
        if (this.leaderboardPanel) this.leaderboardPanel.active = false;

        const gm = cc.find("GameManagerNode");
        if (gm) {
            const gmScript = gm.getComponent("GameManager");
            if (gmScript) {
                this._score = gmScript.score;
            }
        }

        if (this.scoreLabel) {
            this.scoreLabel.string = "SCORE: " + this._score;
        }

        if (this.retryBtn) this.retryBtn.node.on('click', this.onRetry, this);
        if (this.nextBtn) this.nextBtn.node.on('click', this.onNext, this);
        if (this.submitBtn) this.submitBtn.node.on('click', this.onSubmitScore, this);
        if (this.leaderboardBtn) this.leaderboardBtn.node.on('click', this.onShowBoard, this);
        if (this.closeBoardBtn) this.closeBoardBtn.node.on('click', this.onCloseBoard, this);
    }

    onNext() {
        const gm = cc.find("GameManagerNode");
        if (gm) {
            const gmScript = gm.getComponent("GameManager");
            if (gmScript) gmScript.resetGame();
        }
        cc.director.loadScene("Level1");
    }

    onRetry() {
        const gm = cc.find("GameManagerNode");
        if (gm) {
            const gmScript = gm.getComponent("GameManager");
            if (gmScript) gmScript.resetGame();
        }
        cc.director.loadScene("MenuScene");
    }

    onSubmitScore() {
        if (!this.nameInput) return;
        const name = this.nameInput.string.trim();
        if (name === "") return;

        let scores = [];
        const data = cc.sys.localStorage.getItem("leaderboard");
        if (data) {
            try { scores = JSON.parse(data); } catch (e) { scores = []; }
        }

        scores.push({ name: name, score: this._score });
        scores.sort((a, b) => b.score - a.score);
        if (scores.length > 5) scores.length = 5;

        cc.sys.localStorage.setItem("leaderboard", JSON.stringify(scores));

        if (this.submitMsg) this.submitMsg.string = "Score submitted!";
        if (this.submitBtn) this.submitBtn.node.active = false;
        if (this.nameInput) this.nameInput.node.active = false;

        this.updateBoard();
    }

    onShowBoard() {
        if (this.leaderboardPanel) this.leaderboardPanel.active = true;
        this.updateBoard();
    }

    onCloseBoard() {
        if (this.leaderboardPanel) this.leaderboardPanel.active = false;
    }

    private updateBoard() {
        if (!this.boardLabel) return;
        const data = cc.sys.localStorage.getItem("leaderboard");
        let scores = [];
        if (data) {
            try { scores = JSON.parse(data); } catch (e) { scores = []; }
        }
        const top5 = scores.slice(0, 5);
        if (top5.length === 0) {
            this.boardLabel.string = "No scores yet!";
            return;
        }
        let text = "";
        top5.forEach((entry, i) => {
            text += (i + 1) + ". " + entry.name + " - " + entry.score + "\n";
        });
        this.boardLabel.string = text;
    }
}