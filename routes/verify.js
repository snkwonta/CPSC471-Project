const jwt = require('jsonwebtoken');

// Checks to see if a user is authenticated by checking the auth-token
module.exports = function(req,res,next){
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch(err) {
        res.status(400).send('Invalid token');
    }
}