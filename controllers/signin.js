const jwt = require('jsonwebtoken');
const redis = require('redis');

// Setup Redis

// Define redisClient in the outer scope
const redisClient = redis.createClient({
    url: process.env.REDIS_URI,
});

redisClient.on("error", console.error);

// Connect to Redis
(async () => {
    try {
        await redisClient.connect();

        // Example usage
        await redisClient.set("key", "value");
        const value = await redisClient.get("key");
    } catch (error) {
        console.error('Redis connection error: ', error);
    }
})();

const handleSignin = (db, bcrypt, req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return Promise.reject('incorrect form submission');
    }
    return db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => user[0])
                    .catch(err => Promise.reject('unable to get user'));
            } else {
                Promise.reject('wrong credentials');
            }
        })
        .catch(err => Promise.reject('wrong credentials'));
}

const getAuthTokenId = async (req, res) => { // we should handle getting info from Redis asynchronously, since it replies asynchronously
    const { authorization } = req.headers;
    try {
        const reply = await redisClient.get(authorization);
        if (reply) {
            return res.json({ id: reply });
        } else {
            return res.status(400).json('Unauthorized');
        }
    } catch (err) {
        console.error('Error accessing Redis:', err);
        return res.status(500).json('Error retrieving data from Redis');
    }
};


const signToken = (email) => {
    const jwtPayload = { email };
    return jwt.sign(jwtPayload, 'process.env.JWT_SECRET', { expiresIn: '2days' }); //in fact instead of 'process.env.JWT_SECRET' as a string there should be a real env variable set up for this
}

const setToken = (token, id) => {
    return redisClient.set(token, id); //returns a promise, since redisClient is async
}

const createSessions = (user) => {
    //JWT token, return user data
    const { email, id } = user;
    const token = signToken(email);
    return setToken(token, id)
        .then(() => { return { success: 'true', userId: id, token } })
        .catch(console.log)
}

const signinAuthentication = (db, bcrypt) => (req, res) => {
    const { authorization } = req.headers;
    return authorization ? getAuthTokenId(req, res) :
        handleSignin(db, bcrypt, req, res)
            .then(data => {
                return data.id && data.email ? createSessions(data) : Promise.reject(data)
            })
            .then(session => res.json(session))
            .catch(err => res.status(400).json(err));
}
module.exports = {
    signinAuthentication: signinAuthentication,
    redisClient: redisClient
}