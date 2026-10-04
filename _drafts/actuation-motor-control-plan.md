# Plan: Actuation → Electric Machines → Motor Control → Power Electronics → Embedded Real-Time

Working plan (not published: Jekyll ignores `_drafts/`). Not committed. Contains local paths, so do not push it to the public repo as-is.

Deliverables, per "one post, one project":

| Deliverable | File | Role |
|---|---|---|
| **One long post** | `_posts/2026-10-xx-actuation-electric-drives-embedded-control.md` | The knowledge base: 14 parts, anchor TOC, internal cross-references, links to existing posts |
| **One project page** | `_projects/motor-control-hardware.md` | Simulations and real implementations (MF2007, MF2103, MF2043, MF2030), with a provenance table |
| Figures | `assets/img/posts/actuation-drives/`, `files/motor-control/` | New SVG diagrams, re-plotted simulation results, report figures, PCB renders |

Existing posts the new post will link to: control-theory-basics, modern-control-foundations, topics-in-nonlinear-systems, adaptive-control, numerical-linear-algebra-optimization (discretization, least squares), signal-systems (sampling/aliasing), electronics, cpp, distributed-systems, parallel-programming-notes, liegroup-liealgebra (Kalman filter), and the DeLaval project (pneumatic valve under cascade PID).

---

## 1. What the source inspection found

### 1.1 The most important finding

**`D:\KTH\MF2030\project` is a modelling and simulation project, not a physical build.** It contains Simulink/MATLAB models, a 39-page group report (Group 2: Rangaraju, Niu, Pak, HT21) and datasheets for the **Atlas Copco Tensor ETV STB62-50-B10** electric nutrunner and its **Faulhaber 3268 BX4** brushless motor. There is no PCB, MCU, firmware, or measured data in the folder.

The physical layers the brief asks for do exist, but in three other courses. Together they form one complete drive chain:

| Layer | Source | What is real there |
|---|---|---|
| Application, mechanics, load, system model | **MF2030** project | Nutrunner model: DC-equivalent motor, 2-stage planetary (n = 81 chosen), 4th-order two-mass model, screw/joint stiffness, PI speed control for rundown and clamping, energy per tightening |
| Measured motor, identification, discrete control on hardware | **MF2007** workshops A/B | LAUNCHXL-F28379D (C2000, 200 MHz) in Simulink external mode; DC motor with 3600 ppr encoder; identified J, d_m, F_c; discrete PI/PID/RST at 2-50 ms; anti-windup; trajectory planner; model-following feedforward; hand-written controller code; sensitivity robustness; hydraulic cylinder |
| Power stage, sensing, filtering (my own PCBs, Eagle) | **MF2043** labs 1-4 | 24 V → 12 V buck (LM2576) + 5 V linear (LM317); solenoid driver (IRFB7446); **A4973 PWM full-bridge PCB** (R_s = 0.5 Ω current limit, ENABLE/PHASE/MODE, fast/slow decay); **current sensor PCB** (0.1 Ω shunt, INA126, LM358 offset, ±12 V); active anti-alias filters |
| Firmware, peripherals, RTOS, distributed control (real hardware) | **MF2103** project | STM32L476RG Nucleo @ 40 MHz; DC motor shield; Assun AM-CL1643MB-1210 coreless brushed motor + encoder; TIM3 PWM 20 kHz (ARR 2000); TIM1 encoder mode; fixed-point PI; three firmware generations (super-loop → CMSIS-RTOS RTX threads + virtual timers + signals → client/server over TCP with W5500) |
| RTOS/Zephyr, memory, debugging, testing | **uu-pes** (1DT106) | Zephyr threads/mutex/semaphore/priority inversion/devicetree/deferred interrupts (L3), memory map/RMW/set-clear registers/linker/malloc/stack/MPU (L4), testing/HIL (L6), debugging (L7), verification (L8), optimization/alignment (L10); Zephyr ISR→semaphore example; Pico SDK state machines |

There is **no file dated 2021-12-20 in MF2030**. The material from that week is in **MF2043** (lectures 8 digital interface, 9 assembly, 9.5 troubleshooting, 11 electronic design, all 2021-12-18). Actuator material is in MF2030 `C2_Actuators.pdf`, MF2030 Lecture 6 (transducers, PWM, H-bridge, sampling), MF2007 `C2_Actuators21.pdf` (DC motor + gearbox, PWM, hydraulics, combustion/hybrid), and MF2043 Lecture 3 (actuator interfaces).

### 1.2 Source inventory by course

