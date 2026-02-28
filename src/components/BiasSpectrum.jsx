import React from 'react';

const BiasSpectrum = ({ metrics }) => {
    // Detect Battle Mode
    const isBattleMode = metrics.source_a_score !== undefined;

    // Normalize Data
    // Default to 0 if undefined to prevent NaN issues
    const leftScore = isBattleMode ? (metrics.source_a_score || 0) : (metrics.left_score || 0);
    const rightScore = isBattleMode ? (metrics.source_b_score || 0) : (metrics.right_score || 0);

    // Calculate simple "pull" from -100 to 100
    // If we want a single 'gravity' point, we can average them or sum them depending on logic
    // For Battle Mode, let's just show the net difference or average? 
    // Let's use the average for position: (A + B) / 2
    const gravity = (leftScore + rightScore) / 2;

    // Loaded Words
    const leftWords = isBattleMode ? (metrics.loaded_words.source_a || []) : (metrics.loaded_words.left || []);
    const rightWords = isBattleMode ? (metrics.loaded_words.source_b || []) : (metrics.loaded_words.right || []);
    const leftLabel = isBattleMode ? "Source A Intensity" : "Left Gravity";
    const rightLabel = isBattleMode ? "Source B Intensity" : "Right Gravity";

    return (
        <div className="glass-panel" style={{ marginBottom: 'var(--space-xl)' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Narrative Gravity <span className="text-gradient" style={{ fontSize: '0.9rem' }}>Net Pull</span>
            </h3>

            {/* Spectrum Bar */}
            <div style={{ position: 'relative', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', marginBottom: '2rem', display: 'flex', alignItems: 'center', padding: '0 20px' }}>
                <div style={{ position: 'absolute', width: '2px', height: '100%', background: 'rgba(255,255,255,0.2)', left: '50%' }} />

                {/* Gravity Indicator */}
                <div style={{
                    position: 'absolute',
                    left: `calc(50% + ${gravity / 2}%)`,
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'white',
                    boxShadow: '0 0 20px white',
                    transform: 'translateX(-50%)',
                    transition: 'left 1s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }} >
                    <span style={{ position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {isBattleMode ? "Net Divergence" : "Net Bias"}
                    </span>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.875rem', color: isBattleMode ? 'var(--accent-red)' : 'var(--bias-left)', marginBottom: '0.5rem' }}>
                        {leftLabel} ({leftScore})
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', maxWidth: '150px' }}>
                        {leftWords.map((w, i) => (
                            <span key={i} className="tag" style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--text-secondary)' }}>
                                {w}
                            </span>
                        ))}
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.875rem', color: isBattleMode ? 'var(--accent-blue)' : 'var(--bias-right)', marginBottom: '0.5rem' }}>
                        {rightLabel} ({rightScore})
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '150px' }}>
                        {rightWords.map((w, i) => (
                            <span key={i} className="tag" style={{ background: 'rgba(248, 113, 113, 0.1)', color: 'var(--text-secondary)' }}>
                                {w}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BiasSpectrum;
