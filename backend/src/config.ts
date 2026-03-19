import { loadEnvFile, env } from "node:process";

loadEnvFile();

type Config = {
    apiConfig: APIConfig;
    dbConfig: DBConfig;
};

type APIConfig = {
    fileServerHits: number;
};

type DBConfig = {
    dbUrl: string;
};

export const config: Config = {
    apiConfig: {
        fileServerHits: 0
    },
    dbConfig: {
        dbUrl: envOrThrow("DB_URL")
    }
};

export function envOrThrow(key: string): string {
    if (!env[key]) {
        throw new Error(`Environment variable ${key} not set`);
    }
    return env[key];
}