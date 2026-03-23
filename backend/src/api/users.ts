import { Request, Response } from "express";
import { BadRequestError } from "../helpers/error.js";
import { hashPassword, getBearerToken, validateJWT } from "../auth.js";
import { createUser, updateUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { respondWithJSON } from "../helpers/json.js";
import { config } from "../config.js";

export async function handlerCreateUser(req: Request, res: Response) {
    type reqParams = {
        username: string;
        email: string;
        password: string;
    };

    const params: reqParams = req.body;

    if (!params.email || !params.username || !params.password) {
        throw new BadRequestError("paramters missing, unable to create user");
    }

    const hashed = await hashPassword(params.password);

    const user = await createUser({
        username: params.username,
        email: params.email,
        passwordHash: hashed
    });

    type NewUserPreview = Omit<NewUser, "passwordHash">;
    const newUserPreview: NewUserPreview = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        username: user.username
    };

    respondWithJSON(res, 201, newUserPreview);
}

export async function handlerUpdateUsers(req: Request, res: Response) {
    type reqParams = {
        username: string;
        email: string;
        password: string;
    };

    const params: reqParams = req.body;
    if (!params.username || !params.email || !params.password) {
        throw new BadRequestError("missing parameters");
    }
    const token = getBearerToken(req);
    const userID = validateJWT(token, config.jwtConfig.secret);
    const passwordHash = await hashPassword(params.password);

    const updatedUser = await updateUser(params.username, params.email, passwordHash, userID);
    if (!updatedUser) {
        throw new Error("unable to update user");
    }

    type UpdateResponse = Omit<NewUser, "passwordHash">;
    respondWithJSON(res, 200, {
        id: updatedUser.id,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        username: updatedUser.username,
        email: updatedUser.email
    } satisfies UpdateResponse);
}