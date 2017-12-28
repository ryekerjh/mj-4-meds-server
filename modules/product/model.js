let mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
        name: { type: String, default: null},
        price: { type: Number, default: null },
        dateAdded: { type: Date, default: null },
        details: { type: String, default: null },
        imageUrl: { type: String, default: null },
        featured: { type: Boolean, default: false}
    },
    {
        timestamps: true
    });

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;