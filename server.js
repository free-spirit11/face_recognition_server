const express = require('express');
const bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var cors = require('cors')
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const morgan = require('morgan');
const auth = require('./controllers/authorization');


const db = knex({
    client: 'pg',
    connection: process.env.POSTGRES_URI
});

console.log(process.env.POSTGRES_URI)

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));

app.post('/signin', signin.signinAuthentication(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt));
app.get('/profile/:id', auth.requireAuth, profile.handleProfileGet(db));
app.post('/profile/:id', auth.requireAuth, profile.handleProfileUpdate(db));
app.put('/image', auth.requireAuth, image.handleImage(db));

// const PORT = process.env.PORT;
// app.listen(PORT, () => {
//     console.log(`app is running on port ${PORT}`);
// });

app.listen('3000', () => {
    console.log(`app is running on port 3000`);
});