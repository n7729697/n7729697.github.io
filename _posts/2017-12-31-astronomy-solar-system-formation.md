---
title: Solar System Formation Notes
tags: [astronomy, astrophysics, solar system, planet formation, protoplanetary disk, angular momentum, accretion, meteorites]
style: fill
color: info
description: Interdisciplinary notes on how a molecular cloud becomes a star, disk, planetesimals, planets, and the present Solar System.
---

_This note is adapted from course materials for **GE2305 Astronomy - The Universe and Us** at **City University of Hong Kong**. Instructor: course teaching staff._

## Central Question

How can a diffuse cloud of matter governed by gravity, angular momentum, thermodynamics, radiation, collisions, and chemistry produce an organized planetary system?

The short answer is not "dust simply clumped into planets." That phrase hides the hard parts. The Solar System formed through a coupled sequence of gravitational collapse, disk formation, thermal sorting, solid growth, gas drag, orbital migration, impacts, and long-term dynamical clearing. Each stage solves one problem while creating the next:

- gravity gathers the cloud, but angular momentum prevents everything from falling straight into the Sun;
- a disk solves the angular-momentum problem, but it creates radial temperature and pressure gradients;
- cooling allows solids to condense, but millimetre-to-kilometre growth is hard because drift and collisions can destroy particles;
- planetesimals solve the drift barrier, but embryos then perturb one another gravitationally;
- giant planets require fast core and gas accretion before the gas disk disappears;
- migration helps explain orbital architecture, but too much migration would destroy the inner system.

The formation sequence is therefore causal but not perfectly linear:

$$
\text{molecular cloud}
\rightarrow \text{collapse}
\rightarrow \text{protostar + disk}
\rightarrow \text{condensation}
\rightarrow \text{dust growth}
\rightarrow \text{planetesimals}
\rightarrow \text{planetary embryos}
\rightarrow \text{gas accretion and migration}
\rightarrow \text{disk dispersal}
\rightarrow \text{late impacts and present architecture}.
$$

---

## 1. Scales: Why Planet Formation Is a Multiscale Problem

Planet formation spans extreme ranges of length, time, mass, and physical regime. A micron-sized dust grain, a kilometre-scale planetesimal, a Mars-sized embryo, a Jupiter-mass gas giant, and a 200 AU protoplanetary disk do not obey one simple growth law.

{% include elements/figure.html image="/assets/img/posts/solar-system-formation/formation-timeline-scales.svg" caption="Figure 1. Approximate Solar System formation timeline. The horizontal axis is schematic and logarithmic in spirit: different stages overlap and do not form a perfectly linear conveyor belt." alt="Timeline from molecular cloud to disk, CAIs, planetesimals, gas giants, terrestrial planets, late impacts, and present Solar System" %}

A useful mental model is to track four quantities:

- **mass**: where is the material, and which reservoir dominates?
- **angular momentum**: why does material orbit instead of falling directly inward?
- **temperature**: which compounds can remain solid at each radius?
- **collision outcome**: does a collision stick, bounce, fragment, or gravitationally scatter?

The Solar System age is anchored by primitive meteorites. Calcium-aluminium-rich inclusions, usually called **CAIs**, are among the oldest dated solids and place the beginning of Solar System solid formation at about **4.567 billion years ago**. That number is not obtained by watching planets form; it is inferred from isotope systems preserved in meteorites.

---

## 2. Molecular-Cloud Environment and Collapse

The parent material was a cold molecular cloud made mostly of hydrogen and helium, enriched by heavier elements from earlier generations of stars. A cloud core becomes unstable when self-gravity overcomes support from gas pressure, turbulence, magnetic fields, and rotation.

Collapse can be triggered or assisted by several mechanisms:

- internal turbulent compression;
- nearby stellar winds or radiation;
- shock waves from massive stars or supernovae;
- gravitational instability inside a larger molecular-cloud complex.

The exact trigger for the Solar System is not uniquely known. Some meteorite isotope evidence has been interpreted as consistent with injection of short-lived radionuclides from a nearby stellar source, but the source and timing are active research questions. The safe statement is weaker: the Solar System inherited matter from earlier stellar nucleosynthesis and formed inside a star-forming environment.

