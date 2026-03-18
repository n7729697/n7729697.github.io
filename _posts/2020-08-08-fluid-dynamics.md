---
title: Fluid Dynamics Notes
tags: [fluid dynamics, aerodynamics, compressible flow, thermofluids, combustion]
style: fill
color: light
description: Consolidated notes from fluid mechanics and aerodynamics — from statics and Bernoulli to airfoil theory, compressible shocks, nozzle design, and combustion engines, with derivations and physical reasoning.
---

## 1. Fluid Mechanics Core Model

All of fluid mechanics rests on three conservation laws applied to a continuum. The beauty — and difficulty — is that these laws are fully sufficient to describe everything from honey dripping off a spoon to a hypersonic re-entry vehicle, but solving them exactly is almost never possible.

### 1.1 Continuity (Mass Conservation)

Mass cannot be created or destroyed. For a differential control volume:

$$
\frac{\partial \rho}{\partial t}+\nabla\cdot(\rho\mathbf{u})=0
$$

The first term is the local rate of density change; the second is the net mass flux out of the volume. The equation says: if density at a point is decreasing, mass must be flowing away from that point.

For **incompressible flow** ($\rho = \text{const}$), this simplifies dramatically:

$$
\nabla\cdot\mathbf{u}=0
$$

This is a purely kinematic constraint — the velocity field must be divergence-free. Physically it means fluid elements can deform and rotate but cannot change volume. In 2D, any incompressible velocity field can be described by a **stream function** $\psi$ where $u = \partial\psi/\partial y$, $v = -\partial\psi/\partial x$, automatically satisfying continuity.

For steady flow through a duct of varying area, integrating continuity gives the familiar:

$$
\rho_1 A_1 V_1 = \rho_2 A_2 V_2 = \dot{m} = \text{const}
$$

When $\rho$ is constant, this reduces to $A_1 V_1 = A_2 V_2$ — the reason a garden hose squirts faster when you pinch the end.

### 1.2 Momentum (Navier–Stokes Equations)

Newton's second law applied to a fluid element:

$$
\rho\left(\frac{\partial \mathbf{u}}{\partial t}+\mathbf{u}\cdot\nabla\mathbf{u}\right)
= -\nabla p + \mu\nabla^2\mathbf{u}+\rho\mathbf{g}
$$

The left side is the **material acceleration** — the rate of change of velocity experienced by a fluid particle. It has two parts:

- $\partial\mathbf{u}/\partial t$: **local acceleration** (unsteady effects, e.g., a valve opening),
- $\mathbf{u}\cdot\nabla\mathbf{u}$: **convective acceleration** (a fluid particle speeds up by moving into a faster region, e.g., flow entering a constriction).

The right side contains the forces per unit volume:

- $-\nabla p$: **pressure gradient** force — fluid accelerates from high to low pressure,
- $\mu\nabla^2\mathbf{u}$: **viscous diffusion** — momentum spreads from fast regions to slow regions, proportional to viscosity $\mu$,
- $\rho\mathbf{g}$: **gravity** (or other body forces).

The ratio of inertial to viscous forces gives the **Reynolds number**:

$$
Re = \frac{\rho U L}{\mu} = \frac{U L}{\nu}
$$

When $Re \gg 1$, inertia dominates and the flow can be treated as nearly inviscid away from boundaries. When $Re \ll 1$ (e.g., microfluidics, sedimentation), viscous forces dominate and inertia is negligible — this is **Stokes flow**, where the Navier–Stokes equations become linear.

**Why exact solutions are rare:** The $\mathbf{u}\cdot\nabla\mathbf{u}$ term makes the equations nonlinear. This nonlinearity is responsible for turbulence, vortex shedding, and the general complexity of fluid motion. Only a handful of exact solutions exist (Couette, Poiseuille, Stokes first/second problem, etc.), and practical engineering relies on simplifications, correlations, and numerical methods.

### 1.3 Energy Conservation

When temperature variation matters (heating, cooling, combustion), we need the energy equation. For a Newtonian fluid with Fourier heat conduction:

$$
\rho c_p \left(\frac{\partial T}{\partial t} + \mathbf{u}\cdot\nabla T\right) = k\nabla^2 T + \Phi + \dot{q}'''
$$

where $k$ is thermal conductivity, $\Phi$ is the viscous dissipation function (kinetic energy converted to heat by friction), and $\dot{q}'''$ is volumetric heat generation (e.g., combustion). The **Prandtl number** $Pr = \nu/\alpha = \mu c_p/k$ compares momentum diffusivity to thermal diffusivity and governs how velocity and thermal boundary layers relate.

For compressible flows (rockets, jet engines), the energy equation couples tightly with momentum and the equation of state $p = \rho R T$ (ideal gas), creating a system where pressure waves, density changes, and temperature all interact simultaneously.

---

## 2. Fluid Properties and Regimes

Understanding flow regimes is the first step in any analysis — choosing the wrong regime leads to applying the wrong simplifications.

### 2.1 Key Properties

| Property | Symbol | Physical meaning | Typical values (air at STP) |
|----------|--------|-----------------|---------------------------|
| Density | $\rho$ | Mass per volume | 1.225 kg/m³ |
| Dynamic viscosity | $\mu$ | Resistance to shearing | $1.81 \times 10^{-5}$ Pa·s |
| Kinematic viscosity | $\nu = \mu/\rho$ | Momentum diffusivity | $1.48 \times 10^{-5}$ m²/s |
| Speed of sound | $a = \sqrt{\gamma R T}$ | Information propagation speed | 343 m/s |
| Surface tension | $\sigma$ | Energy per unit interface area | 0.073 N/m (water-air) |
| Vapour pressure | $p_v$ | Threshold for cavitation | 2.34 kPa (water, 20°C) |

### 2.2 Dimensionless Groups and What They Physically Mean

