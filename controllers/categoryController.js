const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    const { nombre, fotoUrl } = req.body;

    try {
        const category = new Category({
            nombre,
            fotoUrl,
        });

        await category.save();
        res.status(201).json(category);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category)
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        res.json(category);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId')
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        res.status(500).send('Error en el servidor');
    }
};

exports.updateCategory = async (req, res) => {
    const { nombre, fotoUrl } = req.body;

    const categoryFields = {};
    if (nombre) categoryFields.nombre = nombre;
    if (fotoUrl) categoryFields.fotoUrl = fotoUrl;

    try {
        let category = await Category.findById(req.params.id);
        if (!category)
            return res.status(404).json({ msg: 'Categoría no encontrada' });

        category = await Category.findByIdAndUpdate(
            req.params.id,
            { $set: categoryFields },
            { new: true }
        );

        res.json(category);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId')
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        res.status(500).send('Error en el servidor');
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        let category = await Category.findById(req.params.id);
        if (!category)
            return res.status(404).json({ msg: 'Categoría no encontrada' });

        await Category.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Categoría eliminada' });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId')
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        res.status(500).send('Error en el servidor');
    }
};