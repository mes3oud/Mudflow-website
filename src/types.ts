export interface CalculatorInputs {
  mudWeight: number;          // ppg
  measuredDepth: number;      // ft
  trueVerticalDepth: number;  // ft
  casingID: number;           // inches (hole or casing inner diameter)
  drillPipeOD: number;        // inches
  drillPipeID: number;        // inches (real published ID, never estimated)
  drillPipeSizeId: string;    // stable id of the selected pipe size
  pumpFlowRate: number;       // gpm
  pumpDisplacement: number;   // bbl/stroke
  plasticViscosity: number;   // cP
  yieldPoint: number;         // lb/100 ft²
}

export interface CalculatorOutputs {
  hydrostaticPressure: number;   // psi
  wellVolume: number;            // bbl
  drillPipeVolume: number;       // bbl
  annularVolume: number;         // bbl
  lagTime: number;               // minutes
  annularVelocity: number;       // ft/min
  criticalVelocity: number;      // ft/min
  flowRegime: "Laminar" | "Turbulent" | "—";
  annularPressureLoss: number;   // psi
  bottomHolePressure: number;    // psi
  ecd: number;                   // ppg
  isGeometryValid: boolean;      // false when pipe OD >= hole ID
}
