---
title: Fluid Dynamics Notes
tags: [fluid dynamics, aerodynamics, compressible flow, thermofluids]
style: fill
color: light
description: Consolidated notes from fluid mechanics lectures and aerodynamics, from statics to compressible shocks and nozzles.
---

## 1. Fluid Mechanics Core Model

Fluid motion is governed by conservation laws.

### 1.1 Continuity

$$
\frac{\partial \rho}{\partial t}+\nabla\cdot(\rho\mathbf{u})=0.
$$

For incompressible flow ($\rho=\text{const}$):

$$
\nabla\cdot\mathbf{u}=0.
$$

### 1.2 Momentum (Navier-Stokes)

$$
\rho\left(\frac{\partial \mathbf{u}}{\partial t}+\mathbf{u}\cdot\nabla\mathbf{u}\right)
= -\nabla p + \mu\nabla^2\mathbf{u}+\rho\mathbf{g}.
$$

### 1.3 Energy (when thermal effects matter)

Coupled with equation of state and transport models for compressible/heat-transfer flows.

---

## 2. Fluid Properties and Regimes

Important properties:

- density $\rho$,
- viscosity $\mu$,
- kinematic viscosity $\nu=\mu/\rho$,
- vapor pressure (cavitation relevance),
- surface tension.

Key dimensionless groups:

$$
Re=\frac{\rho UL}{\mu},\qquad
Ma=\frac{U}{a},\qquad
Fr=\frac{U}{\sqrt{gL}}.
$$

Regime examples:

- laminar vs turbulent,
- viscous vs inviscid regions,
- incompressible vs compressible,
- subsonic/transonic/supersonic/hypersonic.

---

## 3. Fluid Statics

For fluid at rest:

$$
\frac{dp}{dz}=-\rho g.
$$

Used for:

- pressure distribution in tanks/dams,
- hydrostatic force on submerged surfaces,
- buoyancy and stability of floating bodies.

No shear stress appears in static fluid; stress is purely normal pressure.

---

## 4. Bernoulli and Mechanical Energy

For steady, incompressible, inviscid flow along streamline:

$$
\frac{p}{\rho g}+\frac{V^2}{2g}+z = \text{const}.
$$

Extended engineering form includes pump/turbine heads and losses:

$$
\frac{p_1}{\rho g}+\alpha_1\frac{V_1^2}{2g}+z_1+h_p
=
\frac{p_2}{\rho g}+\alpha_2\frac{V_2^2}{2g}+z_2+h_t+h_L.
$$

This is central for pipe systems, nozzles, diffusers, and flow measurement.

---

## 5. Internal Flow and Boundary Layers

From convection/internal-flow content:

- entrance length and developing profiles,
- fully developed laminar/turbulent flow,
- friction factor and pressure drop,
- coupling of velocity and thermal boundary layers.

Canonical pipe-flow relation:

$$
\Delta p = f\frac{L}{D}\frac{\rho U_m^2}{2}.
$$

In heat-transfer-coupled duct flow, Nusselt correlations connect $Nu$ to $Re,Pr$ and boundary conditions.

---

## 6. External Flow, Lift, and Finite Wings

From the aerodynamics:

- incompressible flow over finite wings,
- 3D effects vs 2D idealization,
- induced drag and lift-curve modifications,
- relation between circulation and lift (lifting-line perspective).

Finite-wing correction is essential because wingtip vortices alter effective angle of attack and drag.

---

## 7. Compressible Flow Fundamentals

When density variation is non-negligible (typically higher Mach number), isentropic and shock relations become central.

Stagnation relations (ideal gas, isentropic):

$$
\frac{T_0}{T}=1+\frac{\gamma-1}{2}Ma^2,
$$

$$
\frac{p_0}{p}=\left(1+\frac{\gamma-1}{2}Ma^2\right)^{\frac{\gamma}{\gamma-1}}.
$$

These are foundational for nozzles, diffusers, and airspeed measurements (e.g., Pitot-based compressible corrections).

---

## 8. Shock and Expansion Waves

### 8.1 Normal shock 

Across a normal shock, flow is discontinuously compressed; entropy increases and total pressure drops.

Typical trends for supersonic upstream flow:

- $Ma_1>1$ to $Ma_2<1$,
- static pressure and temperature increase,
- total pressure decreases.

### 8.2 Oblique shocks and expansion fans 

Turning supersonic flow:

- compression corner -> oblique shock,
- expansion corner -> Prandtl-Meyer expansion.

Shock angle $\beta$, deflection $\theta$, and $Ma_1$ satisfy the classic $\theta$-$\beta$-$M$ relation.

---

## 9. Nozzles, Diffusers, and Wind Tunnels

From Aerodynamics:

- area-Mach relation and choking,
- converging-diverging nozzle operation,
- design/operation of supersonic wind tunnels,
- sensitivity to back pressure and shock location.

Area-Mach relation (quasi-1D isentropic):

$$
\frac{dA}{A}=(Ma^2-1)\frac{dV}{V}.
$$

So subsonic and supersonic flows respond oppositely to area changes.

---

## 10. Fluid-Structure of Thermofluids Systems

Thermofluids systems couple momentum, heat transfer, and phase change:

- forced/free convection in external/internal geometries,
- boiling and two-phase pressure-drop tradeoffs,
- exchanger-network design under hydraulic constraints.

Engineering design requires simultaneous satisfaction of:

- flow delivery and pressure-drop limits,
- heat duty targets,
- safety constraints (cavitation, CHF, thermal stress).

---

## 11. Practical Analysis Workflow

1. Identify regime (Re, Ma, phase, geometry).
2. Select governing simplification (inviscid/viscous, incompressible/compressible, steady/unsteady).
3. Apply conservation equations and boundary conditions.
4. Use validated correlations/relations for closure.
5. Check consistency against limiting cases and experimental behavior.

These notes summarize the fluid-dynamics side from statics and Bernoulli flows to compressible aerodynamics and high-speed internal flow systems.



---

## 12. Modeling Hierarchy (Advanced Note)

For advanced fluid/aerodynamics studies, use this compact hierarchy:

1. Regime map: identify dominant physics using $Re$, $Ma$, and geometry.
2. Governing model: Euler / Navier-Stokes / boundary-layer / quasi-1D as needed.
3. Closure: turbulence, EOS, and transport-property models.
4. Numerics: mesh strategy, stable discretization, pressure-velocity coupling.
5. Trust: verification, validation, and uncertainty quantification.

Keep sections 1-11 as the core course-oriented reference; this section is only the advanced roadmap.
