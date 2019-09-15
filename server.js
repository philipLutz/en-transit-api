import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import 'babel-polyfill';
import User from './src/controller/User.js';
import Auth from './src/middleware/Auth.js';

dotenv.config();
const app = express();

// Logging
app.use(morgan('common'));

app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).send({'message': 'GET IT GOT IT GO!'});
});

// User Routes
app.post('/api/users', User.create);
app.post('/api/users/login', User.login);
app.delete('/api/users/delete', Auth.verifyToken, User.delete);



app.listen(8080)
console.log('app running on port ', 8080);