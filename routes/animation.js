const express = require('express');
const router = express.Router();
const upload = require('../middleware/animationMiddleware');
const animation_controller = require('../controllers/animationController');

// route to get the upload form, needs authentication
router.get('/upload', ensureAuthenticated, animation_controller.get_form);

// show page
router.get('/', animation_controller.get_page);

// upload images
router.post('/', upload.single('file'), animation_controller.upload_single);

// route test to get files
router.get('/files', animation_controller.get_files);

// route to get specific image with id
router.get('/files/:id', animation_controller.get_files_id);

// showcase image on page
router.get('/image/:id', animation_controller.get_image_id);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login.');
        res.redirect('/animation');
    }
};

module.exports = router;
