const async = require('async');
const { body, validationResult } = require('express-validator');
const { infoDb } = require('../config/db');
require("../models/about");
require("../models/messages");
const About = require('mongoose').model('About');
const Messages = require('mongoose').model('Messages');
const mongoose = require('mongoose');


infoDb();

// Display all of information from About 
exports.index = function(req, res) {
    About.findOne({}, 'first_name last_name skills adobe maya unreal zbrush about_me phone_number email')
    .exec(function (err, results) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('index', { 
            first_name: results.first_name, 
            last_name: results.last_name, 
            skills: results.skills,
            adobe: results.adobe,
            maya: results.maya,
            unreal: results.unreal,
            zbrush: results.zbrush, 
            about_me: results.about_me,
            phone_number: results.phone_number,
            email: results.email
        });
    });
};

// About information update form
exports.about_update_get = function(req, res, next) {
    About.findOne({}, 'first_name last_name skills adobe maya unreal zbrush about_me phone_number email')
    .exec(function (err, results) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('about_form', { 
            first_name: results.first_name, 
            last_name: results.last_name, 
            skills: results.skills,
            adobe: results.adobe,
            maya: results.maya,
            unreal: results.unreal,
            zbrush: results.zbrush,
            about_me: results.about_me,
            phone_number: results.phone_number,
            email: results.email
        });
    });
};

// About information handle update post
exports.about_update_post = async (req, res) => {
    let about = {};
        about.first_name = req.body.first_name;
        about.last_name = req.body.last_name;
        about.skills = req.body.skills;
        about.adobe = req.body.adobe;
        about.maya = req.body.maya;
        about.unreal = req.body.unreal;
        about.zbrush = req.body.zbrush;
        about.about_me = req.body.about_me;
        about.phone_number = req.body.phone_number;
        about.email = req.body.email;

        let query = 'first_name last_name skills adobe maya unreal zbrush about_me phone_number email';

        About.findOneAndUpdate(query, about, function(err) {
            if (err) { return next(err); }
            else {
                res.redirect('/home');
            }
        })
}

exports.messages_update_post = async (req, res) => {
    let messages = new Messages();
    messages.full_name = req.body.full_name;
    messages.email = req.body.email;
    messages.subject = req.body.subject;
    messages.message_inquiry = req.body.message_inquiry;

    try {
        const newMessage = await messages.save();
        req.flash('success', 'Your message has been sent.');
        res.redirect('/home');
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
};

exports.get_files = function(req, res) {
    Messages.find({}, 'full_name email subject message_inquiry date_added').sort({date_added: -1})
    .exec(function (err, results) {
        if (err) { return next(err); }
        res.render('message_inquiries', {results: results})
    });
};

exports.get_files_id = ({ params: { id } }, res) => {
  
    const _id = new mongoose.Types.ObjectId(id);
    
    Messages.find({ _id }, (err, results) => {
      if (!results || results.length === 0)
        return res.status(404).json({
            err: 'No files exist'
        });
      // File exists
      res.json(results);
    });
};

exports.delete_msg = ({ params: { id } }, res) => {

    const _id = new mongoose.Types.ObjectId(id);

  Messages.deleteOne({_id}, (err, results) => {
      if (err) {
        return res.status(404).json({
          err: 'No files exist'
        });
      }
      res.redirect('/home/message_inquiries');
  });
};