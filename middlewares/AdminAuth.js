const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(403).json({ error: "Token não fornecido" });
    }

    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        return res.status(403).json({ error: "Formato de token inválido" });
    }

    const token = tokenParts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "senha_padrao");

        if (decoded.role !== 1) {
            return res.status(403).json({ error: "Acesso negado" });
        }

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: "Token inválido ou expirado" });
    }
};
