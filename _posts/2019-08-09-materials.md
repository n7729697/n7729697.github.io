---
title: Materials Engineering Notes — Structure, Properties
tags: [materials science, crystal structure, FCC, BCC, HCP, doping, semiconductors, phase diagrams, fracture, corrosion, composites, biomaterials]
style: fill
color: light
description: A course-level treatment of materials science and engineering — from atomic bonding and crystal lattices (FCC, BCC, HCP) through defects, doping, phase transformations, deformation, fracture, and real-world material systems.
---

## 1. Why Materials Science Exists

Every engineering system is ultimately limited by its materials. An aircraft cannot fly faster than its turbine blade material can withstand. A battery cannot store more energy than its electrode chemistry allows. A bridge cannot span further than its steel can bear.

Materials science is the discipline that connects **structure** (how atoms are arranged) to **properties** (what the material does) through **processing** (how it was made). The central dogma is:

$$\text{Processing} \longrightarrow \text{Structure} \longrightarrow \text{Properties} \longrightarrow \text{Performance}$$

Change any link and the chain changes. The same steel composition, quenched vs. slowly cooled, can be brittle martensite or ductile pearlite. The same polymer, injection-molded fast vs. slow, can be amorphous (transparent) or semicrystalline (opaque). Understanding *why* requires going all the way down to atoms.

---

## 2. Atomic Bonding: The Foundation of Everything

All material properties originate from how atoms bond to each other. There are four primary bonding types, and most real materials involve mixtures.

### 2.1 Metallic Bonding
Metal atoms release their valence electrons into a shared "electron gas" (also called an **electron sea**). The positive ion cores sit in this sea. This gives metals their signature properties:
- **Electrical/thermal conductivity:** The free electrons carry charge and heat easily.
- **Ductility:** When you shear a metal, the ion cores slide past each other but the electron gas instantly re-adjusts — the bond doesn't break, it just reshuffles. This is why metals bend instead of shattering.
- **Metallic lustre:** Free electrons absorb incoming photons and re-emit them — that's the "shine."

### 2.2 Ionic Bonding
One atom donates electrons to another (e.g., Na gives an electron to Cl). The resulting positive and negative ions attract electrostatically. Ionic crystals (NaCl, MgO, Al₂O₃) are:
- **Hard and brittle:** Displacing one row of ions by half a lattice spacing puts positive ions next to positive ions — electrostatic repulsion causes the crystal to cleave. This is why salt crystals shatter instead of bending.
- **Electrically insulating** (at room temperature): No free electrons. But at high temperature, ions become mobile and ionic conductivity appears (the basis of solid oxide fuel cells).

### 2.3 Covalent Bonding
Atoms share electron pairs in directional bonds (e.g., diamond, SiC, Si, GaAs). Properties depend on the network:
- **Diamond:** Each carbon bonds covalently to 4 neighbors in a 3D network → hardest known material, wide bandgap insulator.
- **Silicon:** Same structure but weaker bonds → semiconductor with a bandgap of 1.1 eV, the foundation of electronics.
- **Graphite:** Carbon bonds covalently in 2D sheets (graphene layers) held together by weak van der Waals forces → sheets slide easily (lubricant), conducts in-plane (delocalized π-electrons), insulates out-of-plane.

### 2.4 Secondary Bonding (Van der Waals, Hydrogen Bonds)
Weak electrostatic dipole-dipole interactions. Individually weak (~0.01–0.1 eV vs. ~1–5 eV for primary bonds), but in polymers with millions of segments, they collectively determine $T_g$ (glass transition), solubility, and crystallinity. Hydrogen bonds in water (0.2 eV) explain why ice has a lower density than liquid water and why biological proteins fold.

---

## 3. Crystal Structure: FCC, BCC, HCP in Detail

Most metals are crystalline — their atoms pack into a regular, repeating 3D lattice. The lattice type has profound effects on mechanical behavior, and understanding *why* requires counting atoms and planes.

### 3.1 Face-Centered Cubic (FCC)

**Structure:** Atoms at all 8 corners of a cube, plus one atom in the center of each of the 6 faces.
- **Atoms per unit cell:** Each corner atom is shared among 8 cubes ($8 \times \frac{1}{8} = 1$), each face atom is shared between 2 cubes ($6 \times \frac{1}{2} = 3$). Total: **4** atoms per unit cell.
- **Atomic Packing Factor (APF):** 0.74 — the densest possible packing of equal spheres (same as HCP). The stacking sequence is ABCABC... (three distinct layers before the pattern repeats).
- **Coordination Number:** 12 (each atom touches 12 neighbors).

**Why FCC metals are ductile:** FCC has **12 independent slip systems** — {111} planes (4 unique planes) × ⟨110⟩ directions (3 per plane). A slip system is a combination of a close-packed plane (where atoms are most densely packed and shear resistance is lowest) and a close-packed direction (shortest distance between atoms, so the smallest displacement to move from one equilibrium position to the next). With 12 systems available, there is almost always a favorably oriented slip system for any applied stress direction. Dislocations can glide easily, and the crystal deforms plastically — it *bends* before it *breaks*.

