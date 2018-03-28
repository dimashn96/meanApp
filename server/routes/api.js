const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

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

// ROFL message
router.get('/message',(req,res) => {
        response.data = {message: "Egor hyilo"};
        res.json(response);
});

module.exports = router;