| Course | Key files (local) | Supports parts |
|---|---|---|
| MF2030 | `C2_Actuators.pdf` (DC machine; AC/3-phase; pole number as electrical/mechanical gear; back-EMF by design; servo-drive voltage/current sizing example; switching frequency with Infineon TLE620x data; no-load/short-circuit tests; current phasor, αβ, DQ, two current controllers, DQ voltage equation, cascaded PMSM control); Lectures 4-5 (Faulhaber DC motor modelling, verification vs datasheet, PID, state space); Lecture 6 (transducers, electrostatic/piezo/electromagnetic, sensor/actuator properties, A/D, D/A, PWM, voltage vs current source, H-bridge, freewheel diodes, discretization/quantization/delay, aliasing, sampling-rate selection); Lecture 9 (linearization, MBS, eigenmodes, absolute vs relative actuation/sensing, linear electrical actuator, stiff coupling); two-mass oscillator notes; Janschek *Mechatronic Systems Design* (2012); `Mechatronics_Modeling_HJ`; exams HT19-HT21 + formula sheet; project folder | A, B, C, D, E, F, M, N, project |
| MF2007 | `C1_Modelling21`, `C2_Actuators21`, `C3_Feedback`, `C4_FeedbackDiscrete`, `C5_ServoControl`, `C6_Implementation` (V-model, discrete control, program structure, computing u from TF/SS, fixed vs floating point, scaling), `C7_Robustness`; exercises (modelling, actuators, control, linearisation); inverted pendulum (state feedback, output feedback, continuous vs discrete); Workshop A/B instructions + my group-4 reports + `initPar.m`, `Code_workshopB.m`, `TrajPlan.m`, hydraulic robustness model; BLDC PID thesis PDF | A (hydraulics), D, E, F, J, L, M, N |
| MF2043 | Lectures 1-11 (power supply, actuator interfaces, sensor interfaces, passive/active filters, EMC, transients, digital interface, assembly, troubleshooting, robust design, electronic design); labs 1-4 instructions + prestudies + Eagle `.sch/.brd`; datasheets (LM2576, LM317, A4973, INA111/126, LM324/358, Melexis current-sensor guide) | G, L, M, N, project |
| MF2103 | Seminars 1-6 (embedded computing, RTOS scheduling RMS/EDF, priority inversion, distributed systems); Tutorials 1-5 (Keil, memory-mapped GPIO registers, RTX threads, sockets); project brief (30 pp.) + skeleton + `task1`/`task2`/final sources + CubeMX `.ioc`; Nucleo MB1136 schematics (Altium + PDF); STM32L4 reference manual; Martin *Designer's Guide to Cortex-M*; Wolf ch. 1; exams VT19/20/22 | H, I, J, K, L, M, N, project |
| uu-pes | 11 reveal.js lectures, lab 1 template (RP2040, Pico SDK), `traffic_light_example` (simple / table-driven / queue), `zephyr_blinky_example`, `zephyr_deferred_interrupt_processing` (GPIO ISR → `k_sem_give` → thread, devicetree overlay, `prj.conf`) | H, I, J, K, L |

---

## 2. The common case study: "One drive, four courses"

**Proposal:** the project page and the post's running example are an **electric nutrunner drive**. The application, load and system model come from MF2030; every implemented subsystem comes from a real artefact of mine, and each parameter carries its provenance.

```text
 desired clamp torque 25 N·m, 3 rad/s (MF2030 assignment)
   → trajectory planner + model-following feedforward   [MF2007 Workshop B: TrajPlan.m, real motor]
   → speed/position controller, discrete, anti-windup    [MF2007 Workshop A: RST/PI at 2-50 ms, real motor]
   → torque → current reference                           [MF2030 model: k_t, gear n, efficiency]
   → current controller                                   [MF2043 lab 4-5: shunt sensor built; current loop was lab 5]
   → PWM duty in firmware (fixed-point)                   [MF2103: TIM3 CCR1/CCR2, ±2·10⁹ ↔ ±100 %]
   → H-bridge / inverter                                  [MF2043 lab 2: A4973 PCB; MF2103 motor shield]
   → winding voltage/current → torque                     [MF2030: Faulhaber 3268 BX4 (BLDC); MF2103: Assun coreless DC]
   → 2-stage planetary + 90° angle gear                   [MF2030 model, Tensor handbook]
   → nut / screw / joint stiffness                        [MF2030 model: M8×1.25, class 8.8]
   → encoder / current sensor → ADC/timer                 [MF2103 TIM1 encoder; MF2043 INA126 sensor; MF2007 3600 ppr]
   → state estimate → feedback                            [MF2103 velocity estimator; MF2007 observer/RST]
   → task scheduling                                      [MF2103 RTX threads + virtual timers; uu-pes Zephyr]
```

The honest framing: this is a **reconstruction**. The nutrunner was modelled, not built. The power stage, sensor, firmware and identification were built and tested, but on smaller lab motors. The project page carries a provenance table (Built / Measured / Modelled / Datasheet / Assumed / Unknown) so that no parameter is presented as more certain than it is.

**Alternative:** make the **MF2103 platform** the project page, since it is the only end-to-end physical system with firmware, and keep the nutrunner as the worked example inside the post. Section 7 asks you to choose.

---

## 3. Hierarchical table of contents for the post (with sources)

