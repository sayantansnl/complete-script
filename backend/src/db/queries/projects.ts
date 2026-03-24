import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewProject, projects } from "../schema.js";

export async function createNewProject(newProject: NewProject) {
    const [result] = await db.insert(projects).values(newProject).onConflictDoNothing().returning();
    return result;
}

export async function getProjectById(projectId: string) {
    const [result] = await db.select().from(projects).where(eq(projects.id, projectId));
    return result;
}

export async function deleteProject(projectId: string) {
    await db.delete(projects).where(eq(projects.id, projectId));
}