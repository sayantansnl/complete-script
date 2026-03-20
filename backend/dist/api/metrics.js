import { reset } from "../db/queries/users.js";
import { config } from "../config.js";
import { UserForbiddenError } from "../helpers/error.js";
export function handlerMetrics(_, res) {
    res.header("Content-Type", "text/plain");
    res.send(`Hits: ${config.apiConfig.fileServerHits}`);
}
export async function handlerReset(_, res) {
    if (config.apiConfig.platform !== "dev") {
        console.log(`Platform: ${config.apiConfig.platform}`);
        throw new UserForbiddenError("Reset is only allowed in dev environment");
    }
    config.apiConfig.fileServerHits = 0;
    await reset();
    res.header("Content-Type", "text/plain");
    res.send(`Reset Successful. Hits set back to ${config.apiConfig.fileServerHits}`);
}
