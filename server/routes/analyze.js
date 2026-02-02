const express = require('express');
const router = express.Router();

const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), (req, res, next) => {
  if (!req.file) {
    const err = new Error("Missing file. Use form-data field 'file'.");
    err.statusCode = 400;
    return next(err);
  }

  const originalName = (req.file.originalname || '').toLowerCase();
  if (!originalName.endsWith('.csv')) {
    fs.unlink(req.file.path, () => {});
    const err = new Error('Invalid file type. Please upload a .csv file.');
    err.statusCode = 400;
    return next(err);
  }

  const results = [];

  fs.createReadStream(req.file.path)
    .on('error', (e) => {
      fs.unlink(req.file.path, () => {});
      e.statusCode = 500;
      return next(e);
    })
    .pipe(csv())
    .on('error', (e) => {
      fs.unlink(req.file.path, () => {});
      e.statusCode = 400;
      return next(e);
    })
    .on('data', (data) => results.push(data))
    .on('end', () => {
      const columns = results.length > 0 ? Object.keys(results[0]) : [];
      const stats = {};

      columns.forEach((col) => {
        const values = results
          .map((row) => Number(row[col]))
          .filter((v) => !isNaN(v));

        if (values.length === results.length) {
          const sum = values.reduce((a, b) => a + b, 0);
          stats[col] = {
            mean: Number((sum / values.length).toFixed(2)),
            min: Math.min(...values),
            max: Math.max(...values)
          };
        }
      });

      fs.unlink(req.file.path, () => {});

      return res.json({
        rows: results.length,
        columns,
        stats
      });
    });
});

module.exports = router;
