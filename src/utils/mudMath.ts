import { CalculatorInputs, CalculatorOutputs } from "../types";

// ---------------------------------------------------------------------------
// Unit conversion constants
// ---------------------------------------------------------------------------
export const BBL_TO_GAL = 42;
export const BBL_TO_M3 = 0.158987;
export const PPG_TO_SG = 0.119826;
export const FT_TO_M = 0.3048;
export const PSI_TO_BAR = 0.0689476;
export const GPM_TO_LPM = 3.78541;
export const YP_TO_PA = 0.478803;

// ---------------------------------------------------------------------------
// Standard API drill pipe sizes.
// Published outer and inner diameters — NOT estimated.
// ---------------------------------------------------------------------------
export interface DrillPipeSize {
  id: string;
  label: string;
  od: number;
  innerDiameter: number;
}

export const DRILL_PIPE_SIZES: DrillPipeSize[] = [
  { id: "dp-2375-665", label: '2-3/8" — 6.65 lb/ft', od: 2.375, innerDiameter: 1.815 },
  { id: "dp-2875-1040", label: '2-7/8" — 10.40 lb/ft', od: 2.875, innerDiameter: 2.151 },
  { id: "dp-3500-1330", label: '3-1/2" — 13.30 lb/ft', od: 3.5, innerDiameter: 2.764 },
  { id: "dp-3500-1550", label: '3-1/2" — 15.50 lb/ft', od: 3.5, innerDiameter: 2.602 },
  { id: "dp-4000-1400", label: '4" — 14.00 lb/ft', od: 4.0, innerDiameter: 3.34 },
  { id: "dp-4500-1660", label: '4-1/2" — 16.60 lb/ft', od: 4.5, innerDiameter: 3.826 },
  { id: "dp-5000-1950", label: '5" — 19.50 lb/ft', od: 5.0, innerDiameter: 4.276 },
  { id: "dp-5500-2190", label: '5-1/2" — 21.90 lb/ft', od: 5.5, innerDiameter: 4.778 },
  { id: "dp-5500-2470", label: '5-1/2" — 24.70 lb/ft', od: 5.5, innerDiameter: 4.67 },
  { id: "dp-6625-2520", label: '6-5/8" — 25.20 lb/ft', od: 6.625, innerDiameter: 5.965 },
];

export const DEFAULT_PIPE_ID = "dp-5000-1950";

export function getDrillPipeById(id: string): DrillPipeSize {
  return (
    DRILL_PIPE_SIZES.find((p) => p.id === id) ??
    DRILL_PIPE_SIZES.find((p) => p.id === DEFAULT_PIPE_ID)!
  );
}

// ---------------------------------------------------------------------------
// Shared math — ONE source of truth. Every screen and readout calls these.
// ---------------------------------------------------------------------------

/** Capacity in bbl/ft for a round bore of given inner diameter (inches). */
export function boreCapacityBblPerFt(innerDiameterIn: number): number {
  if (innerDiameterIn <= 0) return 0;
  return (innerDiameterIn * innerDiameterIn) / 1029.4;
}

/** Annular capacity in bbl/ft between a hole and a pipe (inches). */
export function annularCapacityBblPerFt(holeIdIn: number, pipeOdIn: number): number {
  const diff = holeIdIn * holeIdIn - pipeOdIn * pipeOdIn;
  if (diff <= 0) return 0;
  return diff / 1029.4;
}

/** Annular velocity, ft/min. */
export function annularVelocityFtMin(
  flowGpm: number,
  holeIdIn: number,
  pipeOdIn: number
): number {
  const area = holeIdIn * holeIdIn - pipeOdIn * pipeOdIn;
  if (area <= 0 || flowGpm <= 0) return 0;
  return (24.5 * flowGpm) / area;
}

/**
 * Bingham Plastic critical velocity, ft/min.
 * Above this the annular flow is turbulent.
 */
export function criticalVelocityFtMin(
  mudWeightPpg: number,
  pvCp: number,
  ypLb100: number,
  holeIdIn: number,
  pipeOdIn: number
): number {
  const gap = holeIdIn - pipeOdIn;
  if (gap <= 0 || mudWeightPpg <= 0) return 0;
  const root = Math.sqrt(
    pvCp * pvCp + 8.2 * mudWeightPpg * ypLb100 * gap * gap
  );
  return (97 * pvCp + 97 * root) / (mudWeightPpg * gap);
}

/**
 * Annular pressure loss over a length, psi — Bingham Plastic model.
 * Laminar and turbulent branches, selected by critical velocity.
 * This is a single-section, single-fluid model. It is an engineering
 * estimate for demonstration, not a substitute for a full hydraulics run.
 */
