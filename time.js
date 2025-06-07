// 音を鳴らすための関数
function playBeepSound() {
  const beep = new AudioContext();
  const oscillator = beep.createOscillator();
  const gainNode = beep.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(beep.destination);
  
  oscillator.type = 'square'; // 波形の種類（音の特徴を変える）
  oscillator.frequency.setValueAtTime(1000, beep.currentTime); // 音の高さ（周波数）
  gainNode.gain.setValueAtTime(0.1, beep.currentTime); // 音量
  
  oscillator.start();
  oscillator.stop(beep.currentTime + 1.5); // 0.5秒間音を鳴らす
}

// タイマー機能
let timerInterval;
document.getElementById('startTimer').addEventListener('click', () => {
  const seconds = parseInt(document.getElementById('timerInput').value);
  let timeLeft = seconds;

  if (isNaN(timeLeft) || timeLeft <= 0) return;

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const remainingSeconds = timeLeft % 60;
    document.getElementById('timerDisplay').textContent = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      playBeepSound(); // タイマー終了時に音を鳴らす
      showNotification("タイマー終了！", "タイマーが終了しました。");
    }
  }, 1000);
});

// アラーム機能
document.getElementById('setAlarm').addEventListener('click', () => {
  const alarmTime = document.getElementById('alarmTime').value;
  const alarmDate = new Date();
  const [hours, minutes] = alarmTime.split(':').map(num => parseInt(num));
  alarmDate.setHours(hours);
  alarmDate.setMinutes(minutes);
  alarmDate.setSeconds(0);

  const currentTime = new Date();
  const timeUntilAlarm = alarmDate - currentTime;

  if (timeUntilAlarm > 0) {
    setTimeout(() => {
      playBeepSound(); // アラーム終了時に音を鳴らす
      showNotification("アラーム", "指定した時間になりました！");
    }, timeUntilAlarm);
  }
});

// プッシュ通知を表示するための関数
function showNotification(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  } else {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(title, { body });
      }
    });
  }
}

// サービスワーカーの登録
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then(registration => {
    console.log('Service Worker registered with scope:', registration.scope);
  }).catch(error => {
    console.log('Service Worker registration failed:', error);
  });
}
