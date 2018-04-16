const express = require('express')
const router = express.Router();
const uuidv1 = require('uuid/v1');
const fileDb = require('../file.db')('chat/sessions');

router.post('/login', function (req, res) {
  fileDb.get().then((data = []) => {
    const token = uuidv1();
    data.push({
      token,
      alias: req.body.alias || 'Unknown'
    });
    return { data, token };
  }).then(({data, token}) => {
    return fileDb.save(data).then(() => res.send({token}));
  });
});

router.delete('/logout/:token', function (req, res) {
  fileDb.get()
  .then((data = []) => data.filter(user => user.token !== req.params.token))
  .then((data) => fileDb.save(data))
  .then(() => res.send('User session is over'));
});


module.exports = router