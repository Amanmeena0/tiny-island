import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contributors — Tool Shed 🛠️",
  description: "Meet the makers, developer champions, and core contributors behind the Tool Shed.",
};

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

interface ProjectContributor {
  username: string;
  avatarUrl: string;
  profileUrl: string;
  projects: {
    name: string;
    repoUrl: string;
    deployUrl?: string;
    description: string;
    stars: number;
  }[];
}

interface CodeContributor {
  username: string;
  name: string;
  avatarUrl: string;
  profileUrl: string;
  role: string;
  bio: string;
  commitsCount: number;
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

const codeContributors: CodeContributor[] = [
  {
    username: "Amanmeena0",
    name: "Aman Meena",
    avatarUrl: "https://github.com/Amanmeena0.png",
    profileUrl: "https://github.com/Amanmeena0",
    role: "Creator & Core Maintainer",
    bio: "Building developer platforms, interactive web experiences, and open-source workflows.",
    commitsCount: 6,
  }
];

export default function ContributorsPage() {
  const tools = getTools();
  
  // Group tools by author/contributor
  const projectContributorsMap: Record<string, ProjectContributor> = {};

  tools.forEach((tool) => {
    const author = tool.author;
    if (!projectContributorsMap[author]) {
      projectContributorsMap[author] = {
        username: author,
        avatarUrl: tool.authorAvatar || `https://github.com/${author}.png`,
        profileUrl: `https://github.com/${author}`,
        projects: [],
      };
    }
    
    // Avoid duplicate projects under the same author if any exist
    if (!projectContributorsMap[author].projects.some(p => p.name === tool.name)) {
      projectContributorsMap[author].projects.push({
        name: tool.name,
        repoUrl: tool.repoUrl,
        deployUrl: tool.deployUrl,
        description: tool.description,
        stars: tool.stars,
      });
    }
  });

  const projectContributors = Object.values(projectContributorsMap);
  const repoFullName = process.env.GITHUB_REPOSITORY || 'Amanmeena0/tiny-island';
  const repoUrl = `https://github.com/${repoFullName}`;
  const issueFormUrl = `https://github.com/${repoFullName}/issues/new?template=tool-submission.yml`;
  const contributingGuideUrl = `${repoUrl}/blob/main/CONTRIBUTING.md`;

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
      <section className="contributors-hero">
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h1 className="serif-title hero-title" style={{ fontSize: '3rem', marginBottom: '1.25rem', color: '#ffffff', lineHeight: 1.2 }}>
            The Artisans &amp; Builders
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '1.15rem', color: '#cbd5e1', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Meet the developers shaping the <strong>Tool Shed</strong>. Whether they contributed code to the dashboard or submitted a tiny project to the pegboard, they built this workshop.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="contributors-section">
        <div className="container">
          
          {/* Section 1: Core Maintainers & Code Contributors */}
          <section style={{ marginBottom: '5rem' }}>
            <h2 className="section-title">Core &amp; Code Contributors</h2>
            <div className="contributors-grid">
              {codeContributors.map((c) => (
                <article key={c.username} className="contributor-card core-contributor">
                  <div className="contributor-avatar-container">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={c.avatarUrl} 
                      alt={c.name} 
                      className="contributor-avatar" 
                    />
                  </div>
                  <h3 className="contributor-name">{c.name}</h3>
                  <a 
                    href={c.profileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="contributor-handle"
                  >
                    @{c.username}
                  </a>
                  <span className="contributor-badge">{c.role}</span>
                  <p className="contributor-bio">{c.bio}</p>
                  <div className="contributor-projects-title">Code Contributions</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--card-text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {c.commitsCount} Commits
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Section 2: Project Submitters */}
          <section>
            <h2 className="section-title">Project Contributors</h2>
            {projectContributors.length > 0 ? (
              <div className="contributors-grid">
                {projectContributors.map((c) => (
                  <article key={c.username} className="contributor-card">
                    <div className="contributor-avatar-container">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={c.avatarUrl} 
                        alt={c.username} 
                        className="contributor-avatar" 
                      />
                    </div>
                    <h3 className="contributor-name" style={{ fontSize: '1.2rem' }}>@{c.username}</h3>
                    <a 
                      href={c.profileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="contributor-handle"
                    >
                      GitHub Profile
                    </a>
                    <span className="contributor-badge amber-badge">
                      {c.projects.length} {c.projects.length === 1 ? 'Project' : 'Projects'}
                    </span>
                    <p className="contributor-bio" style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
                      Maker of {c.projects.map(p => p.name).join(', ')}
                    </p>
                    
                    <div className="contributor-projects-title">Contributed Projects</div>
                    <ul className="contributor-project-list">
                      {c.projects.map((p, idx) => (
                        <li key={idx} className="contributor-project-item">
                          <a 
                            href={p.deployUrl || p.repoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="contributor-project-link"
                          >
                            🚀 {p.name}
                          </a>
                          <span className="contributor-project-stars" title={`${p.stars} stars`}>
                            ★ {p.stars}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ maxWidth: '500px' }}>
                <h3 className="empty-title">No Project Submitters Yet</h3>
                <p className="empty-desc">Approved project authors will be shown here automatically.</p>
              </div>
            )}
          </section>

          {/* Section 3: Call to Action */}
          <section className="cta-container">
            <h2 className="cta-title">Want to see your name here?</h2>
            <p className="cta-text">
              We welcome submissions of all sizes! Build a tiny tool or game, open a submission issue, or help improve the platform frontend. Let&apos;s build the pegboard together!
            </p>
            <div className="cta-buttons">
              <a href={issueFormUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Submit a Project
              </a>
              <a href={contributingGuideUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                View Contribution Guide
              </a>
            </div>
          </section>

        </div>
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
