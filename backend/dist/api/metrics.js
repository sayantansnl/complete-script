import { config } from "../config.js";
export function handlerMetrics(_, res) {
    res.header("Content-Type", "text/plain");
    res.send(`Hits: ${config.apiConfig.fileServerHits}`);
}
export function handlerReset(_, res) {
    config.apiConfig.fileServerHits = 0;
    res.header("Content-Type", "text/plain");
    res.send(`Reset Successful. Hits set back to ${config.apiConfig.fileServerHits}`);
}
