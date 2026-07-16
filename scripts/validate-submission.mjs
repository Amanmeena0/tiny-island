import fs from 'fs';
import { Octokit } from 'octokit';

const eventPath = process.env.GITHUB_EVENT_PATH;
if (!eventPath) {
  console.error('No GITHUB_EVENT_PATH found.');
  process.exit(1);
}

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error('No GITHUB_TOKEN found.');
  process.exit(1);
}

const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
const issueNumber = event.issue.number;
const issueBody = event.issue.body;
const repoFullName = process.env.GITHUB_REPOSITORY;
const [owner, repo] = repoFullName.split('/');

const octokit = new Octokit({ auth: token });

function parseIssueBody(body) {
  const fields = {};
  if (!body) return fields;

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

async function validate() {
  console.log(`Starting validation for issue #${issueNumber}...`);
  const parsed = parseIssueBody(issueBody);
  const repoUrl = parsed['github repo url'] || '';

  if (!repoUrl) {
    await failValidation('⚠️ The "GitHub Repo URL" field was left empty or is missing.');
    return;
  }

  const repoMatch = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/i);
  if (!repoMatch) {
    await failValidation(`⚠️ The provided URL \`${repoUrl}\` does not appear to be a valid GitHub repository URL. Please provide a URL in the format: \`https://github.com/username/repository\`.`);
    return;
  }

  const repoOwner = repoMatch[1];
  const repoName = repoMatch[2].replace(/\.git$/i, '').trim();

  try {
    console.log(`Checking if public repo ${repoOwner}/${repoName} exists...`);
    await octokit.rest.repos.get({
      owner: repoOwner,
      repo: repoName,
    });

    console.log('✅ Repository verified successfully.');
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body: `✅ **Repo Verified!** The repository \`${repoOwner}/${repoName}\` exists and is publicly accessible. A maintainer will review your submission shortly.`,
    });
  } catch (error) {
    console.error(`❌ Repository lookup failed: ${error.message}`);
    await failValidation(`⚠️ The GitHub repository \`${repoOwner}/${repoName}\` could not be found or is not public. Please ensure the repository is public and the spelling is correct.`);
  }
}

async function failValidation(reason) {
  console.log(`Validation failed: ${reason}`);
  
  // Post comment
  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body: reason,
  });

  // Add needs-info label
  await octokit.rest.issues.addLabels({
    owner,
    repo,
    issue_number: issueNumber,
    labels: ['needs-info'],
  });
}

validate().catch(err => {
  console.error(err);
  process.exit(1);
});
