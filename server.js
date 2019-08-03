import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import 'babel-polyfill';

dotenv.config();
const app = express();

app.use(morgan('common'));

app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).send({'message': 'GET IT GOT IT GO !'});
});

app.listen(8080)
console.log('app running on port ', 8080);