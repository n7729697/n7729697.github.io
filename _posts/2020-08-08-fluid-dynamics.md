---
title: Fluid Dynamics and Aerodynamics Notes
tags: [fluid dynamics, aerodynamics, compressible flow, CFD, PDE]
style: fill
color: info
description: In-depth notes on fluid dynamics and aerodynamics from fundamentals to compressible flow, boundary layers, turbulence, and modern CFD numerics.
---


## 1. Modeling Hierarchy

Fluid/aerodynamic analysis is typically layered:

1. regime identification (Re, Ma, Kn, Fr, etc.),
2. governing equations + constitutive closure,
3. reduced models (potential flow, boundary layer, quasi-1D),
4. turbulence/shock/transition treatment,
5. numerical discretization and validation.

Choosing the right model complexity is the central engineering decision.

---

## 2. Governing PDEs

### 2.1 Continuity

$$
\frac{\partial \rho}{\partial t}+\nabla\cdot(\rho\mathbf u)=0.
$$

Incompressible limit ($\rho=\mathrm{const}$):

$$
\nabla\cdot\mathbf u=0.
$$

### 2.2 Momentum (Navier-Stokes)

$$
\frac{\partial(\rho\mathbf u)}{\partial t}+\nabla\cdot(\rho\mathbf u\otimes\mathbf u)
=-\nabla p+\nabla\cdot\boldsymbol\tau+\rho\mathbf g.
$$

Newtonian stress tensor:

$$
\boldsymbol\tau=\mu\left(\nabla\mathbf u+(\nabla\mathbf u)^T\right)-\frac{2}{3}\mu(\nabla\cdot\mathbf u)\mathbf I.
$$

### 2.3 Energy equation

For compressible aerodynamics (enthalpy form):

$$
\frac{\partial(\rho h)}{\partial t}+\nabla\cdot(\rho\mathbf u h)
=\frac{Dp}{Dt}+\nabla\cdot(k\nabla T)+\Phi.
$$

plus EOS (often ideal gas):

$$
p=\rho RT.
$$

### 2.4 Non-dimensionalization and key groups

$$
Re=\frac{\rho UL}{\mu},\quad Ma=\frac{U}{a},\quad Fr=\frac{U}{\sqrt{gL}},\quad Pr=\frac{\nu}{\alpha}.
$$

These numbers determine dominant balances and valid simplifications.

---

## 3. Inviscid, Potential, and Vorticity Views

### 3.1 Euler equations

When viscosity is negligible in bulk flow:

$$
\frac{\partial\mathbf u}{\partial t}+\mathbf u\cdot\nabla\mathbf u=-\frac{1}{\rho}\nabla p.
$$

### 3.2 Potential flow

For irrotational flow $\mathbf u=\nabla\phi$ with incompressible condition:

$$
\nabla^2\phi=0.
$$

Useful for pressure/lift trends outside boundary layers and wakes.

### 3.3 Vorticity transport

With $\boldsymbol\omega=\nabla\times\mathbf u$, vorticity dynamics clarifies shear-layer and vortex processes central to aerodynamics and wake control.

---

## 4. Boundary Layers and Wall-Bounded Flows

### 4.1 No-slip and boundary-layer structure

No-slip at solid wall creates thin viscous layer with strong gradients.

For zero-pressure-gradient laminar plate flow (Blasius scaling):

$$
\delta(x)\sim \frac{x}{\sqrt{Re_x}}.
$$

### 4.2 Integral momentum equation

Used for practical boundary-layer growth and separation assessment.

### 4.3 Separation and stall

Adverse pressure gradients can trigger separation, causing large drag rise and possible lift breakdown (airfoil/wing stall).

---

## 5. Internal Flows and Hydraulic Losses

For ducts/pipes:

$$
\Delta p = f\frac{L}{D}\frac{\rho U_m^2}{2}.
$$

Laminar fully developed circular flow has analytic structure; turbulent flow relies on friction correlations and roughness models.

Thermal coupling introduces Nusselt-based closures and entrance-region effects.

---

## 6. Compressible Aerodynamics

### 6.1 Isentropic relations

$$
\frac{T_0}{T}=1+\frac{\gamma-1}{2}Ma^2,
$$

