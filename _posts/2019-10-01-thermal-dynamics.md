---
title: Thermal Dynamics, Heat and Mass Transfer Notes
tags: [thermodynamics, heat transfer, mass transfer, thermofluids, PDE, CFD]
style: fill
color: danger
description: In-depth notes on thermodynamics, heat and mass transfer, coupled PDE models, Navier-Stokes-based transport, and modern numerical methods.
---

Source: `/mnt/d/CityU/2018-2019 SemA/2101/Lectures`, `/mnt/d/CityU/2018-2019 SemB/3106`, extended with modern PDE/numerical thermofluids practice.

## 1. Scope and Modeling Layers

Thermofluids is best viewed as a layered modeling stack:

1. Thermodynamics (state, energy, entropy, equilibrium limits)
2. Transport phenomena (momentum, heat, mass transfer rates)
3. Governing PDEs (continuity + Navier-Stokes + energy + species)
4. Numerical discretization (FVM/FEM/FDM, time integration, linear solvers)
5. Verification, validation, and uncertainty quantification

Thermodynamics tells what is possible; transport + PDEs tell how fast and where.

---

## 2. Thermodynamics Core

### 2.1 First law (closed/open systems)

Closed system:

$$
\Delta U + \Delta KE + \Delta PE = Q - W.
$$

Control volume (steady):

$$
\dot Q - \dot W_s = \dot m\left[(h_2-h_1)+\frac{V_2^2-V_1^2}{2}+g(z_2-z_1)\right].
$$

### 2.2 Second law and entropy generation

Entropy balance (general control volume):

$$
\frac{dS_{cv}}{dt}
= \sum \dot m_{in}s_{in} - \sum \dot m_{out}s_{out}
+ \sum_k \frac{\dot Q_k}{T_k} + \dot S_{gen},
\qquad \dot S_{gen}\ge 0.
$$

Irreversibility sources in real systems:

- finite temperature gradients,
- viscous dissipation,
- mixing/diffusion,
- chemical reaction.

### 2.3 Exergy viewpoint (high-value engineering metric)

Exergy destruction links directly to entropy generation:

$$
\dot E_{D}=T_0\dot S_{gen}.
$$

This gives a practical optimization target beyond first-law efficiency.

---

## 3. Heat Transfer and Mass Transfer Together

### 3.1 Heat transfer modes

Conduction (Fourier):

$$
\mathbf q = -k\nabla T.
$$

Convection (Newton law):

$$
q'' = h(T_s-T_\infty).
$$

Radiation (gray-surface form):

$$
q''_{rad}=\epsilon\sigma (T_s^4-T_{sur}^4).
$$

### 3.2 Mass transfer analogues

Diffusion (Fick):

$$
\mathbf J_A = -\rho D_{AB}\nabla Y_A.
$$

Convection mass-transfer boundary law:

$$
N_A'' = k_c(C_{A,s}-C_{A,\infty}).
$$

### 3.3 Heat-mass transfer analogy

Dimensionless groups:

$$
Re=\frac{\rho UL}{\mu},\quad
Pr=\frac{\nu}{\alpha},\quad
Sc=\frac{\nu}{D},\quad
Nu=\frac{hL}{k},\quad
Sh=\frac{k_cL}{D}.
$$

Reynolds/Chilton-Colburn style analogies relate momentum, heat, and mass transfer, useful for fast engineering estimates.

---

## 4. Governing PDE System (Navier-Stokes + Energy + Species)

For compressible multi-species flow (single-phase baseline):

### 4.1 Mass conservation

$$
\frac{\partial \rho}{\partial t} + \nabla\cdot(\rho\mathbf u)=0.
$$

### 4.2 Momentum conservation (Navier-Stokes)

$$
\frac{\partial (\rho\mathbf u)}{\partial t}
+\nabla\cdot(\rho\mathbf u\otimes\mathbf u)
= -\nabla p + \nabla\cdot\boldsymbol\tau + \rho\mathbf g.
$$

For Newtonian fluids:

$$
\boldsymbol\tau = \mu\left(\nabla\mathbf u + (\nabla\mathbf u)^T\right)-\frac{2}{3}\mu(\nabla\cdot\mathbf u)\mathbf I.
$$

### 4.3 Energy equation

Common enthalpy form:

$$
\frac{\partial (\rho h)}{\partial t} + \nabla\cdot(\rho\mathbf u h)
= \frac{Dp}{Dt} + \nabla\cdot(k\nabla T) + \Phi + \dot q_{chem}.
$$

where $\Phi$ is viscous dissipation.

### 4.4 Species transport (component $i$)

$$
\frac{\partial(\rho Y_i)}{\partial t}
+\nabla\cdot(\rho\mathbf u Y_i)
= -\nabla\cdot\mathbf J_i + \dot\omega_i,
$$

with diffusion flux $\mathbf J_i$ and source $\dot\omega_i$ from reactions/phase change.

### 4.5 Closure

Need EOS + transport + source models:

- equation of state (ideal gas or real-fluid EOS),
- $\mu(T,\cdot), k(T,\cdot), D_i(T,\cdot)$,
- turbulence model (if RANS/LES),
- multiphase/reaction constitutive laws.