### 2.1 Why Collapse Makes a Disk

If gravity acted alone on a perfectly nonrotating spherical cloud, material would collapse nearly radially. Real clouds are not like that. They have turbulence, magnetic fields, and a small but nonzero net angular momentum.

For a parcel of gas orbiting at radius \(r\) with tangential speed \(v_\theta\), the specific angular momentum is approximately

$$
j = r v_\theta .
$$

If there is little torque on that parcel, \(j\) is roughly conserved. As \(r\) decreases, \(v_\theta\) must increase. Rotation therefore becomes dynamically important during collapse. Material can fall more easily along the rotation axis than across it, so the system flattens into a disk around the forming protostar.

This is the first major bottleneck: the forming Sun must accrete mass while the disk carries angular momentum outward. Disk turbulence, magnetic stresses, winds, and gravitational torques are all candidate angular-momentum transport mechanisms.

---

## 3. Protostar and Protoplanetary Disk

The young Sun was first a **protostar**: a central object still gaining mass from the surrounding envelope and disk. Its early luminosity came mainly from gravitational contraction and accretion, not stable hydrogen fusion. Fusion begins only when the core reaches the required high temperature and pressure.

The disk matters because it is both a transport machine and a chemistry machine:

- gas orbits slightly below the Keplerian speed because pressure partly supports it;
- solids feel gas drag and tend to drift relative to the gas;
- inner regions are hotter and denser;
- outer regions are cooler and preserve more volatile material;
- the disk lifetime limits how long giant planets can accrete gas.

Observationally, protoplanetary disks are not hypothetical decorations. They are observed around young stars. ALMA images of systems such as HL Tau show ring and gap structures in dusty disks, strong evidence that planet-forming disks develop substructure early.

{% include elements/figure.html image="/assets/img/posts/solar-system-formation/protoplanetary-disk-cross-section.svg" caption="Figure 2. Schematic protoplanetary disk cross-section. Temperature and density generally decrease outward; refractory solids can condense close to the Sun, while water ice survives beyond the snow line." alt="Cross-section of protoplanetary disk with hot inner silicate region, snow line, icy outer region, and density decreasing outward" %}

---

## 4. Condensation: Why Inner and Outer Planets Differ

The disk was not chemically uniform in what could become solid. The dominant control is temperature. Near the young Sun, only refractory materials such as metals and silicates could remain solid. Farther out, temperatures were low enough for water ice and other volatile compounds to condense.

The **snow line** or **frost line** marks the approximate radius where water ice can persist in the disk midplane. It is not a fixed painted circle. It moves with time as the disk cools and depends on opacity, accretion heating, stellar irradiation, and local disk structure.

This thermal sorting helps explain the broad compositional architecture:

- inner planets are rocky and metal-rich because high-temperature condensates dominated;
- giant-planet cores could grow faster beyond the snow line because ice added solid mass;
- comets and many outer Solar System bodies preserve more volatile-rich material;
- the asteroid belt records mixing, heating, and dynamical disturbance rather than one simple radial composition sequence.

The condensation sequence is an approximation, not a complete planet recipe. Radial drift, turbulent mixing, impacts, and migration can move material across temperature zones.

---

## 5. Dust Growth and the Planetesimal Problem

The first solids were tiny grains. Micron and millimetre particles can collide and stick through surface forces, especially at low relative speeds. But there is a difficult intermediate regime: particles can bounce, fragment, or drift into the Sun before growing large enough for self-gravity to dominate.

This is why planet formation needs mechanisms beyond naive sticking.

{% include elements/figure.html image="/assets/img/posts/solar-system-formation/dust-to-planetesimal-growth.svg" caption="Figure 3. Dust-to-planetesimal growth mechanisms. Direct sticking works for small grains, but drift and fragmentation create barriers; concentration by gas-solid dynamics can produce dense clumps that collapse into planetesimals." alt="Growth path from dust grains to pebbles to concentrated clumps to planetesimals with drift and fragmentation barriers" %}

