const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioManager extends cc.Component {

    static instance: AudioManager = null;

    @property(cc.AudioClip) bgmClip: cc.AudioClip = null;
    @property({ range: [0, 1, 0.1] }) bgmVolume: number = 0.4;

    @property(cc.AudioClip) jumpClip: cc.AudioClip = null;
    @property(cc.AudioClip) stompClip: cc.AudioClip = null;
    @property(cc.AudioClip) coinClip: cc.AudioClip = null;
    @property(cc.AudioClip) powerupClip: cc.AudioClip = null;
    @property(cc.AudioClip) hurtClip: cc.AudioClip = null;
    @property(cc.AudioClip) dieClip: cc.AudioClip = null;
    @property(cc.AudioClip) blockHitClip: cc.AudioClip = null;
    @property(cc.AudioClip) gameoverClip: cc.AudioClip = null;

    @property({ range: [0, 1, 0.1] }) sfxVolume: number = 0.6;

    onLoad() {
        if (AudioManager.instance && AudioManager.instance !== this) {
            this.node.destroy();
            return;
        }
        AudioManager.instance = this;
        cc.game.addPersistRootNode(this.node);
    }

    playBGM() {
        // 如果已經在播就不重複播
        if (cc.audioEngine.isMusicPlaying()) return;
        if (this.bgmClip) {
            cc.audioEngine.playMusic(this.bgmClip, true);
            cc.audioEngine.setMusicVolume(this.bgmVolume);
        }
    }

    stopBGM() { cc.audioEngine.stopMusic(); }
    pauseBGM() { cc.audioEngine.pauseMusic(); }
    resumeBGM() { cc.audioEngine.resumeMusic(); }

    playJump() { this.playSFX(this.jumpClip); }
    playStomp() { this.playSFX(this.stompClip); }
    playCoin() { this.playSFX(this.coinClip); }
    playPowerup() { this.playSFX(this.powerupClip); }
    playHurt() { this.playSFX(this.hurtClip); }
    playDie() { this.playSFX(this.dieClip); }
    playBlockHit() { this.playSFX(this.blockHitClip); }
    playGameover() { this.playSFX(this.gameoverClip); }

    private playSFX(clip: cc.AudioClip) {
        if (clip) {
            cc.audioEngine.playEffect(clip, false);
        }
    }
}
