import React from "react";

interface AppIconProps {
  className?: string;
  size?: number;
  showBackground?: boolean;
}

export default function AppIcon({ 
  className = "", 
  size = 48, 
  showBackground = true 
}: AppIconProps) {
  return (
    <svg
      id="mudflow-app-icon"
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      <defs>
        {/* Radial and Linear Gradients for Premium look */}
        <radialGradient
          id="bgGrad"
          cx="50%"
          cy="30%"
          r="75%"
          fx="50%"
          fy="30%"
        >
          <stop offset="0%" stopColor="#1E6CB3" />
          <stop offset="50%" stopColor="#0F4C81" />
          <stop offset="100%" stopColor="#082A4D" />
        </radialGradient>

        <linearGradient id="dropletGrad" x1="256" y1="40" x2="256" y2="440" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E6F2FA" />
        </linearGradient>

        <linearGradient id="soilGrad" x1="256" y1="280" x2="256" y2="440" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8c5a36" />
          <stop offset="50%" stopColor="#6d4122" />
          <stop offset="100%" stopColor="#502d13" />
        </linearGradient>

        <linearGradient id="derrickGrad" x1="256" y1="120" x2="256" y2="330" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#102E4E" />
          <stop offset="100%" stopColor="#081A2D" />
        </linearGradient>

        <linearGradient id="bitGrad" x1="256" y1="290" x2="256" y2="410" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>

        {/* Shadow Filters */}
        <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.25" />
        </filter>
        <filter id="innerShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feOffset dx="0" dy="3"/>
          <feGaussianBlur stdDeviation="3" result="offset-blur"/>
          <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
          <feFlood floodColor="black" floodOpacity="0.6" result="color"/>
          <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
          <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
        </filter>
      </defs>

      {/* Rounded-corner Square App Icon Background */}
      {showBackground && (
        <rect
          x="0"
          y="0"
          width="512"
          height="512"
          rx="118"
          fill="url(#bgGrad)"
        />
      )}

      {/* White Droplet Outline & Fill */}
      <g filter="url(#dropShadow)">
        {/* Main Droplet Path */}
        <path
          d="M256 50 C256 50 110 230 110 340 C110 422 175 466 256 466 C337 466 402 422 402 340 C402 230 256 50 256 50 Z"
          fill="url(#dropletGrad)"
          stroke="#FFFFFF"
          strokeWidth="8"
          strokeLinejoin="round"
        />
      </g>

      {/* Droplet Shine/Highlight Accent on left side */}
      <path
        d="M140 310 C134 260 178 180 230 110 C210 160 148 240 148 310 C148 340 152 355 160 370 C150 355 142 335 140 310 Z"
        fill="#FFFFFF"
        opacity="0.5"
      />
      <path
        d="M256 65 C256 65 240 90 230 115 C235 95 248 75 256 65 Z"
        fill="#FFFFFF"
        opacity="0.6"
      />

      {/* Clipping path for inner contents (Derrick + Ground) to keep them within the droplet boundary */}
      <clipPath id="dropletClip">
        <path d="M256 50 C256 50 110 230 110 340 C110 422 175 466 256 466 C337 466 402 422 402 340 C402 230 256 50 256 50 Z" />
      </clipPath>

      <g clipPath="url(#dropletClip)">
        
        {/* Subsurface Brown Earth/Soil Layer (curvy/wavy top) */}
        <path
          d="M100 300 Q150 280 200 305 T300 295 T420 300 L420 480 L100 480 Z"
          fill="url(#soilGrad)"
        />

        {/* Particles/Specks in the soil for rich texture */}
        <circle cx="160" cy="340" r="4" fill="#502d13" opacity="0.8" />
        <circle cx="210" cy="380" r="5" fill="#ca8a04" opacity="0.5" />
        <circle cx="140" cy="410" r="3" fill="#ca8a04" opacity="0.6" />
        <circle cx="180" cy="425" r="4.5" fill="#fef08a" opacity="0.4" />
        <circle cx="340" cy="330" r="3.5" fill="#ca8a04" opacity="0.5" />
        <circle cx="370" cy="365" r="4.5" fill="#502d13" opacity="0.8" />
        <circle cx="320" cy="400" r="3" fill="#fef08a" opacity="0.4" />
        <circle cx="360" cy="420" r="5" fill="#ca8a04" opacity="0.5" />

        {/* Drilling Derrick / Rig Structure Silhouette */}
        <g fill="url(#derrickGrad)">
          {/* Main vertical posts (legs) */}
          <path d="M226 325 L244 140 H268 L286 325 H274 L258 152 L238 325 H226 Z" />
          
          {/* Horizontal cross-members */}
          <rect x="242" y="170" width="28" height="4" rx="1" />
          <rect x="238" y="210" width="36" height="5" rx="1" />
          <rect x="234" y="250" width="44" height="5" rx="1" />
          <rect x="229" y="290" width="54" height="6" rx="1" />

          {/* Diagonal cross-bracing (Trusses) */}
          {/* Section 1 (Top) */}
          <line x1="244" y1="140" x2="268" y2="170" stroke="url(#derrickGrad)" strokeWidth="3" />
          <line x1="268" y1="140" x2="244" y2="170" stroke="url(#derrickGrad)" strokeWidth="3" />
          {/* Section 2 */}
          <line x1="242" y1="170" x2="270" y2="210" stroke="url(#derrickGrad)" strokeWidth="3" />
          <line x1="270" y1="170" x2="242" y2="210" stroke="url(#derrickGrad)" strokeWidth="3" />
          {/* Section 3 */}
          <line x1="238" y1="210" x2="274" y2="250" stroke="url(#derrickGrad)" strokeWidth="3.5" />
          <line x1="274" y1="210" x2="238" y2="250" stroke="url(#derrickGrad)" strokeWidth="3.5" />
          {/* Section 4 */}
          <line x1="234" y1="250" x2="278" y2="290" stroke="url(#derrickGrad)" strokeWidth="4" />
          <line x1="278" y1="250" x2="234" y2="290" stroke="url(#derrickGrad)" strokeWidth="4" />
          {/* Section 5 */}
          <line x1="229" y1="290" x2="283" y2="325" stroke="url(#derrickGrad)" strokeWidth="4.5" />
          <line x1="283" y1="290" x2="229" y2="325" stroke="url(#derrickGrad)" strokeWidth="4.5" />

          {/* Top Crown Block & Water Table */}
          <rect x="241" y="130" width="30" height="10" rx="1" />
          <rect x="245" y="118" width="22" height="12" rx="1" />
          <path d="M248 118 L256 104 L264 118 Z" />

          {/* Rig Floor / Substructure Base */}
          <path d="M208 314 H304 V326 H208 Z" />
          <path d="M214 326 H298 L294 336 H218 Z" />
        </g>

        {/* Drill Pipe and Helical Drill Bit boring into soil */}
        {/* Drill pipe / Drill string shaft */}
        <rect x="251" y="295" width="10" height="75" fill="#334155" stroke="#FFFFFF" strokeWidth="2" />

        {/* Spiral Drill Bit */}
        <g transform="translate(240, 345)">
          {/* Bit body background wrapper to make it pop */}
          <path d="M5 0 L27 0 L25 55 L16 68 L7 55 Z" fill="#0f172a" />
          {/* Helical cutters / cones */}
          <path d="M4 8 Q16 14 28 8 L27 18 Q16 24 5 18 Z" fill="url(#bitGrad)" stroke="#1e293b" strokeWidth="1.5" />
          <path d="M5 21 Q16 27 27 21 L25 31 Q16 37 7 31 Z" fill="url(#bitGrad)" stroke="#1e293b" strokeWidth="1.5" />
          <path d="M6 34 Q16 40 26 34 L23 44 Q16 50 9 44 Z" fill="url(#bitGrad)" stroke="#1e293b" strokeWidth="1.5" />
          {/* Bit tip */}
          <path d="M9 46 L23 46 L16 62 Z" fill="#64748b" stroke="#1e293b" strokeWidth="1.5" />
          {/* Shine outline on the bit */}
          <path d="M16 60 L21 46" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
        </g>

        {/* White outline for the bottom of the drill bit inside the earth */}
        <path
          d="M239 402 L256 415 L273 402"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

      </g>
    </svg>
  );
}
