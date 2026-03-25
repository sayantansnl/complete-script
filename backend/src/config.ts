import { loadEnvFile, env } from "node:process";
import type { MigrationConfig } from "drizzle-orm/migrator";

const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/db/migrations"
};

loadEnvFile();

type Config = {
    apiConfig: APIConfig;
    dbConfig: DBConfig;
    jwtConfig: JWTConfig;
};

type APIConfig = {
    fileServerHits: number;
    port: string;
    platform: string;
};

type DBConfig = {
    dbUrl: string;
    migration: MigrationConfig;
};

type JWTConfig = {
    secret: string;
    issuer: string;
    defaultDuration: number;
    refreshDuration: number;
};

export const config: Config = {
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
        defaultDuration: 60 * 60,
        refreshDuration: 60 * 60 * 24 * 60 * 1000
    },
};

export function envOrThrow(key: string): string {
    if (!env[key]) {
        throw new Error(`Environment variable ${key} not set`);
    }
    return env[key];
}