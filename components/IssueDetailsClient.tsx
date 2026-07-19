'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import GoogleDriveMedia from './GoogleDriveMedia';
import Markdown from './Markdown';

interface GitHubLabel {
  id: number;
  name: string;
  color: string;
}

interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
}

interface GitHubIssue {
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  user: GitHubUser;
  created_at: string;
  labels: GitHubLabel[];
  html_url: string;
}

interface GitHubComment {
  id: number;
  user: GitHubUser;
  body: string;
  created_at: string;
}

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

interface IssueDetailsClientProps {
  id: string;
}

// Function to parse the issue body into structured form fields
function parseIssueBody(body: string) {
  const fields: Record<string, string> = {};
  if (!body) return { fields, isForm: false };

  const sections = body.split(/(?=###\s+)/);
  let isForm = false;

  for (const section of sections) {
    const lines = section.trim().split('\n');
    if (lines.length < 2) continue;

    const headingMatch = lines[0].match(/^###\s+(.+)$/);
    if (!headingMatch) continue;

    const label = headingMatch[1].trim().toLowerCase();
    const value = lines.slice(1).join('\n').trim();

    if (value && value !== '_No response_' && value !== 'No response') {
      fields[label] = value;
      isForm = true;
    }
  }

  return { fields, isForm };
}

// Helper to extract the first image/video URL from markdown
function extractMediaFromMarkdown(markdown: string): string | null {
  if (!markdown) return null;

  // Match Markdown image syntax: ![alt](url)
  const imgMatch = markdown.match(/!\[.*?\]\((.*?)\)/);
  if (imgMatch) return imgMatch[1];

  // Match raw URL with common image/video extensions or drive link
  const urlMatch = markdown.match(/(https?:\/\/[^\s()<>]+(?:\.(?:png|jpe?g|gif|webp|mp4|webm|mov)|drive\.google\.com\/[^\s()<>]+))/i);
  if (urlMatch) return urlMatch[1];

  return null;
}

export default function IssueDetailsClient({ id }: IssueDetailsClientProps) {
  const issueNumber = Number(id);

  const [issue, setIssue] = useState<GitHubIssue | null>(null);
  const [comments, setComments] = useState<GitHubComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Local tool data to pre-populate / fallback
  const [localTool, setLocalTool] = useState<Tool | null>(null);

  // Expose GITHUB_REPOSITORY from next.config env, fallback to Amanmeena0/tiny-island
  const repoFullName = process.env.NEXT_PUBLIC_GITHUB_REPOSITORY || 'Amanmeena0/tiny-island';

  useEffect(() => {
    // 1. Try to load local details from tools.json first for instant render and offline support
    const loadLocalTool = async () => {
      try {
        const response = await fetch('/data/tools.json');
        if (response.ok) {
          const tools: Tool[] = await response.json();
          const matched = tools.find((t) => t.issueNumber === issueNumber);
          if (matched) {
            setLocalTool(matched);
          }
        }
      } catch (err) {
        console.warn('Failed to load local tools.json fallback data:', err);
      }
    };
    loadLocalTool();

    // 2. Fetch latest data from GitHub API dynamically
    const fetchIssueDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch Issue Details
        const issueRes = await fetch(`https://api.github.com/repos/${repoFullName}/issues/${issueNumber}`);
        if (!issueRes.ok) {
          if (issueRes.status === 404) {
            throw new Error(`Issue #${issueNumber} not found.`);
          } else if (issueRes.status === 403) {
            throw new Error('GitHub API rate limit exceeded. Displaying archived tool data.');
          } else {
            throw new Error(`Failed to load issue. Status: ${issueRes.status}`);
          }
        }
        const issueData: GitHubIssue = await issueRes.json();
        setIssue(issueData);

        // Fetch Comments
        const commentsRes = await fetch(`https://api.github.com/repos/${repoFullName}/issues/${issueNumber}/comments`);
        if (commentsRes.ok) {
          const commentsData: GitHubComment[] = await commentsRes.json();
          setComments(commentsData);
        }
      } catch (err: any) {
        console.error('Error fetching issue details:', err);
        setError(err.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchIssueDetails();
  }, [issueNumber, repoFullName]);

  // Determine title, description, labels, status, author, created date and media URL
  let title = localTool?.name || `Submission #${issueNumber}`;
  let description = localTool?.description || '';
  let labels: string[] = localTool?.tags || [];
  let status: 'open' | 'closed' = 'open';
  let authorName = localTool?.author || 'anonymous';
  let authorAvatar = localTool?.authorAvatar || '';
  let authorUrl = `https://github.com/${authorName}`;
  let createdDate = localTool ? new Date(localTool.createdAt).toLocaleDateString() : '';
  let mediaUrl = localTool?.screenshot || '';
  let deployUrl = localTool?.deployUrl || '';
  let githubIssueUrl = `https://github.com/${repoFullName}/issues/${issueNumber}`;

  // Parse GitHub API data if successfully loaded
  if (issue) {
    title = issue.title.replace(/^Submission:\s*/i, '').replace(/^\[Tool\]\s*/i, '');
    status = issue.state;
    authorName = issue.user.login;
    authorAvatar = issue.user.avatar_url;
    authorUrl = issue.user.html_url;
    createdDate = new Date(issue.created_at).toLocaleDateString();
    githubIssueUrl = issue.html_url;
    labels = issue.labels.map((l) => l.name);

    const { fields, isForm } = parseIssueBody(issue.body);

    if (isForm) {
      // It's a structured tool submission
      title = fields['tool name'] || fields['project name'] || title;
      description = fields['one-line description'] || fields['description'] || issue.body;
      const screenshotRaw = fields['screenshot/gif url'] || fields['thumbnail image url (optional)'] || fields['screenshot'] || '';
      if (screenshotRaw) {
        mediaUrl = screenshotRaw;
      } else {
        mediaUrl = extractMediaFromMarkdown(issue.body) || '';
      }
      const websiteUrl = fields['website or demo url (optional)'] || fields['website or demo url'] || fields['website url'] || fields['demo url'] || '';
      if (websiteUrl) {
        deployUrl = websiteUrl;
      }
    } else {
      // It's a standard unstructured issue
      description = issue.body;
      mediaUrl = extractMediaFromMarkdown(issue.body) || '';
    }
  }

  // Display Loading Spinner if fetching and no local data is present
  if (loading && !localTool) {
    return (
      <div className="container" style={{ flexGrow: 1 }}>
        <div className="details-loading-state">
          <div className="media-loading-spinner"></div>
          <span className="mono-text" style={{ color: '#94a3b8' }}>Loading Issue Details...</span>
        </div>
      </div>
    );
  }

  // If there's an error and we couldn't even load local data, display error state
  if (error && !localTool) {
    return (
      <div className="container" style={{ flexGrow: 1 }}>
        <div className="details-error-state">
          <h2 className="error-title">Error Loading Page</h2>
          <p className="error-desc">{error}</p>
          <Link href="/pegboard" className="btn-primary">
            Back to Pegboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Site Header */}
      <header className="site-header">
        <div className="container header-container">
          <Link href="/" className="site-logo">
            🛠️ Tool<span>Shed</span>
          </Link>
          <nav className="site-nav">
            <Link href="/pegboard" className="nav-link">PEGBOARD</Link>
            <Link href="/contributors" className="nav-link">CONTRIBUTORS</Link>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="issue-container" style={{ flexGrow: 1 }}>
        {/* Navigation Back Link */}
        <Link href="/pegboard" className="back-link">
          ← Back to Pegboard
        </Link>

        {/* Media rendered ABOVE the description */}
        {mediaUrl ? (
          <GoogleDriveMedia
            src={mediaUrl}
            alt={`${title} Preview Media`}
            variant="detail"
            className="detail-media-wrapper"
          />
        ) : null}

        {/* Issue Header */}
        <header className="issue-header">
          <div className="issue-title-row">
            <h1 className="issue-title">
              {title} <span className="issue-number">#{issueNumber}</span>
            </h1>
            <span className={`status-badge ${status}`}>
              {status}
            </span>
          </div>

          <div className="issue-meta-row">
            <span>Submitted by:</span>
            <a href={authorUrl} target="_blank" rel="noopener noreferrer" className="issue-author-link">
              {authorAvatar && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={authorAvatar} alt={authorName} className="issue-author-avatar" />
              )}
              @{authorName}
            </a>
            <span>•</span>
            <span>Created on: {createdDate}</span>
            <span>•</span>
            <a 
              href={githubIssueUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mono-text"
              style={{ color: 'var(--teal)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
            >
              View on GitHub
            </a>
            {deployUrl && (
              <>
                <span>•</span>
                <a 
                  href={deployUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="mono-text"
                  style={{ color: 'var(--amber)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}
                >
                  🚀 Visit Website / Demo
                </a>
              </>
            )}
          </div>

          {labels.length > 0 && (
            <div className="issue-labels">
              {labels.map((label, idx) => (
                <span key={idx} className="issue-label-chip">
                  {label.toLowerCase()}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Description Body Card */}
        <article className="issue-body-card">
          {/* If GitHub API call is rate-limited, show a small warning tag */}
          {error && (
            <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fef3c7', borderLeft: '4px solid #d97706', color: '#92400e', fontSize: '0.85rem', marginBottom: '1.5rem', borderRadius: '2px' }}>
              <strong>Note:</strong> Displaying archived offline description. Comments are unavailable.
            </div>
          )}
          <Markdown content={description} />
        </article>

        {/* Comments Section */}
        {!error && (
          <section className="comments-section" style={{ marginTop: '4rem' }}>
            <h2 className="comments-section-title">
              Comments ({comments.length})
            </h2>

            {comments.length > 0 ? (
              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="comment-card">
                    <div className="comment-header">
                      <a href={comment.user.html_url} target="_blank" rel="noopener noreferrer" className="comment-author">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={comment.user.avatar_url} alt={comment.user.login} className="issue-author-avatar" />
                        @{comment.user.login}
                      </a>
                      <span className="mono-text" style={{ fontSize: '0.75rem' }}>
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="comment-body">
                      <Markdown content={comment.body} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 1.5rem', border: '1px dashed rgba(255, 255, 255, 0.1)', borderRadius: '4px', color: '#64748b' }}>
                <p className="mono-text">No comments on this submission yet.</p>
                <a 
                  href={githubIssueUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-secondary" 
                  style={{ marginTop: '1rem', fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                >
                  Join the Discussion
                </a>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Site Footer */}
      <footer className="site-footer">
        <div className="container footer-container">
          <p className="footer-text">
            🛠️ <strong>Tool Shed</strong> is an open-source catalog of solo-built tools and games.
          </p>
        </div>
      </footer>
    </div>
  );
}
