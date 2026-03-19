import { Request, Response, NextFunction } from "express";
import {
    BadRequestError,
    UnauthorizedError,
    UserNotAuthenticatedError,
    ForbiddenError,
    NotFoundError
} from "../helpers/error.js";
import { respondWithError } from "../helpers/json.js";

export function middlewareLogResponse(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        if (res.statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`)
        }
    });
    next();
}

export function middlewareHandleErrors(err: Error, _: Request, res: Response, __: NextFunction) {
    if (err instanceof BadRequestError) {
        respondWithError(res, 400, err.message);
    } else if (err instanceof UnauthorizedError || err instanceof UserNotAuthenticatedError) {
        respondWithError(res, 401, err.message);
    } else if (err instanceof ForbiddenError) {
        respondWithError(res, 403, err.message);
    } else if (err instanceof NotFoundError) {
        respondWithError(res, 404, err.message);
    } else {
        respondWithError(res, 500, "Internal Server Error");
    }
}