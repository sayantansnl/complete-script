import { db } from "../index.js";
import { refreshTokens } from "../schema.js";
import { config } from "../../config.js";
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
