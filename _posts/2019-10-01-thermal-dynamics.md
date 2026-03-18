---
title: Thermal Dynamics and Thermodynamic Physics
tags: [thermodynamics, heat transfer, thermofluids, statistical physics, transport phenomena]
style: fill
color: light
description: Master-level notes connecting thermodynamics, heat transfer, statistical physics, phase change, exergy, and continuum transport.
---


## 1. Why Thermal Dynamics Is Really Physics

Thermal dynamics is not just a bag of steam tables and heat-transfer correlations. It is the part of physics that explains how macroscopic matter stores energy, exchanges it, degrades useful work into disorder, and evolves under transport, phase change, and irreversibility.

At master level, three descriptions have to coexist:

- the **macroscopic thermodynamic** description built from state variables such as $T,p,v,u,h,s$,
- the **continuum transport** description built from fields such as $T(\mathbf{x},t)$, $\mathbf{u}(\mathbf{x},t)$, and $p(\mathbf{x},t)$,
- the **microscopic physics** description in which entropy, heat capacity, conductivity, and phase change arise from molecular motion, interactions, and accessible states.

The point of the subject is to move cleanly between these layers.

If mechanics teaches us how forces move matter, thermal physics teaches us how internal energy, entropy, and transport processes determine which motions, transformations, and efficiencies are physically possible.

---

## 2. Thermal State, Equilibrium, and the Statistical View

### 2.1 Macrostates, microstates, and the state postulate

A **macrostate** is specified by a small set of measurable variables. A **microstate** is the detailed arrangement of all particles.

For a simple compressible single-component system at equilibrium, the state can often be described by two independent intensive variables. Equivalently, one may write a fundamental relation such as

$$
U = U(S,V,N).
$$

From that relation,

$$
T = \left(\frac{\partial U}{\partial S}\right)_{V,N}, \qquad
p = -\left(\frac{\partial U}{\partial V}\right)_{S,N}, \qquad
\mu = \left(\frac{\partial U}{\partial N}\right)_{S,V}.
$$

This is the cleanest physics statement of thermodynamics: temperature, pressure, and chemical potential are not primitive magic variables; they are slopes of the energy landscape.

### 2.2 Thermodynamic equilibrium

Full equilibrium means:

- **thermal equilibrium**: no temperature gradients driving heat flow,
- **mechanical equilibrium**: no unbalanced pressure or stress gradients driving acceleration,
- **chemical equilibrium**: no affinity left for composition change or reaction,
- **phase equilibrium**: competing phases have equal intensive potentials.

Most engineering models assume either global equilibrium or **local equilibrium**. Local equilibrium means each small fluid element is close enough to equilibrium that it still makes sense to define $T$, $p$, and $s$ pointwise even while the whole system is evolving.

This assumption is what allows continuum thermodynamics to exist.

### 2.3 Why entropy needs statistical physics

Macroscopic thermodynamics tells us entropy increases. Statistical physics explains why:

$$
S = k_B \ln \Omega,
$$

where $\Omega$ is the number of accessible microstates compatible with the macrostate.

High-entropy states are not morally preferred; they are overwhelmingly more numerous. Irreversibility in macroscopic systems is therefore a statement about probability concentration, not about microscopic equations forgetting how to run backward.

That is why heat naturally flows from hot to cold, mixing proceeds spontaneously, and reversible processes are idealized limits requiring infinitely gentle driving.

---

## 3. The First Law: Energy Accounting From Particles to Continua

The first law is conservation of energy, but in thermal physics the important point is that energy appears in multiple forms:

- microscopic random motion -> **internal energy** $U$,
- organized motion -> **kinetic energy** $KE$,
- position in body forces -> **potential energy** $PE$,
- boundary and shaft interactions -> **work**,
- cross-boundary transfer caused by temperature difference -> **heat**.

### 3.1 Closed systems

For a closed system,

$$
\Delta U + \Delta KE + \Delta PE = Q - W.
$$

The key conceptual correction is that **heat is not stored inside the system**. A system contains internal energy, not "heat content". Heat and work are path-dependent modes of energy transfer.

For quasi-equilibrium compression or expansion,

$$
W_b = \int_{V_1}^{V_2} p\,dV.
$$

### 3.2 Open systems and enthalpy

