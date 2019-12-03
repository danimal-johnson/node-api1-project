const express = require('express');
const db = require ('./data/db.js');

const server = express();
const port = 4000;

// Middleware
server.use(express.json());

server.get('/', (req, res) => {
  res.send({ api: 'Up and running...'})
});

// GET all users
// Fully functional
server.get('/api/users', (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log("Error getting /api/users :", err);
      res.status(500)
        .json({ message: "The users information could not be retrieved." });
    });
});

// GET individual user
server.get('/api/users/:id', (req, res) => {
  let id = req.params.id;
  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        console.log(`Error getting /api/user/${id}: ${err}`);
        res.status(404)
          .json({ message: "The user with the specified ID does not exist." });  
      }
    })
    .catch(err => {
      console.log("Server error on GET /api/user/:id");
      res.status(500).json({ error: "The user information could not be retrieved."});
    });
});

// Add new user (POST)
// Fully functional
server.post('/api/users', (req,res) => {
  const userData = req.body; // Express does not know how to parse JSON
  console.log("Attempting to add user:", userData);
  if ( !userData.name || !userData.bio ) {
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

// DELETE individual user
// Fully functional
server.delete('/api/users/:id', (req, res) => {
  let id = req.params.id;
  db.remove(id)
    .then(removed => {
      if (removed) {
        res.status(200).json({ message: `User ID ${id} successfully deleted` });
      } else {
          res.status(404).json({ message : "The user with the specified ID does not exist." });
      };
    })
    .catch(err => {
      console.log(`Error deleting ${id}: ${err}`);
      res.status(500).json({ error: "The user could not be removed" });
    });
});

// Modify user (PUT).
// Fully functional
server.put('/api/users/:id', (req, res) => {
  let id = req.params.id;
  const userData = req.body;

  if ( !userData.name || !userData.bio ) {
    res.status(400).json({ errorMessage : "Please provide name and bio for the user" });
  } else {
    db.update(id, userData)
      .then( updated => {
        if (updated) {
          res.status(200).json(userData);
        } else {
          res.status(404).json({ message: "The user with the specified ID does not exist."});
        }
      })
      .catch( err => {
        console.log("Error modifying user with PUT", err);
      });
  }
});

server.listen(port, () => {
  console.log(`\n ** API running on port ${port} **\n`);
});