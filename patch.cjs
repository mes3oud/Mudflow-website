const fs = require('fs');
let content = fs.readFileSync('src/components/PhoneMockup.tsx', 'utf8');

// Replace remaining light theme specific classes
content = content.replace(/text-\[\#014E80\] dark:text-sky-400/g, "text-sky-400");
content = content.replace(/text-\[\#014E80\]/g, "text-sky-400");

// Check for any remaining bg-[#EBF1F6]
content = content.replace(/bg-\[\#EBF1F6\]/g, "bg-sky-900/40");

// Check for border-slate-200
content = content.replace(/border-slate-200/g, "border-slate-700/60");
content = content.replace(/bg-slate-50/g, "bg-slate-900");


if (fs.readFileSync('src/components/PhoneMockup.tsx', 'utf8') !== content) {
  fs.writeFileSync('src/components/PhoneMockup.tsx', content);
  console.log("Replaced");
} else {
  console.log("No changes");
}
