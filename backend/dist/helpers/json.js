export function respondWithJSON(res, statusCode, payload) {
    res.header("Content-Type", "application/json");
    const body = JSON.stringify(payload);
    res.status(statusCode).send(body);
}
export function respondWithError(res, statusCode, msg) {
    const errResp = {
        error: msg
    };
    respondWithJSON(res, statusCode, errResp);
}