For a steady one-inlet, one-outlet control volume,

$$
\dot Q - \dot W_s
=
\dot m \left[(h_2-h_1) + \frac{V_2^2-V_1^2}{2} + g(z_2-z_1)\right].
$$

The appearance of enthalpy,

$$
h = u + pv,
$$

is not arbitrary. It packages internal energy and flow work into the natural energy variable for flowing matter. That is why turbines, compressors, nozzles, and heat exchangers are usually written in terms of $h$.

### 3.3 Local continuum form of the energy equation

At field level, thermal physics joins continuum mechanics. A representative internal-energy balance is

$$
\rho \frac{De}{Dt}
=
-\nabla \cdot \mathbf{q}
- p \nabla \cdot \mathbf{u}
+ \boldsymbol{\tau} : \nabla \mathbf{u}
+ \dot q_v,
$$

where:

- $\mathbf{q}$ is conductive heat flux,
- $-p \nabla \cdot \mathbf{u}$ is compressive work,
- $\boldsymbol{\tau} : \nabla \mathbf{u}$ is viscous dissipation,
- $\dot q_v$ is volumetric heating, such as Joule heating or nuclear/chemical release.

This equation is where thermodynamics stops being table lookup and becomes physics of fields.

---

## 4. The Second Law, Entropy, and Irreversibility

The first law tells us energy is conserved. The second law tells us not all energy is equally useful.

### 4.1 Clausius inequality and entropy balance

For any cycle,

$$
\oint \frac{\delta Q}{T} \le 0.
$$

For an internally reversible path,

$$
ds = \frac{\delta q_{rev}}{T}.
$$

For a control volume,

$$
\frac{dS_{cv}}{dt}
=
\sum \dot m_{in} s_{in}
- \sum \dot m_{out} s_{out}
+ \sum \frac{\dot Q_k}{T_k}
+ \dot S_{gen},
\qquad
\dot S_{gen} \ge 0.
$$

The entropy generation term is the mathematical fingerprint of irreversibility.

### 4.2 Where entropy generation comes from

Typical entropy-producing mechanisms are:

- finite temperature difference heat transfer,
- viscous friction,
- unrestrained expansion,
- mixing of species,
- electrical resistance,
- chemical reaction away from equilibrium,
- shock waves and strongly dissipative compressible flow.

Every real device works by paying some entropy-generation penalty.

### 4.3 Physical meaning

Entropy is simultaneously:

- a state variable,
- a measure of microscopic multiplicity,
- a bookkeeping variable for irreversibility,
- a bridge between energy and useful work.

This is why entropy can feel abstract in introductory courses and indispensable in advanced ones.

### 4.4 Free energy and spontaneous direction

At fixed temperature and volume, the relevant potential is the Helmholtz free energy

$$
A = U - TS.
$$

At fixed temperature and pressure, the relevant potential is the Gibbs free energy

$$
G = H - TS.
$$

Spontaneous evolution in a closed isothermal-isobaric system tends to lower $G$. That statement explains phase change, chemical equilibrium, dissolution, reaction direction, and much of materials thermodynamics.

---

## 5. Thermodynamic Potentials, Maxwell Relations, and Response Functions

### 5.1 Differential structure

For a simple compressible single-component system,

$$
dU = T\,dS - p\,dV + \mu\,dN.
$$

From Legendre transforms we obtain:

$$
H = U + pV, \qquad
A = U - TS, \qquad
G = U + pV - TS.
$$

with differentials

$$
dH = T\,dS + V\,dp + \mu\,dN,
$$

$$
dA = -S\,dT - p\,dV + \mu\,dN,
$$

$$
dG = -S\,dT + V\,dp + \mu\,dN.
$$

These are not just formal manipulations. They tell us which potential is most natural under which experimental constraints.

### 5.2 Maxwell relations

Because mixed second derivatives commute, we obtain identities such as

$$
\left(\frac{\partial T}{\partial V}\right)_S
=
-\left(\frac{\partial p}{\partial S}\right)_V,
$$

$$
\left(\frac{\partial S}{\partial V}\right)_T
=
\left(\frac{\partial p}{\partial T}\right)_V,
$$

$$
\left(\frac{\partial S}{\partial p}\right)_T
=
-\left(\frac{\partial V}{\partial T}\right)_p.
$$

