---
title: Micro-Fabrication Notes for MEMS Engineers
tags: [MEMS, microfabrication, lithography, etching, deposition, SOI]
style: fill
color: light
description: A practical, process-first guide to MEMS microfabrication, from wafer to released device — with process physics, worked examples, and design tradeoffs.
---

## Why Micro-Fabrication Matters

Micro-fabrication is the reason MEMS can exist as an industry and not only as a lab curiosity.

The fundamental breakthrough was **wafer-level batch processing**: instead of building one microdevice at a time, we replicate patterns in parallel across a full wafer. A single 150 mm wafer can hold thousands of identical accelerometers, pressure sensors, or micromirrors — all fabricated simultaneously. This single idea made cost, reproducibility, and scaling possible.

A MEMS device is always a negotiation between three worlds:

| Domain | Concerns | Typical failures when ignored |
|--------|----------|------------------------------|
| **Physics** | What should move, sense, or actuate | Wrong stiffness, wrong transduction, wrong resonance |
| **Geometry** | What we draw on masks | Features too narrow, anchor too small, release holes missing |
| **Process reality** | What a fab can reliably build | Stiction at release, stress curling, underetch, film cracking |

Most first-pass failures happen because one of these worlds is ignored. A beam that is "correct" in simulation can still fail from release stiction, anchor underetch, stress curling, or mask-transfer error.

So micro-fabrication knowledge is not a later-stage skill; it is part of first-stage design.

---

## The Core Manufacturing Pattern

Nearly every MEMS process flow is a controlled repetition of the same primitive cycle:

```
┌──────────────────────────────────────────────────┐
│  1. Prepare substrate (clean, prime)             │
│  2. Create or deposit layer (oxide, poly, metal) │
│  3. Define pattern with resist (lithography)     │
│  4. Transfer pattern into target (etch)          │
│  5. Clean and inspect (metrology)                │
│  6. Repeat until stack complete                  │
│  7. Release moving parts (sacrificial etch)      │
│  8. Package and test                             │
└──────────────────────────────────────────────────┘
```

What makes this powerful is not the individual step, but the **stacked composability** of many steps with predictable interfaces. A 5-mask surface-micromachined accelerometer might traverse this cycle five or six times, building up anchor oxide → structural poly → sense gaps → metal routing → release.

Why this design pattern works:

- each step is physically narrow in scope,
- process windows can be tuned per step,
- metrology checkpoints can catch drift early,
- layer-by-layer abstraction allows complex 3D mechanics from mostly 2D patterning.

**Caution: process integration failure is cumulative.** A 50 nm lithography bias + a 5° etch taper + a 100 MPa stress mismatch can combine into a structure that curls 10 µm out of plane at release, completely destroying a capacitive gap that was designed at 2 µm.

---

## Materials: Choosing What Each Layer Does

In MEMS, materials are chosen by **role in the process flow**, not by isolated properties. A material may be structurally excellent but process-incompatible with your release chemistry, temperature budget, or mask stack.

### Role mapping in a typical MEMS stack

| Role | Common materials | Why this material |
|------|-----------------|-------------------|
| **Structural** (stiffness/compliance) | Single-crystal Si, polysilicon, SiC, Si₃N₄ | High Young's modulus, low intrinsic damping, well-characterised |
| **Sacrificial** (creates free space) | SiO₂, PSG, photoresist, polymers | Selectively removable in HF or O₂ plasma without attacking structure |
| **Dielectric** (electrical isolation) | SiO₂, Si₃N₄, Al₂O₃ | High resistivity, low loss, process-compatible |
| **Conductive** (routing/heating/sensing) | Al, Au, Ti/Pt, doped poly-Si | Low resistivity, bondable, or piezoresistive |
| **Hardmask** (pattern transfer) | SiO₂, Si₃N₄, Cr | Etch selectivity far exceeding resist |
| **Passivation** (environment protection) | Si₃N₄, parylene, SiO₂ | Moisture/chemical barrier, conformal coverage |

### Why silicon platforms became dominant

Silicon won MEMS not because it's "the best material" but because it combines the best *system of advantages*:

- **Mechanical quality**: $E \approx 170$ GPa (comparable to steel), no plastic deformation below fracture — a nearly perfect linear-elastic material for flexures.
- **Mature wafer supply**: CZ and FZ wafers with ppb-level impurity control, flatness < 1 µm TTV across 200 mm.
- **Oxide / nitride ecosystem**: thermal SiO₂ grows with atomic-level interface quality; LPCVD Si₃N₄ provides a complementary dielectric with opposite stress sign.
- **Inheritance from IC fabs**: lithography, implantation, CVD, PVD, RIE tools are all designed for silicon first.
- **Single-crystal orientation**: crystal planes (100), (110), (111) enable orientation-dependent anisotropic wet etching — a capability no amorphous or polycrystalline material offers.

### Practical cautions in material selection

