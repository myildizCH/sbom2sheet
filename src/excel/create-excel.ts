import * as XLSX from 'xlsx';
import { SBOMEntry } from '../parse';

export async function createExcelFile(dataRows: SBOMEntry[], outputPath: string): Promise<void> {
    if (dataRows.length === 0) {
        console.warn("Warning: No data available for Excel generation.");
    }

    const worksheetData = dataRows.map((row) => [row.repository, row.package, row.version, row.license]);
    worksheetData.unshift(['Repository', 'Package', 'Version', 'License']); // Add headers

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'SBOM Data');
    XLSX.writeFile(workbook, outputPath);

    console.log(`Excel file saved at: ${outputPath}`);
}
