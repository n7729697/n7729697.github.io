---
name: Line-Following AGV with an 8-Sensor IR Array on an ARM Cortex-M3 (CityU MNE3058 Embedded Control, 2021)
tools: [C, ARM Cortex-M3 (LPC1343), LPCXpresso, Timer PWM, GPIO, UART, IR reflective sensor array, PID control]
image: /files/line-following-agv/cover-placeholder.png
description: A course project in Embedded Control Systems at City University of Hong Kong. An 8-sensor infrared line-tracking AGV on an LPC1343 follows a black line and must cross broken segments in a timed competition. This page documents the firmware as built, reviews its weaknesses honestly, and sets out how the same hardware would be engineered to competition grade, with a simulation study of the design trade-offs.
---

# **Line-Following AGV with an 8-Sensor IR Array on an ARM Cortex-M3**

<i class="fas fa-university"></i> City University of Hong Kong, MNE3058 Embedded Control Systems, Semester B 2020/21, team of four, report submitted 18 May 2021

The line-tracking car ("巡线小车", "循迹小车") is the classic embedded-systems benchmark: a small differential-drive vehicle, a row of reflective infrared sensors, a microcontroller, and a track. It is simple to start and hard to do well, because it combines **sensing** (noisy, quantized, lighting-dependent), **real-time control** (a loop that must run at a fixed rate), **actuation** (PWM into motors with friction and lag), and **decision logic** (what to do when the line disappears). This project used it to apply C programming, GPIO and timer programming, PWM, UART, PID control and software design on a 32-bit ARM Cortex-M3.

> **Figure placeholder 1 (needed from you).** A photo of the finished AGV from above, with the 8-sensor array visible, and a photo of the competition track with a broken segment. Suggested filenames: `/files/line-following-agv/agv-top.jpg` and `/files/line-following-agv/track.jpg`.

