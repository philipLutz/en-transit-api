import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../db';

const Consent = {
	async create(req, res) {
		// First, need to check if consent exists, only one consent form for each user
		const findOneQuery = 'SELECT * FROM consents WHERE user_id = $1';
		const createQuery = `INSERT INTO
			consents(consent_id, user_id, image_url, complete, created_date, modified_date)
			VALUES($1, $2, $3, $4, $5, $6)
			returning *`;
		try {
			const { rows } = await db.query(findOneQuery, [req.user.id]);
			if (!rows[0]) {
				const values = [
					uuidv4(),
					req.user.id,
					req.body.image_url,
					req.body.complete,
					moment(new Date()),
					moment(new Date())
				];
				try {
					const { rows } = await db.query(createQuery, values);
					return res.status(201).send(rows[0]);
				}	catch(error) {
					return res.status(400).send(error);
				}
			}	else {
				return res.status(409).send({'message': 'consent for this user already exists'});
			}
		}	catch(error) {
			return res.status(400).send(error);
		}
	},
	async getOne(req, res) {
		const findOneQuery = 'SELECT * FROM consents WHERE consent_id = $1 AND user_id = $2';
		try {
			const { rows } = await db.query(findOneQuery, [req.params.consent_id, req.user.id]);
			if (!rows[0]) {
				return res.status(404).send({'message': 'consent not found'});
			}
			return res.status(200).send(rows[0]);
		}	catch(error) {
			return res.status(400).send(error);
		}
	},
	async update(req, res) {
		const findOneQuery = 'SELECT * FROM consents WHERE consent_id = $1 AND user_id = $2';
		const updateOneQuery = `UPDATE consents
			SET image_url = $1, complete = $2, modified_date = $3
			WHERE consent_id = $4 AND user_id = $5 returning *`;
		try {
			const { rows } = await db.query(findOneQuery, [req.params.consent_id, req.user.id]);
			if (!rows[0]) {
				return res.status(404).send({'message':'consent not found'});
			}
			const values = [
				req.body.image_url || rows[0].image_url,
				req.body.complete || rows[0].complete,
				moment(new Date()),
				req.params.consent_id,
				req.user.id
			];
			const response = await db.query(updateOneQuery, values);
			return res.status(200).send(response.rows[0]);
		}	catch(error) {
			return res.status(400).send(error);
		}
	},
	async delete(req, res) {
		const deleteQuery = `DELETE FROM consents WHERE consent_id = $1 AND user_id = $2 returning *`;
		try {
			const { rows } = await db.query(deleteQuery, [req.params.consent_id, req.user.id]);
			if (!rows[0]) {
				return res.status(404).send({'message':'consent not found'});
			}
			return res.status(204).send({'message':'consent deleted'});
		}	catch(error) {
			return res.status(400).send(error);
		}
	}
}

export default Consent;