const express = require('express');
const router = express.Router();
const upload = require('../middleware/modelingMiddleware');
const modeling_controller = require('../controllers/modelingController');

// route to get the upload form, needs authentication
router.get('/upload', ensureAuthenticated, modeling_controller.get_form);

// show page
router.get('/', modeling_controller.get_page);

// upload images
router.post('/', upload.single('file'), modeling_controller.upload_single);

// route test to get files
router.get('/files', modeling_controller.get_files);

// route to get specific image with id
router.get('/files/:id', modeling_controller.get_files_id);

// showcase image on page
router.get('/image/:id', modeling_controller.get_image_id);

// delete image
router.delete('/files/:id', ensureAuthenticated, modeling_controller.delete_image);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login.');
        res.redirect('/modeling');
    }
};

module.exports = router;
