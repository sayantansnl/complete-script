import { eq, desc } from "drizzle-orm";
import { db } from "../index.js";
import { projects } from "../schema.js";
import { NotFoundError } from "../../helpers/error.js";
export async function createNewProject(newProject) {
    const [result] = await db.insert(projects).values(newProject).onConflictDoNothing().returning();
    return result;
}
export async function getProjectById(projectId) {
    const [result] = await db.select().from(projects).where(eq(projects.id, projectId));
    return result;
}
export async function deleteProject(projectId) {
    await db.delete(projects).where(eq(projects.id, projectId));
}
export async function getAllProjectsByUserId(userId) {
    const result = await db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.createdAt));
    if (!result.length) {
        throw new NotFoundError("no projects found for this user");
    }
    return result;
}
