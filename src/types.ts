export interface CalculatorInputs {
  mudWeight: number; // in ppg
  measuredDepth: number; // in ft
  trueVerticalDepth: number; // in ft
  casingID: number; // in inches
  drillPipeOD: number; // in inches
  pumpFlowRate: number; // in gpm
  pumpDisplacement: number; // bbl/stroke
}

export interface CalculatorOutputs {
  hydrostaticPressure: number; // psi
  wellVolume: number; // bbl
  drillPipeVolume: number; // bbl
  annularVolume: number; // bbl
  lagTime: number; // minutes
  bottomHolePressure: number; // psi
}

export interface FeedbackMessage {
  id: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  date: string;
  appVersion: string;
}
