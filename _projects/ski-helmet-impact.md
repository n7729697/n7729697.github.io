---
name: Does a Helmet Help on Snow? FE Study of Ski and Snowboard Head Impact (KTH HL2035, 2021)
tools: [LS-DYNA, LS-PrePost, HIII dummy, MATLAB, FEM]
image: /files/hl2035/cover.jpg
description: A helmet is certified against a rigid steel anvil, but nobody falls onto a steel anvil while skiing — they fall onto snow, which crushes. That makes a helmet and a snow surface two crushable layers in series, and how much the helmet adds depends on which one gives way first. We built an LS-DYNA model with a calibrated snow foam, a two-material helmet, and a HIII head and neck, and ran it with and without the helmet across four impact sites and two piste conditions. This page documents the model and the study design; the solved results are not in the archive I still have.
---

# **Does a Helmet Help on Snow?**

<i class="fas fa-university"></i> KTH **HL2035** — Biomechanics and Neuronics &nbsp;·&nbsp; <i class="fas fa-laptop-code"></i> LS-DYNA · LS-PrePost &nbsp;·&nbsp; <i class="far fa-calendar"></i> Autumn 2021

Head injury is the leading cause of death and serious injury in alpine skiing and snowboarding, and
helmets are certified by dropping them onto a rigid steel anvil. Nobody falls onto a steel anvil.
People fall onto snow — and snow crushes.

That difference is the whole project. Against a rigid surface, the helmet liner is the only thing
that can absorb energy, so its contribution is obvious. Against snow, the ground is *already* an
energy absorber, and the helmet becomes the second of **two crushable layers in series**. How much
it adds then depends on which layer gives way first, which depends on how the piste has been
groomed. A helmet that is clearly worth wearing on ice might be doing much less on soft powder.

![Four impact configurations of the dummy head and neck striking a block of snow](/files/hl2035/impact-cases.png)
*The study in one picture: a HIII head, neck and upper torso driven into a block of snow at four
different attitudes. Red arrows are the applied velocity field; the brown block is the snow.*

## Two crushable layers

Both the snow and the helmet liner are modelled as crushable foams, and both have the
characteristic foam response: a short elastic rise, then a long **plateau** where the pore structure
collapses at almost constant stress, then densification when there is no pore space left to close.

The plateau is where the protection lives. While a foam is crushing at constant stress it absorbs
energy at a *bounded force* — and bounded force on the skull is exactly what prevents a fracture.
Once it densifies, force climbs steeply and the protection stops.

Put two such layers in series and the softer one crushes first. So the question "does the helmet
help?" becomes a question about relative plateau stresses:

| Layer | Model | Density | Plateau |
|---|---|---|---|
| Soft snow | `*MAT_LOW_DENSITY_FOAM` | 550 kg/m³ | ≈ 0.22 MPa |
| Stiff / groomed piste | `*MAT_LOW_DENSITY_FOAM` | 650 kg/m³ | ≈ 0.40 MPa |
| Helmet liner | `*MAT_MODIFIED_HONEYCOMB` | 86 kg/m³ | E = 38 MPa |

On a hard groomed piste, the snow plateau is high and the liner is the layer that gives — the helmet
does the work it was designed to do. On soft snow, the snow may crush first and run a long way before
the liner is meaningfully loaded, so the helmet contributes less than its certification suggests.
That is the hypothesis the model was built to test, and it is why the study varies piste condition
and helmet together rather than one at a time.

## Modelling the snow

This is where most of the work went. Snow is a porous, crushable solid that compacts under load —
under compression it behaves far more like a structural foam than like ice. We used LS-DYNA's
`*MAT_LOW_DENSITY_FOAM`, driven by a tabulated stress–strain curve rather than an elastic constant,
with a Young's modulus of 34.6 MPa, a viscous damping coefficient of 0.16 and a shape factor of 5.
Two piste conditions were calibrated by building two curves:

![Stress-strain curves for the soft and stiff snow material models](/files/hl2035/snow-stress-strain.png)
*The two snow material curves. A 100 kg/m³ density difference nearly doubles the plateau stress —
from roughly 0.22 to 0.40 MPa. Both densify as the strain approaches 0.9.*

Choosing the model took some reading. The snow-simulation literature is dominated by material point
method and SPH formulations developed for computer graphics; they capture snow's behaviour
beautifully but do not drop into an explicit crash solver alongside a dummy model. A calibrated
crushable foam is the pragmatic engineering compromise, and it is what the automotive-safety world
would reach for.

## Modelling the helmet

The helmet is two materials, which matters for how the comparison is set up:

- **The liner** — `*MAT_MODIFIED_HONEYCOMB`, titled "Helmet linear foam": density 86 kg/m³, modulus
  38 MPa. This is the EPS that crushes and does the absorbing.
- **The shell** — `*MAT_ELASTIC`, part **402**: density 1162 kg/m³, modulus 1.64 GPa, Poisson's
  ratio 0.45. Stiff, thin, and essentially non-absorbing; its job is to spread load and to be the
  surface that actually touches the ground.

The shell being a separate part is what makes the helmet cleanly switchable, as below.

## The model

Four decks included into one main file, in SI units (m, s, kg):