### 5.1 Streaming Instability

One leading mechanism for jumping from pebbles to planetesimals is the **streaming instability**. The key coupling is aerodynamic drag between gas and solids.

In a pressure-supported disk, gas orbits slightly slower than the Keplerian speed. Solids would prefer to orbit closer to Keplerian speed, so they feel a headwind and drift inward. When solids become locally concentrated, their back-reaction on the gas can reduce drift and concentrate more solids. Under suitable particle size, turbulence, and dust-to-gas conditions, this feedback can amplify density variations until clumps become gravitationally bound.

The important causal point is that gas drag is not merely a nuisance. The same drag that causes radial drift can, under the right conditions, help concentrate solids into planetesimal-forming clumps.

### 5.2 Planetesimals and Runaway Growth

Once bodies reach kilometre scale, gravity changes the collision regime. Larger bodies gravitationally focus nearby smaller bodies and grow faster. This can produce **runaway growth**, followed by **oligarchic growth**, where a smaller number of embryos dominate their feeding zones.

The growth rate depends on:

- local surface density of solids;
- relative velocities;
- gas drag and damping;
- gravitational focusing;
- orbital resonances and perturbations;
- whether growth is dominated by planetesimals or smaller pebbles.

At this stage the system is no longer only thermodynamics and chemistry. It becomes celestial mechanics with collisions.

---

## 6. Embryos, Differentiation, and Terrestrial Planets

Growing protoplanets heated internally through impacts, compression, and radioactive decay. If heating was sufficient, interiors partially melted and **differentiated**:

- dense metal sank toward the core;
- silicates formed mantle and crust reservoirs;
- volatiles could be retained, lost, or delivered later depending on mass and impact history.

The terrestrial planets did not form as finished spheres in place. They formed through many collisions among embryos and planetesimals. The Moon-forming impact is the most famous example of a late giant impact in the inner Solar System. Mars may have remained small because it formed rapidly as a stranded embryo or because giant-planet migration and disk structure reduced the material available near its orbit.

The engineering analogy is useful but limited: early terrestrial planet formation is like a self-assembling granular system under gravity, except the "components" change orbit, heat, melt, fracture, and chemically separate during assembly.

---

## 7. Giant Planets: Core Accretion Versus Disk Instability

Giant planets pose a timing problem. They contain large gas envelopes, but protoplanetary gas disks disperse in only a few million years. A model for Jupiter and Saturn must therefore build a core and accrete gas before the nebula is gone.

{% include elements/figure.html image="/assets/img/posts/solar-system-formation/core-accretion-vs-disk-instability.svg" caption="Figure 4. Two giant-planet formation pathways. Core accretion is bottom-up: solids build a core that later accretes gas. Disk instability is top-down: a massive cold disk fragment collapses directly." alt="Comparison of core accretion and disk instability pathways for giant planet formation" %}

### 7.1 Core Accretion

In the **core accretion** model, a solid core grows first. Once the core is massive enough, it binds a gas envelope. If cooling allows the envelope to contract, gas accretion accelerates and can become runaway.

This model naturally connects giant planets to the snow line because icy solids increase the available core-building material beyond it. It also fits many features of planetary systems, including the connection between heavy elements and giant-planet occurrence.

Its weakness is timescale. In a low-mass or rapidly dispersing disk, building a sufficiently massive core before gas disappears can be difficult.

### 7.2 Disk Instability

In the **disk instability** model, a massive, cold disk becomes gravitationally unstable and fragments directly into bound clumps. This is a top-down route to gas giants.

Its strength is speed. Its weakness is that it requires special disk conditions and does not automatically explain all observed giant-planet compositions and orbital architectures. It may be more relevant in some massive outer disks than as the default explanation for every giant planet.

The safest view is comparative: core accretion is the standard working model for much giant-planet formation, while disk instability remains an important alternative under specific disk conditions.

---

## 8. Migration, Resonance, and Disk Dispersal

