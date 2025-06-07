var words = ["りんご", "ねこ", "さくら", "たんぽぽ", "うさぎ"];
var romajiMap = {
  "あ": "a", "い": "i", "う": "u", "え": "e", "お": "o",
  "か": "ka", "き": "ki", "く": "ku", "け": "ke", "こ": "ko",
  "さ": "sa", "し": ["si", "shi"], "す": "su", "せ": "se", "そ": "so",
  "た": "ta", "ち": ["ti", "chi"], "つ": ["tu", "tsu"], "て": "te", "と": "to",
  "な": "na", "に": "ni", "ぬ": "nu", "ね": "ne", "の": "no",
  "は": "ha", "ひ": "hi", "ふ": ["hu", "fu"], "へ": "he", "ほ": "ho",
  "ま": "ma", "み": "mi", "む": "mu", "め": "me", "も": "mo",
  "や": "ya", "ゆ": "yu", "よ": "yo",
  "ら": "ra", "り": "ri", "る": "ru", "れ": "re", "ろ": "ro",
  "わ": "wa", "を": "wo", "ん": ["n", "nn"],
  "が": "ga", "ぎ": "gi", "ぐ": "gu", "げ": "ge", "ご": "go",
  "ざ": "za", "じ": ["zi", "ji"], "ず": "zu", "ぜ": "ze", "ぞ": "zo",
  "だ": "da", "ぢ": ["di", "ji"], "づ": ["du", "zu"], "で": "de", "ど": "do",
  "ば": "ba", "び": "bi", "ぶ": "bu", "べ": "be", "ぼ": "bo",
  "ぱ": "pa", "ぴ": "pi", "ぷ": "pu", "ぺ": "pe", "ぽ": "po",
  "ぁ": "xa", "ぃ": "xi", "ぅ": "xu", "ぇ": "xe", "ぉ": "xo",
  "ゃ": "xya", "ゅ": "xyu", "ょ": "xyo", "っ": "xtu"
};

var currentWord = "", romajiWord = "", typedText = "";
var score = 0, time = 30, timer, gameActive = false;

function toRomaji(word) {
  let result = "";
  for (let i = 0; i < word.length; i++) {
    let char = word[i];
    let nextChar = word[i + 1] || "";
    
    if (char === "っ" && nextChar) {
      let nextRomaji = romajiMap[nextChar];
      if (nextRomaji) {
        result += (Array.isArray(nextRomaji) ? nextRomaji[0][0] : nextRomaji[0]);
      }
    } else {
      let romaji = romajiMap[char] || char;
      result += Array.isArray(romaji) ? romaji[0] : romaji;
    }
  }
  return result;
}

function setNewWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  romajiWord = toRomaji(currentWord);
  typedText = "";
  document.getElementById("word").textContent = currentWord;
  document.getElementById("romaji").textContent = romajiWord;
  document.getElementById("typed").textContent = typedText;
}

document.getElementById("start").addEventListener("click", function() {
  if (gameActive) return;

  score = 0;
  time = 30;
  gameActive = true;
  document.getElementById("score").textContent = score;
  document.getElementById("time").textContent = time;
  setNewWord();

  timer = setInterval(function() {
    time--;
    document.getElementById("time").textContent = time;
    if (time <= 0) {
      clearInterval(timer);
      gameActive = false;
      alert("ゲーム終了！スコア: " + score);
    }
  }, 1000);
});

document.addEventListener("keydown", function(event) {
  if (!gameActive || time <= 0) return;

  var key = event.key.toLowerCase();
  var expectedChars = romajiMap[currentWord[typedText.length]];
  expectedChars = Array.isArray(expectedChars) ? expectedChars : [expectedChars];

  if (expectedChars.includes(typedText + key) || expectedChars.includes(typedText.replace(/n$/, "nn") + key)) {
    typedText += key;
    document.getElementById("typed").textContent = typedText;
    
    if (typedText === romajiWord) {
      score++;
      document.getElementById("score").textContent = score;
      setNewWord();
    }
  }
});
