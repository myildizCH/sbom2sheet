import fs from 'fs-extra';
import path from 'path';

export interface SBOMEntry {
    repository: string;
    package: string;
    version: string;
    license: string;
}

export async function parseSBOMs(folderPath: string): Promise<SBOMEntry[]> {
    const dataRows: SBOMEntry[] = [];

    const files = await fs.readdir(folderPath);
    console.log(`Found ${files.length} files in ${folderPath}`);

    for (const file of files) {
        if (file.endsWith('.json')) {
            const filePath = path.join(folderPath, file);
            const content = await fs.readFile(filePath, 'utf-8');
            console.log(`Reading file: ${filePath}`);
            const sbomData = JSON.parse(content);

            // Access the packages array under sbom
            const repoName = sbomData.sbom?.name || path.basename(file, '.json');
            const packages = sbomData.sbom?.packages || [];

            console.log(`Found ${packages.length} packages in ${filePath}`);

            for (const pkg of packages) {
                const license = 
                    pkg.licenseDeclared && pkg.licenseDeclared !== "NOASSERTION"
                        ? pkg.licenseDeclared
                        : pkg.licenseConcluded && pkg.licenseConcluded !== "NOASSERTION"
                        ? pkg.licenseConcluded
                        : "";

                dataRows.push({
                    repository: repoName,
                    package: pkg.name || '',
                    version: pkg.versionInfo || '',
                    license: license,
                });
            }
        }
    }

    console.log(`Parsed data rows:`, dataRows);
    return dataRows;
}