import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: Number(id), archivedAt: null },
        include: { questions: true, answers: true, comments: true },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch user' });
    }
  } else if (req.method === 'PUT') {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    try {
      // Update the user by their id
      const updatedUser = await prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
        },
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Unable to update user' });
    }
  } else if (req.method === 'DELETE') {
    try {
      // Delete the user by their id
      await prisma.user.update({
        where: {
            id: Number(id),
          },
          data: {
            archivedAt: new Date()
          },
      });

      res.status(204).end();  // No Content
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: 'Unable to delete user' });
    }
  } else {
    res.status(405).end();  // Method Not Allowed
  }
}
