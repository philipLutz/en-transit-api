import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../db';
import Helper from './Helper';

const User = {
  async create(req, res) {
    if (!req.body.email || !req.body.password || !req.body.first_name || !req.body.last_name || ! req.body.phone || !req.body.address || !req.body.city || !req.body.state || !req.body.country || !req.body.admin) {
      return res.status(400).send({'message': 'Some values are missing'});
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400).send({ 'message': 'Please enter a valid email address' });
    }
    const hashPassword = Helper.hashPassword(req.body.password);

    const createQuery = `INSERT INTO
      users(user_id, email, password, first_name, last_name, phone, address, city, state, country, admin, po_box, zip, created_date, modified_date)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      returning *`;
    const values = [
      uuidv4(),
      req.body.email,
      hashPassword,
      req.body.first_name,
      req.body.last_name,
      req.body.phone,
      req.body.address,
      req.body.city,
      req.body.state,
      req.body.country,
      req.body.admin,
      req.body.po_box,
      req.body.zip,
      moment(new Date()),
      moment(new Date())
    ];

    try {
      const { rows } = await db.query(createQuery, values);
      const token = Helper.generateToken(rows[0].id);
      return res.status(201).send({ token });
    } catch(error) {
      if (error.routine === '_bt_check_unique') {
        return res.status(400).send({ 'message': 'User with that EMAIL already exist' })
      }
      return res.status(400).send(error);
    }
  },
  async login(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({'message': 'Some values are missing'});
    }
    if (!Helper.isValidEmail(req.body.email)) {
      return res.status(400).send({ 'message': 'Please enter a valid email address' });
    }
    const text = 'SELECT * FROM users WHERE email = $1';
    try {
      const { rows } = await db.query(text, [req.body.email]);
      if (!rows[0]) {
        return res.status(400).send({'message': 'The credentials you provided is incorrect'});
      }
      if(!Helper.comparePassword(rows[0].password, req.body.password)) {
        return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
      }
      const token = Helper.generateToken(rows[0].user_id);
      return res.status(200).send({ token });
    } catch(error) {
      return res.status(400).send(error)
    }
  },
  async getAllUsers(req, res) {
    if (req.user.admin) {
      const findAllUsersQuery = 'SELECT * FROM users';
      try {
        const { rows } = await db.query(findAllUsersQuery);
        if (!rows[0]) {
          return res.status(404).send({'message': 'Users not found'});
        }
        return res.status(200).send(rows);
      } catch(error) {
        return res.status(400).send(error);
      }
    } else {
      return res.status(400).send({'message': 'Request denied'});
    }
  },
  async getOneUser(req, res) {
    if (req.user.admin) {
      const findOneUserQuery = 'SELECT * FROM users WHERE user_id = $1';
      try {
        const { rows } = await db.query(findOneUserQuery, [req.params.user_id]);
        if (!rows[0]) {
          return res.status(404).send({'message': 'User not found'});
        }
        return res.status(200).send(rows[0]);
      } catch(error) {
        return res.status(400).send(error);
      }
    } else {
      return res.status(400).send({'message': 'Request denied'});
    }
  },
  async update(req, res) {
    const findOneQuery = 'SELECT * FROM users WHERE user_id = $1';
    const updateOneQuery = `UPDATE users
    SET first_name = $1, last_name = $2, phone = $3, address = $4, city = $5, state = $6, country = $7, admin = $8, po_box = $9, zip = $10, modified_date = $11
    WHERE user_id = $12 returning *`;

    try {
      const { rows } = await db.query(findOneQuery, [req.user.id]);
      if (!rows[0]) {
        return res.status(404).send({'message':'User not found'});
      }
      const values = [
        req.body.first_name || rows[0].first_name,
        req.body.last_name || rows[0].last_name,
        req.body.phone || rows[0].phone,
        req.body.address || rows[0].address,
        req.body.city || rows[0].city,
        req.body.state || rows[0].state,
        req.body.country || rows[0].country,
        req.body.admin || rows[0].admin,
        req.body.po_box || rows[0].po_box,
        req.body.zip || rows[0].zip,
        moment(new Date()),
        req.user.id
      ];
      const response = await db.query(updateOneQuery, values);
      return res.status(200).send({'message':'user updated'});
    } catch(error) {
      return res.status(400).send(error)
    }
  },
  async delete(req, res) {
    const deleteQuery = 'DELETE FROM users WHERE user_id=$1 returning *';
    try {
      const { rows } = await db.query(deleteQuery, [req.user.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'user not found'});
      }
      return res.status(204).send({ 'message': 'deleted' });
    } catch(error) {
      return res.status(400).send(error);
    }
  }
}

export default User;