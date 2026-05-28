# 素材對應掛載指南

> 所有 SpriteFrame 都在藍色圖集資料夾裡，點開藍色資料夾就能看到編號的小圖。
> 拖的時候要拖**藍色資料夾裡面的小圖**，不是外面的預覽圖。

---

## 1. PlayerAnimator 素材對應

選中 **Player** 節點，找到 PlayerAnimator 腳本的屬性面板：

### 小 Mario（mario_small 圖集，0~35）

你需要先在 Cocos Creator 裡點開 `player/mario_small`（藍色資料夾），看裡面的圖。
一般 Mario 的 Sprite Sheet 排列規律如下（實際請看圖確認）：

| 屬性欄位 | 拖入的 SpriteFrame | 說明 |
|---------|-------------------|------|
| `Small Idle` | `mario_small_0` | 待機（站立） |
| `Small Jump` | `mario_small_5` | 跳躍（通常是雙手張開的那張） |
| `Small Walk` 陣列 | `mario_small_1`, `mario_small_2`, `mario_small_3` | 走路動畫（3幀循環） |
| `Dead Frame` | `mario_small_4` | 死亡（通常是翻過來的那張） |

**操作方式（陣列欄位）：**
1. 找到 `Small Walk` 欄位，旁邊顯示 `[0]`
2. 點右邊的 `+` 號，會多出一個空位
3. 把 `mario_small_1` 從資源管理器拖進去
4. 再點 `+`，拖入 `mario_small_2`
5. 再點 `+`，拖入 `mario_small_3`

### 大 Mario（mario_big 圖集，0~44）

| 屬性欄位 | 拖入的 SpriteFrame | 說明 |
|---------|-------------------|------|
| `Big Idle` | `mario_big_0` | 大 Mario 待機 |
| `Big Jump` | `mario_big_5` | 大 Mario 跳躍 |
| `Big Walk` 陣列 | `mario_big_1`, `mario_big_2`, `mario_big_3` | 大 Mario 走路（3幀）|

> **注意：** 上面的編號是估計值。請你展開圖集後看一下每張圖長什麼樣子：
> - 站著不動的 → Idle
> - 腳一前一後交替的 → Walk（通常連續2~3張）
> - 雙腳離地/手舉起的 → Jump
> - 翻倒/X眼的 → Dead
>
> 如果編號不對，換成正確的那張就好。

---

## 2. EnemyAnimator 素材對應

### Goomba（Goomba 圖集，0~4）

選中 **Goomba** 敵人節點，找到 EnemyAnimator 的屬性面板：

| 屬性欄位 | 拖入的 SpriteFrame | 說明 |
|---------|-------------------|------|
| `Walk Frames` 陣列 | `Goomba_0`, `Goomba_1` | 走路動畫（2幀交替） |
| `Dead Frame` | `Goomba_2`（通常是被踩扁的那張） | 被踩死 |

Goomba 的 GoombaSprite 子節點 → Sprite 的 `Sprite Frame` 預設拖入 `Goomba_0`

### Turtle（如果你要加第二種敵人）

| 屬性欄位 | 拖入的 SpriteFrame |
|---------|-------------------|
| `Walk Frames` 陣列 | `turtle_0`, `turtle_1` |
| `Dead Frame` | `turtle_2` 或 `turtle_3`（龜殼的那張） |

### Flower（如果要加食人花）

Flower 只有 0~1 兩幀，可做簡單的張合動畫。這個通常固定在水管上不會移動，需要另外的腳本，算進階功能。

---

## 3. AudioManager 音效對應

選中 **AudioManager** 節點：

| 屬性欄位 | 拖入音效檔 |
|---------|-----------|
| `Bgm Clip` | `audio/bgm_1` |
| `Jump Clip` | `audio/jump` |
| `Stomp Clip` | `audio/stomp` |
| `Coin Clip` | `audio/coin` |
| `Powerup Clip` | `audio/PowerUp` |
| `Hurt Clip` | `audio/powerDown` |
| `Die Clip` | `audio/loseOneLife` |
| `Block Hit Clip` | `audio/kick` |
| `Gameover Clip` | `audio/Game Over` |

---

## 4. Tiles 圖集對應（地圖元件）

展開 `effects_UI_tiles/tiles`（藍色資料夾），裡面的小圖用於：

