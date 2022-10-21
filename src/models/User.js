import bcrypt from 'bcryptjs';

import Database from '../database/database.js';

const salt = Number(process.env.SALT);

async function create(user) {

    const db = await Database.connect();

    const { name, image, email, password } = user;

    const hash = bcrypt.hashSync(password, salt);

    const sql = `
        SELECT
            email
        FROM
            users
        WHERE
            email = ?
    `;

    const result = await db.get(sql, [email]);

    try {

        if (email === result.email) {
            return false
        };

    } catch (error) {
        db.run(`
        INSERT INTO 
            users (name, image, email, password)
        VALUES
            (?, ?, ?, ?)
        `, [name, image, email, hash]);
        return true
    };
};

async function read(id) {

    const db = await Database.connect();

    const sql = `
    SELECT 
      *
    FROM 
      users
    WHERE
      id = ?
  `;
    
    const user = await db.get(sql, [id]);

    return user;
};

async function readByEmail(email) {

    const db = await Database.connect();

    const sql = `
        SELECT 
            *
        FROM 
            users
        WHERE
            email = ?
    `;

    const user = await db.get(sql, [email]);

    return user;
};

export default { create, read, readByEmail };