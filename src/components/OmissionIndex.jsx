import React from 'react';

const OmissionIndex = ({ data }) => {
    // Detect Battle Mode
    const isBattleMode = data.source_a_omissions !== undefined;

    // Normalize Data
    const leftOmissions = isBattleMode ? data.source_a_omissions : data.left_omissions;
    const rightOmissions = isBattleMode ? data.source_b_omissions : data.right_omissions;
    const leftPct = isBattleMode ? data.source_a_omission_pct : data.left_omission_pct;
    const rightPct = isBattleMode ? data.source_b_omission_pct : data.right_omission_pct;
    const leftLabel = isBattleMode ? "Source A (Red)" : "Left Omissions";
    const rightLabel = isBattleMode ? "Source B (Blue)" : "Right Omissions";
    const leftColor = isBattleMode ? "var(--accent-red)" : "var(--color-bias-left)";
    const rightColor = isBattleMode ? "var(--accent-blue)" : "var(--color-bias-right)";

    return (
        <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Omission Index <span className="text-gradient" style={{ fontSize: '0.9rem' }}>Blindspots</span>
            </h3>

            {/* Visual Bar */}
            <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '2rem' }}>
                <div style={{ width: `${leftPct}%`, background: leftColor, transition: 'width 1s ease' }} />
                <div style={{ width: `${100 - leftPct - rightPct}%`, background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ width: `${rightPct}%`, background: rightColor, transition: 'width 1s ease' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', flex: 1 }}>
                {/* Left/A Column */}
                <div>
                    <h4 style={{ color: leftColor, marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                        {leftLabel} ({leftPct}%)
                    </h4>
                    <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        {leftOmissions.map((item, i) => (
                            <li key={i} style={{ marginBottom: '0.5rem' }}>{item}</li>
                        ))}
                        {leftOmissions.length === 0 && <li>No significant omissions detected.</li>}
                    </ul>
                </div>

                {/* Right/B Column */}
                <div style={{ textAlign: 'right' }}>
                    <h4 style={{ color: rightColor, marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                        {rightLabel} ({rightPct}%)
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        {rightOmissions.map((item, i) => (
                            <li key={i} style={{ marginBottom: '0.5rem' }}>{item}</li>
                        ))}
                        {rightOmissions.length === 0 && <li>No significant omissions detected.</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default OmissionIndex;
