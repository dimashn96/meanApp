const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
const jwt = require('json-web-token');

const payload = {
  "iss": "my_issurer",
  "aud": "World",
  "iat": 1400062400223,
  "typ": "/online/transactionstatus/v2",
  "request": {
    "myTransactionId": "[myTransactionId]",
    "merchantTransactionId": "[merchantTransactionId]",
    "status": "SUCCESS"
  }
};

const secret = 'TOPSECRETTTTT';

// Connection
const connection = (closure) => {
  const uri = process.env.MONGODB_ADDON_URI || 'mongodb://localhost:27017/mean';
  const dbName = process.env.MONGODB_ADDON_DB || 'mean';
  return MongoClient.connect(uri, (err, client) => {
    const db = client.db(dbName);
    if (err) {
      return console.log('Database connection error');
    }
    closure(db);
  });
};

// Response handling
let response = {
  status: 200,
  data: [],
  message: null
};

// Error handling
const sendError = (err, res) => {
  response.status = 501;
  response.message = typeof err === 'object' ? err.message : err;
  res.status(501).json(response);
};

// Get users
router.get('/users', (req, res) => {
  connection((db) => {
    db.collection('users')
      .find()
      .toArray()
      .then((users) => {
        response.data = users;
        res.json(response);
      })
      .catch((err) => {
        sendError(err, res);
      });
  });
});

// Add user
router.put('/user', function (req, res, next) {
  let user = {};
  user.nm = req.body.name;
  user.crDt = new Date();
  user.rl = 'user';
  let password = req.body.password;
  bcrypt.hash(password, 10, function (err, passH) {
    if (err) {
      res.sendStatus(500);
    } else {
      user.pssH = passH;
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

// Auth
router.post ('/login', function(req, res, next){
  if (!req.body.name || !req.body.password) {
    return res.sendStatus(400)
  } else {
    let name = req.body.name;
    let password = req.body.password;
    let user = {};
    connection((db) => {
      db.collection('users')
        .findOne({nm: name}, function (err, result) {
          if (err) {
            res.sendStatus(500)
          } else {
            user.pssH = result.pssH;
            bcrypt.compare(password, user.pssH, function (err, valid) {
              if (err) {
                return res.send(500)
              }
              if (!valid) {
                return res.sendStatus(401)
              }
              jwt.encode(secret, payload, function (err, token) {
                res.send(token);
              })
            })
          }
        });
    })
  }
});

module.exports = router;
