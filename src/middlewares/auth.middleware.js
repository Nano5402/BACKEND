import jwt from 'jsonwebtoken';
import 'dotenv/config';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            ok: false, 
            msn: "Acceso denegado. Token no proporcionado o formato inválido." 
        });
    }

    const token = authHeader.split(' ')[1]; 
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ ok: false, msn: "Acceso denegado. El token ha expirado." });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ ok: false, msn: "Acceso denegado. Firma de token inválida." });
        }
        return res.status(500).json({ ok: false, msn: "Error interno verificando el token." });
    }
};

// NUEVO GUARDIÁN RBAC
const checkPermission = (requiredPermission) => {
    return (req, res, next) => {
        // 1. Verificamos que el payload del JWT contenga el array de permisos
        if (!req.user || !req.user.permissions || !Array.isArray(req.user.permissions)) {
            return res.status(403).json({ 
                ok: false, 
                msn: "Acceso denegado. La sesión no contiene permisos atómicos válidos." 
            });
        }

        // 2. Evaluamos si el usuario tiene el permiso exacto
        const hasPermission = req.user.permissions.includes(requiredPermission);

        if (!hasPermission) {
            return res.status(403).json({ 
                ok: false, 
                msn: `Acceso denegado. Se requiere el permiso: [${requiredPermission}]` 
            });
        }

        // 3. Todo en orden, puede pasar al controlador
        next();
    };
};

// Exportamos el nuevo guardián
export { verifyToken, checkPermission };