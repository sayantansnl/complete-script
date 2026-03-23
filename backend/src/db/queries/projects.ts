import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewUser, users, NewProject, projects } from "../schema.js";

export async function createNewProject(newProject: NewProject) {
    const [result] = await db.insert(projects).values(newProject).onConflictDoNothing().returning();
    return result;
}