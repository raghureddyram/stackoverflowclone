import { NextApiRequest, NextApiResponse } from 'next';
import { findCommentWithQuestionAndAnswer, updateComment, deleteComment } from './_commentRepository';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id as string | undefined;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid id' });
  }

  if (req.method === 'GET') {
    try {
      const comment = await findCommentWithQuestionAndAnswer(id);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      res.status(200).json(comment);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch comment' });
    }
  } else if (req.method === 'PUT') {
    const { body, userId, answerId, questionId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    try {
      const updatedComment = await updateComment(id, userId, body, questionId, answerId);
      res.status(200).json(updatedComment);
    } catch (error) {
      res.status(500).json({ error: 'Unable to update comment' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await deleteComment(id);
      res.status(204).end();  // No Content
    } catch (error) {
      res.status(500).json({ error: 'Unable to delete comment' });
    }
  } else {
    res.status(405).end();  // Method Not Allowed
  }
}