| 用途 | 怎麼找 |
|------|-------|
| 地面磚塊 | 看起來像棕色/橙色方塊的那張 |
| 問號磚塊（未使用） | 金色帶 `?` 的那張 |
| 問號磚塊（已使用） | 灰色/暗色方塊 → 拖到 QuestionBlock 的 `Used Frame` |
| 水管頂部 | 綠色管子上半部 |
| 水管身體 | 綠色管子下半部 |

地面、磚塊、水管的 Sprite 節點 → 把對應的小圖拖到 `Sprite Frame` 欄位。

---

## 5. Items 圖集對應（道具）

展開 `effects_UI_tiles/items`（藍色資料夾）：

| 用途 | 說明 |
|------|------|
| 蘑菇圖片 | 拖到 Mushroom Prefab 的 MushroomSprite → Sprite Frame |
| 金幣圖片 | 可以拖到 QuestionBlock 做金幣飛出的效果 |

---

## 6. Pictures 對應

| 檔案 | 拖到哪裡 |
|------|---------|
| `menu_bg.png` | MenuScene → Background → Sprite Frame |
| `title_0.png` | MenuScene → 標題圖（可用 Sprite 節點取代 Label） |
| `flag.png` | Level1 → Map → Flag → Sprite Frame |
| `life.png` | UI → LivesLabel 旁邊加一個 Sprite 節點放這張 |
| `timer.png` | UI → TimerLabel 旁邊加一個 Sprite 節點放這張 |
| `button_blue.png` | 所有 Button → Normal Sprite |
| `button_blue_hover.png` | Button → Hover Sprite |
| `button_blue_press.png` | Button → Pressed Sprite |

### Button 圖片怎麼拖

選中任何一個 Button 節點（例如 StartBtn），屬性面板的 Button 組件：

```
┌────────────────────────────────────────┐
│ Button 組件                              │
│                                          │
│ Transition: SPRITE  ← 改成 SPRITE        │
│                                          │
│ Normal Sprite:  [拖入 button_blue.png]    │
│ Pressed Sprite: [拖入 button_blue_press.png] │
│ Hover Sprite:   [拖入 button_blue_hover.png] │
│ Disabled Sprite:[拖入 button_gray.png]    │
└────────────────────────────────────────┘
```

**注意：** Button 的 `Transition` 預設是 `NONE`，要先改成 `SPRITE` 才會出現圖片欄位。

---

## 7. 快速對照總表

```
player/mario_small (藍色資料夾)
 ├── mario_small_0  →  PlayerAnimator.Small Idle + PlayerSprite 預設圖
 ├── mario_small_1  →  PlayerAnimator.Small Walk[0]
 ├── mario_small_2  →  PlayerAnimator.Small Walk[1]
 ├── mario_small_3  →  PlayerAnimator.Small Walk[2]
 ├── mario_small_4  →  PlayerAnimator.Dead Frame
 └── mario_small_5  →  PlayerAnimator.Small Jump

player/mario_big (藍色資料夾)
 ├── mario_big_0    →  PlayerAnimator.Big Idle
 ├── mario_big_1    →  PlayerAnimator.Big Walk[0]
 ├── mario_big_2    →  PlayerAnimator.Big Walk[1]
 ├── mario_big_3    →  PlayerAnimator.Big Walk[2]
 └── mario_big_5    →  PlayerAnimator.Big Jump

enemies/Goomba (藍色資料夾)
 ├── Goomba_0       →  EnemyAnimator.Walk Frames[0] + GoombaSprite 預設圖
 ├── Goomba_1       →  EnemyAnimator.Walk Frames[1]
 └── Goomba_2       →  EnemyAnimator.Dead Frame

audio/
 ├── bgm_1          →  AudioManager.Bgm Clip
 ├── jump           →  AudioManager.Jump Clip
 ├── stomp          →  AudioManager.Stomp Clip
 ├── coin           →  AudioManager.Coin Clip
 ├── PowerUp        →  AudioManager.Powerup Clip
 ├── powerDown      →  AudioManager.Hurt Clip
 ├── loseOneLife    →  AudioManager.Die Clip
 ├── kick           →  AudioManager.Block Hit Clip
 └── Game Over      →  AudioManager.Gameover Clip

pictures/
 ├── menu_bg.png    →  MenuScene Background
 ├── flag.png       →  Level1 Flag Sprite
 ├── button_blue*   →  所有 Button 的圖片
 ├── life.png       →  UI 生命圖示
 └── timer.png      →  UI 計時圖示
```
