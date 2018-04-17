const express = require('express')
const app = express();
const config = require('./config');
const todo = require('./todoapp/routes');
const chat = require('./chat/routes');
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json

// allow cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.all('*', (req, res, next) => {
  setTimeout(next, config.delay); //delay for all responses
});
app.get('/', (req, res) => res.send('Hello LaiT server is working'));

app.use('/todo', todo);

app.use('/chat', chat);

app.listen(3000, () => console.log('Lait server listening on port 3000!'));