**Thermal expansion mismatch** is the most common source of residual stress. When depositing a film at temperature $T_{\text{dep}}$ onto a substrate with different CTE, the residual thermal stress upon cooling to room temperature $T_0$ is approximately:

$$
\sigma_{\text{thermal}} \approx \frac{E_f}{1-\nu_f}\,(\alpha_s - \alpha_f)\,(T_{\text{dep}} - T_0)
$$

where $E_f$, $\nu_f$, $\alpha_f$ are the film's modulus, Poisson ratio, and CTE, and $\alpha_s$ is the substrate CTE. For LPCVD Si₃N₄ on Si deposited at 800 °C, this gives ~1 GPa tensile stress — enough to crack thin films or warp cantilevers.

Other cautions:
- Conductive layers (Au, Cu) can **diffuse into silicon** without a Ti/TiN barrier, creating shorts and junction leakage.
- Sacrificial/structural selectivity must be verified with real etch chemistry — published numbers assume fresh solution and optimized conditions.
- Mechanical Q-factor (favouring vacuum and stiff materials) and electrical performance (favouring low resistance and high permittivity) can pull in opposite directions.

**Design habit:** Create a **layer role table** before layout: material, thickness target, deposition method, etch method, mask level, and failure risks.

---

## Lithography: Turning Geometry Into a Masked Wafer

Lithography is the gateway between design intent and fabricated geometry. Every structural feature on a MEMS device passed through a lithographic step at least once.

### The lithographic sequence

```
Wafer → HMDS prime → Spin coat resist → Soft bake
     → Align to previous layer → UV expose through mask
     → Post-exposure bake → Develop → Inspect
     → Pattern transfer (etch) → Resist strip → Clean
```

What made modern micro-fabrication possible was **high-resolution, parallel optical pattern transfer** at wafer scale. A single contact/proximity exposure transfers millions of features simultaneously in seconds.

### Resolution limits

The minimum resolvable feature (half-pitch) in optical lithography is governed by the Rayleigh criterion:

$$
W_{\min} = k_1 \frac{\lambda}{NA}
$$

where $\lambda$ is the exposure wavelength (typically 365 nm for i-line, 248 nm for DUV), $NA$ is the numerical aperture of the projection optics, and $k_1$ is a process-dependent factor ($k_1 \approx 0.4$–$0.8$). For contact lithography common in MEMS, resolution is limited by diffraction across the gap $g$ between mask and resist:

$$
W_{\min} \approx \sqrt{\lambda \cdot g}
$$

At $\lambda = 365$ nm and $g = 10$ µm, this gives about 1.9 µm — adequate for most MEMS but not for sub-micron gaps.

### Depth of focus

For features to print correctly across topology, the resist must remain within the depth of focus:

$$
DOF = k_2 \frac{\lambda}{NA^2}
$$

MEMS wafers often have significant topography (5–50 µm), which is why lower-NA contact/proximity tools remain popular despite their resolution penalty — they provide the large DOF that MEMS process flows need.

### Why positive vs negative resist matters

| Property | Positive resist | Negative resist |
|----------|----------------|-----------------|
| Exposed region | Becomes **soluble** | Becomes **insoluble** (crosslinked) |
| Resolution | Generally finer (< 1 µm achievable) | ~2 µm typical (swelling during develop) |
| Sidewall profile | Vertical to slight undercut | Slight negative slope (re-entrant possible) |
| Preferred use | Fine CD, lift-off (undercut profile) | Thick films (SU-8), robust plating moulds |
| Strip behaviour | Clean removal in acetone/O₂ plasma | Can be difficult to strip once crosslinked |

The choice changes sidewall profile, process latitude, and strip behavior — it's an engineering decision, not a stylistic one.

### High-impact cautions

- **Resist thickness** must match downstream etch selectivity. If selectivity is $S = \text{etch rate of target} / \text{etch rate of resist}$, then to etch depth $d$, you need resist thickness $\geq d/S$ plus margin.
- **Alignment error** compounds in multi-mask flows. If each mask has ±1 µm alignment uncertainty and your stack has 5 masks, worst-case overlay error at the final level can be ±2–3 µm. This can kill anchor-to-contact overlap designed at only 2 µm margin.
- **Standing waves** from reflective underlayers (e.g., metal or poly-Si) create periodic intensity variations within the resist, producing wavy sidewalls in thin resists. An anti-reflective coating (ARC) or post-exposure bake reduces this.
- **Scumming** (residual resist in developed areas) blocks subsequent etch and causes pattern defects. Over-development clears scum but widens features.

For MEMS, lithography is often where "invisible" process drift starts; by the time you notice it at release, the root cause may be several tools upstream.

---

## Oxidation and Thin-Film Formation

Thin-film technology is the structural grammar of MEMS — every layer in the stack is either grown or deposited, and understanding the physics of film formation is essential for predicting stress, uniformity, and interface quality.

### Thermal oxidation: why it is foundational

Thermal oxidation of silicon made micromachining practical because it provides:

