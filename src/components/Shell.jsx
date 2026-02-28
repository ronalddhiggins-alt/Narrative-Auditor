import React from 'react';

const Shell = ({ children, history = [], onHistorySelect }) => {
  const [showHistory, setShowHistory] = React.useState(false);

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header className="flex-center" style={{ padding: 'var(--space-lg) 0', justifyContent: 'space-between' }}>
        <div className="flex-center" style={{ gap: 'var(--space-sm)' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'var(--color-primary)',
            borderRadius: '50%',
            boxShadow: 'var(--shadow-glow)'
          }} />
          <h1 style={{ fontSize: '1.5rem', margin: 0 }} className="text-gradient">
            Narrative Auditor
          </h1>
        </div>
        <nav className="flex-center" style={{ gap: 'var(--space-md)', position: 'relative' }}>

          <button
            className="btn btn-glass"
            onClick={() => setShowHistory(!showHistory)}
            title="View recent searches"
          >
            History {history.length > 0 && `(${history.length})`}
          </button>

          {/* History Dropdown */}
          {showHistory && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '10px',
              background: 'var(--color-bg-surface-glass)',
              backdropFilter: 'var(--glass-blur)',
              border: 'var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              zIndex: 100,
              minWidth: '250px',
              padding: '0.5rem'
            }}>
              {history.length === 0 ? (
                <div style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  No history yet.
                </div>
              ) : (
                history.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onHistorySelect(item);
                      setShowHistory(false);
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.75rem 1rem',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      borderBottom: i < history.length - 1 ? '1px solid var(--glass-border)' : 'none',
                      fontSize: '0.9rem',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    {item}
                  </button>
                ))
              )}
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: 'var(--space-xl) 0' }} className="animate-fade-in">
        {children}
      </main>

      {/* Footer */}
      <footer style={{ padding: 'var(--space-lg) 0', borderTop: 'var(--glass-border)', marginTop: 'auto' }}>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Antigravity Engine &copy; {new Date().getFullYear()} • Humans + AI Partnership
        </p>
      </footer>
    </div>
  );
};

export default Shell;
