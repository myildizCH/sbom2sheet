import fs from "fs-extra";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const token = process.env.GITHUB_TOKEN as string;

if (!token) {
  throw new Error("GitHub token not found. Please set GITHUB_TOKEN in your .env file.");
}

const orgName = process.env.GITHUB_ORGANIZATION_NAME as string;
const sbomFolder = path.resolve(__dirname, "../sboms");

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

export async function fetchAllRepositories(octokit: any) {
  let repos: { name: string; full_name: string }[] = [];
  let hasNextPage = true;
  let afterCursor: string | null = null;

  while (hasNextPage) {
    const response: RepositoriesResponse = await octokit.graphql({
      query: `
        query ($orgName: String!, $afterCursor: String) {
          organization(login: $orgName) {
            repositories(first: 100, after: $afterCursor, privacy: PUBLIC, isArchived: false) {
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
      orgName,
      afterCursor,
    });

    const newRepos = response.organization.repositories.edges.map((edge) => ({
      name: edge.node.name,
      full_name: edge.node.nameWithOwner,
    }));

    repos = repos.concat(newRepos);
    hasNextPage = response.organization.repositories.pageInfo.hasNextPage;
    afterCursor = response.organization.repositories.pageInfo.endCursor;
  }

  return repos;
}

// Fetches and saves the SBOM file for a specific repository
export async function fetchSBOMForRepo(octokit: any, repoFullName: string, repoName: string) {
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

    const sbomFilePath = path.join(sbomFolder, `${repoName}.json`);
    await fs.ensureDir(sbomFolder);
    await fs.writeFile(sbomFilePath, JSON.stringify(response.data, null, 2));
    console.log(`Downloaded SBOM for ${repoName}`);
  } catch (error) {
    console.error(`Failed to fetch SBOM for ${repoFullName}:`, error);
  }
}

// Main function that initializes Octokit and triggers the SBOM fetch process
async function main() {
  const { Octokit } = await import("@octokit/rest"); 

  const octokit = new Octokit({ auth: token });
  
  console.log("Fetching repositories...");
  const repos = await fetchAllRepositories(octokit);

  console.log("Fetching SBOMs...");
  for (const repo of repos) {
    await fetchSBOMForRepo(octokit, repo.full_name, repo.name);
  }

  console.log("Finished downloading all SBOMs.");
}

// Execute main if this file is run directly
if (require.main === module) {
  main().catch((error) => {
    console.error("Error in fetch-sboms:", error);
  });
}