- **`HIII_dummy.k`** — the Hybrid III dummy, part 13; thorax rigid body, 25.0 kg
- **`HIII_dummy_Head.k`** — the head, part 11, as a rigid body of 2.94 kg with principal inertias
  of 0.022, 0.024 and 0.016 kg·m²
- **`Helmet.k`** — liner and shell, the shell as part 402
- **`Ground_snow1_professional.k`** — the snow block, part 701

Contact is `*CONTACT_AUTOMATIC_SURFACE_TO_SURFACE` with soft-constraint formulation and viscous
damping of 20, solved to 200 ms with state output every millisecond.

Friction was re-calibrated when the ground became snow. The model's lineage is visible in the file
list: the early test cases include a `Rink_Board.k` dated 2016, because we started from a standard
ice-hockey rink-board impact setup and substituted a snow foam ground for the board. That inherited
setup ran static and dynamic friction both at 0.3; the snow runs use **0.03 static and 0.07
dynamic**. Since these impacts are oblique rather than normal, the tangential behaviour matters as
much as the normal crush, and 0.3 would have scrubbed off energy that snow does not scrub off.
Starting from a validated impact benchmark and changing one thing at a time was deliberate — when
the model misbehaved, the newly swapped part was the obvious first suspect.

## With and without the helmet

The comparison is made at the **contact definition**, not by rebuilding the model. The ground contact
carries a part set, and the helmet shell goes in or out of it:

| Case | Parts in contact with the snow |
|---|---|
| With helmet | 11 (head), 13 (dummy), **402 (helmet shell)** |
| Without helmet | 11 (head), 13 (dummy) |

Helmeted, the shell meets the snow and the liner crushes between shell and skull. Bare-headed, the
head meets the snow directly and the snow is the only thing that crushes at all. Everything else —
mesh, velocity, angle, snow curve, solver settings — is held identical, which is the right way to
build a comparison: change one card, not one model.

One caveat worth stating, because it is a real limitation rather than a tidy story. In the
no-helmet deck the `Helmet.k` file is **still included**; the shell is only removed from the ground
contact, not deleted from the model. So the bare-head case isolates the helmet's contact and
energy-absorption role cleanly, but it does not remove the helmet's mass from the assembly. For a
publishable result the helmet parts should be deleted outright and the run repeated.

## The study design

Four impact locations, two snow conditions, helmeted and bare:

| Impact site | Approach angle | Rationale |
|---|---|---|
| Forehead | 45° | Forward fall, the most common ski mechanism |
| Top of head | 90° | Near-vertical drop |
| Side | 45° | Lateral fall |
| Back of head | 45° | Backward fall, the characteristic snowboard mechanism |

![Side impact configuration](/files/hl2035/setup-side.jpg) *Side impact, 45°.* | ![Top impact configuration](/files/hl2035/setup-top.jpg) *Top of head, 90°.*
:-------------------------:|:-------------------------:
![Forehead impact configuration](/files/hl2035/setup-front.jpg) *Forehead, 45°.* | ![Rear impact configuration](/files/hl2035/setup-back.jpg) *Back of head, 45°.*

The split by sport is deliberate. Skiers tend to fall forward and catch the impact on the forehead;
snowboarders, with both feet fixed to one board, characteristically catch an edge and fall backward
onto the back of the head. Those are different loading directions into a neck that is not
symmetric, so they are worth separating rather than averaging.

## Where this stopped

**I no longer have the solved results.** The archive that survives contains the complete model — the
decks, the calibrated snow material, the helmet materials, the contact definitions and the full test
matrix — but not the `d3plot` databases or the post-processed head-acceleration and HIC curves.
Rather than reconstruct numbers from memory and present them as measurements, this page documents
what was built and how the study was set up, and stops there.

What it was built to produce: head acceleration histories at each impact site, HIC computed from
them, and the comparison the whole thing was aimed at — **how much of a helmet's measured benefit
survives when the surface underneath is already crushing**, and whether a groomed piste is stiff
enough to change the answer.

## What I took from it

The useful lesson was about **where a simulation's credibility actually lives**. It is tempting to
judge a crash model by the dummy — the HIII is detailed, it looks impressive, and it is somebody
else's validated work. But the dummy was the part we did not have to think about. Every result this
study could produce was hostage to two material cards we built ourselves: a snow foam and a helmet
liner. Get either plateau wrong by a factor of two and the elaborate dummy underneath is decorating
a wrong answer.

The second lesson is narrower and more useful in practice: **make the comparison the smallest
possible edit.** Switching one part in or out of a contact set is a change you can inspect, diff and
defend. Rebuilding the model without a helmet would have introduced a dozen silent differences and
left no way to tell which one moved the result.

The third is that this is a reproducible failure to archive. The model is here, the materials are
here, the test matrix is here — and the one thing that would make it a finding rather than a setup
is the thing that was not kept.

## Notes

A group project on the HL2035 project course. I have deliberately left the group roster off this
page rather than guess at it from a different assignment's report — if you were on this project with
me and would like to be credited, please get in touch.

Background reading that shaped the material choice: Stomakhin et al., *A Material Point Method for
Snow Simulation*; Gissler et al., *An Implicit Compressible SPH Solver for Snow Simulation*; and the
clinical accident literature on head injuries in alpine ski and snowboard accidents.
