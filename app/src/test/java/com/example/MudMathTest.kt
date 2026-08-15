package com.example

import com.example.ui.MudMath
import com.example.ui.apiScreenTable
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Locks the verified drilling-fluid formulas in [MudMath] and the API RP 13C screen table.
 *
 * Every expected value here was checked against standard field references. If one of these
 * fails, the formula changed - not the test.
 */
class MudMathTest {

    private val eps = 1e-4

    // ---------- Physics constants (guard against silent edits) ----------

    @Test
    fun hydrostaticGradientConstantIs0052() {
        assertEquals(0.052, MudMath.hydrostaticPressure(1.0, 1.0), 1e-9)
    }

    @Test
    fun capacityDenominatorIs1029point4() {
        assertEquals(1.0 / 1029.4, MudMath.capacity(1.0), 1e-12)
    }

    @Test
    fun annularVelocityConstantIs2451() {
        assertEquals(24.51, MudMath.annularVelocity(1.0, 1.0, 0.0), 1e-9)
    }

    // ---------- Hydrostatic pressure / ECD ----------

    @Test
    fun hydrostaticPressure_12ppg_10000ft() {
        assertEquals(6240.0, MudMath.hydrostaticPressure(12.0, 10000.0), eps)
    }

    @Test
    fun ecd_addsAnnularLossOverGradient() {
        // 12 + 300 / (0.052 * 10000) = 12.576923
        assertEquals(12.576923, MudMath.ecd(12.0, 300.0, 10000.0), eps)
    }

    @Test
    fun ecd_returnsMudWeightWhenTvdIsZero() {
        assertEquals(12.0, MudMath.ecd(12.0, 300.0, 0.0), eps)
    }

    // ---------- Capacity / displacement ----------

    @Test
    fun capacity_5inDrillPipeBore() {
        // 4.276 in ID -> 4.276^2 / 1029.4
        assertEquals(0.017762, MudMath.capacity(4.276), eps)
    }

    @Test
    fun displacement_5inDrillPipeSteel() {
        assertEquals(0.006524, MudMath.displacement(5.0, 4.276), eps)
    }

    @Test
    fun annularCapacity_8point5HoleBy5inPipe() {
        // Classic field value: 0.0459 bbl/ft
        assertEquals(0.045901, MudMath.annularCapacity(8.5, 5.0), eps)
    }

    @Test
    fun annularCapacity_returnsZeroWhenPipeNotSmallerThanHole() {
        assertEquals(0.0, MudMath.annularCapacity(5.0, 5.0), eps)
        assertEquals(0.0, MudMath.annularCapacity(5.0, 8.5), eps)
    }

    // ---------- Annular velocity ----------

    @Test
    fun annularVelocity_500gpm_8point5by5() {
        // 24.51 * 500 / (8.5^2 - 5^2) = 259.3651
        assertEquals(259.3651, MudMath.annularVelocity(500.0, 8.5, 5.0), 1e-3)
    }

    @Test
    fun annularVelocity_returnsZeroForNonPositiveAnnulus() {
        assertEquals(0.0, MudMath.annularVelocity(500.0, 5.0, 5.0), eps)
        assertEquals(0.0, MudMath.annularVelocity(500.0, 5.0, 8.5), eps)
    }

    // ---------- Rheology ----------

    @Test
    fun plasticViscosityAndYieldPoint() {
        val pv = MudMath.pv(60.0, 40.0)
        assertEquals(20.0, pv, eps)
        assertEquals(20.0, MudMath.yp(40.0, pv), eps)
    }

    @Test
    fun apparentViscosityIsHalfOfTheta600() {
        assertEquals(30.0, MudMath.av(60.0), eps)
    }

    @Test
    fun plasticViscosityNeverNegative() {
        assertEquals(0.0, MudMath.pv(40.0, 60.0), eps)
    }

    @Test
    fun powerLawN_60over40() {
        // 3.32 * log10(60/40) = 0.584623
        assertEquals(0.584623, MudMath.powerLawN(60.0, 40.0), eps)
    }

    @Test
    fun powerLawK_matchesNFrom60over40() {
        val n = MudMath.powerLawN(60.0, 40.0)
        // 40 / 511^n = 1.043853
        assertEquals(1.043853, MudMath.powerLawK(40.0, n), 1e-3)
    }

    @Test
    fun powerLawGuardsAgainstZeroReadings() {
        assertEquals(1.0, MudMath.powerLawN(60.0, 0.0), eps)
        assertEquals(0.0, MudMath.powerLawK(0.0, 0.5), eps)
    }

    // ---------- Brine ----------

    @Test
    fun brineDensity_10PercentByWeight() {
        // 8.33 * (1 + 0.0075 * 10) = 8.95475
        assertEquals(8.95475, MudMath.brineDensity(10.0), eps)
    }

    @Test
    fun saltRequired_100bblAt20Percent() {
        // 100 * 350 * (20 / 80) = 8750
        assertEquals(8750.0, MudMath.saltRequired(100.0, 20.0), eps)
    }

    @Test
    fun saltRequired_returnsZeroAtOrAboveSaturationInput() {
        assertEquals(0.0, MudMath.saltRequired(100.0, 100.0), eps)
    }

    // ---------- Slug ----------

    @Test
    fun slugVolume_standardCase() {
        // (100 * 0.01776 * 12) / (15 - 12) = 7.104
        assertEquals(7.104, MudMath.slugVolume(100.0, 0.01776, 12.0, 15.0), 1e-3)
    }

    @Test
    fun slugVolume_returnsZeroWhenSlugNotHeavierThanMud() {
        assertEquals(0.0, MudMath.slugVolume(100.0, 0.01776, 15.0, 12.0), eps)
        assertEquals(0.0, MudMath.slugVolume(100.0, 0.01776, 12.0, 12.0), eps)
    }

    // ---------- API RP 13C screen table (shale shaker) ----------

    @Test
    fun apiScreenTableHasSeventeenRows() {
        assertEquals(17, apiScreenTable.size)
    }

    @Test
    fun apiScreenTableRowsAreWellFormedAndDescending() {
        apiScreenTable.forEach { row ->
            assertTrue("API ${row.apiNumber} has lower >= upper", row.lower < row.upper)
        }
        for (i in 1 until apiScreenTable.size) {
            assertTrue(
                "Table must run coarse to fine",
                apiScreenTable[i].upper <= apiScreenTable[i - 1].lower
            )
        }
    }

    @Test
    fun cutPointLookup_75micronsIsApi200() {
        val match = apiScreenTable.find { 75.0 > it.lower && 75.0 <= it.upper }
        assertNotNull(match)
        assertEquals(200, match!!.apiNumber)
    }

    @Test
    fun cutPointLookup_120micronsIsApi120() {
        val match = apiScreenTable.find { 120.0 > it.lower && 120.0 <= it.upper }
        assertNotNull(match)
        assertEquals(120, match!!.apiNumber)
    }

    @Test
    fun cutPointLookupBoundariesAreExclusiveLowerInclusiveUpper() {
        val upper = apiScreenTable.find { 82.5 > it.lower && 82.5 <= it.upper }
        assertEquals(200, upper!!.apiNumber)
        val lower = apiScreenTable.find { 69.0 > it.lower && 69.0 <= it.upper }
        assertEquals(230, lower!!.apiNumber)
    }

    @Test
    fun cutPointLookupReturnsNothingOutsideTheTable() {
        assertNull(apiScreenTable.find { 3000.0 > it.lower && 3000.0 <= it.upper })
    }
}
