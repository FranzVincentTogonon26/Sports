import express from 'express'
import * as commentaryController from '../controllers/commentaryController.js'

const router = express.Router();

router.get('/:id/match', commentaryController.getCommentary);
router.post('/:id/match', commentaryController.createCommentary);

export default router;