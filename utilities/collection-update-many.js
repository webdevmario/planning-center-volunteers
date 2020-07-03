/**
 * remove - remove documents based on parameters
 */

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';

MongoClient.connect(url, function(err, db) {
  if (err) throw err;

  const dbo = db.db('shoreline');
  const query = { time: '17:15:00' };
  const update = {
    $set: {
      time: '17:30:00'
    }
  };

  dbo.collection('teams').updateMany(query, update, function(err, obj) {
    if (err) throw err;

    console.log(`documents updated: ${obj.deletedCount}`);

    db.close();
  });
});
