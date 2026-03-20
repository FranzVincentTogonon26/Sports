import Commentary from '../models/Commentary.js'
import { matchIdParamSchema } from "../validation/matches.js";
import { createCommentarySchema, listCommentaryQuerySchema } from "../validation/commentary.js";

export const getCommentary = async (req, res, next) => {
    try {

        const MAX_LIMIT = 100;
        
        const paramsResult = matchIdParamSchema.safeParse(req.params);
        if (!paramsResult.success) {
            return res.status(400).json({ 
                error: 'Invalid match ID.', 
                message: paramsResult.error.issues 
            });
        }

        const queryResult = listCommentaryQuerySchema.safeParse(req.query);
        if (!queryResult.success) {
            return res.status(400).json({ 
                error: 'Invalid query parameters.', 
                message: queryResult.error.issues 
            });
        }

        const { id } = paramsResult.data;
        const { limit = 10 } = queryResult.data;

        const safeLimit = Math.min(limit, MAX_LIMIT);

        const results = await Commentary.getCommentaryById(id, safeLimit);

        res.status(200).json({
            data: { results }
        });

    } catch (error) {
        next(error)
    }
}

export const createCommentary = async (req, res, next) => {
    try {

        const paramsResult = matchIdParamSchema.safeParse(req.params);
        if (!paramsResult.success) {
            return res.status(400).json({ 
                error: 'Invalid match ID.', 
                message: paramsResult.error.issues 
            });
        }

        const bodyResult = createCommentarySchema.safeParse(req.body);
        if (!bodyResult.success) {
            return res.status(400).json({ 
                error: 'Invalid commentary payload.', 
                message: bodyResult.error.issues 
            });
        }

        const [result] = await Commentary.createCommentary(bodyResult.data, paramsResult);

        if(res.app.locals.broadcastCommentary) {
            res.app.locals.broadcastCommentary(result.matchId, result);
        }

        res.status(201).json({
            data: result 
        });


    } catch (error) {
        next(error)
    }
}