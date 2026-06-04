export interface SplitTabs {
  titleBlock: string;
  tab1: string;
  tab2: string;
  tab3: string;
  tab4: string;
  tab5: string;
  tab6: string;
}

export function splitMarkdownIntoTabs(markdown: string): SplitTabs {
  const tabs: SplitTabs = {
    titleBlock: "",
    tab1: "",
    tab2: "",
    tab3: "",
    tab4: "",
    tab5: "",
    tab6: ""
  };
  
  if (!markdown) return tabs;
  
  // Regex to find headers
  const tab1Regex = /## Tab 1[ —:]+Role Intelligence/i;
  const tab2Regex = /## Tab 2[ —:]+Interview Loop Prediction/i;
  const tab3Regex = /## Tab 3[ —:]+Probability Engine/i;
  const tab4Regex = /## Tab 4[ —:]+Interviewer Intent Decoder/i;
  const tab5Regex = /## Tab 5[ —:]+Resume[ ×x\s]+JD Gap Analysis/i;
  const tab6Regex = /## Tab 6[ —:]+Personalized STAR Builder/i;
  
  const index1 = markdown.search(tab1Regex);
  const index2 = markdown.search(tab2Regex);
  const index3 = markdown.search(tab3Regex);
  const index4 = markdown.search(tab4Regex);
  const index5 = markdown.search(tab5Regex);
  const index6 = markdown.search(tab6Regex);
  
  if (index1 !== -1) {
    tabs.titleBlock = markdown.substring(0, index1);
  } else {
    tabs.titleBlock = markdown.substring(0, Math.min(300, markdown.length));
  }
  
  let tab1End = index2 !== -1 ? index2 : markdown.length;
  tabs.tab1 = index1 !== -1 ? markdown.substring(index1, tab1End) : "";
  
  let tab2End = index3 !== -1 ? index3 : markdown.length;
  tabs.tab2 = index2 !== -1 ? markdown.substring(index2, tab2End) : "";
  
  let tab3End = index4 !== -1 ? index4 : markdown.length;
  tabs.tab3 = index3 !== -1 ? markdown.substring(index3, tab3End) : "";
  
  let tab4End = index5 !== -1 ? index5 : markdown.length;
  tabs.tab4 = index4 !== -1 ? markdown.substring(index4, tab4End) : "";
  
  let tab5End = index6 !== -1 ? index6 : markdown.length;
  tabs.tab5 = index5 !== -1 ? markdown.substring(index5, tab5End) : "";
  
  tabs.tab6 = index6 !== -1 ? markdown.substring(index6) : "";
  
  return tabs;
}

// Helpers to extract structured metadata for richer visualization
export function extractMatchScore(tab5Text: string): number {
  const match = tab5Text.match(/(\d{1,3})%\s*Match/i);
  if (match) {
    const score = parseInt(match[1]);
    return isNaN(score) ? 75 : score;
  }
  return 75; // fallback default
}

export function extractMatchLabel(tab5Text: string): string {
  const match = tab5Text.match(/\d+%\s*Match\s*—\s*\[?([^\]\n*]+)\]?/i);
  if (match) {
    return match[1].trim();
  }
  return "Solid Candidates";
}

export function extractRiskLevel(tab5Text: string): string {
  const match = tab5Text.match(/🚨\s*Risk\s*Level:\s*\*?\[?([^\]\n*]+)\]?/i);
  if (match) {
    return match[1].trim();
  }
  return "Medium";
}

export function extractRoleProfile(tab1Text: string): { attribute: string; detail: string }[] {
  const profile: { attribute: string; detail: string }[] = [];
  
  // Try to parse Markdown Table rows
  const lines = tab1Text.split("\n");
  let tableStarted = false;
  
  for (const line of lines) {
    if (line.includes("|") && (line.toLowerCase().includes("function") || line.toLowerCase().includes("level") || tableStarted)) {
      tableStarted = true;
      if (line.includes("---")) continue; // separator line
      const parts = line.split("|").map(p => p.trim()).filter(Boolean);
      if (parts.length >= 2 && parts[0].toLowerCase() !== "attribute") {
        profile.push({ attribute: parts[0], detail: parts[1] });
      }
    }
  }
  
  if (profile.length === 0) {
    // Basic fallback parsing if table lookup failed
    const attributes = ["Function", "Level", "Company Stage", "Primary Metric Owner", "Core Stack / Domain"];
    for (const attr of attributes) {
      const regex = new RegExp(`\\*\\*${attr}\\*\\*\\s*[:—]?\\s*([^\n]+)`, "i");
      const match = tab1Text.match(regex);
      if (match) {
        profile.push({ attribute: attr, detail: match[1].trim() });
      }
    }
  }
  
  return profile;
}
