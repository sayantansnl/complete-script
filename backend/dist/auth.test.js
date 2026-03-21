import { describe, it, expect, beforeAll } from "vitest";
import { hashPassword, verifyHash, makeJWT, validateJWT, extractToken } from "./auth";
import { UserNotAuthenticatedError, BadRequestError } from "./helpers/error";
describe("Password hashing", () => {
    const password1 = "iAm@batman";
    const password2 = "7heDude@bides";
    let hash1;
    let hash2;
    beforeAll(async () => {
        hash1 = await hashPassword(password1);
        hash2 = await hashPassword(password2);
    });
    it("should verify hash and return true", async () => {
        const match = await verifyHash(hash1, password1);
        expect(match).toBe(true);
    });
    it("should also be able to verify hash", async () => {
        const match = await verifyHash(hash2, password2);
        expect(match).toBe(true);
    });
});
describe("JWT Functions", () => {
    const secret = "secret";
    const wrongSecret = "wrong_secret";
    const userID = "some-unique-user-id";
    let validToken;
    beforeAll(() => {
        validToken = makeJWT(userID, 3600, secret);
    });
    it("should validate a valid token", () => {
        const result = validateJWT(validToken, secret);
        expect(result).toBe(userID);
    });
    it("should throw an error for an invalid token string", () => {
        expect(() => validateJWT("invalid.token.string", secret)).toThrow(UserNotAuthenticatedError);
    });
    it("should throw an error when the token is signed with a wrong secret", () => {
        expect(() => validateJWT(validToken, wrongSecret)).toThrow(UserNotAuthenticatedError);
    });
});
describe("extractBearerToken", () => {
    it("should extract the token from a valid header", () => {
        const token = "mySecretToken";
        const header = `Bearer ${token}`;
        expect(extractToken(header)).toBe(token);
    });
    it("should extract the token even if there are extra parts", () => {
        const token = "mySecretToken";
        const header = `Bearer ${token} extra-data`;
        expect(extractToken(header)).toBe(token);
    });
    it("should throw a BadRequestError if the header does not contain at least two parts", () => {
        const header = "Bearer";
        expect(() => extractToken(header)).toThrow(BadRequestError);
    });
    it('should throw a BadRequestError if the header does not start with "Bearer"', () => {
        const header = "Basic mySecretToken";
        expect(() => extractToken(header)).toThrow(BadRequestError);
    });
    it("should throw a BadRequestError if the header is an empty string", () => {
        const header = "";
        expect(() => extractToken(header)).toThrow(BadRequestError);
    });
});