- **high-quality dielectric** ($\varepsilon_r \approx 3.9$, breakdown field ~10 MV/cm),
- **atomically sharp Si/SiO₂ interface** with extremely low defect density,
- **reliable etch selectivity** — HF etches SiO₂ orders of magnitude faster than Si,
- **controllable sacrificial layer** in surface micromachining.

#### The Deal-Grove model

Thermal oxide growth follows the **Deal-Grove model**. The oxide thickness $x_{ox}$ obeys:

$$
x_{ox}^2 + A\, x_{ox} = B\,(t + \tau)
$$

where $A$ and $B$ are temperature- and ambient-dependent constants, $t$ is oxidation time, and $\tau$ accounts for any initial oxide. This gives two limiting regimes:

- **Thin oxide (linear regime):** growth is limited by the reaction rate at the Si/SiO₂ interface:

$$
x_{ox} \approx \frac{B}{A}\,(t + \tau) \quad \text{(interface-reaction limited)}
$$

- **Thick oxide (parabolic regime):** growth is limited by diffusion of oxidant through existing oxide:

$$
x_{ox} \approx \sqrt{B\,t} \quad \text{(diffusion limited)}
$$

At 1100 °C in dry O₂, typical growth rate is ~0.1 µm/hr. Wet oxidation (H₂O ambient) is ~5× faster but gives lower-density oxide.

**Key physical fact:** oxidation **consumes silicon** at the interface. For every 1 µm of SiO₂ grown, approximately 0.44 µm of Si is consumed (the 0.44:1 ratio comes from molar volume differences). This means oxide growth is also a **geometry change mechanism**: the Si surface recedes, and the total stack grows thicker than the original surface.

$$
d_{\text{Si consumed}} \approx 0.44 \times x_{ox}
$$

This matters enormously in SOI MEMS where the device-layer thickness is a critical mechanical parameter — oxidation to grow a pad oxide can thin your structural layer.

### Deposition families and why each exists

| Method | Mechanism | Typical films | Conformality | Temp (°C) |
|--------|-----------|--------------|-------------|-----------|
| **LPCVD** | Gas-phase chemical reaction at low pressure | Poly-Si, Si₃N₄, SiO₂ | Excellent (near-conformal) | 550–850 |
| **PECVD** | Plasma-enhanced CVD | SiO₂, SiN$_x$, a-Si | Moderate | 200–400 |
| **Sputtering (PVD)** | Physical momentum transfer from target | Al, Ti, Pt, Mo, SiO₂ | Poor (line-of-sight) | Near RT |
| **Evaporation (PVD)** | Thermal/e-beam evaporation in vacuum | Au, Al, Cr, Ti | Poor (line-of-sight, shadowing) | Near RT |
| **Electroplating** | Electrochemical deposition from solution | Ni, Cu, Au | Filling moulds | Near RT |
| **ALD** | Self-limiting surface reactions, layer by layer | Al₂O₃, HfO₂, TiN | Near-perfect conformality | 100–350 |
| **Spin-on** | Liquid application + bake | SOG, polyimide, photoresist | Planarising (fills topology) | RT + bake |

**LPCVD** dominates structural MEMS film deposition because the low-pressure regime ensures mean free path >> reactor dimensions, producing truly conformal films inside trenches and over steps. At atmospheric pressure (APCVD), gas-phase depletion produces thickness non-uniformity.

**PECVD** is used when the wafer cannot tolerate high temperatures (e.g., after metallisation). The plasma dissociates precursors at much lower $T$, but the resulting films are typically less dense and may contain hydrogen that outgasses.

**PVD (sputtering / evaporation)** excels at depositing metals and refractory layers quickly. However, these are line-of-sight processes — film thickness varies with surface orientation, producing **poor step coverage** (thin or absent film at step sidewalls). This limits metal routing over high-topography MEMS structures.

**ALD** provides angstrom-level thickness control and perfectly conformal films, making it valuable for gap-sealing, ultra-thin dielectrics, and passivation in advanced MEMS.

### Film stress: the dominant thin-film concern in MEMS

In MEMS, film stress is often the single most important deposition parameter because it determines whether released structures are flat, curled, buckled, or cracked.

Total residual stress has two contributions:

$$
\sigma_{\text{total}} = \sigma_{\text{intrinsic}} + \sigma_{\text{thermal}}
$$

- **Intrinsic stress** arises from the growth mechanism itself — grain boundaries in poly-Si, ion bombardment in sputtered films, or incomplete oxidation in CVD oxides.
- **Thermal stress** arises from CTE mismatch upon cooling (see formula in Materials section above).

A deposited cantilever beam of length $L$ with stress gradient $\Delta\sigma$ across its thickness $t$ will curl with tip deflection:

$$
\delta_{\text{tip}} \approx \frac{3\,\Delta\sigma\, L^2}{E\, t}
$$

