import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
import { createNewProject, deleteProject, getAllProjectsByUserId, updateProject } from "../db/queries/projects.js";
import { respondWithJSON } from "../helpers/json.js";
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
    await deleteProject(req.project.id);
    respondWithJSON(res, 204, null);
}
export async function handlerGetProject(req, res) {
    respondWithJSON(res, 200, req.project);
}
export async function handlerUpdateProject(req, res) {
    const params = req.body;
    const updatedProject = await updateProject(req.userID, params.fountainText, params.outlineText, params.titlePageTitle, params.titlePageAuthor, params.titlePageBasedOn, params.titlePageContact, params.titlePageDraft, params.pageSize, params.fontPreferenceFamily, params.fontPreferenceSize, params.fontPreferenceLineSpacing);
    respondWithJSON(res, 200, updatedProject);
}
export async function handlerGetAllProjects(req, res) {
    const token = getBearerToken(req);
    const userID = validateJWT(token, config.jwtConfig.secret);
    const projects = await getAllProjectsByUserId(userID);
    respondWithJSON(res, 200, projects);
}