---

## 5. Convection Regimes and Correlations

### 5.1 External/internal forced convection

Typical engineering closure:

$$
Nu = f(Re,Pr,\text{geometry, roughness, BC}).
$$

Then:

$$
h = \frac{Nu\,k}{L}.
$$

### 5.2 Natural convection

Buoyancy-driven flow via Boussinesq approximation:

$$
\rho\mathbf g \approx \rho_0\mathbf g[1-\beta(T-T_0)].
$$

Correlations usually written as:

$$
Nu = f(Ra,Pr),\quad Ra=Gr\,Pr.
$$

### 5.3 Boiling/condensation/two-phase caution

Nucleate boiling gives high $h$, but CHF (critical heat flux) limits safe operation. Two-phase systems require simultaneous thermal and hydraulic design (heat transfer + pressure drop + flow stability).

---

## 6. Thermal Systems: Cycles and Exchangers

### 6.1 Power/refrigeration cycles

- Rankine, Brayton, Otto, Diesel,
- vapor compression cycle,
- heat pump / refrigeration COP optimization.

### 6.2 Heat exchanger analysis

LMTD method:

$$
\dot Q = UA\Delta T_{lm},
\quad
\Delta T_{lm}=\frac{\Delta T_1-\Delta T_2}{\ln(\Delta T_1/\Delta T_2)}.
$$

Effectiveness-NTU framework for design under unknown outlet temperatures.

Mass transfer devices (humidifiers, absorbers, membrane systems) use analogous transfer-resistance structures.

---

## 7. Numerical Methods for Thermofluids PDEs

### 7.1 Spatial discretization

- FVM (industry-standard for conservation laws),
- FEM (complex geometry, multiphysics coupling),
- FDM (structured-grid high-order studies).

### 7.2 Time integration

- explicit (simple, CFL-limited),
- implicit (larger stable steps, nonlinear solves),
- IMEX / operator splitting for stiff multiphysics.

### 7.3 Pressure-velocity coupling (incompressible/low-Mach)

- SIMPLE / SIMPLER / PISO families,
- projection methods,
- pressure Poisson equation handling.

### 7.4 Linear/nonlinear solvers

- Krylov methods (GMRES/CG/BiCGStab),
- multigrid (geometric/algebraic),
- preconditioning as major performance lever.

### 7.5 Stabilization and boundedness

- upwinding/flux limiters (TVD/MUSCL/WENO by context),
- positivity preservation for species and turbulence scalars,
- conservative coupling at interfaces.

---

## 8. Turbulence and “SOTA” Modeling Practice

### 8.1 Classical hierarchy

- DNS: resolves all scales, very expensive,
- LES: resolves large scales, models subgrid,
- RANS: time-averaged closure, cheapest.

### 8.2 Practical state-of-practice

- Industrial: RANS and hybrid RANS-LES remain dominant.
- High-fidelity: wall-modeled LES in complex geometries.
- Fast design loops: ROM/surrogates + calibrated CFD.

### 8.3 Data-driven trends

- ML-assisted turbulence closures,
- physics-informed surrogates for fast inverse design,
- operator-learning accelerators for parametric sweeps,
- digital twins with online parameter/state estimation.

These are promising but require strict physical constraints (conservation, realizability, stability) to be trustworthy.

---

## 9. Verification, Validation, and UQ

A thick note is incomplete without quality assurance:

1. Verification: solve equations right (code/discretization errors).
2. Validation: solve right equations (match experiments).
3. UQ: quantify model + parametric + numerical uncertainty.

Good practice:

- grid/time-step convergence studies,
- benchmark against canonical cases,
- separate numerical diffusion from physical diffusion,
- report uncertainty bands, not single values.

---

## 10. Research-Grade Workflow

1. Define regime map: $(Re, Ma, Pr, Sc, Ra, Da, \ldots)$.
2. Select minimal faithful PDE model.
3. Choose discretization and solver to match stiffness/geometry.
4. Calibrate closure models against representative data.
5. Verify + validate + uncertainty quantify.
6. Optimize objective (efficiency, exergy destruction, safety margin, robustness).

This is the bridge from lecture-level thermodynamics to modern computational thermofluids engineering.

---

## Compact Formula Sheet

- First law (CV steady):
$$
\dot Q - \dot W_s = \dot m\left[(h_2-h_1)+\frac{V_2^2-V_1^2}{2}+g(z_2-z_1)\right].
$$
- Entropy generation:
$$
\dot S_{gen}\ge 0,\quad \dot E_D=T_0\dot S_{gen}.
$$
- Fourier/Fick:
$$
\mathbf q=-k\nabla T,\quad \mathbf J_A=-\rho D_{AB}\nabla Y_A.
$$
- Navier-Stokes + species + energy: conservation-law PDE core.
- Heat exchanger:
$$
\dot Q=UA\Delta T_{lm}.
$$

These notes now include thermodynamics, heat transfer, mass transfer, PDE formulation, and numerical/CFD practice in one integrated reference.
