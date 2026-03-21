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
        defaultDuration: 60 * 60,
        refreshDuration: 60 * 60 * 24 * 60 * 1000
    },
};
export function envOrThrow(key) {
    if (!env[key]) {
        throw new Error(`Environment variable ${key} not set`);
    }
    return env[key];
}
