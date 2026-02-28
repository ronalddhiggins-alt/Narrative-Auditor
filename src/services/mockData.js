// Mock Data for Narrative Auditor Prototypes

export const MOCK_ANALYSIS_RESULT = {
    metadata: {
        query: "Senator Smith's proposal on AI regulation",
        timestamp: "2026-05-12T10:30:00Z",
        total_sources: 14,
        gravity_score: 7.2 // 1-10 (10 is neutral/verified, 1 is pure spin)
    },

    synthesis: {
        executive_summary: "The debate over AI regulation has split sharply along economic vs. safety lines. While both sides agree regulation is coming, they fundamentally disagree on the mechanism (tax vs. ban).",
        gravity_analysis: "The Right views the proposal as 'stifling innovation' and economic suicide. The Left views it as a necessary 'safety brake' against corporate recklessness.",
        omission_analysis: "The Right omits the specific retraining programs funded by the tax. The Left omits the potential impact on small-scale medical research labs.",
        truth_analysis: "The 5% tax is verified text, but the claim of 'economic suicide' is disputed projection."
    },

    // The "Truth Table" Comparison
    claims: [
        {
            id: 1,
            fact: "The bill proposes a 5% tax on GPU clusters > 100k units.",
            status: "verified", // verified, disputed, debunked
            primary_source_link: "congress.gov/bill/Text",
            left_treatment: "reported", // reported, omitted, spun
            right_treatment: "spun",
            center_treatment: "reported",
            notes: "Right-leaning outlets framed this as a 'ban' rather than a tax."
        },
        {
            id: 2,
            fact: "Revenue from the tax is earmarked for displaced worker retraining.",
            status: "verified",
            left_treatment: "reported",
            right_treatment: "omitted",
            center_treatment: "reported",
            notes: "Right-leaning sources omitted the destination of the funds."
        },
        {
            id: 3,
            fact: "Opposition leader called the proposal 'economic suicide'.",
            status: "disputed",
            left_treatment: "spun",
            right_treatment: "reported",
            center_treatment: "reported",
            notes: "Left sources described the critique as 'unfounded panic' (Spin)."
        }
    ],

    // Visualizing "What's Missing"
    omission_index: {
        left_omissions: [
            "The tax could slow down medical research AI",
            "Senator Smith received donations from rival tech firms"
        ],
        right_omissions: [
            "Worker retraining fund details",
            "Economists' projection of net job growth"
        ],
        left_omission_pct: 15,
        right_omission_pct: 42
    },

    // Statistical Metrics
    bias_metrics: {
        left_score: -25, // -100 (Far Left) to +100 (Far Right)
        right_score: +60,
        center_gravity: 0, // The ideal point

        // Adjective Heatmap
        loaded_words: {
            left: ["corporatist", "hoarding", "urgent"],
            right: ["stifle", "socialist", "crushing"]
        }
    }
};

export const MOCK_BATTLE_RESULT = {
    metadata: {
        mode: "battle",
        query: "Battle: CNN Border vs Fox Border",
        total_sources: 2,
        gravity_score: 5 // Neutral start
    },
    synthesis: {
        executive_summary: "The sources diverge significantly on the cause of the crisis. Source A focuses on humanitarian aspects, while Source B focuses on security failures.",
        gravity_analysis: "Source A (Left-leaning) uses empathetic framing ('migrants', 'asylum'). Source B (Right-leaning) uses security framing ('illegals', 'invasion').",
        omission_analysis: "Source A omits recent arrest statistics. Source B omits the legal context of asylum claims.",
        truth_analysis: "Both sources report the same event but frame the causality differently."
    },
    claims: [
        {
            id: 1,
            fact: "Border crossings have increased.",
            status: "verified",
            source_a_treatment: "reported",
            source_b_treatment: "reported",
            notes: "Both agree on the rise, but differ on the magnitude."
        },
        {
            id: 2,
            fact: "Policy X caused the surge.",
            status: "disputed",
            source_a_treatment: "spun",
            source_b_treatment: "reported",
            notes: "Source A calls it a 'complex factor', Source B directly blames the policy."
        }
    ],
    omission_index: {
        source_a_omissions: ["Arrest stats", "vandalism reports"],
        source_b_omissions: ["Asylum laws", "humanitarian conditions"],
        source_a_omission_pct: 30,
        source_b_omission_pct: 40
    },
    bias_metrics: {
        source_a_score: -45,
        source_b_score: 65,
        loaded_words: {
            source_a: ["desperate", "families", "help"],
            source_b: ["invasion", "criminals", "border"]
        }
    }
};
