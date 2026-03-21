import { Request, Response } from "express";
import type { NewUser, NewRefreshToken } from "../db/schema.js";
import { getUserByEmail } from "../db/queries/users.js";
import { saveRefreshToken } from "../db/queries/refreshTokens.js";
import { verifyHash, makeJWT, makeRefreshToken } from "../auth.js";
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