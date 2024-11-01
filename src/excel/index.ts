import fs from 'fs-extra';
import { sbomFolder, outputFolder, outputFilePath } from '../config';
import { parseSBOMs } from '../parse';
import { createExcelFile } from './create-excel';

async function generateExcel() {
    console.log("Starting Excel generation process...");

    // Ensure output folder exists and is emptied
    await fs.ensureDir(outputFolder);
    await fs.emptyDir(outputFolder);

    const sbomsExists = await fs.pathExists(sbomFolder);
    if (!sbomsExists) {
        console.error(`Error: The sboms folder does not exist at path: ${sbomFolder}`);
        return;
    }

    const files = await fs.readdir(sbomFolder);
    const jsonFiles = files.filter((file: string) => file.endsWith('.json'));

    if (jsonFiles.length === 0) {
        console.warn("No SBOM files available in the sboms folder to process.");
        return;
    }

    console.log(`Found ${jsonFiles.length} SBOM files. Processing...`);

    const dataRows = await parseSBOMs(sbomFolder);

    // Create the Excel file from parsed SBOM data
    await createExcelFile(dataRows, outputFilePath);

    console.log("Excel generation completed.");
}

// Run the Excel generation function if this file is executed directly
if (require.main === module) {
    generateExcel().catch((error) => {
        console.error("Error generating Excel:", error);
    });
}
