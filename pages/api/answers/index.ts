// pages/api/answers/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const answers = await prisma.answer.findMany({
        include: { question: true, user: true },
      });
      res.status(200).json(answers);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch answers' });
    }
  } else if (req.method === 'POST') {
    const { body, userId, questionId } = req.body;
    if (!body || !userId || !questionId) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    try {
      const newAnswer = await prisma.answer.create({
        data: {
          body,
          userId,
          questionId
        },
      });
      res.status(201).json(newAnswer);
    } catch (error) {
      res.status(500).json({ error: 'Unable to create answer' });
    }
  }
}

