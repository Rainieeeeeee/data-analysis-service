const express = require('express');
const app = express();

const analyzeRouter = require('./routes/analyze');
app.use('/analyze', analyzeRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
