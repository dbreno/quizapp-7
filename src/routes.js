import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';

import uploadConfig from './config/multer.js';
import Alternative from './models/Alternative.js';
import Question from './models/Question.js';
import User from './models/User.js';

import { isAuthenticated } from './middleware/auth.js';
import SendMail from './services/SendMail.js';

const router = Router();

router.get('/', (req, res) => res.redirect('/questions.html'));

router.get('/questions', isAuthenticated, async (req, res) => {

    try {
    
        const questions = await Question.readAll();

        for (const question of questions) {
            const alternatives = await Alternative.readByQuestion(question.id);
            question.alternatives = alternatives;
        };

        res.json(questions);

    }   catch (error) {
        throw new Error('Error in list questions');
    }
});

router.post('/questions', isAuthenticated, async (req, res) => {

    try {

        const question = req.body;

        const newQuestion = await Question.create(question);

        res.json(newQuestion);

    }  catch (error) {
        throw new Error('Error in create question');
    }

});

router.get('/alternatives', isAuthenticated, async (req, res) => {

    try {

        const alternatives = await Alternative.readAll();

        await SendMail.createNewCorrect(alternatives.email); 

        res.json(alternatives);


    } catch (error) {
        throw new Error('Error in list alternatives');
    }

});

router.post(
    '/users', 
    multer(uploadConfig).single('image'),
    async (req, res) => {

        try {

            const user = req.body;

            const image = req.file
                ? `/imgs/profile/${req.file.filename}`
                : '/imgs/profile/placeholder.jpg';
            ;    

            const newUser = await User.create({...user, image});

            await SendMail.createNewUser(user.email);   

            res.json(newUser);

        }   catch (error) {
                throw new Error('Error in create user');
            }

});

router.post('/signin', async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.readByEmail(email);

        if (!user) {
            throw new Error('User not found');
        }

        const { id: userId, password: hash } = user;

        const match = await bcrypt.compareSync(password, hash);

        if (match) {
            const token = jwt.sign (
                { userId },
                process.env.SECRET,
                { expiresIn: 3600 } // 1h
            );

            res.json({ auth: true, token });

        }   else {
            throw new Error('User not found');
        }

    } catch (error) {
        res.status(401).json({ error: 'User not found' });
    }

});

router.post('/acertos', isAuthenticated, async (req, res) => {
    const answers = req.body;

    const userId = req.userId;

    const user = await User.read(userId);

    await SendMail.createNewCorrect(user.email, answers)

    res.json({message: 'Resultado do Quiz'})
})

router.get('/userid', isAuthenticated, async (req, res) => {
    const id = req.userId

    const userid = await User.read(id)

    res.json(userid)
});

router.use(function (req, res, next) {
    res.status(404).json({
        message: 'Content not found',
    });
});

router.use(function (error, req, res, next) {
    console.error(error.stack);

    res.status(500).json({
        message: 'Something broke!',
    });
});

export default router;