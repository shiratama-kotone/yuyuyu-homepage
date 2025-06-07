const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 400;

// プレイヤー設定
const player = {
  x: 50,
  y: 200,
  width: 30,
  height: 30,
  speed: 5,
  dy: 0,
  jumpPower: -12,
  gravity: 0.5,
  grounded: false,
  state: "small", // 'small', 'big', 'fire'
};

// キー設定
const keys = { right: false, left: false, up: false, shift: false };

// イベントリスナー
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") keys.right = true;
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowUp") keys.up = true;
  if (e.key === "Shift") keys.shift = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowRight") keys.right = false;
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowUp") keys.up = false;
  if (e.key === "Shift") keys.shift = false;
});

// ゲーム時間
let timer = 500; // 500秒スタート
let gameOver = false;

// スクロールオフセット
let scrollOffset = 0;

// コインと火の玉
let coins = [];
let fireballs = [];

// ブロック設定（正方形）
const blocks = [
  { x: 0, y: 350, width: 2000, height: 50 }, // 地面
  { x: 200, y: 300, width: 50, height: 50, type: 'block' }, // ブロック1
  { x: 260, y: 300, width: 50, height: 50, type: 'block' }, // ブロック2
  { x: 320, y: 200, width: 50, height: 50, type: 'block' }, // 高い位置のブロック
  { x: 500, y: 350, width: 50, height: 50, type: 'block' }, // 障害物
  { x: 800, y: 300, width: 50, height: 50, type: 'block' }, // 離れたブロック
];

// ？ブロック設定（きのこや花が出る）
const questionBlocks = [
  { x: 260, y: 250, width: 50, height: 50, type: "question", item: "mushroom" },
  { x: 500, y: 250, width: 50, height: 50, type: "question", item: "flower" },
];

// ゴール設定
const goal = { x: 1800, y: 300, width: 50, height: 100 };

// コイン設定
const coin = { x: 700, y: 250, width: 20, height: 20 };

// プレイヤーがアイテムを取る処理
function handleItemCollisions() {
  questionBlocks.forEach((block) => {
    if (isColliding(player, block)) {
      if (block.item === "mushroom" && player.state === "small") {
        player.state = "big"; // きのこで大きくなる
        block.item = null; // きのこを消す
      } else if (block.item === "flower" && player.state === "big") {
        player.state = "fire"; // 花で火の玉発射可能になる
        block.item = null; // 花を消す
      }
    }
  });
}

// コインを取る処理
function handleCoinCollision() {
  if (isColliding(player, coin)) {
    console.log("コインをゲット！");
    // コインを取ったら表示を消す
    coin.x = -100; // コインを消す（画面外に）
  }
}

// ゲームの進行管理
function updateTimer() {
  if (!gameOver) {
    timer -= 1 / 60; // 1秒間に1フレーム
    if (timer <= 0) {
      gameOver = true;
      alert("ゲームオーバー！時間切れ！");
    }
  }
}

// ゴールに到達したかチェック
function checkGoal() {
  if (isColliding(player, goal)) {
    alert("ゴール！");
    gameOver = true;
  }
}

// 火の玉管理
function handleFireballs() {
  fireballs.forEach((fireball, index) => {
    fireball.x += 5; // 火の玉の進行方向
    // 画面外に出た火の玉を消す
    if (fireball.x > canvas.width) {
      fireballs.splice(index, 1);
    } else {
      ctx.fillStyle = "orange";
      ctx.fillRect(fireball.x, fireball.y, 10, 5);
    }
  });
}

// プレイヤーを動かす処理
function handlePlayerMovement() {
  // プレイヤーの操作
  if (keys.right) player.x += player.speed;
  if (keys.left && player.x > 0) player.x -= player.speed;
  if (keys.up && player.grounded) {
    player.dy = player.jumpPower; // ジャンプ
    player.grounded = false; // 地面から離れる
  }

  // 衝突判定（プレイヤーの動きを決定する前に行う）
  let grounded = false; // 地面に接触したかを管理
  blocks.forEach(block => {
    if (isColliding(player, block)) {
      // プレイヤーの下端がブロックの上端に接触している場合
      if (player.dy > 0 && player.y + player.height <= block.y + block.dy) {
        player.y = block.y - player.height; // 地面に着地
        player.dy = 0; // 垂直速度をリセット
        grounded = true; // 地面に接触した
      }
      // プレイヤーの上端がブロックの下端に接触している場合（天井）
      else if (player.dy < 0 && player.y >= block.y + block.height) {
        player.y = block.y + block.height; // プレイヤーをブロックにぶつけて天井に
        player.dy = 0; // 垂直速度をリセット
      }
    }
  });

  // 地面に接触しているかどうか
  if (grounded) {
    player.grounded = true;
  } else {
    player.grounded = false; // 地面から離れる
  }

  // 重力の処理
  if (!player.grounded) {
    player.dy += player.gravity; // 地面にいないときに重力を適用
  }

  // プレイヤーの位置更新
  player.y += player.dy;
  if (player.y > canvas.height - player.height) {
    player.y = canvas.height - player.height; // 地面に着地（画面外に落ちないように）
  }

  // プレイヤーの水平方向の移動
  if (keys.right) player.x += player.speed;
  if (keys.left && player.x > 0) player.x -= player.speed;
}

// 衝突判定関数
function isColliding(player, block) {
  return (
    player.x < block.x + block.width &&
    player.x + player.width > block.x &&
    player.y < block.y + block.height &&
    player.y + player.height > block.y
  );
}

// ゲームループ
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 背景を描画
  ctx.fillStyle = "#87ceeb"; // 空の色
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 残り時間表示
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("残り時間: " + Math.floor(timer), 10, 30);

  // ブロック描画
  blocks.forEach(block => {
    ctx.fillStyle = "brown";
    ctx.fillRect(block.x - scrollOffset, block.y, block.width, block.height);
  });

  // ？ブロック描画
  questionBlocks.forEach(block => {
    ctx.fillStyle = "yellow";
    ctx.fillRect(block.x - scrollOffset, block.y, block.width, block.height);
    if (block.item) {
      ctx.fillStyle = block.item === "mushroom" ? "green" : "red";
      ctx.beginPath();
      ctx.arc(block.x + block.width / 2 - scrollOffset, block.y + block.height / 2, 15, 0, 2 * Math.PI);
      ctx.fill();
    }
  });

  // コイン描画
  ctx.fillStyle = "gold";
  ctx.beginPath();
  ctx.arc(coin.x - scrollOffset, coin.y, coin.width / 2, 0, 2 * Math.PI);
  ctx.fill();

  // ゴール描画
  ctx.fillStyle = "green";
  ctx.fillRect(goal.x - scrollOffset, goal.y, goal.width, goal.height);

  // プレイヤー描画
  ctx.fillStyle = player.state === "small" ? "red" : player.state === "big" ? "blue" : "orange";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // アイテムやコインとの衝突をチェック
  handleItemCollisions();
  handleCoinCollision();

  // 時間更新
  updateTimer();

  // ゴール判定
  checkGoal();

  // 火の玉処理
  handleFireballs();

  // プレイヤー移動
  handlePlayerMovement();

  requestAnimationFrame(gameLoop);
}

// ゲーム開始
gameLoop();
