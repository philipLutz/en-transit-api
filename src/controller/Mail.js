import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../db';

const Mail = {
	async create(req, res) {
		const createQuery = `INSERT INTO
			mail(mail_id, user_id, image_url, open, scan, forward, shred, created_date, modified_date)
			VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
			returning *`;
		const values = [
			uuidv4(),
			req.user.id,
			req.body.image_url,
			req.body.open,
			req.body.scan,
			req.body.forward,
			req.body.shred,
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
	async getAll(req, res) {
		if (req.user.admin) {
			if (req.params.user_id) {
				const findAllQueryUser = 'SELECT * FROM mail WHERE user_id = $1';
				try {
					const { rows } = await db.query(findAllQueryUser, [req.params.user_id]);
					if (!rows[0]) {
						return res.status(404).send({'message':'mail not found'});
					}
					return res.status(200).send(rows);
				}	catch(error) {
					return res.status(400).send(error);
				}
			}	else {
				const findAllQuery = 'SELECT * FROM mail';
				try {
					const { rows } = await db.query(findAllQuery);
					if (!rows[0]) {
						return res.status(404).send({'message':'mail not found'});
					}
					return res.status(200).send(rows);
				}	catch(error) {
					return res.status(400).send(error);
				}
			}
		}	else {
			const findAllQuery = 'SELECT * FROM mail WHERE user_id = $1';
			try {
				const { rows } = await db.query(findAllQuery, [req.user.id]);
				if (!rows[0]) {
					return res.status(404).send({'message':'mail not found'});
				}
				return res.status(200).send(rows);
			}	catch(error) {
				return res.status(400).send(error);
			}
		}
	},
	async getOne(req, res) {
		const findOneQuery = 'SELECT * FROM mail WHERE mail_id = $1';
		try {
			const { rows } = await db.query(findOneQuery, [req.params.mail_id]);
			if (!rows[0]) {
				return res.status(404).send({'message':'mail not found'});
			}
			return res.status(200).send(rows[0]);
		}	catch(error) {
			return res.status(400).send(error);
		}
	},
	async update(req, res) {
		const findOneQuery = 'SELECT * FROM mail WHERE mail_id = $1';
		const updateOneQuery = `UPDATE mail 
			SET image_url = $1, open = $2, scan = $3, forward = $4, shred = $5, modified_date = $6 
			WHERE mail_id = $7 returning *`;
		try {
			const { rows } = await db.query(findOneQuery, [req.params.mail_id]);
			if (!rows[0]) {
				return res.status(404).send({'message':'mail not found'});
			}
			const values = [
				req.body.image_url || rows[0].image_url,
				req.body.open || rows[0].open,
				req.body.scan || rows[0].scan,
				req.body.forward || rows[0].forward,
				req.body.shred || rows[0].shred,
				moment(new Date()),
				req.params.mail_id
			];
			const response = await db.query(updateOneQuery, values);
			return res.status(200).send(response.rows[0]);
		}	catch(error) {
			return res.status(400).send(error);
		}
	},
	async delete(req, res) {
		const deleteQuery = `DELETE FROM mail WHERE mail_id = $1 returning *`;
		try {
			const { rows } = await db.query(deleteQuery, [req.params.mail_id]);
			if (!rows[0]) {
				return res.status(404).send({'message':'mail not found'});
			}
			return res.status(204).send({'message':'mail deleted'});
		}	catch(error) {
			return res.status(400).send(error);
		}
	}
}

export default Mail;