Each part follows the five levels **Physics → Model → Control → Electronics → Embedded**, closes with misconceptions, failure modes and debugging notes, and ends with "Case study hook" boxes that feed Part N.

### Part A. Actuators: physics, models, selection  *(brief §1)*
- A.1 Actuation as energy conversion: two-port transducer model (lossless and lossy), effort/flow variables, the chain from energy source → modulator → converter → transmission → load; power density, efficiency, bandwidth, stiffness, controllability as derived quantities. *MF2030 L6 (generic transducer model), Janschek ch. on transducers.*
- A.2 Mechanical transmission: gear ratio, torque/speed mapping, efficiency, **reflected inertia J_m + J_L/n²**, optimal ratio for acceleration n* = √(J_L/J_m), backlash, torsional compliance, two-mass resonance/antiresonance, absolute vs relative actuation/sensing; planetary, harmonic, belt, lead/ball screw (lead ↔ torque/force; self-locking). *MF2030 L9 + two-mass notes, MF2007 C2 (DC motor + gearbox), nutrunner gearbox.* External: Shigley/Budynas; Harmonic Drive and ball-screw manufacturer catalogues.
- A.3 Thermal and combustion actuation (short): heat engine efficiency, hybrid powertrains, thermal actuators (bimetal, wax, SMA): why their bandwidth is thermal-time-constant limited. *MF2007 C2 (combustion, hybrid).* External: Heywood (ICE), SMA review.
- A.4 Hydraulics: orifice equation Q = C_d A √(2Δp/ρ); spool valve linearization (K_q, K_c); continuity with bulk modulus (dp/dt = β/V·(Q − A ẋ − C_l p)); hydraulic spring k_h = 4βA²/V and natural frequency; leakage, friction, valve dynamics; P/velocity/pressure feedback; robustness to mass change and noise. *MF2007 C2 (compressibility, B matrix), exercises, Workshop B hydraulic model + my report (external force, mass change, sensor noise).* External: Merritt *Hydraulic Control Systems*; Jelali & Kroll.
- A.5 Pneumatics: choked/unchoked orifice flow, polytropic chamber dynamics, low stiffness from compressibility, stick-slip, PWM vs proportional valves. *Weak locally;* cross-link the DeLaval pneumatic pinch-valve project. External: Beater *Pneumatic Drives*; Festo/SMC application notes.
- A.6 Electromagnetic and other electrical actuators: solenoid/plunger (MF2043 lab 2: 40 mH, 13 Ω, 24 V; PWM frequency vs force), voice coil (MF2030 L9 linear actuator example), electrostatic and piezoelectric (MF2030 L6). Electric motors → Part B.
- A.7 Selection: comparison table (hydraulic / pneumatic / electric) on force density, power density, bandwidth, stiffness, efficiency, cost, cleanliness, safety; selection workflow with the nutrunner as the example (why battery-electric BLDC + planetary).

### Part B. Electromagnetic foundations  *(brief §2)*
- B.1 Conductor, coil, field: Ampère's law, H and B, Lorentz force F = I L × B, torque on a coil.
- B.2 Magnetic circuits: MMF, reluctance, flux, flux linkage, inductance L = N²/ℛ, air gap dominance, saturation.
- B.3 Energy and co-energy; force/torque from ∂W'/∂x: reluctance force (solenoid) vs alignment torque (PM machines).
- B.4 Faraday's law and back-EMF; power balance ⇒ k_t = k_e in SI units; unit conversions from datasheets (mV/rpm ↔ V·s/rad, mN·m/A).
- B.5 From coil to machine: stator/rotor, windings, poles and pole pairs, **electrical angle θ_e = p·θ_m** ("pole number as gear", MF2030 C2), commutation (mechanical vs electronic), rotating field from three phases.
- B.6 Non-idealities: torque ripple, cogging, armature reaction, saturation; losses (copper I²R, iron hysteresis/eddy, friction, windage); thermal model with R_th1/R_th2, τ_w1/τ_w2 (Faulhaber data); continuous vs peak ratings.
- B.7 Torque-speed characteristic: stall torque, no-load speed, speed/torque gradient, operating regions, constant-torque and constant-power regions, voltage and current limits, field weakening (introduced here, used in F).
- *Local:* MF2030 C2_Actuators, L6 (electromagnetic transducers); MF2007 C2; Faulhaber and Assun datasheets. *External:* Hughes & Drury *Electric Motors and Drives*; Krishnan *Permanent Magnet Synchronous and Brushless DC Motor Drives*; Mohan *Electric Drives*; Faulhaber technical notes; open-licence field/cross-section figures (e.g. FEMM renders, Wikimedia Commons under CC).

