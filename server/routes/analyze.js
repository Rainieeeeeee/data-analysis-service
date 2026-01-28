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
      res.json({
        rows: results.length,
        columns
      });
    });
});

module.exports = router;
