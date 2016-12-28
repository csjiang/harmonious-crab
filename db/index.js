const db = require('./_db');

require('./models');

// for testing
// module.exports = db; 


var syncedDbPromise = db.sync({ force: true });

syncedDbPromise.then(function () {
  console.log('Sequelize models synced to PostgreSQL');
});

module.exports = syncedDbPromise;