var About = require('../models/about');
var async = require('async');
var { body, validationResult } = require('express-validator');

// Display detail page
exports.index = function(req, res) {
    About.findOne({}, 'first_name last_name skills about_me phone_number email')
    .exec(function (err, results) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('index', { 
            first_name: results.first_name, 
            last_name: results.last_name, 
            skills: results.skills, 
            about_me: results.about_me,
            phone_number: results.phone_number,
            email: results.email
        });
    });
};

exports.about_update_get = function(req, res, next) {
    About.findOne({}, 'first_name last_name skills about_me phone_number email')
    .exec(function (err, results) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('about_form', { 
            first_name: results.first_name, 
            last_name: results.last_name, 
            skills: results.skills, 
            about_me: results.about_me,
            phone_number: results.phone_number,
            email: results.email
        });
    });
};

exports.about_update_post = async (req, res, next) => {
    let about = {};
        about.first_name = req.body.first_name;
        about.last_name = req.body.last_name;
        about.skills = req.body.skills;
        about.about_me = req.body.about_me;
        about.phone_number = req.body.phone_number;
        about.email = req.body.email;

        let query = 'first_name last_name skills about_me phone_number email';

        About.findOneAndUpdate(query, about, function(err) {
            if (err) { return next(err); }
            else {
                res.redirect('/home');
            }
        })
}

