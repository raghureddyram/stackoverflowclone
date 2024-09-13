import { NextApiRequest, NextApiResponse } from 'next';
import { findAllActiveUsers, createUser } from './_userRepository';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const users = await findAllActiveUsers();  // Use the repository function
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
            const newUser = await createUser(name);  // Use the repository function
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ error: 'Unable to create user' });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