These relations let us convert hard-to-measure entropy derivatives into measurable pressure-volume-temperature data.

### 5.3 Heat capacities, compressibility, and expansion

Important response functions are

$$
c_v = \left(\frac{\partial u}{\partial T}\right)_v, \qquad
c_p = \left(\frac{\partial h}{\partial T}\right)_p,
$$

$$
\alpha = \frac{1}{V}\left(\frac{\partial V}{\partial T}\right)_p, \qquad
\kappa_T = -\frac{1}{V}\left(\frac{\partial V}{\partial p}\right)_T.
$$

One central identity is

$$
c_p - c_v = \frac{T V \alpha^2}{\kappa_T}.
$$

This equation explains why compressibility and thermal expansion are tied to the gap between constant-pressure and constant-volume heating.

### 5.4 Stability conditions

Equilibrium is not enough; it must also be stable. For ordinary stable matter:

- $c_v > 0$,
- $c_p > 0$,
- $\kappa_T > 0$.

Negative compressibility or negative heat capacity signals either instability, nonstandard constraints, or exotic long-range systems beyond ordinary engineering thermodynamics.

### 5.5 Microscopic origin of heat capacity and conductivity

Physics enters here directly:

- in an ideal monatomic gas, $u = \frac{3}{2}RT$ per mole because translational degrees of freedom dominate,
- in polyatomic gases, rotational and vibrational modes activate as temperature rises,
- in solids, heat capacity reflects lattice vibrations and is described more deeply by phonon models,
- in metals, thermal conductivity often has strong electron contribution,
- in dielectrics and ceramics, phonon transport dominates.

So when tables list $c_p(T)$ or $k(T)$, those numbers are compressed statements about microscopic structure.

---

## 6. Real Substances, Phase Equilibrium, and Phase Change

### 6.1 Beyond the ideal gas

The ideal-gas law

$$
pv = RT
$$

is accurate when intermolecular forces are weak and the density is low enough. Real fluids deviate because finite molecular size and intermolecular attraction matter.

A compressibility factor model writes

$$
pv = ZRT,
$$

with $Z=1$ only in the ideal limit.

### 6.2 Phase equilibrium

Two phases can coexist only when the intensive variables that govern exchange are equal:

- equal temperature,
- equal pressure,
- equal chemical potential for each species.

This gives the thermodynamic meaning of a saturation curve.

### 6.3 Clapeyron and Clausius-Clapeyron relations

Along a phase boundary,

$$
\frac{dp_{sat}}{dT} = \frac{h_{fg}}{T(v_g-v_f)}.
$$

For vaporization with $v_g \gg v_f$ and near-ideal vapor behavior, this reduces approximately to

$$
\frac{d \ln p_{sat}}{dT} \approx \frac{h_{fg}}{R T^2}.
$$

This relation explains why boiling temperature rises with pressure and why vacuum lowers the boiling point.

### 6.4 Metastability, nucleation, and interfacial physics

Boiling and condensation are not just equilibrium-property problems. They involve:

- interfacial tension,
- nucleation barriers,
- wetting behavior,
- transient growth and collapse of bubbles or droplets.

This is why real boiling curves contain metastable regions, critical heat flux, and abrupt transitions that simple equilibrium thermodynamics alone cannot predict.

---

## 7. Heat Transfer as Transport Physics

Thermodynamics answers **whether** a process is allowed and what the end states look like. Heat transfer answers **how fast** the temperature field changes in space and time.

### 7.1 Fourier law and thermal diffusivity

Conduction is modeled by

$$
\mathbf{q} = -k \nabla T.
$$

For isotropic media, $k$ is a scalar. For crystals, composites, or layered solids, conductivity can be tensorial.

Thermal diffusivity is

$$
\alpha_{th} = \frac{k}{\rho c}.
$$

Large $\alpha_{th}$ means temperature disturbances smooth out quickly.

### 7.2 The heat equation

Combining energy conservation with Fourier's law gives, for a stationary medium with constant properties,

$$
\rho c \frac{\partial T}{\partial t}
=
k \nabla^2 T + \dot q_v.
$$

Or

$$
\frac{\partial T}{\partial t}
=
\alpha_{th} \nabla^2 T + \frac{\dot q_v}{\rho c}.
$$

