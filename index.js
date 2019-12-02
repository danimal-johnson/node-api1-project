const express = require('express');
const db = require ('./data/db.js');

const server = express();
const port = 4000;

// Middleware
server.use(express.json());

server.get('/', (req, res) => {
  res.send({ api: 'Up and running...'})
});

server.get('/api/users', (req, res) => {
  db.find()
    .then(hubs => {
      res.status(200).json(hubs);
    })
    .catch(err => {
      console.log("Error getting /api/users :", err);
    });
});

server.listen(port, () => {
  console.log(`\n ** API running on port ${port} **\n`);
});