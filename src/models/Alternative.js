import Database from '../database/database.js';

async function create(alternative) {

    const db = await Database.connect();

    const {id, name, question_id, letter} = alternative;

    const sql = `

        INSERT INTO
            alternatives (id, name, question_id, letter)
        VALUES
            (?, ?, ?, ?)
    `;

    const {lastID} = await db.run(sql, [id, name, question_id, letter]);

    return read(lastID);

};

async function readAll() {

    const db = await Database.connect();

    const sql = `
    
        SELECT
            *
        FROM
            alternatives
    `;

    const alternatives = await db.all(sql);

    return alternatives;
};

async function read(id) {

    const db = await Database.connect();

    const sql = `

        SELECT
            *
        FROM
            alternatives
        WHERE
            id = ?

    `;

    const alternative = await db.get(sql, [id]);

    return alternative;

};

async function readByQuestion(id) {

    const db = await Database.connect();

    const sql = `

        SELECT
            *
        FROM
            alternatives
        WHERE
            question_id = ?

    `;

    const alternative = await db.all(sql, [id]);

    return alternative;
};

export default { create, readAll, read, readByQuestion };