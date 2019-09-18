import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import 'babel-polyfill';
import User from './src/controller/User.js';
import Auth from './src/middleware/Auth.js';
import Consent from './src/controller/Consent.js';

dotenv.config();
const app = express();

// Logging
app.use(morgan('common'));

// Rate Limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).send({'message': 'GET IT GOT IT GO!'});
});

// User Routes
app.post('/api/users', User.create);
app.post('/api/users/login', User.login);
app.delete('/api/users/delete', Auth.verifyToken, User.delete);

// Consents
app.post('/api/consents', Auth.verifyToken, Consent.create);
app.get('/api/consents/:consent_id', Auth.verifyToken, Consent.getOne);
app.put('/api/consents/:consent_id', Auth.verifyToken, Consent.update);
app.delete('/api/consents/:consent_id', Auth.verifyToken, Consent.delete);

// Mail


// Requests




app.listen(8080)
console.log('app running on port ', 8080);