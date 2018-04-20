const express = require('express')
const router = express.Router();
const fileDb = require('../file.db')('simplepage/pages');

// define the home page route
router.get('/:page', function (req, res) {
  fileDb.get().then((data) => {
    const page = data[req.params.page];
    if (!page) {
      res.status(404).send('No such page');
    }
    res.contentType("html").send(page);
  });
});

module.exports = router;