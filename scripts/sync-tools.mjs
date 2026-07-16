import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Octokit } from 'octokit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const token = process.env.GITHUB_TOKEN || process.env.PERSONAL_ACCESS_TOKEN;
const repoFullName = process.env.GITHUB_REPOSITORY || '';

async function sync() {
  console.log('Starting sync-tools script...');
  
  const dir = path.join(__dirname, '../data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, 'tools.json');

  if (!token) {
    console.warn('⚠️ No GITHUB_TOKEN or PERSONAL_ACCESS_TOKEN found. Skipping fetch and using empty/existing tools.json.');
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
    return;
  }

  if (!repoFullName) {
    console.warn('⚠️ GITHUB_REPOSITORY environment variable is not set. Skipping fetch and using empty/existing tools.json.');
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    }
    return;
  }

  const octokit = new Octokit({ auth: token });
  const [owner, repo] = repoFullName.split('/');

  try {
    console.log(`Fetching issues from ${repoFullName}...`);
    // List issues with labels 'tool-submission' and 'approved'
    const { data: issues } = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      labels: 'tool-submission,approved',
      state: 'all', // Fetch both open and closed issues as long as they are approved
      per_page: 100,
    });

    console.log(`Found ${issues.length} approved submissions.`);

    const tools = [];

    for (const issue of issues) {
      const parsed = parseIssueBody(issue.body);
      
      const name = parsed['tool name'] || issue.title.replace(/^Submission:\s*/i, '');
      const repoUrl = parsed['github repo url'] || '';
      const description = parsed['one-line description'] || '';
      const tagsRaw = parsed['tags'] || '';
      const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);
      const language = parsed['primary language'] || 'Unknown';
      const screenshot = parsed['screenshot/gif url'] || '';

      if (!repoUrl) {
        console.warn(`⚠️ Issue #${issue.number} has no repo URL. Skipping.`);
        continue;
      }

      const repoMatch = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/i);
      if (!repoMatch) {
        console.warn(`⚠️ Issue #${issue.number} has invalid repo URL: ${repoUrl}. Skipping.`);
        continue;
      }

      const repoOwner = repoMatch[1];
      const repoName = repoMatch[2].replace(/\.git$/i, '').trim();

      let stars = 0;
      let avatarUrl = issue.user?.avatar_url || '';

      try {
        console.log(`Fetching stars for ${repoOwner}/${repoName}...`);
        const { data: repoData } = await octokit.rest.repos.get({
          owner: repoOwner,
          repo: repoName,
        });
        stars = repoData.stargazers_count;
        if (repoData.owner && repoData.owner.avatar_url) {
          avatarUrl = repoData.owner.avatar_url;
        }
      } catch (err) {
        console.error(`❌ Failed to fetch stars for ${repoOwner}/${repoName}: ${err.message}`);
        // Keep going even if star count fetch fails
      }

      tools.push({
        id: issue.id,
        issueNumber: issue.number,
        name,
        repoUrl,
        repoOwner,
        repoName,
        description,
        tags,
        language,
        screenshot,
        stars,
        author: issue.user?.login || 'anonymous',
        authorAvatar: avatarUrl,
        createdAt: issue.created_at,
      });
    }

    fs.writeFileSync(filePath, JSON.stringify(tools, null, 2));
    console.log(`✅ Successfully synced ${tools.length} tools to ${filePath}`);
  } catch (error) {
    console.error(`❌ Sync failed: ${error.message}`);
    process.exit(1);
  }
}

function parseIssueBody(body) {
  const fields = {};
  if (!body) return fields;

  // Split by markdown headings starting with ###
  const sections = body.split(/(?=###\s+)/);
  for (const section of sections) {
    const lines = section.trim().split('\n');
    if (lines.length < 2) continue;

    const headingMatch = lines[0].match(/^###\s+(.+)$/);
    if (!headingMatch) continue;

    const label = headingMatch[1].trim().toLowerCase();
    const value = lines.slice(1).join('\n').trim();

    if (value === '_No response_' || value === 'No response') {
      fields[label] = '';
    } else {
      fields[label] = value;
    }
  }
  return fields;
}

sync();
