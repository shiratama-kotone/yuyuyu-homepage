// 名前と誕生日を設定
var today = new Date();
var todayMonth = today.getMonth() + 1; // 月を取得（0始まりなので+1）
var todayDay = today.getDate(); // 日を取得

var people = [
  { name: "ゆゆゆ", birthday: "2011-12-26", display: true },
  { name: "だよ", birthday: "1919-01-09", display: true },
  { name: "からめりゅ", birthday: "2010-11-07", display: true },
  { name: "騒音人形", birthday: "2011-04-08", display: true },
  { name: "ゆじうり", birthday: "2011-07-25", display: true },
  { name: "ka_0916", birthday: "2012-09-16", display: true },
  { name: "ツタンカーメン", birthday: "2025-01-01", display: true },
  { name: "peaceこと中居正広", birthday: "9999-01-01", display: true },
  { name: "peace(本物)", birthday: "2011-04-24", display: true },
  { name: "はすむかいのおばさん", birthday: "###", display: false },
  { name: "デプロイ", birthday: "2015-11-18", display: true },
  { name: "六法全書", birthday: "2011-05-12", display: true },
  { name: "", birthday: "2011-08-02", display: true },
  { name: "ベイ", birthday: "2009-05-18", display: true },
  { name: "　", birthday: "###", display: false },
  { name: "あういえお", birthday: "2012-08-11", display: true },
  { name: "よっしぃ", birthday: "2012-09-16", display: true },
  { name: "西園寺金餅", birthday: "2010-09-16", display: true },
  { name: "星k　騒音人形推し", birthday: "2025-12-24", display: true },
  { name: "なっすー", birthday: "2025-08-11", display: true },
  { name: "ね", birthday: "1969-12-31", display: true },
  { name: "Yu-i", birthday: "2010-08-06", display: true },
  { name: "くれくれ", birthday: "2014-06-20", display: true },
  { name: "ココア", birthday: "2024-05-12", display: true },
  { name: "昆布", birthday: "2012-08-22", display: true },
  { name: "Nao", birthday: "2010-10-28", display: true },
  { name: "Ok", birthday: "2025-11-24", display: true },
  { name: "猫派", birthday: "2013-04-12", display: true },
  { name: "mumei", birthday: "2012-12-17", display: true },
  { name: "peaceという名のゴミ山", birthday: "2011-04-24", display: true },
  { name: "｡:*・*♥めいめい♥｡:*・*", birthday: "2025-05-27", display: true },
  { name: "伊_____", birthday: "2012-09-16", display: true },
  { name: "さみだれ", birthday: "2010-08-21", display: true },
  { name: "雑草", birthday: "2011-03-18", display: true },
  { name: "すりーぶいえふ", birthday: "2025-11-21", display: true },
  { name: "ゲゲ", birthday: "2025-11-24", display: true },
  { name: "反省", birthday: "2011-07-03", display: true },
  { name: "ごめん", birthday: "2025-03-20", display: true },
  { name: "此処", birthday: "2070-07-21", display: true },
  { name: "にょきにょき", birthday: "2011-02-25", display: true },
  { name: "掲示板見学勢", birthday: "2025-01-18", display: true },
  { name: "京坂七穂/れあ推し隊.✞꙳。副隊長", birthday: "2009-11-15", display: true },
  { name: "テスト", birthday: `2011-${todayMonth}-${todayDay}`, display: false },
  { name: "エマ", birthday: "2011-03-21", display: true }
];

// 今日の日付を取得
var todayMonthDay = `${todayMonth}-${todayDay}`; // "MM-DD"形式

window.onload = function() {
  var message = document.getElementById("message");
  var tableBody = document.getElementById("table-body"); // ここで取得

  if (!tableBody) {
    console.error("table-bodyが見つかりません");
    return; // table-bodyがなければ処理を停止
  }

  // 表示対象の中で誕生日が今日の人を探す
  var birthdayPerson = people.find(person => {
    if (!person.display) return false; // displayがfalseの場合は無視
    var [year, month, day] = person.birthday.split("-");
    return `${parseInt(month)}-${parseInt(day)}` === todayMonthDay;
  });

  if (birthdayPerson) {
    var birthDate = new Date(birthdayPerson.birthday);
    var age = calculateAge(birthDate, today);
    message.textContent = `今日は${birthdayPerson.name}の${age}歳の誕生日です！！`;
  } else {
    message.textContent = "今日は誰の誕生日でもありません";
  }

  // 表の行を作成
  people.forEach(person => {
    if (!person.display) return; // displayがfalseの場合は表示しない

    var birthDate = new Date(person.birthday);
    var age = calculateAge(birthDate, today);
    var nextBirthdayDays = calculateNextBirthday(birthDate, today); // 次の誕生日までの日数
    var formattedBirthday = `${birthDate.getMonth() + 1}月${birthDate.getDate()}日`;

    // 今日が誕生日かを確認
    var isTodayBirthday = `${birthDate.getMonth() + 1}-${birthDate.getDate()}` === todayMonthDay;

    // 表の行を作成
    var row = document.createElement("tr");
    row.innerHTML = `
      <td>${person.name}</td>
      <td class="${isTodayBirthday ? 'blink' : ''}">${age}歳</td>
      <td>${formattedBirthday}</td>
      <td>${nextBirthdayDays}日</td> <!-- 次の誕生日までの日数 -->
    `;
    tableBody.appendChild(row);
  });
};

// 年齢を計算
function calculateAge(birthDate, currentDate) {
  var age = currentDate.getFullYear() - birthDate.getFullYear();
  var m = currentDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && currentDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// 次の誕生日までの日数を計算
function calculateNextBirthday(birthDate, currentDate) {
  // 次の誕生日を設定
  var nextBirthday = new Date(currentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate() + 1);

  // 今年の誕生日が過ぎていれば、来年の誕生日を設定
  if (currentDate > nextBirthday) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
  }

  // 次の誕生日までの差を計算
  var diffTime = nextBirthday - currentDate;

  // 日数差を計算
  var diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // 日数

  return diffDays;
}