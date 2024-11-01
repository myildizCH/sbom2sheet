import fs from 'fs-extra';
import { githubToken, githubOrganization, sbomFolder } from '../config';

interface RepositoryEdge {
    node: {
        name: string;
        nameWithOwner: string;
    };
    cursor: string;
}

interface RepositoriesResponse {
    organization: {
        repositories: {
            edges: RepositoryEdge[];
            pageInfo: {
                hasNextPage: boolean;
                endCursor: string | null;
            };
        };
    };
}

async function getOctokitInstance(): Promise<any> {
    const { Octokit } = await import("@octokit/rest"); 
    if (!githubToken) {
        throw new Error("GitHub token not found. Please set GITHUB_TOKEN in your .env file.");
    }
    return new Octokit({ auth: githubToken });
}

// Fetches all repositories for the organization using GraphQL, only unarchived ones.
export async function fetchAllRepositories(octokit: any): Promise<{ name: string; full_name: string }[]> {
    const repositories: { name: string; full_name: string }[] = [];
    let hasNextPage = true;
    let afterCursor: string | null = null;

    while (hasNextPage) {
        const response: RepositoriesResponse = await octokit.graphql({
            query: `
                query ($orgName: String!, $afterCursor: String) {
                    organization(login: $orgName) {
                        repositories(first: 100, after: $afterCursor, isArchived: false) {
                            edges {
                                node {
                                    name
                                    nameWithOwner
                                }
                                cursor
                            }
                            pageInfo {
                                hasNextPage
                                endCursor
                            }
                        }
                    }
                }`,
            orgName: githubOrganization,
            afterCursor,
        });

        const newRepos = response.organization.repositories.edges.map(edge => ({
            name: edge.node.name,
            full_name: edge.node.nameWithOwner,
        }));

        repositories.push(...newRepos);
        hasNextPage = response.organization.repositories.pageInfo.hasNextPage;
        afterCursor = response.organization.repositories.pageInfo.endCursor;
    }

    return repositories;
}

// Fetch SBOM data for a single repository and save it to a file.
export async function fetchSBOMForRepo(octokit: any, repoFullName: string, repoName: string): Promise<void> {
    try {
        const response = await octokit.request(
            "GET /repos/{owner}/{repo}/dependency-graph/sbom",
            {
                owner: repoFullName.split("/")[0],
                repo: repoFullName.split("/")[1],
                headers: {
                    Accept: "application/vnd.github+json",
                },
            }
        );

        const sbomFilePath = `${sbomFolder}/${repoName}.json`;
        await fs.ensureDir(sbomFolder);
        await fs.writeFile(sbomFilePath, JSON.stringify(response.data, null, 2));
        console.log(`Downloaded SBOM for ${repoName}`);
    } catch (error) {
        if (error instanceof Error && (error as any).status === 404) {
            console.warn(`No SBOM data found for ${repoFullName} (SBOM may not be enabled or repository has no dependencies). Skipping.`);
        } else if (error instanceof Error) {
            console.error(`Failed to fetch SBOM for ${repoFullName}:`, error.message);
        } else {
            console.error(`Unexpected error: ${String(error)}`);
        }
    }
}


// Main function to fetch all repositories and save their SBOMs.
export async function fetchReposAndSaveSBOMs(): Promise<void> {
    const octokit = await getOctokitInstance();

    // Ensure the sboms folder exists and clear it before new downloads
    await fs.ensureDir(sbomFolder);
    await fs.emptyDir(sbomFolder);

    const repos = await fetchAllRepositories(octokit);
    
    for (const repo of repos) {
        console.log(`Fetching SBOM for repository: ${repo.name}`);
        await fetchSBOMForRepo(octokit, repo.full_name, repo.name);
    }
    console.log("Finished fetching and saving all SBOMs.");
}
