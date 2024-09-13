import { NextApiRequest, NextApiResponse } from 'next';
import { findAllActiveUserComments, createComment } from './_commentRepository';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const comments = await findAllActiveUserComments();
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({ error: 'Unable to fetch comments' });
        }
    } else if (req.method === 'POST') {
        const { body, userId, questionId, answerId } = req.body;

        if (!body || !userId || (!questionId && !answerId)) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        try {
            const newComment = await createComment(body, userId, questionId, answerId);
            res.status(201).json(newComment);
        } catch (error) {
            res.status(500).json({ error: 'Unable to create comment' });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
