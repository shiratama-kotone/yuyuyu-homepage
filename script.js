





// 共通部分を読み込む関数
function loadComponent(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        });
}

// ヘッダーとフッターを挿入
loadComponent("header", "../header.html");
loadComponent("footer", "../footer.html");

var audioContext = new (window.AudioContext || window.webkitAudioContext)();
var activeOscillators = new Map(); // 押下中のキーの管理

// 鍵盤を生成する
function createPianoKeys() {
  var piano = document.getElementById("piano");
  var notes = ["ド", "ド#(レ♭)", "レ", "レ#(ミ♭)", "ミ", "ファ", "ファ#(ソ♭)", "ソ", "ソ#(ラ♭)", "ラ", "ラ#(シ♭)", "シ"];
  var startOctave = 0;
  var endOctave = 7;

  for (var octave = startOctave; octave <= endOctave; octave++) {
    for (var i = 0; i < notes.length; i++) {
      if (octave === endOctave && notes[i] === "C") break;

      // コンテナを作成
      var container = document.createElement("div");
      container.className = "key-container";

      // 白鍵を作成
      var key = document.createElement("div");
      key.className = "key";
      key.setAttribute("data-frequency", calculateFrequency(octave, i));
      key.textContent = notes[i] + octave;

      // 黒鍵の場合の追加処理
      if (notes[i].includes("#")) {
        key.classList.add("black");
      }

      // イベントリスナー追加
      addKeyEventListeners(key);

      container.appendChild(key);

      // コンテナをピアノに追加
      piano.appendChild(container);
    }
  }
}

// 周波数を計算する
function calculateFrequency(octave, noteIndex) {
  var a4Frequency = 440; // A4 = 440Hz
  var a4KeyNumber = 4 * 12 + 9; // A4の番号
  var keyNumber = octave * 12 + noteIndex;
  return a4Frequency * Math.pow(2, (keyNumber - a4KeyNumber) / 12);
}

// 音を鳴らす
function startNote(event) {
  var frequency = parseFloat(event.target.getAttribute("data-frequency"));

  // 既に再生中の場合はスキップ
  if (activeOscillators.has(frequency)) return;

  var oscillator = audioContext.createOscillator();
  var gainNode = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  gainNode.gain.setValueAtTime(1, audioContext.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  activeOscillators.set(frequency, { oscillator, gainNode });
}

// 音を止める
function stopNote(event) {
  var frequency = parseFloat(event.target.getAttribute("data-frequency"));

  if (activeOscillators.has(frequency)) {
    var { oscillator, gainNode } = activeOscillators.get(frequency);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.03); // 滑らかに音を消す
    oscillator.stop(audioContext.currentTime + 0.03);
    activeOscillators.delete(frequency);
  }
}

// キーにイベントリスナーを追加
function addKeyEventListeners(key) {
  // マウスイベント
  key.addEventListener("mousedown", startNote);
  key.addEventListener("mouseup", stopNote);
  key.addEventListener("mouseleave", stopNote);

  // タッチイベント
  key.addEventListener("touchstart", (e) => {
    e.preventDefault(); // タッチイベントの競合防止
    startNote(e);
  });
  key.addEventListener("touchend", (e) => {
    e.preventDefault(); // タッチイベントの競合防止
    stopNote(e);
  });

  // 右クリック無効化
  key.addEventListener("contextmenu", (e) => e.preventDefault());
}

// 初期化
createPianoKeys();

// 現在のURLが無効なページかどうかをチェックする関数
const validPages = ["/", "/404.html", "/URL短縮","/URL短縮回避.html","/footer.html","/header.html","/web-piano.html","/お問い合わせ.html","/お知らせ.html","/だよについて.html","/ゆゆゆsoft.html","/ゆゆゆについて.html","/テスト.html","/テンプレ.html","/昔.html","/画像URL化.html"]; // 有効なページのリスト

if (!validPages.includes(window.location.pathname)) {
  // 無効なページの場合、404.htmlにリダイレクト
  window.location.href = "/404.html";
}


function calculate() {
    var inputNumber = parseFloat(document.getElementById('inputNumber').value);

    // ランダムな数字を生成
    var random1 = Math.floor(Math.random() * 100) + 1;  // 1〜100のランダム数
    var random2 = Math.floor(Math.random() * 50) + 1;   // 1〜50のランダム数
    var random3 = Math.floor(Math.random() * 10) + 1;   // 1〜10のランダム数

    // 計算の演算子の選択肢
    var operations = [
        { operation: 'multiply', symbol: '×' },
        { operation: 'add', symbol: '+' },
        { operation: 'subtract', symbol: '-' }
    ];

    // 計算式の長さをランダムに設定（最大10回）
    var numOperations = Math.floor(Math.random() * 25) + 1;

    // 計算式の組み立て
    var equation = inputNumber;
    var equationText = inputNumber.toString();
    
    // ランダムに演算を繰り返す
    for (var i = 0; i < numOperations; i++) {
        var opIndex = Math.floor(Math.random() * operations.length);
        var operation = operations[opIndex];
        var randomValue = opIndex === 1 ? random2 : (opIndex === 2 ? random3 : random1);  // 割り算はrandom2、加算はrandom3、その他はrandom1を使用

        if (operation.operation === 'multiply') {
            equation *= randomValue;
            equationText += ` ${operation.symbol} ${randomValue}`;
        } else if (operation.operation === 'divide') {
            equation /= randomValue;
            equationText += ` ${operation.symbol} ${randomValue}`;
        } else if (operation.operation === 'add') {
            equation += randomValue;
            equationText += ` ${operation.symbol} ${randomValue}`;
        } else if (operation.operation === 'subtract') {
            equation -= randomValue;
            equationText += ` ${operation.symbol} ${randomValue}`;
        }
    }

    // 結果を114514に調整
    var difference = 114514 - equation;
    if (difference !== 0) {
        equationText += ` + ${difference}`;
        equation += difference;
    }

    // 計算式と結果を表示
    document.getElementById('equation').textContent = equationText;
    document.getElementById('result').textContent = 114514;
}
