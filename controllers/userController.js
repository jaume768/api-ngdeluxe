const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const { nombre, email, contraseña } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        user = new User({
            nombre,
            email,
            contraseña,
        });

        await user.save();

        const payload = {
            id: user.id,
            rol: user.rol,
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
};

exports.login = async (req, res) => {
    const { email, contraseña } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        const isMatch = await bcrypt.compare(contraseña, user.contraseña);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        const payload = {
            id: user.id,
            rol: user.rol,
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-contraseña');
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-contraseña');
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        res.status(500).send('Error en el servidor');
    }
};

exports.updateUser = async (req, res) => {
    const { nombre, email, rol } = req.body;

    const userFields = {};
    if (nombre) userFields.nombre = nombre;
    if (email) userFields.email = email;
    if (rol) userFields.rol = rol;

    try {
        let user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: userFields },
            { new: true }
        ).select('-contraseña');

        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        await User.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Usuario eliminado' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
};
