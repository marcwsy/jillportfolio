const mongoose = require('mongoose');
const config = require('./config/database');

let conn;

module.exports = {

    connectTo: ( callback ) => {
        mongoose.connect(config.database, { useNewUrlParser: true , useUnifiedTopology: true}, (err, callback) => {
            conn = mongoose.connection;
            return callback( err );
        });
    },

    getDb: () => {
        return conn;
    }
};