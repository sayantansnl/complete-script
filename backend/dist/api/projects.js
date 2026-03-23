import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
import { createNewProject } from "../db/queries/projects.js";
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
