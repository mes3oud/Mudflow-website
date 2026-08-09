import React, { useState } from "react";
import { 
  Activity, 
  Droplets, 
  Settings, 
  Compass, 
  ChevronRight, 
  AlertTriangle,
  RotateCcw,
  Zap,
  Wrench,
  Layers,
  ShieldAlert,
  Download,
  Share2,
  FileSpreadsheet,
  Globe,
  Mail,
  Sliders,
  Check,
  Scale,
  RefreshCw,
  Info
} from "lucide-react";
import AppIcon from "./AppIcon";
import { APP_VERSION } from "../config";

export default function PhoneMockup() {
  // Mobile app state
  const [activeTab, setActiveTab] = useState<"fluids" | "wellCapacity" | "specialized" | "killSheet">("fluids");
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Customization State (Screenshots 1 & 2)
  const [language, setLanguage] = useState<"English" | "Français">("English");
  const [darkMode, setDarkMode] = useState(false);
  const [mudWeightUnit, setMudWeightUnit] = useState<"PPG" | "SG" | "PCF">("SG");
  const [pressureUnit, setPressureUnit] = useState<"psi" | "bar">("psi");
  const [depthUnit, setDepthUnit] = useState<"feet (ft)" | "meters (m)">("meters (m)");
  const [volumeUnit, setVolumeUnit] = useState<"bbl" | "m³" | "gal">("m³");
  const [flowRateUnit, setFlowRateUnit] = useState<"bbl/m" | "l/m" | "gal/m">("l/m");
  const [pipeUnit, setPipeUnit] = useState<"inches (inch)" | "millimeters (mm)">("inches (inch)");

  // Active Fluids Sub-Modal Selector
  const [activeFluidCalc, setActiveFluidCalc] = useState<string | null>(null);

  // Sub-tabs
  const [wellCapacityTab, setWellCapacityTab] = useState<"geometry" | "volumes" | "capacity">("volumes");
  const [specializedTab, setSpecializedTab] = useState<"plug" | "slug">("plug");
  const [killSheetTab, setKillSheetTab] = useState<"kick" | "plan">("kick");
  const [killMethod, setKillMethod] = useState<"Wait & Weight" | "Driller's Method">("Wait & Weight");

  // Calculations Source (Well Profile vs Manual)
  const [geometrySource, setGeometrySource] = useState<"Well Profile" | "Manual">("Well Profile");
  const [mudPumpCalculate, setMudPumpCalculate] = useState(true);

  // Dynamic values inside the simulator
  // Rheology Inputs (Screenshot 9 & interactive)
  const [rpm600, setRpm600] = useState(55);
  const [rpm300, setRpm300] = useState(34);
  const pv = Math.max(1, rpm600 - rpm300);
  const yp = Math.max(0, rpm300 - pv);

  // Bit Jets Inputs (Interactive)
  const [nozzlesCount, setNozzlesCount] = useState(3);
  const [nozzleSize, setNozzleSize] = useState(12); // 32nds
  const tfa = (nozzlesCount * Math.PI * Math.pow(nozzleSize / 32, 2)) / 4;

  // Mud Weight Up Inputs (Screenshot 9 "Mixing & Weight")
  const [mixingVolume, setMixingVolume] = useState(100); // bbl/m3 based on volumeUnit
  const [mixingInitialMW, setMixingInitialMW] = useState(1.55); // in current mudWeightUnit
  const [mixingTargetMW, setMixingTargetMW] = useState(1.65); // in current mudWeightUnit

  // Balanced Plug Inputs (Screenshot 6)
  const [plugBottomDepth, setPlugBottomDepth] = useState(9200);
  const [plugDesiredHeight, setPlugDesiredHeight] = useState(500);
  const [spacerAheadVolume, setSpacerAheadVolume] = useState(20);

  // Heavy Pill Inputs (Screenshot 7)
  const [dryPipeLength, setDryPipeLength] = useState(250);
  const [slugCurrentMW, setSlugCurrentMW] = useState(10.0);
  const [slugPillMW, setSlugPillMW] = useState(12.5);

  // Kill Sheet Inputs (Screenshot 11)
  const [originalMudWeight, setOriginalMudWeight] = useState(1.55);
  const [tvd, setTvd] = useState(3600);
  const [casingShoeTvd, setCasingShoeTvd] = useState(2487);
  const [leakOffPressure, setLeakOffPressure] = useState(1050);
  const [mudWeightAtTest, setMudWeightAtTest] = useState(2.05);

  // Derived Kill Calculations (Wait & Weight method)
  // ICP = Static Pressure in Annulus (not modeled) or standard friction pressure + SIDPP
  const killMudWeight = parseFloat((originalMudWeight + (leakOffPressure / (0.052 * tvd * 3.2808))).toFixed(2));
  const kmwDisplay = parseFloat((originalMudWeight + 0.10).toFixed(2));

  // Unit converters
  const convertDepth = (valInM: number) => {
    return depthUnit === "meters (m)" ? valInM : Math.round(valInM * 3.28084);
  };
  const convertVolume = (valInM3: number) => {
    if (volumeUnit === "m³") return valInM3;
    if (volumeUnit === "bbl") return parseFloat((valInM3 / 0.15898).toFixed(1));
    return Math.round(valInM3 * 264.172);
  };
  const convertFlowRate = (valInLpm: number) => {
    if (flowRateUnit === "l/m") return valInLpm;
    if (flowRateUnit === "bbl/m") return parseFloat((valInLpm * 0.006289).toFixed(2));
    return Math.round(valInLpm * 0.26417);
  };
  const convertPressure = (valInPsi: number) => {
    return pressureUnit === "psi" ? valInPsi : Math.round(valInPsi * 0.06894);
  };

  return (
    <div 
      id="phone-mockup" 
      className={`relative mx-auto w-[330px] h-[670px] rounded-[48px] shadow-2xl border-8 border-slate-800 p-2 overflow-hidden flex flex-col transition-all ${
        darkMode ? "bg-[#0b1322] text-slate-100" : "bg-[#F3F6F9] text-slate-800"
      }`}
    >
      {/* Phone Notch / Speaker Cutout */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-36 h-4.5 bg-slate-950 rounded-full z-40 flex items-center justify-between px-4">
        <div className="w-16 h-1 bg-slate-800 rounded-full"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></div>
      </div>

      {/* Top Application Bar (Standard header for all screens) */}
      <div className="pt-6 pb-2.5 px-3 bg-[#014E80] text-white flex items-center justify-between z-30 shadow-md">
        <div className="flex items-center gap-2">
          <AppIcon size={26} />
          <div>
            <div className="text-[11px] font-black tracking-widest font-sans leading-none uppercase">MUDFLOW</div>
            <div className="text-[7.5px] text-emerald-300 font-mono tracking-wider font-bold uppercase mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              OFFLINE MODE: HMOE1
            </div>
          </div>
        </div>
        <button 
          onClick={() => setSettingsOpen(!settingsOpen)}
          className={`p-1.5 rounded-xl transition-colors hover:bg-white/10 ${settingsOpen ? "bg-white/20" : ""}`}
        >
          <Settings className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Main Container / Content Body */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 relative z-10 text-xs font-sans">
        
        {/* SETTINGS / UNIT CUSTOMIZATION SCREEN (Screenshots 1 & 2) */}
        {settingsOpen ? (
          <div className="space-y-4 pb-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-2 mb-2">
              <h3 className="text-sm font-bold text-[#014E80] flex items-center gap-1">
                <Sliders className="w-4 h-4" />
                Unit Customization
              </h3>
              <button 
                onClick={() => setSettingsOpen(false)}
                className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-2.5 py-1 rounded-lg"
              >
                Close
              </button>
            </div>

            {/* Language Settings */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Language</span>
              <div className="grid grid-cols-2 gap-2">
                {["English", "Français"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang as any)}
                    className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      language === lang 
                        ? "bg-[#014E80] text-white border-transparent shadow-sm" 
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Dark Mode Switch */}
            <div className="bg-white/80 border border-slate-200 rounded-2xl p-3 flex items-center justify-between shadow-sm">
              <div>
                <span className="font-bold text-slate-800 block text-xs">Dark Mode</span>
                <span className="text-[9px] text-slate-500">Enable dark visual layout</span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 ${
                  darkMode ? "bg-blue-600 justify-end" : "bg-slate-300 justify-start"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white shadow-md"></span>
              </button>
            </div>

            {/* Mud Weight Unit */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Mud Weight Unit</span>
              <div className="grid grid-cols-3 gap-1.5">
                {["PPG", "SG", "PCF"].map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setMudWeightUnit(unit as any)}
                    className={`py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                      mudWeightUnit === unit 
                        ? "bg-[#014E80] text-white border-transparent" 
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>

            {/* Pressure Unit */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Pressure Unit</span>
              <div className="grid grid-cols-2 gap-1.5">
                {["psi", "bar"].map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setPressureUnit(unit as any)}
                    className={`py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                      pressureUnit === unit 
                        ? "bg-[#014E80] text-white border-transparent" 
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>

            {/* Depth Unit */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Depth Unit</span>
              <div className="grid grid-cols-2 gap-1.5">
                {["feet (ft)", "meters (m)"].map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setDepthUnit(unit as any)}
                    className={`py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                      depthUnit === unit 
                        ? "bg-[#014E80] text-white border-transparent" 
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>

            {/* Volume Unit */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Volume Unit</span>
              <div className="grid grid-cols-3 gap-1.5">
                {["bbl", "m³", "gal"].map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setVolumeUnit(unit as any)}
                    className={`py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                      volumeUnit === unit 
                        ? "bg-[#014E80] text-white border-transparent" 
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>

            {/* Flow Rate Unit */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Flow Rate Unit</span>
              <div className="grid grid-cols-3 gap-1.5">
                {["bbl/m", "l/m", "gal/m"].map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setFlowRateUnit(unit as any)}
                    className={`py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                      flowRateUnit === unit 
                        ? "bg-[#014E80] text-white border-transparent" 
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>

            {/* Pipe ID/OD Unit */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Pipe ID/OD Unit</span>
              <div className="grid grid-cols-2 gap-1.5">
                {["inches (inch)", "millimeters (mm)"].map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setPipeUnit(unit as any)}
                    className={`py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                      pipeUnit === unit 
                        ? "bg-[#014E80] text-white border-transparent" 
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>

            {/* About Mudflow Card (Screenshot 1) */}
            <div className="bg-[#EBF3F8] dark:bg-slate-900 border border-slate-200/50 rounded-2xl p-3.5 space-y-2.5 mt-4 text-[11px] leading-relaxed">
              <div className="flex items-center gap-2.5">
                <AppIcon size={38} />
                <div>
                  <h4 className="font-extrabold text-[#014E80] dark:text-sky-400 text-[11px] leading-tight">About Mudflow</h4>
                  <span className="text-[9px] text-slate-500 font-mono">v{APP_VERSION} (Pro)</span>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs font-light">
                Mudflow is a comprehensive mud engineering toolkit built for professional drilling operations. Runs offline-first with rigorous field-validated calculators.
              </p>
              <div className="text-[10px] font-semibold text-slate-500 flex justify-between pt-1 border-t border-slate-200/50">
                <span>Developer</span>
                <span>By madanyes</span>
              </div>
              
              {/* WhatsApp Contact Button */}
              <a 
                href="https://wa.me/213553143304" 
                target="_blank" 
                rel="noreferrer"
                className="w-full mt-2.5 bg-white hover:bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex items-center justify-center gap-2 font-bold text-[#014E80] text-xs shadow-sm cursor-pointer"
              >
                <div className="w-5.5 h-5.5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.455L0 24zm6.59-4.846c1.6.95 3.16 1.449 4.758 1.45 5.532 0 10.032-4.492 10.035-10.022.001-2.68-1.04-5.198-2.93-7.09C16.566 1.6 14.057.559 11.378.559c-5.534 0-10.037 4.501-10.041 10.03-.001 1.748.46 3.447 1.336 4.954L1.724 21.05l5.064-1.328c-.015.004-.141-.07-.141-.07z"></path></svg>
                </div>
                <span>WhatsApp Contact: +213553143304</span>
              </a>
            </div>
          </div>
        ) : (
          /* REGULAR MOBILE TAB VIEWS */
          <div className="space-y-4">

            {/* TAB 1: FLUIDS MAIN LIST (Screenshot 9) */}
            {activeTab === "fluids" && (
              <div className="animate-fadeIn space-y-3.5">
                {activeFluidCalc === null ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-extrabold text-[#014E80] dark:text-sky-400 uppercase tracking-tight">Engineering Calculations</h3>
                      <span className="text-[10px] font-bold text-slate-400 tracking-wider">8 Modules</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Rheology Lab */}
                      <button 
                        onClick={() => setActiveFluidCalc("rheology")}
                        className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-3 text-left hover:border-blue-300 dark:hover:border-blue-900 shadow-sm transition-all flex flex-col justify-between min-h-[110px]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 text-[#014E80] dark:text-sky-400 flex items-center justify-center mb-2">
                          <Compass className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] leading-tight text-slate-800 dark:text-slate-200">Rheology Lab</div>
                          <p className="text-[8.5px] text-slate-500 mt-1 leading-snug">PV, YP, gel strength, Power Law index</p>
                        </div>
                      </button>

                      {/* Hydraulics & ECD */}
                      <button 
                        onClick={() => setActiveFluidCalc("hydraulics")}
                        className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-3 text-left hover:border-blue-300 shadow-sm transition-all flex flex-col justify-between min-h-[110px]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-slate-800 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] leading-tight text-slate-800 dark:text-slate-200">Hydraulics & ECD</div>
                          <p className="text-[8.5px] text-slate-500 mt-1 leading-snug">Annular velocity, Hydrostatic pressure,</p>
                        </div>
                      </button>

                      {/* Mixing & Weight */}
                      <button 
                        onClick={() => setActiveFluidCalc("mixing")}
                        className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-3 text-left hover:border-blue-300 shadow-sm transition-all flex flex-col justify-between min-h-[110px]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-slate-800 border border-amber-100 text-amber-600 flex items-center justify-center mb-2">
                          <Scale className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] leading-tight text-slate-800 dark:text-slate-200">Mixing & Weight</div>
                          <p className="text-[8.5px] text-slate-500 mt-1 leading-snug">Fluid mixture formulas, Barite loading & mud</p>
                        </div>
                      </button>

                      {/* Pit Volumetrics */}
                      <button 
                        onClick={() => setActiveFluidCalc("pit")}
                        className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-3 text-left hover:border-blue-300 shadow-sm transition-all flex flex-col justify-between min-h-[110px]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center mb-2">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] leading-tight text-slate-800 dark:text-slate-200">Pit Volumetrics</div>
                          <p className="text-[8.5px] text-slate-500 mt-1 leading-snug">Volume tracking for rectangular pits &</p>
                        </div>
                      </button>

                      {/* Salt & Brines */}
                      <button 
                        onClick={() => setActiveFluidCalc("salt")}
                        className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-3 text-left hover:border-blue-300 shadow-sm transition-all flex flex-col justify-between min-h-[110px]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center mb-2">
                          <Droplets className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] leading-tight text-slate-800 dark:text-slate-200">Salt & Brines</div>
                          <p className="text-[8.5px] text-slate-500 mt-1 leading-snug">Salinity weight %, NaCl load, final density</p>
                        </div>
                      </button>

                      {/* Field Converter */}
                      <button 
                        onClick={() => setActiveFluidCalc("converter")}
                        className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-3 text-left hover:border-blue-300 shadow-sm transition-all flex flex-col justify-between min-h-[110px]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center mb-2">
                          <RefreshCw className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] leading-tight text-slate-800 dark:text-slate-200">Field Converter</div>
                          <p className="text-[8.5px] text-slate-500 mt-1 leading-snug">Frictionless conversion for ppg, bbl, psi, yield</p>
                        </div>
                      </button>

                      {/* Contamination */}
                      <button 
                        onClick={() => setActiveFluidCalc("contamination")}
                        className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-3 text-left hover:border-blue-300 shadow-sm transition-all flex flex-col justify-between min-h-[110px]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-red-50 border border-red-100 text-red-600 flex items-center justify-center mb-2">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] leading-tight text-slate-800 dark:text-slate-200">Contamination WBM/OBM</div>
                          <p className="text-[8.5px] text-slate-500 mt-1 leading-snug">Mud contamination diagnostics and exact</p>
                        </div>
                      </button>

                      {/* Solids Analysis */}
                      <button 
                        onClick={() => setActiveFluidCalc("solids")}
                        className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-3 text-left hover:border-blue-300 shadow-sm transition-all flex flex-col justify-between min-h-[110px]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] leading-tight text-slate-800 dark:text-slate-200">Solids Analysis</div>
                          <p className="text-[8.5px] text-slate-500 mt-1 leading-snug">Calculate LGS, LGS (CaCO3), HGS, ASGS &</p>
                        </div>
                      </button>
                    </div>
                  </>
                ) : (
                  /* INDIVIDUAL INTERACTIVE FLUID MODULE SCREEN (When clicked) */
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                      <button 
                        onClick={() => setActiveFluidCalc(null)}
                        className="text-[10px] font-bold text-[#014E80] dark:text-sky-400 hover:underline flex items-center gap-1.5"
                      >
                        ← Back to Modules
                      </button>
                      <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500">
                        {activeFluidCalc === "rheology" && "Rheology Lab"}
                        {activeFluidCalc === "hydraulics" && "Hydraulics & ECD"}
                        {activeFluidCalc === "mixing" && "Mixing & Weight"}
                        {activeFluidCalc === "pit" && "Pit Volumetrics"}
                        {activeFluidCalc === "salt" && "Salt & Brines"}
                        {activeFluidCalc === "converter" && "Field Converter"}
                        {activeFluidCalc === "contamination" && "Contamination diagnostics"}
                        {activeFluidCalc === "solids" && "Solids Analysis"}
                      </span>
                    </div>

                    {/* RHEOLOGY LAB ACTIVE CALCULATOR */}
                    {activeFluidCalc === "rheology" && (
                      <div className="space-y-3.5">
                        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl space-y-1">
                          <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider block">Bingham Plastic model</span>
                          <p className="text-[10px] text-slate-500">Computes Plastic Viscosity (PV) & Yield Point (YP) from standard Fann 35 rheometer dials.</p>
                        </div>

                        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-[10px] text-slate-500 uppercase font-mono">600 RPM Dial Reading</span>
                              <span className="font-mono text-xs font-bold text-blue-600">{rpm600}</span>
                            </div>
                            <input 
                              type="range" min="20" max="120" value={rpm600}
                              onChange={(e) => setRpm600(Number(e.target.value))}
                              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-[10px] text-slate-500 uppercase font-mono">300 RPM Dial Reading</span>
                              <span className="font-mono text-xs font-bold text-blue-600">{rpm300}</span>
                            </div>
                            <input 
                              type="range" min="10" max="60" value={rpm300}
                              onChange={(e) => setRpm300(Number(e.target.value))}
                              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-[#014E80] text-white p-3 rounded-xl shadow-sm">
                            <span className="text-[8px] text-blue-100 uppercase tracking-widest block font-semibold">Plastic Viscosity (PV)</span>
                            <span className="font-mono text-base font-bold block mt-1">{pv} <span className="text-[9px] text-blue-200">cP</span></span>
                            <span className="text-[7.5px] text-blue-200 block mt-1">Formula: θ600 - θ300</span>
                          </div>
                          <div className="bg-[#014E80] text-white p-3 rounded-xl shadow-sm">
                            <span className="text-[8px] text-blue-100 uppercase tracking-widest block font-semibold">Yield Point (YP)</span>
                            <span className="font-mono text-base font-bold block mt-1">{yp} <span className="text-[8px] text-blue-200">lb/100ft²</span></span>
                            <span className="text-[7.5px] text-blue-200 block mt-1">Formula: θ300 - PV</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* HYDRAULICS AND ECD ACTIVE CALCULATOR */}
                    {activeFluidCalc === "hydraulics" && (
                      <div className="space-y-3.5">
                        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl">
                          <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider block font-semibold">TFA & Jet Velocity</span>
                          <p className="text-[10px] text-slate-500 mt-1">Configure nozzle layout to determine total jet area and fluid impact forces.</p>
                        </div>

                        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-slate-500 font-bold">Number of Nozzles</span>
                            <div className="flex gap-1">
                              {[2, 3, 4, 5].map((num) => (
                                <button
                                  key={num}
                                  onClick={() => setNozzlesCount(num)}
                                  className={`w-5 h-5 rounded text-[9px] font-bold ${
                                    nozzlesCount === num ? "bg-[#014E80] text-white" : "bg-slate-100 text-slate-700"
                                  }`}
                                >
                                  {num}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-[10px] text-slate-500 uppercase font-mono">Nozzle Size (32nds)</span>
                              <span className="font-mono text-xs font-bold text-[#014E80]">{nozzleSize}/32"</span>
                            </div>
                            <input 
                              type="range" min="8" max="22" value={nozzleSize}
                              onChange={(e) => setNozzleSize(Number(e.target.value))}
                              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                          </div>
                        </div>

                        <div className="bg-[#EBF5EE] border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[8px] text-emerald-700 font-bold uppercase tracking-wide">Total Flow Area (TFA)</span>
                            <span className="text-sm font-black font-mono text-emerald-800 block mt-1">{tfa.toFixed(4)} <span className="text-[9px] text-emerald-600">in²</span></span>
                          </div>
                          <Zap className="w-5 h-5 text-emerald-600 animate-pulse" />
                        </div>
                      </div>
                    )}

                    {/* MIXING AND WEIGHT ACTIVE CALCULATOR */}
                    {activeFluidCalc === "mixing" && (
                      <div className="space-y-3">
                        <div className="bg-white dark:bg-slate-950 border border-slate-200 p-3 rounded-2xl">
                          <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider block font-semibold">Mixing & Material Weight up</span>
                          <p className="text-[10px] text-slate-500 mt-0.5">Calculate bulk sacks of Barite (4.2 SG) needed to raise current mud density.</p>
                        </div>

                        <div className="bg-white dark:bg-slate-950 border border-slate-200 p-3 rounded-2xl space-y-3 text-[10px]">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="font-bold text-[9px] text-slate-500">MUD VOLUME</span>
                              <span className="font-mono font-bold text-slate-700">{mixingVolume} {volumeUnit}</span>
                            </div>
                            <input 
                              type="range" min="50" max="1000" step="50" value={mixingVolume}
                              onChange={(e) => setMixingVolume(Number(e.target.value))}
                              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="font-bold text-[9px] text-slate-500">INITIAL WEIGHT (W1)</span>
                              <span className="font-mono font-bold text-slate-700">{mixingInitialMW.toFixed(2)} {mudWeightUnit}</span>
                            </div>
                            <input 
                              type="range" min="1.0" max="2.0" step="0.05" value={mixingInitialMW}
                              onChange={(e) => setMixingInitialMW(Number(e.target.value))}
                              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="font-bold text-[9px] text-slate-500">TARGET WEIGHT (W2)</span>
                              <span className="font-mono font-bold text-[#014E80]">{mixingTargetMW.toFixed(2)} {mudWeightUnit}</span>
                            </div>
                            <input 
                              type="range" min="1.1" max="2.2" step="0.05" value={mixingTargetMW}
                              onChange={(e) => setMixingTargetMW(Number(e.target.value))}
                              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                          </div>
                        </div>

                        {/* Result card */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] leading-relaxed">
                          <span className="font-bold text-amber-800 uppercase text-[8px] tracking-wider block">Calculated Barite addition</span>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-slate-600 font-medium">Sacks of Barite (100 lb):</span>
                            <span className="font-mono font-black text-amber-700 text-sm">
                              {Math.max(0, Math.round((1470 * (mixingTargetMW - mixingInitialMW) * mixingVolume) / (100 * (35 - mixingTargetMW))))} sks
                            </span>
                          </div>
                          <div className="text-[9px] text-slate-500 mt-1">
                            Approx. Volume Increase: <span className="font-bold text-slate-700 font-mono">+{Math.max(0, parseFloat((((1470 * (mixingTargetMW - mixingInitialMW) * mixingVolume) / (100 * (35 - mixingTargetMW))) * 0.068).toFixed(1)))} {volumeUnit}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* FIELD CONVERTER ACTIVE CALCULATOR */}
                    {activeFluidCalc === "converter" && (
                      <div className="space-y-3.5 text-xs font-mono">
                        <div className="bg-white dark:bg-slate-950 border border-slate-200 p-3 rounded-2xl">
                          <span className="text-[9px] font-bold text-purple-600 uppercase tracking-wider block font-semibold font-sans">Quick Density Conversions</span>
                          <p className="text-[10px] text-slate-500 font-sans mt-0.5">Enter value in SG (g/cm³) to instantly convert to PPG and PCF:</p>
                        </div>

                        <div className="bg-white dark:bg-slate-950 border border-slate-200 p-3.5 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 text-[10px] font-bold font-sans uppercase">Value in SG (g/cm³):</span>
                            <input 
                              type="number" step="0.05" value={mixingInitialMW}
                              onChange={(e) => setMixingInitialMW(Number(e.target.value))}
                              className="w-20 border border-slate-200 rounded-lg p-1 text-center font-bold font-mono text-[#014E80] text-xs bg-slate-50"
                            />
                          </div>

                          <div className="border-t border-slate-100 my-2"></div>

                          <div className="grid grid-cols-2 gap-2 text-center text-xs">
                            <div className="bg-purple-50 rounded-xl p-2.5 border border-purple-100">
                              <span className="text-purple-700 text-[8px] font-sans font-bold block uppercase tracking-wide">Pounds Per Gallon (PPG)</span>
                              <span className="font-bold text-purple-900 block mt-1 text-sm">{(mixingInitialMW / 0.1198).toFixed(2)} ppg</span>
                            </div>
                            <div className="bg-purple-50 rounded-xl p-2.5 border border-purple-100">
                              <span className="text-purple-700 text-[8px] font-sans font-bold block uppercase tracking-wide">Pounds / Cubic Foot (PCF)</span>
                              <span className="font-bold text-purple-900 block mt-1 text-sm">{(mixingInitialMW * 62.43).toFixed(1)} pcf</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* FALLBACK INFO FOR OTHERS */}
                    {["pit", "salt", "contamination", "solids"].includes(activeFluidCalc) && (
                      <div className="p-4 bg-white dark:bg-slate-950 border border-slate-200 rounded-2xl text-center space-y-2.5 font-sans">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                          <Info className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-xs">Simulated Calculator Module</div>
                          <p className="text-[10px] text-slate-500 leading-relaxed mt-1">
                            This calculator is fully functional in the downloaded Android App! Configure settings, load casing, or edit the well profile to see live mathematical updates on the rig floor.
                          </p>
                        </div>
                        <button 
                          onClick={() => setActiveFluidCalc(null)}
                          className="bg-[#014E80] text-white px-4 py-1.5 rounded-lg text-[10px] font-bold"
                        >
                          Understood
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: WELL CAPACITY (Screenshots 4, 5, 8) */}
            {activeTab === "wellCapacity" && (
              <div className="animate-fadeIn space-y-3.5">
                {/* Horizontal Navigation Pills */}
                <div className="bg-slate-200/60 dark:bg-slate-900 p-1 rounded-xl flex shadow-inner">
                  {[
                    { id: "geometry", label: "Well Geometry" },
                    { id: "volumes", label: "Volumes & Cycle" },
                    { id: "capacity", label: "Capacity Tool" }
                  ].map((subTab) => (
                    <button
                      key={subTab.id}
                      onClick={() => setWellCapacityTab(subTab.id as any)}
                      className={`flex-1 py-1 px-1.5 rounded-lg text-[9px] font-bold tracking-wide uppercase transition-all ${
                        wellCapacityTab === subTab.id 
                          ? "bg-[#014E80] text-white shadow-sm" 
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
                      }`}
                    >
                      {subTab.label}
                    </button>
                  ))}
                </div>

                {/* Sub-tab: Well Geometry (Screenshot 8) */}
                {wellCapacityTab === "geometry" && (
                  <div className="space-y-3 animate-fadeIn">
                    <h4 className="font-extrabold text-[11px] text-[#014E80] uppercase tracking-wide">Wellbore Geometry Profile</h4>
                    
                    {/* Simplified wellbore visual representation */}
                    <div className="bg-white p-3 rounded-2xl border border-slate-200/80 flex gap-3 items-stretch relative min-h-[160px] shadow-sm">
                      {/* Diagram SVG */}
                      <div className="w-1/3 flex items-center justify-center border-r border-slate-100 pr-2">
                        <svg viewBox="0 0 80 180" className="w-full h-auto overflow-visible select-none">
                          <rect x="25" y="10" width="30" height="150" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
                          <polygon points="25,120 20,125 25,125" fill="#64748B" />
                          <polygon points="55,120 60,125 55,125" fill="#64748B" />
                          <line x1="20" y1="125" x2="20" y2="10" stroke="#94A3B8" strokeWidth="0.5" strokeDasharray="1,1" />
                          <line x1="60" y1="125" x2="60" y2="10" stroke="#94A3B8" strokeWidth="0.5" strokeDasharray="1,1" />
                          <rect x="36" y="10" width="8" height="145" fill="#3B82F6" stroke="#475569" strokeWidth="0.5" />
                        </svg>
                      </div>

                      {/* Well Legend details */}
                      <div className="w-2/3 space-y-2 text-[9px] text-slate-600 self-center leading-normal">
                        <div>
                          <b className="text-slate-800 font-bold block mb-0.5">📐 Casing & Hole</b>
                          <div className="flex justify-between">
                            <span>Casing Shoe:</span>
                            <span className="font-mono font-semibold">3,000 m</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Depth (TD):</span>
                            <span className="font-mono font-semibold">3,600 m</span>
                          </div>
                        </div>

                        <div className="border-t border-slate-100 my-1"></div>

                        <div>
                          <b className="text-slate-800 font-bold block mb-0.5">⚙️ Drill String / BHA</b>
                          <div className="flex justify-between">
                            <span>Drill Pipe 1:</span>
                            <span className="font-mono font-semibold">0 - 3,234 m</span>
                          </div>
                          <div className="flex justify-between">
                            <span>HWDP:</span>
                            <span className="font-mono font-semibold">3,234 - 3,509 m</span>
                          </div>
                          <div className="flex justify-between">
                            <span>BHA / Collars:</span>
                            <span className="font-mono font-semibold">3,509 - 3,600 m</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Casing detail parameters */}
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 space-y-2.5">
                      <span className="text-[9px] font-bold text-[#014E80] uppercase tracking-wider block">1. Wellbore Outer Sections</span>
                      <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold text-slate-800">
                        <div className="p-2 bg-slate-100 rounded-xl border border-slate-200 text-[10px]">OD: 9-5/8"</div>
                        <div className="p-2 bg-slate-100 rounded-xl border border-slate-200 text-[10px]">36.0 lb/ft</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl">
                          <span className="text-[7.5px] text-slate-400 block uppercase font-bold tracking-wide">Casing ID</span>
                          <span className="font-mono font-extrabold text-xs block text-[#014E80] mt-0.5">8.921 inch</span>
                        </div>
                        <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl">
                          <span className="text-[7.5px] text-slate-400 block uppercase font-bold tracking-wide">Casing Shoe</span>
                          <span className="font-mono font-extrabold text-xs block text-slate-800 mt-0.5">3000 m</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-tab: Volumes & Cycle (Screenshot 4) */}
                {wellCapacityTab === "volumes" && (
                  <div className="space-y-3.5 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-200/50 pb-1.5">
                      <h4 className="font-extrabold text-[11px] text-[#014E80] uppercase tracking-wide">Calculation Source</h4>
                      <div className="flex gap-1.5 bg-slate-200 p-0.5 rounded-lg text-[9px] font-bold">
                        {["Well Profile", "Manual"].map((src) => (
                          <button
                            key={src}
                            onClick={() => setGeometrySource(src as any)}
                            className={`px-2.5 py-0.5 rounded-md ${
                              geometrySource === src ? "bg-white text-[#014E80] shadow-sm" : "text-slate-500"
                            }`}
                          >
                            {src}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mud Pump Settings */}
                    <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl space-y-2.5 shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-[#014E80] dark:text-sky-400 text-[10.5px]">Mud Pump Settings</span>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className="text-slate-400">Calculate</span>
                          <button 
                            onClick={() => setMudPumpCalculate(!mudPumpCalculate)}
                            className={`w-9 h-5 rounded-full transition-colors flex items-center p-0.5 ${
                              mudPumpCalculate ? "bg-blue-600 justify-end" : "bg-slate-300 justify-start"
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full bg-white shadow-sm"></span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-slate-50 border border-slate-200/80 rounded-xl relative">
                          <span className="text-[7.5px] text-slate-500 font-bold block uppercase tracking-wider">Pump Output</span>
                          <div className="font-bold text-xs mt-1 font-mono text-slate-800">24.0</div>
                          <span className="absolute right-2.5 bottom-2 bg-[#EBF1F6] text-[#014E80] text-[8px] font-mono font-black px-1 py-0.5 rounded uppercase">L/stk</span>
                        </div>

                        <div className="p-2 bg-slate-50 border border-slate-200/80 rounded-xl relative">
                          <span className="text-[7.5px] text-slate-500 font-bold block uppercase tracking-wider">Pump Speed</span>
                          <div className="font-bold text-xs mt-1 font-mono text-slate-800">80</div>
                          <span className="absolute right-2.5 bottom-2 bg-[#EBF1F6] text-[#014E80] text-[8px] font-mono font-black px-1 py-0.5 rounded uppercase">SPM</span>
                        </div>
                      </div>
                    </div>

                    {/* Volumetric summaries */}
                    <div className="space-y-2.5">
                      <h4 className="font-bold text-[10.5px] text-slate-600 uppercase tracking-widest block font-sans">Well Volumetric Summary</h4>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                          <span className="text-[7.5px] text-slate-400 font-sans block uppercase font-bold tracking-wide">String Vol</span>
                          <span className="font-black text-xs block text-[#014E80] mt-1">31.8</span>
                          <span className="text-[8px] text-slate-400 font-bold">{volumeUnit}</span>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                          <span className="text-[7.5px] text-slate-400 font-sans block uppercase font-bold tracking-wide">String Metal Disp</span>
                          <span className="font-black text-xs block text-slate-800 mt-1">14.6</span>
                          <span className="text-[8px] text-slate-400 font-bold">{volumeUnit}</span>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                          <span className="text-[7.5px] text-slate-400 font-sans block uppercase font-bold tracking-wide">Annular Vol</span>
                          <span className="font-black text-xs block text-slate-800 mt-1">96.5</span>
                          <span className="text-[8px] text-slate-400 font-bold">{volumeUnit}</span>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                          <span className="text-[7.5px] text-slate-400 font-sans block uppercase font-bold tracking-wide">Total Mud (String In)</span>
                          <span className="font-black text-xs block text-[#F27A23] mt-1">128.3</span>
                          <span className="text-[8px] text-slate-400 font-bold">{volumeUnit}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-tab: Capacity Tool (Screenshot 5) */}
                {wellCapacityTab === "capacity" && (
                  <div className="space-y-3.5 animate-fadeIn text-[10px]">
                    <h4 className="font-extrabold text-[11px] text-[#014E80] uppercase tracking-wide">Tubular Capacity Tool</h4>
                    
                    {/* Outer element card */}
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
                      <span className="font-bold text-slate-600 block uppercase tracking-wide text-[8.5px]">Outer Element / Container</span>
                      
                      <div className="grid grid-cols-3 gap-1 bg-slate-100 p-0.5 rounded-lg text-center font-bold text-[8.5px]">
                        {["Casing", "Liner", "Open Hole"].map((elem, i) => (
                          <span key={elem} className={`py-1 rounded ${i === 0 ? "bg-white text-[#014E80]" : "text-slate-400"}`}>{elem}</span>
                        ))}
                      </div>

                      {/* Spec selection dropdown mockup */}
                      <div className="p-2 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between text-[10px] font-mono">
                        <span>20" 94.0 lb/ft J-55/K-55</span>
                        <span className="text-[8.5px] text-slate-400 font-sans">▼</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 font-mono">
                        <div className="p-2 bg-slate-50 border border-slate-150 rounded-xl">
                          <span className="text-[7.5px] text-slate-400 block font-sans uppercase">Outer OD</span>
                          <span className="font-bold text-[11px] text-slate-800">20.00 inch</span>
                        </div>
                        <div className="p-2 bg-slate-50 border border-slate-150 rounded-xl">
                          <span className="text-[7.5px] text-slate-400 block font-sans uppercase">Outer ID</span>
                          <span className="font-bold text-[11px] text-[#014E80]">19.12 inch</span>
                        </div>
                      </div>
                    </div>

                    {/* Inner element card */}
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
                      <span className="font-bold text-slate-600 block uppercase tracking-wide text-[8.5px]">Inner Element / String</span>
                      
                      <div className="grid grid-cols-4 gap-1 bg-slate-100 p-0.5 rounded-lg text-center font-bold text-[8.5px]">
                        {["DP", "HWDP", "DC", "Tubing"].map((elem, i) => (
                          <span key={elem} className={`py-1 rounded ${i === 0 ? "bg-white text-[#014E80]" : "text-slate-400"}`}>{elem}</span>
                        ))}
                      </div>

                      {/* Spec dropdown mockup */}
                      <div className="p-2 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between text-[10px] font-mono">
                        <span>5-1/2" 21.9 lb/ft Grade S-135</span>
                        <span className="text-[8.5px] text-slate-400 font-sans">▼</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SPECIALIZED (Screenshots 6, 7) */}
            {activeTab === "specialized" && (
              <div className="animate-fadeIn space-y-3.5">
                {/* Tabs */}
                <div className="bg-slate-200/60 p-1 rounded-xl flex shadow-inner">
                  {[
                    { id: "plug", label: "Balanced Plug" },
                    { id: "slug", label: "Heavy Pill / Slug" }
                  ].map((subTab) => (
                    <button
                      key={subTab.id}
                      onClick={() => setSpecializedTab(subTab.id as any)}
                      className={`flex-1 py-1 px-1.5 rounded-lg text-[9.5px] font-bold tracking-wide uppercase transition-all ${
                        specializedTab === subTab.id 
                          ? "bg-[#014E80] text-white shadow-sm" 
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {subTab.label}
                    </button>
                  ))}
                </div>

                {/* Sub-tab: Balanced Plug (Screenshot 6) */}
                {specializedTab === "plug" && (
                  <div className="space-y-3 animate-fadeIn text-[10px]">
                    <h4 className="font-extrabold text-[11px] text-[#014E80] uppercase tracking-wide">Balanced Plug spotted in Wellbore</h4>
                    
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 text-[9px] font-bold">
                      <span className="text-slate-500">Geometry Source:</span>
                      <div className="flex gap-1 bg-slate-100 p-0.5 rounded">
                        {["Well Profile", "Manual"].map((s) => (
                          <span key={s} className={`px-2 py-0.5 rounded ${s === "Well Profile" ? "bg-white text-[#014E80]" : "text-slate-400"}`}>{s}</span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-slate-200/80 space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-[8.5px] text-slate-500 uppercase">Bottom Depth of Plug</span>
                          <span className="font-mono font-bold text-slate-800">{plugBottomDepth} m</span>
                        </div>
                        <input 
                          type="range" min="3000" max="12000" step="100" value={plugBottomDepth}
                          onChange={(e) => setPlugBottomDepth(Number(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-[8.5px] text-slate-500 uppercase">Desired Plug Height</span>
                          <span className="font-mono font-bold text-slate-800">{plugDesiredHeight} m</span>
                        </div>
                        <input 
                          type="range" min="100" max="1000" step="50" value={plugDesiredHeight}
                          onChange={(e) => setPlugDesiredHeight(Number(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>
                    </div>

                    {/* Resolved dimensions banner */}
                    <div className="p-2 bg-blue-50/70 border border-blue-100 rounded-xl leading-normal text-slate-600 text-[8.5px]">
                      <b className="text-blue-800 block">Resolved Profile Dimensions at TD :</b>
                      <span>Hole ID: 8.500 inch | Drill String OD: 6.500 inch | ID: 2.813 inch</span>
                    </div>

                    {/* Spacer input */}
                    <div className="bg-white p-3 rounded-2xl border border-slate-200/80 space-y-1">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-[8.5px] text-slate-500 uppercase">Spacer Ahead Vol</span>
                        <span className="font-mono font-bold text-slate-800">{spacerAheadVolume} m³</span>
                      </div>
                      <input 
                        type="range" min="5" max="50" step="1" value={spacerAheadVolume}
                        onChange={(e) => setSpacerAheadVolume(Number(e.target.value))}
                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>
                )}

                {/* Sub-tab: Heavy Pill / Slug (Screenshot 7) */}
                {specializedTab === "slug" && (
                  <div className="space-y-3 animate-fadeIn text-[10px]">
                    <h4 className="font-extrabold text-[11px] text-[#014E80] uppercase tracking-wide">Heavy Pill / Slug Calculations</h4>
                    
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 text-[9px] font-bold">
                      <span className="text-slate-500">Geometry Source:</span>
                      <div className="flex gap-1 bg-slate-100 p-0.5 rounded">
                        {["Well Profile", "Manual"].map((s) => (
                          <span key={s} className={`px-2 py-0.5 rounded ${s === "Well Profile" ? "bg-white text-[#014E80]" : "text-slate-400"}`}>{s}</span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-slate-200/80 space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-[8.5px] text-slate-500 uppercase font-sans">Desired Dry Pipe Length</span>
                          <span className="font-mono font-bold text-slate-800">{dryPipeLength} m</span>
                        </div>
                        <input 
                          type="range" min="50" max="600" step="10" value={dryPipeLength}
                          onChange={(e) => setDryPipeLength(Number(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-[8.5px] text-slate-500 uppercase font-sans">Current Mud Weight</span>
                          <span className="font-mono font-bold text-slate-800">{slugCurrentMW.toFixed(1)} SG</span>
                        </div>
                        <input 
                          type="range" min="8.0" max="16.0" step="0.1" value={slugCurrentMW}
                          onChange={(e) => setSlugCurrentMW(Number(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-[8.5px] text-slate-500 uppercase font-sans">Heavy Pill/Slug Weight</span>
                          <span className="font-mono font-bold text-[#014E80]">{slugPillMW.toFixed(1)} SG</span>
                        </div>
                        <input 
                          type="range" min="9.0" max="18.0" step="0.1" value={slugPillMW}
                          onChange={(e) => setSlugPillMW(Number(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>
                    </div>

                    <div className="p-2.5 bg-[#EBF1F6] border border-slate-200 rounded-xl leading-normal text-[8.5px] text-slate-600">
                      <b className="text-[#014E80] block font-bold">Resolved Drill Pipe (Profile) :</b>
                      <span>Drill Pipe ID: 4.276 inch</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: KILL SHEET (Screenshots 3, 11, 10) */}
            {activeTab === "killSheet" && (
              <div className="animate-fadeIn space-y-3.5 text-[10px]">
                
                {/* Well Control Header & Exports */}
                <div className="bg-[#ECEFF3] border border-slate-200 rounded-2xl p-3 flex justify-between items-center shadow-sm relative overflow-hidden">
                  <div>
                    <h4 className="font-extrabold text-[11px] text-[#014E80] block font-sans">Well Control Kill Sheet</h4>
                    <span className="text-[8.5px] text-slate-500 block mt-0.5 leading-snug">Wait & Weight method calculation suite</span>
                  </div>
                  {/* PDF / Excel triggers */}
                  <div className="flex gap-1.5 shrink-0">
                    <button className="bg-[#F27A23] hover:bg-orange-600 text-white font-extrabold px-2 py-1 rounded-lg text-[8px] flex items-center gap-1 cursor-pointer">
                      <Share2 className="w-2.5 h-2.5" />
                      <span>PDF</span>
                    </button>
                    <button className="bg-[#107C41] hover:bg-emerald-700 text-white font-extrabold px-2 py-1 rounded-lg text-[8px] flex items-center gap-1 cursor-pointer">
                      <FileSpreadsheet className="w-2.5 h-2.5" />
                      <span>EXCEL</span>
                    </button>
                  </div>
                </div>

                {/* Sub-tab switcher */}
                <div className="bg-slate-200/60 p-1 rounded-xl flex shadow-inner">
                  {[
                    { id: "kick", label: "Well & Kick Data" },
                    { id: "plan", label: "Circulating Plan" }
                  ].map((subTab) => (
                    <button
                      key={subTab.id}
                      onClick={() => setKillSheetTab(subTab.id as any)}
                      className={`flex-1 py-1 px-1.5 rounded-lg text-[9px] font-bold tracking-wide uppercase transition-all ${
                        killSheetTab === subTab.id 
                          ? "bg-[#014E80] text-white shadow-sm" 
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {subTab.label}
                    </button>
                  ))}
                </div>

                {/* Kill Method Selection (Screenshot 3) */}
                <div className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-200/80">
                  <span className="text-[7.5px] font-bold text-slate-400 block uppercase tracking-wider">Well Control Method Selection</span>
                  <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-0.5 rounded-lg font-bold text-[8.5px] text-center">
                    {["Wait & Weight", "Driller's Method"].map((m) => (
                      <button
                        key={m}
                        onClick={() => setKillMethod(m as any)}
                        className={`py-1 rounded ${killMethod === m ? "bg-white text-[#014E80] shadow-sm" : "text-slate-400"}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Targets Section */}
                <div className="space-y-2">
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block font-sans">Well Control & Fluid Targets</span>
                  
                  {/* Kill Mud Weight (Screenshot 3) */}
                  <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between relative shadow-sm">
                    <div>
                      <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wide">Kill Mud Weight (KMW)</span>
                      <div className="font-mono font-black text-slate-800 text-lg mt-0.5">
                        {kmwDisplay} <span className="text-[10px] text-slate-500 font-bold uppercase">{mudWeightUnit}</span>
                      </div>
                    </div>
                    <span className="bg-[#FBE9E0] text-[#E07A25] text-[9px] font-black font-mono px-1.5 py-0.5 rounded">+0.10 SG</span>
                  </div>

                  {/* ICP & FCP row */}
                  <div className="grid grid-cols-2 gap-2 text-center font-mono">
                    <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-sm">
                      <span className="text-[7px] text-slate-400 font-sans block uppercase font-bold tracking-wide">Initial Circulating Pressure</span>
                      <div className="font-black text-slate-800 mt-1 text-sm">900</div>
                      <span className="text-[8px] text-slate-400 font-bold uppercase">{pressureUnit}</span>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-sm">
                      <span className="text-[7px] text-slate-400 font-sans block uppercase font-bold tracking-wide">Final Circulating Pressure</span>
                      <div className="font-black text-[#014E80] mt-1 text-sm">425</div>
                      <span className="text-[8px] text-slate-400 font-bold uppercase">{pressureUnit}</span>
                    </div>
                  </div>
                </div>

                {/* Sub-tab view: Pre-recorded kick parameters (Screenshot 11) */}
                {killSheetTab === "kick" && (
                  <div className="space-y-3 animate-fadeIn text-[10px]">
                    <h5 className="font-bold text-slate-600 uppercase tracking-widest block text-[8px] font-sans">Pre-Recorded Well Data</h5>
                    <div className="grid grid-cols-2 gap-2 font-mono">
                      <div className="bg-white border border-slate-200 p-2.5 rounded-xl shadow-sm relative">
                        <span className="text-[7px] text-slate-400 font-sans block uppercase font-bold tracking-wider">Original Mud Weight</span>
                        <div className="font-extrabold text-xs block text-slate-800 mt-1">{originalMudWeight.toFixed(2)}</div>
                        <span className="absolute right-2 bottom-2 bg-[#EBF1F6] text-[#014E80] text-[7.5px] font-black font-mono px-1 py-0.5 rounded uppercase">SG</span>
                      </div>

                      <div className="bg-white border border-slate-200 p-2.5 rounded-xl shadow-sm relative">
                        <span className="text-[7px] text-slate-400 font-sans block uppercase font-bold tracking-wider">True Vertical Depth (TVD)</span>
                        <div className="font-extrabold text-xs block text-slate-800 mt-1">{tvd}</div>
                        <span className="absolute right-2 bottom-2 bg-[#EBF1F6] text-[#014E80] text-[7.5px] font-black font-mono px-1 py-0.5 rounded uppercase">m</span>
                      </div>
                    </div>

                    <h5 className="font-bold text-slate-600 uppercase tracking-widest block text-[8px] font-sans">Formation Strength & MAASP Data</h5>
                    <div className="bg-white border border-slate-200 rounded-2xl p-3 space-y-3">
                      <div className="relative font-mono">
                        <span className="text-[7px] text-slate-400 font-sans block uppercase font-bold tracking-wider">Casing Shoe TVD</span>
                        <div className="font-extrabold text-xs block text-slate-800 mt-1">{casingShoeTvd}</div>
                        <span className="absolute right-0 bottom-1 bg-[#EBF1F6] text-[#014E80] text-[7.5px] font-black font-mono px-1 py-0.5 rounded uppercase">m</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                        <div className="relative">
                          <span className="text-[7px] text-slate-400 font-sans block uppercase font-bold tracking-wide">Leak-Off Pressure (A)</span>
                          <div className="font-extrabold text-xs block text-slate-800 mt-1">{leakOffPressure}</div>
                          <span className="absolute right-0 bottom-1 bg-[#EBF1F6] text-[#014E80] text-[7.5px] font-black font-mono px-1 py-0.5 rounded uppercase">psi</span>
                        </div>
                        <div className="relative">
                          <span className="text-[7px] text-slate-400 font-sans block uppercase font-bold tracking-wide">Mud Weight at Test (B)</span>
                          <div className="font-extrabold text-xs block text-slate-800 mt-1">{mudWeightAtTest.toFixed(2)}</div>
                          <span className="absolute right-0 bottom-1 bg-[#EBF1F6] text-[#014E80] text-[7.5px] font-black font-mono px-1 py-0.5 rounded uppercase font-bold">SG</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-tab view: Circulating plan schedule draw downs */}
                {killSheetTab === "plan" && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2 animate-fadeIn">
                    <span className="font-bold text-slate-700 uppercase block text-[8px] tracking-wider">Dynamic Pump Drawdown Plan</span>
                    <table className="w-full text-left font-mono text-[8px] leading-tight">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 text-[7px] uppercase tracking-wider font-sans">
                          <th className="py-1">Strokes (stk)</th>
                          <th className="py-1">Circulating Pres.</th>
                          <th className="py-1 text-right">Fluid Density</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-slate-700">
                        <tr><td className="py-1 font-bold">0 (Initial)</td><td className="py-1 text-red-600 font-bold">900 psi</td><td className="py-1 text-right">1.55 SG</td></tr>
                        <tr><td className="py-1">200</td><td className="py-1">810 psi</td><td className="py-1 text-right">1.57 SG</td></tr>
                        <tr><td className="py-1">400</td><td className="py-1">720 psi</td><td className="py-1 text-right">1.59 SG</td></tr>
                        <tr><td className="py-1">600</td><td className="py-1">630 psi</td><td className="py-1 text-right">1.61 SG</td></tr>
                        <tr><td className="py-1">800</td><td className="py-1">540 psi</td><td className="py-1 text-right">1.63 SG</td></tr>
                        <tr><td className="py-1 font-bold">1,000 (Final)</td><td className="py-1 text-emerald-600 font-bold">425 psi</td><td className="py-1 text-right font-bold">1.65 SG</td></tr>
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            )}

          </div>
        )}
      </div>

      {/* Persistent Bottom Mobile Navigation Tab Bar (Standard capsule style matching Screenshot 3) */}
      <div className={`border-t px-2 py-2 flex justify-around items-center z-30 rounded-b-[40px] transition-all ${
        darkMode ? "bg-[#060b13] border-slate-800" : "bg-white border-slate-100"
      }`}>
        {/* Tab 1: Fluids */}
        <button 
          onClick={() => { setActiveTab("fluids"); setSettingsOpen(false); }} 
          className="flex flex-col items-center gap-1 flex-1 relative"
        >
          <div className={`px-4.5 py-1.5 rounded-full transition-all flex items-center justify-center ${
            activeTab === "fluids" && !settingsOpen
              ? "bg-[#014E80]/15 text-[#014E80] dark:bg-sky-500/10 dark:text-sky-300 font-bold" 
              : "text-slate-400 hover:text-slate-600"
          }`}>
            <Droplets className="w-4.5 h-4.5" />
          </div>
          <span className={`text-[7px] uppercase tracking-wider font-extrabold font-sans mt-0.5 ${
            activeTab === "fluids" && !settingsOpen ? "text-[#014E80] dark:text-sky-300" : "text-slate-400"
          }`}>
            Fluids
          </span>
        </button>

        {/* Tab 2: Well Capacity */}
        <button 
          onClick={() => { setActiveTab("wellCapacity"); setSettingsOpen(false); }} 
          className="flex flex-col items-center gap-1 flex-1 relative"
        >
          <div className={`px-4.5 py-1.5 rounded-full transition-all flex items-center justify-center ${
            activeTab === "wellCapacity" && !settingsOpen
              ? "bg-[#014E80]/15 text-[#014E80] dark:bg-sky-500/10 dark:text-sky-300 font-bold" 
              : "text-slate-400 hover:text-slate-600"
          }`}>
            <Wrench className="w-4.5 h-4.5" />
          </div>
          <span className={`text-[7px] uppercase tracking-wider font-extrabold font-sans mt-0.5 ${
            activeTab === "wellCapacity" && !settingsOpen ? "text-[#014E80] dark:text-sky-300" : "text-slate-400"
          }`}>
            Capacity
          </span>
        </button>

        {/* Tab 3: Specialized */}
        <button 
          onClick={() => { setActiveTab("specialized"); setSettingsOpen(false); }} 
          className="flex flex-col items-center gap-1 flex-1 relative"
        >
          <div className={`px-4.5 py-1.5 rounded-full transition-all flex items-center justify-center ${
            activeTab === "specialized" && !settingsOpen
              ? "bg-[#014E80]/15 text-[#014E80] dark:bg-sky-500/10 dark:text-sky-300 font-bold" 
              : "text-slate-400 hover:text-slate-600"
          }`}>
            <Zap className="w-4.5 h-4.5" />
          </div>
          <span className={`text-[7px] uppercase tracking-wider font-extrabold font-sans mt-0.5 ${
            activeTab === "specialized" && !settingsOpen ? "text-[#014E80] dark:text-sky-300" : "text-slate-400"
          }`}>
            Specialized
          </span>
        </button>

        {/* Tab 4: Kill Sheet */}
        <button 
          onClick={() => { setActiveTab("killSheet"); setSettingsOpen(false); }} 
          className="flex flex-col items-center gap-1 flex-1 relative"
        >
          <div className={`px-4.5 py-1.5 rounded-full transition-all flex items-center justify-center ${
            activeTab === "killSheet" && !settingsOpen
              ? "bg-[#014E80]/15 text-[#014E80] dark:bg-sky-500/10 dark:text-sky-300 font-bold" 
              : "text-slate-400 hover:text-slate-600"
          }`}>
            <ShieldAlert className="w-4.5 h-4.5" />
          </div>
          <span className={`text-[7px] uppercase tracking-wider font-extrabold font-sans mt-0.5 ${
            activeTab === "killSheet" && !settingsOpen ? "text-[#014E80] dark:text-sky-300" : "text-slate-400"
          }`}>
            Kill Sheet
          </span>
        </button>
      </div>

      {/* Visual Glare Overlay Effect */}
      <div className="absolute inset-y-0 right-0 w-1/4 bg-white/[0.03] transform skew-x-12 pointer-events-none z-30"></div>
    </div>
  );
}
