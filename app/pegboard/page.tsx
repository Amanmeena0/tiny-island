import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import type { Metadata } from 'next';
import ToolGrid from '../../components/ToolGrid';

export const metadata: Metadata = {
  title: "Pegboard — Tool Shed 🛠️",
  description: "Browse, filter, and search tiny, free, open-source games and tools.",
};

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

export default function PegboardPage() {
  const tools = getTools();
  const repoFullName = process.env.GITHUB_REPOSITORY || 'Amanmeena0/tiny-island';
  const issueFormUrl = `https://github.com/${repoFullName}/issues/new?template=tool-submission.yml`;
  const repoUrl = `https://github.com/${repoFullName}`;

  return (
    <>
      {/* Site Header */}
      <header className="site-header">
        <div className="container header-container">
          <Link href="/" className="site-logo">
            🛠️ Tool<span>Shed</span>
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
      <section className="pegboard-hero" style={{ padding: '3.5rem 1.5rem 2.5rem 1.5rem' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h1 className="serif-title hero-title" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#ffffff', lineHeight: 1.2 }}>
            The Workshop Pegboard
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '1.05rem', color: '#cbd5e1', marginBottom: '0', lineHeight: 1.6 }}>
            Explore tiny, developer-built tools, CLI engines, and minimal retro games. Use the search and category tabs below to filter the board.
          </p>
        </div>
      </section>

      {/* Main Pegboard Grid Section */}
      <main style={{ flexGrow: 1, padding: '3rem 0' }}>
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
