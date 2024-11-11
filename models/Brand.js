const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    fotoUrl: { type: String, required: true },
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
});

module.exports = mongoose.model('Brand', BrandSchema);
