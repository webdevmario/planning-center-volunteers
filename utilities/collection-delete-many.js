/**
 * remove - remove documents based on parameters
 */

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';

MongoClient.connect(url, function(err, db) {
  if (err) throw err;

  const dbo = db.db('shoreline');
  const myquery = { time: '18:45:00' };

  dbo.collection('teams').deleteMany(myquery, function(err, obj) {
    if (err) throw err;

    console.log(`documents deleted: ${obj.deletedCount}`);

    db.close();
  });
});