This PDE is the canonical bridge from thermodynamics to mathematical physics.

### 7.3 Advection-diffusion form

In moving fluids the energy equation becomes

$$
\rho c_p \frac{DT}{Dt}
=
\nabla \cdot (k \nabla T) + \Phi + \dot q_v,
$$

where $\Phi$ denotes viscous dissipation. The material derivative $DT/Dt$ contains advection, which can dominate diffusion in fast flows.

### 7.4 Lumped versus distributed thermal models

The Biot number,

$$
Bi = \frac{hL_c}{k},
$$

compares internal conduction resistance to surface convection resistance.

If $Bi \ll 1$, the body can be approximated as nearly isothermal, giving a lumped-capacitance model.

The Fourier number,

$$
Fo = \frac{\alpha_{th} t}{L_c^2},
$$

measures how far transient diffusion has progressed.

These two dimensionless groups are the quickest way to decide whether a thermal problem is ODE-like or PDE-like.

---

## 8. Convection, Boundary Layers, and Dimensionless Structure

### 8.1 Why convection is hard

Convection combines:

- diffusion of momentum,
- diffusion of heat,
- advection by the flow field,
- geometry-dependent boundary-layer growth,
- turbulence in most practical systems.

That is why heat-transfer coefficients are rarely fundamental constants and almost always emerge from scaling or experiment.

### 8.2 Core groups

The main dimensionless numbers are

$$
Re = \frac{\rho U L}{\mu}, \qquad
Pr = \frac{\nu}{\alpha_{th}}, \qquad
Pe = Re \, Pr,
$$

$$
Nu = \frac{hL}{k}, \qquad
Gr = \frac{g \beta \Delta T L^3}{\nu^2}, \qquad
Ra = Gr\,Pr.
$$

Physical interpretation:

- $Re$ compares inertia to viscosity,
- $Pr$ compares momentum diffusion to thermal diffusion,
- $Pe$ compares advection to thermal diffusion,
- $Nu$ measures enhancement beyond pure conduction,
- $Ra$ controls buoyancy-driven instability and natural convection strength.

### 8.3 Boundary layers

Near a wall, velocity and temperature adjust in thin layers. Whether the thermal boundary layer is thicker or thinner than the velocity boundary layer depends strongly on $Pr$.

That single fact explains why liquid metals, air, and oils show radically different convection behavior.

### 8.4 Natural convection and buoyancy

Under the Boussinesq approximation, density variation is neglected everywhere except in the buoyancy term. This captures thermal plumes, room convection, and many heat-exchanger or electronics-cooling flows without needing full compressible dynamics.

### 8.5 Heat exchangers as controlled entropy management

Heat exchangers are often taught as LMTD or NTU problems, but their deeper meaning is this:

- they move energy between streams,
- they must do so with finite temperature difference,
- therefore they inevitably generate entropy.

The engineering problem is to get the required heat duty with acceptable pressure drop, size, cost, and irreversibility.

---

## 9. Radiation, Phase Change, and Interfacial Thermal Physics

### 9.1 Thermal radiation

A blackbody emits

$$
E_b = \sigma T^4.
$$

Real surfaces emit less:

$$
q = \epsilon \sigma A \left(T_s^4 - T_{sur}^4\right)
$$

in the simplest enclosure approximation.

Radiation is nonlinear, geometry-dependent, and spectral. At high temperatures it often becomes the dominant mode of heat transfer.

### 9.2 View factors and participating media

Radiative exchange depends on geometry through view factors. If the medium itself absorbs, emits, or scatters radiation, one needs the radiative transfer equation rather than a simple surface-balance model.

This matters in furnaces, combustion chambers, atmospheric physics, and reentry heating.

### 9.3 Boiling, condensation, and critical heat flux

Phase-change heat transfer is powerful because latent heat is large, but it is also dangerous because transport can change regime abruptly.

Key ideas:

- nucleate boiling provides very high heat-transfer rates,
- film boiling insulates the surface,
- critical heat flux marks the transition beyond which the surface can overheat dramatically,
- condensation may be filmwise or dropwise, with very different coefficients.

These are classic examples where interfacial physics, hydrodynamics, and thermodynamics all matter simultaneously.

---

## 10. Open Systems, Cycles, and Exergy

### 10.1 Ideal cycles are structure, not reality

