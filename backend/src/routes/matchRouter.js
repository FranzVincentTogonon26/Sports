import express from 'express'
import * as matchesController from '../controllers/matchesController.js'

const router = express.Router();

router.post('/', matchesController.createMatches);
router.get('/', matchesController.getMatches);
router.patch('/:id/score', matchesController.patchMatches);

export default router;