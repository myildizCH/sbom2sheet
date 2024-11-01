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
npm run process-sboms
```

Note: The command above is enough to do the complete work of downloading SBOMs and generating excel file, the following commands are only to add additional capabilities.

-  Download SBOM files only:
Run the command to fetch SBOMs from your specified repositories:
```bash
npm run fetch-sboms
```

- Generate excel sheet out of downloaded SBOMs
```bash 
npm run generate-excel
```

- Clean up SBOM and output directories:

```bash
npm run clean
```

## Project Structure

```plaintext
src/
├── fetch/                # Module for fetching SBOM data
│   ├── fetch-sboms.ts    # Functions to fetch repositories and save SBOMs
│   └── index.ts          # Entry point for fetching
├── parse/                # Module for parsing SBOM data
│   ├── parse-sboms.ts    # Functions to parse SBOM files
│   └── index.ts          # Entry point for parsing
├── excel/                # Module for creating Excel files
│   ├── create-excel.ts   # Function to generate Excel from parsed data
│   └── index.ts          # Entry point for Excel generation
├── config.ts             # Configuration for paths and environment variables
└── main.ts               # Main coordination file
```
## Requirements

- Node.js v14+ and npm
- A GitHub Personal Access Token for API access

## License

This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License.