Carnot, Otto, Diesel, Brayton, and Rankine cycles are best viewed as idealized skeletons. They reveal how compression, expansion, heat addition, and heat rejection are organized, but real devices depart because of:

- friction,
- finite-rate heat transfer,
- pressure losses,
- leakage,
- nonideal combustion,
- off-design operation,
- material temperature limits.

### 10.2 Efficiency limits

For a heat engine between hot and cold reservoirs,

$$
\eta \le 1 - \frac{T_c}{T_h}.
$$

This is not a statement about engine cleverness. It is a fundamental limit set by the second law.

For refrigerators and heat pumps,

$$
COP_R = \frac{Q_L}{W_{in}}, \qquad
COP_{HP} = \frac{Q_H}{W_{in}}.
$$

### 10.3 Exergy: the value of energy

Energy is conserved; exergy is not. Exergy measures the maximum useful work relative to a reference environment.

A common specific-flow exergy expression is

$$
b = (h-h_0) - T_0(s-s_0) + \frac{V^2}{2} + gz.
$$

For closed systems one often uses

$$
b = (u-u_0) + p_0(v-v_0) - T_0(s-s_0) + \frac{V^2}{2} + gz.
$$

The exergy destruction relation

$$
\dot X_{dest} = T_0 \dot S_{gen}
$$

is one of the most useful equations in advanced thermal design. It identifies where useful work potential is being destroyed and therefore where redesign effort matters most.

### 10.4 A master-level cycle question

At undergraduate level one asks: "What is the efficiency?"

At master level one asks:

- where is entropy generated,
- which component dominates exergy destruction,
- what constraint is active: temperature limit, pressure drop, stress, chemistry, or control,
- what model fidelity is required to improve the design.

---

## 11. Nonequilibrium Thermodynamics and Coupled Transport

Classical equilibrium thermodynamics is not the whole story. Real systems operate with gradients and fluxes.

### 11.1 Entropy production density

A generic local entropy balance can be written as

$$
\rho \frac{Ds}{Dt} + \nabla \cdot \mathbf{J}_s = \sigma_s,
\qquad
\sigma_s \ge 0,
$$

where $\sigma_s$ is the entropy production density.

For coupled transport, $\sigma_s$ is built from products of fluxes and thermodynamic forces.

### 11.2 Linear irreversible thermodynamics

Near equilibrium, one often writes

$$
J_i = \sum_j L_{ij} X_j,
$$

where $J_i$ are fluxes and $X_j$ are driving forces such as gradients of temperature, chemical potential, or electric potential.

Onsager reciprocity states, under suitable symmetry assumptions,

$$
L_{ij} = L_{ji}.
$$

This framework explains thermoelectricity, diffusion-heat coupling, and other cross-effects that lie beyond basic heat-transfer courses.

### 11.3 Why this matters in engineering

Many "empirical" couplings are really compressed nonequilibrium thermodynamics:

- thermo-diffusion in mixtures,
- electrochemical heating in batteries,
- thermoelastic damping,
- porous-media heat and mass transport,
- reacting-flow enthalpy and species coupling.

If a thermal system has gradients of temperature, composition, or electrical potential, nonequilibrium thinking is usually the right language.

---

## 12. Coupling Thermal Physics to Fluids, Solids, and Materials

### 12.1 Fluid mechanics coupling

Thermal gradients change density, viscosity, sound speed, and phase. That is why thermal analysis and fluid analysis cannot usually be separated in:

- natural convection,
- combustion,
- atmospheric and ocean flows,
- turbomachinery,
- boiling channels,
- high-speed compressible flow.

The energy equation is as fundamental to fluid mechanics as continuity and momentum.

### 12.2 Solid mechanics coupling

Thermal fields create stress through expansion mismatch. A simple isotropic thermal strain is

$$
\epsilon_{th} = \alpha_T \Delta T.
$$

If expansion is constrained, thermal stress develops. This governs:

- thermal shock,
- warping in manufacturing,
- residual stress in welding,
- electronic packaging failure,
- turbine blade life,
- brake-disc cracking.

### 12.3 Materials physics coupling

Material thermal behavior comes from microstructure:

- crystalline order affects conductivity,
- defects scatter phonons,
- porosity changes effective diffusivity,
- phase transformations alter latent heat and expansion,
- radiation properties depend on surface chemistry and roughness.

