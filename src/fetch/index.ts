import { fetchReposAndSaveSBOMs } from './fetch-sboms';

// Run function to execute the main SBOM fetching process
async function run() {
    try {
        console.log("Starting SBOM fetching process...");
        await fetchReposAndSaveSBOMs();
        console.log("SBOM fetching process completed.");
    } catch (error) {
        console.error("An error occurred during SBOM fetching:", error);
    }
}

// Execute run only if index.ts is called directly
if (require.main === module) {
    run();
}
