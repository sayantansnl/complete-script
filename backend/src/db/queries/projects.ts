import { eq, desc } from "drizzle-orm";
import { db } from "../index.js";
import { NewProject, projects } from "../schema.js";
import { NotFoundError } from "../../helpers/error.js";

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

export async function getAllProjectsByUserId(userId: string) {
    const result = await db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.createdAt));
    if (!result.length) {
        throw new NotFoundError("no projects found for this user");
    }
    return result;
}

export async function updateProject(
    userID: string,
    fountainText?: string,
    outlineText?: string,
    titlePageTitle?: string,
    titlePageAuthor?: string,
    titlePageBasedOn?: string,
    titlePageContact?: string,
    titlePageDraft?: string,
    pageSize?: string,
    fontPreferenceFamily?: string,
    fontPreferenceSize?: number,
    fontPreferenceLineSpacing?: number
) {
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