So advanced thermal design is never independent of materials science.

### 12.4 Chemistry and reacting systems

Combustion, fuel cells, catalysis, and batteries are thermal systems with chemical work and composition evolution. Their correct models require:

- species balances,
- reaction kinetics,
- enthalpy of formation,
- heat release,
- diffusion and transport limitations.

That is why modern thermal engineering often looks like coupled thermodynamics + fluid mechanics + electrochemistry + materials physics.

---

## 13. Modeling Hierarchy: From Simple Balances to Research-Grade Physics

The right model depends on the dominant physics and the decision you need to make.

### 13.1 Level 1: Equilibrium thermodynamics

Use when the goal is state change, ideal performance limit, or cycle bookkeeping.

Typical tools:

- property relations,
- phase diagrams,
- energy and entropy balances,
- exergy accounting.

### 13.2 Level 2: Lumped dynamic models

Use when spatial gradients are weak or intentionally averaged out.

Typical tools:

- thermal capacitance networks,
- overall heat-transfer coefficients,
- reduced-order control-oriented models.

### 13.3 Level 3: Distributed transport models

Use when temperature, velocity, or concentration vary significantly in space.

Typical tools:

- heat equation,
- advection-diffusion equations,
- Navier-Stokes + energy,
- conjugate heat transfer,
- porous-media models.

### 13.4 Level 4: Multiphysics and multiscale models

Use when phase change, reaction, radiation, deformation, or microstructure matter strongly.

Typical tools:

- CFD with species and radiation,
- phase-field methods,
- kinetic or mesoscopic models,
- thermo-mechanical finite elements,
- reduced models informed by detailed simulation.

### 13.5 The master-level habit

Do not ask "What is the most advanced model I can write?"

Ask:

- which terms dominate,
- which constitutive law is uncertain,
- which approximation sets the error floor,
- which measurement can falsify the model fastest.

That habit is what separates mathematically dense work from genuinely good physics.

---

## 14. Common Conceptual Traps

1. Treating heat as something stored rather than transferred.
2. Using entropy only as a formula instead of as an irreversibility measure.
3. Applying ideal-gas relations in dense, high-pressure, or two-phase regions.
4. Using $c_p$ and $k$ as constants when temperature dependence is dominant.
5. Forgetting that "steady state" can still contain strong spatial gradients.
6. Confusing equilibrium thermodynamics with transport-limited reality.
7. Ignoring exergy and therefore missing where performance is actually lost.
8. Using a convection coefficient correlation outside its regime.
9. Ignoring coupling to stress, chemistry, or flow when the physics is multiphysics.

---

## 15. A Master-Level Way to Study Thermal Dynamics

If you want this topic to feel coherent rather than fragmented, study it in the following order:

1. **Thermodynamic structure**
   Learn state variables, the first and second laws, entropy, and thermodynamic potentials until differential relations feel natural.
2. **Statistical interpretation**
   Connect entropy, free energy, and heat capacity to microscopic states and molecular motion.
3. **Transport equations**
   Derive Fourier conduction and the heat equation from conservation laws, then add advection and coupling to flow.
4. **Real substances and phase change**
   Study why equations of state fail, why latent heat exists, and how interfaces alter thermal behavior.
5. **Exergy and irreversibility**
   Use entropy generation to rank losses in actual devices.
6. **Multiphysics coupling**
   Tie thermal analysis to fluids, solids, materials, and chemistry.

At that point, thermodynamics stops looking like a disconnected service subject and starts looking like what it really is: the physics of energy, disorder, matter, and limits.

---

## 16. Compact Recall Map

- **State and equilibrium** tell you how to describe matter.
- **First law** tells you how to account for energy.
- **Second law** tells you which directions are possible and what useful work is lost.
- **Potentials and response functions** tell you how materials react to constraints.
- **Phase equilibrium** tells you where matter changes structure.
- **Transport equations** tell you how fast thermal fields evolve.
- **Exergy** tells you where design improvement matters.
- **Coupled multiphysics** tells you why real thermal systems rarely belong to thermodynamics alone.

This is the level at which thermal dynamics connects back to physics: not as memorized formulas, but as one consistent description of energy, matter, gradients, and irreversible change.