Planets interact with the gas disk and with planetesimals. These interactions exchange angular momentum and can move planets from their birth locations. Migration is not an optional embellishment; without it, several Solar System and exoplanet architectures are hard to explain.

Migration mechanisms include:

- disk torques on embedded planets;
- resonant interactions among planets;
- scattering by planetesimal disks;
- gas damping of eccentricity and inclination;
- later instabilities after gas dispersal.

Migration helps explain why exoplanet systems often differ strongly from the Solar System. It may also help explain Solar System features such as the small mass of Mars, the disturbed asteroid belt, and outer Solar System structure. Models such as the Grand Tack and Nice-family instabilities are useful, but they should not be presented as settled historical video footage. They are dynamical reconstructions constrained by present-day orbits, small-body populations, and simulations.

Disk dispersal ends the gas-accretion stage. Radiation, stellar winds, accretion onto the star, and photoevaporation remove the remaining gas. Once the gas is gone, the system becomes more purely gravitational and collisional. Eccentricities and inclinations can grow, impacts become more important, and resonant structures can be rearranged.

---

## 9. Late Impacts and Present Solar System Structure

The present Solar System is the fossil result of formation plus later dynamical processing:

- the Sun contains almost all the mass;
- the inner Solar System contains small rocky planets;
- the asteroid belt is depleted and dynamically excited;
- Jupiter and Saturn dominate the planetary angular-momentum budget;
- Uranus and Neptune mark the outer giant-planet region;
- the Kuiper belt and scattered disk preserve outer planetesimal populations;
- the Oort cloud is inferred from long-period comet dynamics.

Late impacts were not minor decoration. They contributed to cratering, crustal resetting, volatile delivery or loss, and satellite formation. The lunar crater record, meteorites, asteroid families, and small-body orbital distributions all act as evidence, but the exact timing and intensity of bombardment remain debated.

---

## 10. Evidence Map: What We Observe Versus What We Infer

Astronomy often works by triangulation. We cannot rerun the Solar System, so we combine present evidence with observations of young systems and physical modelling.

{% include elements/figure.html image="/assets/img/posts/solar-system-formation/evidence-map-formation-stages.svg" caption="Figure 5. Evidence map connecting observations to inferred formation stages. No single evidence class proves the whole story; the model is constrained by many partial records." alt="Evidence map linking meteorites disks craters orbital structure exoplanets and simulations to formation stages" %}

Important evidence classes include:

- **meteorites**: ages, isotopes, early heating, condensation history, parent-body processing;
- **planetary orbits**: angular momentum distribution, resonances, eccentricities, inclinations;
- **small bodies**: asteroid belt, Trojan populations, Kuiper belt, comets;
- **lunar and planetary craters**: impact history and surface ages;
- **observed protoplanetary disks**: disk sizes, rings, gaps, dust growth, gas chemistry;
- **exoplanets**: migration, compact systems, giant planets, super-Earths, diversity beyond the Solar System;
- **numerical simulations**: tests of whether proposed mechanisms reproduce observed architecture.

Each evidence class has limits. Meteorites sample only material that reached Earth. Disk images show other systems, not the early Solar System. Simulations depend on initial conditions and unresolved physics. Exoplanets show diversity, but detection biases are strong. The Solar System formation model is therefore a constrained reconstruction, not a complete movie.

---

## What This Framework Lets Us Do

The framework explains why the Solar System is ordered but not perfectly regular. It connects:

- gravity to collapse and orbital motion;
- angular momentum to disk formation and migration;
- thermodynamics to the snow line and composition gradients;
- gas-solid drag to drift and streaming instability;
- collisions to planetesimals, embryos, and late impacts;
- observations to a historical reconstruction.

It also explains why planet formation belongs naturally between physics and engineering thinking. The system has reservoirs, fluxes, instabilities, thresholds, dissipation, feedback, and failure modes. A forming planetary system is not designed, but it still behaves like a coupled dynamical system with constraints.

## Where the Framework Stops Being Reliable

Several parts remain uncertain:

