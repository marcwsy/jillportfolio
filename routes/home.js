const express = require('express');
const router = express.Router();
const about_controller = require('../controllers/aboutController');

// get homepage
router.get('/', about_controller.index);

// get the form to update, needs authentication
router.get('/update', ensureAuthenticated, about_controller.about_update_get);

// updates the homepage, needs authentication
router.post('/update', ensureAuthenticated, about_controller.about_update_post);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login.');
        res.redirect('/home');
    }
}

module.exports = router;