import { eq, desc } from "drizzle-orm";

import { db } from "../db/db.js";
import { commentary } from "../db/schema.js";


class Commentary {

    // get commentary by match
    static async getCommentaryById(matchId, safeLimit){
        const results = await db
            .select()
            .from(commentary)
            .where(eq(commentary.matchId, matchId))
            .orderBy(desc(commentary.createdAt))
            .limit(safeLimit);

        return results;
    }

    // create a commentary by match
    static async createCommentary(data, paramsResult){

        const { minute, ...rest } = data;

        const result = await db.insert(commentary).values({
            matchId: paramsResult.data.id,
            minute,
            ...rest
        }).returning();

        return result;
    }
}

export default Commentary;