- the exact trigger and environment of Solar System collapse;
- how angular momentum transport operated in the solar nebula;
- how often streaming instability versus other mechanisms produced planetesimals;
- the relative roles of planetesimal accretion and pebble accretion;
- the exact timing and path of giant-planet migration;
- whether a distinct Late Heavy Bombardment occurred as once proposed;
- how much volatile material was locally retained versus delivered later.

The model should therefore be taught as a hierarchy of confidence. The existence of disks, condensation gradients, accretion, and dynamical evolution is robust. The detailed migration path of Jupiter and Saturn is less certain.

## Where the Subject Leads Next

Solar System formation leads into:

- planetary geology and differentiation;
- exoplanet population statistics;
- disk chemistry and astrochemistry;
- numerical \(N\)-body simulation;
- hydrodynamics and magnetohydrodynamics of disks;
- celestial mechanics, resonances, and chaos;
- astrobiology, because planet formation sets volatile inventories and habitable environments.

---

## Key Terms

- **Accretion**: growth by collecting smaller material through collisions or gas capture.
- **CAI**: calcium-aluminium-rich inclusion, among the oldest dated Solar System solids.
- **Core accretion**: giant-planet formation pathway in which a solid core forms before major gas capture.
- **Disk instability**: giant-planet formation pathway in which a massive cold disk fragments gravitationally.
- **Differentiation**: separation of planetary interiors by density after heating and melting.
- **Frost line / snow line**: disk region beyond which water ice can remain solid under local conditions.
- **Molecular cloud**: cold gas and dust reservoir from which stars and planetary systems form.
- **Planetesimal**: kilometre-scale or larger solid body that can grow gravitationally.
- **Protoplanetary disk**: rotating disk of gas and dust around a young star.
- **Streaming instability**: gas-solid drag instability that can concentrate pebbles into planetesimal-forming clumps.

---

## Technical and Editorial Audit

| Area | Correction or decision |
|---|---|
| Scope | Rebuilt the note from a broad astronomy introduction into a focused Solar System formation survey. |
| Causality | Organized the note around collapse, angular momentum, disk physics, condensation, planetesimal formation, accretion, migration, and late impacts. |
| Equations | Added only the specific angular momentum relation \(j=r v_\theta\); units are \(m^2/s\) in SI if \(r\) is metres and \(v_\theta\) is metres per second. |
| Assumptions | Marked the snow line, migration histories, and bombardment timing as model-dependent rather than fixed facts. |
| Examples | Used CAIs, HL Tau-like disk observations, Jupiter/core accretion, Mars/asteroid belt constraints, and present Solar System structure as recurring evidence. |
| Figures | Added five original SVG diagrams matching the requested figure plan. |
| Claims requiring care | Avoided precise current exoplanet counts and avoided treating Grand Tack, Nice models, or Late Heavy Bombardment as settled history. |

## Sources and Further Reading

- NASA Astrobiology Program, "How did our Solar System form?": [https://astrobiology.nasa.gov/education/alp/how-did-our-solar-system-form/](https://astrobiology.nasa.gov/education/alp/how-did-our-solar-system-form/)
- ESO, "Revolutionary ALMA Image Reveals Planetary Genesis": [https://www.eso.org/public/news/eso1436/](https://www.eso.org/public/news/eso1436/)
- NRAO gallery, HL Tau protoplanetary disk: [https://public.nrao.edu/gallery/hl-tau-alma-reveals-the-birth-of-planets-poster/](https://public.nrao.edu/gallery/hl-tau-alma-reveals-the-birth-of-planets-poster/)
- Youdin and Goodman, "Streaming Instabilities in Protoplanetary Disks": [https://arxiv.org/abs/astro-ph/0409263](https://arxiv.org/abs/astro-ph/0409263)
- Ormel, "Planet Formation Mechanisms": [https://arxiv.org/abs/2410.14430](https://arxiv.org/abs/2410.14430)
- Center for Astrophysics, "Planets and the Snow Line": [https://www.cfa.harvard.edu/news/planets-and-snow-line](https://www.cfa.harvard.edu/news/planets-and-snow-line)
