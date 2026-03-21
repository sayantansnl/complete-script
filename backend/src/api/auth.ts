import { Request, Response } from "express";
import type { NewUser, NewRefreshToken } from "../db/schema.js";
import { getUserByEmail } from "../db/queries/users.js";
import { saveRefreshToken, getUserFromRefreshToken, revokeRefreshToken } from "../db/queries/refreshTokens.js";
import { verifyHash, makeJWT, makeRefreshToken, getBearerToken } from "../auth.js";
import { UserNotAuthenticatedError } from "../helpers/error.js";
import { respondWithJSON } from "../helpers/json.js";
import { config } from "../config.js";

export async function handlerLogin(req: Request, res: Response) {
    type reqParams = {
        email: string;
        password: string;
    };

    const params: reqParams = req.body;

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

    type UserPreview = Omit<NewUser, "passwordHash">;

    type LoginResponse = UserPreview & {
        token: string;
        refreshToken: string;
    };

    respondWithJSON(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        username: user.username,
        email: user.email,
        token: accessToken,
        refreshToken: rT
    } satisfies LoginResponse);
}

export async function handlerRefresh(req: Request, res: Response) {
    const refreshToken = getBearerToken(req);
    const result = await getUserFromRefreshToken(refreshToken);
    if (!result) {
        throw new UserNotAuthenticatedError("invalid refresh token");
    }
    const user = result.user;

    type response = {
        token: string;
    };

    const accessToken = makeJWT(user.id, config.jwtConfig.defaultDuration, config.jwtConfig.secret);
    respondWithJSON(res, 200, {
        token: accessToken
    } satisfies response);
}

export async function handlerRevoke(req: Request, res: Response) {
    const refreshToken = getBearerToken(req);
    await revokeRefreshToken(refreshToken);
    res.status(204).send();
}