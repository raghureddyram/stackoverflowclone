import { NextApiRequest, NextApiResponse } from 'next';
import { findActiveUserById, updateUser, softDeleteUser } from './_userRepository';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    const userId = Number(id);

    if (req.method === 'GET') {
        try {
            const user = await findActiveUserById(userId);

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
            const updatedUser = await updateUser(userId, name);
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: 'Unable to update user' });
        }
    } else if (req.method === 'DELETE') {
        try {
            await softDeleteUser(userId); 
            res.status(204).end();  // No Content
        } catch (error) {
            res.status(500).json({ error: 'Unable to delete user' });
        }
    } else {
        res.status(405).end();  // Method Not Allowed
    }
}
