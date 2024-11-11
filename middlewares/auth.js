const jwt = require('jsonwebtoken');

exports.verificaToken = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token)
    return res.status(401).json({ msg: 'No hay token, permiso denegado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Token no válido' });
  }
};

exports.verificaAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado, no eres administrador' });
  }
  next();
};
