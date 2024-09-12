import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; 

  if (req.method === 'GET') {
    try {
      const answer = await prisma.answer.findUnique({
        where: { id: Number(id) },  // Convert id to a number
        include: { question: true, user: true },  // Include related data
      });

      if (!answer) {
        return res.status(404).json({ error: 'Answer not found' });
      }

      res.status(200).json(answer);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch answer' });
    }
  } else if (req.method === 'PUT') {
    const { body, userId, questionId, score } = req.body;
    if (!body || !userId || !questionId) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    try {
      
      const updatedAnswer = await prisma.answer.update({
        where: {
          id: Number(id),
        },
        data: {
          body,
          userId,
          questionId,
          score,
        },
      });

      res.status(200).json(updatedAnswer);
    } catch (error) {
      res.status(500).json({ error: 'Unable to update answer' });
    }
  } else if (req.method === 'DELETE') {
    try {
      
      await prisma.answer.delete({
        where: { id: Number(id) },
      });

      res.status(204).end();  // No Content
    } catch (error) {
      res.status(500).json({ error: 'Unable to delete answer' });
    }
  } else {
    res.status(405).end();  // Method Not Allowed
  }
}