var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AboutSchema = new Schema(
    {
        first_name: {type: String, required: true, maxLength: 100},
        last_name: {type: String, required: true, maxLength: 100},
        skills: {type: String, required: true, maxLength: 100},
        about_me: {type: String, required: true, maxLength: 1000},
        phone_number: {type: Number, required: true, maxLength: 10},
        email: {type: String, required: true, maxLength: 100},
    }
);

AboutSchema
.virtual('url')
.get(() => {
    return this._id;
});

AboutSchema
.virtual('phone_formatted')
.get(() => {
    let cleaned = ('' + this.phone_number).replace(/\D/g, '');
    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    }
    return null;
});

module.exports = mongoose.model('About', AboutSchema);