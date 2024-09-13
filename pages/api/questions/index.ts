import { NextApiRequest, NextApiResponse } from 'next';
import { findAllActiveUserQuestions, createQuestion } from './_questionRepository';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const questions = await findAllActiveUserQuestions();
            res.status(200).json(questions);
        } catch (error) {
            res.status(500).json({ error: 'Unable to fetch questions' });
        }
    } else if (req.method === 'POST') {
        const { title, body, userId } = req.body;

        if (!title || !body || !userId) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        try {
            const newQuestion = await createQuestion(title, body, userId);
            res.status(201).json(newQuestion);
        } catch (error) {
            res.status(500).json({ error: 'Unable to create question' });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
