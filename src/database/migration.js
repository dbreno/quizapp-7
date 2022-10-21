import Database from './database.js'

async function up() {

    const db = await Database.connect();

    const alternativesSql = `
        CREATE TABLE IF NOT EXISTS alternatives (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL,
            question_id INTEGER NOT NULL,
            letter VARCHAR(2) NOT NULL,
            FOREIGN KEY (question_id) REFERENCES questions (id)
        ) 
    `;

    db.run(alternativesSql);

    const questionsSql = `
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(500) NOT NULL,
            answer INTEGER NOT NULL
        )
    `;

    db.run(questionsSql);

    const usersSql = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(50) NOT NULL,
            image VARCHAR(50) NOT NULL,
            email VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(20) NOT NULL
        )
    `;

    db.run(usersSql);
}

export default { up };