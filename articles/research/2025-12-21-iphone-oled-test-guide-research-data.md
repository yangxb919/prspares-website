# Research Data Collection
**Date:** 2025-12-21
**Topic:** iPhone OLED Test Guide - Screen Quality, Burn-in & PWM

## Key Statistics & Data Points

### iPhone OLED Display Specifications (DisplayMate Data)
1. **iPhone X Display Performance:**
   - Peak brightness: 634 nits (full screen), 809 nits (1% APL)
   - Screen reflectance: 4.5% (ambient light)
   - Color accuracy: 0.9 JNCD (DCI-P3) - "Visually Indistinguishable From Perfect"
   - Contrast ratio: Infinite (true blacks)
   - Viewing angle brightness decrease: 22% at 30 degrees
   - Display power consumption: 1.75W average, 3.25W maximum

2. **iPhone Models with OLED:**
   - iPhone X (2017) - First iPhone with OLED
   - iPhone XS/XS Max (2018)
   - iPhone 11 Pro/Pro Max (2019)
   - iPhone 12 series (2020) - All models OLED
   - iPhone 13 series (2021)
   - iPhone 14 series (2022)
   - iPhone 15 series (2023)
   - iPhone 16 series (2024)
   - iPhone SE (2nd/3rd Gen) - Still LCD

### OLED Burn-in Test Data (Cetizen Study)
3. **510-Hour Burn-in Test Results:**
   - Test duration: 510 hours at full brightness
   - iPhone X: Best performance, minimal burn-in
   - Samsung Note 8: "Very visible burn-in"
   - Samsung S7 Edge: Better than Note 8, worse than iPhone X
   - Source: OLED-Info/Cetizen

4. **Burn-in Timeline (Industry Data):**
   - Visible burn-in can occur after 17+ hours of static image display
   - Normal usage: 2-3 years before noticeable degradation
   - High-risk scenarios: Navigation apps, gaming with static HUD elements

### PWM (Pulse Width Modulation) Data
5. **PWM Frequency Standards:**
   - iPhone OLED PWM: ~240Hz at low brightness (typical)
   - Safe threshold: 3,000Hz+ recommended to avoid eye strain
   - DC Dimming: Alternative method that reduces flicker
   - Affected users: 10-15% of population sensitive to PWM

6. **PWM Health Effects:**
   - Eye strain and fatigue
   - Headaches (especially at low brightness)
   - Symptoms worsen with prolonged use
   - More noticeable in dark environments

### Screen Quality Grades (Industry Standard)
7. **Aftermarket iPhone Screen Grades:**
   - **OEM/Original:** Apple genuine parts, highest quality
   - **Hard OLED:** Rigid OLED panel, good quality, no flexibility
   - **Soft OLED:** Flexible OLED, closest to original
   - **Incell LCD:** LCD technology, no burn-in risk, lower contrast
   - **TFT LCD:** Basic LCD, lowest quality tier

8. **Quality Metrics for Repair Shops:**
   - RMA rate benchmark: <1% excellent, 1-3% acceptable, >3% poor
   - Color accuracy: Delta E <3 acceptable, <1 excellent
   - Brightness uniformity: <10% variance acceptable
   - Touch response: <10ms latency acceptable

### Market Data
9. **iPhone Screen Replacement Market:**
   - Global smartphone repair market: $50+ billion (2024)
   - Average iPhone screen replacement cost: $150-350 (retail)
   - Wholesale OLED screen cost: $30-80 depending on model/grade
   - Profit margin for repair shops: 40-60% on screen replacements

10. **Quality Issues Statistics:**
    - Counterfeit screen rate in market: 15-25% (estimated)
    - Common defects: Dead pixels, uneven brightness, poor touch response
    - True Tone compatibility: Only with proper IC chip transfer

## Testing Methods Summary

### Visual Tests
1. **Black Screen Test:** Display pure black to check for backlight bleed (LCD) or pixel uniformity (OLED)
2. **White Screen Test:** Check for dead pixels, color uniformity
3. **Color Gradient Test:** Verify smooth color transitions, no banding
4. **Viewing Angle Test:** Check color shift at 30-45 degree angles

### Functional Tests
1. **Touch Response Test:** Multi-touch, edge detection, pressure sensitivity
2. **True Tone Test:** Verify ambient light sensor integration
3. **3D Touch/Haptic Test:** Pressure sensitivity (older models)
4. **Face ID Test:** Ensure proper sensor alignment

### Technical Tests
1. **Brightness Test:** Maximum nits, uniformity across screen
2. **PWM Test:** Use slow-motion camera (240fps+) to detect flicker
3. **Burn-in Test:** Display static image for extended period
4. **Color Accuracy Test:** Compare to reference display

## Expert Insights

> "The iPhone X is the most color accurate display that we have ever measured. It is Visually Indistinguishable From Perfect." - DisplayMate

> "Apple engineered the display to be the best in the industry in reducing the effect of OLED burn-in." - Apple (regarding iPhone X)

## Sources
1. DisplayMate - iPhone X OLED Display Technology Shoot-Out
2. OLED-Info - Cetizen iPhone X Burn-in Test
3. NotebookCheck - PWM Testing Methodology
4. Apple Support Documentation
5. Industry repair shop surveys
