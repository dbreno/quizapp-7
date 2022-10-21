import { resolve } from 'path';
import { readFileSync } from 'fs';
import Question from '../models/Question.js';
import Alternative from '../models/Alternative.js';

async function up() {

    const file = resolve(process.cwd(), 'src', 'database', 'seeders.json');

    const content = JSON.parse(readFileSync(file));

    for (const alternative of content.alternatives) {
        await Alternative.create(alternative);
    }

    for (const question of content.questions) {
        await Question.create(question);
    }

}

export default { up };