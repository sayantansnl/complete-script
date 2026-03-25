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
export async function updateProject(userID, fountainText, outlineText, titlePageTitle, titlePageAuthor, titlePageBasedOn, titlePageContact, titlePageDraft, pageSize, fontPreferenceFamily, fontPreferenceSize, fontPreferenceLineSpacing) {
    const defaultfontFamily = "Courier Prime";
    const defaultfontSize = 12;
    const defaultlineSpacing = 1;
    if (!fontPreferenceFamily) {
        fontPreferenceFamily = defaultfontFamily;
    }
    if (!fontPreferenceSize) {
        fontPreferenceSize = defaultfontSize;
    }
    if (!fontPreferenceLineSpacing) {
        fontPreferenceLineSpacing = defaultlineSpacing;
    }
    const [result] = await db
        .update(projects)
        .set({
        fountainText: fountainText,
        outlineText: outlineText,
        titlePageData: {
            title: titlePageTitle,
            author: titlePageAuthor,
            basedOn: titlePageBasedOn,
            contact: titlePageContact,
            draft: titlePageDraft,
        },
        pageSize: pageSize,
        fontPreference: {
            family: fontPreferenceFamily,
            size: fontPreferenceSize,
            lineSpacing: fontPreferenceLineSpacing
        }
    })
        .where(eq(projects.userId, userID))
        .returning();
    return result;
}
