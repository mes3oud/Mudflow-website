import { CalculatorInputs, CalculatorOutputs } from "../types";

// Conversion constants
export const BBL_TO_GAL = 42;
export const BBL_TO_M3 = 0.158987;
export const PPG_TO_SG = 0.119826; // ppg to g/cm³ (sg)
export const FT_TO_M = 0.3048;
export const PSI_TO_BAR = 0.0689476;
export const GPM_TO_LPM = 3.78541;

/**
 * Perform drilling fluids and hydraulics calculations
 * Inputs are assumed to be in Imperial units:
 * - mudWeight: ppg
 * - measuredDepth: ft
 * - trueVerticalDepth: ft
 * - casingID: inches
 * - drillPipeOD: inches
 * - pumpFlowRate: gpm
 * - pumpDisplacement: bbl/stroke
 */
export function calculateMudFlow(inputs: CalculatorInputs): CalculatorOutputs {
  const {
    mudWeight,
    measuredDepth,
    trueVerticalDepth,
    casingID,
    drillPipeOD,
    pumpFlowRate,
  } = inputs;

  // 1. Hydrostatic Pressure (psi) = 0.052 * MW (ppg) * TVD (ft)
  const hydrostaticPressure = 0.052 * mudWeight * trueVerticalDepth;

  // 2. Drill Pipe Volume (assuming a standard 5" drill pipe with ~4.276" ID)
  // Let's compute drill pipe ID as roughly drillPipeOD * 0.85
  const dpID = drillPipeOD * 0.85;
  const dpCapacity = Math.pow(dpID, 2) / 1029.4; // bbl/ft
  const drillPipeVolume = dpCapacity * measuredDepth;

  // 3. Annular Capacity (bbl/ft) = (Casing ID^2 - Drill Pipe OD^2) / 1029.4
  // Ensure ID is greater than OD to avoid negative capacities
  const effCasingID = Math.max(casingID, drillPipeOD + 0.1);
  const annularCapacity = (Math.pow(effCasingID, 2) - Math.pow(drillPipeOD, 2)) / 1029.4;
  const annularVolume = annularCapacity * measuredDepth;

  // 4. Well Volume
  const wellVolume = drillPipeVolume + annularVolume;

  // 5. Lag Time (minutes) = Annular Volume (bbl) / Pump Flow Rate (bpm)
  // Flow Rate in bpm = Flow Rate (gpm) / 42
  const flowRateBPM = pumpFlowRate / BBL_TO_GAL;
  const lagTime = flowRateBPM > 0 ? annularVolume / flowRateBPM : 0;

  // 6. Bottom Hole Pressure (psi) = Hydrostatic + Annular Pressure Loss (estimated for interactive visualizer)
  // Estimated Annular Pressure Loss = 0.00007 * MW * MD * (FlowRate / 100)^1.8 / (CasingID - PipeOD)^3
  const diameterDiff = Math.max(0.1, effCasingID - drillPipeOD);
  const annularLoss =
    (0.00007 * mudWeight * measuredDepth * Math.pow(pumpFlowRate / 100, 1.8)) /
    Math.pow(diameterDiff, 3);
  const bottomHolePressure = hydrostaticPressure + (isNaN(annularLoss) ? 0 : annularLoss);

  return {
    hydrostaticPressure: parseFloat(hydrostaticPressure.toFixed(2)),
    wellVolume: parseFloat(wellVolume.toFixed(2)),
    drillPipeVolume: parseFloat(drillPipeVolume.toFixed(2)),
    annularVolume: parseFloat(annularVolume.toFixed(2)),
    lagTime: parseFloat(lagTime.toFixed(1)),
    bottomHolePressure: parseFloat(bottomHolePressure.toFixed(2)),
  };
}
