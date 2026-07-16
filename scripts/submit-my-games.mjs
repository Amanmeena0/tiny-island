import { Octokit } from 'octokit';

const token = process.env.GITHUB_TOKEN;
const toolShedRepo = process.env.TOOL_SHED_REPO;

if (!token || !toolShedRepo) {
  console.error('❌ Error: Both GITHUB_TOKEN and TOOL_SHED_REPO env variables are required.');
  console.log('Usage: GITHUB_TOKEN="xxx" TOOL_SHED_REPO="your-username/tool-shed-repo" node submit-my-games.mjs');
  process.exit(1);
}

const [owner, repo] = toolShedRepo.split('/');
const octokit = new Octokit({ auth: token });

const games = [
  {
    name: 'Hangman Bot',
    url: 'https://github.com/ChaiWala-bihari/hangman',
    desc: 'A retro-styled Hangman game engine played entirely inside GitHub Issues.',
    tags: 'games, python, hangman, bot',
    lang: 'Python'
  },
  {
    name: 'Tic-Tac-Toe',
    url: 'https://github.com/ChaiWala-bihari/tic-tac-toe',
    desc: 'Classic 3x3 Grid Tic-Tac-Toe game engine supporting human and AI agent players in GitHub Issues.',
    tags: 'games, python, tictactoe, bot',
    lang: 'Python'
  },
  {
    name: 'Wordle Bot',
    url: 'https://github.com/ChaiWala-bihari/wordle',
    desc: 'A 5-letter word guessing game played against a referee bot inside GitHub Issues.',
    tags: 'games, python, wordle, bot',
    lang: 'Python'
  }
];

async function submitGames() {
  console.log(`🚀 Starting submission of 3 games to ${toolShedRepo}...`);

  for (const game of games) {
    const body = `### Tool Name

${game.name}

### GitHub Repo URL

${game.url}

### One-line Description

${game.desc}

### Tags

${game.tags}

### Primary Language

${game.lang}

### Screenshot/GIF URL

_No response_`;

    try {
      console.log(`Submitting ${game.name}...`);
      const { data: issue } = await octokit.rest.issues.create({
        owner,
        repo,
        title: `Submission: ${game.name}`,
        labels: ['tool-submission', 'pending'],
        body: body
      });
      console.log(`✅ Successfully submitted ${game.name}! Issue #${issue.number}: ${issue.html_url}`);
    } catch (err) {
      console.error(`❌ Failed to submit ${game.name}: ${err.message}`);
    }
  }
}

submitGames();
