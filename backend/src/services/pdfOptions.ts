import { projects } from "../db/schema.js";

export type CompleteProject = typeof projects.$inferSelect;
export type TitlePageData = NonNullable<CompleteProject["titlePageData"]>;
export type FontPreference = NonNullable<CompleteProject["fontPreference"]>;

export interface PDFOptions {
    fountainText: string;
    titlePageData: TitlePageData;
    pageSize: "us-letter" | "a4";
    fontPreference: FontPreference;
};