![A line-following robot with infrared sensors (illustrative example, not our vehicle)](https://commons.wikimedia.org/wiki/Special:FilePath/Line_follower.jpg?width=700)
Figure 1. An illustrative line follower with two reflective IR sensors and a motor shield (not our vehicle; shown only to illustrate the concept). Source: [File:Line follower.jpg](https://commons.wikimedia.org/wiki/File:Line_follower.jpg). License: CC BY-SA 3.0.

## 1. The task and how it is scored

The course ran an AGV navigation competition on two tracks:

- the **standard track**: mainly solid black lines with **one broken segment**;
- the **advanced track**: black lines with **several broken segments**, which need "intelligent line searching".

Each team had **5 minutes** and could run either track as many times as it could. A completed standard run scored **1 point** and a completed advanced run **10 points**; the last minute had to be spent on the advanced track. The best team received the maximum competition mark (50%), with a deduction of 3 marks if a top-three team had never completed the advanced track. The scoring is deliberately lopsided: **one advanced run is worth ten standard runs**, so the broken-line behaviour, not the straight-line speed, decides the ranking.

## 2. Platform and firmware architecture

| Item | Detail |
| --- | --- |
| Microcontroller | NXP LPC1343, ARM Cortex-M3, 72 MHz system clock |
| Toolchain | LPCXpresso 4.x (Eclipse, GCC), CMSIS for LPC13xx |
| Sensors | 8 digital IR reflective sensors on GPIO port 2 (read with one masked 8-bit access) |
| Actuators | two DC motors, each driven by two PWM channels from a 16-bit timer (forward and reverse) |
| Interfaces | UART at 115200 baud for telemetry; 8 push-buttons for mode and speed |
| Base code | course-provided framework (timers, UART, keys, ADC, startup); we extended the sensor, control and main modules |

The firmware is a **polled super-loop** with timers for PWM:

```
 main():  io_init(); timer_init(); uart_init(115200); adc_init(); sensor_init(); keys_init();
          while (1) {
            sensor_filter();        // read the 8 sensors, debounce, compute centroid, track blindness
            keys_filter();          // read buttons, set mode and base speed
            switch (mode) { stop / forward / backward / spin / pid_line_tracking() }
            if (report_flag) report();   // telemetry over UART, flagged by a timer tick
          }
```

Each motor channel is a 16-bit timer in PWM mode with a prescaler that gives a 10 kHz count rate and a period register of 100, so the PWM has **100 steps of resolution** (duty 0 to 100) at a frequency of about **99 Hz**. A signed command from the controller is split into a magnitude on the forward channel or on the reverse channel.

## 3. Sensing: from 8 bits to a line position

Eight bits come from one masked GPIO read. The pipeline in `sensor_filter()` is:

1. **Polarity.** For a black line the bits are inverted so that "1" means line detected.
2. **Per-sensor debounce.** Each sensor has a counter that rises while the sensor sees black and falls otherwise; a sensor counts as "on" only after its counter exceeds `THRESHOLD` (100). This stops specks and stains outside the line from being accepted.
3. **Centroid.** With $n$ sensors on and $a_i\in\{1,\dots,8\}$ their addresses, the position is

$$
c=\left\lfloor\frac{2\sum a_i}{n}\right\rfloor-8,
$$

in units of **half a sensor pitch**, positive when the line is on the left.

| Sensors on (1-based) | $2\sum a_i/n$ | Centroid $c$ |
| --- | --- | --- |
| 4 | 8 | 0 |
| 3, 4, 5 | 8 | 0 |
| 4, 5 | 9 | 1 |
| 5 | 10 | 2 |

I checked this table by hand and by code. Two properties of the formula matter: the resolution is only half a sensor pitch and integer-truncated, and the **zero point sits on sensor 4, not midway between sensors 4 and 5**: with eight sensors the geometric centre of the array reads $c=1$. The array therefore tracks with a constant lateral bias of half a pitch (a few millimetres on a typical array). The constant $-8$ was carried over from the 3-sensor version of the course code, where $-4$ was correct.

## 4. Control: PID and the error history

The controller drives the difference between the two wheels. With setpoint zero, $e_k=-c_k$ and a circular buffer of the last ten errors with running sum $S_k$:

$$
u_k=k_pe_k+k_iS_k+k_d\,(c_k-c_{k-1}),\qquad
\text{left}=\text{base}+u_k,\quad \text{right}=\text{base}-u_k,
$$

each wheel command clipped to $\pm100$. We used $k_p=5$, $k_i=1$ (the code writes `ki=1.5` into an `int`, which truncates to 1), $k_d=1$, base duty 50, with the speed adjustable by buttons. The design reasoning in the report is sound: because the car must cross gaps and move fast, proportional action dominates, and $k_i$ and $k_d$ are kept small.

## 5. Broken lines: the strategy as built

When all sensors have been off long enough, a `blind_flag` is raised. In blind mode the car **rotates in place** (clockwise or counter-clockwise, chosen from the sign of the last recorded error) until a sensor sees the line again. The report also discusses a more general search (an ant-colony-style alternation of search directions) and rejects it for this competition because of response time. Before `blind_flag` is set, the code keeps using the last centroid, so the car continues to steer by its last error through short gaps.

## 6. A critical review of this implementation

The system met the course objectives and tracked a line, but a hard look at the code shows why it would not be competitive on the advanced track. These are the main weaknesses, with their consequences:

1. **Time is counted in loop iterations, not in seconds.** The debounce threshold (100) and the blind timeout (1000) are loop counts, so their meaning depends on how fast the super-loop runs, and that changes whenever code is added. If the loop runs at 1 kHz, 100 counts is 100 ms (25 mm of travel at 0.25 m/s) and 1000 counts is 1 s (250 mm); at 10 kHz these become 10 ms and 100 ms (25 mm). The blind timeout decides whether the car passes a gap or starts spinning inside it.
2. **The PID has no fixed sample time.** It runs once per super-loop pass. The derivative term $c_k-c_{k-1}$ is then nearly always zero (the centroid rarely changes between consecutive passes) and its effect depends on the loop speed, and the "integral" is a sum of the last ten passes, which is closer to a second proportional term than to an integral.
3. **Wrong history sample in blind mode.** After each pass the buffer index advances, so in blind mode the code reads `error[error_index]`, an older entry that changes every pass, instead of the most recent error, so the spin direction is not guaranteed to follow the last-seen side of the line.
4. **Centroid bias and quantization** (section 3).
5. **No speed feedback and no gap-aware motion.** Without wheel encoders the commanded duty is only a rough proxy for speed, and a gap of a given length cannot be converted into a time or distance.
6. **PWM at about 100 Hz** is low for small DC motors (audible, and it adds torque ripple and lag); several kilohertz is normal.
7. **Spinning on blindness is a poor reaction to a gap**, which is a normal feature of the track. It throws away the heading the car had; the right first action is to hold the heading and keep moving.
8. **No sensor calibration.** The sensors are digital with a fixed threshold; ambient light and surface reflectivity are not handled.
9. A **course-template defect** that we left in place: the handler for 32-bit timer 1 reads the interrupt register of 32-bit timer 0. It is harmless here because those timers are disabled, but it would bite as soon as timer 1 is used.

## 7. The same hardware, engineered to competition grade

The structure below is the standard recipe for tracking cars in national electronic design contests ("电赛"), adapted to this vehicle. For the structure I followed the common pattern shown in open-source line-following tutorials for 8-channel infrared modules (four inner sensors for fine tracking, four outer sensors for large curves and early warning); I could not retrieve the code of those tutorials, so the details below are general practice, not a copy of any one implementation.

```
 timer ISR @ 500 Hz - 1 kHz (fixed Ts)                                     background
 ------------------------------------------------                          -----------
  sensors --> [calibrate + normalise] --> [position estimate] --> [state machine] --> [steering PD] --\
  (ADC or GPIO)    per-sensor min/max         weighted, symmetric     TRACK / CURVE /        derivative on  \--> [wheel speed PI x2] --> PWM (>= 10 kHz)
                                                                       GAP / JUNCTION /       measurement          ^
  encoders --> [speed + odometry] ---------------------------------> SEARCH / STOP                              | feedforward
  gyro (optional) --> [heading] --------------------------------------^                                         v
                                                                                              UART logging (DMA), button UI
```

The design decisions:

- **Fixed-rate loop in a timer interrupt.** Run sensing and control at a fixed period $T_s$ (for example 1 ms), so every gain, delay, and timeout has units of seconds and survives changes elsewhere. Keep the ISR short, and keep printing and logging out of it.
- **Calibrated position estimate.** Calibrate each sensor to its own black and white levels at start-up and compute the position from normalized readings, using symmetric weights $w_i=i-3.5$ so that the centre reads exactly zero:

$$
x=\frac{\sum_i w_i\,s_i}{\sum_i s_i},\qquad s_i\in[0,1].
$$

- **Inner and outer sensors.** Use the four inner sensors for fine tracking (a small linear range, a high gain), and the outer four as a **curve and junction detector**: when an outer sensor sees the line, slow down early, and for a sharp corner switch to a pivot turn instead of waiting for the PD loop to wind up.
- **PD on a fixed sample time, with derivative on the measurement.** $u=k_p\,x+k_d\,\dot x$ with $\dot x$ computed over $T_s$ and low-pass filtered. A small integral term is rarely needed with a symmetric array and only invites windup.
- **Speed scheduling.** Command a lower base speed as $|x|$ grows or as outer sensors fire, and a higher speed on straights. Cornering speed, not straight-line speed, sets lap time.
- **Cascaded control.** Put a wheel-speed PI loop (from encoders) under the steering loop, so the steering command is a differential *speed*, not a duty, and the car behaves the same on a low battery. Add feedforward for the known motor constants.
- **PWM at 10 to 20 kHz** with a dead-time-safe H-bridge sequence, so that the motors respond smoothly.
- **Gap handling as a state, with distance.** When the line disappears, do not turn: **hold the current heading and steering** and drive on for the expected gap length plus a margin, measured by encoder odometry (or time at a known speed). If the line has not reappeared by then, start a **bounded search**: an alternating sweep whose amplitude grows, starting on the side the line was last seen. The gap length bound is a parameter of the competition rules and must be known or measured.
- **A proper state machine** for TRACK, CURVE, GAP, SEARCH, JUNCTION, FINISH, and FAULT, each with explicit entry and exit conditions and timeouts, and a safe default (stop) on a fault.
- **Test discipline.** Log sensor bits, position, commands, and speeds to the UART (or to RAM, dumped after the run), and tune in the order: speed loops, then steering $k_p$, then $k_d$, then the speed schedule, then the gap logic.

## 8. Simulation study: why the details matter

To check these arguments I built a small simulation of this vehicle class (my own model, not a hardware test). Assumptions: differential drive, wheel base 120 mm, an 8-sensor array 80 mm ahead of the axle at 12 mm pitch, a 20 mm black line, a track of straights and two 90° arcs of radius 350 mm with broken segments of 100 to 150 mm, a first-order motor lag of 60 ms, a 0.5% per-sample random sensor flip rate, and random start offsets of ±15 mm and ±6° (20 runs per cell). The actual lab track dimensions are not recorded in my files, so these are generic.

I coded the course algorithm in the same structure (loop-count debounce, integer centroid with the $-8$ offset, positional PID over a ten-sample history, blind spin) and a redesigned controller (fixed-rate PD on a symmetric centroid, a 5-sample majority filter, speed scheduling, hold-heading through gaps, bounded sweep search).

| Case | Course-style, debounce 5 loops | Course-style, debounce 100 loops (as built) | Redesigned |
| --- | --- | --- | --- |
| Gaps 0.10 to 0.15 m, base duty 50 | 20 of 20 | 0 of 20 | 20 of 20 |
| Gaps 0.10 to 0.15 m, base duty 80 | 20 of 20 | 0 of 20 | 20 of 20 |
| All four gaps about twice as long in one run, base duty 80 | 0 of 20 | 0 of 20 | 4 of 20 |

What I take from it (and what I do not):

- The as-built constants fail under noise: with a debounce of 100 loop passes the line is accepted too late, and the result depends entirely on the loop rate (a noise-free check at 1 kHz and 10 kHz also failed the track with a mid-curve gap). Setting the loop count wrongly is the same bug as hard-coding the wrong time.
- A short debounce, as in the lightweight course-style variant, is competitive for short gaps, which is consistent with how the course code was used in practice.
- The redesign matches the better baseline on short gaps. Single long gaps (0.24 m on the straights, or 0.24 m in the middle of a curve) were passed 20 of 20 times, but putting all four long gaps into one run failed in most runs (4 of 20) and I did not isolate the cause. My reading is that **dead reckoning through gaps needs a heading reference and a known gap length**, which is the argument for encoders and a gyro; I have not tested that. The claim I can support is narrower: with the redesign, the failure is governed by explicit parameters (hold distance, filter, gains) instead of by an accident of loop timing.

## 9. What I would do next, and what I need from you

- **Hardware validation.** Run the redesigned controller on the real vehicle, with encoders added, and record: completed runs of each track in a five-minute session, run time, and the loop rate with a logic analyser on a spare pin.
- **Tooling.** Move the state machine to a timer-driven scheduler (or an RTOS such as Zephyr, see the sensor-node project) and add a UART logger.

> **Figure placeholders 2 to 4 (needed from you).** (2) A screenshot or photo of the UART telemetry for one run (sensor bits, centroid, duty). (3) A scope or logic-analyser trace of the PWM output. (4) A short video link of the AGV crossing a gap.

*The course supplied the base framework and the track; the sensor extension to eight channels, the centroid, PID, and blind logic were written by our team in March 2021. Gap lengths and loop rate are not recorded in my files, so the study above uses stated assumptions, not measured values.*
