const mongoose = require('mongoose');
const options = {
    discriminatorKey: 'userType',
    collection: 'users'
  };

const UserSchema = new mongoose.Schema({
  role: { type: String, enum: ['superadmin','employee', 'guest', 'member'], default: 'guest'},
  email: {type: String, default: ''},
  street: {type: String, default: ''},
  apt: {type: String, default: ''},
  city: {type: String, default: ''},
  state: {type: String, default: ''},
  zip: {type: String, default: ''},
  tempToken: {type: String, default: null}
}, {
    timestamps: true
});
const User = mongoose.model('User', UserSchema);

const Member = User.discriminator('Member', new mongoose.Schema({
    cart: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
    orders: [{type: mongoose.Schema.Types.ObjectId, ref:'Order'}],
    favorites: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
    password: {type: String, select: false}
}));

var exports = {'Guest': User, 'Member': Member};
module.exports = exports;
