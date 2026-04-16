import { loadEnvFile, env } from "node:process";
const migrationConfig = {
    migrationsFolder: "./src/db/migrations"
};
loadEnvFile();
export const config = {
    apiConfig: {
        fileServerHits: 0,
        platform: envOrThrow("PLATFORM"),
        port: envOrThrow("PORT")
    },
    dbConfig: {
        dbUrl: envOrThrow("DB_URL"),
        migration: migrationConfig
    },
    jwtConfig: {
        secret: envOrThrow("SECRET"),
        issuer: envOrThrow("TOKEN_ISSUER"),
        defaultDuration: 60 * 60, //1 hour in seconds for JWT expiration
        refreshDuration: 30 * 24 * 60 * 60 * 1000 //30 days in milliseconds
    },
};
export function envOrThrow(key) {
    if (!env[key]) {
        throw new Error(`Environment variable ${key} not set`);
    }
    return env[key];
}
