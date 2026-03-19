import * as argon2 from "argon2";

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