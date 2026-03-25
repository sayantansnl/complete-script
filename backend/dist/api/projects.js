import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
import { createNewProject, getProjectById, deleteProject, getAllProjectsByUserId } from "../db/queries/projects.js";
import { respondWithJSON } from "../helpers/json.js";
import { BadRequestError, NotFoundError, UserForbiddenError } from "../helpers/error.js";
export async function handlerCreateProject(req, res) {
    const params = req.body;
    const token = getBearerToken(req);
    const userID = validateJWT(token, config.jwtConfig.secret);
    const project = await createNewProject({
        userId: userID,
        title: params.title,
    });
    respondWithJSON(res, 201, project);
}
export async function handlerDeleteProject(req, res) {
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
        throw new UserForbiddenError("you can't delete this project");
    }
    await deleteProject(projectId);
    respondWithJSON(res, 204, null);
}
export async function handlerGetProject(req, res) {
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
        throw new UserForbiddenError("you're not allowed to view this project");
    }
    respondWithJSON(res, 200, project);
}
export async function handlerGetAllProjects(req, res) {
    const token = getBearerToken(req);
    const userID = validateJWT(token, config.jwtConfig.secret);
    const projects = await getAllProjectsByUserId(userID);
    respondWithJSON(res, 200, projects);
}
