'use client';

import { useState } from 'react';

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

interface ToolGridProps {
  initialTools: Tool[];
  issueFormUrl: string;
}

export default function ToolGrid({ initialTools, issueFormUrl }: ToolGridProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'tools' | 'games'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const gameKeywords = ['game', 'games', 'play', 'toy', 'puzzle', 'tictactoe', 'tic-tac-toe', 'hangman', 'wordle', 'arcade'];

  const isGame = (tool: Tool) => {
    if (tool.category === 'game') return true;
    if (tool.category === 'tool') return false;

    const hasGameTag = tool.tags.some(tag => gameKeywords.includes(tag.toLowerCase()));
    const hasGameName = gameKeywords.some(keyword => tool.name.toLowerCase().includes(keyword));
    return hasGameTag || hasGameName;
  };

  const filteredTools = initialTools.filter(tool => {
    // 1. Tab filter
    const toolIsGame = isGame(tool);
    if (activeTab === 'games' && !toolIsGame) return false;
    if (activeTab === 'tools' && toolIsGame) return false;

    // 2. Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const nameMatch = tool.name.toLowerCase().includes(query);
      const descMatch = tool.description.toLowerCase().includes(query);
      const authorMatch = tool.author.toLowerCase().includes(query);
      const langMatch = tool.language.toLowerCase().includes(query);
      const tagsMatch = tool.tags.some(tag => tag.toLowerCase().includes(query));

      return nameMatch || descMatch || authorMatch || langMatch || tagsMatch;
    }

    return true;
  });

  return (
    <div className="container">
      {/* Search Bar */}
      <div className="search-container">
        <svg 
          className="search-icon"
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search projects by name, language, tag, or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            className="search-clear" 
            onClick={() => setSearchQuery('')}
            title="Clear search"
          >
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="filter-tabs">
        <button 
          onClick={() => setActiveTab('all')} 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
        >
          All Projects ({initialTools.length})
        </button>
        <button 
          onClick={() => setActiveTab('tools')} 
          className={`tab-btn ${activeTab === 'tools' ? 'active' : ''}`}
        >
          Tools 🛠️ ({initialTools.filter(t => !isGame(t)).length})
        </button>
        <button 
          onClick={() => setActiveTab('games')} 
          className={`tab-btn ${activeTab === 'games' ? 'active' : ''}`}
        >
          Games 🎮 ({initialTools.filter(t => isGame(t)).length})
        </button>
      </div>

      {/* Grid or Empty State */}
      {filteredTools.length > 0 ? (
        <div className="tool-grid">
          {filteredTools.map((tool) => {
            const firstLetter = tool.name.charAt(0).toUpperCase();
            return (
              <article key={tool.id} className="tool-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <a 
                      href={tool.deployUrl || tool.repoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="card-title-link"
                    >
                      {tool.name}
                    </a>
                  </h3>
                  <div className="card-meta">
                    <span className="mono-text">{tool.language}</span>
                    <span>•</span>
                    <span className="mono-text">#{tool.issueNumber}</span>
                  </div>
                </div>

                <div className="card-body">
                  {/* Screenshot or Fallback Initial Letter */}
                  <div className="card-image-container">
                    {tool.screenshot ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img 
                        src={tool.screenshot} 
                        alt={`${tool.name} preview`} 
                        className="card-image"
                        loading="lazy"
                        onError={(e) => {
                          // Hide image and show placeholder if url fails to load
                          (e.target as HTMLElement).style.display = 'none';
                          const sibling = (e.target as HTMLElement).nextElementSibling;
                          if (sibling) (sibling as HTMLElement).style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="card-image-placeholder"
                      style={{ display: tool.screenshot ? 'none' : 'flex' }}
                    >
                      {firstLetter}
                    </div>
                  </div>

                  <p className="card-description">{tool.description}</p>

                  <div className="card-tags">
                    {tool.tags.map((tag, idx) => (
                      <span key={idx} className="tag-chip">
                        {tag.toLowerCase()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="card-footer">
                  <a 
                    href={`https://github.com/${tool.author}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="author-info"
                    style={{ textDecoration: 'none' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={tool.authorAvatar} 
                      alt={tool.author} 
                      className="author-avatar" 
                    />
                    <span className="author-name">@{tool.author}</span>
                  </a>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <a 
                      href={tool.repoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="mono-text"
                      style={{ 
                        color: 'var(--card-text-muted)', 
                        textDecoration: 'none', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                      </svg>
                      Code
                    </a>
                    <span style={{ color: 'var(--card-border)', fontSize: '0.75rem' }}>|</span>
                    <div className="star-count" title="GitHub Stars" style={{ margin: 0 }}>
                      <svg 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        style={{ color: 'var(--amber)' }}
                      >
                        <path d="M12 .587l3.668 7.431 8.2 1.191-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.209l8.2-1.191L12 .587z"/>
                      </svg>
                      <span>{tool.stars.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h3 className="empty-title">No Projects Found</h3>
          <p className="empty-desc">
            {activeTab === 'all' 
              ? 'Our pegboard is looking clean and ready! Be the very first to showcase your project here.'
              : `There are currently no approved submissions classified as ${activeTab}.`}
          </p>
          <a href={issueFormUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Submit a Project
          </a>
        </div>
      )}
    </div>
  );
}
