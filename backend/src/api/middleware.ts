import { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  UnauthorizedError,
  UserNotAuthenticatedError,
  UserForbiddenError,
  NotFoundError
} from "../helpers/error.js";
import { respondWithError } from "../helpers/json.js";
import { config } from "../config.js";
import { getBearerToken, validateJWT,  } from "../auth.js";
import { getProjectById } from "../db/queries/projects.js";
import type { CompleteProject } from "../services/pdfOptions.js";

declare global {
  namespace Express {
    interface Request {
      project?: CompleteProject;
      userID?: string;
    }
  }
};

export function middlewareLogResponse(req: Request, res: Response, next: NextFunction) {
  res.on("finish", () => {
    if (res.statusCode >= 300) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`)
    }
  });
  next();
}

export function middlewareIncrementServerHits(_: Request, __: Response, next: NextFunction) {
  config.apiConfig.fileServerHits++;
  next();
}

export function middlewareHandleErrors(err: Error, _: Request, res: Response, __: NextFunction) {
  if (err instanceof BadRequestError) {
    respondWithError(res, 400, err.message);
  } else if (err instanceof UnauthorizedError || err instanceof UserNotAuthenticatedError) {
      respondWithError(res, 401, err.message);
  } else if (err instanceof UserForbiddenError) {
      respondWithError(res, 403, err.message);
  } else if (err instanceof NotFoundError) {
      respondWithError(res, 404, err.message);
  } else {
      console.error("Unhandled error:", err.message);
      console.error("Stack:", err.stack);
      respondWithError(res, 500, "Internal Server Error");
  }
}

export async function middlewareValidateProject(req: Request, _: Response, next: NextFunction) {
  const { projectId } = req.params;
  if (typeof projectId !== "string") {
    throw new BadRequestError("invalid project id");
  }
  const token = getBearerToken(req);
  const userID = validateJWT(token, config.jwtConfig.secret);
    
  const project = await getProjectById(projectId);
  if (!project) {
    throw new NotFoundError("project not found");
  }
    
  if (project.userId !== userID) {
    throw new UserForbiddenError("you're not allowed to access this project");
  }

  req.project = project;
  req.userID = userID;
  next();
}