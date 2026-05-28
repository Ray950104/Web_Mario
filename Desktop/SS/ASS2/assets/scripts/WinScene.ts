const { ccclass, property } = cc._decorator;

@ccclass
export default class WinScene extends cc.Component {

    @property(cc.Label) scoreLabel: cc.Label = null;
    @property(cc.Button) nextBtn: cc.Button = null;
    @property(cc.Button) menuBtn: cc.Button = null;
    @property(cc.EditBox) nameInput: cc.EditBox = null;
    @property(cc.Button) submitBtn: cc.Button = null;
    @property(cc.Label) submitMsg: cc.Label = null;
    @property(cc.Button) leaderboardBtn: cc.Button = null;
    @property(cc.Node) leaderboardPanel: cc.Node = null;
    @property(cc.Label) boardLabel: cc.Label = null;
    @property(cc.Button) closeBoardBtn: cc.Button = null;
    @property nextSceneName: string = "Level1";

    private _score: number = 0;

    onLoad() {
        const gm = cc.find("GameManagerNode");
        if (gm) {
            const gmScript = gm.getComponent("GameManager");
            if (gmScript) {
                this._score = gmScript.score;
                if (this.scoreLabel) this.scoreLabel.string = "SCORE: " + this._score;
            }
        }

        if (this.nextBtn) this.nextBtn.node.on('click', this.onNext, this);
        if (this.menuBtn) this.menuBtn.node.on('click', this.onMenu, this);
        if (this.submitBtn) this.submitBtn.node.on('click', this.onSubmitScore, this);
        if (this.leaderboardBtn) this.leaderboardBtn.node.on('click', this.onShowBoard, this);
        if (this.closeBoardBtn) this.closeBoardBtn.node.on('click', this.onCloseBoard, this);

        if (this.leaderboardPanel) this.leaderboardPanel.active = false;
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
        if (scores.length > 10) scores.length = 10;

        cc.sys.localStorage.setItem("leaderboard", JSON.stringify(scores));

        if (this.submitMsg) this.submitMsg.string = "Score submitted!";
        if (this.submitBtn) this.submitBtn.interactable = false;
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
        cc.log("=== leaderboard data:", data);
        
        let scores = [];
        if (data) {
            try { scores = JSON.parse(data); } catch (e) { scores = []; }
        }
        if (scores.length === 0) {
            this.boardLabel.string = "No scores yet!";
            return;
        }
        let text = "";
        scores.forEach((entry, i) => {
            text += (i + 1) + ". " + entry.name + " - " + entry.score + "\n";
        });
        this.boardLabel.string = text;
    }

    onNext() { cc.director.loadScene(this.nextSceneName); }

    onMenu() {
        const gm = cc.find("GameManagerNode");
        if (gm) {
            const gmScript = gm.getComponent("GameManager");
            if (gmScript) gmScript.resetGame();
        }
        cc.director.loadScene("MenuScene");
    }
}