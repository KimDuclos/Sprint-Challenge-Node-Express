const express = require('express');

const server = express();

server.use(express.json()); 

server.get('/', (req, res) => {
  res.status(200).json({ message: 'Api is running on port 4000' });
});

module.exports = server;