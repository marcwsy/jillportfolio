const { getGfsP, getBucketP, connectDb } = require("../config/db");
const upload = require('../middleware/profileMiddleware');
const mongoose = require('mongoose');

exports.get_form = (req, res) => {
    getGfsP().files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        res.render('profile_form', { files: false });
      } else {
        files.map(file => {
          if (
            file.contentType === 'image/jpeg' ||
            file.contentType === 'image/png'
          ) {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
        });
        res.render('profile_form', { files: files });
      }
    });
};

exports.get_page = (req, res) => {
  getGfsP().files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
          res.render('index', { files: false });
      } else {
          files.map(file => {
          if (
              file.contentType === 'image/jpeg' ||
              file.contentType === 'image/png'
          ) {
              file.isImage = true;
          } else {
              file.isImage = false;
          }
          });
          res.render('index', { files: files });
      }
  });
};

exports.upload_single = (req, res) => {
        upload.single('file');
    // res.json({ file: req.file });
        res.redirect('/home');
};

exports.get_files = (req, res) => {
    getGfsP().files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No files exist'
        });
      }
  
      // Files exist
      return res.json(files);
    });
};

exports.get_files_id = ({ params: { id } }, res) => {
  
    const _id = new mongoose.Types.ObjectId(id);
    
    getBucketP().find({ _id }).toArray((err, files) => {
      if (!files || files.length === 0)
        return res.status(400).send('no files exist');
      // File exists
      return res.json(files);
    });
};

exports.get_image_id = ({ params: { id } }, res) => {
    if (!id || id === 'undefined') return res.status(400).send('no image id');
  
      const _id = new mongoose.Types.ObjectId(id);
  
      getBucketP().find({ _id }).toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No files exist'
        });
      }
  
      getBucketP().openDownloadStream(_id).pipe(res);
    });
};