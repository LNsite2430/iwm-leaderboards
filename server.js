// server.js
const express = require('express');
const path = require('path');
const app = express();

// RenderではPORTが環境変数として与えられる
const PORT = process.env.PORT || 3000;

// Node.js 18未満ではfetchがグローバルに存在しないため、その対策
if (typeof fetch !== 'function') {
  global.fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
}

// MakeFangames APIのリーダーボード種類とコードの対応表
const leaderboardCodes = {
  "Clears": "clears",
  "Records": "records",
  "Explorer": "explorer",
  "Skribble Easy": "scribble0",
  "Skribble Medium": "scribble1",
  "Skribble Hard": "scribble2",
  "Skribble Impossible": "scribble3",
  "Endurance Easy": "endurance0",
  "Endurance Medium": "endurance1",
  "Endurance Hard": "endurance2",
  "Endurance Impossible": "endurance3",
  "Roulette": "roulette",
  "Hardcore Roulette": "hardcore"
};

// publicフォルダ内の静的ファイルを配信
app.use(express.static(path.join(__dirname, 'public')));

// APIエンドポイント
app.get('/api/leaderboard/:type', async (req, res) => {
  const code = leaderboardCodes[req.params.type];
  if (!code) {
    return res.status(400).json({ error: 'Invalid leaderboard type' });
  }

  try {
    const url = `http://make.fangam.es/api/v1/leaderboard?type=${code}&start=0&limit=50&userId=-1`;

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: `Upstream error ${response.status}` });
    }

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Internal server error', detail: err.toString() });
  }
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

