var jwt = require('jsonwebtoken');

const fetchuser = (req, res, next) => {
    const token = req.header('x-access-token');
    if (!token) {
        res.status(403).json({ error: "Please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, process.env.secretOrKey);
        req.user = data;
        next();
    } catch (error) {
        res.status(401).json({ error: "Please authenticate using a valid token" })
    }
}


module.exports = fetchuser;