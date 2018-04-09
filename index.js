const express = require('express')
const app = express();
const config = require('./config');
const todo = require('./todoapp/routes');
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json

app.all('*', (req, res, next) => {
  setTimeout(next, config.delay); //delay for all responses
});
app.get('/', (req, res) => res.send('Hello LaiT server is working'));

app.use('/todo', todo);

app.listen(3000, () => console.log('Lait server listening on port 3000!'));