$$
\frac{p_0}{p}=\left(1+\frac{\gamma-1}{2}Ma^2\right)^{\frac{\gamma}{\gamma-1}}.
$$

### 6.2 Area-Mach relation (quasi-1D)

$$
\frac{dA}{A}=(Ma^2-1)\frac{dV}{V}.
$$

This explains choking and converging-diverging nozzle behavior.

### 6.3 Normal shocks

Across normal shock, conservation + EOS yield jump conditions:

- $Ma_1>1 \to Ma_2<1$,
- $p,T,\rho$ increase,
- entropy increases,
- total pressure decreases.

### 6.4 Oblique shocks and expansion fans

Compression turns induce oblique shocks; expansion turns induce Prandtl-Meyer fans. Shock-wave/boundary-layer interaction is a major design challenge in supersonic systems.

---

## 7. Aerodynamics of Wings and 3D Effects

### 7.1 Lift and drag decomposition

$$
L=\frac12\rho U_\infty^2 S C_L,
\qquad
D=\frac12\rho U_\infty^2 S C_D.
$$

Drag components include parasite + induced + wave drag (compressible/high-speed regimes).

### 7.2 Finite-wing corrections

Finite span generates tip vortices and induced downwash, reducing effective angle of attack and increasing induced drag relative to 2D airfoil predictions.

### 7.3 Compressibility effects

As Mach increases toward transonic, local supersonic pockets and shocks create wave drag rise and buffet risks.

---

## 8. Turbulence, Transition, and Modeling

### 8.1 Transition

Laminar-to-turbulent transition depends on disturbance environment, roughness, pressure gradient, and free-stream turbulence.

### 8.2 Turbulence closures

- RANS: cheap, robust for engineering sweeps,
- LES: better unsteady structures at higher cost,
- DNS: reference-level physics at extreme cost.

### 8.3 Current practical “SOTA”

In industry, hybrid RANS-LES + wall-modeling + calibrated meshing remains dominant. Pure data-driven closures are promising but require strict physical constraints and thorough validation.

---

## 9. Numerical Methods and CFD Pipeline

### 9.1 Discretization

- finite volume (dominant in industrial CFD),
- finite element (complex multiphysics geometry),
- high-order finite difference/spectral methods (research-grade accuracy on structured meshes).

### 9.2 Fluxes and stabilization

Compressible solvers: upwind/Riemann-based fluxes (e.g., Roe/HLLC variants).

Incompressible solvers: pressure-correction/projection (SIMPLE/PISO families).

Shock-capturing and boundedness control are critical.

### 9.3 Time integration

- explicit for wave-dominated problems (CFL-limited),
- implicit for stiff or steady-state acceleration,
- dual time-stepping in unsteady compressible simulations.

### 9.4 Linear solvers and acceleration

Krylov + multigrid + preconditioning is the practical performance core.

---

## 10. Verification, Validation, and UQ

Research-grade or industrial-grade studies require:

1. code and solution verification (grid/time convergence),
2. validation against experiments/benchmarks,
3. uncertainty quantification for model-form and parameter errors.

Without V&V+UQ, high-fidelity visuals do not imply reliable predictions.

---

## 11. Practical Workflow for Aerodynamic Design

1. Determine regime map (subsonic/transonic/supersonic, Re range).
2. Select baseline model (potential + BL, RANS, hybrid, LES).
3. Build mesh strategy around shocks, boundary layers, wakes.
4. Run sensitivity and convergence studies.
5. Calibrate against trusted data.
6. Optimize target metrics ($C_L/C_D$, pressure loss, thermal constraints, stability margins).

---

## Compact Formula Sheet

- Continuity: $\partial_t\rho+\nabla\cdot(\rho\mathbf u)=0$.
- Navier-Stokes: momentum conservation with viscous stress closure.
- Bernoulli (ideal streamline): $p/\rho g + V^2/2g + z = \text{const}$.
- Isentropic compressible relations: $T_0/T$, $p_0/p$ vs Mach.
- Area-Mach: $dA/A=(Ma^2-1)dV/V$.
- Pipe loss: $\Delta p=f(L/D)(\rho U_m^2/2)$.
- Aerodynamic forces: $L,D=\frac12\rho U_\infty^2 S C_{L,D}$.

These notes now integrate fluid dynamics, aerodynamics, compressible flow physics, and modern CFD methodology at an advanced level.
