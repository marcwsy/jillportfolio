const express = require('express');
const router = express.Router();
const upload = require('../middleware/modelingMiddleware');
const modeling_controller = require('../controllers/modelingController');

router.get('/upload', ensureAuthenticated, modeling_controller.get_form);

// (req, res) => {
//     getGfs().files.find().toArray((err, files) => {
//       // Check if files
//       if (!files || files.length === 0) {
//         res.render('upload_form', { files: false });
//       } else {
//         files.map(file => {
//           if (
//             file.contentType === 'image/jpeg' ||
//             file.contentType === 'image/png'
//           ) {
//             file.isImage = true;
//           } else {
//             file.isImage = false;
//           }
//         });
//         res.render('upload_form', { files: files });
//       }
//     });
// });
router.get('/', modeling_controller.get_page);

router.post('/', upload.single('file'), modeling_controller.upload_single);

// router.post('/upload', upload.single('file'), (req, res) => {
//     // res.json({ file: req.file });
//       res.redirect('/file/files');
// });
  
router.get('/files', modeling_controller.get_files);

// (req, res) => {
//     getGfs().files.find().toArray((err, files) => {
//       // Check if files
//       if (!files || files.length === 0) {
//         return res.status(404).json({
//           err: 'No files exist'
//         });
//       }
  
//       // Files exist
//       return res.json(files);
//     });
// });
  
router.get('/files/:id', modeling_controller.get_files_id);

// ({ params: { id } }, res) => {
  
//     const _id = new mongoose.Types.ObjectId(id);
    
//     getBucket().find({ _id }).toArray((err, files) => {
//       if (!files || files.length === 0)
//         return res.status(400).send('no files exist');
//       // File exists
//       return res.json(files);
//     });
// });
  
router.get('/image/:id', modeling_controller.get_image_id);

// ({ params: { id } }, res) => {
//     if (!id || id === 'undefined') return res.status(400).send('no image id');
  
//       const _id = new mongoose.Types.ObjectId(id);
  
//       getBucket().find({ _id }).toArray((err, files) => {
//       if (!files || files.length === 0) {
//         return res.status(404).json({
//           err: 'No files exist'
//         });
//       }
  
//       getBucket().openDownloadStream(_id).pipe(res);
//     });
// });

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login.');
        res.redirect('/modeling');
    }
};

module.exports = router;