### Part C. Electric motor taxonomy  *(brief §3)*
For each machine, the 12-point template from the brief.
- C.1 Brushed DC (example: Assun AM-CL1643MB-1210 coreless motor: graphite brushes, coreless rotor ⇒ low L = 0.21 mH, low J = 3.11 g·cm²).
- C.2 Induction machine (slip, equivalent circuit, V/f, no-load and short-circuit tests from MF2030 C2).
- C.3 BLDC (trapezoidal back-EMF, Hall sensors, six-step; example: Faulhaber 3268 BX4, 4-pole with integrated Hall sensors).
- C.4 PMSM (sinusoidal back-EMF, surface vs interior magnets, L_d vs L_q, reluctance torque).
- C.5 Servo **system** vs servo motor: motor + sensing + drive + feedback controller + mechanical load; the nutrunner as a servo system; MF2007 C5 "the servo problem".
- C.6 DC vs BLDC vs PMSM comparison table, plus the **terminology trap**: "brushless DC-servomotor" (Faulhaber) vs BLDC vs PMSM, and "DC-equivalent" phase-to-phase parameters, which is exactly how the MF2030 report modelled a BLDC as a DC motor.

### Part D. The DC motor as the first complete model  *(brief §4)*
- D.1 Electrical subsystem: KVL with R, L, back-EMF; physical meaning of each term.
- D.2 Mechanical subsystem: J, viscous d, Coulomb F_c, load torque as disturbance.
- D.3 Coupled model: block diagram, the back-EMF loop as inherent velocity feedback ("electrical damping" k_t k_e/R).
- D.4 Transfer functions (V→ω, V→i, T_L→ω, V→θ), state space with x = [i, ω] and [θ, ω, i], equilibria, linearity assumptions.
- D.5 Poles, time constants, the τ_e ≪ τ_m reduction and when it fails; controllability/observability with current vs speed vs position sensors.
- D.6 Worked numbers for three real motors:

  | Motor | Source | R | L | k_t = k_e | J | τ_e = L/R | poles / τ_m |
  |---|---|---|---|---|---|---|---|
  | Faulhaber 3268 BX4 (phase-phase, DC-equivalent) | MF2030 datasheet + report | 1.45 Ω | 110 µH | 0.0435 | 6.0·10⁻⁶ kg·m² | 76 µs | −12 961 and −221 s⁻¹ (report, reproduced) |
  | Assun AM-CL1643MB-1210 | MF2103 `motor.pdf` | 3.42 Ω | 0.21 mH | 0.0114 | 3.11·10⁻⁷ kg·m² | 61 µs | τ_m 8.2 ms (datasheet) |
  | MF2007 workshop motor | `initPar.m` + group-4 report (J, d_m, F_c identified) | 112 Ω (to verify) | 11.4 mH | 0.0697 | 2.6·10⁻⁵ kg·m² | 0.10 ms | G(s) = 23.94/(s² + 2.495 s), consistent with report |

- D.7 Parameter identification: step tests at 7/12/18 V, sinusoid at 0.5 rad/s, linear vs Coulomb friction (MF2007 A, levels 1-2); datasheet verification (MF2030 report §V: stall torque, no-load speed, acceleration, τ_m); least-squares fitting (link to numerical post); what each test excites.

### Part E. Continuous- and discrete-time motor control  *(brief §5)*
- E.1 Open-loop voltage drive and what the back-EMF loop already does.
- E.2 Current (torque) control: PI on the RL plant, pole-zero cancellation, back-EMF as disturbance, bandwidth vs PWM frequency.
- E.3 Velocity control: P (the "inverse steady-state gain" heuristic from MF2103), PI, pre-filter / 2-DOF, saturation, anti-windup (back-calculation, K_ant = 1/T_s in my MF2007 report).
- E.4 Position control: PD/PID, RST pole placement with observer polynomial A_o (MF2007 C3/C7, Workshop A).
- E.5 Cascaded current → speed → position loops: bandwidth separation, what each loop physically controls.
- E.6 Servo design: trajectory planning (trapezoid/S-curve; TrajPlan.m: 500 rad/s², 210 rad/s) and model-following feedforward (Workshop B).
- E.7 State feedback, pole placement, LQR, observers, Kalman filter, LQG on the DC motor (inverted-pendulum material for state feedback + observer; link adaptive-control post for LQR/LQG derivations).
- E.8 Robustness: S + T = 1, choice of A_m and A_o, model error vs sensor noise (Workshop B; C7).
- E.9 From ẋ = Ax + Bu to x_{k+1} = A_d x_k + B_d u_k: ZOH exact discretization, Tustin, emulation vs direct discrete design (my report: direct design worked at T_s = 50 ms where emulation failed), sampling-rate rules of thumb, aliasing and anti-alias filters, computational delay (model and compensation), quantization (encoder, ADC, PWM resolution), fixed vs floating point, scaling (MF2007 C6).
- E.10 Comparison tables: continuous vs discrete; PID vs LQR vs LQG.

