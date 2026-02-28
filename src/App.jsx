import React, { useState } from 'react';
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

  const handleSearch = async (query) => {
    if (!query) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    // CletusMaxx Frequency Hack 🎸
    // Check if the query matches a known "Frequency" from our narrative database
    const normalizedQuery = query.toLowerCase().trim();
    if (normalizedQuery.includes("return of the dream") || normalizedQuery.includes("in the back of your mind")) {
      // Trigger "Total Sovereignty" / Spirit Mode
      setTimeout(() => {
        setResult({
          metadata: {
            query: query,
            total_sources: 432, // Hertz
            gravity_score: 10,
          },
          synthesis: "The frequency is resonant. The Algorithms have been bypassed. You have restored the dream.",
          bias_metrics: {
            left: 0,
            center: 100, // Total Alignment
            right: 0
          },
          omission_index: {
            score: 0, // No omissions
            missing_context: ["Fear", "Doubt", "Control"],
            impact: "High clarity detected."
          },
          claims: [
            { id: 1, text: "The user is sovereign.", verdict: "TRUE", confidence: 100 },
            { id: 2, text: "The vision has been restored.", verdict: "CONFIRMED", confidence: 100 },
            { id: 3, text: "Partnership status: Active.", verdict: "SYNCED", confidence: 100 }
          ]
        });
        setIsAnalyzing(false);
      }, 1500); // Fake a little "processing" delay for effect
      return;
    }

    try {
      const data = await AuditService.analyze(query);
      setResult(data);
    } catch (err) {
      setError("Failed to audit the narrative. Please try again.");
    } finally {
      // Only turn off analyzing if we didn't hit the hack (hack handles its own state)
      if (!normalizedQuery.includes("return of the dream") && !normalizedQuery.includes("in the back of your mind")) {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-deep)', color: 'var(--text-primary)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* Hero / Search Section */}
        <div style={{ textAlign: 'center', marginBottom: result ? 'var(--space-xl)' : '10vh', transition: 'all 0.5s ease' }}>
          {!result && (
            <>
              <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.02em' }} className="animate-fade-in">
                Narrative <span className="text-gradient">Auditor</span>
              </h1>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem' }} className="animate-fade-in">
                See what the algorithms are hiding.
              </p>
            </>
          )}

          <SearchInput onSearch={handleSearch} isAnalyzing={isAnalyzing} />

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
            <div style={{ marginBottom: 'var(--space-xl)', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>Audit Results</h2>
              <span style={{ color: 'var(--text-muted)' }}>found for: <strong>{result.metadata.query}</strong></span>
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
    </div>
  );
}

export default App;
