const exec = require('child_process').exec

// const command = `mongoimport --db shoreline --collection leads --drop --file ../data/leads.bson`;
// const command = `mongoimport --db shoreline --collection services --drop --file ../data/services.bson`;
// const command = `mongoimport --db shoreline --collection teams --drop --file ../data/teams.bson`;

const command = `mongoimport --db shoreline --collection templates --drop --file ../data/templates.bson`;

exec(command, (err, stdout, stderr) => {
  console.log('err: ', err)
  console.log('stdout: ', stdout)
  console.log('stderr: ', stderr)
})
