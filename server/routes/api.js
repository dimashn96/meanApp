const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// Connection
const connection = (closure) => {
  return MongoClient.connect('mongodb://uct4tj5hj1drea3:oZhGL0I5V5ukzOXuM4ON@bl5rclcirwkncyt-mongodb.services.clever-cloud.com:27017/bl5rclcirwkncyt',(err,client) => {
    const db = client.db('bl5rclcirwkncyt');
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

module.exports = router;
