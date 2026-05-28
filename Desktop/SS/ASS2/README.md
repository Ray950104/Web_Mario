# Assignment 02 - Web Mario

**Course:** CS2410 Software Studio, National Tsing Hua University  
**Student ID:** 113062336  
**Firebase URL:** https://web-mario-113062336.web.app

---

## How to Play

| Key | Action |
|-----|--------|
| ← → or A D | Move left / right |
| ↑ or W or Space | Jump |
| Enter | Confirm in menu |

---

## Completed Items

### Complete Game Process (5%)
- **Start Menu:** Main menu with START GAME, LEVEL SELECT, and LEADERBOARD buttons.
- **Level Select:** Level selection scene to choose different levels.
- **Game View:** Game starts with a READY? → 3 → 2 → 1 → GO! countdown. Game over screen shown when all lives are lost. Win screen shown when reaching the flag.

### Basic Rules (50%)

#### World Map (10%)
- Physics system with gravity and collision using Box2D (RigidBody + PhysicsBoxCollider).
- Camera follows player horizontally with smooth lerp (CameraFollow.ts).
- Parallax scrolling background for depth effect (ParallaxBackground.ts).
- 1 complete world map with varied terrain.

#### Level Design (5%)
- Static walls: ground tiles, brick blocks, pipes as static RigidBody obstacles.
- Question blocks that interact with the player when hit from below.
- Gaps/pits in the ground that the player can fall into.
- Staircase leading to the end flag.

#### Player (15%)
- Player has correct physics properties (Dynamic RigidBody, gravity, collision).
- Keyboard control: arrow keys / WASD for movement, up / W / space for jump.
- Player gets hurt when touching enemies (loses big state or dies).
- Player loses a life when falling out of bounds (y < -500).
- Player respawns at initial position after death (scene reload).
- Player becomes big when collecting super mushroom, returns to small when hurt.
- Invincibility frames after getting hurt (blinking effect).

#### Enemies (15%)
- 3 types of enemies, all with correct physics properties:
  1. **Goomba** - Basic enemy that patrols left and right, turns at walls and cliffs.
  2. **Flying Goomba** - Flies in a sine-wave pattern within a set horizontal boundary.
  3. **Chasing Goomba** - Patrols normally, then rushes toward the player when detected. Requires 2 stomps to kill. Turns red when chasing, yellow when damaged. Plays angry sound effect when chasing.
- All enemies can only be killed by stomping on their heads.
- Enemies turn around when hitting walls, pipes, or other enemies.

#### Question Blocks (5%)
- Question blocks spawn coins (with coin animation) or super mushrooms when hit from below.
- Super mushroom makes Mario bigger.
- Block changes to used appearance (dark block) after being hit.

### Animations (10%)
- **Player animations (5%):** Walk animation, jump frame, idle frame, dead frame. Separate animations for small and big Mario.
- **Enemy animations (5%):** Walk animation for Goomba (2 frames), dead frame when stomped. Applied to all 3 enemy types via EnemyAnimator.

### Sound Effects (10%)
- **BGM (2%):** Background music plays during gameplay (bgm_1).
- **Jump & Die (3%):** Jump sound effect, death sound effect.
- **Additional sound effects (5%):**
  1. Stomp - when stomping on enemies
  2. Coin - when collecting coins from question blocks
  3. PowerUp - when collecting super mushroom
  4. BlockHit - when hitting question blocks from below
  5. Charging goomba sound effect when it is angry
- All sound effects play without stopping BGM (using playEffect separate from playMusic).
- Chasing Goomba plays custom angry sound effect when in chase mode.

### UI (10%)
- **Player life (3%):** Lives counter displayed on screen.
- **Player score (5%):** Score displayed and updated in real-time when collecting coins or stomping enemies.
- **Timer (2%):** Countdown timer from 300, turns red when below 60 seconds.
- UI stays fixed on screen (attached to camera node).

### Appearance (10%)
- Sprite sheet assets provided by TA (tiles, items, player, enemies).
- Parallax scrolling background.
- Menu screens with styled buttons (blue/orange with hover/press states).
- Game start countdown animation (READY? 3 2 1 GO!).
- Chasing Goomba color changes (white to red when chasing, yellow when damaged).

---

## Bonus Features

### Leaderboard (5%)
- Local leaderboard system using localStorage.
- Top 5 scores displayed.
- Name input and score submission available on Win and Game Over screens.
- Leaderboard viewable from Menu, Win, and Game Over scenes.

### Firebase (5%)
- Deployed to Firebase Hosting.
- URL: https://web-mario-113062336.web.app

---

## Project Structure

```
assets/
  scripts/            All TypeScript game scripts
    Player.ts             Player control and physics
    PlayerAnimator.ts     Player sprite animations
    Enemy.ts              Basic Goomba enemy
    EnemyAnimator.ts      Enemy sprite animations
    FlyingGoomba.ts       Flying enemy variant
    ChasingGoomba.ts      Chasing enemy variant
    GameManager.ts        Global game state management
    AudioManager.ts       Sound effects and BGM
    CameraFollow.ts       Camera follow player
    ParallaxBackground.ts Parallax scrolling
    QuestionBlock.ts      Question block interaction
    Mushroom.ts           Super mushroom power-up
    UIManager.ts          HUD display
    GameStart.ts          Game start countdown
    MenuScene.ts          Main menu
    LevelSelect.ts        Level selection
    WinScene.ts           Win screen
    GameOverScene.ts      Game over screen
    Leaderboard.ts        Leaderboard display
  audio/              Sound effects and BGM
  sprites/            Sprite sheets (player, enemies, tiles, items)
  pictures/           UI images (buttons, backgrounds, icons)
  prefabs/            Prefab templates (Mushroom)
  scenes/             Game scenes
    MenuScene
    LevelSelectScene
    Level1
    WinScene
    GameOverScene
```

---

## AI Usage

See AI_reference.pdf in the project root directory for details on AI tool usage during development.
