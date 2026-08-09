const fs = require('fs');
const content = fs.readFileSync('src/components/PhoneMockup.tsx', 'utf8');

const target = `                {/* Tabs */}
                <div className="bg-slate-200/60 p-1 rounded-xl flex shadow-inner mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
                  {[
                    { id: "grid", label: "Tools" },
                    { id: "plug", label: "Balanced Plug" },
                    { id: "slug", label: "Heavy Pill / Slug" },
                    { id: "lab", label: "Specialized Lab" }
                  ].map((subTab) => (
                    <button
                      key={subTab.id}
                      onClick={() => setAdvancedTab(subTab.id as any)}
                      className={\`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide transition-all \${
                        advancedTab === subTab.id 
                          ? "bg-slate-800 text-sky-400 shadow-sm" 
                          : "text-slate-500 hover:text-slate-800"
                      }\`}
                    >
                      {subTab.label}
                    </button>
                  ))}
                </div>`;

const replacement = `                {/* Tabs */}
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
                      className={\`px-3 py-1.5 text-[10px] font-bold tracking-wide transition-all \${
                        advancedTab === subTab.id 
                          ? "bg-slate-800 text-sky-400 border-b-2 border-sky-400" 
                          : "text-slate-500 hover:text-slate-300"
                      }\`}
                    >
                      {subTab.label}
                    </button>
                  ))}
                </div>`;

const updatedContent = content.replace(target, replacement);

if (content !== updatedContent) {
  fs.writeFileSync('src/components/PhoneMockup.tsx', updatedContent);
  console.log("Replaced");
} else {
  console.log("Not replaced");
}
