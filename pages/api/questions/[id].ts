import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;  // Extract the id from the query params

  if (req.method === 'GET') {
    try {
      // Fetch the question by its id
      const question = await prisma.question.findUnique({
        where: { id: Number(id) },  // Convert id to a number
        include: { user: true, answers: true },  // Include related user and answers
      });

      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }

      res.status(200).json(question);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch question' });
    }
  } else if (req.method === 'PUT') {
    const { title, body, userId, score } = req.body;
    if (!title || !body || !userId) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    try {
      // Update the question by its id
      const updatedQuestion = await prisma.question.update({
        where: {
          id: Number(id),
        },
        data: {
          title,
          body,
          userId,
          score,
        },
      });

      res.status(200).json(updatedQuestion);
    } catch (error) {
      res.status(500).json({ error: 'Unable to update question' });
    }
  } else if (req.method === 'DELETE') {
    try {
      // Delete the question by its id
      await prisma.question.delete({
        where: { id: Number(id) },
      });

      res.status(204).end();  // No Content
    } catch (error) {
      res.status(500).json({ error: 'Unable to delete question' });
    }
  } else {
    res.status(405).end();  // Method Not Allowed
  }
}