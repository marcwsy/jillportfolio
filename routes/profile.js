const express = require('express');
const router = express.Router();
const upload = require('../middleware/profileMiddleware');
const profile_controller = require('../controllers/profileController');

/**************************
 
 THIS FILE IS NOT USED, IT WAS FOR PRACTICE 

***************************/

router.get('/upload', ensureAuthenticated, profile_controller.get_form);

router.get('/', profile_controller.get_page);

router.post('/', upload.single('file'), profile_controller.upload_single);

router.get('/files', profile_controller.get_files);

router.get('/files/:id', profile_controller.get_files_id);

router.get('/image/:id', profile_controller.get_image_id);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login.');
        res.redirect('/modeling');
    }
};

module.exports = router;
