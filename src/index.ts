import { fetchAllRepositories, fetchSBOMForRepo } from './fetch-sboms';
import { parseSBOMs, SBOMEntry } from './parse-sboms';
import { createExcelFile } from './create-excel';
import fs from "fs-extra";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const sbomFolder = path.resolve(__dirname, "../sboms");
const outputFolder = path.resolve(__dirname, "../output");  
const outputFilePath = path.join(outputFolder, "combined_sbom.xlsx");


async function main() {
    const { Octokit } = await import("@octokit/rest");
    const token = process.env.GITHUB_TOKEN;
    const octokit = new Octokit({ auth: token });

    try {
        console.log("Starting SBOM processing...");

         // Ensure the sboms folder exists
        await fs.ensureDir(sbomFolder);
        await fs.ensureDir(outputFolder);

        // Clear the sboms folder before downloading new files
        await fs.emptyDir(sbomFolder);

        // Fetch and save SBOM files
        const allRepos = await fetchAllRepositories(octokit);
        for (const repo of allRepos) {
            console.log(`Processing repository: ${repo.name}`);
            await fetchSBOMForRepo(octokit, repo.full_name, repo.name);
        }
        console.log("Finished downloading all SBOMs.");

        // Parse SBOM files and create excel
        const dataRows: SBOMEntry[] = await parseSBOMs(sbomFolder);

        // Remove old Excel file if it exists
        await fs.remove(outputFilePath);

        // Create a new excel file
        await createExcelFile(dataRows, outputFilePath);
        console.log(`SBOM spreadsheet created at ${outputFilePath}`);
    } catch (error) {
        console.error("Error during SBOM processing:", error);
    }
}

main().catch((error) => {
  console.error("Unexpected error:", error);
});