**Examples:** Aluminum (Al), Copper (Cu), Nickel (Ni), Gold (Au), Silver (Ag), Austenitic Stainless Steel (γ-Fe), Lead (Pb).

### 3.2 Body-Centered Cubic (BCC)

**Structure:** Atoms at all 8 corners, plus one atom at the center of the cube.
- **Atoms per unit cell:** $8 \times \frac{1}{8} + 1 = $ **2** atoms.
- **APF:** 0.68 — less densely packed than FCC.
- **Coordination Number:** 8.

**Why BCC metals are strong but less ductile:** BCC does not have a true close-packed plane. The densest planes are {110}, and slip can also occur on {112} and {123}, but these are not as smooth or as close-packed as FCC's {111}. More importantly, BCC metals exhibit a **Ductile-to-Brittle Transition Temperature (DBTT)**. Below the DBTT, the critical resolved shear stress for dislocation motion rises sharply (the Peierls-Nabarro stress is high for BCC screw dislocations), and fracture switches from ductile (shear) to brittle (cleavage along {100}). This is why carbon steel is ductile at room temperature but can shatter like glass in an Arctic winter — the Titanic's hull steel fractured in the cold North Atlantic partly because it was a BCC alloy operating below its DBTT.

**Examples:** Iron (α-Fe, ferrite), Tungsten (W), Chromium (Cr), Molybdenum (Mo), Vanadium (V), β-Titanium.

### 3.3 Hexagonal Close-Packed (HCP)

**Structure:** Hexagonal base with atoms at corners and center of both top and bottom hexagons, plus 3 atoms in the interior mid-plane (in the "B" layer valleys).
- **Atoms per unit cell:** **6** (or equivalently 2 per primitive cell).
- **APF:** 0.74 — same as FCC (both are close-packed).
- **Coordination Number:** 12.

**Why HCP metals are tricky:** HCP has only **3 independent slip systems** on the basal plane {0001}. The Von Mises criterion requires 5 independent slip systems for arbitrary plastic deformation of a polycrystal. HCP metals don't meet this criterion easily, so they are less ductile than FCC. Additional slip can occur on prismatic {10$\bar{1}$0} and pyramidal {10$\bar{1}$1} planes, but these require higher stress to activate. This is why magnesium (HCP) is hard to form at room temperature but becomes formable at ~200°C (thermal energy activates non-basal slip). It's also why titanium (HCP α-phase) is strong but has limited cold workability.

**The c/a ratio matters:** Ideal close-packing gives $c/a = 1.633$. If $c/a$ is close to ideal (Mg: 1.624), basal slip dominates. If $c/a$ is significantly different (Ti: 1.587, Zr: 1.593), prismatic slip becomes competitive, and the material is more workable.

**Examples:** Titanium (α-Ti), Magnesium (Mg), Zinc (Zn), Cobalt (α-Co), Zirconium (Zr), Beryllium (Be).

### 3.4 Other Structures at a Glance
- **Diamond Cubic (DC):** FCC lattice with an extra atom at each tetrahedral site. Very open (APF = 0.34). Silicon, Germanium, Diamond.
- **NaCl Structure:** Two interpenetrating FCC lattices (one Na⁺, one Cl⁻). Many ceramics (MgO, TiN, FeO).
- **Fluorite (CaF₂):** FCC cations with anions filling *all* tetrahedral sites. Important for nuclear fuel (UO₂) and solid oxide electrolytes (YSZ).
- **Amorphous:** No long-range order. Glasses, metallic glasses, many polymers below $T_g$.

---

## 4. Crystal Defects: Why Real Materials Aren't Perfect

A perfect crystal would be useless for engineering. All interesting properties — plastic deformation, diffusion, electrical conduction in semiconductors, precipitation hardening — arise from **defects**.

### 4.1 Point Defects (0D)
- **Vacancy:** A missing atom. Concentration follows a Boltzmann distribution: $n_v = N \exp(-Q_v / k_B T)$. At 1000°C in copper, roughly 1 in 10,000 sites is vacant.
- **Interstitial:** An atom squeezed into a space between lattice sites. Small atoms (C, N, H) dissolve interstitially in metals — this is how carbon strengthens iron.
- **Substitutional impurity:** A foreign atom replacing a host atom (e.g., Cr in Fe for stainless steel, Zn in Cu for brass).

**Why vacancies matter:** Diffusion in metals occurs primarily by the **vacancy mechanism** — an atom jumps into a neighboring vacancy. No vacancies, no diffusion, no heat treatment, no sintering, no creep. The activation energy $Q$ for diffusion is the energy to form a vacancy plus the energy to jump into it.

### 4.2 Line Defects (1D) — Dislocations
Dislocations are lines of atomic misfit that allow crystals to deform at stresses far below the theoretical shear strength ($\tau_{theoretical} \approx G/30$, but real metals yield at $G/10,000$).

- **Edge dislocation:** An extra half-plane of atoms jammed into the lattice. Under shear, the dislocation glides — atoms rearrange one row at a time, like moving a heavy rug by pushing a ripple across it instead of dragging the whole thing.
- **Screw dislocation:** The lattice is sheared parallel to the dislocation line, creating a helical ramp (like a spiral parking garage).
- **Burgers vector ($\vec{b}$):** Defines the direction and magnitude of the lattice distortion. For FCC, $\vec{b} = \frac{a}{2}\langle110\rangle$ — the shortest repeat distance on the close-packed plane.