### Part F. BLDC and PMSM modelling and control  *(brief §6)*
- F.1 Three-phase windings, phase vs line quantities, star connection, electrical angle.
- F.2 BLDC: trapezoidal back-EMF, Hall-sensor sectors, six-step commutation table, current paths for each step, torque ripple at commutation.
- F.3 Sinusoidal commutation; encoders; sensorless estimation (back-EMF zero crossing, observers).
- F.4 PMSM model: abc → αβ (Clarke) → dq (Park), physical meaning (current phasor; rotor-fixed frame turns AC into DC); dq voltage equations with cross-coupling; torque T = 3/2·p·[ψ_m i_q + (L_d − L_q) i_d i_q]; why i_q makes torque and what i_d does. *MF2030 C2_Actuators slides cover current phasors, αβ, DQ, two current controllers, the DQ voltage equation and cascaded PMSM control: a strong local source.*
- F.5 FOC chain: current sensing → Clarke → Park → PI(i_d), PI(i_q) with decoupling → inverse Park → SVPWM → inverter.
- F.6 SVPWM: switching states, voltage hexagon, sector times, equivalence to min-max injection, linear range +15.5 %.
- F.7 Loop design: current loop by technical optimum / pole-zero cancellation; speed and position loops; field weakening and MTPA.
- F.8 Worked example: the BX4 driven by FOC instead of the DC-equivalent model.
- *External:* TI and ST/Microchip FOC application notes (e.g. Microchip AN1078, ST UM1052, TI motor-control SDK docs); Holtz (PWM review), van der Broeck et al. 1988 (SVPWM); Faulhaber BX4 application notes.

### Part G. Power electronics between MCU and motor  *(brief §7)*
- G.1 MOSFET as a switch: R_DS(on), V_GS(th), logic-level parts, switching times and losses (BUZ73/BUZ73L, IRF7240 numbers from MF2043 L3), conduction vs switching loss, thermal.
- G.2 High-side vs low-side switching; P- vs N-channel high side; smart high-side switch (BTS410).
- G.3 Inductive loads: what the current does at turn-off, freewheeling diode, where to place it (EMC), solenoid lab measurements (MF2043 lab 2).
- G.4 Half bridge, **H-bridge with current paths for drive, coast, slow-decay brake, fast-decay (regenerative) and reverse**, mapped to the A4973 PHASE/ENABLE/MODE pins and to my lab-2 PCB; four-quadrant operation; motor-as-generator lab (motor 2 into a power resistor).
- G.5 Three-phase inverter: six switches, current paths in each six-step state, body diodes.
- G.6 Gate drivers, bootstrap supply (charge/refresh limits, 100 % duty problem), dead time and shoot-through, dead-time voltage error.
- G.7 PWM frequency vs electrical time constant: ripple ΔI ≈ V·D(1−D)/(L·f) (MF2043 L3 example: τ = 0.1 ms at 1 kHz ⇒ current saturates within each half-cycle); audible noise; switching loss.
- G.8 Current sensing: low-side, high-side and in-phase shunts; INA126 design from my lab-4 PCB (0.1 Ω, gain, offset to fit 0-3.3 V); SNR measurement; filtering vs phase delay ("phase delay is always bad for control"); ADC sampling synchronized to PWM centre; Hall/Melexis sensors.
- G.9 Voltage sensing, supply design (my lab-1 buck + linear supply), bulk capacitance, regenerative over-voltage.
- G.10 Protection: over-current (A4973 internal limit, V_ref/R_s), over-voltage (braking chopper), thermal, under-voltage lockout, reverse polarity.
- G.11 EMI/EMC and transients: loop area, ground planes (prestudy asked for a two-layer board with a ground plane), dv/dt and di/dt, snubbers, TVS (MF2043 L6-7, L7.5).
- *External:* TI SLUA618 (gate-driver fundamentals), Infineon/TI dead-time and bootstrap notes, TI/ADI shunt-amplifier guides; A4973 datasheet (local).

### Part H. Embedded foundations  *(brief §9)*
- H.1 Below the abstraction: CPU, registers (R0-R15, PC, SP, LR, xPSR), buses, memory map of Cortex-M (STM32L476 and RP2040), Flash vs RAM, memory-mapped I/O.
- H.2 Peripheral registers at bit level: GPIO MODER/BSRR (MF2103 tutorial 2), read-modify-write hazards and set/clear registers / bit-banding (uu-pes L4), timer registers for PWM (ARR, CCR, PSC) and encoder mode (TIM1 CNT, TI1/TI2).
- H.3 `volatile`, pointers to registers, CMSIS structures vs HAL vs CubeMX-generated code (the three abstraction levels used in MF2103).
- H.4 Memory: stack, heap, static/global, linker script and ELF sections, map files (Keil `.map` in MF2103), deterministic allocation, fragmentation, stack overflow detection, MPU.
- H.5 Embedded C pitfalls: integer widths, `<stdint.h>`, overflow and undefined behaviour, integer division ordering, promotion, alignment and padding, floating-point cost (Cortex-M4F has an FPU; M0+ does not), fixed-point Q-formats and scaling.
- H.6 Case study code review: the MF2103 velocity estimator and PI controller line by line (see §6 below).

