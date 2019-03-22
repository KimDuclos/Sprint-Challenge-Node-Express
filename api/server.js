// require express
const express = require('express');
const server = express();

// express uses JSON
server.use(express.json()); 

// confirmation that server is running
server.get('/', (req, res) => {
  res.status(200).json({ message: 'Api is running on port 4000' });
});

module.exports = server;