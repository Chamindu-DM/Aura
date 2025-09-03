const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if(!token){
        return res.status(401).json({message: 'No token, authorization denied'})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.userId = decoded.userId || decoded.id; // Ensure userId is available
        next();
    } catch (err) {
        res.status(401).json({message:'Token is not valid'});
    }
};

module.exports = auth;