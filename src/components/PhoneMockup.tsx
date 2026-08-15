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
  Info,
  ArrowUpDown,
  ClipboardList,
  Search,
  MoreVertical
} from "lucide-react";
import AppIcon from "./AppIcon";
import { APP_VERSION } from "../config";

export default function PhoneMockup() {
  // Mobile app state
  const [activeTab, setActiveTab] = useState<"fluids" | "capacity" | "advanced" | "killSheet" | "tripSheet">("fluids");
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Customization State (Screenshots 8 & 9)
  const [language, setLanguage] = useState<"English" | "Français">("English");
  const [darkMode, setDarkMode] = useState(true); // Default dark based on screenshots
  const [mudWeightUnit, setMudWeightUnit] = useState<"PPG" | "SG" | "PCF">("SG");
  const [pressureUnit, setPressureUnit] = useState<"psi" | "bar">("bar");
  const [depthUnit, setDepthUnit] = useState<"feet (ft)" | "meters (m)">("meters (m)");
  const [volumeUnit, setVolumeUnit] = useState<"bbl" | "m³" | "gal">("m³");
  const [flowRateUnit, setFlowRateUnit] = useState<"bbl/m" | "l/m" | "gal/m">("l/m");
  const [pipeUnit, setPipeUnit] = useState<"inches (inch)" | "millimeters (mm)">("inches (inch)");

  // Active Fluids Sub-Modal Selector
  const [activeFluidCalc, setActiveFluidCalc] = useState<string | null>(null);

  // Sub-tabs
  const [wellCapacityTab, setWellCapacityTab] = useState<"geometry" | "cycle" | "tubulars">("geometry");
  const [advancedTab, setAdvancedTab] = useState<"grid" | "plug" | "slug" | "lab">("grid");
  const [killSheetTab, setKillSheetTab] = useState<"kick" | "plan">("kick");
  const [tripSheetTab, setTripSheetTab] = useState<"setup" | "table">("setup");
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

  // The barite formula is defined in ppg and bbl. Convert whatever units are
  // currently selected before applying it, otherwise SG values get fed into
  // ppg constants and the result is off by more than an order of magnitude.
  const mwToPpg = (v: number) =>
    mudWeightUnit === "SG" ? v * 8.33 : mudWeightUnit === "PCF" ? v / 7.48 : v;
  const volToBbl = (v: number) =>
    volumeUnit === "m³" ? v / 0.15898 : volumeUnit === "gal" ? v / 42 : v;
  const bblToVolUnit = (v: number) =>
    volumeUnit === "m³" ? v * 0.15898 : volumeUnit === "gal" ? v * 42 : v;
  const bariteSacks = Math.max(
    0,
    (14.7 * volToBbl(mixingVolume) * (mwToPpg(mixingTargetMW) - mwToPpg(mixingInitialMW))) /
      Math.max(0.01, 35 - mwToPpg(mixingTargetMW))
  );

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
        darkMode ? "bg-[#091522] text-slate-100" : "bg-[#F3F6F9] text-slate-800"
      }`}
    >
      {/* Phone Notch / Speaker Cutout */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-36 h-4.5 bg-slate-950 rounded-full z-40 flex items-center justify-between px-4">
        <div className="w-16 h-1 bg-slate-800 rounded-full"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></div>
      </div>

      {/* Top Application Bar (Standard header for all screens) */}
      <div className="pt-6 pb-2.5 px-3 bg-[#091522] text-white flex items-center justify-between z-30 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1A2E44] flex items-center justify-center">
            <AppIcon size={20} />
          </div>
          <div>
            <div className="text-[12px] font-black tracking-widest font-sans leading-none uppercase">MUDFLOW</div>
            <div className="text-[8px] text-slate-300 font-sans font-medium uppercase mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
              Offline • Well: HMOE-01
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-xl transition-colors hover:bg-white/10">
            <Search className="w-4 h-4 text-white" />
          </button>
          <button 
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`p-1.5 rounded-xl transition-colors hover:bg-white/10 ${settingsOpen ? "bg-white/20" : ""}`}
          >
            <Settings className="w-4 h-4 text-white" />
          </button>
          <button className="p-1 rounded-xl transition-colors hover:bg-white/10">
            <MoreVertical className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Main Container / Content Body */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 relative z-10 text-xs font-sans">
        
        {/* SETTINGS / UNIT CUSTOMIZATION SCREEN (Screenshots 1 & 2) */}
        {settingsOpen ? (
          <div className="space-y-4 pb-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2">
              <h3 className="text-sm font-bold text-sky-400 flex items-center gap-1">
                <Sliders className="w-4 h-4" />
                App Settings
              </h3>
              <button 
                onClick={() => setSettingsOpen(false)}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-2.5 py-1 rounded-lg"
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
                        ? "bg-slate-700 text-sky-400 border-sky-400/50 shadow-sm" 
                        : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700/50"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Dark Mode Switch */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3 flex items-center justify-between shadow-sm">
              <div>
                <span className="font-bold text-slate-200 block text-xs">Dark Mode</span>
                <span className="text-[9px] text-slate-400">Enable dark visual layout</span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 ${
                  darkMode ? "bg-sky-500 justify-end" : "bg-slate-600 justify-start"
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
                        ? "bg-slate-700 text-sky-400 border-sky-400/50" 
                        : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700/50"
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
                        ? "bg-slate-700 text-sky-400 border-sky-400/50" 
                        : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700/50"
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
                        ? "bg-slate-700 text-sky-400 border-sky-400/50" 
                        : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700/50"
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
                        ? "bg-slate-700 text-sky-400 border-sky-400/50" 
                        : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700/50"
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
                        ? "bg-slate-700 text-sky-400 border-sky-400/50" 
                        : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700/50"
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
                        ? "bg-slate-700 text-sky-400 border-sky-400/50" 
                        : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700/50"
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>

            {/* About Mudflow Card (Screenshot 1) */}
            <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-3.5 space-y-2.5 mt-4 text-[11px] leading-relaxed">
              <div className="flex items-center gap-2.5">
                <AppIcon size={38} />
                <div>
                  <h4 className="font-extrabold text-sky-400 text-[11px] leading-tight">About Mudflow</h4>
                  <span className="text-[9px] text-slate-500 font-mono">v{APP_VERSION} (Pro)</span>
                </div>
              </div>
              <p className="text-slate-400 text-xs font-light">
                Mudflow is a comprehensive mud engineering toolkit built for professional drilling operations. Runs offline-first with rigorous field-validated calculators.
              </p>
              <div className="text-[10px] font-semibold text-slate-500 flex justify-between pt-1 border-t border-slate-700/50">
                <span>Developer</span>
                <span>By madanyes</span>
              </div>
              
              {/* WhatsApp Contact Button */}
              <a 
                href="https://wa.me/213553143304" 
                target="_blank" 
                rel="noreferrer"
                className="w-full mt-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 p-2.5 rounded-xl flex items-center justify-center gap-2 font-bold text-slate-200 text-xs shadow-sm cursor-pointer transition-all"
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
                      <h3 className="text-sm font-extrabold text-white uppercase tracking-tight">Engineering Calculations</h3>
                      <span className="text-[10px] font-bold text-slate-400 tracking-wider">8 Modules</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Rheology Lab */}
                      <button 
                        onClick={() => setActiveFluidCalc("rheology")}
                        className="bg-slate-800 border border-slate-700/60 rounded-2xl p-3 text-left hover:border-slate-500 shadow-sm transition-all flex flex-col justify-between min-h-[110px]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-700/50 border border-slate-600/50 text-sky-400 flex items-center justify-center mb-2">
                          <Compass className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] leading-tight text-white">Rheology Lab</div>
                          <p className="text-[9px] text-slate-400 mt-1 leading-snug">PV, YP, gel strength, Power Law index</p>
                        </div>
                        <div className="h-0.5 w-full bg-sky-500 mt-2 rounded-full"></div>
                      </button>

                      {/* Hydraulics & ECD */}
                      <button 
                        onClick={() => setActiveFluidCalc("hydraulics")}
                        className="bg-slate-800 border border-slate-700/60 rounded-2xl p-3 text-left hover:border-slate-500 shadow-sm transition-all flex flex-col justify-between min-h-[110px]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-700/50 border border-slate-600/50 text-emerald-400 flex items-center justify-center mb-2">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] leading-tight text-white">Hydraulics & ECD</div>
                          <p className="text-[9px] text-slate-400 mt-1 leading-snug">Annular velocity, Hydrostatic pressure,</p>
                        </div>
                        <div className="h-0.5 w-full bg-emerald-500 mt-2 rounded-full"></div>
                      </button>

                      {/* Mixing & Weight */}
                      <button 
                        onClick={() => setActiveFluidCalc("mixing")}
                        className="bg-slate-800 border border-slate-700/60 rounded-2xl p-3 text-left hover:border-slate-500 shadow-sm transition-all flex flex-col justify-between min-h-[110px]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-700/50 border border-slate-600/50 text-amber-400 flex items-center justify-center mb-2">
                          <Scale className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] leading-tight text-white">Mixing & Weight</div>
                          <p className="text-[9px] text-slate-400 mt-1 leading-snug">Fluid mixture formulas, Barite loading & mud</p>
                        </div>
                        <div className="h-0.5 w-full bg-amber-500 mt-2 rounded-full"></div>
                      </button>

                      {/* Pit Volumetrics */}
                      <button 
                        onClick={() => setActiveFluidCalc("pit")}
                        className="bg-slate-800 border border-slate-700/60 rounded-2xl p-3 text-left hover:border-slate-500 shadow-sm transition-all flex flex-col justify-between min-h-[110px]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-700/50 border border-slate-600/50 text-indigo-400 flex items-center justify-center mb-2">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] leading-tight text-white">Pit Volumetrics</div>
                          <p className="text-[9px] text-slate-400 mt-1 leading-snug">Volume tracking for rectangular pits &</p>
                        </div>
                        <div className="h-0.5 w-full bg-indigo-500 mt-2 rounded-full"></div>
                      </button>

                      {/* Salt & Brines */}
                      <button 
                        onClick={() => setActiveFluidCalc("salt")}
                        className="bg-slate-800 border border-slate-700/60 rounded-2xl p-3 text-left hover:border-slate-500 shadow-sm transition-all flex flex-col justify-between min-h-[110px]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-700/50 border border-slate-600/50 text-orange-400 flex items-center justify-center mb-2">
                          <Droplets className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] leading-tight text-white">Salt & Brines</div>
                          <p className="text-[9px] text-slate-400 mt-1 leading-snug">Salinity weight %, NaCl load, final density</p>
                        </div>
                        <div className="h-0.5 w-full bg-orange-500 mt-2 rounded-full"></div>
                      </button>

                      {/* Field Converter */}
                      <button 
                        onClick={() => setActiveFluidCalc("converter")}
                        className="bg-slate-800 border border-slate-700/60 rounded-2xl p-3 text-left hover:border-slate-500 shadow-sm transition-all flex flex-col justify-between min-h-[110px]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-700/50 border border-slate-600/50 text-purple-400 flex items-center justify-center mb-2">
                          <RefreshCw className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] leading-tight text-white">Field Converter</div>
                          <p className="text-[9px] text-slate-400 mt-1 leading-snug">Frictionless conversion for ppg, bbl, psi, yield</p>
                        </div>
                        <div className="h-0.5 w-full bg-purple-500 mt-2 rounded-full"></div>
                      </button>

                      {/* Contamination */}
                      <button 
                        onClick={() => setActiveFluidCalc("contamination")}
                        className="bg-slate-800 border border-slate-700/60 rounded-2xl p-3 text-left hover:border-slate-500 shadow-sm transition-all flex flex-col justify-between min-h-[110px]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-700/50 border border-slate-600/50 text-red-400 flex items-center justify-center mb-2">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] leading-tight text-white">Contamination WBM/OBM</div>
                          <p className="text-[9px] text-slate-400 mt-1 leading-snug">Mud contamination diagnostics and exact</p>
                        </div>
                        <div className="h-0.5 w-full bg-red-500 mt-2 rounded-full"></div>
                      </button>

                      {/* Solids Analysis */}
                      <button 
                        onClick={() => setActiveFluidCalc("solids")}
                        className="bg-slate-800 border border-slate-700/60 rounded-2xl p-3 text-left hover:border-slate-500 shadow-sm transition-all flex flex-col justify-between min-h-[110px]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-700/50 border border-slate-600/50 text-indigo-400 flex items-center justify-center mb-2">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] leading-tight text-white">Solids Analysis</div>
                          <p className="text-[9px] text-slate-400 mt-1 leading-snug">Calculate LGS, LGS (CaCO3), HGS, ASGS &</p>
                        </div>
                        <div className="h-0.5 w-full bg-indigo-500 mt-2 rounded-full"></div>
                      </button>
                    </div>
                  </>
                ) : (
                  /* INDIVIDUAL INTERACTIVE FLUID MODULE SCREEN (When clicked) */
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between border-b border-slate-700/60 border-slate-800 pb-2">
                      <button 
                        onClick={() => setActiveFluidCalc(null)}
                        className="text-[10px] font-bold text-sky-400 hover:underline flex items-center gap-1.5"
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
                        <div className="bg-slate-800 border border-slate-700/60 p-3 rounded-2xl space-y-1">
                          <span className="text-[9px] font-bold text-blue-600 uppercase tracking-wider block">Bingham Plastic model</span>
                          <p className="text-[10px] text-slate-500">Computes Plastic Viscosity (PV) & Yield Point (YP) from standard Fann 35 rheometer dials.</p>
                        </div>

                        <div className="bg-slate-800 border border-slate-700/60 p-3.5 rounded-2xl space-y-4">
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
                        <div className="bg-slate-800 border border-slate-700/60 p-3 rounded-2xl">
                          <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider block font-semibold">TFA & Jet Velocity</span>
                          <p className="text-[10px] text-slate-500 mt-1">Configure nozzle layout to determine total jet area and fluid impact forces.</p>
                        </div>

                        <div className="bg-slate-800 border border-slate-700/60 p-3.5 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-slate-500 font-bold">Number of Nozzles</span>
                            <div className="flex gap-1">
                              {[2, 3, 4, 5].map((num) => (
                                <button
                                  key={num}
                                  onClick={() => setNozzlesCount(num)}
                                  className={`w-5 h-5 rounded text-[9px] font-bold ${
                                    nozzlesCount === num ? "bg-slate-700 text-sky-400" : "bg-slate-900 text-slate-400"
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
                              <span className="font-mono text-xs font-bold text-sky-400">{nozzleSize}/32"</span>
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
                        <div className="bg-slate-800 border border-slate-700/60 p-3 rounded-2xl">
                          <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider block font-semibold">Mixing & Material Weight up</span>
                          <p className="text-[10px] text-slate-500 mt-0.5">Calculate bulk sacks of Barite (4.2 SG) needed to raise current mud density.</p>
                        </div>

                        <div className="bg-slate-800 border border-slate-700/60 p-3 rounded-2xl space-y-3 text-[10px]">
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
                              <span className="font-mono font-bold text-sky-400">{mixingTargetMW.toFixed(2)} {mudWeightUnit}</span>
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
                              {Math.round(bariteSacks)} sks
                            </span>
                          </div>
                          <div className="text-[9px] text-slate-500 mt-1">
                            Approx. Volume Increase: <span className="font-bold text-slate-700 font-mono">+{parseFloat(bblToVolUnit(bariteSacks / 14.7).toFixed(1))} {volumeUnit}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* FIELD CONVERTER ACTIVE CALCULATOR */}
                    {activeFluidCalc === "converter" && (
                      <div className="space-y-3.5 text-xs font-mono">
                        <div className="bg-slate-800 border border-slate-700/60 p-3 rounded-2xl">
                          <span className="text-[9px] font-bold text-purple-600 uppercase tracking-wider block font-semibold font-sans">Quick Density Conversions</span>
                          <p className="text-[10px] text-slate-500 font-sans mt-0.5">Enter value in SG (g/cm³) to instantly convert to PPG and PCF:</p>
                        </div>

                        <div className="bg-slate-800 border border-slate-700/60 p-3.5 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500 text-[10px] font-bold font-sans uppercase">Value in SG (g/cm³):</span>
                            <input 
                              type="number" step="0.05" value={mixingInitialMW}
                              onChange={(e) => setMixingInitialMW(Number(e.target.value))}
                              className="w-20 border border-slate-700/60 rounded-lg p-1 text-center font-bold font-mono text-sky-400 text-xs bg-slate-900"
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
                      <div className="p-4 bg-slate-800 border border-slate-700/60 rounded-2xl text-center space-y-2.5 font-sans">
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
            {activeTab === "capacity" && (
              <div className="animate-fadeIn space-y-3.5">
                {/* Horizontal Navigation Pills */}
                <div className="flex border-b border-slate-700/50 mb-2">
                  {[
                    { id: "geometry", label: "Geometry", icon: <Layers className="w-3.5 h-3.5 mb-1" /> },
                    { id: "cycle", label: "Cycle", icon: <RefreshCw className="w-3.5 h-3.5 mb-1" /> },
                    { id: "tubulars", label: "Tubulars", icon: <FileSpreadsheet className="w-3.5 h-3.5 mb-1" /> }
                  ].map((subTab) => (
                    <button
                      key={subTab.id}
                      onClick={() => setWellCapacityTab(subTab.id as any)}
                      className={`flex-1 py-1.5 px-1.5 text-[10px] font-bold tracking-wide transition-all flex flex-col items-center justify-center ${
                        wellCapacityTab === subTab.id 
                          ? "bg-slate-800 text-sky-400 border-b-2 border-sky-400" 
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {subTab.icon}
                        {subTab.label}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Sub-tab: Well Geometry (Screenshot 8) */}
                {wellCapacityTab === "geometry" && (
                  <div className="space-y-3 animate-fadeIn">
                    <h4 className="font-extrabold text-[12px] text-slate-200 uppercase tracking-wide">Wellbore Geometry Profile</h4>
                    
                    {/* Simplified wellbore visual representation */}
                    <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700/60 flex gap-3 items-stretch relative min-h-[160px] shadow-sm">
                      {/* Diagram SVG */}
                      <div className="w-1/3 flex items-center justify-center border-r border-slate-700 pr-2">
                        <svg viewBox="0 0 80 180" className="w-full h-auto overflow-visible select-none">
                          <rect x="25" y="10" width="30" height="150" fill="#334155" stroke="#64748B" strokeWidth="1" />
                          <polygon points="25,120 20,125 25,125" fill="#94A3B8" />
                          <polygon points="55,120 60,125 55,125" fill="#94A3B8" />
                          <line x1="20" y1="125" x2="20" y2="10" stroke="#64748B" strokeWidth="0.5" strokeDasharray="1,1" />
                          <line x1="60" y1="125" x2="60" y2="10" stroke="#64748B" strokeWidth="0.5" strokeDasharray="1,1" />
                          <rect x="36" y="10" width="8" height="145" fill="#0EA5E9" stroke="#0369A1" strokeWidth="0.5" />
                        </svg>
                      </div>

                      {/* Well Legend details */}
                      <div className="w-2/3 space-y-2 text-[9px] text-slate-400 self-center leading-normal">
                        <div>
                          <b className="text-slate-200 font-bold block mb-0.5">📐 Casing & Hole</b>
                          <div className="flex justify-between">
                            <span>Casing Shoe:</span>
                            <span className="font-mono font-semibold text-sky-400">3,000 m</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Depth (TD):</span>
                            <span className="font-mono font-semibold text-sky-400">3,600 m</span>
                          </div>
                        </div>

                        <div className="border-t border-slate-700/50 my-1"></div>

                        <div>
                          <b className="text-slate-200 font-bold block mb-0.5">⚙️ Drill String / BHA</b>
                          <div className="flex justify-between">
                            <span>Drill Pipe 1:</span>
                            <span className="font-mono font-semibold text-sky-400">0 - 3,234 m</span>
                          </div>
                          <div className="flex justify-between">
                            <span>HWDP:</span>
                            <span className="font-mono font-semibold text-sky-400">3,234 - 3,509 m</span>
                          </div>
                          <div className="flex justify-between">
                            <span>BHA / Collars:</span>
                            <span className="font-mono font-semibold text-sky-400">3,509 - 3,600 m</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Casing detail parameters */}
                    <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700/60 space-y-2.5 shadow-sm">
                      <span className="text-[9px] font-bold text-sky-400 uppercase tracking-wider block">1. Wellbore Outer Sections</span>
                      <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold text-slate-200">
                        <div className="p-2 bg-slate-900 rounded-xl border border-slate-700/50 text-[10px]">OD: 9-5/8"</div>
                        <div className="p-2 bg-slate-900 rounded-xl border border-slate-700/50 text-[10px]">36.0 lb/ft</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 bg-slate-900 border border-slate-700/50 rounded-xl">
                          <span className="text-[7.5px] text-slate-400 block uppercase font-bold tracking-wide">Casing ID</span>
                          <span className="font-mono font-extrabold text-xs block text-sky-400 mt-0.5">8.921 inch</span>
                        </div>
                        <div className="p-2.5 bg-slate-900 border border-slate-700/50 rounded-xl">
                          <span className="text-[7.5px] text-slate-400 block uppercase font-bold tracking-wide">Casing Shoe</span>
                          <span className="font-mono font-extrabold text-xs block text-slate-200 mt-0.5">3000 m</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-tab: Cycle (Screenshot 4) */}
                {wellCapacityTab === "cycle" && (
                  <div className="space-y-3.5 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-700/50 pb-1.5">
                      <h4 className="font-extrabold text-[11px] text-sky-400 uppercase tracking-wide">Calculation Source</h4>
                      <div className="flex gap-1.5 bg-slate-800 p-0.5 rounded-lg text-[9px] font-bold">
                        {["Well Profile", "Manual"].map((src) => (
                          <button
                            key={src}
                            onClick={() => setGeometrySource(src as any)}
                            className={`px-2.5 py-0.5 rounded-md ${
                              geometrySource === src ? "bg-slate-700 text-sky-400 shadow-sm" : "text-slate-500"
                            }`}
                          >
                            {src}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mud Pump Settings */}
                    <div className="bg-slate-800 border border-slate-700/60 p-3.5 rounded-2xl space-y-2.5 shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-sky-400 text-[10.5px]">Mud Pump Settings</span>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className="text-slate-400">Calculate</span>
                          <button 
                            onClick={() => setMudPumpCalculate(!mudPumpCalculate)}
                            className={`w-9 h-5 rounded-full transition-colors flex items-center p-0.5 ${
                              mudPumpCalculate ? "bg-sky-600 justify-end" : "bg-slate-600 justify-start"
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full bg-white shadow-sm"></span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-slate-900 border border-slate-700/50 rounded-xl relative">
                          <span className="text-[7.5px] text-slate-500 font-bold block uppercase tracking-wider">Pump Output</span>
                          <div className="font-bold text-xs mt-1 font-mono text-slate-200">24.0</div>
                          <span className="absolute right-2.5 bottom-2 bg-slate-800 text-sky-400 text-[8px] font-mono font-black px-1 py-0.5 rounded uppercase">L/stk</span>
                        </div>

                        <div className="p-2 bg-slate-900 border border-slate-700/50 rounded-xl relative">
                          <span className="text-[7.5px] text-slate-500 font-bold block uppercase tracking-wider">Pump Speed</span>
                          <div className="font-bold text-xs mt-1 font-mono text-slate-200">80</div>
                          <span className="absolute right-2.5 bottom-2 bg-slate-800 text-sky-400 text-[8px] font-mono font-black px-1 py-0.5 rounded uppercase">SPM</span>
                        </div>
                      </div>
                    </div>

                    {/* Volumetric summaries */}
                    <div className="space-y-2.5">
                      <h4 className="font-bold text-[10.5px] text-slate-400 uppercase tracking-widest block font-sans">Well Volumetric Summary</h4>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-3 shadow-sm">
                          <span className="text-[7.5px] text-slate-400 font-sans block uppercase font-bold tracking-wide">String Vol</span>
                          <span className="font-black text-xs block text-sky-400 mt-1">31.8</span>
                          <span className="text-[8px] text-slate-400 font-bold">{volumeUnit}</span>
                        </div>

                        <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-3 shadow-sm">
                          <span className="text-[7.5px] text-slate-400 font-sans block uppercase font-bold tracking-wide">String Metal Disp</span>
                          <span className="font-black text-xs block text-slate-200 mt-1">14.6</span>
                          <span className="text-[8px] text-slate-400 font-bold">{volumeUnit}</span>
                        </div>

                        <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-3 shadow-sm">
                          <span className="text-[7.5px] text-slate-400 font-sans block uppercase font-bold tracking-wide">Annular Vol</span>
                          <span className="font-black text-xs block text-slate-200 mt-1">96.5</span>
                          <span className="text-[8px] text-slate-400 font-bold">{volumeUnit}</span>
                        </div>

                        <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-3 shadow-sm">
                          <span className="text-[7.5px] text-slate-400 font-sans block uppercase font-bold tracking-wide">Total Mud (String In)</span>
                          <span className="font-black text-xs block text-[#F27A23] mt-1">128.3</span>
                          <span className="text-[8px] text-slate-400 font-bold">{volumeUnit}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-tab: Tubulars (Screenshot 5) */}
                {wellCapacityTab === "tubulars" && (
                  <div className="space-y-3.5 animate-fadeIn text-[10px]">
                    <h4 className="font-extrabold text-[11px] text-sky-400 uppercase tracking-wide">Tubular Capacity Tool</h4>
                    
                    {/* Outer element card */}
                    <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700/60 space-y-2.5">
                      <span className="font-bold text-slate-400 block uppercase tracking-wide text-[8.5px]">Outer Element / Container</span>
                      
                      <div className="grid grid-cols-3 gap-1 bg-slate-900 p-0.5 rounded-lg text-center font-bold text-[8.5px]">
                        {["Casing", "Liner", "Open Hole"].map((elem, i) => (
                          <span key={elem} className={`py-1 rounded ${i === 0 ? "bg-slate-700 text-sky-400" : "text-slate-500"}`}>{elem}</span>
                        ))}
                      </div>

                      {/* Spec selection dropdown mockup */}
                      <div className="p-2 border border-slate-700/50 rounded-xl bg-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-200">
                        <span>20" 94.0 lb/ft J-55/K-55</span>
                        <span className="text-[8.5px] text-slate-500 font-sans">▼</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 font-mono">
                        <div className="p-2 bg-slate-900 border border-slate-700/50 rounded-xl">
                          <span className="text-[7.5px] text-slate-500 block font-sans uppercase">Outer OD</span>
                          <span className="font-bold text-[11px] text-slate-200">20.00 inch</span>
                        </div>
                        <div className="p-2 bg-slate-900 border border-slate-700/50 rounded-xl">
                          <span className="text-[7.5px] text-slate-500 block font-sans uppercase">Outer ID</span>
                          <span className="font-bold text-[11px] text-sky-400">19.12 inch</span>
                        </div>
                      </div>
                    </div>

                    {/* Inner element card */}
                    <div className="bg-slate-800 p-3.5 rounded-2xl border border-slate-700/60 space-y-2.5">
                      <span className="font-bold text-slate-400 block uppercase tracking-wide text-[8.5px]">Inner Element / String</span>
                      
                      <div className="grid grid-cols-4 gap-1 bg-slate-900 p-0.5 rounded-lg text-center font-bold text-[8.5px]">
                        {["DP", "HWDP", "DC", "Tubing"].map((elem, i) => (
                          <span key={elem} className={`py-1 rounded ${i === 0 ? "bg-slate-700 text-sky-400" : "text-slate-500"}`}>{elem}</span>
                        ))}
                      </div>

                      {/* Spec dropdown mockup */}
                      <div className="p-2 border border-slate-700/50 rounded-xl bg-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-200">
                        <span>5-1/2" 21.9 lb/ft Grade S-135</span>
                        <span className="text-[8.5px] text-slate-500 font-sans">▼</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ADVANCED (Screenshot 2, 6, 7) */}
            {activeTab === "advanced" && (
              <div className="animate-fadeIn space-y-3.5">
                {/* Tabs */}
                <div className="flex border-b border-slate-700/50 mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
                  {[
                    { id: "grid", label: "Tools" },
                    { id: "plug", label: "Balanced Plug" },
                    { id: "slug", label: "Heavy Pill / Slug" },
                    { id: "lab", label: "Specialized Lab" }
                  ].map((subTab) => (
                    <button
                      key={subTab.id}
                      onClick={() => setAdvancedTab(subTab.id as any)}
                      className={`px-3 py-1.5 text-[10px] font-bold tracking-wide transition-all ${
                        advancedTab === subTab.id 
                          ? "bg-slate-800 text-sky-400 border-b-2 border-sky-400" 
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {subTab.label}
                    </button>
                  ))}
                </div>

                {advancedTab === "grid" && (
                  <div className="space-y-3 animate-fadeIn">
                    <h4 className="font-extrabold text-[12px] text-slate-200 tracking-tight">Advanced Engineering Tools</h4>
                    
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Cementing */}
                      <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-3 text-left hover:border-slate-500 shadow-sm transition-all flex flex-col justify-between min-h-[110px]">
                        <div className="w-7 h-7 rounded-lg bg-slate-700/50 border border-slate-600/50 text-sky-400 flex items-center justify-center mb-2">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] leading-tight text-white">Cementing<br/>Calculations</div>
                          <p className="text-[9px] text-slate-400 mt-1 leading-snug">Slurry yield, sacks, displacement volume,</p>
                        </div>
                        <div className="h-0.5 w-full bg-blue-500 mt-2 rounded-full"></div>
                      </div>

                      {/* Torque & Drag */}
                      <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-3 text-left hover:border-slate-500 shadow-sm transition-all flex flex-col justify-between min-h-[110px]">
                        <div className="w-7 h-7 rounded-lg bg-slate-700/50 border border-slate-600/50 text-orange-400 flex items-center justify-center mb-2">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] leading-tight text-white">Torque & Drag</div>
                          <p className="text-[9px] text-slate-400 mt-1 leading-snug">Estimate mechanical friction, tension,</p>
                        </div>
                        <div className="h-0.5 w-full bg-orange-500 mt-2 rounded-full"></div>
                      </div>

                      {/* Surge & Swab */}
                      <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-3 text-left hover:border-slate-500 shadow-sm transition-all flex flex-col justify-between min-h-[110px]">
                        <div className="w-7 h-7 rounded-lg bg-slate-700/50 border border-slate-600/50 text-indigo-400 flex items-center justify-center mb-2">
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] leading-tight text-white">Surge & Swab</div>
                          <p className="text-[9px] text-slate-400 mt-1 leading-snug">Tripping pressure, dynamic ESD, frac or</p>
                        </div>
                        <div className="h-0.5 w-full bg-indigo-500 mt-2 rounded-full"></div>
                      </div>
                      
                      {/* Spacer & Displ */}
                      <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-3 text-left hover:border-slate-500 shadow-sm transition-all flex flex-col justify-between min-h-[110px]">
                        <div className="w-7 h-7 rounded-lg bg-slate-700/50 border border-slate-600/50 text-emerald-400 flex items-center justify-center mb-2">
                          <RefreshCw className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] leading-tight text-white">Spacer & Displ.</div>
                          <p className="text-[9px] text-slate-400 mt-1 leading-snug">Displacement volume, pump strokes, spacer</p>
                        </div>
                        <div className="h-0.5 w-full bg-emerald-500 mt-2 rounded-full"></div>
                      </div>
                      
                      {/* Mud Templates */}
                      <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-3 text-left hover:border-slate-500 shadow-sm transition-all flex flex-col justify-between min-h-[110px]">
                        <div className="w-7 h-7 rounded-lg bg-slate-700/50 border border-slate-600/50 text-teal-400 flex items-center justify-center mb-2">
                          <FileSpreadsheet className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] leading-tight text-white">Mud Templates</div>
                          <p className="text-[9px] text-slate-400 mt-1 leading-snug">Create, store and apply custom chemical</p>
                        </div>
                        <div className="h-0.5 w-full bg-teal-500 mt-2 rounded-full"></div>
                      </div>
                      
                      {/* Operational Reports */}
                      <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-3 text-left hover:border-slate-500 shadow-sm transition-all flex flex-col justify-between min-h-[110px]">
                        <div className="w-7 h-7 rounded-lg bg-slate-700/50 border border-slate-600/50 text-orange-400 flex items-center justify-center mb-2">
                          <ClipboardList className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] leading-tight text-white">Operational Reports</div>
                          <p className="text-[9px] text-slate-400 mt-1 leading-snug">Mixing, tank cleaning & shaker change logs with</p>
                        </div>
                        <div className="h-0.5 w-full bg-orange-500 mt-2 rounded-full"></div>
                      </div>
                      
                      {/* Specialized Lab */}
                      <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-3 text-left hover:border-slate-500 shadow-sm transition-all flex flex-col justify-between min-h-[110px] col-span-1">
                        <div className="w-7 h-7 rounded-lg bg-slate-700/50 border border-slate-600/50 text-teal-500 flex items-center justify-center mb-2">
                          <Info className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] leading-tight text-white">Specialized Lab Tests</div>
                          <p className="text-[9px] text-slate-400 mt-1 leading-snug">Bilingual procedures, required equipment &</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-tab: Balanced Plug (Screenshot 6) */}
                {advancedTab === "plug" && (
                  <div className="space-y-3 animate-fadeIn text-[10px]">
                    <h4 className="font-extrabold text-[11px] text-sky-400 uppercase tracking-wide">Balanced Plug spotted in Wellbore</h4>
                    
                    <div className="flex items-center justify-between border-b border-slate-700/50 pb-1.5 text-[9px] font-bold">
                      <span className="text-slate-400">Geometry Source:</span>
                      <div className="flex gap-1 bg-slate-900 p-0.5 rounded">
                        {["Well Profile", "Manual"].map((s) => (
                          <span key={s} className={`px-2 py-0.5 rounded ${s === "Well Profile" ? "bg-slate-700 text-sky-400" : "text-slate-500"}`}>{s}</span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700/60 space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-[8.5px] text-slate-400 uppercase">Bottom Depth of Plug</span>
                          <span className="font-mono font-bold text-slate-200">{plugBottomDepth} m</span>
                        </div>
                        <input 
                          type="range" min="3000" max="12000" step="100" value={plugBottomDepth}
                          onChange={(e) => setPlugBottomDepth(Number(e.target.value))}
                          className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-[8.5px] text-slate-400 uppercase">Desired Plug Height</span>
                          <span className="font-mono font-bold text-slate-200">{plugDesiredHeight} m</span>
                        </div>
                        <input 
                          type="range" min="100" max="1000" step="50" value={plugDesiredHeight}
                          onChange={(e) => setPlugDesiredHeight(Number(e.target.value))}
                          className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                      </div>
                    </div>

                    {/* Resolved dimensions banner */}
                    <div className="p-2 bg-sky-900/40 border border-sky-800/50 rounded-xl leading-normal text-slate-300 text-[8.5px]">
                      <b className="text-sky-400 block">Resolved Profile Dimensions at TD :</b>
                      <span>Hole ID: 8.500 inch | Drill String OD: 6.500 inch | ID: 2.813 inch</span>
                    </div>

                    {/* Spacer input */}
                    <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700/60 space-y-1">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-[8.5px] text-slate-400 uppercase">Spacer Ahead Vol</span>
                        <span className="font-mono font-bold text-slate-200">{spacerAheadVolume} m³</span>
                      </div>
                      <input 
                        type="range" min="5" max="50" step="1" value={spacerAheadVolume}
                        onChange={(e) => setSpacerAheadVolume(Number(e.target.value))}
                        className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                      />
                    </div>
                  </div>
                )}

                {/* Sub-tab: Heavy Pill / Slug (Screenshot 7) */}
                {advancedTab === "slug" && (
                  <div className="space-y-3 animate-fadeIn text-[10px]">
                    <h4 className="font-extrabold text-[11px] text-sky-400 uppercase tracking-wide">Heavy Pill / Slug Calculations</h4>
                    
                    <div className="flex items-center justify-between border-b border-slate-700/50 pb-1.5 text-[9px] font-bold">
                      <span className="text-slate-400">Geometry Source:</span>
                      <div className="flex gap-1 bg-slate-900 p-0.5 rounded">
                        {["Well Profile", "Manual"].map((s) => (
                          <span key={s} className={`px-2 py-0.5 rounded ${s === "Well Profile" ? "bg-slate-700 text-sky-400" : "text-slate-500"}`}>{s}</span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700/60 space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-[8.5px] text-slate-400 uppercase font-sans">Desired Dry Pipe Length</span>
                          <span className="font-mono font-bold text-slate-200">{dryPipeLength} m</span>
                        </div>
                        <input 
                          type="range" min="50" max="600" step="10" value={dryPipeLength}
                          onChange={(e) => setDryPipeLength(Number(e.target.value))}
                          className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-[8.5px] text-slate-400 uppercase font-sans">Current Mud Weight</span>
                          <span className="font-mono font-bold text-slate-200">{slugCurrentMW.toFixed(1)} SG</span>
                        </div>
                        <input 
                          type="range" min="8.0" max="16.0" step="0.1" value={slugCurrentMW}
                          onChange={(e) => setSlugCurrentMW(Number(e.target.value))}
                          className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-[8.5px] text-slate-400 uppercase font-sans">Heavy Pill/Slug Weight</span>
                          <span className="font-mono font-bold text-sky-400">{slugPillMW.toFixed(1)} SG</span>
                        </div>
                        <input 
                          type="range" min="9.0" max="18.0" step="0.1" value={slugPillMW}
                          onChange={(e) => setSlugPillMW(Number(e.target.value))}
                          className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                        />
                      </div>
                    </div>

                    <div className="p-2.5 bg-sky-900/40 border border-sky-800/50 rounded-xl leading-normal text-[8.5px] text-slate-300">
                      <b className="text-sky-400 block font-bold">Resolved Drill Pipe (Profile) :</b>
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
                <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-3 flex justify-between items-center shadow-sm relative overflow-hidden">
                  <div>
                    <h4 className="font-extrabold text-[15px] text-sky-400 block font-sans">Well Control Kill<br/>Sheet</h4>
                    <span className="text-[9px] text-slate-400 block mt-1 leading-snug">Wait & Weight method<br/>calculation suite</span>
                  </div>
                  {/* PDF / Excel triggers */}
                  <div className="flex gap-1.5 shrink-0 self-start mt-1">
                    <button className="bg-orange-600 hover:bg-orange-500 text-white font-extrabold px-3 py-1.5 rounded-lg text-[9px] flex items-center gap-1 cursor-pointer">
                      <Share2 className="w-3 h-3" />
                      <span>PDF</span>
                    </button>
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-3 py-1.5 rounded-lg text-[9px] flex items-center gap-1 cursor-pointer">
                      <FileSpreadsheet className="w-3 h-3" />
                      <span>EXCEL</span>
                    </button>
                  </div>
                </div>

                {/* Sub-tab switcher */}
                <div className="flex border-b border-slate-700/50">
                  {[
                    { id: "kick", label: "Well & Kick Data" },
                    { id: "plan", label: "Circulating Plan" }
                  ].map((subTab) => (
                    <button
                      key={subTab.id}
                      onClick={() => setKillSheetTab(subTab.id as any)}
                      className={`flex-1 py-1.5 px-1.5 text-[11px] font-bold tracking-wide transition-all ${
                        killSheetTab === subTab.id 
                          ? "bg-slate-800 text-sky-400 border-b-2 border-sky-400" 
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {subTab.label}
                    </button>
                  ))}
                </div>

                {/* Kill Method Selection (Screenshot 3) */}
                <div className="space-y-1 bg-slate-800 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[7.5px] font-bold text-slate-500 block uppercase tracking-wider">Well Control Method Selection</span>
                  <div className="grid grid-cols-2 gap-1.5 bg-slate-900 p-0.5 rounded-lg font-bold text-[8.5px] text-center">
                    {["Wait & Weight", "Driller's Method"].map((m) => (
                      <button
                        key={m}
                        onClick={() => setKillMethod(m as any)}
                        className={`py-1 rounded ${killMethod === m ? "bg-slate-700 text-sky-400 shadow-sm" : "text-slate-500"}`}
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
                  <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-3 flex items-center justify-between relative shadow-sm">
                    <div>
                      <span className="text-[8px] text-slate-400 font-bold block uppercase tracking-wide">Kill Mud Weight (KMW)</span>
                      <div className="font-mono font-black text-slate-200 text-lg mt-0.5">
                        {kmwDisplay} <span className="text-[10px] text-slate-500 font-bold uppercase">{mudWeightUnit}</span>
                      </div>
                    </div>
                    <span className="bg-orange-900/40 border border-orange-800/50 text-orange-400 text-[9px] font-black font-mono px-1.5 py-0.5 rounded">+0.10 SG</span>
                  </div>

                  {/* ICP & FCP row */}
                  <div className="grid grid-cols-2 gap-2 text-center font-mono">
                    <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-2.5 shadow-sm">
                      <span className="text-[7px] text-slate-400 font-sans block uppercase font-bold tracking-wide">Initial Circulating Pressure</span>
                      <div className="font-black text-slate-200 mt-1 text-sm">900</div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase">{pressureUnit}</span>
                    </div>
                    <div className="bg-slate-800 border border-slate-700/60 rounded-xl p-2.5 shadow-sm">
                      <span className="text-[7px] text-slate-400 font-sans block uppercase font-bold tracking-wide">Final Circulating Pressure</span>
                      <div className="font-black text-sky-400 mt-1 text-sm">425</div>
                      <span className="text-[8px] text-slate-400 font-bold uppercase">{pressureUnit}</span>
                    </div>
                  </div>
                </div>

                {/* Sub-tab view: Pre-recorded kick parameters (Screenshot 11) */}
                {killSheetTab === "kick" && (
                  <div className="space-y-3 animate-fadeIn text-[10px]">
                    <h5 className="font-bold text-slate-400 uppercase tracking-widest block text-[8px] font-sans">Pre-Recorded Well Data</h5>
                    <div className="grid grid-cols-2 gap-2 font-mono">
                      <div className="bg-slate-800 border border-slate-700/60 p-2.5 rounded-xl shadow-sm relative">
                        <span className="text-[7px] text-slate-400 font-sans block uppercase font-bold tracking-wider">Original Mud Weight</span>
                        <div className="font-extrabold text-xs block text-slate-200 mt-1">{originalMudWeight.toFixed(2)}</div>
                        <span className="absolute right-2 bottom-2 bg-slate-900 text-sky-400 text-[7.5px] font-black font-mono px-1 py-0.5 rounded uppercase">SG</span>
                      </div>

                      <div className="bg-slate-800 border border-slate-700/60 p-2.5 rounded-xl shadow-sm relative">
                        <span className="text-[7px] text-slate-400 font-sans block uppercase font-bold tracking-wider">True Vertical Depth (TVD)</span>
                        <div className="font-extrabold text-xs block text-slate-200 mt-1">{tvd}</div>
                        <span className="absolute right-2 bottom-2 bg-slate-900 text-sky-400 text-[7.5px] font-black font-mono px-1 py-0.5 rounded uppercase">m</span>
                      </div>
                    </div>

                    <h5 className="font-bold text-slate-400 uppercase tracking-widest block text-[8px] font-sans">Formation Strength & MAASP Data</h5>
                    <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-3 space-y-3">
                      <div className="relative font-mono">
                        <span className="text-[7px] text-slate-400 font-sans block uppercase font-bold tracking-wider">Casing Shoe TVD</span>
                        <div className="font-extrabold text-xs block text-slate-200 mt-1">{casingShoeTvd}</div>
                        <span className="absolute right-0 bottom-1 bg-slate-900 text-sky-400 text-[7.5px] font-black font-mono px-1 py-0.5 rounded uppercase">m</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                        <div className="relative">
                          <span className="text-[7px] text-slate-400 font-sans block uppercase font-bold tracking-wide">Leak-Off Pressure (A)</span>
                          <div className="font-extrabold text-xs block text-slate-200 mt-1">{leakOffPressure}</div>
                          <span className="absolute right-0 bottom-1 bg-slate-900 text-sky-400 text-[7.5px] font-black font-mono px-1 py-0.5 rounded uppercase">psi</span>
                        </div>
                        <div className="relative">
                          <span className="text-[7px] text-slate-400 font-sans block uppercase font-bold tracking-wide">Mud Weight at Test (B)</span>
                          <div className="font-extrabold text-xs block text-slate-200 mt-1">{mudWeightAtTest.toFixed(2)}</div>
                          <span className="absolute right-0 bottom-1 bg-slate-900 text-sky-400 text-[7.5px] font-black font-mono px-1 py-0.5 rounded uppercase font-bold">SG</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-tab view: Circulating plan schedule draw downs */}
                {killSheetTab === "plan" && (
                  <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-3.5 space-y-2 animate-fadeIn">
                    <span className="font-bold text-slate-400 uppercase block text-[8px] tracking-wider">Dynamic Pump Drawdown Plan</span>
                    <table className="w-full text-left font-mono text-[8px] leading-tight">
                      <thead>
                        <tr className="border-b border-slate-700/50 text-slate-400 text-[7px] uppercase tracking-wider font-sans">
                          <th className="py-1">Strokes (stk)</th>
                          <th className="py-1">Circulating Pres.</th>
                          <th className="py-1 text-right">Fluid Density</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50 text-slate-300">
                        <tr><td className="py-1 font-bold text-slate-200">0 (Initial)</td><td className="py-1 text-red-400 font-bold">900 psi</td><td className="py-1 text-right">1.55 SG</td></tr>
                        <tr><td className="py-1">200</td><td className="py-1">810 psi</td><td className="py-1 text-right">1.57 SG</td></tr>
                        <tr><td className="py-1">400</td><td className="py-1">720 psi</td><td className="py-1 text-right">1.59 SG</td></tr>
                        <tr><td className="py-1">600</td><td className="py-1">630 psi</td><td className="py-1 text-right">1.61 SG</td></tr>
                        <tr><td className="py-1">800</td><td className="py-1">540 psi</td><td className="py-1 text-right">1.63 SG</td></tr>
                        <tr><td className="py-1 font-bold text-slate-200">1,000 (Final)</td><td className="py-1 text-emerald-400 font-bold">425 psi</td><td className="py-1 text-right font-bold text-sky-400">1.65 SG</td></tr>
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            )}

            {/* TAB 5: TRIP SHEET */}
            {activeTab === "tripSheet" && (
              <div className="animate-fadeIn space-y-3.5 text-[10px]">
                
                {/* Trip Sheet Header */}
                <div className="flex justify-between items-start pt-2">
                  <div>
                    <h4 className="font-extrabold text-[15px] text-slate-200 block font-sans uppercase tracking-wide">Trip Sheet Monitoring</h4>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Volume tracking & kick detection</span>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button className="bg-slate-700/50 hover:bg-slate-600 text-slate-300 p-2 rounded-xl">
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button className="bg-slate-700/50 hover:bg-slate-600 text-slate-300 p-2 rounded-xl">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sub-tab switcher */}
                <div className="flex border-b border-slate-700/50 pt-2">
                  {[
                    { id: "setup", label: "Setup & Tanks" },
                    { id: "table", label: "Trip Sheet Table" }
                  ].map((subTab) => (
                    <button
                      key={subTab.id}
                      onClick={() => setTripSheetTab(subTab.id as any)}
                      className={`flex-1 py-2 px-1.5 text-[11px] font-bold tracking-wide transition-all ${
                        tripSheetTab === subTab.id 
                          ? "bg-slate-800 text-sky-400 border-b-2 border-sky-400" 
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {subTab.label}
                    </button>
                  ))}
                </div>

                {tripSheetTab === "setup" && (
                  <div className="space-y-3">
                    {/* Trip Parameters */}
                    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-3.5 space-y-3">
                      <h5 className="font-bold text-sky-400 uppercase tracking-widest block text-[9px] font-sans">Trip Parameters</h5>
                      
                      <div>
                        <span className="text-[10px] font-bold text-slate-300 block mb-2">Trip Direction</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button className="bg-slate-800 text-slate-300 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5">
                            <span className="text-sm">↑</span> POOH
                          </button>
                          <button className="bg-sky-400 text-slate-900 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5">
                            <span className="text-sm">↓</span> RIH
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-[10px] font-bold text-slate-300 block mb-2">Displacement Volume Basis</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button className="bg-slate-800 text-slate-300 py-2 rounded-xl font-bold">
                            Steel Volume
                          </button>
                          <button className="bg-sky-400 text-slate-900 py-2 rounded-xl font-bold">
                            Exterior Volume
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Mud Tanks Setup */}
                    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-3.5 space-y-4">
                      <div className="flex justify-between items-center">
                        <h5 className="font-bold text-sky-400 uppercase tracking-widest block text-[9px] font-sans">Mud Tanks Setup</h5>
                        <button className="text-slate-600 hover:text-slate-400">
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* D1 - Settling */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h6 className="font-bold text-sky-400 text-[11px]">D1 - SETTLING</h6>
                          <span className="bg-slate-800 border border-slate-700/50 text-sky-400 text-[9px] font-bold px-2 py-1 rounded-lg">Actual Vol: 0.00 m3</span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <div className="relative pt-2">
                            <label className="absolute top-0 left-2 bg-slate-900 px-1 text-[8px] text-slate-400 font-medium">Cap (l/cm)</label>
                            <input type="text" value="72.5" readOnly className="w-full bg-transparent border border-slate-700/60 rounded-lg p-2 text-slate-200 font-mono text-[11px] focus:outline-none" />
                          </div>
                          <div className="relative pt-2">
                            <label className="absolute top-0 left-2 bg-slate-900 px-1 text-[8px] text-slate-400 font-medium">Vol (m3)</label>
                            <input type="text" value="16.5" readOnly className="w-full bg-transparent border border-slate-700/60 rounded-lg p-2 text-slate-200 font-mono text-[11px] focus:outline-none" />
                          </div>
                          <div className="relative pt-2">
                            <label className="absolute -top-1 left-2 bg-slate-900 px-1 text-[8px] text-slate-400 font-medium leading-tight">Empty Level<br/>(cm)</label>
                            <input type="text" value="227.6" readOnly className="w-full bg-transparent border border-slate-700/60 rounded-lg p-2 text-slate-200 font-mono text-[11px] focus:outline-none" />
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-800/80 pt-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <h6 className="font-bold text-sky-400 text-[11px]">D2 - SETTLING</h6>
                          <span className="bg-slate-800 border border-slate-700/50 text-sky-400 text-[9px] font-bold px-2 py-1 rounded-lg">Actual Vol: 0.00 m3</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="h-9 border border-slate-700/60 rounded-lg"></div>
                          <div className="h-9 border border-slate-700/60 rounded-lg"></div>
                          <div className="h-9 border border-slate-700/60 rounded-lg"></div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
                
                {tripSheetTab === "table" && (
                  <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2 py-10 opacity-70">
                    <ClipboardList className="w-8 h-8 text-slate-600 mb-1" />
                    <h5 className="font-bold text-slate-400 text-[11px]">Trip Sheet Table</h5>
                    <p className="text-[9px] text-slate-500">Trip sheet records will appear here.</p>
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>

      {/* Persistent Bottom Mobile Navigation Tab Bar (Standard capsule style matching Screenshot 3) */}
      <div className={`border-t px-2 py-3 pb-4 flex justify-around items-center z-30 rounded-b-[40px] transition-all bg-[#091522] border-slate-800`}>
        {/* Tab 1: Fluids */}
        <button 
          onClick={() => { setActiveTab("fluids"); setSettingsOpen(false); }} 
          className="flex flex-col items-center gap-1 flex-1 relative"
        >
          <div className={`px-4.5 py-1.5 rounded-full transition-all flex items-center justify-center ${
            activeTab === "fluids" && !settingsOpen
              ? "bg-[#2F4F7A] text-sky-300 font-bold" 
              : "text-slate-400 hover:text-slate-200"
          }`}>
            <Droplets className="w-4.5 h-4.5" />
          </div>
          <span className={`text-[7px] font-medium font-sans mt-0.5 ${
            activeTab === "fluids" && !settingsOpen ? "text-sky-300" : "text-slate-400"
          }`}>
            Fluids
          </span>
        </button>

        {/* Tab 2: Capacity */}
        <button 
          onClick={() => { setActiveTab("capacity"); setSettingsOpen(false); }} 
          className="flex flex-col items-center gap-1 flex-1 relative"
        >
          <div className={`px-4.5 py-1.5 rounded-full transition-all flex items-center justify-center ${
            activeTab === "capacity" && !settingsOpen
              ? "bg-[#2F4F7A] text-sky-300 font-bold" 
              : "text-slate-400 hover:text-slate-200"
          }`}>
            <Wrench className="w-4.5 h-4.5" />
          </div>
          <span className={`text-[7px] font-medium font-sans mt-0.5 ${
            activeTab === "capacity" && !settingsOpen ? "text-sky-300" : "text-slate-400"
          }`}>
            Capacity
          </span>
        </button>

        {/* Tab 3: Advanced */}
        <button 
          onClick={() => { setActiveTab("advanced"); setSettingsOpen(false); }} 
          className="flex flex-col items-center gap-1 flex-1 relative"
        >
          <div className={`px-4.5 py-1.5 rounded-full transition-all flex items-center justify-center ${
            activeTab === "advanced" && !settingsOpen
              ? "bg-[#2F4F7A] text-sky-300 font-bold" 
              : "text-slate-400 hover:text-slate-200"
          }`}>
            <Zap className="w-4.5 h-4.5" />
          </div>
          <span className={`text-[7px] font-medium font-sans mt-0.5 ${
            activeTab === "advanced" && !settingsOpen ? "text-sky-300" : "text-slate-400"
          }`}>
            Advanced
          </span>
        </button>

        {/* Tab 4: Kill Sheet */}
        <button 
          onClick={() => { setActiveTab("killSheet"); setSettingsOpen(false); }} 
          className="flex flex-col items-center gap-1 flex-1 relative"
        >
          <div className={`px-4.5 py-1.5 rounded-full transition-all flex items-center justify-center ${
            activeTab === "killSheet" && !settingsOpen
              ? "bg-[#2F4F7A] text-sky-300 font-bold" 
              : "text-slate-400 hover:text-slate-200"
          }`}>
            <ClipboardList className="w-4.5 h-4.5" />
          </div>
          <span className={`text-[7px] font-medium font-sans mt-0.5 ${
            activeTab === "killSheet" && !settingsOpen ? "text-sky-300" : "text-slate-400"
          }`}>
            Kill Sheet
          </span>
        </button>
        
        {/* Tab 5: Trip Sheet */}
        <button 
          onClick={() => { setActiveTab("tripSheet"); setSettingsOpen(false); }} 
          className="flex flex-col items-center gap-1 flex-1 relative"
        >
          <div className={`px-4.5 py-1.5 rounded-full transition-all flex items-center justify-center ${
            activeTab === "tripSheet" && !settingsOpen
              ? "bg-[#2F4F7A] text-sky-300 font-bold" 
              : "text-slate-400 hover:text-slate-200"
          }`}>
            <ArrowUpDown className="w-4.5 h-4.5" />
          </div>
          <span className={`text-[7px] font-medium font-sans mt-0.5 ${
            activeTab === "tripSheet" && !settingsOpen ? "text-sky-300" : "text-slate-400"
          }`}>
            Trip Sheet
          </span>
        </button>
      </div>

      {/* Visual Glare Overlay Effect */}
      <div className="absolute inset-y-0 right-0 w-1/4 bg-white/[0.03] transform skew-x-12 pointer-events-none z-30"></div>
    </div>
  );
}
