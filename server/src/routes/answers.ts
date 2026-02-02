import { Router, Request, Response } from 'express';
import Answer from '../models/Answer';
import Question from '../models/Question';
import User from '../models/User';
import { authenticate } from '../middleware/auth';

const router = Router();

// TODO: POST /api/questions/:questionId/answers - Create answer (protected)
router.post('/:questionId/answers', authenticate, async (req: Request, res: Response) => {
  // TODO: Get questionId from params
  try{
  const { questionId } = req.params;

  // TODO: Get body from req.body
   const { body } = req.body;

  // TODO: Validate body is provided
    if (!body || body.trim().length === 0) {
      return res.status(400).json({ message: 'Answer body is required' })
    }
  // TODO: Check if question exists
   const question = await Question.findByPk(questionId);
  // If not found, return 404 "Question not found"
   if (!question) {
      return res.status(404).json({ message: 'Question not found' })
    }
  // TODO: Create answer
   const answer = await Answer.create({
     body,
     questionId: Number(questionId),
     userId: req.user!.id
   });

  // TODO: Fetch created answer with user info
  // Use findByPk with include
const createdAnswer = await Answer.findByPk(answer.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username']
        }
      ]
    })
  // TODO: Return created answer
  return res.status(201).json(createdAnswer)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to create answer' })
  }
});

// TODO: PUT /api/answers/:id - Update answer (protected, owner only)
router.put('/:id', authenticate, async (req: Request, res: Response) => {
  // TODO: Get id from params and body from req.body
try {
    const { id } = req.params
    const { body } = req.body
       if (!body || body.trim().length === 0) {
      return res.status(400).json({ message: 'Answer body is required' })
    }
  // TODO: Find answer
  // If not found, return 404
  const answer = await Answer.findByPk(id)
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' })
    }
  // TODO: Check ownership
  // If not owner, return 403
  if (answer.userId !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized to edit this answer' })
    }
  // TODO: Update answer
   await answer.update({ body });

  // TODO: Return updated answer
    return res.json(answer)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to update answer' })
  }
});

// TODO: DELETE /api/answers/:id - Delete answer (protected, owner only)
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  // TODO: Find answer
try {
    const { id } = req.params
  // TODO: Check ownership
    const answer = await Answer.findByPk(id)
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' })
    }

    if (answer.userId !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized to delete this answer' })
    }
  // TODO: Delete answer
  await answer.destroy();

  // TODO: Return success message
     return res.json({ message: 'Answer deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to delete answer' })
  }
});

export default router;
