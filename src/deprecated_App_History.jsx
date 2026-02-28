import React, { useState } from 'react';
import Shell from './components/Shell';
import SearchInput from './components/SearchInput';
import TruthTable from './components/TruthTable';
import OmissionIndex from './components/OmissionIndex';
import BiasSpectrum from './components/BiasSpectrum';
import NarrativeSynthesis from './components/NarrativeSynthesis';
import { AuditService } from './services/AuditService';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [history, setHistory] = useState([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('audit_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const handleSearch = async (query) => {
    if (!query) return;

    // Save to History (Unique, Max 5)
    const newHistory = [query, ...history.filter(h => h !== query)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('audit_history', JSON.stringify(newHistory));

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const data = await AuditService.analyze(query);
      setResult(data);
    } catch (err) {
      setError("Failed to audit the narrative. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBattle = async (urlA, urlB) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const data = await AuditService.battle(urlA, urlB);
      setResult(data);
    } catch (err) {
      setError("Failed to run Battle Mode. Please check the URLs and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Shell history={history} onHistorySelect={handleSearch}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 var(--space-md)' }}>

        {/* Hero / Search Section */}
        <div style={{ textAlign: 'center', marginBottom: result ? 'var(--space-xl)' : '10vh', transition: 'all 0.5s ease' }}>
          {!result && (
            <>
              <h2 style={{ fontSize: '3.5rem', marginBottom: 'var(--space-md)' }} className="animate-fade-in">
                Escape the <span className="text-gradient">Gravity</span>
              </h2>
              <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', maxWidth: '600px', margin: '0 auto 3rem' }} className="animate-fade-in">
                Deconstruct the news. See the omissions. Find the truth.
              </p>
            </>
          )}

          <SearchInput onSearch={handleSearch} onBattle={handleBattle} isAnalyzing={isAnalyzing} />

          {error && (
            <div className="animate-fade-in" style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 'var(--radius-md)',
              color: '#fca5a5',
              maxWidth: '600px',
              margin: '1rem auto'
            }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Results Dashboard */}
        {result && (
          <div className="animate-fade-in">
            <div style={{ marginBottom: 'var(--space-xl)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontSize: '2rem' }}>Audit Results</h2>
              <span style={{ color: 'var(--text-muted)' }}>Analysis for: {result.metadata.query}</span>
            </div>

            {/* Narrative Synthesis (New) */}
            <NarrativeSynthesis synthesis={result.synthesis} />

            {/* Top Row: Spectrum & Omissions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
              <BiasSpectrum metrics={result.bias_metrics} />
              <OmissionIndex data={result.omission_index} />
            </div>

            {/* Main Feature: Truth Table */}
            <TruthTable claims={result.claims} />

            {/* Meta Stats */}
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 'var(--space-xl)' }}>
              Analyzed {result.metadata.total_sources} sources • Gravity Score: {result.metadata.gravity_score}/10
            </div>
          </div>
        )}

      </div>
    </Shell>
  );
}

export default App;
