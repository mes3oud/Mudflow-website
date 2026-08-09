import React, { useState } from "react";
import { Star, MessageSquare, Send, Copy, Check, ClipboardList } from "lucide-react";
import { APP_VERSION, CONTACT_EMAIL } from "../config";

export default function FeedbackManager() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [messageText, setMessageText] = useState("");
  const [appVersion, setAppVersion] = useState(APP_VERSION);
  const [copied, setCopied] = useState(false);

  const buildBody = () =>
    [
      `Name: ${name || "(not given)"}`,
      `Reply address: ${email || "(not given)"}`,
      `App version: ${appVersion}`,
      `Rating: ${rating} / 5`,
      "",
      "Message:",
      messageText || "(empty)",
    ].join("\n");

  const handleSend = () => {
    if (!messageText.trim()) {
      alert("Please write your message first.");
      return;
    }
    const subject = encodeURIComponent(`MudFlow feedback — v${appVersion}`);
    const body = encodeURIComponent(buildBody());
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildBody());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert("Could not copy automatically. Please select the text and copy it manually.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Feedback form */}
      <div className="lg:col-span-7 glass-card rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-600">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Contact the developer</h3>
            <p className="text-xs text-slate-500">
              This opens your own email app — nothing is stored on this website.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Your name</label>
              <input
                type="text"
                placeholder="e.g. Robert"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Reply address</label>
              <input
                type="email"
                placeholder="e.g. rob@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Rating</label>
              <div className="flex gap-1 bg-white border border-slate-200 rounded-xl px-3 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-0.5 focus:outline-none hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-4 h-4 ${star <= rating ? "text-amber-500 fill-amber-500" : "text-slate-300"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Installed version</label>
              <input
                type="text"
                value={appVersion}
                onChange={(e) => setAppVersion(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Your message</label>
            <textarea
              rows={5}
              placeholder="Report a bug, suggest a calculator, or tell me what is missing..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleSend}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 group cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              Open in my email app
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              {copied ? "Copied" : "Copy the text instead"}
            </button>
          </div>

          <p className="text-[10px] text-slate-400 leading-relaxed">
            No account, no tracking, no database. Your details go straight into an email
            addressed to {CONTACT_EMAIL} and nowhere else.
          </p>
        </div>
      </div>

      {/* Honest guidance panel — replaces the old fake inbox */}
      <div className="lg:col-span-5 glass-card rounded-3xl p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-600">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">What helps most</h3>
            <p className="text-xs text-slate-500">A good report gets fixed faster</p>
          </div>
        </div>

        <ul className="space-y-3 text-xs text-slate-600">
          {[
            "Which calculator you were using, and the exact numbers you entered.",
            "The result you got, and the result you expected.",
            "Your unit system — field units or metric.",
            "Your phone model and Android version.",
            "A screenshot, if the screen looks wrong.",
          ].map((tip, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-5 h-5 rounded bg-blue-50 border border-blue-100 shrink-0 text-blue-600 font-bold font-mono flex items-center justify-center text-[10px]">
                {i + 1}
              </span>
              <span className="leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <p className="text-[11px] text-slate-600 leading-relaxed">
            If you spot a formula that disagrees with your handbook, please say which
            reference you are comparing against. Corrections from working mud engineers
            are the fastest route to a fix.
          </p>
        </div>
      </div>
    </div>
  );
}