**Strengthening = Making Dislocations Harder to Move.** Every strengthening mechanism works by putting obstacles in the path of dislocations:
- **Grain boundaries** (Hall-Petch): Dislocation pile-ups at boundaries create back-stress.
- **Solute atoms:** Strain fields from size-misfit atoms pin dislocations (solid solution strengthening).
- **Precipitates:** Hard particles that dislocations must either cut through (shearable) or bow around (Orowan mechanism).
- **Other dislocations:** Dislocation forests create junctions that impede further glide (work hardening).

### 4.3 Planar Defects (2D)
- **Grain boundaries:** Where two crystals of different orientation meet. High-angle boundaries are strong barriers to dislocation motion (Hall-Petch: $\sigma_y = \sigma_0 + k d^{-1/2}$, where $d$ is grain size). Smaller grains → more boundaries → stronger material.
- **Stacking faults:** Errors in the ABCABC stacking sequence of FCC. Low stacking-fault energy (SFE) metals (austenitic stainless steel, brass) have wide partial dislocation separation, making cross-slip difficult → more work hardening, more uniform deformation, better formability.
- **Twin boundaries:** Mirror-image lattice reflections. Annealing twins are common in FCC metals; deformation twins occur in HCP metals and BCC at high strain rates.

---

## 5. Semiconductors, Band Theory, and Doping

### 5.1 Band Theory Crash Course
When atoms come together in a solid, their discrete energy levels broaden into **bands** (due to overlapping wave functions). The key concept:
- **Valence Band:** Highest energy band that is normally full of electrons.
- **Conduction Band:** The next band up, normally empty.
- **Bandgap ($E_g$):** The forbidden energy range between them.

If $E_g = 0$: **Metal.** Electrons easily move → high conductivity.
If $E_g \approx 0.1$–$3$ eV: **Semiconductor.** Thermal energy or doping can promote electrons across → tunable conductivity.
If $E_g > 3$ eV: **Insulator.** Essentially no conduction at room temperature.

Conductivity is:
$$\sigma = nq\mu_e + pq\mu_h$$
where $n$ and $p$ are electron and hole concentrations, $q$ is charge, and $\mu$ is mobility (how fast carriers move per unit electric field).

### 5.2 Intrinsic Semiconductors
Pure silicon at 0 K is an insulator — every electron is locked in a covalent bond. At room temperature, thermal energy ($k_BT \approx 0.026$ eV) is enough to occasionally break a bond, creating a free electron in the conduction band and a **hole** (empty bond) in the valence band. The intrinsic carrier concentration in silicon at 300 K is about $n_i \approx 1.5 \times 10^{10}$ cm⁻³ — sounds like a lot, but silicon has $5 \times 10^{22}$ atoms/cm³, so only 1 in every $3 \times 10^{12}$ atoms contributes a carrier. This is why intrinsic Si is a poor conductor.

### 5.3 Doping: Engineering Conductivity

Doping is the deliberate introduction of impurity atoms to control the carrier concentration. This is *the* enabling concept for all of electronics.

**n-type doping (Donor):** Add a Group V atom (P, As, Sb) to silicon (Group IV). Phosphorus has 5 valence electrons; 4 form covalent bonds with Si, and the 5th is very loosely bound (binding energy ~0.045 eV vs. $k_BT \approx 0.026$ eV at 300K). At room temperature, almost all donor electrons are ionized into the conduction band. Now $n \gg n_i$, and conductivity increases by orders of magnitude. Typical doping levels: $10^{15}$–$10^{20}$ cm⁻³, so we are adding as little as 1 impurity atom per 10 million silicon atoms — and it completely transforms the material.

**p-type doping (Acceptor):** Add a Group III atom (B, Al, Ga). Boron has only 3 valence electrons — it creates a hole (missing electron) that behaves as a positive charge carrier. Now $p \gg n_i$.

**The p-n junction:** When p-type and n-type regions meet, electrons diffuse from n to p and holes from p to n, creating a **depletion zone** with no free carriers — just fixed ion charges that create a built-in electric field. This field is a one-way valve for current: the diode. Forward bias shrinks the depletion zone (current flows); reverse bias widens it (current blocked). MOSFETs, solar cells, LEDs, and laser diodes are all variations on this theme.

### 5.4 Carrier Mobility and Scattering
Mobility $\mu$ determines how fast carriers move. It is limited by scattering:
- **Lattice scattering (phonons):** At high $T$, thermal vibrations scatter carriers. $\mu \propto T^{-3/2}$.
- **Impurity scattering:** Ionized dopant atoms deflect carriers. $\mu \propto T^{3/2}/N_I$ (worse at high doping, better at high $T$).
- **At room temperature,** phonon scattering dominates in lightly-doped Si. At cryogenic temps, impurity scattering dominates.

GaAs has higher electron mobility than Si (~8500 vs. ~1400 cm²/V·s) because of its band structure (lower effective mass) — this is why high-frequency RF electronics use GaAs or InP rather than Si.

