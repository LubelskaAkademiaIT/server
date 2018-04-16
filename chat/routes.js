const express = require('express')
const router = express.Router();
const uuidv1 = require('uuid/v1');
const fileDb = require('../file.db')('chat/chat');

const login = require('./login');
router.use(login);

// define the home page route
router.get('/', function (req, res) {
  fileDb.get().then((data) => {
    res.send(data);
  });
});

router.post('/', function (req, res) {
  
  fileDb.get().then((data = []) => {
    const id = uuidv1();
    data.push({
      id,
      task: req.body.task || 'No task info'
    });
    return { data, id };
  }).then(({data, id}) => {
    return fileDb.save(data).then(() => res.send({id}));
  });
  
});

router.put('/:id', function (req, res) {
  fileDb.get().then((data) => {
    if (!data) {
      throw new Error('No todo list')
    }
    const newdata = data.map((task) => {
      if (task.id === req.params.id) {
        return {
          id: task.id,
          task: req.body.task
        }
      }
      return task;
    });

    return { data: newdata, id: req.params.id };
  }).then(({data, id}) => {
    return fileDb.save(data).then(() => res.send({id}));
  }).catch((e) => {
    res.status(500).send(e.message);
  });
});

router.delete('/:id', function (req, res) {
  res.send('Todo DELETE')
});


module.exports = router