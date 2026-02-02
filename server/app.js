const express = require('express');
const app = express();

app.use(express.json());

const analyzeRouter = require('./routes/analyze');
app.use('/analyze', analyzeRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 404 handler (no route matched)
app.use((req, res) => {
  return res.status(404).json({ error: 'Not Found' });
});

// Global error handler(must be after routes)
app.use((err, req, res, next) => {
  console.error("Error:", err);

  const status = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ error: message });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
