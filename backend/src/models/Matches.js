import {desc} from "drizzle-orm";

import { db } from "../db/db.js";
import { matches } from "../db/schema.js";
import { getMatchStatus } from "../utils/match-status.js";

class Matches {

    // create matches
    static async createMatches(parsedData){
         const { data: { startTime, endTime, homeScore, awayScore } } = parsedData;
         const result = await db.insert(matches).values({
                ...parsedData.data,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                homeScore: homeScore ?? 0,
                awayScore: awayScore ?? 0,
                status: getMatchStatus(startTime, endTime),
            }).returning();

    return result;

    }

    // get all matches
    static async getAllMatches(limit){
        const result = await db
            .select()
            .from(matches)
            .orderBy((desc(matches.createdAt)))
            .limit(limit)

        return result;

    }

    // get matches by Id
    static async getMatchById(matchId){
        const result = await db
            .select({
                id: matches.id,
                status: matches.status,
                startTime: matches.startTime,
                endTime: matches.endTime,
            })
            .from(matches)
            .where(eq(matches.id, matchId))
            .limit(1);

        return result;
    }

    // update matches by status
    static async updateMatchesStatus(nextStatus,matchId){
        const result =  await db
                .update(matches)
                .set({ status: nextStatus })
                .where(eq(matches.id, matchId));
        
        return result;
    }

    // Updated matches
    static async updateMatches(bodyParsed,matchId){
        const result = await db
            .update(matches)
            .set({
                homeScore: bodyParsed.data.homeScore,
                awayScore: bodyParsed.data.awayScore,
            })
            .where(eq(matches.id, matchId))
            .returning();

        return result;
    }
}

export default Matches;