---

## 6. Mechanical Behavior: From Elastic to Plastic to Fracture

### 6.1 Elasticity
Below the yield point, deformation is reversible. Stress and strain are related by Hooke's Law:
$$\sigma = E \varepsilon$$
Young's modulus $E$ is essentially the **stiffness of the interatomic bond**. It is nearly impossible to change $E$ by alloying — adding 5% Cr to steel barely moves $E$. If you need higher stiffness, you need a different material family (ceramics) or a different geometry (increase moment of inertia $I$). Poisson's ratio $\nu$ ($\approx 0.3$ for most metals) describes the lateral contraction under axial load.

### 6.2 Plasticity and Yielding
Above the yield stress $\sigma_y$, dislocations move and deformation becomes permanent. Yield is not a material constant — it depends on:
- **Strain rate:** At higher strain rates, dislocations have less time to find easy paths → higher apparent yield strength (important for crash scenarios).
- **Temperature:** Higher $T$ lowers the Peierls barrier, making dislocation glide easier → lower $\sigma_y$. This is why hot forging requires less force.
- **Grain size:** Hall-Petch relation: $\sigma_y = \sigma_0 + k d^{-1/2}$.
- **Prior history:** Work hardening (cold rolling, drawing) increases dislocation density, which increases $\sigma_y$ but decreases ductility.

