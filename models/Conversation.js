var mongoose = require('mongoose');
var Message = require('./Message.js');
var User = require('./User.js');

var ConversationSchema = new mongoose.Schema({
                                         name: String,
                                         data: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
                                         participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
                                         updated_at: { type: Date, default: Date.now }
                                         });

module.exports = mongoose.model('Conversation', ConversationSchema);

