import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { BadRequestError, UserNotAuthenticatedError } from "./helpers/error.js";
import { randomBytes } from "node:crypto";
const TOKEN_ISSUER = "complete_script";
export async function hashPassword(password) {
    try {
        const hash = await argon2.hash(password);
        return hash;
    }
    catch (err) {
        throw new Error("unable to hash password");
    }
}
export async function verifyHash(hash, password) {
    try {
        if (!await argon2.verify(hash, password)) {
            return false;
        }
        return true;
    }
    catch (err) {
        throw new Error("unable to verify hash");
    }
}
export function makeJWT(userID, expiresIn, secret) {
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = issuedAt + expiresIn;
    const token = jwt.sign({
        iss: TOKEN_ISSUER,
        sub: userID,
        iat: issuedAt,
        exp: expiresAt
    }, secret, { algorithm: "HS256" });
    return token;
}
export function validateJWT(tokenString, secret) {
    let decoded;
    try {
        decoded = jwt.verify(tokenString, secret);
    }
    catch (e) {
        throw new UserNotAuthenticatedError("Invalid token");
    }
    if (decoded.iss !== TOKEN_ISSUER) {
        throw new UserNotAuthenticatedError("Invalid issuer");
    }
    if (!decoded.sub) {
        throw new UserNotAuthenticatedError("No user ID in token");
    }
    return decoded.sub;
}
export function getBearerToken(req) {
    const bearerToken = req.get("Authorization");
    if (!bearerToken) {
        throw new BadRequestError("Malformed header");
    }
    return extractToken(bearerToken);
}
export function extractToken(bearerToken) {
    const split = bearerToken.split(" ");
    if (split.length < 2 || split[0] !== "Bearer") {
        throw new BadRequestError("malformed token");
    }
    return split[1].trim();
}
export function makeRefreshToken() {
    return randomBytes(256).toString("hex");
}
