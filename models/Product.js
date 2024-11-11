const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    imagenes: [{ type: String, required: true }],
    marca: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
});

module.exports = mongoose.model('Product', ProductSchema);