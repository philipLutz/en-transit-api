import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../db';

const Request = {
	async create(req, res) {
		const createQuery = `INSERT INTO
		requests(request_id, user_id, mail_id, complete, open, scan, forward, shred, first_name, last_name, address, city, state, country, zip, created_date, modified_date)
		VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
		returning *`;
		const values = [
			uuidv4(),
			req.user.id,
			req.params.mail_id,
			req.body.complete,
			req.body.open,
			req.body.scan,
			req.body.forward,
			req.body.shred,
			req.body.first_name,
			req.body.last_name,
			req.body.address,
			req.body.city,
			req.body.state,
			req.body.country,
			req.body.zip,
			moment(new Date()),
			moment(new Date())
		];
		
		try {
			const { rows } = await db.query(createQuery, values);
			return res.status(201).send(rows[0]);
		}	catch(error) {
			return res.status(400).send(error);
		}
	},
	async getOne(req, res) {
		const findOneQuery = 'SELECT * FROM requests WHERE request_id = $1';
		try {
			const { rows } = await db.query(findOneQuery, [req.params.request_id]);
			if (!rows[0]) {
				return res.status(404).send({'message':'request not found'});
			}
			return res.status(200).send(rows[0]);
		}	catch(error) {
			return res.status(400).send(error);
		}
	},
	async getAllNotComplete(req, res) {
		if (req.user.admin) {

		}	else {

		}
	},
	async getAll(req, res) {
		if (req.user.admin) {

		}	else {
			const findAllQuery = 'SELECT * FROM requests WHERE user_id = $1';
			
		}
	},
	async update(req, res) {
		if (req.user.admin) {

		}	else {

		}
	},
	async delete(req, res) {
		
	}
};

export default Request;