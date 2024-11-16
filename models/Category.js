const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    fotoUrl: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model('Category', CategorySchema);