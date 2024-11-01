import { fetchReposAndSaveSBOMs } from './fetch/fetch-sboms';
import { parseSBOMs } from './parse/parse-sboms';
import { createExcelFile } from './excel/create-excel';
import { sbomFolder, outputFilePath } from './config';

async function main() {
    console.log("Starting full SBOM processing...");

    // Step 1: Fetch and save SBOM files
    await fetchReposAndSaveSBOMs();

    // Step 2: Parse the downloaded SBOM files
    const dataRows = await parseSBOMs(sbomFolder); // Pass sbomFolder if required

    // Step 3: Generate an Excel file from parsed data
    await createExcelFile(dataRows, outputFilePath);

    console.log("SBOM processing completed successfully.");
}

// Run main process if this file is executed directly
main().catch((error) => console.error("Unexpected error:", error));
