import React, { useState } from 'react';

const SearchInput = ({ onSearch, onBattle, isAnalyzing }) => {
    const [query, setQuery] = useState('');

    // Battle Mode State
    const [isBattleMode, setIsBattleMode] = useState(false);
    const [urlA, setUrlA] = useState('');
    const [urlB, setUrlB] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isBattleMode) {
            if (urlA.trim() && urlB.trim()) {
                onBattle(urlA, urlB);
            }
        } else {
            if (query.trim()) {
                onSearch(query);
            }
        }
    };

    return (
        <div style={{ width: '100%', marginBottom: 'var(--space-xl)' }}>
            {/* Mode Toggle */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <button
                    type="button"
                    onClick={() => setIsBattleMode(!isBattleMode)}
                    style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid var(--glass-border)',
                        color: isBattleMode ? 'var(--accent-red)' : 'var(--text-muted)',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {isBattleMode ? '⚔️ Battle Mode Active' : 'Enable Battle Mode ⚔️'}
                </button>
            </div>

            <form onSubmit={handleSubmit} style={{ position: 'relative' }}>

                {!isBattleMode ? (
                    // Standard Search
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Paste URL or enter topic to audit..."
                            disabled={isAnalyzing}
                            style={{
                                width: '100%',
                                padding: '1.25rem 1.5rem',
                                paddingRight: '4rem',
                                fontSize: '1.125rem',
                                background: 'var(--color-bg-surface-glass)',
                                border: 'var(--glass-border)',
                                borderRadius: 'var(--radius-full)',
                                color: 'var(--text-primary)',
                                outline: 'none',
                                boxShadow: 'var(--shadow-glow)',
                                backdropFilter: 'var(--glass-blur)',
                                transition: 'all 0.3s ease'
                            }}
                            className="search-input"
                        />
                        <button
                            type="submit"
                            disabled={isAnalyzing}
                            style={{
                                position: 'absolute',
                                right: '8px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'var(--color-primary)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '48px',
                                height: '48px',
                                cursor: isAnalyzing ? 'wait' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {isAnalyzing ? <div className="spinner" /> : (
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            )}
                        </button>
                    </div>
                ) : (
                    // Battle Mode Inputs
                    <div className="battle-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%' }}>
                        <input
                            type="text"
                            value={urlA}
                            onChange={(e) => setUrlA(e.target.value)}
                            placeholder="🔴 Source A (Red Corner URL)"
                            disabled={isAnalyzing}
                            style={{
                                padding: '1rem',
                                background: 'rgba(255, 50, 50, 0.05)',
                                border: '1px solid var(--accent-red)',
                                borderRadius: '12px',
                                color: 'var(--text-primary)',
                                outline: 'none'
                            }}
                        />
                        <input
                            type="text"
                            value={urlB}
                            onChange={(e) => setUrlB(e.target.value)}
                            placeholder="🔵 Source B (Blue Corner URL)"
                            disabled={isAnalyzing}
                            style={{
                                padding: '1rem',
                                background: 'rgba(50, 50, 255, 0.05)',
                                border: '1px solid var(--accent-blue)',
                                borderRadius: '12px',
                                color: 'var(--text-primary)',
                                outline: 'none'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={isAnalyzing || !urlA || !urlB}
                            style={{
                                gridColumn: 'span 2',
                                padding: '1rem',
                                background: 'linear-gradient(90deg, var(--accent-red), var(--accent-blue))',
                                border: 'none',
                                borderRadius: '12px',
                                color: 'white',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                letterSpacing: '1px',
                                textTransform: 'uppercase'
                            }}
                        >
                            {isAnalyzing ? 'Fighting...' : '⚔️ FIGHT ⚔️'}
                        </button>
                    </div>
                )}

                <style>{`
            .search-input:focus {
              border-color: var(--color-primary);
              box-shadow: 0 0 30px rgba(168, 85, 247, 0.2);
            }
            .spinner {
              width: 20px;
              height: 20px;
              border: 2px solid rgba(255,255,255,0.3);
              border-radius: 50%;
              border-top-color: white;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
            </form>
        </div>
    );
};

export default SearchInput;
