var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
                                         pseudo: String,
                                         email: String,
                                         password: String,
                                         amis: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
                                         updated_at: { type: Date, default: Date.now }
                                         });

module.exports = mongoose.model('User', UserSchema);

