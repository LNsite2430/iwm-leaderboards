// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// If using Node 18+, global fetch should be available by default,
// but if it causes errors, try the dynamic import below.
if (typeof fetch !== 'function') {
  global.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
}

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

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/leaderboard/:type', async (req, res) => {
    const code = leaderboardCodes[req.params.type];
    if (!code) {
        return res.status(400).json({ error: 'Invalid leaderboard type' });
    }

    try {
        const response = await fetch(`http://make.fangam.es/api/v1/leaderboard?type=${code}&start=0&limit=50&userId=-1`);
        if (response.status === 200) {
            const data = await response.json();
            res.json(data);
        } else {
            res.status(response.status).json({ error: `Upstream error ${response.status}` });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error', detail: err.toString() });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
