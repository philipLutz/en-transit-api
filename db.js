const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('connected to the db');
});

// Create Tables
const createUserTable = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      user(
        user_id UUID PRIMARY KEY,
        email VARCHAR(128) UNIQUE NOT NULL,
        password VARCHAR(128) NOT NULL,
        first_name VARCHAR(32) NOT NULL,
        last_name VARCHAR(32) NOT NULL,
        phone VARCHAR(32) NOT NULL,
        address VARCHAR(128) NOT NULL,
        city VARCHAR(64) NOT NULL,
        state VARCHAR(64) NOT NULL,
        country VARCHAR(64) NOT NULL,
        po_box VARCHAR(32),
        created_date TIMESTAMP,
        modified_date TIMESTAMP
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

const createConsentTable = () => {
  const queryText = 
    `CREATE TABLE IF NOT EXISTS
      consent(
        consent_id UUID PRIMARY KEY,
        user_id VARCHAR(32) NOT NULL,
        image_url VARCHAR(128),
        complete BOOLEAN NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

const createMailTable = () => {
  const queryText = 
    `CREATE TABLE IF NOT EXISTS
      mail(
        mail_id UUID PRIMARY KEY,
        user_id VARCHAR(32) NOT NULL,
        image_url VARCHAR(128),
        open BOOLEAN NOT NULL,
        scan BOOLEAN NOT NULL,
        forward BOOLEAN NOT NULL,
        shred BOOLEAN NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

const createRequestTable = () => {
  const queryText = 
    `CREATE TABLE IF NOT EXISTS
      request(
        request_id UUID PRIMARY KEY,
        user_id VARCHAR(32) NOT NULL,
        mail_id VARCHAR(32) NOT NULL,
        open BOOLEAN NOT NULL,
        scan BOOLEAN NOT NULL,
        forward BOOLEAN NOT NULL,
        shred BOOLEAN NOT NULL,
        first_name VARCHAR(32),
        last_name VARCHAR(32),
        address VARCHAR(128),
        city VARCHAR(64),
        state VARCHAR(64),
        country VARCHAR(64),
        created_date TIMESTAMP,
        completed_date TIMESTAMP
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

const createAllTables = () => {
  createUserTable,
  createConsentTable,
  createMailTable,
  createRequestTable
}

// Drop Tables
const dropUserTable = () => {
  const queryText = 'DROP TABLE IF EXISTS user';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

const dropConsentTable = () => {
  const queryText = 'DROP TABLE IF EXISTS consent';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

const dropMailTable = () => {
  const queryText = 'DROP TABLE IF EXISTS mail';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

const dropRequestTable = () => {
  const queryText = 'DROP TABLE IF EXISTS request';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

const dropAllTables = () => {
  dropUserTable,
  dropConsentTable,
  dropMailTable,
  dropRequestTable
}

// Disconnect
pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createAllTables,
  createUserTable,
  dropUserTable
};

require('make-runnable');