For a 500 µm cantilever with 100 nm poly-Si thickness, even a $\Delta\sigma = 50$ MPa gradient produces $\delta \approx 4.4$ µm — far exceeding a typical 2 µm sense gap.

**Stress engineering strategies:**
- Anneal poly-Si at 900–1100 °C to relieve intrinsic stress (recrystallisation).
- Alternate tensile (Si₃N₄) and compressive (SiO₂) films to balance the stack.
- Use PECVD SiN$_x$ and tune RF power to transition between compressive and tensile stress.
- For sputtered metals, Ar pressure controls the transition from compressive (low pressure, energetic bombardment) to tensile (high pressure, porous growth).

### Other fabrication cautions

- **Step coverage failure** can open electrical lines at sharp corners — rounding corners by reflow or increasing deposition conformality mitigates this.
- **Nonuniform thickness** introduces device-to-device variability: a 5% thickness variation across a wafer gives a ~15% variation in cantilever stiffness ($k \propto t^3$).
- **Temperature budget**: if your highest-temperature step is poly-Si LPCVD at 625 °C, all layers deposited before it must survive 625 °C without reflow, diffusion, or delamination.

In practice, a MEMS stack is reliable when deposition choices are made jointly with later etch and release strategy.

---

## Etching: The Real Geometry Transfer Step

Etching is where 2D mask patterns become real 3D microstructures. It is also where the most geometry-defining decisions are made — etch method, chemistry, timing, and profile control directly determine the final mechanical dimensions.

### The three critical etch parameters

Every etch process is characterised by three coupled parameters:

**1. Etch rate ($R$):** determines throughput and time predictability.

$$
R = \frac{\text{material removed (depth or thickness)}}{\text{etch time}}
$$

**2. Selectivity ($S$):** how preferentially the target material is removed vs. the mask (or underlying stop layer):

$$
S = \frac{R_{\text{target}}}{R_{\text{mask}}} \qquad \text{or} \qquad S = \frac{R_{\text{target}}}{R_{\text{stop layer}}}
$$

If $S = 50:1$ for SiO₂ over Si in buffered HF, then etching 1 µm of oxide consumes only ~20 nm of Si — excellent selectivity. If $S = 5:1$ for resist over poly-Si in plasma, the mask budget is tight and thick resist is needed.

**3. Anisotropy ($A$):** controls sidewall angle and dimensional fidelity:

$$
A = 1 - \frac{R_{\text{lateral}}}{R_{\text{vertical}}}
$$

- $A = 1$: perfectly anisotropic (vertical sidewalls — ideal for MEMS beams and gaps)
- $A = 0$: perfectly isotropic (hemispherical undercut — common in wet HF etch of SiO₂)
- $A < 0$: re-entrant profile (lateral rate exceeds vertical — useful for lift-off resist profiles)

### Wet etching: chemistry-driven selectivity

Wet etching remains essential in MEMS for:

- **Sacrificial oxide removal** in HF or BHF (buffered HF) — the primary release step in surface micromachining.
- **Anisotropic silicon etching** in KOH or TMAH — orientation-dependent etching that follows crystal planes.

#### KOH anisotropic etching of silicon

In KOH at ~80 °C, etch rates differ dramatically by crystal plane:

| Plane | Etch rate (relative) | Resulting geometry |
|-------|---------------------|-------------------|
| (100) | 1× (reference) | Flat bottom of V-groove |
| (110) | ~1.5–2× | Vertical walls |
| (111) | ~0.01× (nearly zero) | Forms the self-limiting 54.74° sidewall |

On a (100) wafer, a rectangular mask opening produces a **V-groove** bounded by (111) planes at 54.74° to the surface. The final groove depth for a mask opening of width $w$ is:

$$
d = \frac{w}{2\,\tan(54.74°)} \approx \frac{w}{2\sqrt{2}} \approx 0.354\,w
$$

This self-limiting behaviour is both a feature (precise depth control) and a constraint (you cannot make deep narrow trenches — the sloped walls consume lateral space).

#### Isotropic wet etch — HF on SiO₂

HF attacks SiO₂ isotropically. When releasing a beam of width $b$ anchored on both sides, the lateral underetch $u$ must satisfy $u \geq b/2$ to fully release the beam but must be less than the anchor dimension to avoid anchor detachment.

### Dry etching: directional profile control

Dry (plasma-based) etching provides the directionality needed for high-aspect-ratio MEMS structures.

**Reactive Ion Etching (RIE):** combines chemical reactivity of plasma radicals with physical bombardment by energetic ions. Vertical ion bombardment preferentially removes material from horizontal surfaces, producing anisotropic profiles ($A \to 1$).

**Deep Reactive Ion Etching (DRIE) — the Bosch process:**

DRIE is the single most important etch technology in modern silicon MEMS. It enables etching completely through a 500 µm silicon wafer with near-vertical sidewalls (> 89°). The Bosch process alternates:

