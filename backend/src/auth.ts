import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { BadRequestError, UserNotAuthenticatedError } from "./helpers/error.js";
import { Request } from "express";
import { randomBytes} from "node:crypto";
import { config } from "./config.js"

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export async function hashPassword(password: string): Promise<string> {
    try {
        const hash = await argon2.hash(password);
        return hash;
    } catch (err) {
        throw new Error("unable to hash password");
    }
}

export async function verifyHash(hash: string, password: string): Promise<boolean> {
    try {
        if (!await argon2.verify(hash, password)) {
            return false;
        }
        return true;
    } catch (err) {
        throw new Error("unable to verify hash");
    }
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = issuedAt + expiresIn;
    const token = jwt.sign({
        iss: config.jwtConfig.issuer,
        sub: userID,
        iat: issuedAt,
        exp: expiresAt
    }, secret, { algorithm: "HS256" });
    return token;
}

export function validateJWT(tokenString: string, secret: string) {
    let decoded: payload;
    try {
        decoded = jwt.verify(tokenString, secret) as JwtPayload;
    } catch (e) {
        throw new UserNotAuthenticatedError("Invalid token");
    }

    if (decoded.iss !== config.jwtConfig.issuer) {
        throw new UserNotAuthenticatedError("Invalid issuer");
    }

    if (!decoded.sub) {
        throw new UserNotAuthenticatedError("No user ID in token");
    }

    return decoded.sub;
}

export function getBearerToken(req: Request): string {
    const bearerToken = req.get("Authorization");
    if (!bearerToken) {
        throw new UserNotAuthenticatedError("Malformed header");
    }
    return extractToken(bearerToken);
}

export function extractToken(bearerToken: string): string {
    const split = bearerToken.split(" ");
    if (split.length < 2 || split[0] !== "Bearer") {
        throw new BadRequestError("malformed token");
    }
    return split[1].trim();
}

export function makeRefreshToken() {
    return randomBytes(256).toString("hex");
}