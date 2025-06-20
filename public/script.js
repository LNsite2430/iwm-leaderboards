document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.querySelector('#results tbody');
  const select = document.getElementById('leaderboard');

  if (!tbody) {
    console.error('tbody element not found!');
    return;
  }

  async function fetchLeaderboard(type) {
    try {
      const res = await fetch(`/api/leaderboard/${encodeURIComponent(type)}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      console.log('Leaderboard data:', data);

      const entries = Array.isArray(data) ? data : [];

      tbody.innerHTML = '';
      entries.forEach((entry, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td>${entry.Username}</td>
          <td>${entry.UserLeaderboardNum}</td>
        `;
        tbody.appendChild(tr);
      });
    } catch (e) {
      console.error('Failed to fetch leaderboard:', e);
      tbody.innerHTML = '<tr><td colspan="3">Failed to load leaderboard</td></tr>';
    }
  }

  // 初期表示
  fetchLeaderboard(select.value);
  updateLeaderboardLogo(select.value); // ←これを追加

  // セレクト変更時
  select.addEventListener('change', () => {
    fetchLeaderboard(select.value);
    updateLeaderboardLogo(select.value); // ←これも同時に
  });
});

// ロゴ設定などはそのまま
const leaderboardLogos = {
  "Clears":      { src: "/logos/clears.png",            width: 300, height: 150 },
  "Records":     { src: "/logos/records.png",           width: 300, height: 150 },
  "Explorer":    { src: "/logos/explorer.png",          width: 300, height: 150 },
  "Skribble":    { src: "/logos/skribble.png",          width: 240, height: 120 },
  "Endurance":   { src: "/logos/endurance.png",         width: 300, height: 150 },
  "Roulette":    { src: "/logos/roulette.png",          width: 300, height: 150 },
  "Hardcore Roulette": { src: "/logos/hardcore_roulette.png", width: 300, height: 150 }
};

function getLogoInfo(type) {
  if (type.startsWith("Skribble")) {
    return {
      ...leaderboardLogos["Skribble"],
      sub: type.replace("Skribble ", "")
    };
  }
  if (type.startsWith("Endurance")) {
    return {
      ...leaderboardLogos["Endurance"],
      sub: type.replace("Endurance ", "")
    };
  }
  return {
    ...(leaderboardLogos[type] || {}),
    sub: ""
  };
}

function updateLeaderboardLogo(type) {
  const logoArea = document.getElementById('leaderboard-logo-area');
  logoArea.innerHTML = '';
  const { src, width, height, sub } = getLogoInfo(type);
  if (src) {
    const img = document.createElement('img');
    img.src = src;
    img.alt = type + " logo";
    img.style.width = width ? width + "px" : "auto";
    img.style.height = height ? height + "px" : "auto";
    img.style.objectFit = "contain";
    logoArea.appendChild(img);
  }
  if (sub) {
    const subText = document.createElement('div');
    subText.textContent = sub;
    subText.style.fontFamily = "'FutureKid', 'Segoe UI', 'Arial', sans-serif";
    subText.style.fontSize = "22px";
    subText.style.color = "#fff";
    subText.style.fontWeight = "bold";
    subText.style.marginTop = "2px";
    subText.style.textShadow = "2px 0 0 #000, -2px 0 0 #000, 0 2px 0 #000, 0 -2px 0 #000";
    logoArea.appendChild(subText);
  }
}

// フォントクラスユーティリティ
function getFontClass(username, lang) {
  if (/[!-/:-@[-`{-~]/.test(username)) return 'font-mplus';
  if (/[ぁ-んァ-ン一-龥]/.test(username)) return 'font-noto';
  if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(username)) return 'font-one';
  if (lang === 'pt-BR' || /[\u4E00-\u9FFF]/.test(username)) return 'font-mplus';
  return '';
}
