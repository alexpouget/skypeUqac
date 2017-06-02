var mongoose = require('mongoose');
var User = require('./User.js');

var MessageSchema = new mongoose.Schema({
                                         content: String,
                                         type: String,
                                         writer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                                         updated_at: { type: Date, default: Date.now }
                                         });

module.exports = mongoose.model('Message', MessageSchema);

