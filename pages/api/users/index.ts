import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany({
        include: { questions: true, answers: true, comments: true },  // Include relations
      });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch users' });
    }
  } else if (req.method === 'POST') {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    try {
      const newUser = await prisma.user.create({
        data: {
          name,
        },
      });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Unable to create user' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
