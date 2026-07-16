# 🛠️ Tool Shed

Welcome to the **Tool Shed** (Tiny-island)—a custom "workshop pegboard" catalog of tiny, free, open-source games and tools. This project runs entirely on GitHub: issue templates serve as the submission form, approved issue comments act as the database, and GitHub Actions triggers static builds deployed directly to GitHub Pages.

---

## 🛠️ Local Development

### Prerequisites

- Node.js (v20 or higher)
- npm (v10 or higher)

### Installation

Navigate to the `Tiny-island` directory and install dependencies:

```bash
cd Tiny-island
npm install
```

### Running the Dev Server

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the site.

### Building for Production (Static Export)

To verify the project builds and exports successfully into static HTML/CSS/JS (saved in the `out/` folder):

```bash
npm run build
```

---

## 🔄 Testing the Sync Script Locally

The build uses a Node.js script `scripts/sync-tools.mjs` to fetch approved submissions from GitHub Issues, query their live GitHub star count, and compile them into `data/tools.json`.

To run and test the sync script locally:

1. **Create a Personal Access Token (PAT):**
   Go to **GitHub Settings → Developer Settings → Personal Access Tokens (classic)** and generate a token with the `public_repo` scope.

2. **Run the script with environment variables:**
   Provide the token and the target repository coordinates (`GITHUB_REPOSITORY`):

   ```bash
   PERSONAL_ACCESS_TOKEN="your_personal_access_token" \
   GITHUB_REPOSITORY="username/repository_name" \
   node scripts/sync-tools.mjs
   ```

3. **Verify results:**
   Check the generated `data/tools.json` file to make sure your approved issues are parsed and active star counts are populated.

---

## 🚀 GitHub Pages First-Time Setup

To deploy the static site to GitHub Pages using GitHub Actions, follow these configuration steps in your repository settings:

1. **Set Pages Source to GitHub Actions:**
   - Go to your repository on GitHub.
   - Navigate to **Settings → Pages**.
   - Under **Build and deployment → Source**, select **GitHub Actions** from the dropdown menu (instead of "Deploy from a branch").

2. **Configure Workflow Permissions:**
   - Navigate to **Settings → Actions → General**.
   - Scroll down to **Workflow permissions**.
   - Select **Read and write permissions** (this allows the validation workflow to add labels and comments, and the build-deploy workflow to write Pages deployments).
   - Check **Allow GitHub Actions to create and approve pull requests** (if needed) and click **Save**.

---

## 🤖 Programmatic Submission (For AI Agents)

AI agents can submit new tools or games programmatically by opening an issue via the GitHub API instead of using the web form UI. 

### API Endpoint

`POST https://api.github.com/repos/{owner}/{repo}/issues`

### Required Payload

The issue must:
1. Apply the labels `["tool-submission", "pending"]`.
2. Format the body in the exact markdown structure expected by the parser.

### Required Markdown Body Format

Agents must construct the issue body exactly as follows (including the headings):

```markdown
### Tool Name

My Agent Tool

### GitHub Repo URL

https://github.com/username/repo

### One-line Description

A short description of my programmatically submitted tool.

### Tags

games, tools, cli

### Primary Language

Python

### Screenshot/GIF URL

https://example.com/demo.gif
```

*(Note: The `Screenshot/GIF URL` section is optional. If left blank, use `_No response_` or omit content beneath it).*
