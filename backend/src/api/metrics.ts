import { Request, Response } from "express";
import { config } from "../config.js";

export function handlerMetrics(_: Request, res: Response) {
    res.header("Content-Type", "text/plain");
    res.send(`Hits: ${config.apiConfig.fileServerHits}`);
}

export function handlerReset(_: Request, res: Response) {
    config.apiConfig.fileServerHits = 0;
    res.header("Content-Type", "text/plain");
    res.send(`Reset Successful. Hits set back to ${config.apiConfig.fileServerHits}`);
}