### Part I. Concurrency and synchronization  *(brief §10)*
- I.1 Why a motor controller is concurrent: PWM, ADC, encoder, control, comms, logging, UI.
- I.2 Super-loop with polling (MF2103 task 1: `millisec % PERIOD_CTRL == 0` and its hazards) → interrupts → cooperative → preemptive → RTOS.
- I.3 ISR rules, ISR-to-thread data exchange, deferred interrupt processing (uu-pes example: ISR → `k_sem_give` → thread).
- I.4 Threads, priorities, context switching, stack per thread.
- I.5 Shared resources, races, atomics, critical sections, mutexes (ownership, priority inheritance), binary vs counting semaphores, event flags/signals (CMSIS-RTOS `osSignalSet/Wait` in my task 2), message queues, producer/consumer with motor-control examples: ADC complete → semaphore → current task → CCR update; encoder snapshot + timestamp coherence; parameter updates from comms without tearing.
- I.6 Failure modes: priority inversion (exam VT22 timing diagram), deadlock/deadly embrace, lost wake-ups, starvation, torn 64-bit reads, ISR-unsafe calls.
- I.7 Table: mutex vs semaphore vs queue vs event flags.

### Part J. Real-time systems  *(brief §11)*
- J.1 Fast vs real-time; hard/soft/firm; deadlines, latency, jitter, WCET.
- J.2 Schedulability: RMS, EDF, utilization bounds, response-time analysis (exam problems with {C, T, D}).
- J.3 Control meets timing: sampling-period jitter and input-output latency as plant modifications; phase margin lost to delay; why a nominal 10 kHz loop with jitter differs from a deterministic one; Jitterbug-style analysis.
- J.4 Synchronizing everything to the PWM timer: ADC trigger, control ISR, CCR shadow registers (preload), encoder capture.
- J.5 Case: my task-2 timing (virtual timer → signal → thread; Event Viewer evidence) and the distributed version (TCP round trip inside the loop).

### Part K. RTOS in practice: CMSIS-RTOS (as used) and Zephyr (as proposed)  *(brief §12)*
- K.1 What I used: Keil RTX via CMSIS-RTOS v1 (threads, `osTimerCreate`, `osSignal*`, priorities, stack sizes, SysTick ownership conflict with HAL and its fix).
- K.2 Zephyr anatomy: west workspace, app structure (`CMakeLists.txt`, `prj.conf`, `src/`), board definitions, devicetree and overlays, bindings, Kconfig, driver model.
- K.3 Zephyr kernel objects mapped to generic concepts: threads (`K_THREAD_DEFINE`, priorities coop/preempt), `k_timer`, `k_work`/work queues, `k_sem`, `k_mutex`, `k_msgq`, `k_event`, `k_poll`, ISRs (`IRQ_CONNECT`, zero-latency IRQs), logging, shell, thread analyzer, stack sentinel/MPU guard, memory slabs/heaps.
- K.4 Zephyr device APIs for motor control: PWM, ADC, counter/QDEC (quadrature decoder), GPIO; **limits of the generic APIs** (no complementary outputs/dead time/ADC trigger configuration), hence vendor LL/HAL access to the advanced timer from a Zephyr app; Nucleo-L476RG is a supported Zephyr board.
- K.5 Reference architecture: PWM 20 kHz in hardware (centre-aligned, dead time); ADC triggered by the timer; current loop 10 kHz in a zero-latency ISR; speed loop 1 kHz in a high-priority thread; position loop 100 Hz; comms asynchronous; logging lowest priority. Includes a table of which function lives in hardware / ISR / high-priority thread / low-priority thread, and why.
- K.6 Bare-metal vs RTOS comparison table.

### Part L. Debugging electromechanical systems  *(brief §13)*
- L.1 Method: reproduce, observe at layer boundaries, bisect the chain, change one thing (uu-pes L7: from failure to fault, minimisation, slicing; MF2043 L9.5 troubleshooting).
- L.2 Layer-by-layer checklists: mechanical, electrical (rails, ground, current), power stage (gate signals, dead time, shoot-through, decay mode), firmware (registers, stack, scheduling, state machines), control (sign, units, T_s, saturation/windup, noise), communication (UART/SPI/I²C/CAN/TCP).
- L.3 Tools: multimeter, oscilloscope (current via shunt, V_DS waveforms from lab 2), logic analyser, debugger (breakpoints, watchpoints, Keil Watch/Logic Analyzer/Event Viewer, ITM printf), GDB, assertions, fault handlers (HardFault decode), serial logging cost.
- L.4 Case-study bug catalogue (§6 below) used as worked debugging examples.

