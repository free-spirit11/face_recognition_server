const redisClient = require('./signin').redisClient;

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json('Unauthorized')
    }

    try {
        const reply = await redisClient.get(authorization);
        if (!reply) {
            return res.status(401).json('Unauthorized');
        }
    } catch (err) {
        console.error('Error accessing Redis:', err);
        return res.status(500).json('Error retrieving data from Redis');
    }
    return next(); //next is a feature in express that allows us to keep goinf down the chain - calls the next method after this one is executed
}

module.exports = {
    requireAuth: requireAuth
}