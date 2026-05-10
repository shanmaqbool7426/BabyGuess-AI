const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let predictionHistory = [];

// Prediction endpoint
app.post('/api/predict', (req, res) => {
  const { girlScore = 0, boyScore = 0, factors = [] } = req.body;
  const total = girlScore + boyScore;
  const prediction = girlScore >= boyScore ? 'girl' : 'boy';
  const confidence = total > 0 ? Math.round((Math.max(girlScore, boyScore) / total) * 100) : 50;

  const result = {
    prediction,
    confidence,
    girlScore,
    boyScore,
    factors,
    timestamp: new Date().toISOString(),
  };

  predictionHistory.push(result);
  if (predictionHistory.length > 200) predictionHistory = predictionHistory.slice(-200);

  res.json(result);
});

// History endpoint
app.get('/api/history', (req, res) => {
  res.json(predictionHistory.slice(-20).reverse());
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', predictions: predictionHistory.length });
});

// Landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'landing-page.html'));
});

app.listen(PORT, () => {
  console.log(`BabyGuess AI Server running on port ${PORT}`);
});
