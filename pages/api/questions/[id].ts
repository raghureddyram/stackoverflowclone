import { NextApiRequest, NextApiResponse } from 'next';
import { findQuestionById, updateQuestion, deleteQuestion } from './_questionRepository';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing question ID' });
  }

  const questionId = Number(id);  

  if (req.method === 'GET') {
    try {
      const question = await findQuestionById(questionId);  

      if (!question) {
        return res.status(404).json({ error: 'Question not found' });
      }

      res.status(200).json(question);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch question' });
    }
  } else if (req.method === 'PUT') {
    const { title, body, userId, score } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    try {
      const updatedQuestion = await updateQuestion(questionId, userId, title, body, score);
      res.status(200).json(updatedQuestion);
    } catch (error) {
      res.status(500).json({ error: 'Unable to update question' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await deleteQuestion(questionId);  
      res.status(204).end();  // No Content
    } catch (error) {
      res.status(500).json({ error: 'Unable to delete question' });
    }
  } else {
    res.status(405).end();  // Method Not Allowed
  }
}
