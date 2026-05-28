import GameManager from "./GameManager";
const { ccclass, property } = cc._decorator;

@ccclass
export default class QuestionBlock extends cc.Component {

    @property({ type: cc.Enum({ coin: 0, mushroom: 1 }) })
    content: number = 0;

    @property(cc.Prefab) mushroomPrefab: cc.Prefab = null;
    @property(cc.SpriteFrame) usedFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) coinFrame: cc.SpriteFrame = null;

    private _used: boolean = false;
    private _sprite: cc.Sprite = null;

    onLoad() {
        this._sprite = this.getComponentInChildren(cc.Sprite);
        const rb = this.getComponent(cc.RigidBody);
        if (rb) rb.enabledContactListener = true;
    }

    onBeginContact(contact: cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider) {
        if (this._used) return;
        if (other.node.group !== "player") return;

        const playerNode = other.node;
        const playerRb = playerNode.getComponent(cc.RigidBody);
        if (playerNode.y < this.node.y && playerRb && playerRb.linearVelocity.y > 0) {
            this.activate();
        }
    }

    activate() {
        if (this._used) return;
        this._used = true;
    
        if (this._sprite && this.usedFrame) {
            this._sprite.spriteFrame = this.usedFrame;
        }
    
        // 播磚塊音效
        let audioNode = cc.find("Canvas/AudioManagerNode");
        if (!audioNode) audioNode = cc.find("AudioManagerNode");
        if (audioNode) {
            const audio = audioNode.getComponent("AudioManager");
            if (audio) audio.playBlockHit();
        }
    
        const oy = this.node.y;
        cc.tween(this.node)
            .to(0.08, { y: oy + 12 })
            .to(0.08, { y: oy })
            .start();
    
        if (this.content === 0) {
            this.spawnCoin();
        } else {
            this.spawnMushroom();
        }
    }
    private spawnCoin() {
        const coin = new cc.Node("CoinFX");
        const sprite = coin.addComponent(cc.Sprite);
    
        if (this.coinFrame) {
            sprite.spriteFrame = this.coinFrame;
        }
        coin.color = cc.Color.YELLOW;
        coin.setContentSize(16, 16);
        coin.parent = this.node.parent;
        coin.setPosition(this.node.x, this.node.y + 30);
    
        cc.tween(coin)
            .to(0.3, { y: coin.y + 80 }, { easing: 'quadOut' })
            .to(0.2, { opacity: 0 })
            .call(() => coin.destroy())
            .start();
    
        // 播音效
        let audioNode = cc.find("Canvas/AudioManagerNode");
        if (!audioNode) audioNode = cc.find("AudioManagerNode");
        if (audioNode) {
            const audio = audioNode.getComponent("AudioManager");
            if (audio) audio.playCoin();
        }
    
        // 加分
        if (GameManager.instance) {
            GameManager.instance.addCoin();
        }
    }

    private spawnMushroom() {
        if (!this.mushroomPrefab) {
            this.spawnCoin();
            return;
        }
        const mush = cc.instantiate(this.mushroomPrefab);
        mush.parent = this.node.parent;
        // 用世界座標轉換確保位置正確
        const worldPos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        const localPos = this.node.parent.convertToNodeSpaceAR(worldPos);
        mush.setPosition(localPos.x, localPos.y + 30);
    }
    
}