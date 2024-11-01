import fs from 'fs-extra';
import path from 'path';

export interface SBOMEntry {
    repository: string;
    package: string;
    version: string;
    license: string;
}

interface SBOMPackage {
    name: string;
    versionInfo?: string; 
    licenseDeclared?: string; 
    licenseConcluded?: string; 
}

function getLicense(pkg: SBOMPackage): string {
    if (pkg.licenseDeclared && pkg.licenseDeclared !== "NOASSERTION") {
        return pkg.licenseDeclared;
    }
    if (pkg.licenseConcluded && pkg.licenseConcluded !== "NOASSERTION") {
        return pkg.licenseConcluded;
    }
    return "";
}

async function parseSBOMFile(filePath: string): Promise<SBOMEntry[]> {
    const content = await fs.readFile(filePath, 'utf-8');
    const sbomData = JSON.parse(content);
    const repoName = sbomData.sbom?.name || path.basename(filePath, '.json');
    const packages: SBOMPackage[] = sbomData.sbom?.packages || []; // Type assertion for packages

    console.log(`Found ${packages.length} packages in ${filePath}`);

    return packages.map(pkg => ({
        repository: repoName,
        package: pkg.name || '',
        version: pkg.versionInfo || '',
        license: getLicense(pkg),
    }));
}

export async function parseSBOMs(folderPath: string): Promise<SBOMEntry[]> {
    const dataRows: SBOMEntry[] = [];
    const files = await fs.readdir(folderPath);

    console.log(`Found ${files.length} files in ${folderPath}`);

    for (const file of files) {
        if (file.endsWith('.json')) {
            const filePath = path.join(folderPath, file);
            console.log(`Reading file: ${filePath}`);
            const entries = await parseSBOMFile(filePath);
            dataRows.push(...entries);
        }
    }

    return dataRows;
}