1. **Etch step** (~5–10 s): SF₆ plasma isotropically etches Si.
2. **Passivation step** (~3–5 s): C₄F₈ plasma deposits a thin fluorocarbon polymer on all surfaces.
3. Repeat: the next etch step removes polymer from horizontal surfaces (ion bombardment) but leaves it on sidewalls, protecting them.

This cyclic process produces characteristic **scalloped sidewalls** with scallop depth ~100–500 nm per cycle. Aspect ratios of 20:1 to 50:1 are routinely achievable.

**Key DRIE parameters:**

| Parameter | Effect of increasing |
|-----------|---------------------|
| SF₆ flow / etch time | Higher etch rate, larger scallops, more undercut |
| C₄F₈ flow / passivation time | Better sidewall protection, reduced etch rate |
| Platen power (bias) | More directional ion bombardment, more wafer heating |
| Chamber pressure | Higher radical concentration, more isotropic etch |

### Etch non-uniformities in MEMS

**Microloading (RIE lag):** in plasma etching, dense arrays of narrow features etch slower than isolated wide openings because reactive species are locally depleted. A 2 µm trench next to a 200 µm cavity can etch 10–20% slower.

**Aspect-ratio-dependent etching (ARDE):** deep narrow trenches etch progressively slower because reactant transport into and product transport out of high-aspect-ratio features becomes diffusion-limited. An aspect ratio of 20:1 may see 50% rate reduction compared to an open field.

**Footing (notching):** at a dielectric interface (e.g., buried oxide in SOI), charging of the insulating layer deflects ions laterally, causing unwanted lateral etching at the base of silicon structures. Anti-footing measures include pulsed-bias etching and low-frequency chucking.

### Frequent cautions

- **Overetch** is routinely needed to clear all features (process variation across wafer), but it can damage anchors and thin membranes.
- **Sidewall roughness** from scalloping affects both optical MEMS (scattering) and mechanical MEMS (surface-loss-dominated Q-factor degradation).
- **Particle contamination** from redeposited etch products can mask subsequent etching and cause random defects.

A strong MEMS layout **anticipates etch behavior, not just nominal mask dimensions** — include bias compensation, loading-aware spacing, and etch-stop verification structures.

---

## Surface vs Bulk Micromachining

These are not competing "schools"; they are different answers to different device requirements. Many modern MEMS combine both approaches.

### Surface micromachining

Surface micromachining builds mechanisms from **deposited thin films** above the substrate and later removes sacrificial layers to create motion space.

```
          Released structure
             ┌────┐
             │poly│ ← structural (1-2 µm)
  ┌───┐  ┌───┘    └────┐  ┌───┐
  │anc│  │  free space │  │anc│ ← sacrificial SiO₂ removed
  │hor│  │  (was SiO₂) │  │hor│
  ├───┴──┴─────────────┴──┴───┤
  │       Si substrate        │
  └───────────────────────────┘
```

**Why it became powerful:**
- True multilayer mechanical structures: gears, hinges, comb drives, mirrors — all with 1–3 µm structural thickness.
- Compact in-plane mechanisms with sub-micron gaps.
- Compatible with integrated electrical layers (interconnect under or beside structural layer).
- PolyMUMPs, SUMMiT-V, and similar foundry services standardised multi-layer surface processes.

**Typical process (PolyMUMPs-like):**
1. Deposit sacrificial SiO₂ (~2 µm) on Si substrate.
2. Deposit poly-Si (~2 µm), pattern structural features.
3. Repeat for additional structural layers.
4. Release in HF to remove all SiO₂ — freestanding mechanisms remain.

**Caution points:**
- **Release access** must be designed from the beginning — closed plates without release holes will not free in any practical HF etch time. Rule of thumb: release holes every 20–40 µm for 2 µm oxide gaps.
- **Residual stress** across multiple films can cause severe curling of thin beams. A stress gradient of just 10 MPa/µm in a 2 µm poly-Si beam produces ~60 µm tip deflection on a 400 µm cantilever.
- **Small anchors** are vulnerable to unintended underetch — if the HF advance rate is 1 µm/min and you etch for 10 min to release a wide plate, your anchors lose 10 µm from each side.
- **Stiction** during post-release drying: surface tension of the drying liquid (water or IPA) produces enormous capillary forces in narrow gaps, pulling structures into contact.

### Bulk micromachining

Here we carve directly into the substrate to form cavities, membranes, and thick structures.

```
     ┌─────────────────────────┐
     │         Membrane        │ ← remaining Si (5-50 µm)
     │                         │
     ├──┐                   ┌──┤
     │  │                   │  │
     │  │   KOH etch cavity │  │
     │  │   (backside etch) │  │
     │  │   54.74° walls    │  │
     │  └───────────────────┘  │
     │                         │
     └─────────────────────────┘
```

**Why it matters:**
- **Superior stiffness-to-footprint** for pressure sensors (diaphragms), accelerometers (proof masses), and resonators.
- Deep features (tens to hundreds of µm) with fewer deposited structural layers.
- Strong thermal and mechanical substrate continuity — the device **is** the wafer.
- High-sensitivity pressure sensors: a 1 mm² membrane of 20 µm thickness gives deflection $\delta \propto P \cdot a^4 / (E \cdot t^3)$ — thin membranes from bulk etching are exquisitely pressure-sensitive.

