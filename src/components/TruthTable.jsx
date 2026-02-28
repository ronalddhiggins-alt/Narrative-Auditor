import React from 'react';

const StatusCell = ({ treatment }) => {
    const getStatusParams = (t) => {
        switch (t) {
            case 'omitted': return { icon: '🚫', color: 'var(--color-danger)', label: 'Omitted' };
            case 'spun': return { icon: '🎭', color: 'var(--color-spun)', label: 'Spun' };
            case 'reported': return { icon: '✅', color: 'var(--color-success)', label: 'Reported' };
            default: return { icon: '❓', color: 'var(--text-muted)', label: 'Unknown' };
        }
    };

    const { icon, color, label } = getStatusParams(treatment);

    return (
        <td style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                background: `color-mix(in srgb, ${color} 10%, transparent)`
            }} title={label}>
                <span style={{ color: color, fontSize: '1.2rem' }}>{icon}</span>
            </div>
        </td>
    );
};

const TruthTable = ({ claims }) => {
    // Detect Battle Mode by checking first claim properties
    const isBattleMode = claims.length > 0 && claims[0].source_a_treatment !== undefined;

    return (
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>
                        <th style={{ padding: '1rem', width: '40%', color: 'var(--text-secondary)' }}>Factual Claim</th>
                        {isBattleMode ? (
                            <>
                                <th style={{ padding: '1rem', width: '25%', color: 'var(--accent-red)', textAlign: 'center' }}>Source A (Red)</th>
                                <th style={{ padding: '1rem', width: '25%', color: 'var(--accent-blue)', textAlign: 'center' }}>Source B (Blue)</th>
                            </>
                        ) : (
                            <>
                                <th style={{ padding: '1rem', width: '15%', color: 'var(--bias-left)', textAlign: 'center' }}>Left</th>
                                <th style={{ padding: '1rem', width: '15%', color: 'var(--text-primary)', textAlign: 'center' }}>Center</th>
                                <th style={{ padding: '1rem', width: '15%', color: 'var(--bias-right)', textAlign: 'center' }}>Right</th>
                            </>
                        )}
                        <th style={{ padding: '1rem', width: '15%', color: 'var(--text-secondary)' }}>Verdict</th>
                    </tr>
                </thead>
                <tbody>
                    {claims.map((claim) => {
                        return (
                            <tr key={claim.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem', fontWeight: '500' }}>
                                    {claim.fact}
                                    {claim.notes && (
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                            {claim.notes}
                                        </div>
                                    )}
                                </td>

                                {isBattleMode ? (
                                    <>
                                        <StatusCell treatment={claim.source_a_treatment} />
                                        <StatusCell treatment={claim.source_b_treatment} />
                                    </>
                                ) : (
                                    <>
                                        <StatusCell treatment={claim.left_treatment} />
                                        <StatusCell treatment={claim.center_treatment} />
                                        <StatusCell treatment={claim.right_treatment} />
                                    </>
                                )}

                                <td style={{ padding: '1rem' }}>
                                    <span className={`badge ${claim.status === 'verified' ? 'badge-verified' : 'badge-disputed'}`}>
                                        {claim.status}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TruthTable;
