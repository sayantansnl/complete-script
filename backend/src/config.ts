import { loadEnvFile, env } from "node:process";
import type { MigrationConfig } from "drizzle-orm/migrator";

const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/db/migrations"
};

loadEnvFile();

type Config = {
    apiConfig: APIConfig;
    dbConfig: DBConfig;
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

export const config: Config = {
    apiConfig: {
        fileServerHits: 0,
        platform: envOrThrow("PLATFORM"),
        port: envOrThrow("PORT")
    },
    dbConfig: {
        dbUrl: envOrThrow("DB_URL"),
        migration: migrationConfig
    }
};

export function envOrThrow(key: string): string {
    if (!env[key]) {
        throw new Error(`Environment variable ${key} not set`);
    }
    return env[key];
}