**Cautions:**
- Crystal orientation and etch chemistry can reshape geometry unexpectedly — convex corners in KOH are attacked from multiple planes, requiring **corner compensation** structures.
- Deep etch profile and footing must match intended mechanics (DRIE scallops can affect mechanical Q).
- Process-induced damage at sidewalls can affect reliability and fatigue life.
- Backside alignment to front-side features requires double-sided lithography with careful co-alignment.

### SOI micromachining

SOI (Silicon-On-Insulator) wafers made many educational and prototyping MEMS flows simpler and more repeatable by giving:

- **Predefined structural thickness** (device layer: 2–100 µm, set by wafer vendor).
- **Built-in sacrificial / etch-stop layer** (buried oxide, BOX: 0.5–2 µm).
- **Handle wafer** (400–500 µm) for mechanical support.

```
     ┌─────────────────────────┐
     │   Device Si (2-100 µm)  │ ← structural layer
     ├─────────────────────────┤
     │   Buried oxide (BOX)    │ ← sacrificial / etch stop
     ├─────────────────────────┤
     │   Handle Si (500 µm)    │ ← support
     └─────────────────────────┘
```

**Single-mask SOI flow:** etch device layer by DRIE, use BOX as etch stop, release beams by HF removal of exposed BOX. Only one lithography step — device layer thickness, buried oxide thickness, release time, and anchor geometry must be jointly tuned.

**SOI advantages:**
- Single-crystal silicon structural layer — no grain-boundary stress variations, superior mechanical Q.
- Process simplicity (single mask possible).
- Precise thickness uniformity (wafer-vendor-controlled).

**SOI cautions:**
- Footing / notching at the Si-BOX interface during DRIE (charging effects on insulating BOX).
- BOX removal creates step changes in support — freestanding structures span from device Si to handle Si across a gap equal to BOX thickness.
- SOI wafers cost significantly more than standard silicon (~3–10×).

---

## Release Engineering: Where Many Designs Fail

Release is the transition from "patterned wafer" to "working mechanism," and it is often the highest-risk step in the entire MEMS process flow.

### Why release is so challenging

The physics conspire against you. During release:

1. **Chemical selectivity** must be maintained across long etch times (HF must remove all oxide without attacking structural silicon, metal, or dielectric layers).
2. **Capillary forces** during drying produce enormous pressure in narrow gaps.
3. **Fragile structures** are at their most vulnerable — no more protective oxide to stiffen them.

The capillary force per unit area between a flat plate and substrate separated by gap $g$ with liquid contact angle $\theta$ and surface tension $\gamma$ is:

$$
P_{\text{cap}} = \frac{2\,\gamma\,\cos\theta}{g}
$$

For water ($\gamma = 72$ mN/m, $\theta \approx 0°$) in a 1 µm gap: $P_{\text{cap}} \approx 1.4$ atm. This can easily pull a compliant cantilever into permanent contact — **stiction**.

### Typical release failure mechanisms

| Failure | Mechanism | Prevention |
|---------|-----------|------------|
| **Anchor loss** | Excessive lateral underetch from HF | Adequate anchor margin (underetch + 50%) |
| **Stiction** | Capillary drying or van der Waals contact adhesion | CPD, HF vapour release, anti-stiction coatings |
| **Stress curling** | Gradient stress in structural film, revealed after oxide removal | Stress anneal, balanced stack |
| **Trapped etchant** | HF or byproducts in poorly vented cavities | Release holes, rinsing protocol |

### Critical Point Drying (CPD)

CPD avoids the liquid-gas phase boundary entirely by transitioning through the **supercritical state**:

1. Replace water with methanol or IPA.
2. Replace alcohol with liquid CO₂ in a pressure chamber.
3. Heat above CO₂ critical point ($T_c = 31$ °C, $P_c = 73$ atm).
4. Vent supercritical CO₂ — no liquid-gas interface means no capillary force.

CPD is the standard for releasing compliant structures with gaps < 2 µm.

### HF vapour-phase release

An alternative to wet HF + drying: expose wafer to gaseous HF at 30–40 °C. The vapour selectively etches SiO₂ without producing a liquid meniscus, eliminating capillary stiction. Slower than wet HF but increasingly preferred for production.

### Practical release design rules

- Free-standing features should be releasable in realistic etch time — if release requires > 60 min of HF, ask whether the structure layout can be modified.
- Anchors need margin beyond expected lateral undercut: if HF underetch rate is 1 µm/min and release time is 20 min, design anchors ≥ 25 µm wide (extra 25% margin).
- Large plates (> 50 × 50 µm) need release holes on a regular grid (typically every 20–30 µm for 2 µm sacrificial oxide thickness).
- Drying method must match structure compliance and gap scale — CPD for sub-2 µm gaps, IPA drying may suffice for stiffer structures with > 5 µm gaps.

