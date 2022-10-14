const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
    {
        full_name: {type: String, required: true, maxLength: 100},
        email: {type: String, required: true, maxLength: 100},
        subject: {type: String, required: true, maxLength: 100},
        message_inquiry: {type: String, required: true, maxLength: 1000},
        date_added: {type: Date, required: true, default: Date.now}
    }
);

MessageSchema
.virtual('url')
.get(() => {
    return this._id;
});

MessageSchema
.virtual('date_formatted')
.get(function () {
    return DateTime.fromJSDate(this.date_added).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Messages', MessageSchema);