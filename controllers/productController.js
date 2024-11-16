const Product = require('../models/Product');
const Brand = require('../models/Brand');

exports.createProduct = async (req, res) => {
    const { nombre, imagenes, marca } = req.body;

    try {
        const brand = await Brand.findById(marca);
        if (!brand) {
            return res.status(400).json({ msg: 'Marca no encontrada' });
        }

        const product = new Product({
            nombre,
            imagenes,
            marca,
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error(error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ msg: error.message });
        }
        res.status(500).send('Error en el servidor');
    }
};

exports.getProductsByBrand = async (req, res) => {
    const { brandId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    try {
        const brand = await Brand.findById(brandId);
        if (!brand) {
            return res.status(404).json({ msg: 'Marca no encontrada' });
        }

        const products = await Product.find({ marca: brandId })
            .populate('marca', 'nombre')
            .sort({ _id: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Product.countDocuments({ marca: brandId });

        res.json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            products,
        });
    } catch (error) {
        console.error('Error al obtener productos por marca:', error.message);
        res.status(500).send('Error en el servidor');
    }
};

exports.getRandomProductsByBrand = async (req, res) => {
    const { brandId, excludeId } = req.params;

    try {
        const brand = await Brand.findById(brandId);
        if (!brand) {
            return res.status(404).json({ msg: 'Marca no encontrada' });
        }

        const products = await Product.find({ marca: brandId, _id: { $ne: excludeId } });
        
        const shuffled = products.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4);

        res.json(selected);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
};


exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('marca', 'nombre');
        res.json(products);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('marca', 'nombre');
        if (!product)
            return res.status(404).json({ msg: 'Producto no encontrado' });
        res.json(product);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId')
            return res.status(404).json({ msg: 'Producto no encontrado' });
        res.status(500).send('Error en el servidor');
    }
};

exports.updateProduct = async (req, res) => {
    const { nombre, imagenes, marca } = req.body;

    const productFields = {};
    if (nombre) productFields.nombre = nombre;
    if (imagenes) productFields.imagenes = imagenes;
    if (marca) productFields.marca = marca;

    try {
        let product = await Product.findById(req.params.id);
        if (!product)
            return res.status(404).json({ msg: 'Producto no encontrado' });

        if (marca) {
            const brand = await Brand.findById(marca);
            if (!brand) {
                return res.status(400).json({ msg: 'Marca no encontrada' });
            }
        }

        product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: productFields },
            { new: true }
        );

        res.json(product);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId')
            return res.status(404).json({ msg: 'Producto no encontrado' });
        res.status(500).send('Error en el servidor');
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product)
            return res.status(404).json({ msg: 'Producto no encontrado' });

        await Product.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Producto eliminado' });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId')
            return res.status(404).json({ msg: 'Producto no encontrado' });
        res.status(500).send('Error en el servidor');
    }
};