**Design habit:** Annotate every movable region with expected release path and every fixed region with explicit anti-release strategy (oversized anchors, encapsulated oxide).

---

## Design Rules: Fabricable vs Merely Drawable

Design rules are process constraints translated into geometry constraints. They exist because fabrication tools have finite capability in resolution, anisotropy, uniformity, and selectivity.

### What design rules protect you from

| Rule type | Example | What it prevents |
|-----------|---------|-----------------|
| Minimum feature width | Line width ≥ 2 µm | Resist collapse, incomplete etch |
| Minimum spacing | Gap ≥ 2 µm | Resist bridging, etch loading |
| Minimum overlap | Anchor overlap ≥ 3 µm per side | Anchor-structure delamination |
| Minimum enclosure | Contact pad enclosed by ≥ 2 µm metal | Open circuits from misalignment |
| Maximum aspect ratio | DRIE AR ≤ 20:1 | ARDE-induced depth variation |
| Release hole spacing | ≤ 30 µm pitch for 2 µm oxide | Incomplete release of large plates |

### Why design-rule compliance is necessary but not sufficient

Passing DRC means geometry is likely fabricable, not that the device will function as intended.

Function depends on second-order effects:

- **Stress** — a DRC-clean cantilever can still curl 50 µm out of plane.
- **Damping** — a geometrically perfect resonator in air has Q ~ 10; it needs vacuum packaging to reach Q ~ 10,000+.
- **Charging** — trapped charge on dielectric surfaces can shift pull-in voltage by volts.
- **Contact physics** — switches that pass DRC can fail from micro-welding or contamination.
- **Process variability** — features at DRC minimum may be right at the yield cliff.

**The right mindset:**
1. First ensure **fabricability** by rule compliance.
2. Then ensure **functionality** by coupled physics + process margin checks.
3. Then ensure **robustness** by Monte Carlo across process corners.

---

## Process Integration Mindset

Process integration is the discipline that makes individual "good steps" become a successful full flow. It is the highest-leverage engineering skill in MEMS fabrication.

### The integration challenge visualised

Consider a simple inertial MEMS accelerometer — even a "simple" device requires coordinating:

```
Step  1: Start with SOI wafer
Step  2: Thermal oxidation (pad oxide)
Step  3: LPCVD Si₃N₄ (hard mask for backside DRIE)
Step  4: Lithography level 1 (backside cavity pattern)
Step  5: Backside DRIE to thin membrane
Step  6: Lithography level 2 (front-side structural pattern)
Step  7: Front-side DRIE through device layer, stop on BOX
Step  8: HF vapour release of exposed BOX
Step  9: Metal deposition (contact pads)
Step 10: Wire-bond and package
```

At every step boundary, a cross-step interaction can cause failure: step 2 thins the device layer; step 5 can leave footing; step 7 BOX charging causes notching; step 8 can underetch anchors; step 9 metal stress can warp released beams.

### High-value integration practices

- **Define a full cross-section evolution** before final layout — sketch the wafer cross-section after *every* process step to catch geometric conflicts early.
- **Track critical dimensions** through each process transfer — the mask dimension in the GDS file is not the final device dimension; account for CD bias at resist, etch, and oxidation steps.
- **Use test structures** for etch rate extraction, stress measurement (balanced cantilever arrays, Stoney-method wafer-bow structures), and release calibration (release test bridges of varying anchor widths).
- **Keep explicit margins** for worst-case process corners — if your design works only at exactly nominal thickness, it will fail in production.

### Common integration traps

- Treating each module independently ("the etch guy says profiles are fine" — but profiles are fine for *his* test wafer, not for your 5-layer stack with different loading).
- Assuming nominal thickness in all simulations — use ±10% variation at minimum.
- Ignoring **pattern density effects** until late fabrication — CMP, etch loading, and deposition uniformity all depend on local pattern density.
- Running release without pre-release risk review — every anchor, every movable plate, every re-entrant corner should be reviewed for underetch vulnerability.

In real projects, first-silicon success comes from **margin engineering**, not from ideal-case simulation.

---

## Cleanroom Reality and Safety Culture

Cleanrooms are not only about cleanliness; they are about **reproducibility** and controlled risk.

### Particle impact quantified

A cleanroom is classified by the maximum number of particles ≥ 0.5 µm per cubic foot:

| Class (US 209E) | ISO equiv. | Particles ≥ 0.5 µm per ft³ | Typical use |
|:---:|:---:|:---:|---|
| 1 | ISO 3 | 1 | Front-end IC lithography |
| 10 | ISO 4 | 10 | High-res MEMS lithography |
| 100 | ISO 5 | 100 | Standard MEMS processing |
| 1000 | ISO 6 | 1,000 | Packaging, assembly |

