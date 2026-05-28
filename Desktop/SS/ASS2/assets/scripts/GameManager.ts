import AudioManager from "./AudioManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    static instance: GameManager = null;

    @property score: number = 0;
    @property lives: number = 3;
    @property coins: number = 0;
    @property gameTime: number = 300;

    private _timer: number = 0;
    private _isPlaying: boolean = false;

    private getAudio(): any {
        if (AudioManager.instance) return AudioManager.instance;
        let node = cc.find("Canvas/AudioManagerNode");
        if (!node) node = cc.find("AudioManagerNode");
        if (node) return node.getComponent("AudioManager");
        return null;
    }

    onLoad() {
        if (GameManager.instance && GameManager.instance !== this) {
            this.node.destroy();
            return;
        }
        GameManager.instance = this;
        cc.game.addPersistRootNode(this.node);

        const pm = cc.director.getPhysicsManager();
        pm.enabled = true;
        pm.gravity = cc.v2(0, -960);
    }

    start() {
        this._timer = this.gameTime;
    }

    update(dt: number) {
        if (!this._isPlaying) return;
        this._timer -= dt;
        if (this._timer <= 0) {
            this._timer = 0;
            this.onTimeUp();
        }
    }

    addScore(value: number) { this.score += value; }

    addCoin() {
        this.coins++;
        this.score += 200;
    }

    loseLife() {
        this.lives--;

        const audio = this.getAudio();
        if (audio) {
            audio.stopBGM();
            this.scheduleOnce(() => {
                audio.playDie();
            }, 0.1);
        }

        if (this.lives <= 0) {
            this.scheduleOnce(() => {
                if (audio) audio.playGameover();
            }, 0.5);
            this.scheduleOnce(() => {
                cc.director.loadScene("GameOverScene");
            }, 3);
        } else {
            this.scheduleOnce(() => {
                cc.director.loadScene(cc.director.getScene().name);
            }, 2);
        }
    }

    resetGame() {
        this.score = 0;
        this.lives = 3;
        this.coins = 0;
        this._timer = this.gameTime;
        this._isPlaying = false;
    }

    startTimer() {
        this._timer = this.gameTime;
        this._isPlaying = true;
    }

    stopTimer() { this._isPlaying = false; }

    getTimeLeft(): number { return Math.ceil(this._timer); }

    private onTimeUp() {
        this._isPlaying = false;
        const player = cc.find("Canvas/Player");
        if (player) {
            const ps = player.getComponent("Player");
            if (ps) ps.die();
        }
    }
}