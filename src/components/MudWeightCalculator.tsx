import React, { useState } from "react";
import { Scale, ArrowRight, Droplet, PlusCircle, AlertCircle } from "lucide-react";

export default function MudWeightCalculator() {
  const [initialVolume, setInitialVolume] = useState(100); // bbl
  const [initialWeight, setInitialWeight] = useState(10.0); // ppg
  const [targetWeight, setTargetWeight] = useState(11.5); // ppg

  // Calculations
  const isWeightUp = targetWeight >= initialWeight;

  let resultSacks = 0;
  let resultVolumeIncrease = 0;
  let finalVolume = 0;
  let waterRequired = 0;

  if (isWeightUp) {
    // Barite weight-up formula
    const divisor = 35 - targetWeight;
    if (divisor > 0) {
      resultSacks = (1470 * (targetWeight - initialWeight) * initialVolume) / (100 * divisor);
      // Volume increase of Barite addition is roughly 0.068 bbl per 100 lb sack (1 sack)
      resultVolumeIncrease = resultSacks * 0.068;
      finalVolume = initialVolume + resultVolumeIncrease;
    }
  } else {
    // Water dilution formula
    const divisor = targetWeight - 8.33;
    if (divisor > 0) {
      waterRequired = (initialVolume * (initialWeight - targetWeight)) / divisor;
      finalVolume = initialVolume + waterRequired;
    }
  }

  return (
    <div className="glass-card rounded-3xl p-6 relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-600">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">Mud Density Adjuster</h3>
          <p className="text-xs text-slate-500">Barite weight-up & dilution calculations</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Active Volume */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Mud Volume</label>
            <span className="font-mono text-xs font-bold text-slate-800">{initialVolume} bbl</span>
          </div>
          <input
            type="range"
            min="10"
            max="1000"
            step="10"
            value={initialVolume}
            onChange={(e) => setInitialVolume(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Weights sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Initial Weight (W1)</label>
              <span className="font-mono text-xs font-bold text-blue-600">{initialWeight.toFixed(1)} ppg</span>
            </div>
            <input
              type="range"
              min="8.4"
              max="19.0"
              step="0.1"
              value={initialWeight}
              onChange={(e) => setInitialWeight(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Target Weight (W2)</label>
              <span className="font-mono text-xs font-bold text-blue-600">{targetWeight.toFixed(1)} ppg</span>
            </div>
            <input
              type="range"
              min="8.4"
              max="19.0"
              step="0.1"
              value={targetWeight}
              onChange={(e) => setTargetWeight(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        {/* Transition Visual */}
        <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between border border-slate-200/80 text-xs text-slate-600 font-mono shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600/30"></span>
            <span>Initial: <b className="text-slate-800">{initialWeight.toFixed(1)} ppg</b></span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span>Target: <b className="text-blue-600 font-bold">{targetWeight.toFixed(1)} ppg</b></span>
          </div>
        </div>

        {/* Dynamic Calculation Output Results */}
        <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-200/80 mt-4 space-y-3.5 shadow-inner">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Calculated Requirements</div>

          {isWeightUp ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-600 shrink-0">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Barite Needed</span>
                    <span className="text-[10px] text-slate-500">100 lb / sack (4.2 SG)</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold font-mono text-blue-600">{Math.round(resultSacks)}</span>
                  <span className="text-xs text-slate-500 ml-1 font-mono font-medium">sacks</span>
                  <span className="text-[10px] text-slate-400 block font-mono">({(resultSacks * 100).toLocaleString(undefined, { maximumFractionDigits: 0 })} lbs)</span>
                </div>
              </div>

              <div className="border-t border-slate-100 my-2"></div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] block">Pit Volume Expansion:</span>
                  <span className="text-slate-800 font-bold">+{resultVolumeIncrease.toFixed(1)} bbl</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Final Total Mud Volume:</span>
                  <span className="text-slate-800 font-bold">{finalVolume.toFixed(1)} bbl</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center border border-sky-500/20 text-sky-600 shrink-0">
                    <Droplet className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Fresh Water Diluent</span>
                    <span className="text-[10px] text-slate-500">Based on 8.33 ppg SG</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold font-mono text-sky-600">{waterRequired.toFixed(1)}</span>
                  <span className="text-xs text-slate-500 ml-1 font-mono font-medium">bbl</span>
                  <span className="text-[10px] text-slate-400 block font-mono">({(waterRequired * 42).toLocaleString(undefined, { maximumFractionDigits: 0 })} gallons)</span>
                </div>
              </div>

              <div className="border-t border-slate-100 my-2"></div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] block">Water Added:</span>
                  <span className="text-slate-800 font-bold">+{waterRequired.toFixed(1)} bbl</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Final Total Mud Volume:</span>
                  <span className="text-slate-800 font-bold">{finalVolume.toFixed(1)} bbl</span>
                </div>
              </div>
            </div>
          )}

          {targetWeight > 18.0 && (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-red-700 leading-normal">
                <b>Warning:</b> Target weight &gt; 18 ppg approaches critical solids concentration. High risk of mud gelation, solids settlement, and extreme plastic viscosity (PV).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