| Group | Formula | Physical meaning | Critical values |
|-------|---------|-----------------|----------------|
| **Reynolds** $Re$ | $\rho UL/\mu$ | Inertia vs. viscosity | $\sim 5\times10^5$ (flat plate transition) |
| **Mach** $Ma$ | $U/a$ | Flow speed vs. sound speed | 0.3 (compressibility threshold) |
| **Froude** $Fr$ | $U/\sqrt{gL}$ | Inertia vs. gravity | 1 (subcritical/supercritical transition) |
| **Prandtl** $Pr$ | $\nu/\alpha$ | Momentum vs. thermal diffusivity | 0.71 (air), 7 (water) |
| **Strouhal** $St$ | $fL/U$ | Oscillation vs. flow speed | ~0.2 (vortex shedding from cylinders) |

### 2.3 Flow Regime Map

The regime determines which terms in the governing equations you can neglect:

- **Laminar vs. turbulent**: below critical $Re$, flow is orderly (layers slide past each other); above it, random fluctuations dominate transport of momentum, heat, and mass. Turbulent flows have far higher mixing, friction, and heat transfer.
- **Viscous vs. inviscid regions**: even at high $Re$, viscosity matters near solid surfaces (boundary layers) and in wakes. Outside these regions, the flow is nearly inviscid and well-modeled by Euler equations.
- **Incompressible vs. compressible**: when $Ma < 0.3$, density changes are < 5% and can be ignored. Above $Ma = 0.3$, density variations couple to the velocity field and wave phenomena (shocks, expansions) appear.
- **Subsonic / transonic / supersonic / hypersonic**: these regimes ($Ma < 0.8$, $0.8 < Ma < 1.2$, $1.2 < Ma < 5$, $Ma > 5$) have qualitatively different flow physics — transonic has mixed sub/supersonic regions and shocks on the body; hypersonic has extreme heating, real-gas effects, and ionisation.

---

## 3. Fluid Statics

When a fluid is **at rest**, all shear stresses vanish (by definition of a fluid — it deforms continuously under shear). The only stress is **normal pressure**, and it varies only with elevation:

$$
\frac{dp}{dz}=-\rho g
$$

This says pressure increases with depth (negative $z$ direction). For a liquid of constant density, integrating gives:

$$
p = p_0 + \rho g h
$$

where $h$ is depth below the free surface. At 10 m depth in water, $p \approx 1$ atm gauge — this is why divers feel enormous pressure and why dams must be thickest at the base.

### 3.1 Hydrostatic Force on Submerged Surfaces

The force on a flat submerged surface of area $A$ inclined at angle $\theta$:

$$
F = \rho g \bar{h} A
$$

where $\bar{h}$ is the depth of the centroid of the surface. The force acts at the **centre of pressure**, which is always below the centroid (deeper). For a rectangular gate of height $b$ hinged at the top:

$$
y_{cp} - \bar{y} = \frac{I_{xx,c}}{\bar{y}\, A}
$$

where $I_{xx,c}$ is the second moment of area about the centroidal axis and $\bar{y}$ is the centroid distance along the inclined plane. This offset is crucial for structural design — it determines the bending moment on dam gates, ship hulls, and tank walls.

### 3.2 Buoyancy and Stability

**Archimedes' principle:** a submerged body experiences an upward buoyant force equal to the weight of displaced fluid:

$$
F_B = \rho_f g V_{\text{displaced}}
$$

A floating body is in equilibrium when $F_B = W$. But equilibrium alone is not enough — it must be **stable**. A floating vessel is stable if the **metacentre** $M$ is above the centre of gravity $G$. The metacentric height:

$$
GM = \frac{I_{\text{waterplane}}}{V_{\text{displaced}}} - BG
$$

where $I_{\text{waterplane}}$ is the second moment of the waterplane area about the roll axis and $BG$ is the distance between the centre of buoyancy and the centre of gravity. A wide, flat hull (large $I$) is more stable — this is why barges don't capsize.

---

## 4. Bernoulli Equation and Mechanical Energy

### 4.1 Derivation and Physical Meaning

For **steady, incompressible, inviscid** flow along a streamline, the Euler equation integrates to:

$$
\frac{p}{\rho g}+\frac{V^2}{2g}+z = \text{const}
$$

Each term has the dimension of **head** (length):

- $p/(\rho g)$: **pressure head** — the height of fluid column that would produce pressure $p$,
- $V^2/(2g)$: **velocity head** — how high a fluid particle could rise if all kinetic energy were converted to potential energy,
- $z$: **elevation head**.

Bernoulli's equation is really an **energy conservation statement** along a streamline: the sum of pressure energy, kinetic energy, and potential energy per unit weight is constant (because no energy is lost to friction or added by machinery).

### 4.2 Engineering Form with Losses and Machines

Real systems have pumps, turbines, and friction losses. The **extended energy equation** between two points in a pipe system:

$$
\frac{p_1}{\rho g}+\alpha_1\frac{V_1^2}{2g}+z_1+h_p
=
\frac{p_2}{\rho g}+\alpha_2\frac{V_2^2}{2g}+z_2+h_t+h_L
$$

where $h_p$ is pump head (energy added), $h_t$ is turbine head (energy extracted), $h_L$ is total friction loss, and $\alpha$ is the kinetic-energy correction factor ($\alpha = 1$ for uniform flow, $\alpha = 2$ for laminar pipe flow, $\alpha \approx 1.05$ for turbulent).

### 4.3 Applications

**Pitot tube:** measures velocity by converting kinetic energy to pressure. Facing into the flow, the stagnation pressure is $p_0 = p + \tfrac{1}{2}\rho V^2$, so:

$$
V = \sqrt{\frac{2(p_0 - p)}{\rho}}
$$

**Venturi meter:** a converging-diverging section where continuity ($A_1 V_1 = A_2 V_2$) and Bernoulli give the flow rate from a pressure difference:

$$
Q = C_d A_2 \sqrt{\frac{2(p_1 - p_2)}{\rho\left[1 - (A_2/A_1)^2\right]}}
$$

where $C_d \approx 0.98$ corrects for real-fluid effects.

