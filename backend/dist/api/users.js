import { BadRequestError } from "../helpers/error.js";
import { hashPassword } from "../auth.js";
import { createUser } from "../db/queries/users.js";
import { respondWithJSON } from "../helpers/json.js";
export async function handlerCreateUser(req, res) {
    const params = req.body;
    if (!params.email || !params.username || !params.password) {
        throw new BadRequestError("paramters missing, unable to create user");
    }
    const hashed = await hashPassword(params.password);
    const user = await createUser({
        username: params.username,
        email: params.email,
        passwordHash: hashed
    });
    const newUserPreview = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        username: user.username
    };
    respondWithJSON(res, 201, newUserPreview);
}
