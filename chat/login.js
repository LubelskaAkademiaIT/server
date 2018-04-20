const express = require('express')
const router = express.Router();
const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');
const fileDb = require('../file.db')('chat/sessions');

router.post('/', function (req, res) {
  fileDb.get().then((data = []) => {
    const token = uuidv1()+uuidv4();
    data.push({
      token,
      alias: req.body.alias || 'Unknown',
      id: uuidv1()
    });
    return { data, token };
  }).then(({data, token}) => {
    return fileDb.save(data).then(() => res.send({token}));
  });
});

module.exports = router