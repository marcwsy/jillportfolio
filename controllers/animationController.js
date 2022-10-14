const { getGfsA, getBucketA, connectDb } = require("../config/db");
const upload = require('../middleware/animationMiddleware');
const mongoose = require('mongoose');

// generate form view
exports.get_form = (req, res) => {
    getGfsA().files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            res.render('animation_form', { files: false });
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
            res.render('animation_form', { files: files });
        }
    });
};

// generate page where image is displayed
exports.get_page = (req, res) => {
    getGfsA().files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            res.render('animation', { files: false });
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
            res.render('animation', { files: files });
        }
    });
};

// upload image and redirect back to original page
exports.upload_single = (req, res) => {
        upload.single('file');
        res.redirect('/animation');
};

// get files test
exports.get_files = (req, res) => {
    getGfsA().files.find().toArray((err, files) => {
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

// get specific image file test
exports.get_files_id = ({ params: { id } }, res) => {
  
    const _id = new mongoose.Types.ObjectId(id);
    
    getBucketA().find({ _id }).toArray((err, files) => {
      if (!files || files.length === 0)
        return res.status(400).send('no files exist');
      // File exists
      return res.json(files);
    });
};

// display specific image on display page
exports.get_image_id = ({ params: { id } }, res) => {
    if (!id || id === 'undefined') return res.status(400).send('no image id');
  
      const _id = new mongoose.Types.ObjectId(id);
  
      getBucketA().find({ _id }).toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No files exist'
        });
      }

      getBucketA().openDownloadStream(_id).pipe(res);
    });
};

exports.delete_image = ({ params: { id } }, res) => {

      const _id = new mongoose.Types.ObjectId(id);

    getGfsA().files.deleteOne({_id}, (err, gridStore) => {
        if (err) {
          return res.status(404).json({
            err: 'No files exist'
          });
        }
        res.redirect('/animation');
    });
};