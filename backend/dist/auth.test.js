import { describe, it, expect, beforeAll } from "vitest";
import { hashPassword, verifyHash } from "./auth";
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
