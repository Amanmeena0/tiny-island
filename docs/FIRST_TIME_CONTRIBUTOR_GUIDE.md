# 🌟 First-Time Contributor Guide

Welcome to **Tool Shed (Tiny-island)**! We are thrilled to have you here. 

This project is specially designed to be a safe, welcoming, and friendly space for **new open-source contributors** making their very first contribution to open source. Whether you are learning Git for the first time, building your first project, or wanting to get your name on an open-source contributor list, you are in the right place!

---

## 🎯 Ways You Can Make Your First Contribution

You can contribute to Tool Shed in **two different ways**:

### Method 1: Submit Your Own Tiny Tool or Game (Easiest & Most Fun!)
Have you built a small tool, script, CLI app, or mini-game in your own GitHub repository? 
- You don't need to touch the code of this repository!
- All you need to do is [open a Tool Submission Issue](https://github.com/Amanmeena0/tiny-island/issues/new?template=tool-submission.yml).
- Our automated bot will check your repository, a maintainer will approve it, and your project will automatically appear on the live website pegboard!
- 📖 **Read the full step-by-step guide**: [How to Submit a Tool or Game](file:///Users/amanmeena/Documents/Work/Tiny/Tiny-island/docs/SUBMIT_TOOL_OR_GAME_GUIDE.md)

### Method 2: Contribute Code, UI, or Docs to Tool Shed
Want to practice traditional Git workflows (forking, cloning, branching, opening a PR)?
- You can help us improve this website!
- Improve the design/UI, fix bugs, write documentation, or enhance automated scripts.
- 📖 **Read the developer guide**: [Code Contributor Guide](file:///Users/amanmeena/Documents/Work/Tiny/Tiny-island/docs/CODE_CONTRIBUTOR_GUIDE.md)

---

## 🚀 Step-by-Step: Making Your First Pull Request (PR)

If you decide to contribute code or docs directly to Tool Shed, follow this beginner-friendly step-by-step tutorial:

### Step 1: Fork this Repository
1. Look at the top-right corner of this GitHub page and click the **Fork** button.
2. Select your GitHub account. This creates a copy of `tiny-island` under your own account (e.g. `https://github.com/your-username/tiny-island`).

### Step 2: Clone Your Fork to Your Computer
Open your terminal (or command prompt / Git Bash) and run:

```bash
git clone https://github.com/YOUR-USERNAME/tiny-island.git
cd tiny-island
```

*(Replace `YOUR-USERNAME` with your actual GitHub username).*

### Step 3: Create a New Branch
Never make changes directly on the `main` branch. Create a new branch with a descriptive name:

```bash
git checkout -b feature/my-first-contribution
```

### Step 4: Make Your Changes & Test Locally
1. Install project dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser to view your changes.
4. Verify that project builds cleanly:
   ```bash
   npm run build
   ```

### Step 5: Commit Your Changes
After making your changes, stage and commit them:

```bash
# Add files to staging
git add .

# Commit with a clear message
git commit -m "docs: add first time contributor guide"
```

### Step 6: Push to GitHub
Push your branch to your forked repository on GitHub:

```bash
git push -u origin feature/my-first-contribution
```

### Step 7: Open a Pull Request (PR)
1. Go to your repository on GitHub (`https://github.com/YOUR-USERNAME/tiny-island`).
2. You will see a banner saying **"Compare & pull request"**. Click it!
3. Fill out the PR template explaining what changes you made.
4. Click **Create Pull Request**.
5. 🎉 **Congratulations! You just created your Pull Request!**

---

## 🤖 What Happens After You Submit?

- **Automated Checks**: GitHub Actions will automatically test your changes to ensure the project builds without errors.
- **Review**: A maintainer will review your code. Don't worry if changes are requested—code reviews are a normal and supportive part of open source!
- **Merge**: Once approved, your PR will be merged into the `main` branch, and your changes will go live automatically!

---

## 🛠️ Helpful Git Command Cheat Sheet

| Action | Command |
| :--- | :--- |
| **Check status** of modified files | `git status` |
| **Create and switch** to a new branch | `git checkout -b branch-name` |
| **Switch** to an existing branch | `git checkout branch-name` |
| **Stage all changes** | `git add .` |
| **Commit staged changes** | `git commit -m "description of changes"` |
| **Push branch to GitHub** | `git push -u origin branch-name` |
| **Pull latest changes from main** | `git pull origin main` |

---

## ❓ Frequently Asked Questions & Getting Help

- Need help or stuck on a step? Check our [Frequently Asked Questions (FAQ)](file:///Users/amanmeena/Documents/Work/Tiny/Tiny-island/docs/FAQ.md).
- Please ensure you follow our [Code of Conduct](file:///Users/amanmeena/Documents/Work/Tiny/Tiny-island/CODE_OF_CONDUCT.md) when interacting with maintainers and fellow contributors.

Welcome to the open-source community! Happy contributing! 🚀
