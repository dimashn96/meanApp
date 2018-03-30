const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');

// Connection
const connection = (closure) => {
  let uri = process.env.MONGODB_ADDON_URI || 'mongodb://localhost:27017/mean';
  let dbName = process.env.MONGODB_ADDON_DB || 'mean';
  return MongoClient.connect(uri,(err,client) => {
    const db = client.db(dbName);
    if (err) {
      return console.log('Database connection error')
    }
    closure(db);
  })
};

// Response handling
let response = {
  status: 200,
  data: [],
  message: null
};

// Error handling
const sendError = (err,res) => {
  response.status = 501;
  response.message = typeof err === 'object' ? err.message : err;
  res.status(501).json(response);
};

// Get users
router.get('/users',(req,res) => {
  connection((db) => {
    db.collection('users')
      .find()
      .toArray()
      .then((users) => {
        response.data = users;
        res.json(response);
      })
      .catch((err) => {
        sendError(err,res);
      })
  })
});

// Add user

router.put('/user', function (req, res, next) {
  let user = {};
  user.name = req.body.name;
  user.createdDate = new Date();
  user.role = 'user';
  let password = req.body.password;
  bcrypt.hash(password, 10, function (err, passH) {
    if (err) {
      res.sendStatus(500);
    } else {
      user.password = passH;
      connection((db) => {
        db.collection('users')
          .insertOne(user, function (err, result) {
            if (err) {
              return res.sendStatus(500);
            } else {
              res.sendStatus(201);
            }
          });
      });
    }
  });
});

module.exports = router;
