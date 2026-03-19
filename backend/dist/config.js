import { loadEnvFile, env } from "node:process";
const migrationConfig = {
    migrationsFolder: "./src/db/migrations"
};
loadEnvFile();
export const config = {
    apiConfig: {
        fileServerHits: 0
    },
    dbConfig: {
        dbUrl: envOrThrow("DB_URL"),
        migration: migrationConfig
    }
};
export function envOrThrow(key) {
    if (!env[key]) {
        throw new Error(`Environment variable ${key} not set`);
    }
    return env[key];
}
