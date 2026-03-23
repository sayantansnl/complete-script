import { db } from "../index.js";
import { projects } from "../schema.js";
export async function createNewProject(newProject) {
    const [result] = await db.insert(projects).values(newProject).onConflictDoNothing().returning();
    return result;
}
