import React from 'react';

const NarrativeSynthesis = ({ synthesis }) => {
    if (!synthesis) return null;

    return (
        <div className="glass-panel" style={{ marginBottom: '2rem', padding: '2rem' }}>
            <h2 style={{
                borderBottom: '1px solid var(--glass-border)',
                paddingBottom: '1rem',
                marginBottom: '1.5rem',
                color: 'var(--text-primary)'
            }}>
                Executive Briefing
            </h2>

            {/* 1. Executive Summary */}
            <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                    Overview
                </h4>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', fontWeight: '500' }}>
                    {synthesis.executive_summary}
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>

                {/* 2. Gravity Analysis */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                    <h4 style={{ color: 'var(--accent-blue)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.2rem' }}>⚖️</span> Why It Leans
                    </h4>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                        {synthesis.gravity_analysis}
                    </p>
                </div>

                {/* 3. Omission Analysis */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                    <h4 style={{ color: 'var(--accent-red)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.2rem' }}>👁️</span> Critical Blindspots
                    </h4>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                        {synthesis.omission_analysis}
                    </p>
                </div>

                {/* 4. Truth Check */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                    <h4 style={{ color: 'var(--accent-green)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.2rem' }}>✅</span> Truth Check
                    </h4>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                        {synthesis.truth_analysis}
                    </p>
                </div>

            </div>
        </div>
    );
};

export default NarrativeSynthesis;
