// simple file database
const path = require('path');
const fs = require('fs');

module.exports = (filename) => {
  const filepath = path.resolve(__dirname, filename + '.json');
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, ''); // create new file
  }

  return {
    get: () => new Promise((resolve, reject) => {
     fs.readFile(filepath, (err, data) => {
       if (err) {
         reject(err);
         return;
       }
       resolve(JSON.parse(data)); 
      }); 
    }),
    save: (data) => new Promise((resolve, reject) => {
      fs.writeFile(filepath, JSON.stringify(data), resolve); 
    })
  }
}