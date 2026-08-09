import React, { useState } from "react";
import { 
  Droplets, 
  Download, 
  ExternalLink, 
  Layers, 
  Wrench, 
  Zap, 
  ArrowRight, 
  RefreshCw, 
  ShieldAlert, 
  Info, 
  Globe, 
  ChevronDown, 
  Mail, 
  User, 
  Compass, 
  FileText,
  Star,
  Activity,
  Calculator
} from "lucide-react";
import PhoneMockup from "./components/PhoneMockup";
import AppIcon from "./components/AppIcon";
import WellboreDiagram from "./components/WellboreDiagram";
import MudWeightCalculator from "./components/MudWeightCalculator";
import FeedbackManager from "./components/FeedbackManager";
import {
  calculateMudFlow,
  DRILL_PIPE_SIZES,
  DEFAULT_PIPE_ID,
  getDrillPipeById,
  YP_TO_PA,
} from "./utils/mudMath";
import { CalculatorInputs } from "./types";
import { APP_VERSION, PLAY_STORE_URL, DEVELOPER_PAGE_URL, CONTACT_EMAIL } from "./config";

export default function App() {
  const [isMetric, setIsMetric] = useState(false);

  // Imperial state defaults (calculating in background)
  const [inputs, setInputs] = useState<CalculatorInputs>({
    mudWeight: 10.5, // ppg
    measuredDepth: 12000, // ft
    trueVerticalDepth: 10500, // ft
    casingID: 8.681, // inches
    drillPipeOD: 5.0, // inches
    drillPipeID: 4.276, // inches — published API value
    drillPipeSizeId: DEFAULT_PIPE_ID,
    pumpFlowRate: 450, // gpm
    pumpDisplacement: 0.097, // bbl/stroke
    plasticViscosity: 20, // cP
    yieldPoint: 15, // lb/100 ft²
  });

  // Derived calculations
  const outputs = calculateMudFlow(inputs);

  // Local state for UI inputs (which dynamically change depending on unit mode)
  // When switching unit mode, we recalculate UI values from the imperial source values
  const uiMudWeight = isMetric ? parseFloat((inputs.mudWeight * 0.1198).toFixed(2)) : inputs.mudWeight;
  const uiMD = isMetric ? Math.round(inputs.measuredDepth * 0.3048) : inputs.measuredDepth;
  const uiTVD = isMetric ? Math.round(inputs.trueVerticalDepth * 0.3048) : inputs.trueVerticalDepth;
  const uiCasingID = isMetric ? parseFloat((inputs.casingID * 25.4).toFixed(1)) : inputs.casingID;
  const uiPipeOD = isMetric ? parseFloat((inputs.drillPipeOD * 25.4).toFixed(1)) : inputs.drillPipeOD;
  const uiFlowRate = isMetric ? Math.round(inputs.pumpFlowRate * 3.7854) : inputs.pumpFlowRate;

  // Custom setter wrappers to sync back to imperial
  const handleMudWeightChange = (val: number) => {
    const imperialMW = isMetric ? val / 0.1198 : val;
    setInputs(prev => ({ ...prev, mudWeight: parseFloat(imperialMW.toFixed(2)) }));
  };

  const handleMDChange = (val: number) => {
    const imperialMD = isMetric ? val / 0.3048 : val;
    setInputs(prev => ({ ...prev, measuredDepth: Math.round(imperialMD) }));
  };

  const handleTVDChange = (val: number) => {
    const imperialTVD = isMetric ? val / 0.3048 : val;
    setInputs(prev => ({ ...prev, trueVerticalDepth: Math.round(imperialTVD) }));
  };

  const handleCasingIDChange = (val: number) => {
    const imperialID = isMetric ? val / 25.4 : val;
    setInputs(prev => ({ ...prev, casingID: parseFloat(imperialID.toFixed(3)) }));
  };

  const handlePipeSizeChange = (sizeId: string) => {
    const pipe = getDrillPipeById(sizeId);
    setInputs(prev => ({
      ...prev,
      drillPipeSizeId: pipe.id,
      drillPipeOD: pipe.od,
      drillPipeID: pipe.innerDiameter,
    }));
  };

  const handlePvChange = (val: number) => {
    setInputs(prev => ({ ...prev, plasticViscosity: val }));
  };

  const handleYpChange = (val: number) => {
    setInputs(prev => ({ ...prev, yieldPoint: val }));
  };

  const handleFlowRateChange = (val: number) => {
    const imperialFlow = isMetric ? val / 3.7854 : val;
    setInputs(prev => ({ ...prev, pumpFlowRate: Math.round(imperialFlow) }));
  };

  const resetCalculator = () => {
    setInputs({
      mudWeight: 10.5,
      measuredDepth: 12000,
      trueVerticalDepth: 10500,
      casingID: 8.681,
      drillPipeOD: 5.0,
      drillPipeID: 4.276,
      drillPipeSizeId: DEFAULT_PIPE_ID,
      pumpFlowRate: 450,
      pumpDisplacement: 0.097,
      plasticViscosity: 20,
      yieldPoint: 15,
    });
  };

  // FAQ states
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqData = [
    {
      q: "What is MudFlow and who is it designed for?",
      a: "MudFlow is a lightweight, offline-ready utility and calculator built for drilling fluids engineers (mud engineers), well control technicians, rig supervisors, and petroleum engineering students. It provides accurate mathematical formulations for fluid hydraulics, capacity calculations, pressure control, and density management."
    },
    {
      q: "How does the Mud Density Adjuster work?",
      a: "The density adjuster utilizes standard mass-balance equations for weighting up mud pits. When increasing density, it calculates the exact sacks of Barite (4.2 SG weighting material) needed per barrel of mud, as well as the resulting pit volume expansion. When decreasing density, it computes the exact fresh-water (8.33 ppg) dilution volume required."
    },
    {
      q: "Can I use MudFlow in offshore/remote areas without internet access?",
      a: "Absolutely. The Android app is designed to run entirely client-side on your phone with zero server dependencies, allowing you to run critical safety calculations offline on the rig floor, in the bunkhouse, or while traveling."
    },
    {
      q: "What is Equivalent Circulating Density (ECD)?",
      a: "Equivalent Circulating Density is the effective mud weight the formation feels while fluid is circulating. It is the static mud weight plus the annular friction pressure expressed as a density. Monitoring ECD matters because exceeding the fracture gradient causes losses. The simulator on this page shows ECD directly, calculated from a Bingham Plastic annular friction model using your plastic viscosity and yield point."
    },
    {
      q: "How accurate is the simulator on this page?",
      a: "The simulator is a teaching and demonstration tool. It models a single uniform annular section with one fluid and no cuttings loading, no tool joints, no drill collars, and no pipe rotation or eccentricity. Real wells have several hole sections, so a full hydraulics run will give different numbers. Never use this page for operational decisions — use the app for field work, and always cross-check against your own well plan and company procedures."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Header / Nav */}
      <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AppIcon size={40} />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 font-sans">MudFlow</span>
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-mono border border-blue-100 font-bold uppercase tracking-wider">v{APP_VERSION}</span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide font-mono uppercase font-semibold">Drilling Fluid Dynamics</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
            <a href="#simulator" className="hover:text-blue-600 transition-colors">Interactive Simulator</a>
            <a href="#features" className="hover:text-blue-600 transition-colors">App Modules</a>
            <a href="#adjuster" className="hover:text-blue-600 transition-colors">Density Adjuster</a>
            <a href="#feedback" className="hover:text-blue-600 transition-colors">Feedback Console</a>
          </nav>

          <div className="flex items-center gap-3">
            <a 
              href={DEVELOPER_PAGE_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>All apps by Madanyes</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Text Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-xs text-slate-700 shadow-sm font-medium">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="font-semibold">Live on Google Play — v{APP_VERSION}</span>
                <span className="text-slate-300">|</span>
                <span className="text-blue-600 font-extrabold">Free to install</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-slate-900 font-sans">
                The Pro Drilling <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Mud Calculator
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans font-light">
                Perform professional hydrostatic, volumetric, and hydraulic calculations with precision. Designed by <b>Madanyes</b> for petroleum engineers, mud loggers, and rig crews operating worldwide.
              </p>

              {/* Icon Showcase Card */}
              <div className="flex items-center gap-3.5 bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-sm max-w-sm mx-auto lg:mx-0 hover:border-slate-300 transition-all">
                <AppIcon size={56} className="shrink-0" />
                <div className="text-left">
                  <div className="font-extrabold text-[#014E80] text-sm leading-tight">Mudflow Official App</div>
                  <p className="text-[10.5px] text-slate-500 mt-1 leading-snug">Rig-floor optimized, offline-first. Over 50 calculators, in English and French. Free to install, with an optional Professional upgrade.</p>
                </div>
              </div>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <a 
                  href="https://play.google.com/store/apps/details?id=com.aistudio.mudflow.rkvyxs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl px-8 py-4 text-sm transition-all shadow-md shadow-blue-600/10 flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.02]"
                >
                  <Download className="w-4.5 h-4.5" />
                  <span>Get it on Google Play</span>
                </a>
                
                <a 
                  href="#simulator"
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-2xl px-6 py-4 text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Launch Live Simulator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </a>
              </div>

              {/* Trust indicators */}
              <div className="pt-6 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0 text-left border-t border-slate-200/80">
                <div>
                  <div className="text-xl font-bold font-mono text-blue-600">100%</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Offline Operations</div>
                </div>
                <div>
                  <div className="text-xl font-bold font-mono text-blue-600">Dual</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Metric / Imperial</div>
                </div>
                <div>
                  <div className="text-xl font-bold font-mono text-blue-600">No Ads</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Production Integrity</div>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Interactive App Preview Container */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
              {/* Backside absolute decorations */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
              
              <div className="relative z-10 space-y-4">
                <PhoneMockup />
                <p className="text-center text-[11px] text-slate-500 font-mono font-medium">
                  ▲ Interactive Android preview. Tap tabs to inspect features.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Simulator Section (Main Tool) */}
      <section id="simulator" className="py-20 bg-slate-100/50 border-y border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              <Calculator className="w-3.5 h-3.5" />
              Interactive Module
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Rig Hydraulics & Volumetric Simulator
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Change the operational parameters below. The wellbore diagram and the
              pressure readouts update as you move each control.
            </p>
            <div className="mt-4 mx-auto max-w-2xl text-left p-3 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-900 leading-relaxed">
                <b>Demonstration model.</b> One uniform annular section, one fluid, no
                cuttings loading, no collars or tool joints, no pipe rotation. Friction
                uses a Bingham Plastic model. Real wells need a full multi-section
                hydraulics run — do not use this page for operational decisions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Column 1: Input controls */}
            <div className="lg:col-span-5 glass-card rounded-3xl p-6 flex flex-col justify-between shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-slate-700 tracking-wide uppercase font-mono">Control Panel</h3>
                  
                  {/* Metric/Imperial Unit Switcher */}
                  <div className="bg-slate-100 border border-slate-200 rounded-xl p-1 flex shadow-inner">
                    <button
                      onClick={() => setIsMetric(false)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${!isMetric ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                    >
                      Imperial
                    </button>
                    <button
                      onClick={() => setIsMetric(true)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${isMetric ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                    >
                      Metric
                    </button>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Mud Density */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Mud Weight (Density)
                      </span>
                      <span className="font-mono text-xs font-bold text-blue-600">
                        {uiMudWeight} {isMetric ? "s.g." : "ppg"}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={isMetric ? "1.0" : "8.4"}
                      max={isMetric ? "2.3" : "19.0"}
                      step={isMetric ? "0.01" : "0.1"}
                      value={uiMudWeight}
                      onChange={(e) => handleMudWeightChange(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  {/* Depth sliders side by side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Measured Depth */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Measured Depth (MD)
                        </span>
                        <span className="font-mono text-xs font-bold text-blue-600">
                          {uiMD} {isMetric ? "m" : "ft"}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={isMetric ? "300" : "1000"}
                        max={isMetric ? "6000" : "20000"}
                        step="50"
                        value={uiMD}
                        onChange={(e) => handleMDChange(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    {/* True Vertical Depth */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          True Vertical Depth (TVD)
                        </span>
                        <span className="font-mono text-xs font-bold text-blue-600">
                          {uiTVD} {isMetric ? "m" : "ft"}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={isMetric ? "300" : "1000"}
                        max={isMetric ? "6000" : "20000"}
                        step="50"
                        value={uiTVD}
                        onChange={(e) => handleTVDChange(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>

                  {/* Well geometry parameters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Casing ID */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Casing / Hole ID
                        </span>
                        <span className="font-mono text-xs font-bold text-blue-600">
                          {uiCasingID} {isMetric ? "mm" : "in"}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={isMetric ? "150" : "6.0"}
                        max={isMetric ? "400" : "15.0"}
                        step={isMetric ? "1" : "0.1"}
                        value={uiCasingID}
                        onChange={(e) => handleCasingIDChange(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    {/* Drill Pipe size — real published OD and ID */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Drill Pipe Size
                        </span>
                        <span className="font-mono text-xs font-bold text-blue-600">
                          {uiPipeOD} {isMetric ? "mm" : "in"} OD
                        </span>
                      </div>
                      <select
                        value={inputs.drillPipeSizeId}
                        onChange={(e) => handlePipeSizeChange(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                      >
                        {DRILL_PIPE_SIZES.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                      <p className="text-[9px] text-slate-400 mt-1 font-mono">
                        ID {inputs.drillPipeID.toFixed(3)} in — published API value
                      </p>
                    </div>
                  </div>

                  {/* Rheology — required for any honest friction calculation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Plastic Viscosity (PV)
                        </span>
                        <span className="font-mono text-xs font-bold text-blue-600">
                          {inputs.plasticViscosity} cP
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="80"
                        step="1"
                        value={inputs.plasticViscosity}
                        onChange={(e) => handlePvChange(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Yield Point (YP)
                        </span>
                        <span className="font-mono text-xs font-bold text-blue-600">
                          {isMetric
                            ? (inputs.yieldPoint * YP_TO_PA).toFixed(1)
                            : inputs.yieldPoint}{" "}
                          {isMetric ? "Pa" : "lb/100ft²"}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="60"
                        step="1"
                        value={inputs.yieldPoint}
                        onChange={(e) => handleYpChange(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>

                  {/* Flow Rate */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Circulation Flow Rate
                      </span>
                      <span className="font-mono text-xs font-bold text-blue-600">
                        {uiFlowRate} {isMetric ? "lpm" : "gpm"}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={isMetric ? "500" : "100"}
                      max={isMetric ? "3000" : "8000"}
                      step="50"
                      value={uiFlowRate}
                      onChange={(e) => handleFlowRateChange(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Reset Control */}
              <button
                onClick={resetCalculator}
                className="w-full mt-8 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-800 text-xs py-3 rounded-xl transition-colors font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset defaults
              </button>
            </div>

            {/* Column 2: Live Wellbore Diagram */}
            <div className="lg:col-span-4">
              <WellboreDiagram inputs={inputs} outputs={outputs} isMetric={isMetric} />
            </div>

            {/* Column 3: Analytical details / Readouts */}
            <div className="lg:col-span-3 space-y-4 flex flex-col justify-between">
              
              {/* Box 1: Hydrostatic Pressure */}
              <div className="glass-card rounded-2xl p-4.5 shadow-sm">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block font-mono">
                  Calculated Hydrostatic
                </span>
                <div className="text-2xl font-black font-mono text-blue-600 mt-1">
                  {isMetric ? (outputs.hydrostaticPressure * 0.0689).toFixed(1) : outputs.hydrostaticPressure.toLocaleString()}{" "}
                  <span className="text-xs text-slate-400 font-bold">{isMetric ? "bar" : "psi"}</span>
                </div>
                <div className="text-[10px] text-slate-600 mt-1 flex items-center gap-1 leading-normal">
                  <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Gradient: <b>{isMetric ? (inputs.mudWeight * 0.1198 * 0.0981).toFixed(4) : (inputs.mudWeight * 0.052).toFixed(3)}</b> {isMetric ? "bar/m" : "psi/ft"}</span>
                </div>
              </div>

              {/* Box 2: Total Wellbore Volume */}
              <div className="glass-card rounded-2xl p-4.5 shadow-sm">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block font-mono">
                  Total Fluid Volume
                </span>
                <div className="text-2xl font-black font-mono text-blue-600 mt-1">
                  {isMetric ? (outputs.wellVolume * 0.1589).toFixed(1) : outputs.wellVolume.toLocaleString()}{" "}
                  <span className="text-xs text-slate-400 font-bold">{isMetric ? "m³" : "bbl"}</span>
                </div>
                <div className="text-[10px] text-slate-600 mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Annulus: <b>{isMetric ? (outputs.annularVolume * 0.1589).toFixed(1) : outputs.annularVolume}</b> {isMetric ? "m³" : "bbl"}</span>
                </div>
                <div className="text-[10px] text-slate-600 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>Drillstring: <b>{isMetric ? (outputs.drillPipeVolume * 0.1589).toFixed(1) : outputs.drillPipeVolume}</b> {isMetric ? "m³" : "bbl"}</span>
                </div>
              </div>

              {/* Box 3: Lag Time / Circulation Cycle */}
              <div className="glass-card rounded-2xl p-4.5 shadow-sm">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block font-mono">
                  Lag Time (Bottom to Surface)
                </span>
                <div className="text-2xl font-black font-mono text-blue-600 mt-1">
                  {outputs.lagTime.toFixed(1)}{" "}
                  <span className="text-xs text-slate-400 font-bold">mins</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5 leading-normal">
                  Circulation time needed to carry cuttings from the drill bit up to the shale shakers.
                </p>
              </div>

              {/* Box 4: ECD and annular friction */}
              <div className="glass-card rounded-2xl p-4.5 shadow-sm">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block font-mono">
                  Equivalent Circulating Density
                </span>
                <div className="text-2xl font-black font-mono text-emerald-600 mt-1">
                  {isMetric ? (outputs.ecd * 0.119826).toFixed(2) : outputs.ecd.toFixed(2)}{" "}
                  <span className="text-xs text-slate-400 font-bold">{isMetric ? "s.g." : "ppg"}</span>
                </div>

                {outputs.isGeometryValid ? (
                  <>
                    <div className="text-[10px] text-slate-600 mt-1.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span>
                        Annular friction:{" "}
                        <b>
                          {isMetric
                            ? (outputs.annularPressureLoss * 0.0689476).toFixed(1)
                            : outputs.annularPressureLoss.toLocaleString()}
                        </b>{" "}
                        {isMetric ? "bar" : "psi"}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-600 flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>
                        BHP:{" "}
                        <b>
                          {isMetric
                            ? (outputs.bottomHolePressure * 0.0689476).toFixed(1)
                            : outputs.bottomHolePressure.toLocaleString()}
                        </b>{" "}
                        {isMetric ? "bar" : "psi"}
                      </span>
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono mt-1.5 pt-1.5 border-t border-slate-100">
                      Annular velocity {outputs.annularVelocity} ft/min · critical{" "}
                      {outputs.criticalVelocity} ft/min ·{" "}
                      <b className={outputs.flowRegime === "Turbulent" ? "text-amber-600" : "text-blue-600"}>
                        {outputs.flowRegime}
                      </b>
                    </div>
                  </>
                ) : (
                  <div className="text-[10px] text-red-600 mt-1.5 leading-normal">
                    Hole ID must be larger than pipe OD. Adjust the geometry.
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* App Features grid */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-2">
          <div className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest bg-blue-50 inline-block px-3 py-1 rounded-full border border-blue-100">
            System Modules
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Math Suite for Rig Operations
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            The MudFlow Android app packs dedicated pipelines to streamline fluid engineering and avoid manual errors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="glass-card rounded-2xl p-6 hover:border-blue-200 transition-all flex flex-col justify-between group shadow-sm">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
                <Layers className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Volumetric Capacities</h3>
              <p className="text-xs text-slate-500 leading-normal">
                Determine casing, liner, open hole, and tubular capacities. Track displacement and stroke volume requirements with easy-to-read meters.
              </p>
            </div>
            <div className="pt-6 text-[10px] font-mono text-slate-400 group-hover:text-blue-600 transition-colors font-semibold">
              BBL/FT & M³/M CAPACITIES
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-card rounded-2xl p-6 hover:border-blue-200 transition-all flex flex-col justify-between group shadow-sm">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
                <Wrench className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Rheology Diagnostics</h3>
              <p className="text-xs text-slate-500 leading-normal">
                Analyze fluid properties using Fann 35 rheometer dial logs. Computes plastic viscosity, yield point, and gel strengths on-the-fly.
              </p>
            </div>
            <div className="pt-6 text-[10px] font-mono text-slate-400 group-hover:text-blue-600 transition-colors font-semibold">
              BINGHAM PLASTIC & POWER LAW
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-card rounded-2xl p-6 hover:border-blue-200 transition-all flex flex-col justify-between group shadow-sm">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
                <Zap className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Nozzle Hydraulics</h3>
              <p className="text-xs text-slate-500 leading-normal">
                Configure nozzle layouts (e.g. 3 x 12/32"). Calculate Total Flow Area (TFA), bit pressure drop, impact forces, and nozzle velocities.
              </p>
            </div>
            <div className="pt-6 text-[10px] font-mono text-slate-400 group-hover:text-blue-600 transition-colors font-semibold">
              OPTIMIZED JET HYDRAULICS
            </div>
          </div>

          {/* Card 4 */}
          <div className="glass-card rounded-2xl p-6 hover:border-blue-200 transition-all flex flex-col justify-between group shadow-sm">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
                <ShieldAlert className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Kill Sheet Companion</h3>
              <p className="text-xs text-slate-500 leading-normal">
                Quick lookup variables for kick sheet generation, trip sheet audits, maximum allowable casing pressures, and influx safety thresholds.
              </p>
            </div>
            <div className="pt-6 text-[10px] font-mono text-slate-400 group-hover:text-blue-600 transition-colors font-semibold">
              SAFETY & WELL CONTROL LAWS
            </div>
          </div>

        </div>
      </section>

      {/* Adjuster / Density Math Section */}
      <section id="adjuster" className="py-20 bg-slate-50/50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side: Information and Description */}
            <div className="lg:col-span-5 space-y-6">
              <div className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest bg-blue-50 inline-block px-3 py-1 rounded-full border border-blue-100">
                Material Adjustments
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Change Mud Density with Precision
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed font-light">
                Adding density materials like Barite (specific gravity 4.2) or adding diluents like fresh water changes total wellbore hydrostatic pressure.
              </p>
              
              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded bg-blue-50 border border-blue-100 shrink-0 text-blue-600 font-bold font-mono flex items-center justify-center text-[10px]">1</div>
                  <p><b className="text-slate-800">Mass balance:</b> Barite sacks per 100 bbl and the resulting pit volume gain, using a 4.2 SG weighting material at 100 lb per sack.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded bg-blue-50 border border-blue-100 shrink-0 text-blue-600 font-bold font-mono flex items-center justify-center text-[10px]">2</div>
                  <p><b className="text-slate-800">Solids Concentration Monitor:</b> Warns when mud weight approaches limits that might yield high Plastic Viscosity.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded bg-blue-50 border border-blue-100 shrink-0 text-blue-600 font-bold font-mono flex items-center justify-center text-[10px]">3</div>
                  <p><b className="text-slate-800">Dilution Math:</b> Instantly calculates how much volume increase to expect when pumping fresh water into the pits.</p>
                </div>
              </div>

              <div className="pt-4">
                <a 
                  href="https://play.google.com/store/apps/details?id=com.aistudio.mudflow.rkvyxs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <span>Learn more on Madanyes's Developer Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right side: Interactive Density Calculator widget */}
            <div className="lg:col-span-7">
              <MudWeightCalculator />
            </div>

          </div>
        </div>
      </section>

      {/* Feedback Manager Section */}
      <section id="feedback" className="py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Rig Feedback Queue
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Developer Feedback Console
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              We want real rig engineers and mud loggers to share opinions. Submit a ticket below, and watch it route directly into Madanyes's developer inbox!
            </p>
          </div>

          <FeedbackManager />

        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 border-t border-slate-200/80 bg-slate-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400 mt-1 font-mono uppercase tracking-widest font-bold">Fluid hydraulics guide</p>
          </div>

          <div className="space-y-3">
            {faqData.map((faq, i) => (
              <div 
                key={i} 
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-sm text-slate-700 hover:text-blue-600 focus:outline-none cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === i ? "rotate-180 text-blue-600" : ""}`} />
                </button>
                {activeFaq === i && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Developer Spotlight Section */}
      <section className="py-16 bg-white border-t border-slate-200/80 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl mx-auto flex items-center justify-center text-blue-600">
            <User className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">About the Developer — Madanyes</h3>
            <p className="text-xs text-blue-600 font-mono font-bold">Madanyes</p>
          </div>
          <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed">
            Madanyes is an engineering utility developer focused on high-accuracy fluid dynamics, wellbore geometry diagnostics, and mobile utilities for rig-floor applications. MudFlow was developed using Google AI Studio to streamline mathematical workflows and raise rig floor productivity.
          </p>
          <div className="flex justify-center gap-4 text-xs font-semibold">
            <a 
              href={DEVELOPER_PAGE_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Google Play Profile</span>
            </a>
            <span className="text-slate-200">|</span>
            <a 
              href={`mailto:${CONTACT_EMAIL}`} 
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{CONTACT_EMAIL}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white">MudFlow</span>
              <p className="text-[9px] text-slate-400 font-mono">Built using Google AI Studio</p>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-mono text-center md:text-right max-w-sm">
            © 2026 Madanyes. All rights reserved. Oilfield safety calculations are for educational and advisory reference only. Always follow your operating company's policies.
          </p>
        </div>
      </footer>

    </div>
  );
}
