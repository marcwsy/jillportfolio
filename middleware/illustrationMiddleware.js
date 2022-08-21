const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;
const { mongooseConn } = require("../config/db");

const storage = new GridFsStorage({
    db: mongooseConn(),
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'illustration'
          };
          resolve(fileInfo);
        });
      });
    }
});

module.exports = multer({ storage });