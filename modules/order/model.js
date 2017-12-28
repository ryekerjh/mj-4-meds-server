let mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
        customer: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
        items: [
            {
                item: {type: mongoose.Schema.Types.ObjectId, ref:'Product'},
                quantity: {type: Number, default: null}
            }
        ],
        tax: { type: Number, default: null },
        total: { type: Number, default: null },
        dateOrdered: { type: Date, default: null },
        notes: { type: String, default: null },
        paymentMethod: { type: String, enum: ['visa','mastercard', 'paypal'], default: 'null'},
    },
    {
        timestamps: true
    });

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;