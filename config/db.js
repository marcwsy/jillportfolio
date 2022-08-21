const mongoose = require("mongoose");
const Grid = require('gridfs-stream');

// Init gfs
let uploadConn;
let gfsM, gridfsbucketM;
let gfsA, gridfsbucketA;
let gfsI, gridfsbucketI;

const uri = 'mongodb+srv://marcsy:6162@cluster0.cghwluy.mongodb.net/?retryWrites=true&w=majority';
const connectDb = () => {
    try {
        // Create connection
        mongoose.connect(uri, { useNewUrlParser: true , useUnifiedTopology: true});
        const conn = mongoose.connection;
        conn.on('open', () => {
            gridfsbucketM = new mongoose.mongo.GridFSBucket(conn.db, {
                bucketName: 'modeling'
            });
            gfsM = Grid(conn.db, mongoose.mongo);
            gfsM.collection('modeling');

            gridfsbucketA = new mongoose.mongo.GridFSBucket(conn.db, {
                bucketName: 'animation'
            });
            gfsA = Grid(conn.db, mongoose.mongo);
            gfsA.collection('animation');

            gridfsbucketI = new mongoose.mongo.GridFSBucket(conn.db, {
                bucketName: 'illustration'
            });
            gfsI = Grid(conn.db, mongoose.mongo);
            gfsI.collection('illustration');
        });
            console.log("MongoDB GridFS Connected");

        } catch (error) {
            console.error(error.message);
            process.exit(1);
        }
};

const getGfsM = () => gfsM;
const getBucketM = () => gridfsbucketM;
const getGfsA = () => gfsA;
const getBucketA = () => gridfsbucketA;
const getGfsI = () => gfsI;
const getBucketI = () => gridfsbucketI;


const infoDb = () => {
    mongoose.connect(uri, { useNewUrlParser: true , useUnifiedTopology: true});
    const conn = mongoose.connection;
    uploadConn = conn;
    conn.on('error', console.error.bind(console, 'MongoDB connection error:'));
};

const mongooseConn = () => uploadConn;

module.exports = { 
    connectDb, 
    getGfsM,
    getGfsA,
    getGfsI,
    getBucketM,
    getBucketA,
    getBucketI,
    infoDb, 
    mongooseConn 
};
