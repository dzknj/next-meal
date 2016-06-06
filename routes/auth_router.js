const express = require('express');
const Organization = require(__dirname + '/../models/organization');
const jsonParser = require('body-parser').json();
const basicHTTP = require(__dirname + '/../lib/basic_http');

var router = module.exports = exports = express.Router();

router.post('/signup', jsonParser, (req, res) => {
  var password = req.body.password;
  req.body.password = null;
  if (!password) return res.status(500).json({msg: 'password field must not be empty'});

  var newOrganization = new Organization(req.body);
  newOrganization.generateHash(password);
  password = null;

  newOrganization.save((err, data) => {
    if (err) return res.status(500).json({msg: err});
    res.json({msg: 'user created!'});
  });
});
router.get('/signin', basicHTTP, (req, res) => {
  Organization.findOne({organizationName: req.auth.organizationName}, (err, user) => {
    if (err) return res.status(500).json({msg: 'authentication failed, db error'});
    if (!user) return res.status(500).json({msg: 'authentication failed, no user'});
    if (!user.compareHash(req.auth.password)) return res.status(500).json({msg: 'authentication failed on compareHash'})
    res.json({msg: 'authentication success'})
  });
  // res.end();
});
