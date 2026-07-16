import fs from 'fs';
import path from 'path';
import ToolGrid from '../components/ToolGrid';

interface Tool {
  id: number;
  issueNumber: number;
  name: string;
  repoUrl: string;
  repoOwner: string;
  repoName: string;
  description: string;
  tags: string[];
  language: string;
  screenshot: string;
  stars: number;
  author: string;
  authorAvatar: string;
  createdAt: string;
}

function getTools(): Tool[] {
  try {
    const filePath = path.join(process.cwd(), 'data/tools.json');
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error('Error reading tools data:', error);
  }
  return [];
}

export default function Home() {
  const tools = getTools();
  const repoFullName = process.env.GITHUB_REPOSITORY || 'username/repo';
  const issueFormUrl = `https://github.com/${repoFullName}/issues/new?template=tool-submission.yml`;
  const repoUrl = `https://github.com/${repoFullName}`;

  return (
    <>
      {/* Site Header */}
      <header className="site-header">
        <div className="container header-container">
          <a href="#" className="site-logo">
            🛠️ Tool<span>Shed</span>
          </a>
          <nav className="site-nav">
            <a href="#pegboard" className="nav-link">PEGBOARD</a>
            <a 
              href={issueFormUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary"
              style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
            >
              SUBMIT A PROJECT
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pegboard-hero">
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h1 className="serif-title hero-title" style={{ fontSize: '3rem', marginBottom: '1.25rem', color: '#ffffff', lineHeight: 1.2 }}>
            A Pegboard of Tiny, Wonderful Things
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '1.15rem', color: '#cbd5e1', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Welcome to the <strong>Tool Shed</strong>—a workshop directory showcasing tiny, free, and open-source games & tools. 
            No logins, no ads, no trackers. Hosted entirely on GitHub, approved by human maintainers, and built straight from GitHub Issues.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href={issueFormUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Submit Your Project
            </a>
            <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              View Source Repo
            </a>
          </div>
        </div>
      </section>

      {/* Main Pegboard Section */}
      <main id="pegboard" style={{ flexGrow: 1, padding: '2rem 0' }}>
        <ToolGrid initialTools={tools} issueFormUrl={issueFormUrl} />
      </main>

      {/* Site Footer */}
      <footer className="site-footer">
        <div className="container footer-container">
          <p className="footer-text">
            🛠️ <strong>Tool Shed</strong> is an open-source catalog of solo-built tools and games.
          </p>
          <p className="footer-text" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
            Powered by GitHub Issues as a backend. <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="footer-link">Fork this project on GitHub</a>.
          </p>
        </div>
      </footer>
    </>
  );
}
