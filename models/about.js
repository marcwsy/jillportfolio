const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AboutSchema = new Schema(
    {
        first_name: {type: String, required: true, maxLength: 100},
        last_name: {type: String, required: true, maxLength: 100},
        skills: {type: String, required: true, maxLength: 100},
        adobe: {type: String, required: true, maxLength: 250},
        maya: {type: String, required: true, maxLength: 250},
        unreal: {type: String, required: true, maxLength: 250},
        zbrush: {type: String, required: true, maxLength: 250},
        about_me: {type: String, required: true, maxLength: 2000},
        phone_number: {type: Number, required: true, maxLength: 10},
        email: {type: String, required: true, maxLength: 100},
    }
);

AboutSchema
.virtual('url')
.get(() => {
    return this._id;
});


module.exports = mongoose.model('About', AboutSchema);