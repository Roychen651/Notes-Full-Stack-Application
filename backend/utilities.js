const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ error: true, message: "Access token is missing" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedUser) => {
        if (err) {
            console.log("Token verification failed:", err);
            return res.status(403).json({ error: true, message: "Token verification failed" });
        }

        // Logging decoded user to verify the structure
        console.log("Decoded User from Token:", decodedUser);

        // Assign the decoded user directly to req.user
        req.user = decodedUser; 

        next();
    });
}

module.exports = {
    authenticateToken,
};
