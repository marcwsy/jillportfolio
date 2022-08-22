const mongoose = require("mongoose");
const Grid = require('gridfs-stream');

// Init gfs for each collection
let uploadConn;
let gfsM, gridfsbucketM;
let gfsA, gridfsbucketA;
let gfsI, gridfsbucketI;
let gfsP, gridfsbucketP;

const uri = 'mongodb+srv://marcsy:6162@cluster0.cghwluy.mongodb.net/?retryWrites=true&w=majority';
const connectDb = () => {
    try {
        // Create connection for each buckets
        mongoose.connect(uri, { useNewUrlParser: true , useUnifiedTopology: true});
        const conn = mongoose.connection;
        conn.on('open', () => {
            // stream
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

            gridfsbucketP = new mongoose.mongo.GridFSBucket(conn.db, {
                bucketName: 'profile'
            });
            gfsP = Grid(conn.db, mongoose.mongo);
            gfsP.collection('profile');
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
const getGfsP = () => gfsP;
const getBucketP = () => gridfsbucketP;

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
    getGfsP,
    getBucketM,
    getBucketA,
    getBucketI,
    getBucketP,
    infoDb, 
    mongooseConn 
};
