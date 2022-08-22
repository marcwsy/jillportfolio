const express = require('express');
const router = express.Router();
const upload = require('../middleware/modelingMiddleware');
const upload_controller = require('../controllers/uploadController');

/**************************
 
 THIS FILE IS NOT USED, IT WAS FOR PRACTICE 

***************************/

router.get('/', upload_controller.get_form);

router.post('/upload', upload.single('file'), upload_controller.upload_single);

router.get('/files', upload_controller.get_files);

router.get('/files/:id', upload_controller.get_files_id);

router.get('/image/:id', upload_controller.get_image_id);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login.');
        res.redirect('/file');
    }
};

module.exports = router;
