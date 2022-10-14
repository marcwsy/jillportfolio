const express = require('express');
const router = express.Router();
const upload = require('../middleware/illustrationMiddleware');
const illustration_controller = require('../controllers/illustrationController');

// route to get the upload form, needs authentication
router.get('/upload', ensureAuthenticated, illustration_controller.get_form);

// show page
router.get('/', illustration_controller.get_page);

// upload images
router.post('/', upload.single('file'), illustration_controller.upload_single);

// route test to get files
router.get('/files', illustration_controller.get_files);

// route to get specific image with id
router.get('/files/:id', illustration_controller.get_files_id);

// showcase image on page
router.get('/image/:id', illustration_controller.get_image_id);

// delete image
router.delete('/files/:id', ensureAuthenticated, illustration_controller.delete_image);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login.');
        res.redirect('/illustration');
    }
};

module.exports = router;
