const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.static('public'));

app.get('/api/data', (req, res) => {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf-8'));
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