export function annularPressureLossPsi(
  mudWeightPpg: number,
  pvCp: number,
  ypLb100: number,
  flowGpm: number,
  holeIdIn: number,
  pipeOdIn: number,
  lengthFt: number
): { pressureLoss: number; velocity: number; critical: number; turbulent: boolean } {
  const gap = holeIdIn - pipeOdIn;
  if (gap <= 0 || lengthFt <= 0 || flowGpm <= 0) {
    return { pressureLoss: 0, velocity: 0, critical: 0, turbulent: false };
  }

  const velocity = annularVelocityFtMin(flowGpm, holeIdIn, pipeOdIn);
  const critical = criticalVelocityFtMin(mudWeightPpg, pvCp, ypLb100, holeIdIn, pipeOdIn);
  const turbulent = velocity > critical;

  let pressureLoss: number;

  if (turbulent) {
    pressureLoss =
      (7.7e-5 *
        Math.pow(mudWeightPpg, 0.8) *
        Math.pow(pvCp, 0.2) *
        Math.pow(flowGpm, 1.8) *
        lengthFt) /
      (Math.pow(gap, 3) * Math.pow(holeIdIn + pipeOdIn, 1.8));
  } else {
    const viscousTerm = (lengthFt * pvCp * velocity) / (60000 * gap * gap);
    const yieldTerm = (lengthFt * ypLb100) / (200 * gap);
    pressureLoss = viscousTerm + yieldTerm;
  }

  if (!isFinite(pressureLoss) || pressureLoss < 0) pressureLoss = 0;

  return { pressureLoss, velocity, critical, turbulent };
}

/** Equivalent Circulating Density, ppg. */
export function equivalentCirculatingDensity(
  mudWeightPpg: number,
  annularLossPsi: number,
  tvdFt: number
): number {
  if (tvdFt <= 0) return mudWeightPpg;
  return mudWeightPpg + annularLossPsi / (0.052 * tvdFt);
}

// ---------------------------------------------------------------------------
// Main entry point used by the simulator.
// ---------------------------------------------------------------------------
export function calculateMudFlow(inputs: CalculatorInputs): CalculatorOutputs {
  const {
    mudWeight,
    measuredDepth,
    trueVerticalDepth,
    casingID,
    drillPipeOD,
    drillPipeID,
    pumpFlowRate,
    plasticViscosity,
    yieldPoint,
  } = inputs;

  const isGeometryValid = casingID > drillPipeOD;

  // 1. Hydrostatic pressure, psi
  const hydrostaticPressure = 0.052 * mudWeight * trueVerticalDepth;

  // 2. Drillstring volume — uses the REAL published pipe ID
  const drillPipeVolume = boreCapacityBblPerFt(drillPipeID) * measuredDepth;

  // 3. Annular volume
  const annularVolume = isGeometryValid
    ? annularCapacityBblPerFt(casingID, drillPipeOD) * measuredDepth
    : 0;

  // 4. Total fluid volume
  const wellVolume = drillPipeVolume + annularVolume;

  // 5. Lag time — bottoms up through the annulus, minutes
  const flowRateBpm = pumpFlowRate / BBL_TO_GAL;
  const lagTime = flowRateBpm > 0 ? annularVolume / flowRateBpm : 0;

  // 6. Annular friction, flow regime and ECD
  const friction = isGeometryValid
    ? annularPressureLossPsi(
        mudWeight,
        plasticViscosity,
        yieldPoint,
        pumpFlowRate,
        casingID,
        drillPipeOD,
        measuredDepth
      )
    : { pressureLoss: 0, velocity: 0, critical: 0, turbulent: false };

  const bottomHolePressure = hydrostaticPressure + friction.pressureLoss;
  const ecd = equivalentCirculatingDensity(
    mudWeight,
    friction.pressureLoss,
    trueVerticalDepth
  );

  const round = (n: number, d: number) => parseFloat(n.toFixed(d));

  return {
    hydrostaticPressure: round(hydrostaticPressure, 0),
    wellVolume: round(wellVolume, 1),
    drillPipeVolume: round(drillPipeVolume, 1),
    annularVolume: round(annularVolume, 1),
    lagTime: round(lagTime, 1),
    annularVelocity: round(friction.velocity, 0),
    criticalVelocity: round(friction.critical, 0),
    flowRegime: isGeometryValid ? (friction.turbulent ? "Turbulent" : "Laminar") : "—",
    annularPressureLoss: round(friction.pressureLoss, 0),
    bottomHolePressure: round(bottomHolePressure, 0),
    ecd: round(ecd, 2),
    isGeometryValid,
  };
}
