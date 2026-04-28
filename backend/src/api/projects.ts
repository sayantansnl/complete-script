import path from "path";
import { fileURLToPath } from "url";
import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
import { 
  createNewProject,  
  deleteProject, 
  getAllProjectsByUserId,
  updateProject 
} from "../db/queries/projects.js";
import { respondWithJSON, respondWithError } from "../helpers/json.js";
import { buildBlocks } from "../services/blocks.js";
import { renderScreenplay } from "../services/pdfExport.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FONTS_DIR = path.join(__dirname, "../../fonts");

export async function handlerCreateProject(req: Request, res: Response) {
  type reqParams = {
    title: string;
  };
  const params: reqParams = req.body;

  const token = getBearerToken(req);
  const userID = validateJWT(token, config.jwtConfig.secret);

  const project = await createNewProject({
    userId: userID,
    title: params.title,
  });

  respondWithJSON(res, 201, project);
}

export async function handlerDeleteProject(req: Request, res: Response) {
  await deleteProject(req.project!.id);
  respondWithJSON(res, 204, null);
}

export async function handlerGetProject(req: Request, res: Response) {
  respondWithJSON(res, 200, req.project!);
}

export async function handlerUpdateProject(req: Request, res: Response) {
  type reqParams = {
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
  };

  const params: reqParams = req.body;
  const updatedProject = await updateProject(
    req.userID!,
    params.fountainText,
    params.outlineText,
    params.titlePageTitle,
    params.titlePageAuthor,
    params.titlePageBasedOn,
    params.titlePageContact,
    params.titlePageDraft,
    params.pageSize,
    params.fontPreferenceFamily,
    params.fontPreferenceSize,
    params.fontPreferenceLineSpacing,
  );
  respondWithJSON(res, 200, updatedProject);
}

export async function handlerGetAllProjects(req: Request, res: Response) {
  const token = getBearerToken(req);
  const userID = validateJWT(token, config.jwtConfig.secret);
    
  const projects = await getAllProjectsByUserId(userID);
  respondWithJSON(res, 200, projects);
}

export async function handlerExportPDF(req: Request, res: Response) {
  const project = req.project!;

  const blocks = buildBlocks(project.fountainText ?? "");

  const doc = new PDFDocument({
    margin: 25,
    size: project.pageSize === "a4" ? "A4" : "LETTER",
  });

  if (project.fontPreference?.family === "Courier Prime") {
    doc.registerFont("Courier Prime", path.join(FONTS_DIR, "CourierPrime-Regular.ttf"));
    doc.registerFont("Courier Prime Bold", path.join(FONTS_DIR, "CourierPrime-Bold.ttf"));
    doc.registerFont("Courier Prime Italic", path.join(FONTS_DIR, "CourierPrime-Italic.ttf"));
    doc.registerFont("Courier Prime Bold Italic", path.join(FONTS_DIR, "CourierPrime-BoldItalic.ttf"));
  }

  const safeTitle = project.title.replace(/[^a-z0-9]/gi, "_");

  try {
    console.log("starting PDF render");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${safeTitle}.pdf`);
    doc.pipe(res);
    renderScreenplay(doc, blocks, {
      fountainText: project.fountainText ?? "",
      titlePageData: project.titlePageData ?? {},
      pageSize: (project.pageSize as "us-letter" | "a4") ?? "us-letter",
      fontPreference: project.fontPreference ?? {
        family: "Courier",
        size: 12,
        lineSpacing: 1
      }
    });
    doc.end();
    } catch (err) {
      console.error("PDF render error:", err);
      if (!res.headersSent) {
        respondWithError(res, 500, "Failed to generate PDF");
      } else {
        res.end();
      }
      throw err;
    }
}