### Part M. The integrated chain  *(brief §14)*
One table row per arrow (desired position → … → feedback) with: physical quantity, unit, mathematical relationship, software representation (type, scaling, units), hardware implementation, saturation, bandwidth, noise/uncertainty, failure modes. Every row instantiated with case-study numbers.

### Part N. Cross-disciplinary worked example  *(brief §15)*
The 16 steps of the brief, applied to the nutrunner clamping phase (25 N·m at 3 rad/s), with every number labelled by provenance. Preview with report parameters (η = 0.9 **assumed**):

- Output 25 N·m, 3 rad/s → motor torque 25/(0.9·81) = 0.343 N·m, motor speed 243 rad/s.
- Current 0.343/0.0435 = 7.9 A; voltage 1.45·7.9 + 0.0435·243 = 22.0 V → duty 73 % at the 30 V battery.
- Then: bridge (BLDC needs a 3-phase inverter, not the H-bridge), timer configuration, sampling rates vs τ_e = 76 µs, discretization, noise, delay/jitter budget, RTOS layout, protection limits, debugging.

---

## 4. Gaps that need external sources

| Topic | Gap | Proposed sources |
|---|---|---|
| Pneumatics | No local lecture material | Beater *Pneumatic Drives* (Springer); Festo/SMC application notes; DeLaval project page |
| Induction machine depth | Only test-method slides | Hughes & Drury; Mohan *Electric Drives* |
| BLDC/PMSM practice (six-step, FOC, SVPWM, sensorless) | Theory slides only, no implementation | TI/ST/Microchip/Infineon app notes; Faulhaber BX4 notes; Holtz; van der Broeck 1988 |
| Gate drivers, bootstrap, dead time | Not covered locally beyond L3 hints | TI SLUA618; Infineon/ST gate-driver notes |
| Three-phase inverter hardware | None built | Manufacturer evaluation-board docs (e.g. ST X-NUCLEO-IHM07M1, TI BOOSTXL-DRV8301) |
| Zephyr for motor control | uu-pes covers kernel and GPIO only | Zephyr docs (devicetree, PWM, ADC, QDEC, k_work, logging, MPU stack guard); STM32 LL docs |
| Real-time control theory | Scheduling covered, control-timing interaction not | Åström & Wittenmark *Computer-Controlled Systems*; Cervin et al. (Jitterbug/TrueTime); Buttazzo |
| LQR / Kalman / LQG on a motor | No local motor implementation | My adaptive-control post; Franklin, Powell & Workman *Digital Control of Dynamic Systems* |
| Figures | Lecture slides are not reusable (copyright) | Draw new SVGs; re-plot my simulations/measurements; use my own report figures; cite and link manufacturer figures rather than copy them |

---

## 5. Parameter register: recovered vs unknown

**Recovered (with file):**

