type APIConfig = {
    fileServerHits: number;
};

type Config = {
    apiConfig: APIConfig;
};

export const config: Config = {
    apiConfig: {
        fileServerHits: 0
    }
};