**Toricelli's theorem:** the speed of a jet draining from a tank with surface height $h$ above the orifice: $V = \sqrt{2gh}$ — identical to free-fall from height $h$.

---

## 5. Internal Flow and Boundary Layers

### 5.1 Pipe Flow Development

When fluid enters a pipe from a reservoir, the velocity profile is initially flat (uniform). Viscous effects grow inward from the wall, forming a **boundary layer** that eventually fills the entire pipe cross-section. Beyond this **entrance length** $L_e$, the flow is **fully developed** — the velocity profile no longer changes with axial distance.

$$
L_{e,\text{lam}} \approx 0.06\,Re_D\cdot D, \qquad L_{e,\text{turb}} \approx 4.4\,Re_D^{1/6}\cdot D
$$

For laminar flow at $Re_D = 2000$ in a 25 mm pipe, $L_e \approx 3$ m. For turbulent flow at $Re_D = 10^5$, $L_e \approx 30 D \approx 0.75$ m — turbulent mixing accelerates profile development.

### 5.2 Fully Developed Laminar Flow (Hagen–Poiseuille)

In a circular pipe, the parabolic velocity profile is one of the few exact Navier–Stokes solutions:

$$
u(r) = \frac{R^2}{4\mu}\left(-\frac{dp}{dx}\right)\left(1 - \frac{r^2}{R^2}\right)
$$

The maximum velocity is at the centreline ($r=0$), and the mean velocity is exactly half the max: $U_m = u_{\max}/2$. Integrating gives the volume flow rate:

$$
Q = \frac{\pi R^4}{8\mu}\left(-\frac{dp}{dx}\right) = \frac{\pi D^4 \Delta p}{128\mu L}
$$

This $D^4$ dependence is extraordinary — halving a pipe diameter at fixed pressure drop cuts flow rate by a factor of 16. This is why arterial stenosis (vessel narrowing) is so dangerous, and why pipe sizing dominates hydraulic system design.

### 5.3 Friction Factor and Pressure Drop

The **Darcy–Weisbach equation** unifies laminar and turbulent pipe friction:

$$
\Delta p = f\frac{L}{D}\frac{\rho U_m^2}{2}
$$

where $f$ is the Darcy friction factor:

- **Laminar:** $f = 64/Re_D$ (exact, from the Hagen–Poiseuille solution).
- **Turbulent:** given by the **Colebrook equation** (implicit):

$$
\frac{1}{\sqrt{f}} = -2.0\log\left(\frac{\varepsilon/D}{3.7} + \frac{2.51}{Re_D\sqrt{f}}\right)
$$

where $\varepsilon$ is wall roughness. This is plotted as the **Moody chart** — the single most-used diagram in pipe flow engineering. At high $Re$, $f$ becomes independent of $Re$ and depends only on relative roughness (fully rough regime).

**Minor losses** from components (valves, bends, expansions):

$$
h_{L,\text{minor}} = K\frac{V^2}{2g}
$$

where $K$ is a loss coefficient tabulated for each fitting type. A sudden expansion from area $A_1$ to $A_2$ has $K = (1 - A_1/A_2)^2$ — derived from momentum balance.

### 5.4 External Boundary Layers

When flow passes over a flat plate, a **boundary layer** grows from the leading edge. Inside it, the velocity transitions from zero at the wall (no-slip) to the free-stream $U_\infty$.

**Laminar boundary layer** (Blasius solution):

$$
\delta(x) \approx \frac{5.0\,x}{\sqrt{Re_x}}, \qquad C_f = \frac{0.664}{\sqrt{Re_x}}
$$

where $\delta$ is the boundary-layer thickness (where $u = 0.99\, U_\infty$), $Re_x = U_\infty x/\nu$, and $C_f = \tau_w/(\tfrac{1}{2}\rho U_\infty^2)$ is the local skin-friction coefficient.

**Turbulent boundary layer** ($Re_x > \sim 5\times10^5$):

$$
\delta(x) \approx \frac{0.38\,x}{Re_x^{1/5}}, \qquad C_f \approx \frac{0.059}{Re_x^{1/5}}
$$

Turbulent boundary layers are **thicker** (more mixing spreads momentum further from the wall) but have **higher wall shear** (steeper velocity gradient at the wall due to turbulent eddies). This means turbulent flow has higher friction drag but is also more resistant to **separation** — an important trade-off in airfoil design.

### 5.5 Boundary Layer Separation and Its Consequences

A boundary layer separates when fluid near the wall, decelerating against an **adverse pressure gradient** ($dp/dx > 0$, i.e., pressure increasing downstream), runs out of kinetic energy and reverses direction. Beyond the **separation point**, the flow detaches, forming a recirculation zone and a broad wake.

Separation is devastating for:

- **Airfoils**: causes **stall** — dramatic loss of lift and increase of drag.
- **Diffusers**: limits the maximum expansion angle to ~7° for attached flow.
- **Bluff bodies**: creates the large wake responsible for ~90% of drag on cars, buildings, and cylinders.

This is why **streamlining** works — by shaping bodies to avoid adverse pressure gradients, we keep the boundary layer attached and minimise wake width and drag.

---

## 6. Airfoil Theory and Finite Wings

### 6.1 Airfoil Geometry

An airfoil's shape is defined by:

- **Chord** $c$: straight line from leading edge to trailing edge.
- **Camber line**: the midline between upper and lower surfaces; its maximum deviation from the chord is the **maximum camber**.
- **Thickness distribution**: the distance between upper and lower surfaces, perpendicular to the camber line; described as a fraction of chord (e.g., NACA 0012 has 12% max thickness).
- **Angle of attack** $\alpha$: the angle between the chord line and the oncoming freestream.

**NACA naming convention (4-digit):** NACA $MPXX$

- $M$: maximum camber as % of chord,
- $P$: location of max camber in tenths of chord,
- $XX$: max thickness as % of chord.

Example: **NACA 2412** has 2% camber at 40% chord, 12% thickness. **NACA 0012** is symmetric (zero camber), 12% thick.

