import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
      try {
        const questions = await prisma.question.findMany({
            where: {
                user: {
                  archivedAt: null,  // Only get answers where the user's archivedAt is null
                },
              },
          include: { user: { select: {id: true, name: true}}, comments: {include: {user:  {select: {id: true, name: true}}}, where: {user: {archivedAt: null}}}, answers: {include: {user:  {select: {id: true, name: true}}},  where: {user: {archivedAt: null}}} },
        });
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
        const newQuestion = await prisma.question.create({
          data: {
            title,
            body,
            userId,
          },
        });
        res.status(201).json(newQuestion);
      } catch (error) {
        res.status(500).json({ error: 'Unable to create question' });
      }
    } else {
      res.status(405).end(); // Method Not Allowed
    }
  }