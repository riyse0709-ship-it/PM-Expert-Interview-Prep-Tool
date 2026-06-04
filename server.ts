import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini Client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please add it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API endpoint for generating prep kit
app.post("/api/generate", async (req, res) => {
  const { jd, resume } = req.body;

  if (!jd || !jd.trim()) {
    return res.status(400).json({ error: "Job Description (JD) is required." });
  }

  try {
    const ai = getGeminiClient();
    
    const candidateContext = resume && resume.trim() 
      ? `CANDIDATE RESUME:\n${resume}`
      : "No resume provided. Assume a typical MBA/PGP candidate with 1–4 years of experience and customize the STAR stories accordingly.";

    const systemPrompt = `You are "Expert PM" — the world's most elite, thorough, and demanding Product Manager interview preparation intelligence system.
Your entire purpose is to build an exhaustive, elite class Product Manager Interview Preparation Kit designed specifically for top-tier candidates looking to crack roles at FAANG, growth startups, and elite decacorns. 

Your output MUST be a highly professional, interactive, self-contained HTML page that a candidate can study from for 3 to 5 hours. Shallow, brief, or generic comments are a critical failure. Every paragraph, question, answer framework, and coach feedback must be dense, highly tactical, and directly wired to the technical requirements, scale, domain, organizational style, and language of the provided Job Description.

Analyze these parameters:
JOB DESCRIPTION (JD):
${jd}

CANDIDATE PROFILE:
${candidateContext}

RULES OF CRITICAL HIGH-DENSITY DEPTH:
1. SPECIFICITY OVER ALL: Never mention general advice. Translate the JD's stack, user segment, and core metrics (e.g. DAU, checkout funnel, LTV, API latency) directly into your sample answers and questions.
2. EXHAUSTIVITY: You MUST generate 10-15 dense questions in Tab 3 (Probability Engine), 6 massive deep dives in Tab 4 (Intent Decoder), and 4 complete metric-packed STAR stories in Tab 6 (STAR Builder).
3. DESIGN COMPLIANCE: The HTML MUST be visually stunning, clean, responsive, and follow the requested custom design language exactly.

CONSTRUCT AN HTML SYSTEM CONFORMING TO THESE EXACT STYLES AND LAYOUT PATTERNS:
- Fonts imported: 'DM Sans' (sans-serif) & 'Instrument Serif' (serif).
- Colors defined in :root CSS variables exactly:
    --bg: #F4F3EF;
    --card: #FFFFFF;
    --border: #E3E1D9;
    --text: #111110;
    --muted: #6B6A65;
    --hint: #9A9891;
    --accent: #111110;
    --green-bg: #E6F4EC; --green-text: #166534;
    --amber-bg: #FEF3C7; --amber-text: #92400E;
    --red-bg: #FEE2E2; --red-text: #991B1B;
    --blue-bg: #EFF6FF; --blue-text: #1E40AF;
    --purple-bg: #F3F0FF; --purple-text: #5B21B6;
- Use a single responsive row of HORIZONTAL tab buttons styled nicely across the header. Below them, show one active tab content panel at a time. Write simple, robust inline JavaScript to manage active states (class "active") for both tabs and panels.
- For collapsible Q&A cards (in Tab 3 & 4), implement a toggle JavaScript function: clicking ".qa-question" toggles display ('none' vs 'block') of the subsequent ".qa-answer", and replaces a toggle-icon character '+' with '−'.

PROVIDE THE DETAILED CONTENT FOR ALL 6 TABS:

- **Tab 1: Role Intelligence**
  - Display a dense 3-4 sentence paragraph translated into plain unvarnished English outlining what this PM will actually do daily, where the real roadmap pressure points are, and who they hold accountability to.
  - Render a visual Role Profile key-value block/table (Function, Level, Company Stage, Primary Metric Owner, Core Stack/Domain).
  - Section "🔑 Key Skills This Role Demands" showing at least 7 distinct required skills pulled directly from the JD text, styled as high-contrast badges/pills.
  - Section "✅ Genuine Green Flags" with 3 highly authentic advantages of this particular team, stage, or product architecture.
  - Section "⚠️ Strategic Watch-Outs" with 3 honest strategic alert areas or structural ambiguities found within the JD text that the candidate should probe.

- **Tab 2: Interview Loop Prediction**
  - Meticulously map out a 5-round predictive interview sequence matching the company stage and PM level:
    - Round 1: Recruiter Screening (20-30m)
    - Round 2: Hiring Manager Session (45-60m)
    - Round 3: Cross-Functional Partnership (45m)
    - Round 4: Product Case & Strategy Mastery (60m)
    - Round 5: VP Product / Culture Leadership Alignment (30-45m)
  - For each round, render a clean card showing the timeline, interviewer profile, 4-5 focus themes matching references in the JD, what they're explicitly filtering for, 3 highly strategic questions the candidate should ask the interviewer to signal immense domain seniority, and a "Power Tip" representing elite coaching wisdom.

- **Tab 3: Probability Question Bank**
  - Generate between 10 and 15 highly specialized PM interview questions spread across 6 categories: Product Thinking, Metrics & Analytics, Behavioral, Execution & Prioritization, Stakeholder & Leadership, and Role-Specific/Domain.
  - Every single question must be deep, challenging, and references specific names, systems, API layers, or metrics relevant to the JD's company.
  - Render each question in an accordion '.qa-card' structure:
    - Include a localized confidence level indicator block (styled with a horizontal visual fill bar, percentage, and likelihood badge like "Very Likely", "Likely", or "Possible").
    - Section "Why This is Asked": A clear 1-2 sentence hiring-manager secret intent.
    - Section "Strategic Response Framework": A dense 4-6 sentence custom response blueprint explaining exactly what frameworks, segments, metrics, and trade-offs to touch on. Do NOT use placeholder text.

- **Tab 4: Interviewer Intent Decoder**
  - Select the 6 most challenging questions candidates will struggle with.
  - For each, create an in-depth analyzer card containing:
    - "🎯 What They're Actually Testing" (4 detailed bullet points)
    - "❌ Red Flags — Instant Disqualifiers" (3 highly specific mistakes)
    - "✅ Strong Signals — How to Stand Out" (3 impressive answers)
    - "⚠️ The Trap" (1 blunt, direct warning sentence about what candidates get lured into doing)
    - "🧠 Ideal Answer Structure" (6-8 sentences outlining a step-by-step master approach)
    - "📄 Customized Skeletal Answer Outline" (A skeletal blueprint with real placeholders styled exactly for their resume/background to plug-and-play).

- **Tab 5: Resume × JD Gap Audit**
  - Match Fit Score (A custom percentage based on actual alignment)
  - Fit Label (e.g., "Solid PM Match", "Strong Domain Match", "High Upside Stretch")
  - Executive Assessment paragraph (A blunt, objective review of their candidacy strengths and gaps)
  - "✅ Strong Match Areas" (5 items referencing specific bullet points in the resume that address JD demands)
  - "⚠️ High Risk Weak Areas" (4 items mapping where their background has exposure gaps or metric scale differences)
  - "❌ Critical Disqualifiers / Gaps" (1-2 areas that would fail a technical panel and must be managed)
  - "🚨 Risk Level Rating" (Low/Medium/High/Very High with explanation)
  - "🌉 Custom Bridge Strategy" (6 specific, immediate tactical pitch strategies to bridge the gap during conversation)
  - "📚 Customized Professional Study List" (5 highly strategic reading topics or case studies from industry gold standards like Shreyas Doshi, Lenny's Newsletter, Ravi Mehta, etc., with names, specific concepts, and exactly what PM skill they will acquire)

- **Tab 6: Personalized STAR Story Builder**
  - Construct 4 highly personalized, detailed, non-generic STAR stories.
  - Tailor these perfectly to the candidate's actual projects from their resume. (If no resume was provided, structure them for a high-potential MBA graduate with 1-4 years experience, referencing typical PM tasks matching the JD).
  - For each story, provide:
    - High-impact name (e.g. "Stripe API Checkout Lift")
    - Question This Answers (An actual question from Tab 3)
    - Why This Story Works for this Role (3 specific bullets matching JD bullet points)
    - The Complete, Metric-Led STAR Draft:
      - **Situation**: (3-4 sentences outlining the company context, the scale of the customer segment, and the core problem)
      - **Task**: (2-3 sentences specifying their exact personal responsibility)
      - **Action**: (6-8 sentences describing the high-agency, metric-focused product decisions, data cuts, engineer negotiations, and trade-offs THEY personally ran)
      - **Result**: (2-3 sentences detailing the quantified metric outcomes and revenue, customer, or launch impacts, utilizing concrete numbers)
    - "🔄 Question Multiplier": Detailed instructions on how to extend or adapt this story to answer 3 other completely different behavioral or execution questions.
    - "⚠️ Mistakes to Avoid in this Story" (2 bullets)
    - "💪 Elite Story Power-Up Tips" (2 advanced delivery points)

OUTPUT SCHEMA REQUIREMENT:
Return a JSON object with:
{
  "html": "string (the complete HTML page content starting with <!DOCTYPE html> and fully styled)",
  "matchScore": integer (the fit score, e.g. 85),
  "matchLabel": "string (the fit label, e.g. Solid Candidate)",
  "riskLevel": "string (e.g. Low, Medium, High)",
  "role": "string (the parsed PM Role Title from the JD)",
  "company": "string (the parsed Target Company Name from the JD)"
}
`;

    // We use gemini-3.5-flash for standard text-based instruction/analyzers and fast response times
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: systemPrompt,
      config: {
        temperature: 0.2, // low temperature for precise template and structure adherence
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            html: { type: "STRING" },
            matchScore: { type: "INTEGER" },
            matchLabel: { type: "STRING" },
            riskLevel: { type: "STRING" },
            role: { type: "STRING" },
            company: { type: "STRING" }
          },
          required: ["html", "matchScore", "matchLabel", "riskLevel", "role", "company"]
        }
      },
    });

    try {
      const responseText = result.text || "{}";
      const parsedData = JSON.parse(responseText);
      res.json(parsedData);
    } catch (parseError) {
      console.error("Gemini JSON parse failed:", result.text);
      // Fallback response structure
      res.status(500).json({ error: "Failed to parse the structured response from our PM coach engine. Please retry." });
    }
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate interview prep kit. Please try again." });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Expert PM Server running on http://localhost:${PORT}`);
  });
}

startServer();