### 6.3 Strengthening Mechanisms in Detail
1. **Grain refinement (Hall-Petch):** Smaller grains → more grain boundary area → more dislocation pile-ups → higher back-stress on the source → higher macroscopic yield stress. Practical range: ~100 µm (cast) down to ~10 µm (forged/rolled) or even ~100 nm (severe plastic deformation). Below ~10 nm, the Hall-Petch slope inverts (inverse Hall-Petch) — grain boundary sliding dominates.
2. **Solid solution strengthening:** Solute atoms (larger or smaller than the host) create local strain fields that interact with dislocation strain fields. Larger misfit → more strengthening (e.g., Mo in Fe is more effective than Mn in Fe). Interstitial solutes (C, N in Fe) are especially potent because they cause tetragonal distortion.
3. **Precipitation hardening (Age hardening):** The most powerful mechanism in engineering alloys. A supersaturated solid solution is heat-treated to precipitate fine, coherent particles that dislocations must either shear (if small/coherent) or loop around via the Orowan mechanism (if large/incoherent). There is an **optimum aging time** — under-aged (too small/few precipitates) and over-aged (precipitates coarsen and spacing increases) are both weaker than peak-aged. Al 2024-T6 (aircraft skin) and Ni superalloys (turbine blades, γ' precipitates) rely on this.
4. **Work hardening (Strain hardening):** Deformation increases dislocation density ($\rho$). Dislocations interact and tangle (forest hardening): $\sigma \propto \sqrt{\rho}$. This is why a cold-rolled sheet is harder than an annealed one.
5. **Transformation strengthening (TRIP/TWIP):** In TRIP steels, retained austenite transforms to martensite at the crack tip, absorbing energy. In TWIP steels, deformation twins subdivide grains dynamically, creating "virtual" grain refinement.

### 6.4 Fracture Mechanics
All real parts contain flaws (cracks, pores, inclusions). Fracture is not about whether a flaw exists — it's about **whether the flaw can grow**.

- **Griffith energy balance (brittle):** A crack propagates when the elastic strain energy released by extending the crack exceeds the surface energy of the new crack faces: $\sigma_f = \sqrt{\frac{2 E \gamma_s}{\pi a}}$. For glass, this predicts failure well. For metals, plasticity at the crack tip dissipates far more energy than $\gamma_s$, which is why metals are so much tougher.
- **Stress Intensity Factor ($K$):** $K_I = Y \sigma \sqrt{\pi a}$. Fracture occurs when $K_I \geq K_{IC}$ (the material's fracture toughness). For structural Al alloys, $K_{IC} \approx 25$–$40$ MPa$\sqrt{\text{m}}$; for ceramics, $K_{IC} \approx 1$–$5$ MPa$\sqrt{\text{m}}$. This 10× difference is why metals are forgiving and ceramics are not.
- **Fatigue crack growth:** Below $K_{IC}$, cyclic loading can still grow cracks incrementally. **Paris Law:** $da/dN = C (\Delta K)^m$, where $m \approx 2$–$4$ for most metals. Inspection intervals in aircraft are set by back-calculating how many cycles it takes a just-detectable crack to grow to the critical size.

---

## 7. Phase Diagrams and Thermodynamics

### 7.1 Why Phase Diagrams Exist
At any given temperature and composition, a system has a minimum **Gibbs free energy** state:
$$G = H - TS$$
At low $T$, enthalpy $H$ dominates (ordered phases win). At high $T$, entropy $-TS$ dominates (disordered phases win, e.g., liquid). Phase diagrams map which phases are stable as a function of $T$ and composition — they are the "road map" of equilibrium.

### 7.2 The Iron-Carbon Diagram (The Most Important Diagram in Engineering)
This diagram governs the entire steel industry:
- **Austenite (γ-Fe, FCC):** Stable above ~727°C. High carbon solubility (~2.1 wt% max). Ductile, non-magnetic.
- **Ferrite (α-Fe, BCC):** Stable below ~912°C. Very low carbon solubility (~0.02 wt%). Soft, magnetic.
- **Cementite (Fe₃C):** Iron carbide, very hard and brittle.
- **Pearlite:** A lamellar composite of ferrite + cementite that forms on slow cooling through 727°C (the eutectoid temperature). The fine lamellae gave it a pearly appearance under a microscope, hence the name.
- **Martensite:** A supersaturated, body-centered tetragonal (BCT) phase formed by rapid quenching from austenite. Carbon atoms are trapped interstitially (they couldn't diffuse out fast enough), distorting the lattice and creating enormous internal stress → very hard, very brittle.

**Heat treatment logic:**
1. Austenitize (heat into γ region to dissolve carbon).
2. Cool at a controlled rate:
   - Slow cool → pearlite (soft, tough).
   - Fast cool (quench) → martensite (hard, brittle).
   - Temper martensite (reheat to 200–600°C) → precipitate fine Fe₃C, relieve internal stress → hard *and* tough. This is the quench-and-temper process that builds most structural steel.

### 7.3 The Lever Rule
For a two-phase region, the weight fractions of each phase are calculated from:
$$W_\alpha = \frac{C_0 - C_\beta}{C_\alpha - C_\beta}, \quad W_\beta = \frac{C_\alpha - C_0}{C_\alpha - C_\beta}$$
This is simply a mass balance. It tells you, for example, that a steel with 0.4 wt% C at room temperature is ~94% ferrite and ~6% cementite.

### 7.4 Beyond Iron: Other Key Systems
- **Al-Cu:** The first precipitation-hardening system (Wilm's accidental discovery, 1906 → Duralumin). The GP zones, θ'', θ', θ sequence drives aging in 2xxx alloys.
- **Ti-Al:** α (HCP) + β (BCC) two-phase alloys (Ti-6Al-4V). The α/β ratio, controlled by heat treatment, balances strength (α) and ductility (β).
- **Cu-Zn (Brass):** Solid solution up to ~35% Zn (α-brass, excellent cold workability). Beyond ~45% Zn, the β phase appears (harder, used for hot forging).

---

## 8. Kinetics: Diffusion and Phase Transformations

Thermodynamics tells you *where* you want to go (equilibrium). Kinetics tells you *how fast* you get there.

### 8.1 Diffusion
Atoms move through solids via:
- **Vacancy mechanism:** An atom jumps into an adjacent vacant site. Dominant in substitutional alloys (Cu in Al, Cr in Fe).
- **Interstitial mechanism:** Small atoms (C, N, H, O) hop between interstitial sites without needing a vacancy. Much faster — carbon diffuses in iron ~$10^6$× faster than iron self-diffuses, because it doesn't need to wait for vacancies.

**Fick's First Law:** $J = -D \frac{dC}{dx}$ (flux proportional to concentration gradient).
**Fick's Second Law:** $\frac{\partial C}{\partial t} = D \frac{\partial^2 C}{\partial x^2}$ (how concentration evolves over time).

The diffusion coefficient is Arrhenius-activated:
$$D = D_0 \exp\left(-\frac{Q}{RT}\right)$$
This exponential dependence on temperature is why a heat treatment at 900°C takes hours, but the same transformation at 700°C would take months.

### 8.2 Nucleation and Growth
Phase transformations (solidification, precipitation, recrystallization) require:
1. **Nucleation:** Creating a tiny embryo of the new phase. The free energy gain from the volume transformation must overcome the surface energy penalty of creating the interface. Heterogeneous nucleation (on grain boundaries, inclusions, mold walls) is always easier because the surface energy cost is reduced by using an existing interface.
2. **Growth:** The new phase interface advances by diffusion. Fast diffusion → fast growth.

The interplay of nucleation and growth rates produces the classic **C-curve** (TTT diagram): at high temperature, nucleation is slow (low driving force) but growth is fast; at low temperature, nucleation is fast (high driving force) but growth is slow (diffusion limited). The "nose" of the C-curve is where transformation is fastest — industrial heat treatments are designed around avoiding or hitting this nose.

### 8.3 Martensitic Transformation
Unlike diffusion-controlled transformations, the austenite → martensite transformation is **displacive** (atoms move in a coordinated shear, not by individual diffusion). It is:
- **Athermal:** The amount of martensite depends on temperature (how far below $M_s$), not on time. Isothermal hold does not increase martensite fraction.
- **Very fast:** Propagates at near the speed of sound.
- **Volume-expanding:** Martensite is less dense than austenite, creating internal stresses that can cause quench cracking if the geometry or quench medium is poorly chosen.

---

## 9. Polymers: Chain Architecture and Thermal Behavior

Polymers are long chains of repeating units. Their behavior is dominated by **chain mobility**: can the chains slide past each other, or are they locked?

### 9.1 Architecture
- **Linear:** Chains like spaghetti. Can crystallize if regular enough (HDPE, PET). Thermoplastic — re-meltable.
- **Branched:** Side branches prevent efficient packing → lower density, lower crystallinity (LDPE).
- **Crosslinked:** Covalent bonds between chains. Cannot flow → thermoset (epoxy, vulcanized rubber). Heating past $T_g$ softens but cannot melt; excessive heat degrades.
- **Network:** Extreme crosslinking → rigid thermosets (Bakelite) or elastomers (silicone rubber with light crosslinks).

### 9.2 Glass Transition Temperature ($T_g$)
Below $T_g$, chain segments are frozen — the polymer is glassy (hard, brittle). Above $T_g$, segments gain rotational freedom — the polymer becomes rubbery (and eventually flows if thermoplastic). $T_g$ is the single most important temperature for a polymer.
- **Polystyrene:** $T_g \approx 100°$C → glassy at room temp (coffee cup lids).
- **Natural rubber:** $T_g \approx -70°$C → rubbery at room temp.
- **PEEK:** $T_g \approx 143°$C → engineering thermoplastic for high-temperature service.

### 9.3 Viscoelasticity
Polymers are neither purely elastic (spring) nor purely viscous (dashpot) — they are **viscoelastic**. Under constant load, they **creep** (slowly deform). Under constant strain, the stress **relaxes**. The response depends on the timescale of loading relative to the material's relaxation time:
- Fast loading → glassy response (stiff, brittle).
- Slow loading → rubbery response (soft, compliant).
- This is why a silly putty ball bounces when thrown (fast) but flows into a puddle if left on a table (slow).

**Time-Temperature Superposition (TTS):** High temperature has the same effect as long time. You can accelerate aging tests by testing at elevated $T$ and shifting data to predict long-term room-temperature behavior.

---

## 10. Ceramics and Glasses

### 10.1 Why Ceramics Are Strong but Brittle
Ceramics have strong ionic/covalent bonds → high melting point, high stiffness, high hardness. But those same directional/ionic bonds prevent dislocation motion at room temperature. No dislocation motion → no crack-tip plasticity → no toughness → brittle fracture.

Their design strength follows **Weibull statistics**: the probability of survival depends on the volume of material and the flaw population. Larger parts are weaker (statistically more likely to contain a critical flaw). This is why a ceramic fiber (tiny volume, fewer flaws) can be incredibly strong, while a ceramic brick (large volume, many flaws) fails at modest stress.

### 10.2 Toughening Ceramics
Despite brittleness, ceramics can be toughened:
- **Transformation toughening (ZrO₂):** Tetragonal zirconia transforms to monoclinic at the crack tip, expanding ~4% and creating compressive stress that clamps the crack shut. This is the basis of "zirconia-toughened alumina" (ZTA) used in hip joint bearings and cutting tools.
- **Fiber/whisker reinforcement:** SiC whiskers in Al₂O₃ bridge crack faces, requiring energy to pull out — increasing $K_{IC}$.
- **Microstructural design:** Elongated grain growth (in-situ whiskers in Si₃N₄) creates an interlocking microstructure that deflects cracks.

### 10.3 Glass
Glass is thermodynamically metastable — it "wants" to crystallize but kinetically can't at room temperature (viscosity too high).
- **Annealing** (slow cooling through $T_g$) removes residual stress from forming.
- **Tempering** (rapid surface cooling) puts the surface in compression. Since cracks initiate at surfaces, compressive surface stress must be overcome before tensile stress can drive a crack → 4–5× stronger than annealed glass.
- **Chemical strengthening (Gorilla Glass):** Ion exchange in molten salt replaces small Na⁺ ions in the glass surface with larger K⁺ ions, creating compressive stress. Thinner and stronger than thermally tempered glass — this is why phone screens survive drops.

---

## 11. Thin Films, Surfaces, and Coatings

The surface of a material is not just a boundary — it is a **different material**. Surface atoms have unsatisfied bonds, different coordination, and different chemistry than bulk atoms.

### 11.1 Deposition Methods
- **Physical Vapor Deposition (PVD):** Sputtering or evaporation. High-purity, dense films. Used for hard coatings (TiN, TiAlN on cutting tools — golden color), optical coatings, and barrier layers.
- **Chemical Vapor Deposition (CVD):** Gas-phase precursors react on the surface. Excellent conformality (coats inside holes). Used for SiO₂ and Si₃N₄ in semiconductor fabs.
- **Atomic Layer Deposition (ALD):** Self-limiting CVD — one atomic layer at a time. Angstrom-level thickness control. Essential for gate dielectrics in modern transistors (<3 nm HfO₂).
- **Electroplating:** Cr, Ni, Zn, Au deposited from electrolyte. Cheap and scalable. Hard chrome plating on hydraulic cylinders provides wear resistance and corrosion protection.

### 11.2 Surface Engineering for Function
- **Nitriding/Carburizing:** Diffuse N or C into steel surface at 500–900°C. Creates a hard, wear-resistant case (1–2 mm) over a tough core. Gear teeth are almost always case-hardened.
- **Shot peening:** Bombarding a surface with small steel balls plastically deforms the surface, inducing compressive residual stress. Cracks cannot open under compression → fatigue life increases 2–10×. Every aircraft landing gear and turbine blade is shot-peened.
- **Thermal spray:** Melting powder or wire and spraying it onto a surface. Used for **Thermal Barrier Coatings (TBCs)** on turbine blades (yttria-stabilized zirconia, ~250 µm thick, reduces metal temperature by 100–150°C).

---

## 12. Corrosion: Electrochemical Destruction

Corrosion is the electrochemical reversion of refined metals back to their natural (oxidized) state. It costs ~3–4% of global GDP annually.

### 12.1 The Electrochemical Cell
Every corrosion event is a short-circuited battery:
- **Anode** (oxidation): The metal dissolves. Fe → Fe²⁺ + 2e⁻.
- **Cathode** (reduction): Something consumes the electrons. In neutral aerated water: O₂ + 2H₂O + 4e⁻ → 4OH⁻.
- **Electrolyte:** Conducts ions between anode and cathode.
- **Metallic path:** Conducts electrons from anode to cathode.

Remove any of these four and corrosion stops. This is the basis of all protection strategies.

### 12.2 Forms of Corrosion
- **Uniform (General):** Predictable, slow, easily managed with thickness allowance.
- **Galvanic:** Two dissimilar metals in electrical contact and an electrolyte. The more active metal (higher on the galvanic series) corrodes preferentially. Aluminum rivets in a copper plate will dissolve rapidly. **Design rule:** Avoid galvanic couples, or use insulating separators.
- **Pitting:** Localized breakdown of the passive film (on stainless steel, aluminum). Extremely dangerous because it's invisible and can perforate a wall from inside. Chloride ions are the primary culprit.
- **Crevice:** Stagnant electrolyte in tight gaps (under gaskets, bolt heads) depletes oxygen locally, creating a differential aeration cell. The crevice becomes anodic and corrodes.
- **Intergranular:** Preferential attack along grain boundaries. In austenitic stainless steel, heating to 500–800°C causes chromium carbide precipitation at grain boundaries (sensitization), depleting the adjacent matrix of Cr and destroying passivity locally.
- **Stress Corrosion Cracking (SCC):** Combination of tensile stress, susceptible material, and specific environment → crack growth at stress far below $K_{IC}$. Examples: brass in ammonia, austenitic SS in hot chloride, high-strength steel in H₂S.
- **Hydrogen Embrittlement:** Atomic hydrogen diffuses into high-strength steel, collects at stress concentrators, and causes brittle fracture. Especially dangerous in electroplating, cathodic protection, and sour-gas environments.

### 12.3 Protection Strategies
1. **Material selection:** Use inherently resistant alloys (316L SS, Ti, Hastelloy).
2. **Passivation:** Many metals (Al, Ti, Cr, SS) form a self-healing oxide film. Keep it intact.
3. **Coatings:** Paints, electroplating (Zn on steel = galvanized), ceramic thermal spray.
4. **Cathodic Protection:** Make the structure the cathode by connecting a more active metal (sacrificial anode: Zn on ship hulls) or by applying an external current (impressed current systems on pipelines).
5. **Design:** Avoid crevices, ensure drainage, prevent dissimilar metal contact, avoid residual tensile stress.

---

## 13. Composites: Anisotropy by Design

A composite combines two or more materials to get properties that neither has alone. The classic example: carbon fiber reinforced polymer (CFRP) — the fiber provides stiffness and strength, the polymer matrix holds the fibers in place, transfers load between fibers, and protects against environment.

### 13.1 The Rule of Mixtures
For continuous, aligned fibers loaded parallel to the fiber direction:
$$E_1 = V_f E_f + V_m E_m$$
This is an **isostrain** (equal strain) bound — the composite stiffness is a linear mix. Perpendicular to the fibers:
$$\frac{1}{E_2} = \frac{V_f}{E_f} + \frac{V_m}{E_m}$$
This is an **isostress** (equal stress) bound — much lower. This extreme anisotropy ($E_1$ can be 10–20× $E_2$) is both the power and the danger of composites. If you don't know the load direction, you must laminate plies at multiple angles ([0/±45/90]), sacrificing peak stiffness for isotropy.

### 13.2 Failure Modes
- **Fiber breakage:** Catastrophic loss of load-carrying capacity.
- **Matrix cracking:** First failure mode, often at low strain (matrix is weaker). Allows moisture ingress.
- **Delamination:** The killer for composites. Separation between plies due to interlaminar shear (which the matrix supports alone, with no fiber reinforcement). Impact damage causes internal delamination invisible from the surface — the part looks fine but has lost >50% compressive strength. This is why composite aircraft structures require scheduled ultrasonic inspections.
- **Fiber-matrix debonding:** If the interface is weak, load doesn't transfer to the fiber efficiently.

### 13.3 Metal Matrix Composites (MMCs) and Ceramic Matrix Composites (CMCs)
- **MMCs** (Al/SiC, Ti/SiC): Higher temperature and stiffness than polymer composites, used in brake discs (Al/SiC in high-performance cars) and space structures.
- **CMCs** (SiC/SiC): Ceramic fibers in a ceramic matrix. Survive 1300°C+ with toughness that monolithic ceramics lack. Used in jet engine hot-section components (replacing nickel superalloys with 1/3 the density).

---

## 14. Biomaterials and Tissue Mechanics

### 14.1 Design Constraint: Biocompatibility
A material is biocompatible if it does not produce a harmful biological response. This is not a material property — it is a system property (material + surface + geometry + load + biological environment). Titanium is "biocompatible" for orthopedic implants but would be toxic as a soluble ion in the blood.

### 14.2 Biometals
- **Titanium (Ti-6Al-4V):** Low modulus (~110 GPa vs. ~210 GPa for steel), reducing **stress shielding** — when the implant is much stiffer than bone (~15–25 GPa), it carries most of the load, and the bone under-loaded resorbs (Wolff's Law). Ti is closer to bone stiffness, reducing this effect.
- **CoCr alloys:** Harder and more wear-resistant than Ti. Used for articulating surfaces (hip femoral heads).
- **Surface treatments for osseointegration:** Sandblasting + acid etching (SLA) creates a dual-scale roughness that enhances bone cell attachment. Plasma-sprayed hydroxyapatite coatings create a bone-mineral-like surface that accelerates integration.

### 14.3 Biological Tissue as an Engineering Material
Bone, tendon, cartilage, and skin are **hierarchical composites**:
- **Bone:** Hydroxyapatite crystals (stiff, brittle ceramic) + collagen fibers (tough, flexible polymer) → stiff, tough, and self-healing. Organized at 7 length scales from nano (mineral platelets) to macro (cortical vs. cancellous architecture).
- **Tendon:** Aligned collagen fibers → extreme tensile strength along the fiber direction, negligible perpendicular strength. Essentially a unidirectional bio-composite.
- **Cartilage:** Collagen network filled with proteoglycan gel → load-bearing through hydrostatic pressure (the water cannot escape quickly). Avascular — cannot heal once damaged. No replacement material has successfully replicated this combination of properties.

---

## 15. Materials Selection: The Ashby Approach

When choosing a material for a structural application, you rarely optimize for a single property. You optimize for a **materials index** that combines relevant properties.

**Example: Light, stiff beam.** The performance index for a beam that must be stiff at minimum weight is $M = E^{1/3} / \rho$. Plotting $E$ vs. $\rho$ on a log-log chart (an **Ashby chart**), lines of constant $M$ are straight lines of slope 3. Materials above and to the left of a given line are better candidates. This approach reveals non-obvious winners:
- CFRP and wood outperform steel and aluminum for stiff, lightweight beams — which is why aircraft and racing cars use CFRP.

**Example: Light, strong panel.** The index becomes $M = \sigma_y^{1/2} / \rho$. Now CFRP still wins, but aluminum and magnesium become competitive.

**The elegance of this approach** is that it separates the *material* decision from the *geometry* decision. The index comes from the structural mechanics (beam theory, panel theory), and the material chart provides the screening. Then you add non-mechanical constraints (corrosion, cost, processability, biocompatibility) to shortlist.

---

## 16. Characterization Techniques (How We Know What We Have)

### 16.1 Structure
- **X-Ray Diffraction (XRD):** Bragg's Law ($n\lambda = 2d\sin\theta$) identifies crystal phases and texture. If you heat-treated a steel and want to know if it's martensite or austenite, XRD is the answer.
- **Scanning Electron Microscopy (SEM):** Imaging fracture surfaces, grain structure, and porosity at nm resolution. Energy Dispersive Spectroscopy (EDS) integrated into SEM maps elemental composition.
- **Transmission Electron Microscopy (TEM):** Imaging individual dislocations, precipitates, and interfaces at atomic resolution. Essential for understanding precipitation hardening.
- **Electron Backscatter Diffraction (EBSD):** Maps grain orientation and grain boundary character across a surface. Reveals texture, recrystallization, and deformation history.

### 16.2 Mechanical Testing
- **Tensile test:** The workhorse. Gives $E$, $\sigma_y$, UTS, elongation, reduction of area.
- **Hardness:** Vickers, Brinell, Rockwell — quick, non-destructive (nearly), correlates to $\sigma_y$.
- **Fracture toughness ($K_{IC}$):** Compact-tension or 3-point-bend specimens with a pre-crack.
- **Fatigue (S-N):** Rotating bending or axial cycling. Determines the endurance limit ($S_e$) for steel, or the fatigue strength at $10^7$ cycles for aluminum.
- **Nanoindentation:** Measures modulus and hardness at µm scale — essential for thin films and coatings.

---

## 17. The Processing–Structure–Property Triad: Closing the Loop

The central message of materials science: **you don't choose a material, you choose a processing-structure-property combination.**

The same composition (Fe + 0.8 wt% C) can be:
- **Pearlite** (soft, ~300 HV, ductile) — slow cool from austenite.
- **Bainite** (strong, ~400 HV, tough) — isothermal hold above $M_s$.
- **Martensite** (hard, ~700 HV, brittle) — quench.
- **Tempered Martensite** (hard *and* tough, ~500 HV) — quench + temper.

Each of these is the *same atoms* in different structural configurations produced by different thermal processing. The $200/ton steel in a paper clip and the $2,000/ton steel in a bearing race can have identical chemistry — the difference is entirely in processing-induced structure.

This is the deep lesson: **materials are not nouns, they are verbs.** They are what you do to them.
