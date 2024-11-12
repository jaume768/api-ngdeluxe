const Brand = require('../models/Brand');
const Category = require('../models/Category');

exports.createBrand = async (req, res) => {
    const { nombre, fotoUrl, categoria } = req.body;

    try {
        const category = await Category.findById(categoria);
        if (!category) {
            return res.status(400).json({ msg: 'Categoría no encontrada' });
        }

        const brand = new Brand({
            nombre,
            fotoUrl,
            categoria,
        });

        await brand.save();
        res.status(201).json(brand);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
};

exports.getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find().populate('categoria', 'nombre');
        res.json(brands);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
};

exports.getBrandById = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id).populate('categoria', 'nombre');
        if (!brand)
            return res.status(404).json({ msg: 'Marca no encontrada' });
        res.json(brand);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId')
            return res.status(404).json({ msg: 'Marca no encontrada' });
        res.status(500).send('Error en el servidor');
    }
};

exports.updateBrand = async (req, res) => {
    const { nombre, fotoUrl, categoria } = req.body;

    const brandFields = {};
    if (nombre) brandFields.nombre = nombre;
    if (fotoUrl) brandFields.fotoUrl = fotoUrl;
    if (categoria) brandFields.categoria = categoria;

    try {
        let brand = await Brand.findById(req.params.id);
        if (!brand)
            return res.status(404).json({ msg: 'Marca no encontrada' });

        if (categoria) {
            const category = await Category.findById(categoria);
            if (!category) {
                return res.status(400).json({ msg: 'Categoría no encontrada' });
            }
        }

        brand = await Brand.findByIdAndUpdate(
            req.params.id,
            { $set: brandFields },
            { new: true }
        );

        res.json(brand);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId')
            return res.status(404).json({ msg: 'Marca no encontrada' });
        res.status(500).send('Error en el servidor');
    }
};

exports.deleteBrand = async (req, res) => {
    try {
        let brand = await Brand.findById(req.params.id);
        if (!brand)
            return res.status(404).json({ msg: 'Marca no encontrada' });

        await Brand.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Marca eliminada' });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId')
            return res.status(404).json({ msg: 'Marca no encontrada' });
        res.status(500).send('Error en el servidor');
    }
};