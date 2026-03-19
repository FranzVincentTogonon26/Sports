import Matches from "../models/matches.js";
import { createMatchSchema, listMatchesQuerySchema } from "../validation/matches.js";

export const getMatches = async (req, res, next) => {
    try {

        const MAX_LIMIT = 100;
        const parsed = listMatchesQuerySchema.safeParse(req.query);

        if (!parsed.success) {
            return res.status(400).json({
                error: 'Invalid query.', 
                message: parsed.error.issues 
            });
        }

        const limit = Math.min(parsed.data.limit ?? 50, MAX_LIMIT);
        
        const matches = await Matches.getAllMatches(limit);

        res.status(200).json({
            data: { matches }
        });

    } catch (error) {
       next(error) 
    }
}

export const createMatches = async (req, res, next) => {
    try {

        const parsedData = createMatchSchema.safeParse(req.body);

        if(!parsedData.success) {
            return res.status(400).json({ 
                error: 'Invalid payload.', 
                message: parsedData.error.issues 
            });
        }

        const event = await Matches.createMatches(parsedData);

        if(res.app.locals.broadcastMatchCreated) {
            res.app.locals.broadcastMatchCreated(event);
        }

        res.status(201).json({
            data: { event }
        });
        
    } catch (error) {
        next(error)
    }
}

export const patchMatches = async (req, res, next) => {
    try {

        const paramsParsed = matchIdParamSchema.safeParse(req.params);
        if (!paramsParsed.success) {
            return res.status(400).json({ 
                error: 'Invalid match id', 
                message: formatZodError(paramsParsed.error) 
            });
        }

        const bodyParsed = updateScoreSchema.safeParse(req.body);
        if (!bodyParsed.success) {
            return res.status(400).json({ 
                error: 'Invalid payload', 
                message: formatZodError(bodyParsed.error) 
            });
        }

        const matchId = paramsParsed.data.id;

        const existing = await Matches.getMatchById(matchId);
        if (!existing) {
            return res.status(404).json({ 
                error: 'Match not found' 
            });
        }

        await syncMatchStatus(existing, async (nextStatus) => {
           await Matches.updateMatchesStatus(nextStatus,matchId)
        });

        if (existing.status !== MATCH_STATUS.LIVE) {
            return res.status(409).json({ 
                error: 'Match is not live' 
            });
        }

        const updated = await Matches.createMatches(bodyParsed,matchId);

        if (res.app.locals.broadcastScoreUpdate) {
            res.app.locals.broadcastScoreUpdate(matchId, {
                homeScore: updated.homeScore,
                awayScore: updated.awayScore,
            });
        }

        res.status(200).json({
            data: { updated }
        });

    } catch (error) {
        next(error)
    }
}