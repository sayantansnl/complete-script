import { db } from "../index.js";
import { refreshTokens, users } from "../schema.js";
import { config } from "../../config.js";
import { and, eq, gt, isNull } from "drizzle-orm";
export async function saveRefreshToken(userId, token) {
    const rows = await db
        .insert(refreshTokens)
        .values({
        userId: userId,
        token: token,
        expiresAt: new Date(Date.now() + config.jwtConfig.refreshDuration),
        revokedAt: null,
    })
        .returning();
    return rows.length > 0;
}
export async function getUserFromRefreshToken(token) {
    const [result] = await db
        .select({ user: users })
        .from(users)
        .innerJoin(refreshTokens, eq(users.id, refreshTokens.userId))
        .where(and(eq(refreshTokens.token, token), isNull(refreshTokens.revokedAt), gt(refreshTokens.expiresAt, new Date())))
        .limit(1);
    return result;
}
