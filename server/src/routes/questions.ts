import { Router, Request, Response } from 'express';
import Question from '../models/Question';
import Answer from '../models/Answer';
import User from '../models/User';
import { authenticate } from '../middleware/auth';

const router = Router();

// TODO: GET /api/questions - Get all questions
router.get('/', async (req: Request, res: Response) => {
  // TODO: Fetch all questions with user info and answer count
  try {
    const questions = await Question.findAll({
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        { model: Answer, as: 'answers', attributes: [] }
      ],
      order: [['createdAt', 'DESC']],
      attributes: {
        include: [
          [fn('COUNT', col('answers.id')), 'answerCount']
        ]
      },
      group: ['Question.id', 'author.id'],
      subQuery: false
    })

    res.json({ count: questions.length, questions })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch questions' })
  }
});

// TODO: GET /api/questions/:id - Get single question with answers
router.get('/:id', async (req: Request, res: Response) => {
  // TODO: Get id from params
  try {
     const { id } = req.params;

  // TODO: Find question by id with User and Answers
  // Include Answer's User and Votes
   const question = await Question.findByPk(id, {
  include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        {
          model: Answer,
          as: 'answers',
          include: [
            { model: User, as: 'author', attributes: ['id', 'username'] },
            { model: Vote, as: 'votes', attributes: ['userId', 'value'] }
          ]
        }
      ]
    })

  // TODO: If not found, return 404 with message "Question not found"
 if (!question) {
      return res.status(404).json({ message: 'Question not found' })
    }
  // TODO: Calculate vote counts for each answer
  // For each answer, sum up the vote values
  // Also include current user's vote if authenticated
 const answersWithVotes = question.answers.map(answer => {
      const voteCount = answer.votes.reduce((acc, vote) => acc + vote.value, 0)
      let userVote = null
      if (req.user) {
        const currentUserVote = answer.votes.find(v => v.userId === req.user!.id)
        userVote = currentUserVote ? (currentUserVote.value === 1 ? 'up' : 'down') : null
      }
  // TODO: Return question with answers
        return {
        id: answer.id,
        body: answer.body,
        author: answer.author,
        createdAt: answer.createdAt,
        updatedAt: answer.updatedAt,
        voteCount,
        userVote
      }
    })

    res.json({
      id: question.id,
      title: question.title,
      body: question.body,
      author: question.author,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      answers: answersWithVotes
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch question' })
  }
});

// TODO: POST /api/questions - Create new question (protected)
router.post('/', authenticate, async (req: Request, res: Response) => {
  // TODO: Get title and body from req.body
  try {
    const { title, body } = req.body
    // TODO: Validate input (both required)
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' })
    }
  // TODO: Create question with userId from req.user
   const question = await Question.create({
     title,
     body,
     userId: req.user!.id
   });

  // TODO: Fetch created question with user info
  // Use findByPk with include
const fullQuestion = await Question.findByPk(question.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'username'] }]
    })
  // TODO: Return created question
  
    res.status(201).json(fullQuestion)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to create question' })
  }
});

// TODO: PUT /api/questions/:id - Update question (protected, owner only)
router.put('/:id', authenticate, async (req: Request, res: Response) => {
  // TODO: Get id from params and title/body from body
 try {
    const { id } = req.params
    const { title, body } = req.body
  // TODO: Find question
  // If not found, return 404
  const question = await Question.findByPk(id)
    if (!question) {
      return res.status(404).json({ message: 'Question not found' })
    }
  // TODO: Check if user owns this question
  if (question.userId !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }
  // TODO: Update question
   await question.update({ title, body })
    const updatedQuestion = await Question.findByPk(id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'username'] }]
    })
  // TODO: Return updated question
     res.json(updatedQuestion)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to update question' })
  }
});

// TODO: DELETE /api/questions/:id - Delete question (protected, owner only)
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  
  // TODO: Find question
 try {
    const { id } = req.params
    const question = await Question.findByPk(id)
  // TODO: Check ownership
 if (!question) return res.status(404).json({ message: 'Question not found' })
    if (question.userId !== req.user!.id) return res.status(403).json({ message: 'Not authorized' })

  // TODO: Delete question
   await question.destroy();

  // TODO: Return success message
 res.json({ message: 'Question deleted successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to delete question' })
  }
})

export default router;
