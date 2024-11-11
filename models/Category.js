const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    fotoUrl: { type: String, required: true },
});

module.exports = mongoose.model('Category', CategorySchema);