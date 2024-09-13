import { NextApiRequest, NextApiResponse } from 'next';
import {findAnswerWithQuestion, updateAnswer, deleteAnswer} from "./_answerRepository"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string | undefined;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid id' });
  }

  if (req.method === 'GET') {
    try {
        const answer = await findAnswerWithQuestion(id);
        if (!answer) {
            return res.status(404).json({ error: 'Answer not found' });
        }

        res.status(200).json(answer);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch answer' });
    }
  } else if (req.method === 'PUT') {
    const { body, userId, questionId, score, accepted } = req.body;
    if (!body || !userId || !questionId) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    try {
      const updatedAnswer = await updateAnswer(id, body, userId, questionId, score, accepted)

      res.status(200).json(updatedAnswer);
    } catch (error) {
      res.status(500).json({ error: 'Unable to update answer' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await deleteAnswer(id)

      res.status(204).end();  // No Content
    } catch (error) {
      res.status(500).json({ error: 'Unable to delete answer' });
    }
  } else {
    res.status(405).end();  // Method Not Allowed
  }
}