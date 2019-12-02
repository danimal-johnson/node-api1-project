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
      res.status(500)
        .json({ message: "The users information could not be retrieved." });
    });
});

server.get('/api/users/:id', (req, res) => {
  let id = req.params.id;
  db.findById(id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      console.log(`Error getting /api/user/${id}: ${err}`);
      res.status(404) // FIXME: Move this up and put server error here
        .json({ message: "The user with the specified ID does not exist." });
    });
});

server.post('/api/users', (req,res) => {
  const userData = req.body; // Express does not know how to parse JSON

  console.log("Attempting to add user:", userData);
  if (userData.name === "" || userData.bio === "") {
    res.status(400).json({ errorMessage : "Please provide name and bio for the user" });
  } else {
    db.insert(userData)
      .then(user => {
        res.status(201).json(user);
      })
      .catch(err => {
        console.log("Error on POST /api/users:", err);
        res.status(500).json({ error: "There was an error while saving the user to the database" });
      });
  }
});

server.listen(port, () => {
  console.log(`\n ** API running on port ${port} **\n`);
});