const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { User } = require('../models/user');
const { check, body, validationResult } = require('express-validator');

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

  // body('name', 'Name is required').notEmpty();
  // body('email', 'Email is required').notEmpty();
  // body('email', 'Email is not valid').isEmail();
  // body('username', 'Username is required').notEmpty();
  // body('password', 'Password is required').notEmpty();
  // body('password2', 'Passwords do not match').equals(req.body.password);

  body('name').notEmpty().withMessage('Name is required');
  body('email').notEmpty().withMessage('Email is required');
  body('email').isEmail().withMessage('Email is not valid');
  body('username').notEmpty().withMessage('Username is required');
  body('password').notEmpty().withMessage('Password is required');
  body('password2').equals(req.body.password).withMessage('Passwords do not match');

  let errors = validationResult(req);

  if (errors.isEmpty()) {
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