For context: typical outdoor air contains ~1,000,000 particles/ft³. A human standing still in a cleanroom generates ~100,000 particles/min from skin and clothing — hence gowning protocols.

**Why this matters technically:** A single particle of diameter $d_p$ landing on a wafer during lithography creates a defect that can:
- block exposure (creating an unexposed resist island),
- mask etch (leaving a bump or pillar),
- bridge two conductors (creating a short).

If $d_p$ is comparable to the minimum feature size, the defect is *killer*. At feature sizes of 2 µm, particles > 1 µm are the primary yield threat.

### Why behavior discipline matters technically

- Particles directly translate to pattern defects and yield loss.
- Moisture and chemical contamination can alter etch rates, film adhesion, and interface quality.
- Improper handling (touching wafer surfaces, placing wafers on unclean surfaces, rapid movements) can damage wafers long before visible defects appear.

### Safety is process quality

In MEMS labs, common hazardous materials include:

| Chemical | Hazard | Use |
|----------|--------|-----|
| HF (hydrofluoric acid) | Penetrates skin, binds calcium — potentially fatal | Oxide etch, release |
| KOH | Strong base, exothermic | Si anisotropic etch |
| Piranha (H₂SO₄ + H₂O₂) | Extremely exothermic, reacts violently with organics | Wafer cleaning |
| Photoresist solvents | Flammable, toxic vapour | Resist processing |
| SiH₄ (silane) | Pyrophoric (ignites spontaneously in air) | CVD poly-Si deposition |

Strong safety culture correlates with better technical output because teams that follow safety protocols also tend to follow recipe control, documentation, and verification discipline. Never treat safety instructions as separate from engineering outcomes; they are part of the same control system.

---

## Characterization and Closing the Loop

Fabrication without metrology is guesswork, and design without post-fab feedback is repetition of avoidable mistakes.

### What to measure and how

| Parameter | Measurement tool/method | Why it matters |
|-----------|------------------------|---------------|
| Film thickness & uniformity | Ellipsometry, profilometry, reflectometry | Stiffness ∝ $t^3$; small $\Delta t$ → large $\Delta k$ |
| Critical dimensions (CD) | SEM (top-down and cross-section) | Capacitive gap, beam width, spring width |
| Etch depth & sidewall profile | SEM cross-section, white-light interferometry | Verifies DRIE aspect ratio, scallop amplitude |
| Underetch length | SEM of released structures, test bridges | Determines if release is complete + anchor integrity |
| Residual stress | Wafer bow (Stoney method), cantilever arrays | Predicts curl, buckling, resonance shift |
| Surface roughness | AFM, optical profilometry | Affects stiction, Q-factor, optical reflectance |
| Electrical continuity / leakage | Probe station + parameter analyser | Verifies routing, isolation, contact resistance |
| Actuation / sensing response | LDV (laser Doppler vibrometry), impedance analyser | Transfer curves, resonance, pull-in voltage |

### Stoney equation for film stress from wafer bow

The most common stress measurement in thin-film MEMS uses the change in wafer curvature before and after film deposition:

$$
\sigma_f = \frac{E_s\, t_s^2}{6\,(1-\nu_s)\, t_f} \left(\frac{1}{R_{\text{after}}} - \frac{1}{R_{\text{before}}}\right)
$$

where $E_s$, $\nu_s$, $t_s$ are the substrate modulus, Poisson ratio, and thickness, $t_f$ is the film thickness, and $R$ is the radius of curvature. Modern laser-scan tools measure $R$ to sub-metre precision across the wafer, giving stress maps with ~1 MPa resolution.

### Why measuring matters so much in MEMS

MEMS performance is highly sensitive to small geometry and material deviations. Consider a simple cantilever resonator:

$$
f_0 = \frac{1}{2\pi}\sqrt{\frac{k}{m}} = \frac{1.0149}{2\pi}\frac{t}{L^2}\sqrt{\frac{E}{12\,\rho}}
$$

A 5% error in thickness $t$ produces a 5% shift in resonant frequency — this can move a filter passband out of specification. A 5% error in $L$ produces 10% shift (quadratic dependence). These are easily within normal process variation.

---

## Summary: From Wafer to Working Device

| Stage | Key physics | Primary risk |
|-------|------------|-------------|
| **Substrate prep** | Crystal orientation, flatness | Contamination, wrong orientation |
| **Film formation** | Stress, conformality, interface quality | Stress-induced curl/buckling |
| **Lithography** | Diffraction, alignment, resist chemistry | CD bias, overlay error, scumming |
| **Etching** | Selectivity, anisotropy, loading | Underetch, footing, ARDE |
| **Release** | Capillary forces, selectivity | Stiction, anchor loss |
| **Packaging** | Hermeticity, stress isolation | Vacuum leak, thermomechanical stress |
| **Test** | Electromechanical coupling | Specification non-compliance |

Every stage feeds the next, and errors compound. The engineer who understands the *entire* flow — not just their own module — is the one who achieves first-silicon success.
