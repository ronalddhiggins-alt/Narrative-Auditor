# Antigravity Narrative Auditor: The User Manual

> *"Do not just read the news. Audit it."*

## 1. The "Centaur" Concept
You (the Human) provide the **Curiosity** and **Intent**.
The App (the AI) provides the **Speed** and **Scale**.

This app is not a search engine, and it is not a news reader. It is a **Narrative Auditor**. It assumes that every story you read online is being pulled by "gravity"—the political bias, financial incentives, and emotional spin of the publisher.

Your goal is to use this tool to **escape the gravity** and see the raw facts.

---

## 2. Under the Hood: How It Works
When you type a query like *"Mars Colonization"* or paste a URL, the app performs a complex "Deep Search" operation in seconds:

1.  **The Sweep (Tavily)**: It doesn't just look at one page. It scans **5-10 distinct sources** from across the web, specifically looking for diverse viewpoints.
2.  **The Deconstruction**: It breaks the story down into individual atomic **claims** (e.g., "The rocket launched at 9 AM").
3.  **The Lateral Check**: It cross-references every claim against every source.
    -   *Did CNN mention this?*
    -   *Did Fox News ignore this?*
    -   *Did the official report confirm this?*
4.  **The Synthesis (Gemini)**: The AI (your "Centaur Partner") creates the **Truth Table** and calculates the **Omission Index** based on what is *missing*, not just what is said.

---

## 3. Reading the Dashboard (The Metrics)

### A. The Narrative Gravity (Bias Score)
This is the big slider at the top.
-   **Center (0)**: The story is balanced. Both sides are reporting the same facts with neutral language.
-   **Pull Left (-1 to -100)**: The story is being framed by Left-leaning narratives.
-   **Pull Right (+1 to +100)**: The story is being framed by Right-leaning narratives.

**Tip**: Use this as a "warning sign." If the gravity is high (+80 or -80), be extra skeptical of the emotional language.

### B. The Omission Index (The "Blindspots")
This is the most powerful feature. Most bias isn't lying; it's **omission**.
-   **Left Blindspots**: Facts that Right-leaning sources reported, but Left-leaning sources *hid*.
-   **Right Blindspots**: Facts that Left-leaning sources reported, but Right-leaning sources *hid*.

**Why this matters**: If you only read one side, you literally do not know these facts exist. The Omission Index proves them to you.

### C. The Comparative Truth Table
This table lists the core facts of the story.
-   ✅ **Verified**: The fact is confirmed by primary sources (e.g., video, transcript, law).
-   ⚠️ **Disputed**: Sources disagree on whether this happened.
-   **Treatment Columns (Left/Center/Right)**:
    -   ● **Reported**: They told you this.
    -   ∅ **Omitted**: They kept this secret.
    -   ↻ **Spun**: They told you, but used emotional words to twist it.

---

## 4. How to Use It (Best Practices)

### Mode 1: The "Fact Check"
**Goal**: Is this headline true?
1.  Type the claim: *"Did the Senate pass the AI bill?"*
2.  Look at the **Truth Table**.
3.  See if it is ✅ Verified or ⚠️ Disputed.

### Mode 2: The "Bubble buster"
**Goal**: What aren't they telling me?
1.  Type a controversial topic: *"Healthcare Reform"*
2.  Look at the **Omission Index**.
3.  Read the **Blindspots**. This is the information your "filter bubble" is trying to hide.

### Mode 3: The "Battle" (Future Feature)
**Goal**: Compare two specific articles.
1.  Paste URL 1 (e.g., from NYT).
2.  Paste URL 2 (e.g., from WSJ).
3.  The app will highlight exactly where they disagree.

---

## 5. Technical Note
This app runs locally on your machine for privacy.
-   **Engine**: Google Gemini 1.5/Pro (Reasoning)
-   **Eyes**: Tavily Search API (Real-time Web Access)
-   **You**: The Editor-in-Chief.

*Built by Ron Higgins & Antigravity (Gemini)*

---

### 5. Troubleshooting

*   **"Stuck on AI Regulation"**:
    *   If you search for something but the result is *always* about "AI Regulation," it means the app is in **Simulation Mode**.
    *   This happens when the **Backend Server is down** OR **Google's Rate Limit (Quota)** has been hit.
    *   **Solution**: Wait 15-20 minutes for the quota to reset, or check that `node index.js` is running.

### 6. Deployment & Mobile Access (New)
To access the Narrative Auditor from your phone or other devices on your Wi-Fi:

1.  **Start the Server & App**:
    Ensure both the backend and frontend are running.
    ```bash
    # Terminal 1: Backend
    cd narrative_auditor/server
    node index.js

    # Terminal 2: Frontend
    cd narrative_auditor
    npm run dev -- --host
    ```

2.  **Access on Phone**:
    Open your phone's browser and go to:
    **http://192.168.1.129:5173**
    *(Note: Your phone must be on the same Wi-Fi network)*

3.  **Troubleshooting**:
    - If it doesn't load, check your firewall settings.
    - If the backend fails (Simulation Mode), ensure the computer stays awake.
