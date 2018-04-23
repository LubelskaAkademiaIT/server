const express = require('express')
const router = express.Router();
const uuidv1 = require('uuid/v1');
const fileDb = require('../file.db')('chat/chat');
const fileDbSessions = require('../file.db')('chat/sessions');

router.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    // respond success for preflight request
    res.send();
    return;
  }

  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'No authorization' });
  }
  next();
});

router.use((req, res, next) => {
  fileDbSessions.get().then((tokens) => {
    req.token = req.headers.authorization.match(/^Bearer[ ]{1}(.+)$/)[1];
    const userAuth = tokens.find((row) => row.token === req.token);
    if (!userAuth) {
      return res.status(403).json({ error: 'No access' });
    }
    req.userAuth = userAuth;
    next();
  });
});

// define the home page route
router.get('/', function (req, res) {
  fileDb.get().then((data) => {
    res.send(data.map(message => {
      const { authorId, ...rest } = message;
      rest.owner = authorId === req.userAuth.id;
      return rest; // remove authorId from response
    })
  );
  });
});

router.post('/', function (req, res) {
  
  fileDb.get().then((data = []) => {
    const id = uuidv1();
    data.push({
      id,
      message: req.body.message || 'I have nothing to say, sorry',
      author: req.userAuth.alias,
      authorId: req.userAuth.id
    });
    return { data, id };
  }).then(({data, id}) => {
    return fileDb.save(data).then(() => res.send({id}));
  });
});

router.delete('/:id', function (req, res) {
  fileDb.get().then((data = []) => {
    const removedTask = data.find((message) => message.id === req.params.id);
    if (!removedTask) {
      throw {code: 404, message: 'No such message'};
    }
    if (removedTask.authorId !== req.userAuth.id) {
      throw {code: 403, message: 'No rights to remove this message'};
    }
    const newdata = data.filter((message) => message.id !== req.params.id);
    return { data: newdata, id: req.params.id };
  }).then(({data, id}) => {
    return fileDb.save(data).then(() => res.send({id}));
  }).catch((e) => {
    res.status(e.code).send(e.message);
  });
});


module.exports = router