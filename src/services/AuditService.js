import { MOCK_ANALYSIS_RESULT, MOCK_BATTLE_RESULT } from './mockData';

// Pointing to the local proxy server (configured in vite.config.js)
const API_URL = '/api/audit';

export const AuditService = {
    /**
     * Performs a real Deep Search Audit via our local backend.
     * Falls back to mock data if the server is offline or keys are missing.
     * @param {string} query - The user's input (URL or Topic)
     * @returns {Promise<Object>}
     */
    async analyze(query) {
        console.log(`[AuditEngine] Requesting Deep Search for: ${query}`);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                throw new Error(`Server Error: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.warn("[AuditEngine] Backend unreachable or failed. Falling back to Simulation Mode.", error);

            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        ...MOCK_ANALYSIS_RESULT,
                        metadata: {
                            ...MOCK_ANALYSIS_RESULT.metadata,
                            query: query,
                            notes: "Simulation Mode (Backend Offline - Check Server Logs)"
                        }
                    });
                }, 2000);
            });
        }
    },

    async battle(urlA, urlB) {
        try {
            const response = await fetch('/api/battle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ urlA, urlB })
            });

            if (!response.ok) {
                throw new Error('Battle Server Error');
            }

            return await response.json();
        } catch (error) {
            console.warn("[AuditEngine] Battle failed (likely rate limit). Falling back to Simulation Mode.", error);
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        ...MOCK_BATTLE_RESULT,
                        metadata: {
                            ...MOCK_BATTLE_RESULT.metadata,
                            query: `Battle: ${urlA} vs ${urlB}`,
                            notes: "Simulation Mode (Backend Failed/Rate Limited)"
                        }
                    });
                }, 1500);
            });
        }
    }
};
