require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = express.Router();
const axios = require('axios');
const nodemailer = require("nodemailer");

const app = express();

const connection = mongoose.connection;
const db = process.env.DATABASE;

mongoose.connect(db, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

connection.once('open', () => {
  console.log('MongoDB database connection established successfully.');
});

app.use(cors());
app.use(express.json({ extended: false }));

const ChurchSchema = new mongoose.Schema({});

const Leads = mongoose.model('Leads', ChurchSchema);
const Teams = mongoose.model('Teams', ChurchSchema);
const Templates = mongoose.model('Templates', ChurchSchema);

app.use('/teams', function(req, res, next) {
  Teams.find({}, function(err, teams) {
    if (err) throw err;

    console.log("teams check", teams);

    res.json(teams);
  });
});

app.use('/leads', function(req, res, next) {
  Leads.find({}, function(err, leads) {
    if (err) throw err;

    console.log('leads check', leads);

    res.json(leads);
  });
});

app.use('/templates', function(req, res, next) {
  Templates.find({}, function(err, templates) {
    if (err) throw err;

    console.log('templates check', templates);

    res.json(templates);
  });
});

app.use('/church', function (req, res, next) {
  const url = process.env.API_URL + ((req.url !== '/') ? req.url + '&include=emails,phone_numbers' : '');

  try {
    axios
      .get(url, {
        auth: {
          username: process.env.API_USERNAME,
          password: process.env.API_PASSWORD
        }
      })
      .then(response => {
        res.json(response.data);
      })
      .catch(err => {
        console.error('err', err.message);
      })
  } catch (err) {
    console.error('err', err);
  }
});

app.use('/email', function (req, res, next) {
  let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const message = {
    from: process.env.EMAIL_USER, // Sender address
    to: process.env.EMAIL_USER, // List of recipients
    subject: 'Design Your Model S | Tesla', // Subject line
    text: 'Have the most fun you can in a car. Get your Tesla today!' // Plain text body
  };

  transport.sendMail(message, function(err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});