### 6.2 How Lift Is Generated

Lift arises because the flow around an airfoil produces **lower pressure on the upper surface** and **higher pressure on the lower surface**. The net pressure difference, integrated over the surface, gives the lift force.

But *why* is the pressure lower on top? It is **not** because the air travels a longer path over the top (the "equal transit time" explanation is a myth — parcels separating at the leading edge do *not* reunite at the trailing edge). The correct explanation involves **circulation**:

The sharp trailing edge imposes the **Kutta condition**: the flow must leave the trailing edge smoothly (finite velocity). For this to happen, a **circulation** $\Gamma$ is established around the airfoil, which accelerates the upper-surface flow and decelerates the lower-surface flow. By Bernoulli, faster flow → lower pressure → lift.

### 6.3 Kutta–Joukowski Theorem

For a 2D airfoil in incompressible, inviscid flow:

$$
\boxed{L' = \rho_\infty V_\infty \Gamma}
$$

where $L'$ is lift per unit span and $\Gamma = \oint \mathbf{u}\cdot d\mathbf{l}$ is the circulation around the airfoil. This elegant result connects a purely kinematic quantity (circulation) to the aerodynamic force.

The lift coefficient per unit span:

$$
c_l = \frac{L'}{\tfrac{1}{2}\rho V^2 c}
$$

### 6.4 Thin Airfoil Theory

For a thin airfoil at small $\alpha$ in inviscid, incompressible flow, we model the airfoil as a distribution of **vortices** along the camber line. The strength of this vortex sheet $\gamma(x)$ is chosen to satisfy:

1. **Flow tangency** on the camber line (no flow through the surface).
2. **Kutta condition** at the trailing edge ($\gamma(c) = 0$).

**Key results for a symmetric airfoil (zero camber):**

$$
c_l = 2\pi\alpha
$$

This is the **lift-curve slope**: $dc_l/d\alpha = 2\pi \approx 6.28\text{ rad}^{-1} \approx 0.110\text{ deg}^{-1}$. A 1° increase in angle of attack gives $\Delta c_l \approx 0.11$ — a universal result for thin airfoils.

**For a cambered airfoil:**

$$
c_l = 2\pi(\alpha - \alpha_{L=0})
$$

where $\alpha_{L=0}$ is the **zero-lift angle of attack** (negative for positive camber — a cambered airfoil produces lift even at $\alpha = 0$). The lift-curve slope is still $2\pi$; camber shifts the curve left.

**Moment coefficient about the quarter-chord ($c/4$) point:**

$$
c_{m,c/4} = \frac{\pi}{4}(A_2 - A_1)
$$

where $A_1, A_2$ are Fourier coefficients of the camber-line shape. For a **symmetric** airfoil, $c_{m,c/4} = 0$ — the quarter-chord is the **aerodynamic centre** (moment independent of $\alpha$). This is why aircraft designers place the wing's structural spar at $c/4$.

### 6.5 Drag on Airfoils

In 2D inviscid theory, there is **zero drag** on an airfoil (d'Alembert's paradox). Real airfoils have:

- **Friction drag**: from skin friction in the boundary layer (dominant at low $\alpha$).
- **Pressure (form) drag**: from boundary-layer thickening and separation (increases as $\alpha$ increases toward stall).
- **Wave drag**: from shock waves in transonic/supersonic flow.

The drag coefficient:

$$
c_d = \frac{D'}{\tfrac{1}{2}\rho V^2 c}
$$

A well-designed subsonic airfoil has $c_d \sim 0.005$–$0.01$, giving lift-to-drag ratios $c_l/c_d \sim 50$–$100$ — an efficient wing converts most aerodynamic force into lift.

### 6.6 Stall

As angle of attack increases, at some $\alpha_{\text{stall}}$ (typically 12°–18°), the adverse pressure gradient on the upper surface becomes too strong, the boundary layer separates over the entire upper surface, and lift drops abruptly while drag surges. This is **stall**.

- **Thin airfoils** stall from the leading edge (abrupt separation of a laminar bubble).
- **Thick airfoils** stall from the trailing edge (gradual forward creep of the separation point).
- **Turbulent boundary layers** resist separation better than laminar → turbulators, vortex generators, and surface roughness can delay stall.

### 6.7 Finite Wings: Induced Drag

A real wing has finite span $b$. At the wingtips, high-pressure air flows around to the low-pressure side, creating **wingtip vortices**. These vortices induce a **downwash** $w$ over the entire wing, which tilts the local effective velocity downward by the **induced angle of attack**:

$$
\alpha_i \approx \frac{C_L}{\pi e AR}
$$

where $AR = b^2/S$ is the **aspect ratio** ($S$ = wing area) and $e$ is the **Oswald efficiency factor** ($e = 1$ for elliptic loading, $e \approx 0.8$–$0.95$ for typical wings).

This tilt rotates the lift vector backward, creating a drag component — the **induced drag**:

$$
\boxed{C_{D,i} = \frac{C_L^2}{\pi e\, AR}}
$$

This result is profound:

- Induced drag increases with $C_L^2$ — high-lift conditions (takeoff, landing, tight turns) have the most induced drag.
- Induced drag decreases with aspect ratio — this is why gliders and albatrosses have long, narrow wings ($AR \sim 20$–$40$).
- At cruise, induced drag roughly equals parasitic drag — the minimum total drag condition defines the best cruise speed.

### 6.8 Prandtl's Lifting-Line Theory

Prandtl modelled the finite wing as a single **bound vortex** along the span plus a sheet of **trailing vortices** shed from the trailing edge. The circulation $\Gamma(y)$ varies along the span, and each differential trailing vortex contributes to the downwash at every spanwise location.

**Elliptic loading** ($\Gamma(y) = \Gamma_0\sqrt{1-(2y/b)^2}$) gives uniform downwash and **minimum induced drag** for a given total lift. This is why the Spitfire's elliptical wing planform was aerodynamically efficient (though harder to manufacture than a tapered wing, which gives $e \approx 0.95$ and is nearly as good).

The **wing lift-curve slope** for a finite wing:

$$
a = \frac{a_0}{1 + a_0/(\pi\, e\, AR)}
$$

where $a_0 = 2\pi$ is the 2D slope. For $AR = 8$ and $e = 1$: $a \approx 4.9$ rad$^{-1}$ (vs. $2\pi \approx 6.28$ in 2D). A finite wing produces less lift per degree because downwash reduces the effective angle of attack.

---

## 7. Compressible Flow Fundamentals

When flow speeds approach or exceed the speed of sound, density changes become significant and the governing equations fundamentally change character. The speed of sound in an ideal gas:

$$
a = \sqrt{\gamma R T}
$$

where $\gamma = c_p/c_v$ (1.4 for air) and $R$ is the specific gas constant (287 J/kg·K for air). At sea level ($T = 288$ K), $a \approx 340$ m/s.

### 7.1 Stagnation (Total) Properties

If we imagine bringing a fluid particle to rest **isentropically** (no heat transfer, no friction), it reaches its **stagnation state**. These total properties are conserved along a streamline in isentropic flow:

$$
\frac{T_0}{T}=1+\frac{\gamma-1}{2}Ma^2
$$

$$
\frac{p_0}{p}=\left(1+\frac{\gamma-1}{2}Ma^2\right)^{\frac{\gamma}{\gamma-1}}
$$

$$
\frac{\rho_0}{\rho}=\left(1+\frac{\gamma-1}{2}Ma^2\right)^{\frac{1}{\gamma-1}}
$$

**Physical meaning:** as a gas accelerates (increasing $Ma$), its temperature, pressure, and density all drop — kinetic energy is gained at the expense of internal energy. At $Ma = 1$, the temperature drops to $T^* = T_0 \cdot 2/(\gamma+1) = 0.833\,T_0$ for air.

These relations are the foundation for nozzle design, airspeed measurement (compressible Pitot tube correction), and jet engine analysis.

### 7.2 Mach Waves and the Zone of Action

A point disturbance in supersonic flow creates a conical **Mach cone**. The half-angle $\mu$ of this cone:

$$
\sin\mu = \frac{1}{Ma}
$$

At $Ma = 2$, $\mu = 30°$. The disturbance can only be felt **inside** the Mach cone (the "zone of action"). A supersonic aircraft therefore overtakes its own sound — this is why a sonic boom arrives with no warning.

---

## 8. Shock and Expansion Waves

### 8.1 Normal Shocks

When supersonic flow encounters a sudden obstruction (blunt body, closed end), it cannot adjust gradually — instead, properties change **discontinuously** across a thin shock wave (~few mean free paths thick).

Across a normal shock (perpendicular to flow), conservation of mass, momentum, and energy gives:

**Post-shock Mach number:**

$$
Ma_2^2 = \frac{1 + \frac{\gamma-1}{2}Ma_1^2}{\gamma Ma_1^2 - \frac{\gamma-1}{2}}
$$

**Pressure ratio:**

$$
\frac{p_2}{p_1} = 1 + \frac{2\gamma}{\gamma+1}(Ma_1^2 - 1)
$$

**Temperature ratio:**

$$
\frac{T_2}{T_1} = \frac{p_2}{p_1}\cdot\frac{\rho_1}{\rho_2}
$$

**Key properties of normal shocks:**
- $Ma_1 > 1 \to Ma_2 < 1$ (flow becomes subsonic),
- Static pressure and temperature **increase** (compression),
- Total pressure **decreases** (entropy increase, irreversible),
- Total temperature is **conserved** (adiabatic),
- Stronger shocks ($Ma_1 \gg 1$) waste more total pressure.

**Example:** At $Ma_1 = 2$, air: $p_2/p_1 = 4.5$, $T_2/T_1 = 1.69$, $Ma_2 = 0.577$, and total pressure drops by ~28%. This is why supersonic inlets try to avoid strong normal shocks.

### 8.2 Oblique Shocks

When supersonic flow is turned by a **compression corner** (wedge, ramp), the shock is not perpendicular but inclined at angle $\beta$ to the flow. The deflection angle $\theta$, shock angle $\beta$, and upstream Mach relate through the **$\theta$–$\beta$–$M$ relation**:

$$
\tan\theta = 2\cot\beta\cdot\frac{Ma_1^2\sin^2\beta - 1}{Ma_1^2(\gamma + \cos2\beta) + 2}
$$

For a given $Ma_1$ and $\theta$:

- **Weak shock** (smaller $\beta$): flow remains supersonic downstream — preferred in inlet design.
- **Strong shock** (larger $\beta$): flow becomes subsonic — rarely occurs in external flows.
- If $\theta$ exceeds $\theta_{\max}$ for that $Ma_1$, no attached oblique shock is possible — a **detached (bow) shock** forms ahead of the body.

### 8.3 Prandtl–Meyer Expansion Fans

When supersonic flow turns around an **expansion corner**, it accelerates isentropically through a continuous fan of Mach waves. The flow turns through angle $\theta$ with:

$$
\nu(Ma_2) = \nu(Ma_1) + \theta
$$

where the **Prandtl–Meyer function** is:

$$
\nu(Ma) = \sqrt{\frac{\gamma+1}{\gamma-1}}\arctan\sqrt{\frac{\gamma-1}{\gamma+1}(Ma^2-1)} - \arctan\sqrt{Ma^2-1}
$$

Unlike shocks, expansions are **isentropic** — no total pressure loss. This is why supersonic nozzles and external compression surfaces are designed to use expansion fans rather than shocks wherever possible.

---

## 9. Nozzles, Diffusers, and Wind Tunnels

### 9.1 The Area–Mach Relation

For quasi-one-dimensional, steady, isentropic flow, combining mass, momentum, and energy conservation:

$$
\frac{dA}{A}=(Ma^2-1)\frac{dV}{V}
$$

This single equation reveals the fundamental dichotomy:

| | Subsonic ($Ma < 1$) | Supersonic ($Ma > 1$) |
|---|---|---|
| Converging duct ($dA < 0$) | Accelerates ($dV > 0$) | Decelerates ($dV < 0$) |
| Diverging duct ($dA > 0$) | Decelerates ($dV < 0$) | Accelerates ($dV > 0$) |
| At the throat ($dA = 0$) | Maximum subsonic speed **or** $Ma = 1$ | Must have $Ma = 1$ |

**Consequence:** To accelerate from subsonic to supersonic, you need a **converging-diverging (C-D) nozzle** — the flow accelerates subsonically through the converging section, reaches $Ma = 1$ at the throat, then continues to accelerate supersonically through the diverging section.

### 9.2 Area Ratio

The ratio of local area to throat area $A^*$ (where $Ma = 1$):

$$
\frac{A}{A^*} = \frac{1}{Ma}\left[\frac{2}{\gamma+1}\left(1 + \frac{\gamma-1}{2}Ma^2\right)\right]^{\frac{\gamma+1}{2(\gamma-1)}}
$$

This is a double-valued function: for each $A/A^* > 1$, there are two solutions — one subsonic and one supersonic. The **back pressure** determines which solution is realised.

### 9.3 Converging-Diverging Nozzle Operation

As back pressure $p_b$ is lowered below reservoir pressure $p_0$:

1. **$p_b$ slightly below $p_0$:** entirely subsonic flow, velocity peaks at throat but $Ma < 1$ everywhere.
2. **$p_b$ lowered further:** flow reaches $Ma = 1$ at throat — the nozzle is **choked**. Mass flow rate reaches maximum: $\dot{m}_{\max} = \frac{p_0 A^*}{\sqrt{T_0}}\sqrt{\frac{\gamma}{R}}\left(\frac{2}{\gamma+1}\right)^{(\gamma+1)/[2(\gamma-1)]}$. Further lowering $p_b$ does not increase $\dot{m}$.
3. **$p_b$ lowered more:** supersonic flow develops in diverging section, but a **normal shock** stands somewhere in the diverger, with subsonic flow downstream of the shock. Shock moves downstream as $p_b$ decreases.
4. **Design condition:** shock pushed to the exit plane (or out of the nozzle entirely) — fully supersonic flow throughout the diverger.
5. **Overexpanded:** $p_b$ below design but above a critical value — oblique shocks outside the nozzle adjust exit pressure.
6. **Underexpanded:** $p_b$ below the exit pressure — expansion fans form at the exit.

### 9.4 Supersonic Wind Tunnels

A supersonic wind tunnel uses a C-D nozzle to generate a uniform supersonic test section. The exit Mach number is set by the area ratio $A_{\text{test}}/A^*$. A **second throat** (diffuser) downstream decelerates the flow back to subsonic with a normal shock that should be as weak as possible to minimise power losses.

---

## 10. Airfoil Behaviour in Compressible Flow

### 10.1 Subsonic Compressibility Correction

As $Ma$ increases toward 1 in subsonic flow, compressibility amplifies pressure differences. The **Prandtl–Glauert rule** corrects incompressible pressure coefficients:

$$
C_p = \frac{C_{p,0}}{\sqrt{1 - Ma_\infty^2}}
$$

where $C_{p,0}$ is the incompressible value. Similarly, the lift-curve slope:

$$
a = \frac{a_0}{\sqrt{1-Ma_\infty^2}}
$$

This correction diverges at $Ma = 1$, signalling the breakdown of linear theory near the sonic condition.

### 10.2 Critical Mach Number and Drag Divergence

Even when the freestream is subsonic, the flow accelerates over the airfoil (especially on the upper surface), and locally can reach $Ma = 1$. The freestream Mach number at which the first point on the airfoil reaches $Ma = 1$ is the **critical Mach number** $Ma_{\text{cr}}$.

Beyond $Ma_{\text{cr}}$:

- A supersonic pocket forms on the upper surface.
- A shock wave terminates the supersonic region.
- The shock causes boundary-layer separation → rapid drag increase.

This rapid drag rise is the **drag divergence** phenomenon that limited propeller aircraft speeds in the 1940s. Modern transonic airfoils (supercritical airfoils) use:

- Flattened upper surface to weaken the shock,
- Rear camber to recover lift,
- Resulting in $Ma_{\text{cr}} \approx 0.8$–$0.85$ (vs. $\sim 0.7$ for conventional airfoils).

### 10.3 Supersonic Airfoils

Thin, sharp-edged airfoils perform best at supersonic speeds (blunt leading edges produce strong bow shocks). At supersonic conditions, **wave drag** from oblique shocks becomes the dominant drag source.

For a flat plate at small $\alpha$:

$$
c_l = \frac{4\alpha}{\sqrt{Ma^2 - 1}}, \qquad c_d = \frac{4\alpha^2}{\sqrt{Ma^2 - 1}}
$$

Note that supersonic lift-curve slope **decreases** with Mach (opposite to subsonic behaviour) — high-Mach flight requires larger angles of attack for the same $C_L$.

---

## 11. Thermofluids and Heat Transfer Coupling

### 11.1 Forced Convection

When fluid flows over or through a heated surface, **convection** transfers heat. Newton's law of cooling:

$$
q'' = h(T_s - T_\infty)
$$

where $h$ is the convection heat-transfer coefficient (W/m²·K). The **Nusselt number** is the dimensionless heat-transfer coefficient:

$$
Nu = \frac{hL}{k}
$$

Correlations relate $Nu$ to $Re$ and $Pr$:

- **Flat plate (laminar):** $Nu_x = 0.332\,Re_x^{1/2}\,Pr^{1/3}$
- **Flat plate (turbulent):** $Nu_x = 0.0296\,Re_x^{4/5}\,Pr^{1/3}$
- **Circular pipe (turbulent, Dittus–Boelter):** $Nu_D = 0.023\,Re_D^{0.8}\,Pr^n$ ($n = 0.4$ for heating, $0.3$ for cooling)

The thermal boundary layer thickness relative to the velocity boundary layer depends on $Pr$: for $Pr < 1$ (liquid metals), $\delta_T > \delta$; for $Pr > 1$ (oils), $\delta_T < \delta$; for air ($Pr \approx 0.7$), they are comparable.

### 11.2 Natural Convection

When flow is driven by **buoyancy** (density differences from temperature variation) rather than external pressure or velocity, the relevant parameter is the **Rayleigh number**:

$$
Ra = Gr \cdot Pr = \frac{g\beta(T_s - T_\infty)L^3}{\nu\alpha}
$$

where $\beta$ is the thermal expansion coefficient. For a vertical plate, transition from laminar to turbulent natural convection occurs at $Ra \sim 10^9$.

### 11.3 Heat Exchanger Design

Heat exchangers transfer thermal energy between two fluid streams. The **effectiveness–NTU method** avoids needing outlet temperatures:

$$
\varepsilon = \frac{q}{q_{\max}} = \frac{q}{C_{\min}(T_{h,in} - T_{c,in})}
$$

where $NTU = UA/C_{\min}$. For a counterflow exchanger:

$$
\varepsilon = \frac{1 - \exp[-NTU(1-C_r)]}{1 - C_r\exp[-NTU(1-C_r)]}
$$

with $C_r = C_{\min}/C_{\max}$. Counterflow exchangers are more efficient than parallel flow because they maintain a more uniform temperature difference along the length.

---

## 12. Combustion Engines and Propulsion

### 12.1 Thermodynamic Cycles

All heat engines convert thermal energy to work. Their efficiency is bounded by the **Carnot limit**:

$$
\eta_{\text{Carnot}} = 1 - \frac{T_L}{T_H}
$$

Real engine cycles deviate from Carnot but follow characteristic idealised cycles:

#### Otto Cycle (Spark-Ignition / Petrol Engines)

Process: isentropic compression → constant-volume heat addition (combustion) → isentropic expansion → constant-volume heat rejection (exhaust).

**Thermal efficiency:**

$$
\boxed{\eta_{\text{Otto}} = 1 - \frac{1}{r^{\gamma-1}}}
$$

where $r = V_1/V_2$ is the **compression ratio**. For $r = 10$ and $\gamma = 1.4$: $\eta_{\text{Otto}} = 1 - 10^{-0.4} = 1 - 0.398 = 0.602$ (60.2%). Real SI engines achieve 25–35% due to heat losses, friction, incomplete combustion, and timing constraints.

**Key insight:** efficiency increases monotonically with $r$, but increasing $r$ raises peak temperature and pressure, eventually causing **knock** (pre-ignition/detonation) in petrol engines. This is why compression ratios are limited to ~10–14 in practice.

#### Diesel Cycle (Compression-Ignition Engines)

Process: isentropic compression → constant-pressure heat addition → isentropic expansion → constant-volume heat rejection.

**Thermal efficiency:**

$$
\eta_{\text{Diesel}} = 1 - \frac{1}{r^{\gamma-1}}\cdot\frac{r_c^{\gamma}-1}{\gamma(r_c-1)}
$$

where $r_c = V_3/V_2$ is the **cutoff ratio** (ratio of volumes at end and start of combustion). For the same compression ratio, the Diesel cycle is slightly less efficient than Otto (the factor involving $r_c$ is always > 1). But Diesel engines can use **much higher compression ratios** ($r \sim 15$–$22$, because they compress air only — no knock risk). The higher $r$ more than compensates, giving Diesel engines **higher actual efficiency** (35–45%).

#### Brayton Cycle (Gas Turbines / Jet Engines)

Process: isentropic compression (compressor) → constant-pressure heat addition (combustor) → isentropic expansion (turbine) → constant-pressure heat rejection (exhaust).

**Thermal efficiency:**

$$
\boxed{\eta_{\text{Brayton}} = 1 - \frac{1}{r_p^{(\gamma-1)/\gamma}}}
$$

where $r_p = p_2/p_1$ is the **pressure ratio** of the compressor. For $r_p = 20$: $\eta_{\text{Brayton}} = 1 - 20^{-2/7} = 0.575$ (57.5%). Real gas turbines achieve ~35–45% (simple cycle) or 55–62% in combined cycle (exhaust heat drives a steam turbine).

### 12.2 Jet Propulsion

A jet engine produces thrust by accelerating a working fluid rearward. By Newton's third law:

$$
\boxed{F = \dot{m}(V_e - V_\infty) + (p_e - p_\infty)A_e}
$$

where $V_e$ is the exhaust velocity, $V_\infty$ is the flight speed, and the pressure term is nonzero only if the nozzle is not perfectly expanded.

**Propulsive efficiency** captures how much of the kinetic energy produced is useful for propelling the aircraft:

$$
\eta_p = \frac{2}{1 + V_e/V_\infty}
$$

Maximum propulsive efficiency occurs when $V_e = V_\infty$ (but then thrust is zero!). In practice, a moderate velocity ratio is used. High-bypass turbofans ($V_e/V_\infty$ close to 1) have $\eta_p \approx 0.7$–$0.85$; turbojets ($V_e \gg V_\infty$) have $\eta_p \approx 0.3$–$0.5$ but produce more thrust per unit frontal area.

**Specific impulse** (fuel efficiency of a propulsion system):

$$
I_{sp} = \frac{F}{\dot{m}_f\, g_0}
$$

Units: seconds. Higher $I_{sp}$ = more thrust per unit fuel consumed per second. Turbofans: $I_{sp} \sim 3000$–$6000$ s; solid rockets: $\sim 250$ s; ion thrusters: $\sim 3000$–$10000$ s (but very low thrust).

### 12.3 Rocket Propulsion

A rocket carries both fuel and oxidiser, so it works in vacuum. The **Tsiolkovsky rocket equation** gives the velocity change from burning fuel:

$$
\Delta V = V_e \ln\frac{m_0}{m_f} = I_{sp}\,g_0\,\ln\frac{m_0}{m_f}
$$

where $m_0$ is initial mass (with fuel) and $m_f$ is final mass (fuel exhausted). The logarithmic dependence means orbital velocity ($\sim 7.8$ km/s) requires mass ratios $m_0/m_f \sim 4$–$10$ — most of a rocket's launch mass is propellant.

**Rocket nozzle design** uses the C-D nozzle theory from Section 9: the throat area sets the mass flow rate, and the exit area ratio determines the exit Mach number and expansion. Optimum performance occurs when the exhaust is **perfectly expanded** ($p_e = p_\infty$).

### 12.4 Combustion Fundamentals

Combustion is a rapid exothermic chemical reaction between fuel and oxidiser. For a generic hydrocarbon $C_xH_y$:

$$
C_xH_y + \left(x + \frac{y}{4}\right)(O_2 + 3.76\,N_2) \to x\,CO_2 + \frac{y}{2}\,H_2O + 3.76\left(x+\frac{y}{4}\right)N_2
$$

The **stoichiometric air-fuel ratio** (mass basis) for octane ($C_8H_{18}$):

$$
AF_{\text{stoich}} = \frac{(8 + 18/4)(32 + 3.76\times28)}{114} \approx 15.1
$$

This means 15.1 kg of air per kg of fuel for complete combustion. Real engines operate:

- **Rich** ($AF < 15.1$): excess fuel, maximum power, higher emissions (CO, UHC).
- **Lean** ($AF > 15.1$): excess air, higher efficiency, lower emissions, but risk of misfire and high $NO_x$ at peak temperatures.

The **equivalence ratio** $\phi = AF_{\text{stoich}}/AF_{\text{actual}}$: $\phi = 1$ stoichiometric, $\phi > 1$ rich, $\phi < 1$ lean.

**Adiabatic flame temperature** — the temperature reached if all combustion heat raises the product temperature (no losses):

$$
\sum_{\text{reactants}} n_i h_i(T_{\text{in}}) = \sum_{\text{products}} n_j h_j(T_{\text{ad}})
$$

For octane–air at stoichiometric and $T_{\text{in}} = 298$ K: $T_{\text{ad}} \approx 2270$ K. This sets the upper limit for turbine inlet temperature and drives $NO_x$ formation kinetics.

---

## 13. Two-Phase Flow and Cavitation

### 13.1 Cavitation

When local pressure drops below the **vapour pressure** $p_v$, liquid boils locally — this is **cavitation**. Vapour bubbles form in low-pressure regions and collapse violently when they reach higher-pressure zones, producing:

- Noise (characteristic crackling),
- Erosion of surfaces (material removal from repeated micro-jet impacts),
- Performance degradation (loss of lift on hydrofoils, drop in pump head).

The **cavitation number**:

$$
\sigma = \frac{p_\infty - p_v}{\tfrac{1}{2}\rho V^2}
$$

Cavitation inception occurs when $\sigma$ drops below a critical value (geometry-dependent, typically $\sigma_i \sim 0.5$–$3$).

**Prevention:** increase system pressure (pressurised tanks), reduce flow velocity, ensure pump NPSH (Net Positive Suction Head) exceeds the required NPSH.

### 13.2 Boiling and Two-Phase Pressure Drop

In heat exchangers and nuclear reactors, liquid-vapour mixtures flow together. The **vapour quality** $x = \dot{m}_{\text{vapour}}/\dot{m}_{\text{total}}$ determines flow pattern (bubbly, slug, annular, mist). Two-phase pressure drop is significantly higher than single-phase due to acceleration (density change), friction (interface effects), and gravity (void fraction).

The **critical heat flux (CHF)** is the maximum heat flux before the surface dries out — beyond CHF, temperature spikes catastrophically (film boiling). CHF is a hard safety limit in nuclear and process engineering.

---

## 14. Practical Analysis Workflow

1. **Identify regime** — compute $Re$, $Ma$, $Pr$, check phase, classify geometry.
2. **Select governing simplification** — inviscid/viscous, incompressible/compressible, steady/unsteady, 1D/2D/3D.
3. **Apply conservation equations** — continuity + momentum + energy, with appropriate boundary conditions.
4. **Use validated correlations** for closure — friction factors, Nusselt numbers, shock tables, nozzle curves.
5. **Check consistency** — do solutions satisfy limiting cases? Do units match? Is entropy non-decreasing?

**Common sanity checks:**

- Does back-of-envelope Bernoulli give the right order of magnitude?
- Does the Reynolds number justify your laminar/turbulent assumption?
- Is total pressure conserved where you assumed isentropic flow?
- Does mass flow rate balance across all branches?

---

## 15. Modeling Hierarchy (Advanced Note)

For advanced fluid/aerodynamics studies, use this compact hierarchy:

| Level | Model | When to use | Cost |
|-------|-------|-------------|------|
| 1 | **Algebraic** (Bernoulli, isentropic, 1-D) | Preliminary design, sanity checks | Pencil & paper |
| 2 | **Integral methods** (momentum integral, lifting line) | Boundary layers, finite wings | Spreadsheet |
| 3 | **Panel methods** (potential flow + BL coupling) | Subsonic airfoil/wing design | Minutes on laptop |
| 4 | **Euler CFD** (inviscid, compressible) | Supersonic external flow | Hours on workstation |
| 5 | **RANS CFD** (Reynolds-averaged N-S) | Turbulent, separated, internal flows | Hours–days |
| 6 | **LES / DNS** | Detailed turbulence physics | Days–weeks on HPC |

**Key principle:** always start at the lowest-cost level that captures the dominant physics. Use higher-fidelity models to validate and refine — never jump to DNS when Bernoulli can answer the question.

### Trust chain for CFD

1. **Verification:** are the equations solved correctly? (mesh convergence, manufactured solutions)
2. **Validation:** do the solved equations represent reality? (comparison to experimental data)
3. **Uncertainty quantification:** how sensitive are results to inputs, turbulence model, mesh?
