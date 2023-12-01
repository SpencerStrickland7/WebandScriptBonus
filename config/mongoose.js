const mongoose = require('mongoose');
const DB = require('./db');

mongoose.connect(DB.URI, { useNewUrlParser: true, useUnifiedTopology: true });

const dbConnection = mongoose.connection;

dbConnection.on('error', console.error.bind(console, 'Connection Error'));
dbConnection.once('open', () => {
  console.log('Mongo DB is connected');
});


module.exports = mongoose;