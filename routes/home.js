var express = require('express');
var router = express.Router();


// Require controller modules.
var about_controller = require('../controllers/aboutController');

/// ROUTES ///

// GET home page.
router.get('/', about_controller.index);

// // GET request for creating a about. NOTE This must come before routes that display about (uses id).
// router.get('/about/create', about_controller.about_create_get);

// // POST request for creating about.
// router.post('/about/create', about_controller.about_create_post);

// // GET request to delete about.
// router.get('/about/:id/delete', about_controller.about_delete_get);

// // POST request to delete about.
// router.post('/about/:id/delete', about_controller.about_delete_post);

// GET request to update about.
router.get('/update', ensureAuthenticated, about_controller.about_update_get);

// // POST request to update about.
router.post('/update', ensureAuthenticated, about_controller.about_update_post);

// // GET request for one about.
// router.get('/about/:id', about_controller.about_detail);

// GET request for list of all about items.
// router.get('/abouts', about_controller.about_list);


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login.');
        res.redirect('/home');
    }
}

module.exports = router;