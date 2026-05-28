# 給 Claude Code 的接手說明

## 專案背景
NTHU CS2410 Software Studio 的 Web Mario 作業，使用 Cocos Creator 2.4.8 + TypeScript。
截止日期：2026/05/28 23:59

## 已完成的腳本（在 scripts/ 資料夾中）

| 腳本 | 功能 |
|------|------|
| GameManager.ts | 全域管理：分數、生命、金幣、計時器、場景切換（單例，跨場景持久）|
| Player.ts | 玩家：鍵盤移動跳躍、碰撞處理、受傷/死亡/重生、大小切換 |
| PlayerAnimator.ts | 玩家動畫：走路/跳躍/待機/死亡 SpriteFrame 切換 |
| CameraFollow.ts | 相機水平跟隨玩家 |
| Enemy.ts | 敵人 Goomba：自動巡邏、碰牆反轉、被踩消滅 |
| EnemyAnimator.ts | 敵人走路動畫 |
| QuestionBlock.ts | 問號磚塊：被頂出金幣或蘑菇 |
| Mushroom.ts | 超級蘑菇：自動移動、被吃讓玩家變大 |
| AudioManager.ts | 音效管理：BGM + 各種音效（單例，跨場景持久）|
| ParallaxBackground.ts | 背景視差捲動 |
| MenuScene.ts | 開始選單場景 |
| LevelSelect.ts | 關卡選擇場景 |
| GameOverScene.ts | Game Over 場景 |
| WinScene.ts | 過關場景 |
| UIManager.ts | 遊戲中 HUD：分數/金幣/生命/計時器 |

## 掛載說明
SETUP_GUIDE.md 有極其詳細的節點樹結構、組件設定、屬性拖拽方式。

## 還可以做的事情（如果學生需要）
- Firebase 部署設定（Bonus 5%）
- README.md 作業繳交用的 markdown
- 更多關卡設計
- 修正或擴充現有腳本
