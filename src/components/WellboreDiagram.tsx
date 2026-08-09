import React from "react";
import { CalculatorInputs, CalculatorOutputs } from "../types";

interface WellboreDiagramProps {
  inputs: CalculatorInputs;
  outputs: CalculatorOutputs;
  isMetric: boolean;
}

export default function WellboreDiagram({ inputs, outputs, isMetric }: WellboreDiagramProps) {
  const { mudWeight, measuredDepth, trueVerticalDepth } = inputs;
  const { hydrostaticPressure, annularVolume, drillPipeVolume } = outputs;

  // Format display strings
  const depthVal = isMetric ? (measuredDepth * 0.3048).toFixed(0) : measuredDepth.toFixed(0);
  const depthUnit = isMetric ? "m" : "ft";
  const pressVal = isMetric ? (hydrostaticPressure * 0.0689476).toFixed(1) : hydrostaticPressure.toFixed(0);
  const pressUnit = isMetric ? "bar" : "psi";
  const mwVal = isMetric ? (mudWeight * 0.119826).toFixed(2) : mudWeight.toFixed(1);
  const mwUnit = isMetric ? "s.g." : "ppg";

  return (
    <div className="glass-card rounded-3xl p-5 flex flex-col justify-between h-full relative overflow-hidden group">
      {/* Background abstract grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-80 pointer-events-none"></div>

      <div className="relative z-10">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          Dynamic Wellbore Hydraulics
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">Live hydrostatic gradient simulator</p>
      </div>

      <div className="my-6 flex-1 flex items-center justify-center relative z-10" style={{ minHeight: "340px" }}>
        {/* SVG Wellbore */}
        <svg viewBox="0 0 200 400" className="w-full max-w-[190px] h-auto overflow-visible select-none drop-shadow-md">
          <defs>
            {/* Pressure gradient overlay */}
            <linearGradient id="pressGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.05" />
              <stop offset="50%" stopColor="#2563eb" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.3" />
            </linearGradient>

            {/* Drilling mud flowing down gradient */}
            <linearGradient id="mudDown" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>

            {/* Drilling mud flowing up annulus gradient */}
            <linearGradient id="mudUp" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            
            {/* Ground geology pattern */}
            <pattern id="geology" width="10" height="10" patternUnits="userSpaceOnUse">
              <line x1="0" y1="5" x2="10" y2="5" stroke="#cbd5e1" strokeWidth="0.5" />
              <line x1="5" y1="0" x2="5" y2="10" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="1,2" />
            </pattern>
          </defs>

          {/* Left and Right rock formation boundaries */}
          <rect x="-10" y="0" width="60" height="380" fill="url(#geology)" opacity="0.5" />
          <rect x="150" y="0" width="60" height="380" fill="url(#geology)" opacity="0.5" />

          {/* Ground level reference line */}
          <line x1="-20" y1="20" x2="220" y2="20" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 2" />
          <text x="-15" y="15" fill="#64748b" fontSize="8" fontFamily="monospace">RKB Ground</text>

          {/* Dynamic Wellbore Hole Outline (Casing string) */}
          <rect x="50" y="20" width="100" height="350" fill="url(#pressGrad)" stroke="#94a3b8" strokeWidth="2.5" rx="3" />
          
          {/* Casing shoe details */}
          <polygon points="50,330 45,340 50,340" fill="#64748b" />
          <polygon points="150,330 155,340 150,340" fill="#64748b" />
          
          {/* Inner drill pipe (represented by a central blue rod) */}
          <rect x="88" y="20" width="24" height="330" fill="url(#mudDown)" rx="1.5" stroke="#475569" strokeWidth="1" />
          
          {/* Drill bit at bottom of drill string */}
          <g transform="translate(80, 345)">
            {/* Bit shank */}
            <rect x="12" y="0" width="16" height="10" fill="#64748b" rx="1" />
            {/* Bit cones (tri-cone look) */}
            <path d="M4,10 L36,10 L28,20 L12,20 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
            {/* Cutter teeth lines */}
            <line x1="8" y1="15" x2="32" y2="15" stroke="#334155" strokeWidth="1.5" strokeDasharray="2,2" />
            
            {/* Nozzle jets shooting mud out */}
            <path d="M8,10 L3,28 L11,28 Z" fill="#10b981" opacity="0.65" />
            <path d="M32,10 L37,28 L29,28 Z" fill="#10b981" opacity="0.65" />
          </g>

          {/* Flow Arrows in Drill Pipe (mud flowing DOWN) */}
          <g stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.8" strokeLinecap="round">
            <path d="M100,50 L100,60 M100,60 L97,56 M100,60 L103,56" />
            <path d="M100,150 L100,160 M100,160 L97,156 M100,160 L103,156" />
            <path d="M100,250 L100,260 M100,260 L97,256 M100,260 L103,256" />
          </g>

          {/* Flow Arrows in Annulus (mud flowing UP) */}
          <g stroke="#10b981" strokeWidth="1.5" fill="none" opacity="0.8" strokeLinecap="round">
            {/* Left Annulus flow */}
            <path d="M70,300 L70,290 M70,290 L67,294 M70,290 L73,294" />
            <path d="M70,180 L70,170 M70,170 L67,174 M70,170 L73,174" />
            <path d="M70,80 L70,70 M70,70 L67,74 M70,70 L73,74" />

            {/* Right Annulus flow */}
            <path d="M130,300 L130,290 M130,290 L127,294 M130,290 L133,294" />
            <path d="M130,180 L130,170 M130,170 L127,174 M130,170 L133,174" />
            <path d="M130,80 L130,70 M130,70 L127,74 M130,70 L133,74" />
          </g>

          {/* Depth annotations along the side */}
          <g fontSize="7" fontFamily="monospace" fill="#475569">
            {/* Surface */}
            <text x="156" y="32">0 {depthUnit}</text>
            <text x="156" y="42">0 {pressUnit}</text>
            
            {/* Mid depth */}
            <line x1="145" y1="190" x2="153" y2="190" stroke="#cbd5e1" />
            <text x="156" y="188">{(Number(depthVal) * 0.5).toFixed(0)} {depthUnit}</text>
            <text x="156" y="197">{(Number(pressVal) * 0.5).toFixed(0)} {pressUnit}</text>

            {/* Target depth */}
            <line x1="145" y1="365" x2="153" y2="365" stroke="#64748b" />
            <text x="156" y="362" fill="#2563eb" fontWeight="bold">{depthVal} {depthUnit}</text>
            <text x="156" y="371" fill="#2563eb" fontWeight="bold">{pressVal} {pressUnit}</text>
          </g>

          {/* Leftside labels (Annulus vs Pipe labels) */}
          <g fontSize="6" fontFamily="sans-serif" fill="#475569">
            <text x="3" y="110" fill="#059669" fontWeight="bold">ANNULUS</text>
            <text x="3" y="118">Annulus Volume:</text>
            <text x="3" y="126" fill="#0f172a" fontFamily="monospace" fontWeight="bold">{isMetric ? (annularVolume * 0.158987).toFixed(1) : annularVolume.toFixed(1)} {isMetric ? "m³" : "bbl"}</text>

            <text x="3" y="220" fill="#2563eb" fontWeight="bold">DRILLPIPE</text>
            <text x="3" y="228">Drillstring Volume:</text>
            <text x="3" y="236" fill="#0f172a" fontFamily="monospace" fontWeight="bold">{isMetric ? (drillPipeVolume * 0.158987).toFixed(1) : drillPipeVolume.toFixed(1)} {isMetric ? "m³" : "bbl"}</text>
          </g>
        </svg>
      </div>

      {/* Footer statistics overlay */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 grid grid-cols-2 gap-2 relative z-10 text-xs shadow-sm">
        <div>
          <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-semibold">Hydrostatic Grad.</span>
          <span className="font-mono text-blue-600 font-bold block mt-0.5">
            {isMetric ? (mudWeight * 0.119826 * 0.0981).toFixed(4) : (mudWeight * 0.052).toFixed(3)}{" "}
            <span className="text-[9px] text-slate-400">{isMetric ? "bar/m" : "psi/ft"}</span>
          </span>
        </div>
        <div>
          <span className="text-slate-500 block text-[9px] uppercase tracking-wider font-semibold">ECD</span>
          <span className="font-mono text-emerald-600 font-bold block mt-0.5">
            {isMetric ? (outputs.ecd * 0.119826).toFixed(2) : outputs.ecd.toFixed(2)}{" "}
            <span className="text-[9px] text-slate-400 font-medium">{isMetric ? "s.g." : "ppg"}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
