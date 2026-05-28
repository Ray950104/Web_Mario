# Web Mario — Cocos Creator 2.4.8 完整掛載指南

> 本文件說明每一個腳本要掛在哪裡、節點樹怎麼建、屬性怎麼拖、碰撞群組怎麼設。
> 對 Cocos Creator 不熟的話，請一步一步照做。

---

## 目錄

1. [專案初始設定](#1-專案初始設定)
2. [匯入素材與腳本](#2-匯入素材與腳本)
3. [設定碰撞群組](#3-設定碰撞群組)
4. [場景一：MenuScene（開始選單）](#4-場景一menuscene開始選單)
5. [場景二：LevelSelectScene（關卡選擇）](#5-場景二levelselectscene關卡選擇)
6. [場景三：Level1（遊戲關卡）](#6-場景三level1遊戲關卡--重點)
7. [場景四：GameOverScene](#7-場景四gameoverscene)
8. [場景五：WinScene](#8-場景五winscene)
9. [建立 Prefab](#9-建立-prefab)
10. [Build Settings](#10-build-settings)
11. [評分對照表](#11-評分對照表)

---

## 1. 專案初始設定

### 1.1 建立專案
1. 開啟 Cocos Creator 2.4.8
2. 選 `新建專案` → `空白專案`
3. 專案名稱：`WebMario`

### 1.2 開啟物理系統
1. 上方選單：`專案` → `專案設定`
2. 左邊選 `模組設定`
3. 確認 `物理` 有打勾（如果沒有就勾起來）
4. 按 `儲存`

---

## 2. 匯入素材與腳本

### 2.1 資料夾結構
在 `assets/` 下建立以下資料夾（在 Cocos Creator 左下角的「資源管理器」裡右鍵 → 新建資料夾）：

```
assets/
 ├── scripts/       ← 放所有 .ts 腳本檔
 ├── audio/         ← 放音效和 BGM 檔案
 ├── sprites/       ← 放圖片素材
 │   ├── player/    ← Mario 的圖片
 │   ├── enemies/   ← Goomba 等敵人圖片
 │   ├── tiles/     ← 磚塊、地面、水管、問號磚塊圖片
 │   ├── items/     ← 蘑菇、金幣圖片
 │   ├── ui/        ← UI 相關圖片
 │   └── bg/        ← 背景圖片
 ├── prefabs/       ← 放 Prefab
 └── scenes/        ← 放場景檔案
```

### 2.2 匯入腳本
1. 把 `scripts/` 資料夾裡所有 `.ts` 檔案拖進 Cocos Creator 的 `assets/scripts/`
2. 等編譯完成（右下角會顯示進度）

### 2.3 匯入素材
1. 把 TA 給的 `audio/` 資料夾裡的音效檔拖進 `assets/audio/`
2. 把 TA 給的 `player/` 資料夾裡的圖片拖進 `assets/sprites/player/`
3. 依此類推，把所有素材分類放好

### 2.4 切割 Sprite Sheet（如果素材是一整張大圖）
如果 TA 給的圖片是 Sprite Sheet（很多小圖排在一張大圖上）：
1. 在資源管理器點選那張圖片
2. 右邊屬性面板的 `Type` 改為 `Sprite Frame`
3. 點 `Sprite Editor`（上方會出現按鈕）
4. 在 Sprite Editor 裡手動框選每一格，或用 `自動切割`
5. 按 `Apply` 儲存

---

## 3. 設定碰撞群組

**這步很重要！不做的話碰撞不會觸發。**

### 3.1 新增群組
1. 上方選單：`專案` → `專案設定`
2. 左邊選 `分組管理`
3. 你會看到一個表格，預設只有 `default`
4. 點 `新增分組`，依序新增以下群組：

| 索引 | 群組名稱 | 用途 |
|------|---------|------|
| 0 | default | 預設（不用動）|
| 1 | player | 玩家 |
| 2 | ground | 地面、磚塊、水管、問號磚塊 |
| 3 | enemy | 敵人 |
| 4 | item | 道具（蘑菇）|
| 5 | flag | 終點旗幟 |
| 6 | platform | 可站的浮空平台 |

### 3.2 設定碰撞矩陣
在同一個頁面下方有一個碰撞矩陣表格，用打勾來決定誰跟誰會碰撞：

```
           player  ground  enemy  item  flag  platform
player       -       ✓       ✓     ✓     ✓      ✓
ground       ✓       -       ✓     ✓     -      -
enemy        ✓       ✓       ✓     -     -      ✓
item         ✓       ✓       -     -     -      ✓
flag         ✓       -       -     -     -      -
platform     ✓       -       ✓     ✓     -      -
```

意思是：
- player 會跟所有東西碰撞
- ground 會跟 player、enemy、item 碰撞
- enemy 會跟 player、ground、enemy（互相）、platform 碰撞
- item 會跟 player、ground、platform 碰撞
- flag 只跟 player 碰撞

**設好後按 `儲存`。**

---

## 4. 場景一：MenuScene（開始選單）

### 4.1 建立場景
1. 在資源管理器 `assets/scenes/` 右鍵 → `新建` → `Scene`
2. 命名為 `MenuScene`
3. 雙擊打開

### 4.2 節點樹結構

在左邊「層級管理器」中建立以下結構（右鍵 → 建立）：

```
Canvas                          ← 場景自帶，不用建
 ├── Background                 ← 建立方式：右鍵 Canvas → 建立節點 → 建立渲染節點 → Sprite(單色)
 ├── Title                      ← 右鍵 Canvas → 建立節點 → 建立渲染節點 → Label
 ├── StartBtn                   ← 右鍵 Canvas → 建立節點 → 建立 UI 節點 → Button
 ├── LevelSelectBtn             ← 同上，再建一個 Button
 ├── GameManagerNode            ← 右鍵 Canvas → 建立空節點
 └── AudioManagerNode           ← 右鍵 Canvas → 建立空節點
```

### 4.3 設定每個節點

#### Background
- 選中 Background 節點
- 右邊屬性面板的 Sprite 組件 → 把背景圖拖到 `Sprite Frame` 欄位
- 或者不放圖，把節點的 `Color` 設為天藍色 (R:92 G:148 B:252)
- `Size`：跟 Canvas 一樣大（通常 960×640）

#### Title
- 選中 Title 節點
- Label 組件裡：
  - `String`：填 `WEB MARIO`
  - `Font Size`：72
  - `Color`：白色
- Position：(0, 150)（大概在畫面上方）

#### StartBtn
- 選中 StartBtn 節點
- 它會自帶一個 Button 組件和一個子節點 Label
- 點開子節點 Label，把 `String` 改為 `START GAME`，`Font Size` 設 30
- StartBtn 的 Position：(0, -20)

#### LevelSelectBtn
- 同上，Label 改為 `LEVEL SELECT`
- Position：(0, -80)

#### GameManagerNode（重要！）
- 選中 GameManagerNode
- 點 `添加組件` → `自訂腳本` → `GameManager`
- **這個節點會自動跨場景存在，所以只在這個場景建一次就好**

#### AudioManagerNode（重要！）
- 選中 AudioManagerNode
- 點 `添加組件` → `自訂腳本` → `AudioManager`
- 掛上後屬性面板會出現很多音效欄位，把音效檔從資源管理器拖進去：

```
屬性面板顯示：
┌─────────────────────────────────────────┐
│ AudioManager (腳本)                       │
│                                           │
│ Bgm Clip:       [拖入 bgm.mp3]           │
│ Bgm Volume:     0.4                       │
│ Jump Clip:      [拖入 jump.mp3]           │
│ Stomp Clip:     [拖入 stomp.mp3]          │
│ Coin Clip:      [拖入 coin.mp3]           │
│ Powerup Clip:   [拖入 powerup.mp3]        │
│ Hurt Clip:      [拖入 hurt.mp3]           │
│ Die Clip:       [拖入 die.mp3]            │
│ Block Hit Clip: [拖入 block_hit.mp3]      │
│ Gameover Clip:  [拖入 gameover.mp3]       │
│ Sfx Volume:     0.6                       │
└─────────────────────────────────────────┘
```

- **這個節點也會自動跨場景存在，只建一次**

### 4.4 掛載場景腳本

1. 選中 **Canvas** 節點
2. `添加組件` → `自訂腳本` → `MenuScene`
3. 屬性面板會出現兩個欄位：
   - `Start Btn`：把 StartBtn 節點從層級管理器拖進來
   - `Level Select Btn`：把 LevelSelectBtn 節點拖進來

### 4.5 儲存場景
按 `Ctrl+S`（Mac: `Cmd+S`）儲存。

---

## 5. 場景二：LevelSelectScene（關卡選擇）

### 5.1 建立場景
資源管理器 → `assets/scenes/` → 右鍵 → 新建 Scene → 命名 `LevelSelectScene`

### 5.2 節點樹

```
Canvas
 ├── Background                 ← Sprite 或純色背景
 ├── Title                      ← Label: "SELECT WORLD", fontSize=48
 ├── Level1Btn                  ← Button, 子 Label: "WORLD 1-1"
 ├── Level2Btn                  ← Button, 子 Label: "WORLD 1-2"
 └── BackBtn                    ← Button, 子 Label: "BACK"
```

### 5.3 掛載腳本
- 選中 **Canvas**
- `添加組件` → `自訂腳本` → `LevelSelect`
- 把三個 Button 節點拖到對應欄位：
  - `Level 1 Btn` ← Level1Btn
  - `Level 2 Btn` ← Level2Btn
  - `Back Btn` ← BackBtn

---

## 6. 場景三：Level1（遊戲關卡）← 重點！

**這是最複雜的場景，請仔細看。**

### 6.1 建立場景
新建 Scene → 命名 `Level1`

### 6.2 完整節點樹

```
Canvas (960×640)
 │
 ├── Main Camera                    ← 場景自帶的相機
 │    └── 掛 CameraFollow.ts
 │
 ├── Background                     ← 背景圖（最遠的那層）
 │    ├── Sprite 組件
 │    └── 掛 ParallaxBackground.ts
 │
 ├── Map                            ← 空節點，當作地圖容器
 │    │
 │    ├── GroundTiles               ← 空節點，放地面磚塊
 │    │    ├── Ground_1             ← Sprite + RigidBody(Static) + PhysicsBoxCollider
 │    │    ├── Ground_2
 │    │    └── ... (很多地面節點)
 │    │
 │    ├── Bricks                    ← 空節點，放普通磚塊
 │    │    ├── Brick_1              ← Sprite + RigidBody(Static) + PhysicsBoxCollider
 │    │    └── ...
 │    │
 │    ├── QuestionBlocks            ← 空節點，放問號磚塊
 │    │    ├── QBlock_1             ← Sprite + RigidBody(Static) + PhysicsBoxCollider + QuestionBlock.ts
 │    │    └── ...
 │    │
 │    ├── Pipes                     ← 空節點，放水管
 │    │    ├── Pipe_1               ← Sprite + RigidBody(Static) + PhysicsBoxCollider
 │    │    └── ...
 │    │
 │    └── Flag                      ← Sprite + RigidBody(Static) + PhysicsBoxCollider(Sensor=true)
 │         └── group = "flag"
 │
 ├── Player                         ← 空節點
 │    ├── 掛 Player.ts
 │    ├── 掛 PlayerAnimator.ts
 │    ├── 掛 RigidBody
 │    ├── 掛 PhysicsBoxCollider
 │    ├── group = "player"
 │    └── PlayerSprite              ← 子節點 Sprite，顯示 Mario 圖片
 │
 ├── Enemies                        ← 空節點，放敵人
 │    ├── Goomba_1                  ← 空節點
 │    │    ├── 掛 Enemy.ts
 │    │    ├── 掛 EnemyAnimator.ts
 │    │    ├── 掛 RigidBody
 │    │    ├── 掛 PhysicsBoxCollider
 │    │    ├── group = "enemy"
 │    │    └── GoombaSprite         ← 子節點 Sprite
 │    ├── Goomba_2
 │    └── ...
 │
 └── UI                             ← 空節點（掛 UIManager.ts）
      ├── Widget 組件（讓它固定在螢幕上）
      ├── ScoreLabel                ← Label, 左上角
      ├── CoinLabel                 ← Label, 中上
      ├── LivesLabel                ← Label, 左下角
      └── TimerLabel                ← Label, 右上角
```

### 6.3 建立地面（最重要的一步）

地面是由很多個磚塊節點拼起來的。

#### 方法 A：一個大長條（簡單但粗糙）
1. 在 Map 下建立空節點 `Ground`
2. 加 `Sprite` 組件 → 拖入地面磚塊圖片（或用 Tiled 模式讓它平鋪）
3. 設 Size 為 (4800, 80)（寬4800像素、高80像素，你可以自行調整）
4. Position：(2400, -280) （讓它在畫面底部）
5. 加 `RigidBody` 組件：
   - Type：`Static`
   - 其他不用動
6. 加 `PhysicsBoxCollider` 組件：
   - Size 會自動配合節點大小（如果沒有，手動設跟節點一樣大）
7. 在節點最上方的 `Group` 下拉選單選 `ground`

**中間要留空隙（坑洞）的話，就用多個分開的地面節點，中間留空。**

#### 方法 B：用 Tile Map（進階）
如果你會用 Tiled 編輯器，可以建立 .tmx 地圖檔，再匯入 Cocos Creator。不在本指南範圍內。

### 6.4 建立普通磚塊

1. 在 `Bricks` 下建立空節點 `Brick_1`
2. 加 `Sprite` → 拖入磚塊圖片
3. 設 Size 為 (40, 40)（一般磚塊大小）
4. 加 `RigidBody`：Type = `Static`
5. 加 `PhysicsBoxCollider`
6. Group：`ground`
7. 把它放到你想要的位置（例如 Position: (300, 0)）
8. 複製更多：選中節點 → `Ctrl+D` 複製 → 移到新位置

### 6.5 建立問號磚塊

1. 在 `QuestionBlocks` 下建立空節點 `QBlock_1`
2. 加 `Sprite` → 拖入問號磚塊圖片
3. 設 Size：(40, 40)
4. 加 `RigidBody`：Type = `Static`
5. 加 `PhysicsBoxCollider`
6. Group：`ground`
7. `添加組件` → `自訂腳本` → `QuestionBlock`
8. 屬性面板：

```
┌──────────────────────────────────────────┐
│ QuestionBlock (腳本)                       │
│                                            │
│ Content:        [coin ▼]  ← 下拉選：       │
│                    coin = 頂出金幣          │
│                    mushroom = 頂出蘑菇      │
│ Mushroom Prefab: [拖入 Mushroom Prefab]    │
│ Used Frame:      [拖入用過的磚塊圖片]       │
└──────────────────────────────────────────┘
```

- 如果這個磚塊要頂出金幣：Content 選 `coin`
- 如果要頂出蘑菇：Content 選 `mushroom`，並把 Mushroom Prefab 拖進去
- `Used Frame`：拖入一張「用過的磚塊」圖片（通常是灰色的磚塊）

### 6.6 建立水管

1. 在 `Pipes` 下建立空節點 `Pipe_1`
2. 加 `Sprite` → 拖入水管圖片
3. 設 Size 配合圖片（例如 80×120）
4. 加 `RigidBody`：Type = `Static`
5. 加 `PhysicsBoxCollider`
6. Group：`ground`

### 6.7 建立終點旗幟

1. 在 `Map` 下建立空節點 `Flag`
2. 加 `Sprite` → 拖入旗幟圖片
3. 放在地圖最右邊（例如 Position: (4600, -100)）
4. 加 `RigidBody`：Type = `Static`
5. 加 `PhysicsBoxCollider`：
   - **勾選 `Sensor`** ← 重要！這樣玩家碰到旗幟不會被擋住，只會觸發碰撞事件
6. Group：`flag`

### 6.8 建立 Player 節點

1. 在 Canvas 下建立空節點 `Player`
2. 在 Player 下建立子節點 `PlayerSprite`（右鍵 Player → 建立渲染節點 → Sprite）
3. PlayerSprite 的 Sprite → 拖入 Mario 待機圖片
4. 設 PlayerSprite 的 Size 配合圖片（例如 30×40）

選中 **Player** 節點，依序添加以下組件：

#### a. RigidBody
```
添加組件 → 物理 → RigidBody
┌──────────────────────────┐
│ RigidBody                 │
│ Type: Dynamic      ← 重要 │
│ Fixed Rotation: ✓  ← 打勾 │
│ Gravity Scale: 1          │
│ Linear Damping: 0         │
│ Angular Damping: 0        │
└──────────────────────────┘
```
**Fixed Rotation 一定要勾！** 不然 Mario 碰到東西會旋轉。

#### b. PhysicsBoxCollider
```
添加組件 → 物理 → PhysicsBoxCollider
┌──────────────────────────┐
│ PhysicsBoxCollider        │
│ Size: (28, 38)     ← 比圖片略小，避免卡邊 │
│ Offset: (0, 0)           │
│ Density: 1               │
│ Friction: 0.2            │
│ Restitution: 0           │
└──────────────────────────┘
```

#### c. 設定 Group
在節點屬性面板最上方（名稱旁邊有個 `Group` 下拉選單）選 `player`

#### d. 掛 Player.ts
```
添加組件 → 自訂腳本 → Player
┌──────────────────────────┐
│ Player (腳本)              │
│ Move Speed: 200           │
│ Jump Speed: 550           │
│ Max Speed: 300            │
└──────────────────────────┘
```

#### e. 掛 PlayerAnimator.ts
```
添加組件 → 自訂腳本 → PlayerAnimator
┌──────────────────────────────────────────────┐
│ PlayerAnimator (腳本)                          │
│                                                │
│ Small Idle:  [拖入 Mario 待機圖]                │
│ Small Jump:  [拖入 Mario 跳躍圖]                │
│ Small Walk:  [陣列，點 + 新增，拖入走路圖1, 2, 3] │
│                                                │
│ Big Idle:    [拖入大 Mario 待機圖]               │
│ Big Jump:    [拖入大 Mario 跳躍圖]               │
│ Big Walk:    [陣列，點 + 新增，拖入大走路圖1, 2]   │
│                                                │
│ Dead Frame:  [拖入死亡圖]                        │
│ Walk Anim Interval: 0.1                        │
└──────────────────────────────────────────────┘
```

**陣列欄位的操作：**
- 點欄位旁邊的 `+` 號新增一個位置
- 從資源管理器拖圖片進去
- 再點 `+` 新增下一張
- 一般走路動畫 2~3 張圖就夠

**如果你暫時沒有分好的動畫圖片，可以先只填 Small Idle 一張，其他留空，遊戲也能跑。**

#### f. 設定 Player 位置
Position：(-350, 0) ← 放在地圖左邊起始位置

### 6.9 建立敵人 (Goomba)

1. 在 `Enemies` 下建立空節點 `Goomba_1`
2. 在 Goomba_1 下建立子節點 `GoombaSprite`（Sprite）
3. GoombaSprite → 拖入 Goomba 圖片

選中 **Goomba_1** 節點：

```
添加組件：
1. RigidBody → Type: Dynamic, Fixed Rotation: ✓
2. PhysicsBoxCollider → Size 配合圖片大小 (例如 36×36)
3. 自訂腳本 → Enemy
4. 自訂腳本 → EnemyAnimator

Group: enemy（節點最上方的下拉選單）
```

EnemyAnimator 屬性：
```
┌──────────────────────────────────────┐
│ EnemyAnimator (腳本)                   │
│ Walk Frames: [點 + 拖入走路圖1, 2]     │
│ Dead Frame:  [拖入被踩扁的圖]           │
│ Anim Interval: 0.2                    │
└──────────────────────────────────────┘
```

Position：放在地圖中你想要的位置。
多個敵人就 `Ctrl+D` 複製，移到不同位置。

### 6.10 設定相機 (CameraFollow)

1. 選中 **Main Camera** 節點
2. `添加組件` → `自訂腳本` → `CameraFollow`
3. 屬性：

```
┌──────────────────────────────────────┐
│ CameraFollow (腳本)                    │
│ Target:      [把 Player 節點拖進來]     │
│ Min X:       0                        │
│ Max X:       4000   ← 地圖寬度-480     │
│ Offset X:    -150                     │
│ Smooth:      ✓                        │
│ Smooth Speed: 5                       │
└──────────────────────────────────────┘
```

`Max X` 的值 = 你地圖最右邊的 X 座標 - 480（半個螢幕寬）。
如果你的地圖寬 4800，那 Max X = 4320。

### 6.11 設定背景 (ParallaxBackground)

1. 選中 **Background** 節點
2. `添加組件` → `自訂腳本` → `ParallaxBackground`
3. 屬性：

```
┌──────────────────────────────────────┐
│ ParallaxBackground (腳本)              │
│ Camera Node:    [把 Main Camera 拖進來] │
│ Parallax Ratio: 0.3                   │
└──────────────────────────────────────┘
```

背景圖片要夠寬（比地圖窄一些沒關係，因為它移動得比較慢）。

### 6.12 設定 UI

1. 在 Canvas 下建立空節點 `UI`
2. 加 `Widget` 組件（添加組件 → UI → Widget）：
   - 勾 Top, Bottom, Left, Right 全部
   - 數值都設 0
   - 這樣 UI 會覆蓋整個螢幕
   - **Target** 設為 `Canvas`

3. 在 UI 下建立 4 個 Label 子節點：

#### ScoreLabel
- Position：(-350, 280)（左上角）
- Font Size：22
- String：`000000`
- Color：白色
- Horizontal Align：Left

#### CoinLabel
- Position：(-50, 280)（中上偏左）
- Font Size：22
- String：`× 0`

#### LivesLabel
- Position：(-350, -280)（左下角）
- Font Size：22
- String：`× 3`

#### TimerLabel
- Position：(350, 280)（右上角）
- Font Size：22
- String：`300`
- Horizontal Align：Right

4. 選中 **UI** 節點
5. `添加組件` → `自訂腳本` → `UIManager`
6. 把 4 個 Label 拖進對應欄位：

```
┌──────────────────────────────────────┐
│ UIManager (腳本)                       │
│ Score Label:  [拖入 ScoreLabel]        │
│ Coin Label:   [拖入 CoinLabel]         │
│ Lives Label:  [拖入 LivesLabel]        │
│ Timer Label:  [拖入 TimerLabel]        │
└──────────────────────────────────────┘
```

### 6.13 儲存！
`Ctrl+S` 儲存場景。

---

## 7. 場景四：GameOverScene

新建 Scene → 命名 `GameOverScene`

### 節點樹
```
Canvas
 ├── Background      ← Sprite 或純黑色 (Color: 0,0,0)
 ├── Title           ← Label: "GAME OVER", fontSize=48, Color=白
 ├── ScoreLabel      ← Label: "SCORE: 000000", fontSize=24
 └── RetryBtn        ← Button, 子 Label: "BACK TO MENU"
```

### 掛載
選中 **Canvas**：
- `添加組件` → `自訂腳本` → `GameOverScene`
- `Score Label`：拖入 ScoreLabel
- `Retry Btn`：拖入 RetryBtn

---

## 8. 場景五：WinScene

新建 Scene → 命名 `WinScene`

### 節點樹
```
Canvas
 ├── Background      ← Sprite 或純黑色
 ├── Title           ← Label: "COURSE CLEAR!", fontSize=48, Color=金色(255,215,0)
 ├── ScoreLabel      ← Label: "SCORE: 000000", fontSize=24
 ├── NextBtn         ← Button, 子 Label: "NEXT LEVEL"
 └── MenuBtn         ← Button, 子 Label: "BACK TO MENU"
```

### 掛載
選中 **Canvas**：
- `添加組件` → `自訂腳本` → `WinScene`
- `Score Label`：拖入 ScoreLabel
- `Next Btn`：拖入 NextBtn
- `Menu Btn`：拖入 MenuBtn
- `Next Scene Name`：填 `Level2`（或你下一關的場景名）

---

## 9. 建立 Prefab

### 9.1 Mushroom Prefab

Prefab 就是一個「可重複使用的節點模板」。蘑菇需要做成 Prefab，因為問號磚塊要在執行時動態生成它。

**步驟：**

1. **在任何場景中**（例如 Level1），在層級管理器的 Canvas 下建立空節點 `Mushroom`
2. 在 Mushroom 下建立子節點 `MushroomSprite`（Sprite），拖入蘑菇圖片
3. 選中 **Mushroom** 節點，添加組件：
   - `RigidBody`：Type = Dynamic, Fixed Rotation = ✓
   - `PhysicsBoxCollider`：Size 約 (32, 32)
   - `自訂腳本` → `Mushroom`
4. Group：`item`
5. **從層級管理器把 Mushroom 節點拖到資源管理器的 `assets/prefabs/` 資料夾**
   - 這樣就建立了 Prefab！你會看到 prefabs 資料夾下多了一個藍色圖示的 `Mushroom`
6. **從層級管理器中刪除 Mushroom 節點**（場景裡不需要它，需要時會動態生成）

### 9.2 把 Prefab 拖給 QuestionBlock

1. 選中某個 QuestionBlock 節點（Content = mushroom 的那個）
2. 在屬性面板找到 `Mushroom Prefab` 欄位
3. 從資源管理器的 `assets/prefabs/` 把 `Mushroom` 拖進去

---

## 10. Build Settings

把所有場景加入建構列表：

1. 上方選單：`專案` → `Build Settings`（或 `構建發布`）
2. 在 `場景列表` 中，把以下場景全部加入（點 `添加場景` 或從資源管理器拖入）：

```
1. MenuScene        ← 確保這個在最上面（起始場景）
2. LevelSelectScene
3. Level1
4. Level2（如果有）
5. GameOverScene
6. WinScene
```

3. 起始場景設為 `MenuScene`

---

## 11. 評分對照表

| 評分項目 | 分數 | 實現方式 |
|---------|------|---------|
| **Complete Game Process** | **5%** | |
| 開始選單 | | MenuScene.ts |
| 關卡選擇 | | LevelSelect.ts |
| 遊戲開始/結束 | | GameManager.ts + GameOverScene.ts + WinScene.ts |
| **Basic Rules** | **50%** | |
| 世界物理（重力、碰撞）| 10% | RigidBody + PhysicsBoxCollider 元件 |
| 相機跟隨 | | CameraFollow.ts |
| 至少1張地圖 | | Level1 場景 |
| 靜態牆壁 | 5% | Ground/Brick 節點 (Static RigidBody) |
| 問號磚塊互動 | | QuestionBlock.ts |
| 玩家物理 | 15% | Player.ts (Dynamic RigidBody) |
| 鍵盤控制 | | Player.ts (方向鍵/WASD/空白鍵) |
| 碰敵受傷 | | Player.ts getHurt() |
| 掉出邊界 | | Player.ts (y < -500) |
| 死亡重生 | | GameManager.ts loseLife() |
| 敵人物理 | 15% | Enemy.ts (Dynamic RigidBody) |
| 至少1種敵人 | | Enemy.ts (Goomba) |
| 踩頭消滅 | | Player.ts onBeginContact + Enemy.ts onStomped() |
| 問號磚塊（蘑菇變大）| 5% | QuestionBlock.ts + Mushroom.ts + Player.ts makeBig() |
| **Animations** | **10%** | |
| 玩家走路/跳躍動畫 | 5% | PlayerAnimator.ts |
| 敵人動畫 | 2~5% | EnemyAnimator.ts |
| **Sound Effects** | **10%** | |
| BGM | 2% | AudioManager.ts playBGM() |
| 跳躍/死亡音效 | 3% | AudioManager.ts playJump()/playDie() |
| 額外音效 | 最多5% | 踩敵/金幣/變大/磚塊 各1% |
| **UI** | **10%** | |
| 生命 | 3% | UIManager.ts livesLabel |
| 分數 | 5% | UIManager.ts scoreLabel |
| 計時器 | 2% | UIManager.ts timerLabel |
| **Appearance** | **10%** | |
| 外觀美感 | 主觀 | ParallaxBackground.ts + TA素材 |

---

## 操作方式

| 按鍵 | 動作 |
|------|------|
| ← → 或 A D | 左右移動 |
| ↑ 或 W 或 Space | 跳躍 |
| Enter | 選單確認 |
| ESC | 返回 |

---

## 常見問題

### Q: 碰撞沒有觸發？
1. 檢查兩個節點的 Group 有沒有設對
2. 檢查碰撞矩陣有沒有打勾
3. 確認兩個節點都有 RigidBody 和 PhysicsCollider
4. 確認物理引擎有開（GameManager.ts 裡的 onLoad 會自動開）

### Q: 玩家會旋轉？
RigidBody 的 `Fixed Rotation` 沒有勾。

### Q: 玩家穿過地面？
PhysicsBoxCollider 的 Size 可能沒設好，或 Ground 的 RigidBody Type 不是 Static。

### Q: 場景切換後音樂/分數不見了？
GameManager 和 AudioManager 必須掛在 MenuScene 中，且只能建一次。它們會用 `addPersistRootNode` 自動跨場景保留。

### Q: 怎麼建第二關 Level2？
複製 Level1 場景（在資源管理器選中 Level1.fire → `Ctrl+D`），重新命名為 `Level2`，然後修改裡面的地圖配置。
