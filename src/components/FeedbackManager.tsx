import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Trash2, Send, ShieldAlert, BadgeCheck, Plus } from "lucide-react";
import { FeedbackMessage } from "../types";

export default function FeedbackManager() {
  const [messages, setMessages] = useState<FeedbackMessage[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [messageText, setMessageText] = useState("");
  const [appVersion, setAppVersion] = useState("1.1.2-beta");
  const [notification, setNotification] = useState<string | null>(null);

  // Load sample messages on mount
  useEffect(() => {
    const saved = localStorage.getItem("mudflow_feedback");
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      const initial: FeedbackMessage[] = [
        {
          id: "1",
          name: "John Harrison",
          email: "j.harrison@chevron.com",
          rating: 5,
          message: "The ECD and Hydraulics calculators are spot on! Super useful for quick checks on the rig floor instead of booting up big corporate software.",
          date: "2026-07-09",
          appVersion: "1.1.0-beta"
        },
        {
          id: "2",
          name: "Amara Okoye",
          email: "amara.o@drilling fluids.net",
          rating: 4,
          message: "Great interface design. Can you add custom pipe sizes for non-standard drill collars in the next update?",
          date: "2026-07-05",
          appVersion: "1.0.8-beta"
        },
        {
          id: "3",
          name: "Sven Lindstrom",
          email: "sven.l@equinor.com",
          rating: 5,
          message: "Mud weight dilution calculations are exact. Saved me some serious trial-and-error math on our drilling vessel yesterday. Highly recommend MudFlow!",
          date: "2026-06-28",
          appVersion: "1.0.4-beta"
        }
      ];
      setMessages(initial);
      localStorage.setItem("mudflow_feedback", JSON.stringify(initial));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !messageText) {
      alert("Please fill in all fields.");
      return;
    }

    const newMessage: FeedbackMessage = {
      id: Date.now().toString(),
      name,
      email,
      rating,
      message: messageText,
      date: new Date().toISOString().split("T")[0],
      appVersion
    };

    const updated = [newMessage, ...messages];
    setMessages(updated);
    localStorage.setItem("mudflow_feedback", JSON.stringify(updated));

    // Clear form
    setName("");
    setEmail("");
    setRating(5);
    setMessageText("");

    setNotification("Your review has been successfully piped to Madanyes's developer dashboard!");
    setTimeout(() => setNotification(null), 5000);
  };

  const deleteMessage = (id: string) => {
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    localStorage.setItem("mudflow_feedback", JSON.stringify(updated));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Feedback Submission Form */}
      <div className="lg:col-span-5 glass-card rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-600">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Submit Feedback</h3>
            <p className="text-xs text-slate-500">Help Madanyes optimize the production build</p>
          </div>
        </div>

        {notification && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 text-xs flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Your Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Robert"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                required
                placeholder="e.g. rob@rig.com"
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
                      className={`w-4 h-4 ${
                        star <= rating ? "text-amber-500 fill-amber-500" : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Installed Version</label>
              <select
                value={appVersion}
                onChange={(e) => setAppVersion(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              >
                <option value="1.1.2-beta">v1.1.2-beta (Latest)</option>
                <option value="1.1.0-beta">v1.1.0-beta</option>
                <option value="1.0.8-beta">v1.0.8-beta</option>
                <option value="1.0.4-beta">v1.0.4-beta</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Private Message</label>
            <textarea
              required
              rows={4}
              placeholder="Report bugs, suggest features, or review performance..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md hover:shadow-blue-600/10 flex items-center justify-center gap-1.5 group cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            Send to Developer Console
          </button>
        </form>
      </div>

      {/* Developer Live Inbox Terminal */}
      <div className="lg:col-span-7 glass-card-dark rounded-3xl overflow-hidden flex flex-col h-[460px] shadow-2xl">
        {/* Terminal Header */}
        <div className="bg-[#0f172a] px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-mono text-slate-400 ml-2">madanyes@console:~/feedback</span>
          </div>
          <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-mono">
            {messages.length} pending logs
          </span>
        </div>

        {/* Console Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 bg-[#0b0f19]">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <ShieldAlert className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-sm font-mono text-slate-400">Feedback queue is empty.</p>
              <p className="text-xs text-slate-600 mt-1">Submit the form on the left to add a transmission.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700/60 transition-colors flex items-start justify-between gap-4 animate-fadeIn"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-200">{msg.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{msg.email}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                      {msg.appVersion}
                    </span>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < msg.rating ? "text-amber-500 fill-amber-500" : "text-slate-800"
                        }`}
                      />
                    ))}
                    <span className="text-[9px] text-slate-500 font-mono ml-2">{msg.date}</span>
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">
                    {msg.message}
                  </p>
                </div>

                <button
                  onClick={() => deleteMessage(msg.id)}
                  className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition-all shrink-0 cursor-pointer"
                  title="Archive Feedback"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
