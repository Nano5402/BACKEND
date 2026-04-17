import jwt from 'jsonwebtoken';
import 'dotenv/config';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    // 1. Error: Token faltante
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            ok: false, 
            msn: "Acceso denegado. Token no proporcionado o formato inválido." 
        });
    }

    const token = authHeader.split(' ')[1]; 
    
    try {
        // VERIFICACIÓN REAL: Usamos la llave secreta del .env para desencriptar
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Inyectamos los datos del usuario (id y role) en la petición
        req.user = decoded; 
        
        next(); 
    } catch (error) {
        // CUMPLIMIENTO DE RÚBRICA: Diferenciar los errores exactos en estricto español
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                ok: false, 
                msn: "Acceso denegado. El token ha expirado." 
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                ok: false, 
                msn: "Acceso denegado. Firma de token inválida." 
            });
        }

        // Error general por si pasa algo más
        return res.status(500).json({ 
            ok: false, 
            msn: "Error interno verificando el token." 
        });
    }
};

// Verificación exclusiva para administradores
const isAdmin = (req, res, next) => {
    // Verificamos que el rol inyectado sea exactamente 'admin'
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ 
            ok: false, 
            msn: "Acceso denegado. Se requieren permisos de administrador." 
        });
    }
    next();
};

export { verifyToken, isAdmin };