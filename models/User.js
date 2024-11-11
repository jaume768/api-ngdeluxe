const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    rol: { type: String, enum: ['normal', 'admin'], default: 'normal' },
});

// Encriptar la contraseña antes de guardarla
UserSchema.pre('save', async function (next) {
    if (!this.isModified('contraseña')) return next();
    const salt = await bcrypt.genSalt(10);
    this.contraseña = await bcrypt.hash(this.contraseña, salt);
    next();
});

module.exports = mongoose.model('User', UserSchema);