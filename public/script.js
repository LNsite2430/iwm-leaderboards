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

  // Initial display on page load
  fetchLeaderboard(select.value);

  // Update leaderboard when selection changes
  select.addEventListener('change', () => {
    fetchLeaderboard(select.value);
  });
});


  // Logo image path and size settings
  const leaderboardLogos = {
    "Clears":      { src: "/logos/clears.png",            width: 120, height: 60 },
    "Records":     { src: "/logos/records.png",           width: 120, height: 60 },
    "Explorer":    { src: "/logos/explorer.png",          width: 120, height: 60 },
    "Skribble":    { src: "/logos/skribble.png",          width: 180, height: 60 },
    "Endurance":   { src: "/logos/endurance.png",         width: 180, height: 60 },
    "Roulette":    { src: "/logos/roulette.png",          width: 120, height: 60 },
    "Hardcore Roulette": { src: "/logos/hardcore_roulette.png", width: 160, height: 60 }
  };

  // Get logo and sub text info
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

  // Update logo area
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
      // 2px black outline, only up/down/left/right
      subText.style.textShadow = "2px 0 0 #000, -2px 0 0 #000, 0 2px 0 #000, 0 -2px 0 #000";
      logoArea.appendChild(subText);
    }
  }

  // Update logo on select change
  select.addEventListener('change', e => {
    updateLeaderboardLogo(e.target.value);
  });

  // Username font class utility (for your leaderboard rendering logic)
function getFontClass(username, lang) {
  if (/[!-/:-@[-`{-~]/.test(username)) return 'font-mplus';
  if (/[ぁ-んァ-ン一-龥]/.test(username)) return 'font-noto';
  if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(username)) return 'font-one';
  if (lang === 'pt-BR' || /[\u4E00-\u9FFF]/.test(username)) return 'font-mplus';
  return '';
}
