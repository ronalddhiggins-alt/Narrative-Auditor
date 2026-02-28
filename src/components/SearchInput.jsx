import React, { useState } from 'react';

const SearchInput = ({ onSearch, isAnalyzing }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <div style={{ width: '100%', marginBottom: 'var(--space-xl)' }}>
            <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Paste URL or enter topic to audit..."
                        disabled={isAnalyzing}
                        style={{
                            width: '100%',
                            padding: '1.25rem 1.75rem',
                            paddingRight: '6rem',
                            fontSize: '1.2rem',
                            background: 'var(--color-bg-surface-glass)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-full)',
                            color: 'var(--text-primary)',
                            outline: 'none',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            backdropFilter: 'var(--glass-blur)',
                            transition: 'all 0.3s ease'
                        }}
                        className="search-input"
                    />
                    <button
                        type="submit"
                        disabled={isAnalyzing || !query}
                        style={{
                            position: 'absolute',
                            right: '8px',
                            top: '8px',
                            bottom: '8px',
                            padding: '0 1.5rem',
                            borderRadius: 'var(--radius-full)',
                            background: isAnalyzing ? 'var(--text-secondary)' : 'var(--color-primary)',
                            color: 'white',
                            border: 'none',
                            fontWeight: '600',
                            cursor: isAnalyzing ? 'wait' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {isAnalyzing ? (
                            <>
                                <span className="spinner"></span> Auditing...
                            </>
                        ) : (
                            <>
                                🔍 Audit
                            </>
                        )}
                    </button>
                </div>

                <style>{`
            .search-input:focus {
              border-color: var(--color-primary);
              box-shadow: 0 0 30px rgba(168, 85, 247, 0.2);
            }
            .spinner {
              width: 16px;
              height: 16px;
              border: 2px solid rgba(255,255,255,0.3);
              border-radius: 50%;
              border-top-color: white;
              animation: spin 1s linear infinite;
              display: inline-block;
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
            </form>

            <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Powered by Gemini • Antigravity Engine v1.0
            </p>
        </div>
    );
};

export default SearchInput;
