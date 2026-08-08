import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import ToolGrid from '../components/ToolGrid';

interface Tool {
  id: number;
  issueNumber: number;
  name: string;
  repoUrl: string;
  deployUrl?: string;
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
  category?: string;
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
  const repoFullName = process.env.GITHUB_REPOSITORY || 'Amanmeena0/kojiima';
  const issueFormUrl = `https://github.com/${repoFullName}/issues/new?template=tool-submission.yml`;
  const repoUrl = `https://github.com/${repoFullName}`;

  return (
    <>
      {/* Site Header */}
      <header className="site-header">
        <div className="container header-container">
          <Link href="/" className="site-logo">
            🛠️ Koji<span>ima</span>
          </Link>
          <nav className="site-nav">
            <Link href="/pegboard" className="nav-link">PEGBOARD</Link>
            <Link href="/contributors" className="nav-link">CONTRIBUTORS</Link>
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
        <div className="container hero-container" style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            <span>Open Source Workshop Catalog</span>
          </div>
          
          <h1 className="serif-title hero-title">
            A Pegboard of Tiny, Wonderful Things
          </h1>

          <div className="hero-actions">
            <a href={issueFormUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Submit Your Project
            </a>
            <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              View Source Repo
            </a>
          </div>

          <div className="hero-features">
            <span className="hero-feature-pill">⚡ 100% Free & Open Source</span>
            <span className="hero-feature-pill">🛡️ No Logins or Trackers</span>
            <span className="hero-feature-pill">🛠️ GitHub Issue Powered</span>
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
            🛠️ <strong>Kojiima</strong> is an open-source catalog of solo-built tools and games.
          </p>
          <p className="footer-text" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
            Powered by GitHub Issues as a backend. <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="footer-link">Fork this project on GitHub</a>.
          </p>
        </div>
      </footer>
    </>
  );
}
