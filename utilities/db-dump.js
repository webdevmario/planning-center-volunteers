/**
 * dump - pull down a copy of local database
 */

// node modules
const exec = require('child_process').exec;

// data
const command = `mongodump --db shoreline -o ~/Desktop`;

exec(command, (err, stdout, stderr) => {
  console.log('err: ', err);
  console.log('stdout: ', stdout);
  console.log('stderr: ', stderr);
});
