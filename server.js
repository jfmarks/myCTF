// server.js (Node.js server script)
const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

app.get('/readFile', (req, res) => {
  fs.readFile('flag.txt', (err, data) => {
    if (err) {
      res.status(500).send('Error reading the file');
    } else {
      res.send(data.toString());
    }
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});