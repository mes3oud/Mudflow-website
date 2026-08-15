const fs = require('fs');
let content = fs.readFileSync('src/components/PhoneMockup.tsx', 'utf8');

const tripSheetBlock = `
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
                      className={\`flex-1 py-2 px-1.5 text-[11px] font-bold tracking-wide transition-all \${
                        tripSheetTab === subTab.id 
                          ? "bg-slate-800 text-sky-400 border-b-2 border-sky-400" 
                          : "text-slate-500 hover:text-slate-300"
                      }\`}
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
`;

const insertionPoint = `              </div>
            )}

          </div>
        )}`;

content = content.replace(insertionPoint, `              </div>
            )}
${tripSheetBlock}
          </div>
        )}`);

fs.writeFileSync('src/components/PhoneMockup.tsx', content);
console.log("Patched");
