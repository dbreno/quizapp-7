import Database from '../database/database.js';

async function readAll() {

    const db = await Database.connect();

    const sql = `
        SELECT
        *
        FROM
        questions
    `;

    const questions = await db.all(sql);

    return questions;
};

async function read(id) {

    const db = await Database.connect();

    const sql = `
  
        SELECT
            q.id, q.name, a.name as alternative
        FROM
            questions as q INNER JOIN alternatives as a
        ON 
            a.question_id = q.id
        WHERE
            q.id = ?
    `;

    const question = await db.get(sql, [id]);

    return question

};

async function create(question) {

    const db = await Database.connect();

    const {name, answer} = question;

    const sql = `
        INSERT INTO
            questions (name, answer)
        VALUES
            (?, ?)
    `;

    const {lastID} = await db.run(sql, [name, answer]);

    return read(lastID);
};

export default { readAll, read, create };