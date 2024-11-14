const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    imagenes: {
        type: [String],
        required: true,
        validate: {
            validator: function(v) {
                return Array.isArray(v) && v.length > 0;
            },
            message: 'El producto debe tener al menos una URL de imagen.'
        }
    },
    marca: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
});

module.exports = mongoose.model('Product', ProductSchema);