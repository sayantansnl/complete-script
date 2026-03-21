import { getUserByEmail } from "../db/queries/users.js";
import { saveRefreshToken, getUserFromRefreshToken } from "../db/queries/refreshTokens.js";
import { verifyHash, makeJWT, makeRefreshToken, getBearerToken } from "../auth.js";
import { UserNotAuthenticatedError } from "../helpers/error.js";
import { respondWithJSON } from "../helpers/json.js";
import { config } from "../config.js";
export async function handlerLogin(req, res) {
    const params = req.body;
    const user = await getUserByEmail(params.email);
    if (!user) {
        throw new UserNotAuthenticatedError("unable to find user");
    }
    if (!await verifyHash(user.passwordHash, params.password)) {
        throw new UserNotAuthenticatedError("incorrect password or email");
    }
    const accessToken = makeJWT(user.id, config.jwtConfig.defaultDuration, config.jwtConfig.secret);
    const rT = makeRefreshToken();
    const saved = await saveRefreshToken(user.id, rT);
    if (!saved) {
        throw new UserNotAuthenticatedError("could not save refresh token");
    }
    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        username: user.username,
        email: user.email,
        token: accessToken,
        refreshToken: rT
    });
}
export async function handlerRefresh(req, res) {
    const token = getBearerToken(req);
    const result = await getUserFromRefreshToken(token);
    if (!result) {
        throw new UserNotAuthenticatedError("invalid refresh token");
    }
    const user = result.user;
    const accessToken = makeJWT(user.id, config.jwtConfig.defaultDuration, config.jwtConfig.secret);
    respondWithJSON(res, 200, {
        token: accessToken
    });
}
