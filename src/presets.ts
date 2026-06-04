export interface Preset {
  id: string;
  name: string;
  company: string;
  role: string;
  jd: string;
  resume: string;
}

export const PRESETS: Preset[] = [
  {
    id: "google-maps",
    name: "Google — PM II (Local Discovery & AI)",
    company: "Google",
    role: "Product Manager II, Local Discovery",
    jd: `Position: Product Manager II, Local Discovery & Places
Company: Google
Location: Mountain View, CA (Hybrid)

About the Role:
As a PM II on Google Maps, you will own the end-to-end strategy and roadmap for location details and discovery experiences. You will lead cross-functional teams of engineers, product designers, and researchers to design features that help hundreds of millions of users find and choose local businesses daily.

Key Responsibilities:
- Own key engagement metrics including Local Actions (Calls, Directions, Website clicks) and Weekly Active Users (WAU).
- Pioneer AI-driven smart review summaries using Gemini Models to help users understand long-form feedback quickly.
- Manage integration with the Places API and Google Maps Platform to align developer interests.

Key Requirements:
- 2+ years of product management experience at a consumer technology company.
- Strong technical fluency; comfortable reading API documentation and discussing spatial data models.
- Proven experience launching features powered by NLP, LLMs, or large machine learning pipelines.
- Experience working in structured environments with highly complex stakeholder groups.`,
    resume: `SUMANT VERMA — PM

Experience:
- Associate Product Manager, Zomato (Food Delivery & Discovery Platform) | 2024 - Present
  * Led the 'Smart Restaurant Discovery' funnel redesign, integrating LLM-based summary tags to condense user restaurant reviews, resulting in a 12% improvement in CTR to restaurant pages.
  * Ran A/B tests on cart layouts, improving checkout conversion rate by 3.1% (adding $1.5M ARR).
  * Coordinated directly with 18 engineers and 3 UI/UX designers to release monthly app iterations.
- Software Developer, MapmyIndia | 2022 - 2024
  * Built REST APIs and backend spatial indexes for enterprise clients. Strong knowledge of GIS systems and geospatial coordinates.
  
Education:
- MBA, Indian Institute of Management (IIM) Bangalore | 2022 - 2024
- B.Tech in Computer Science, IIT Roorkee | 2018 - 2022`
  },
  {
    id: "stripe-checkout",
    name: "Stripe — Senior PM (Core Checkout & FinTech)",
    company: "Stripe",
    role: "Senior Product Manager, Core Checkout",
    jd: `Position: Senior Product Manager, Core Checkout
Company: Stripe
Location: San Francisco, CA

About the Role:
Stripe is looking for a Senior PM to lead checkout optimization and checkout conversion rate optimization. Your team will build the highest converting payment sheet on the internet, handling billions of dollars in volume annually.

Key Responsibilities:
- Own Stripe Checkout conversion rate, net transaction volume (NTV), and merchant churn metrics.
- Collaborate with developer communities, payment infrastructure teams, and designers to design a zero-friction checkout sheet.
- Use analytics platforms (e.g. SQL, Tableau, Amplitude) to diagnose funnel leakage across various international payment methods.

Key Requirements:
- 4+ years of product management experience, preferably in FinTech, E-commerce, or Conversion Rate Optimization (CRO).
- Strong quantitative skills; master coder in SQL and deep understanding of statistical significance and checkout funnels.
- Mastery over developer ecosystems, SDKs, and payment protocol integrations.`,
    resume: `RIYA SETHI — Product Manager

Experience:
- Product Manager, Razorpay | 2023 - Present
  * Scaled the B2B checkout SDK used by over 15,000+ merchants.
  * Led internal integration of localized UPI & BNPL payment methods, decreasing dropout rates on the payment select screen from 14% to 8%.
  * Managed a high-performing cross-functional squad of 14 backend developers, Android developers, and QA.
- Associate Product Analyst, Flipkart | 2021 - 2023
  * Created extensive Amplitude dashboards to track user dropoffs throughout the checkout funnel.
  * Wrote complex PostgreSQL queries to isolate low-performance device groups and network speeds.
  
Education:
- MBA, Masters' Union School of Business | Co' 2023
- B.E. in Electronics, BITS Pilani | 2017 - 2021`
  },
  {
    id: "openai-api",
    name: "OpenAI — Technical PM (Developer & Models)",
    company: "OpenAI",
    role: "Product Manager, API Experience",
    jd: `Position: Product Manager, API Infrastructure & Developer Experience
Company: OpenAI
Location: San Francisco, CA

About the Role:
We are seeking a Product Manager to champion the developer experience for the OpenAI Developer Platform. Your team of high-speed developers and scientists are building the developer APIs, billing consoles, and rate-limiting infrastructures powering millions of applications worldwide.

Key Responsibilities:
- Own developer net promoter score (NPS), API uptime, billing activation, and token usage expansion.
- Partner with Research, DevRel, and Core Infrastructure to launch new model endpoints (e.g., GPT-5, Realtime audio API, and video API).
- Maintain an intuitive billing and billing-threshold dashboard with absolute simplicity.

Requirements:
- 3+ years of technical product management experience leading developer platform services, API designs, or cloud-hosted infrastructure (AWS, GCP).
- Strong software background; able to write code snippet scripts (Python, JS) to test your own API endpoints.
- Passionate developer empathy.`,
    resume: `SOUVICK DEY — Technical PM

Experience:
- Product Manager, Postman | 2024 - Present
  * Owned developer tooling platforms. Launched 'API Mock Streams' supporting over 200,000 requests per day.
  * Improved billing checkout flow with Stripe Integration, reducing billing support tickets by 40%.
- Full Stack Engineer, Microsoft | 2021 - 2024
  * Built distributed cloud pipelines on Azure, working daily with Node.js, C#, and Kubernetes clusters.
  * Integrated OpenAI gpt-3.5 APIs into internal customer support ticket auto-responders.
  
Education:
- B.Tech in Computer Science, NIT Trichy | 2017 - 2021`
  }
];
