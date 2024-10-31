import * as XLSX from 'xlsx';
import { SBOMEntry } from './parse-sboms';

export async function createExcelFile(dataRows: SBOMEntry[], outputPath: string) {
    const worksheetData = dataRows.map((row) => [
        row.repository,
        row.package,
        row.version,
        row.license,
    ]);

    // Define the new headers for excel
    const headers = ['Repository', 'Package', 'Version', 'License'];
    worksheetData.unshift(headers);

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'SBOM Data');
    XLSX.writeFile(workbook, outputPath);
    console.log(`Excel file saved at: ${outputPath}`);
}
