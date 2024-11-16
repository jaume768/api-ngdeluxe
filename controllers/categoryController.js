const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    const { nombre, fotoUrl, order } = req.body;

    try {
        let categoryOrder = order;
        if (order === undefined || order === null) {
            const lastCategory = await Category.findOne().sort('-order');
            categoryOrder = lastCategory ? lastCategory.order + 1 : 0;
        }

        const newCategory = new Category({
            nombre,
            fotoUrl,
            order: categoryOrder,
        });

        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort('order');
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
    const { nombre, fotoUrl, order } = req.body;

    const categoryFields = {};
    if (nombre) categoryFields.nombre = nombre;
    if (fotoUrl) categoryFields.fotoUrl = fotoUrl;
    if (order !== undefined && order !== null) categoryFields.order = order;

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

        await Category.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Categoría eliminada' });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId')
            return res.status(404).json({ msg: 'Categoría no encontrada' });
        res.status(500).send('Error en el servidor');
    }
};