- Faulhaber 3268 BX4: R 1.45 Ω, L 110 µH (phase-phase), k_t 43.5 mN·m/A, k_e 4.555 mV/rpm, J 60 g·cm², C_v 1.3·10⁻³ mN·m/rpm, C_o 1.7 mN·m, no-load 5500 rpm, stall 718 mN·m, τ_m 4.6 ms. *Report §IV-V.*
- Nutrunner: gear n = 81 (two stages of 9, the report's choice), gear stiffness K_t = 739 N·m/rad, damping d_t = d_j = 1.5 N·m·s/rad, inertias from geometry (`inertia.m`), M8×1.25 class 8.8, A_s = 36.61 mm², E = 210 GPa, μ = 0.2, target 25 N·m at 3 rad/s. Tensor STB62-50-B10: 15-50 N·m, 375 r/min, 30 V Li-ion, 1.74 kg; contains BLDC, two-stage planetary, torque transducer, 90° spiral bevel gear, pulse encoder. *Assignment, handbook.*
- MF2030 PI: k_p = 0.1935, k_i = 40 (motor only); 8.5/111 (rundown); 8.5/1000 (clamping).
- MF2103: STM32L476RG @ 40 MHz; TIM3 PWM ARR 2000 → 19.99 kHz, about 11-bit duty; TIM1 encoder, 16-bit, TI1+TI2; code assumes 2048 counts/rev; PA5/PA6 half-bridge enables (PA5 is also LED LD2); PI gains k_p = 15000 with τ = 9 ms (final), 500/3000 with K_ant = 300 (task 2); reference ±2000 rpm toggled every 4 s; control period 10 or 50 ms. Assun motor: 12 V, 10 000 rpm no-load, 3.42 Ω, 0.21 mH, 11.4 mN·m/A, 839 rpm/V, 3.11 g·cm², τ_m 8.2 ms, stall 40 mN·m.
- MF2007: J 2.6·10⁻⁵, d_m 2.15·10⁻⁵, F_c 1.35·10⁻³ (identified), k_m = k_e 0.0697, L 11.4 mH, R 112 Ω, 3600 ppr, ±24 V supply, T_s 2 ms (emulation), 20/50 ms (direct design), trajectory limits 500 rad/s², 210 rad/s.
- MF2043: A4973 board, R_s 0.5 Ω, current limit < 1.2 A, 24 V; current sensor 0.1 Ω shunt, INA126 (R_G 5.6 kΩ), LM358, ±12 V; supply LM2576-ADJ (24→12 V, 2 A), LM317 (12→5 V, 1 A).

**Unknown (will be marked, not invented):**

- MF2103 motor-shield part number and topology (only "DC Motor Control Shield"; PA5/PA6 enables, two PWM inputs), its supply voltage, and the encoder line count (2048 counts/rev is an assumption in the code).
- The MF2007 motor model and datasheet (`datasheet.pdf` is empty); R = 112 Ω is unusually high and needs confirming.
- Faulhaber BX4 continuous current/torque and thermal data (the datasheet table extracts poorly; to re-read from the PDF directly).
- Real Tensor gear ratio and efficiency (proprietary). η for the planetary stages is not given anywhere.
- Lab 5 (current controller on mbed) has no files; the current loop was designed but no artefact survives locally.
- No measured nutrunner data at all.

---

## 6. Inconsistencies and bugs found (to be used as teaching material, clearly labelled)

1. **Gear ratio vs product speed (MF2030):** n = 81 meets 25 N·m, but the Tensor's 375 r/min output would need 30 375 rpm at the motor (max ≈ 5500 rpm at 24 V). The no-load speed implies a ratio of about 18. Either the real tool runs the motor far above its continuous torque, or the bevel/planetary split differs. This is a good selection discussion for Part A.2/N.
2. **`statespace_screw.m`:** B uses `Kt` (gear stiffness, 739) instead of `kt` (torque constant, 0.0435) in B(3). The report's equation in §XI has the same substitution in the motor-torque term.
3. **Bolt stress (MF2030 §XIII):** 2.82 GPa ≫ 640 MPa yield without thread friction. The model has no torque-angle stop; this motivates torque-controlled tightening in N.
4. **MF2103 timing:** comment says "Every 10 msec" while `PERIOD_CTRL` is 50 in the final file. The polling `millisec % PERIOD == 0` misses a period if the loop body or an ISR delays past that millisecond.
5. **MF2103 integer arithmetic:** `-rad*60/dt*1000/2048` divides before scaling (resolution loss at dt = 50 ms). In task 2, `ki*I` can exceed INT32_MAX within a few samples of a large error before the clamp runs (signed overflow is UB in C). The task-1 controller returns a hard-coded 500 (mock) and the PWM function ignores its argument: a "test stub left in" example.
6. **PA5 doubles as LED LD2** on the Nucleo: a visible but harmless cross-layer coupling.
7. **TCP inside the control loop (MF2103 distributed):** the sample-actuate cycle waits on `send/recv`; the delay and its jitter enter the loop directly. A good Part J example.

---

## 7. Figures plan

- **New SVGs (drawn):** energy-conversion chains for each actuator family; hydraulic valve-cylinder and pneumatic chamber schematics; magnetic circuit with air gap; DC motor cross-section and equivalent circuit; three-phase winding and rotating field; Clarke/Park geometry; FOC block diagram; SVPWM hexagon; H-bridge current paths (drive, coast, slow decay, fast decay, reverse); three-phase inverter states; bootstrap gate drive; shunt + INA126 chain; Cortex-M memory map; ISR → semaphore → thread timeline; Zephyr motor-control architecture; jitter/latency timeline; the integrated chain; the nutrunner two-mass model.
- **Re-plotted from my own models:** re-simulate the MF2030 state-space models in Python with the same parameters (no MATLAB here; `.fig` data can be read as MAT-files): step responses, PI rundown and clamping, torque/stress/energy; MF2007 RST designs (poles, step responses, sensitivity functions).
- **My own artefacts:** report figures (extractable from the PDFs), Eagle schematics/boards (best exported from Eagle as PNG/PDF by you; otherwise I redraw them from the netlists), the free-body diagram PNG.
- **External figures:** link and cite manufacturer diagrams (Faulhaber, Atlas Copco, ST, TI) rather than copy them; use CC-licensed figures only with attribution.

---

## 8. Decisions needed

1. Confirm the reading of "one post, one project": all parts A-N in **one** post, plus **one** project page.
2. Project page framing: **(a)** the composite "electric nutrunner drive" with a provenance table (recommended), or **(b)** the MF2103 STM32 platform as the project, with the nutrunner only as the post's worked example.
3. Eagle exports: can you export the lab-1/2/4 schematics and boards as PNG/PDF from Eagle? Otherwise I redraw them from the netlists.
4. The unknowns in §5 (shield part, encoder resolution, MF2007 motor, Faulhaber continuous ratings): any extra documents (Canvas "hardware platform" page, lab photos) would replace assumptions with facts.
5. Report authorship: the MF2030 report has three authors and the MF2007 reports have three. Project-page credits will name the groups.
