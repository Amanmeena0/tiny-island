# ❓ Frequently Asked Questions (FAQ)

Welcome to the **Tool Shed (Kojiima)** FAQ! Here are answers to common questions asked by new open-source contributors.

---

## 🌟 General & First-Time Contributor Questions

### Q1: I am brand new to Git and Open Source. Is this project suitable for me?
**Yes! Absolutely.** Tool Shed is specifically designed to welcome first-time open-source contributors. You can make your very first open-source contribution by submitting a project you built, or by contributing code/docs to this repository.

### Q2: Do I get credit on GitHub for my contribution?
**Yes!** 
- If you submit a tool/game via an issue, your GitHub handle and avatar will be listed on the live website pegboard, along with a dedicated author page!
- If you contribute code or documentation via a Pull Request, your GitHub profile will be listed in the repository's official GitHub Contributors list.

### Q3: What kind of projects can I submit to Tool Shed?
You can submit any **free, open-source** tool or game that has a public GitHub repository. Examples include:
- Mini web games or desktop games
- Command-line tools (CLIs)
- Productivity scripts or browser extensions
- Developer utilities or design toolkits

### Q4: Does my project need to be hosted live on a web server?
**No.** Hosting a live demo or website is completely optional. As long as your GitHub repository is public and functional, you can submit it.

---

## 🛠️ Submission & Automated Pipeline Questions

### Q5: How long does it take for my submitted tool to appear on the website?
- **Step 1 (Automated Check)**: Runs within 10-30 seconds of issue creation.
- **Step 2 (Maintainer Review)**: A maintainer reviews submissions regularly (usually within 24-48 hours).
- **Step 3 (Deployment)**: As soon as the `approved` label is added, GitHub Actions automatically rebuilds the site and deploys it live in 1-2 minutes.

### Q6: Why did the validation bot add the `needs-info` label to my issue?
The bot adds `needs-info` if:
1. The GitHub URL was left blank or typed incorrectly.
2. The repository is set to **Private** instead of **Public**.
3. The repository was deleted or renamed.

*To fix this:* Make sure your repo is set to Public, edit your issue body with the correct URL, and leave a comment asking for a re-check.

### Q7: How does Tool Shed fetch my project's GitHub stars?
The build script (`scripts/sync-tools.mjs`) calls the official GitHub REST API during every deployment to fetch live star counts for all approved repositories.

### Q8: Can AI agents submit projects to Tool Shed?
**Yes!** AI agents can submit projects programmatically by creating a GitHub Issue via the GitHub REST API using our structured issue format. Check the [Submit Tool or Game Guide](file:///Users/amanmeena/Documents/Work/kojima/kojima/docs/SUBMIT_TOOL_OR_GAME_GUIDE.md#programmatic-submission-for-ai-agents--cli-automation) for instructions.

---

## 💻 Code & Pull Request Questions

### Q9: Can I fix a typo or improve documentation?
**Yes!** Documentation fixes, spelling corrections, and improving developer guides are fantastic first contributions.

### Q10: My Pull Request build failed on GitHub Actions. What should I do?
1. Click on **Details** next to the failed check on your Pull Request.
2. Read the error log. Common reasons include linting errors or broken TypeScript types.
3. Test `npm run build` locally on your computer.
4. Push a new commit to your branch—GitHub Actions will re-run automatically!

---

## 📬 Still Have Questions?

If your question isn't answered here:
- Open a [Discussion / Issue](https://github.com/Amanmeena0/kojiima/issues) on GitHub.
- Tag a maintainer for assistance. We are here to help!
