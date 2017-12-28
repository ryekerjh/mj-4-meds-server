let mongoose = require('mongoose');

const PasswordSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        expired: { type: Boolean, default: false }   
    }, 
    {
    timestamps: {
        createdAt: 'created_on',
        updatedAt: 'updated_on'
    }
});

let Password = mongoose.model('Password', PasswordSchema);

module.exports = Password;