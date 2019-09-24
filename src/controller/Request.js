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
	async getAllCompleteOrNot(req, res) {
		if (req.user.admin) {
			const findAllComQuery = 'SELECT * FROM requests WHERE complete = $1';
			try {
				const { rows } = await db.query(findAllComQuery, [req.params.complete]);
				if (!rows[0]) {
					return res.status(404).send({'message':'requests not found'});
				}
				return res.status(200).send(rows);
			}	catch(error) {
				return res.status(400).send(error);
			}
		}	else {
			const findAllComQuery = 'SELECT * FROM requests WHERE complete = $1 AND user_id = $2';
			try {
				const { rows } = await db.query(findAllComQuery, [req.params.complete, req.user.id]);
				if (!rows[0]) {
					return res.status(404).send({'message':'requests not found'});
				}
				return res.status(200).send(rows);
			}	catch(error) {
				return res.status(400).send(error);
			}
		}
	},
	async getAll(req, res) {
		if (req.user.admin) {
			const findAllQuery = 'SELECT * FROM requests';
			try {
				const { rows } = await db.query(findAllQuery);
				if (!rows[0]) {
					return res.status(404).send({'message':'requests not found'});
				}
				return res.status(200).send(rows);
			}	catch(error) {
				return res.status(400).send(error);
			}
		}	else {
			const findAllQuery = 'SELECT * FROM requests WHERE user_id = $1';
			try {
				const { rows } = await db.query(findAllQuery, [req.user.id]);
				if (!rows[0]) {
					return res.status(404).send({'message':'requests not found'});
				}
				return res.status(200).send(rows);
			}	catch(error) {
				return res.status(400).send(error);
			}
		}
	},
	async update(req, res) {
		const findOneQuery = 'SELECT * FROM requests WHERE request_id = $1';
		const updateOneQuery = `UPDATE requests 
			SET complete = $1, open = $2, scan = $3, forward = $4, shred = $5, first_name = $6, last_name = $7, address = $8, city = $9, state = $10, country = $11, zip = $12, modified_date = $13 
			WHERE request_id = $14 returning *`;
		try {
			const { rows } = await db.query(findOneQuery, [req.params.request_id]);
			if (!rows[0]) {
				return res.status(404).send({'message':'request not found'});
			}
			const values = [
				req.body.complete || rows[0].complete,
				req.body.open || rows[0].open,
				req.body.scan || rows[0].scan,
				req.body.forward || rows[0].forward,
				req.body.shred || rows[0].shred,
				req.body.first_name || rows[0].first_name,
				req.body.last_name || rows[0].last_name,
				req.body.address || rows[0].address,
				req.body.city || rows[0].city,
				req.body.state || rows[0].state,
				req.body.country || rows[0].country,
				req.body.zip || rows[0].zip,
				moment(new Date()),
				req.params.request_id
			];
			const response = await db.query(updateOneQuery, values);
			return res.status(200).send(response.rows[0]);
		}	catch(error) {
			return res.status(400).send(error);
		}
	},
	async delete(req, res) {
		const deleteQuery = `DELETE FROM requests WHERE request_id = $1 returning *`;
		try {
			const { rows } = await db.query(deleteQuery, [req.params.request_id]);
			if (!rows[0]) {
				return res.status(404).send({'message':'request not found'});
			}
			return res.status(204).send({'message':'request deleted'});
		}	catch(error) {
			return res.status(400).send(error);
		}
	}
};

export default Request;