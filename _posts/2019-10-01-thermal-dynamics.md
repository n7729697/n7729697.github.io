---
title: Thermal Dynamics Notes
tags: [thermodynamics, heat transfer, thermofluids]
style: fill
color: light
description: Consolidated notes from related thermofluids lectures on energy analysis, entropy, cycles, and heat transfer.
---


## 1. Thermodynamics Foundations

Thermodynamics studies energy, its transfer, and conversion.

Core concepts:

- system, control volume, boundary,
- state, process, cycle, equilibrium,
- intensive vs extensive properties,
- pure substances and phase-change behavior.

For simple compressible systems, state can often be described by two independent intensive properties (state postulate).

---

## 2. First Law: Energy Conservation

### 2.1 Closed systems

General energy balance:

$$
\Delta U + \Delta KE + \Delta PE = Q - W.
$$

Moving-boundary work (quasi-equilibrium):

$$
W_b = \int_{V_1}^{V_2} p\,dV.
$$

### 2.2 Open systems (control volumes)

Steady-flow energy equation (one-inlet one-outlet form):

$$
\dot Q - \dot W_s = \dot m\left[(h_2-h_1)+\frac{V_2^2-V_1^2}{2}+g(z_2-z_1)\right].
$$

Mass conservation:

$$
\sum \dot m_{in} = \sum \dot m_{out} \quad (\text{steady state}).
$$

Applications: nozzles, turbines, compressors, throttling valves, heat exchangers, pumps.

---

## 3. Properties of Pure Substances and Ideal Gases

Topics emphasized in lectures:

- compressed liquid / saturated liquid / saturated vapor / superheated vapor,
- property diagrams ($P$-$v$, $T$-$v$, $P$-$T$),
- tables and interpolation,
- ideal gas EOS:

$$
pv=RT,
$$

- deviation from ideal gas via compressibility factor $Z$.

---

## 4. Second Law and Entropy

Second law introduces process directionality and performance limits.

Kelvin-Planck and Clausius statements motivate heat engines and refrigerators.

Entropy definition (internally reversible path):

$$
ds = \frac{\delta q_{rev}}{T}.
$$

Entropy balance (control volume form):

$$
\frac{dS_{cv}}{dt} = \sum \dot m_{in}s_{in} - \sum \dot m_{out}s_{out} + \sum\frac{\dot Q_k}{T_k} + \dot S_{gen},
$$

with $\dot S_{gen}\ge 0$.

---

## 5. Power and Refrigeration Cycles

From the sequence:

- Carnot cycle (efficiency bound),
- Otto / Diesel / Brayton cycles,
- Rankine vapor power cycle,
- refrigeration and heat pump cycles,
- vapor-compression systems.

Performance metrics:

$$
\eta_{th}=\frac{W_{net,out}}{Q_{in}},
\qquad
COP_R=\frac{Q_L}{W_{in}},
\qquad
COP_{HP}=\frac{Q_H}{W_{in}}.
$$

Cycle analysis usually proceeds with component-wise energy balances and property lookups.

---

## 6. Heat Transfer Fundamentals

Heat transfer modes:

1. Conduction (Fourier law)
$$
q_x = -kA\frac{dT}{dx}.
$$

2. Convection (Newton cooling law)
$$
q = hA(T_s-T_\infty).
$$

3. Radiation (Stefan-Boltzmann for idealized blackbody)
$$
q = \epsilon\sigma A(T_s^4 - T_{sur}^4).
$$

Thermodynamics gives total energy change, while heat transfer provides rate-level temperature-field predictions.

---

## 7. Conduction, Convection, and Boiling Topics

From advanced thermofluids lectures:

- 1D and multidimensional conduction,
- thermal resistance networks,
- external/internal forced convection,
- free convection and Boussinesq approximation,
- boiling curve, nucleate boiling, critical heat flux,
- two-phase flow implications for pressure drop and system safety.

Dimensionless groups appear repeatedly:

$$
Re,\;Pr,\;Nu,\;Gr,\;Ra,
$$

with correlations linking heat transfer coefficient to flow regime and geometry.

---

## 8. Heat Exchangers

Core methods:

- LMTD method:

$$
\dot Q = UA\Delta T_{lm},
\qquad
\Delta T_{lm}=\frac{\Delta T_1-\Delta T_2}{\ln(\Delta T_1/\Delta T_2)}.
$$

- effectiveness-NTU method for design/rating when outlet temperatures are unknown.

Overall thermal resistance concept:

$$
\frac{1}{UA} = \sum R_{thermal}.
$$

---

## 9. Numerical Methods in Thermofluids

Numerical content in the course highlights:

- discretization of governing ODE/PDEs,
- iterative solution of nonlinear energy-flow balances,
- stability and convergence checks,
- coupling of thermodynamic property models with transport equations.

This bridges analytical cycle analysis and realistic engineering design.

---

## 10. Practical Workflow

1. Define system and assumptions (steady/unsteady, 1D/3D, ideal/real).
2. Apply conservation laws (mass, energy, entropy).
3. Close with constitutive relations (EOS, transport laws, empirical correlations).
4. Compute performance metrics (efficiency, COP, pressure loss, heat duty).
5. Validate against physical limits (second law, material constraints, CHF limits).

These notes summarize the thermal side of the thermofluids sequence, from fundamentals to component-level design analysis.


---

## 12. Modeling Hierarchy (Advanced Note)

Use this only when moving beyond course-level analysis:

1. Thermodynamics: state and equilibrium constraints.
2. Transport laws: momentum/heat/mass constitutive relations.
3. PDE model: continuity + momentum + energy + species equations.
4. Numerical layer: discretization, solvers, and stability handling.
5. Quality layer: verification, validation, and uncertainty quantification.

This hierarchy is a map for deeper CFD/research work; the main sections above remain the primary course notes.
