const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { User } = require('../models/user');
const { body, validationResult } = require('express-validator');

// Register Form
router.get('/register', async (req, res) => {
  res.render('register');
});

// Register Proccess
router.post('/register', async (req, res) => {

  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  // let errors = req.validationErrors();
  let errors = req.validationResult();

  if (errors) {
    res.render('register', {
      errors: errors
    });
  } else {
    const salt = await bcrypt.genSalt(10);
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, salt)
    });
    newUser.save();
    req.flash('success', 'You are now registered and can log in.');
    res.redirect('/users/login');
  }
});


// Login Form
router.get('/login', (req, res) => {
  res.render('login');
});

// Login Process
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// logout
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success', 'You are logged out.');
    res.redirect('/users/login');
  });

});

module.exports = router;