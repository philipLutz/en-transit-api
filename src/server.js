import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import 'babel-polyfill';
import User from './controller/User.js';
import Consent from './controller/Consent.js';
import Mail from './controller/Mail.js';
import Request from './controller/Request.js';
import Auth from './middleware/Authentication.js';

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

// Dummy Endpoint
app.get('/api', (req, res) => {
	return res.status(200).send({'message': 'En Transit API'});
});

// User Routes
app.post('/api/users', User.create);
app.post('/api/users/login', User.login);
app.get('/api/users', Auth.verifyToken, User.getAllUsers);
app.get('/api/users/:user_id', Auth.verifyToken, User.getOneUser);
app.put('/api/users/:user_id', Auth.verifyToken, User.update);
app.delete('/api/users/delete', Auth.verifyToken, User.delete);

// Consents
app.post('/api/consents', Auth.verifyToken, Consent.create);
app.get('/api/consents/:consent_id', Auth.verifyToken, Consent.getOne);
app.put('/api/consents/:consent_id', Auth.verifyToken, Consent.update);
app.delete('/api/consents/:consent_id', Auth.verifyToken, Consent.delete);

// Mail
app.post('/api/mail', Auth.verifyToken, Mail.create);
app.get('/api/mail', Auth.verifyToken, Mail.getAll);
app.get('/api/mail/:mail_id', Auth.verifyToken, Mail.getOne);
app.put('/api/mail/:mail_id', Auth.verifyToken, Mail.update);
app.delete('/api/mail/:mail_id', Auth.verifyToken, Mail.delete);

// Requests
app.post('/api/requests/:mail_id', Auth.verifyToken, Request.create);
app.get('/api/requests', Auth.verifyToken, Request.getAll);
app.get('/api/requests/completeness/:complete', Auth.verifyToken, Request.getAllCompleteOrNot);
app.get('/api/requests/:request_id', Auth.verifyToken, Request.getOne);
app.put('/api/requests/:request_id', Auth.verifyToken, Request.update);
app.delete('/api/requests/:request_id', Auth.verifyToken, Request.delete);

app.listen(process.env.PORT)
console.log('app running on port ', process.env.PORT);