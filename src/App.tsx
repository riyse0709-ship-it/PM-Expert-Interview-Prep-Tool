import React, { useState, useEffect, useRef } from "react";
import { 
  Zap, 
  AlertTriangle, 
  HelpCircle, 
  Sparkles, 
  Copy, 
  Check, 
  Play, 
  RefreshCw, 
  FileCode,
  ArrowRight,
  Sparkle,
  Compass,
  AlertCircle,
  Download,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PRESETS, Preset } from "./presets";

const LOADING_STEPS = [
  "Ingesting Job Description & isolating functional demands...",
  "Running semantic alignment audits on Candidate Resume...",
  "Deducing the core metric ownership and scale mandates...",
  "Predicting corporate loop questions and specific interviewer panel biases...",
  "Synthesizing customized structural STAR response outlines...",
  "Formulating gap-mitigation strategies and technical pitch points...",
  "Polishing personalized performance-coaching kits..."
];

export default function App() {
  const [jd, setJd] = useState("");
  const [resume, setResume] = useState("");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Results
  const [generatedHtml, setGeneratedHtml] = useState<string>("");
  const [showRaw, setShowRaw] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Metadata received
  const [matchScore, setMatchScore] = useState<number>(85);
  const [matchLabel, setMatchLabel] = useState<string>("Solid Candidate");
  const [riskLevel, setRiskLevel] = useState<string>("Medium");
  const [targetRole, setTargetRole] = useState<string>("Product Manager");
  const [targetCompany, setTargetCompany] = useState<string>("Target Company");
  
  // Intervals
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (loading) {
      setLoadingStepIdx(0);
      loadingIntervalRef.current = setInterval(() => {
        setLoadingStepIdx(prev => (prev + 1) % LOADING_STEPS.length);
      }, 2500);
    } else {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }
    }
    return () => {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }
    }
  }, [loading]);

  const loadPreset = (preset: Preset) => {
    setJd(preset.jd);
    setResume(preset.resume);
    setSelectedPresetId(preset.id);
    setError(null);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jd.trim()) {
      setError("Please paste a Job Description first.");
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedHtml("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jd, resume }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An unexpected error occurred during generation.");
      }

      if (!data.html) {
        throw new Error("No preparation criteria returned from coach. Please retry.");
      }

      setGeneratedHtml(data.html);
      setMatchScore(data.matchScore || 85);
      setMatchLabel(data.matchLabel || "Solid Candidate");
      setRiskLevel(data.riskLevel || "Medium");
      setTargetRole(data.role || "Product Manager");
      setTargetCompany(data.company || "Target Company");
    } catch (err: any) {
      setError(err.message || "Failed to contact remote PM coach server. Check configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const handleDownload = () => {
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Expert_PM_Prep_Kit_${targetRole.replace(/\s+/g, "_")}_${targetCompany.replace(/\s+/g, "_")}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenNewTab = () => {
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const clearInputs = () => {
    setJd("");
    setResume("");
    setSelectedPresetId("");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased flex flex-col selection:bg-blue-100 selection:text-blue-900" id="main_root">
      {/* Visual Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50 px-6 py-3.5" id="app_header">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 font-black italic text-white font-display text-sm">E</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold tracking-tight text-base text-slate-900">Expert PM</span>
                <span className="text-[10px] uppercase tracking-wider font-mono bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">PRO COACH</span>
              </div>
              <p className="text-xs text-slate-500 font-semibold font-sans">Corporate Interview Intelligence for PM Candidates</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              Gemini 3.5 Active
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8" id="app_main">
        <AnimatePresence mode="wait">
          {!generatedHtml && !loading ? (
            /* INPUT WORKSPACE SCREEN */
            <motion.div 
              key="input_form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              id="form_view"
            >
              {/* Left Column: Context Coach and Demo Presets */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-sm relative overflow-hidden" id="coach_intro_card">
                  <div className="absolute top-0 right-0 p-6 opacity-5">
                    <Sparkles className="w-32 h-32 text-blue-500" />
                  </div>
                  <div className="relative z-10 space-y-3.5">
                    <div className="inline-flex items-center gap-1.5 text-[10px] text-blue-400 font-bold uppercase tracking-wider bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
                      <Sparkle className="w-3 h-3 text-blue-400" /> Interview Intelligence
                    </div>
                    
                    <h2 className="font-display font-bold text-2xl tracking-normal text-slate-50 leading-tight">
                      Stop engineering features. <br />
                      Start pitching metric impact.
                    </h2>
                    
                    <p className="text-sm text-slate-300 leading-relaxed font-sans font-normal">
                      Hiring managers don't evaluate PMs on list size. They filter for metric boundaries, strategic framing, robust non-functional alignment, and bulletproof STAR execution.
                    </p>

                    <div className="space-y-3 pt-2 text-xs font-mono text-slate-400">
                      <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>Isolates Metric & Domain mandates.</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>Predicts 5 loop interview rounds.</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>Decodes hidden interviewer traps.</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>Audits resumes and structures STAR stories.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Presets Sidebar Panel */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm" id="presets_container">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-semibold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-500" />
                      Select a Demo Profile
                    </h3>
                  </div>
                  
                  <p className="text-xs text-slate-500 font-medium">
                    Test the coach instantly by loading one of these realistic Product Manager job profiles and resumes:
                  </p>

                  <div className="space-y-2.5">
                    {PRESETS.map((preset) => {
                      const isActive = selectedPresetId === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => loadPreset(preset)}
                          className={`w-full text-left p-3 rounded-lg border transition-all duration-200 flex flex-col gap-0.5 ${
                            isActive
                              ? "bg-blue-50/40 border-blue-600 ring-2 ring-blue-500/10 shadow-sm"
                              : "bg-white hover:bg-slate-50 border-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 font-sans">
                              {preset.name}
                            </span>
                            {isActive && (
                              <span className="text-[9px] bg-blue-100 text-blue-700 font-mono font-bold px-1.5 py-0.5 rounded">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono font-medium">
                            {preset.role} • {preset.company}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Inputs Form */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden" id="form_inputs_card">
                <form onSubmit={handleGenerate} className="space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-display font-semibold text-slate-800 text-base">
                      Preparation Parameters
                    </h3>
                    {(jd || resume) && (
                      <button
                        type="button"
                        onClick={clearInputs}
                        className="text-xs text-slate-500 hover:text-red-600 font-semibold font-sans flex items-center gap-1"
                      >
                        Reset Workspace
                      </button>
                    )}
                  </div>

                  {/* Job Description Text Area */}
                  <div className="space-y-1.5">
                    <label htmlFor="jd_input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Job Description (JD) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        id="jd_input"
                        rows={10}
                        placeholder="Paste the full, unedited PM Job Description here. Include responsibilities, organizational stage, and core metric expectations..."
                        value={jd}
                        onChange={(e) => {
                          setJd(e.target.value);
                          setSelectedPresetId("");
                        }}
                        className="w-full text-xs font-sans p-3 rounded-lg border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 bg-[#FCFCFB] text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none resize-none font-medium"
                      />
                      <div className="absolute bottom-3.5 right-3 text-[10px] font-mono text-slate-400 bg-white/90 px-1.5 py-0.5 rounded border border-slate-100">
                        {jd.length} chars
                      </div>
                    </div>
                  </div>

                  {/* Candidate Resume Text Area */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="resume_input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                        Candidate Resume (Optional)
                      </label>
                      <span className="text-[10px] font-mono text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                        RECOMMENDED FOR STAR BUILDER
                      </span>
                    </div>
                    <div className="relative">
                      <textarea
                        id="resume_input"
                        rows={8}
                        placeholder="Paste your resume here to tailor the STAR stories and gap-analysis specifically to your actual career experience. (If left blank, stories are structured for a typical MBA PM candidate with 1-4 years experience)"
                        value={resume}
                        onChange={(e) => {
                          setResume(e.target.value);
                          setSelectedPresetId("");
                        }}
                        className="w-full text-xs font-sans p-3 rounded-lg border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 bg-[#FCFCFB] text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none resize-none font-medium"
                      />
                      <div className="absolute bottom-3.5 right-3 text-[10px] font-mono text-slate-400 bg-white/90 px-1.5 py-0.5 rounded border border-slate-100">
                        {resume.length} chars
                      </div>
                    </div>
                  </div>

                  {/* Error Notification */}
                  {error && (
                    <div className="bg-red-50/80 border border-red-200 text-red-800 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold">Preparation Setup Failed</h4>
                        <p className="text-xs text-red-700/90 font-medium mt-0.5 leading-relaxed">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full h-11 bg-blue-600 text-white rounded-lg font-display font-bold text-xs tracking-wider uppercase inline-flex items-center justify-center gap-2 hover:bg-blue-500 transition-all duration-200 cursor-pointer shadow-md shadow-blue-500/10 group"
                    >
                      <Play className="w-3.5 h-3.5 text-blue-100 fill-blue-100" />
                      Build PM Interview Prep Kit
                      <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-[11px] text-slate-400 text-center font-sans mt-3">
                      Takes roughly ~15 seconds to synthesize your structured kit with multi-tab layouts.
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>
          ) : loading ? (
            /* LOADING STAGE SCREEN */
            <motion.div
              key="loading_screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto py-20 flex flex-col items-center justify-center text-center space-y-8"
              id="loading_container"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-blue-50 border border-blue-200/50 flex items-center justify-center animate-pulse">
                  <Compass className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              </div>

              <div className="space-y-3">
                <span className="font-mono text-xs uppercase tracking-widest text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded inline-block">
                  Expert PM Analyzer
                </span>
                <h3 className="font-display font-medium text-slate-900 text-lg tracking-tight">
                  Running Strategic Loop Diagnostics...
                </h3>
              </div>

              {/* Progress Stepper Bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/50">
                <motion.div 
                  initial={{ width: "5%" }}
                  animate={{ 
                    width: `${((loadingStepIdx + 1) / LOADING_STEPS.length) * 100}%` 
                  }}
                  transition={{ duration: 0.5 }}
                  className="bg-blue-600 h-full rounded-full"
                />
              </div>

              {/* Cycle messages */}
              <div className="h-10">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingStepIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="text-slate-500 font-sans text-sm font-medium tracking-normal"
                  >
                    {LOADING_STEPS[loadingStepIdx]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            /* PREPARATION KIT RESULT WORKSPACE */
            <motion.div
              key="result_workspace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
              id="result_workspace_view"
            >
              {/* Back Button and Reset Header actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <button
                  onClick={() => {
                    setGeneratedHtml("");
                  }}
                  className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 px-3.5 py-2 rounded-xl transition-all duration-200"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Configure Another Role
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={handleOpenNewTab}
                    className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5"
                    title="Open the prep kit in a clean fullscreen browser tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    Open in New Tab
                  </button>

                  <button
                    onClick={handleDownload}
                    className="bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5"
                    title="Download the full interactive HTML prep kit to study offline anytime"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    Download Portable HTML
                  </button>

                  <button
                    onClick={() => setShowRaw(!showRaw)}
                    className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5 border ${
                      showRaw 
                        ? "bg-slate-900 border-slate-900 text-white" 
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    {showRaw ? "Show Visual Tabs Dashboard" : "Show HTML Raw Source"}
                  </button>

                  <button
                    onClick={() => handleCopy(generatedHtml)}
                    className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-1.5"
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Copied HTML Source!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        Copy Raw HTML
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* High Status Executive Metadata Header Banner */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-sm space-y-4 relative overflow-hidden" id="metadata_banner">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <Compass className="w-24 h-24 text-blue-500" />
                </div>
                
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  <div className="md:col-span-8 space-y-1.5">
                    <span className="text-[9px] font-mono tracking-widest text-blue-400 font-bold uppercase bg-blue-950 border border-blue-500/25 px-2 py-0.5 rounded">
                      INTERVIEW COACH DEPLOYED
                    </span>
                    <h1 className="font-display font-bold text-slate-50 text-xl sm:text-2xl leading-snug">
                      Candidate Strategy Guide & Prep Kit
                    </h1>
                    <p className="text-xs text-slate-300 font-medium font-sans">
                      Target Role: <strong className="text-white">{targetRole}</strong> at <strong className="text-white">{targetCompany}</strong>. Customized with detailed domain metrics, mock cross-functional loops, and structural STAR behaviorals.
                    </p>
                  </div>

                  {/* Statistics Widgets */}
                  <div className="md:col-span-4 flex justify-start md:justify-end gap-6 border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
                    <div className="flex items-center gap-3">
                      <div className="relative flex items-center justify-center">
                        {/* Circular Progress Circle */}
                        <svg className="w-14 h-14 transform -rotate-90">
                          <circle cx="28" cy="28" r="24" className="stroke-white/10" strokeWidth="4" fill="transparent" />
                          <circle 
                            cx="28" 
                            cy="28" 
                            r="24" 
                            className="stroke-blue-500" 
                            strokeWidth="4" 
                            fill="transparent" 
                            strokeDasharray={2 * Math.PI * 24}
                            strokeDashoffset={2 * Math.PI * 24 * (1 - matchScore / 100)}
                          />
                        </svg>
                        <span className="absolute font-mono font-bold text-[13.5px] text-blue-400">
                          {matchScore}%
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">JD Match Fit</p>
                        <p className="text-xs text-slate-100 font-bold leading-tight font-sans">{matchLabel}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 border-l border-white/10 pl-5">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/35 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Loop Risk Stage</p>
                        <p className="text-xs font-bold leading-tight uppercase font-mono text-orange-300">{riskLevel} Risk</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* VIEW DISPLAY PANEL */}
              {showRaw ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4" id="raw_markdown_pane">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-display font-semibold text-slate-800 text-sm">
                      Raw Self-Contained HTML Source Code (Study / Carry-on Friendly)
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      UTF-8 Encoded HTML Document
                    </span>
                  </div>
                  <pre className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl font-mono overflow-auto max-h-[600px] leading-relaxed select-all">
                    {generatedHtml}
                  </pre>
                </div>
              ) : (
                /* SEAMLESS HIGH FIDELITY IFRAME VIEW */
                <div className="w-full rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-md flex flex-col" id="iframe_view_container">
                  <div className="bg-slate-150 px-5 py-3 border-b border-slate-250 flex justify-between items-center text-xs text-slate-600 font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                      <span className="ml-1 font-mono text-[11px] font-semibold text-slate-500 overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px] sm:max-w-none">
                        Expert_PM_Interview_Coaching_Platform.html
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">Interactive Preview Sandbox</span>
                  </div>
                  
                  <iframe 
                    srcDoc={generatedHtml} 
                    className="w-full min-h-[920px] border-0" 
                    id="interactive_prep_iframe"
                    title="Expert PM Interactive Prep Kit Dashboard"
                    sandbox="allow-scripts allow-popups allow-downloads"
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Corporate Professional Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-6 px-4 mt-12 text-center" id="app_footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <p className="font-sans font-medium">© 2026 Expert PM Coach Inc. Developed for top-tier candidates.</p>
          <div className="flex items-center gap-4 font-mono font-bold uppercase tracking-wider text-[10px]">
            <span>Secure Enterprise Architecture</span>
            <span className="text-slate-300">|</span>
            <span>No Data Storage Logs</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
