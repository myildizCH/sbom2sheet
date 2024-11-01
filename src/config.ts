import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const sbomFolder = path.resolve(__dirname, "../sboms");
export const outputFolder = path.resolve(__dirname, "../output");
export const outputFilePath = path.join(outputFolder, "combined_sbom.xlsx");
export const githubToken = process.env.GITHUB_TOKEN;
export const githubOrganization = process.env.GITHUB_ORGANIZATION_NAME;
