const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      const columns = results.length > 0 ? Object.keys(results[0]) : [];
      
      const stats = {};

      columns.forEach((col) => {
        const values = results
          .map(row => Number(row[col]))
          .filter(v => !isNaN(v));

        if (values.length === results.length) {
          const sum = values.reduce((a, b) => a + b, 0);
          stats[col] = {
            mean: sum / values.length,
            min: Math.min(...values),
            max: Math.max(...values)
         };
       }
     });
      res.json({
        rows: results.length,
        columns,
	stats
      });
    });
});

module.exports = router;
