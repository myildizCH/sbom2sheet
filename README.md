# SBOM to Excel Converter

This project fetches Software Bill of Materials (SBOM) files from GitHub repositories for a given organization, parses them, and generates an Excel file summarizing the dependencies and licenses.

## Features

- Fetch SBOMs from GitHub repositories.
- Parse SBOM files and extract relevant package information.
- Generate a consolidated Excel file with repository, package, version, and license information.

## Setup

1. **Install dependencies**:

```bash
npm install
```

2. ***Environment setup***:

Create a `.env` file in the root with your GitHub token:
```plaintext
GITHUB_TOKEN=your_github_token_here
GITHUB_ORGANIZATION_NAME=your_github-org_name_here
```
## Usage

- Download SBOM files and generate Excel file out of it:
Parse the SBOMs and create an Excel file:
```bash
npm run create-excel
```

Note: The command above is enough to do the complete work of downloading SBOMs and generating excel file, the following commands are only to add additional capabilities.

-  Download SBOM files only:
Run the command to fetch SBOMs from your specified repositories:
```bash
npm run fetch-sboms
```


- Clean up SBOM and output directories:
Once done, clear the directories:

```bash
npm run clean
```

- Scripts

```bash
# Downloads SBOM files from GitHub.
npm run fetch-sboms

# Generates an Excel file from the downloaded SBOMs.
npm run create-excel

# Deletes the contents of sboms/ and output/ folders.
npm run clean
```
## Project Structure

```plaintext
.
├── src/
│   ├── index.ts              # Main script for creating Excel from SBOMs
│   ├── fetch-sboms.ts        # Handles SBOM fetching from GitHub
│   ├── parse-sboms.ts        # Parses SBOM files
│   ├── create-excel.ts       # Generates Excel file from parsed data
├── sboms/                    # SBOM files are saved here
├── output/                   # Generated Excel file is saved here
└── .env                      # Environment variables are stored here
```
## Requirements

- Node.js v14+ and npm
- A GitHub Personal Access Token for API access

## License

This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License.
