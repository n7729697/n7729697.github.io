---
title: Topics in Nonlinear Systems
tags: [control theory, nonlinear systems, Lyapunov stability, feedback linearization, backstepping, sliding mode, ADRC, fuzzy control]
style: fill
color: light
description: A nonlinear-control note centered on Lyapunov geometry, local and global behavior, gain scheduling, dynamic inversion, backstepping, sliding mode, bang-bang control, fuzzy control, and active disturbance rejection.
---

_This note is adapted from course materials for **EL2620 Nonlinear Control** at **KTH Royal Institute of Technology**. Instructor: course teaching staff._

## 1. Why Nonlinear Systems Matter

Linear models are powerful because they are analyzable and often accurate near an operating point. But physical systems are nonlinear by default.

Nonlinearity enters through:

- trigonometric geometry,
- products of states and inputs,
- fluid-flow relations,
- saturation and dead zones,
- friction and backlash,
- switching and hybrid logic.

That is why nonlinear control is not a niche afterthought. It is the broader setting in which linear control is a local approximation.

## 2. Nonlinear State Models, Equilibria, and Linearization

A general nonlinear control system is written as

$$
\dot x=f(x,u,t), \qquad y=h(x,u,t).
$$

For a constant input $u_e$, an equilibrium $x_e$ satisfies

$$
f(x_e,u_e,t)=0.
$$

Different equilibria can have different stability properties, so the operating point matters.

### 2.1 Jacobian linearization

Define perturbations

$$
\delta x=x-x_e, \qquad \delta u=u-u_e, \qquad \delta y=y-y_e.
$$

Then near the equilibrium,

$$
\delta \dot x \approx A \delta x + B \delta u, \qquad
\delta y \approx C \delta x + D \delta u,
$$

with Jacobians

$$
A=\left.\frac{\partial f}{\partial x}\right|_{(x_e,u_e)}, \quad
B=\left.\frac{\partial f}{\partial u}\right|_{(x_e,u_e)},
$$

$$
C=\left.\frac{\partial h}{\partial x}\right|_{(x_e,u_e)}, \quad
D=\left.\frac{\partial h}{\partial u}\right|_{(x_e,u_e)}.
$$

This is the bridge from nonlinear physics to linear design. It is powerful, but only local.

### 2.2 What linearization can and cannot say

Linearization can reveal:

- local stability,
- small-signal transient behavior,
- whether a local linear controller is plausible,
- local controllability and observability of the approximation.

It cannot guarantee:

- global behavior,
- behavior after saturation or switching,
- transitions between multiple equilibria,
- qualitative phenomena like limit cycles away from the operating point.

## 3. Phase Plane and Geometric Intuition

For second-order systems, phase-plane plots turn dynamics into geometry:

- one axis is the state,
- the other is its derivative,
- trajectories show attraction, repulsion, oscillation, or sliding behavior.

This viewpoint is helpful because it makes nonlinear motion visual:

- stable equilibria attract nearby trajectories,
- unstable equilibria repel,
- separatrices divide regions with different long-term behavior,
- limit cycles appear as closed isolated trajectories.

Phase-plane intuition is one of the cleanest ways to feel the difference between local linear reasoning and global nonlinear behavior.

## 4. Lyapunov Stability: Direct Method, Invariance, and Barbalat

For nonlinear systems, poles are not enough. Stability must be defined directly in state space.

### 4.1 Core definitions

Common notions are:

- Lyapunov stability,
- asymptotic stability,
- global asymptotic stability,
- exponential stability.

### 4.2 Lyapunov direct method

Take a scalar function $V(x)$ that behaves like an energy:

$$
V(x)>0 \text{ for } x \neq 0, \qquad V(0)=0.
$$

If

$$
\dot V(x)=\nabla V^\top f(x) \le 0,
$$

then trajectories cannot move uphill in $V$.

### 4.3 A standard lemma

**Lemma.** Suppose $V \in C^1$ satisfies

$$
\alpha_1(\|x\|) \le V(x) \le \alpha_2(\|x\|)
$$

for class-$\mathcal{K}_\infty$ functions $\alpha_1,\alpha_2$, and

$$
\dot V(x) \le -\alpha_3(\|x\|)
$$

for another class-$\mathcal{K}_\infty$ function $\alpha_3$. Then the origin is globally asymptotically stable.

**Proof sketch.** Positive definiteness and properness imply bounded level sets, so trajectories remain bounded. Since $V$ decreases strictly away from the origin, the state must move toward the largest invariant set inside $\{\dot V=0\}$, which here is only the origin. That gives global attractivity and stability.

This is the main pattern behind many nonlinear proofs: invent an energy-like quantity and show it decreases.

### 4.4 LaSalle and Barbalat

Two recurring tools are:

- **LaSalle invariance principle** for autonomous systems,
- **Barbalat's lemma** for non-autonomous or adaptive settings.

LaSalle helps when $\dot V \le 0$ but not strictly negative. Barbalat helps when we know a signal is bounded, integrable, and sufficiently regular, so it must converge to zero.

These are the workhorses behind many nonlinear and adaptive stability arguments.

### 4.5 What Stability Theory Does and Does Not Give You

Three frameworks organize sufficient conditions, from coarse to fine:

| Framework | Measures | Strength | Weakness |
| --- | --- | --- | --- |
| Small gain | norms ($\mathcal L_2$ gain, $H_\infty$) | simple, robust-control friendly | conservative: loop gain below 1 at every frequency |
| Passivity | input-output energy (inner product) | uses phase as well as gain | sits between the others; fewer off-the-shelf results |
| Lyapunov | energy of every state | most general and structural | needs a function valid at all states |

All three are _sufficient_, and the order small gain $\succ$ passivity $\succ$ Lyapunov is the typical order of decreasing conservatism (not a theorem for every system). Stability words are not interchangeable:

| Notion | What it says | What it does not say |
| --- | --- | --- |
| Local (Lyapunov) stability | trajectories starting close to an equilibrium stay close | nothing about distant initial conditions or convergence |
| Asymptotic stability | local stability plus convergence to the equilibrium | the basin may be small; convergence may be slow |
| Global asymptotic stability | convergence from every initial condition | not exponential; not robust to disturbances without more |
| Exponential stability | convergence at a rate bounded by an exponential | holds only on the stated region unless global |
| Boundedness / uniform ultimate boundedness | states stay in a bounded set, or enter a ball | no convergence to a point |
| Input-to-state stability (ISS) | bounded input gives bounded state, with $x\to0$ when input $\to0$ | does not give robustness to unmodelled dynamics or parameter change |
| Input-output ($\mathcal L_p$) stability | bounded input energy gives bounded output energy | says nothing about internal states unless detectable and stabilizable |
| Robust stability | stability for every model in a stated uncertainty set | only for that set; not a statement about the nominal model alone |

Each follows from the previous only with extra assumptions (for example, local asymptotic stability does not give global stability; asymptotic stability of the nominal model does not give ISS or robust stability). Further caveats:

- Even a good Lyapunov function proves stability of the model, not **robustness** to unmodelled dynamics. Stability analysis is a qualitative tool for a known system.
- Learn the vocabulary exactly (asymptotic, uniform, global, bounded, input-output stable); sloppy definitions give wrong pictures.
- The circle and Popov criteria are good examples of small-gain/passivity ideas, but are seldom decisive in practice. The describing function neglects harmonics and frequency shift, so it is an approximate harmonic-balance method, not a rigorous existence or stability result for limit cycles; treat its output as a hypothesis to test.
- Differential-geometric feedback linearization is elegant and exact only with exact models. With unmodelled fast dynamics, singular-perturbation arguments (Lyapunov redesign, nonlinear damping) are what give a result you can trust.
- Complexity grows quickly with dimension: the three-body problem is only an 18-state nonlinear system yet remains unsolved in closed form, and for chaotic or high-order systems the achievable goal is local, statistical, or numerical understanding, not a global closed form.

### 4.6 How the Nonlinear Toolbox Is Organized

A nonlinear-systems course usually has four parts of very different practical value, and knowing which is which saves time:

1. **Catalogue of nonlinear phenomena and their models** (saturation, dead zone, friction, backlash, hysteresis, limit cycles, bifurcations, chaos). This is the part most directly useful on hardware.
2. **Stability theory** (Lyapunov, passivity, small gain). It decides when a conclusion is correct, much as the if-part of a theorem in analysis does, but it rarely produces a design number.
3. **Geometric theory on manifolds** (differential-geometric controllability and observability, normal forms). It is mathematically deep and rarely used directly in practice.
4. **Synthesis methods** (feedback linearization, backstepping, sliding mode). They exist, but each rests on assumptions (exact model, matching, full state) that are hard to meet.

Dimension is the main source of difficulty, not chaos alone. A three-state system such as the Lorenz equations can be chaotic and still be well studied, and a system with supercritical Hopf bifurcation produces gentle oscillations that are easy to analyze and sometimes to control. The planar and low-order cases are the ones with complete theory. For the general three-body problem (18 states), no closed-form solution exists, and analysis has moved from solving to statistics, numerics, and qualitative structure.

![The Lorenz attractor](https://commons.wikimedia.org/wiki/Special:FilePath/Lorenz_attractor_yb.svg)
Figure 1. The Lorenz attractor, a three-state chaotic system $\dot x=\sigma(y-x)$, $\dot y=x(\rho-z)-y$, $\dot z=xy-\beta z$. Trajectories never repeat, yet stay on a bounded set with a well-understood geometry. Source: [File:Lorenz attractor yb.svg](https://commons.wikimedia.org/wiki/File:Lorenz_attractor_yb.svg). License: CC BY-SA 3.0.

Another useful distinction is between analysis methods that ignore the problem structure and those that exploit it. The describing function, for example, is an approximate frequency-domain method with no existence guarantee, while Lyapunov and invariance arguments are rigorous but may be conservative. Choose the method for the question: use the approximate one to guess a limit-cycle amplitude, then use simulation and hardware to confirm.

## 5. Limit Cycles, Friction, and Strong Nonlinearities

### 5.1 Where Real Jitter Comes From: Limit Cycles

At rest or low speed, small persistent vibration (steering wheel at standstill, a lane-keeping loop going straight, a servo parked at its target) is often a **limit cycle** rather than sensor noise passed through a linear loop, but this is a hypothesis to test, not a classification. The two checks below give diagnostic evidence only; each can mislead (nonlinear loops can also amplify noise, and a linear loop can resonate with a disturbance near its bandwidth), so confirm with several experiments.

1. **Frequency test.** A linear time-invariant loop does not create new frequencies, so a disturbance or noise at frequency $\omega$ appears at $\omega$ at the output. If the observed shake is at a frequency that the sensor noise and disturbances do not contain, a nonlinear mechanism is suspected. Because the noise spectrum is rarely measured exactly, treat a mismatch as suggestive.
2. **Gain sweep.** Raising loop gain at the offending frequency should shrink the effect of a linear disturbance. Limit cycles typically change amplitude or frequency with gain and often disappear when the loop is opened or the gain is cut. Several mechanisms can show the same trend, so a sweep narrows the candidates without identifying the cause.

Friction is the most common source. A standard static friction model combines Coulomb friction, a Stribeck (velocity-weakening) region, and viscous friction:

$$
F(v)=\Big[F_c+(F_s-F_c)\,e^{-(v/v_s)^2}\Big]\operatorname{sgn}(v)+\sigma\,v,
$$

with Coulomb level $F_c$, static (breakaway) level $F_s>F_c$, Stribeck velocity $v_s$, and viscous coefficient $\sigma$. The slope $dF/dv$ is negative for $v$ just above zero. Linearized about a sliding speed $v_0$, friction acts as a damper of coefficient $\sigma_{eff}=dF/dv|_{v_0}$, so where the Stribeck term dominates, $\sigma_{eff}<0$: the mechanism injects energy into small speed fluctuations instead of dissipating it, and a velocity or position loop with too little gain in that band can sustain a stick-slip oscillation. That is why more gain in the sticking speed band can reduce the oscillation, while more gain at standstill with dead zone or Coulomb friction can increase it.

![Stribeck curve: friction versus speed](https://commons.wikimedia.org/wiki/Special:FilePath/Curva_di_Stribeck.svg?width=700)
Figure 2. Stribeck curve: friction against sliding speed. Region 1 is static friction, region 2 is the velocity-weakening (negative-slope) region responsible for stick-slip, and region 3 is viscous-dominated friction. Source: [File:Curva di Stribeck.svg](https://commons.wikimedia.org/wiki/File:Curva_di_Stribeck.svg). License: CC BY-SA 3.0.

Typical sources and their signatures:

| Source | Typical symptom | Gain dependence |
| --- | --- | --- |
| Dead zone (torque sensor, bridge dead time, assist curve, current sampling) | small oscillation about the target at rest | grows with gain |
| Coulomb friction with integral action | hunting around setpoint | grows with integral gain |
| Stribeck (velocity-weakening) friction | stick-slip at low speed | _worsens at low gain_, reduced by more gain in the sticking band |
| Backlash/gap | chaotic or periodic impacts at particular speeds, with bifurcations as speed or gain varies | depends on operating speed |
| Variable gain through rising and falling segments | small oscillation before instability | grows as gain rises |

The describing-function (harmonic-balance) view gives a useful prediction: a limit cycle of amplitude $A$ and frequency $\omega$ is _suggested_ where $1+N(A)G(j\omega)=0$. This is an approximate condition that keeps only the first harmonic and assumes the linear part filters higher harmonics; it is neither a rigorous existence proof nor a stability test for the cycle, and it can give false positives and false negatives. If a gain map or friction-compensation curve is **non-monotonic**, $N(A)$ can sweep through the critical point, which makes a cycle plausible; confirm with simulation of the nonlinear model or hardware tests. Design gain tables and stacked "add-this-subtract-that" gain modifications so that the resulting curve is monotonic, then verify on hardware.

Practical rule on **switches and mode logic**: every extra switch is a potential chatter source. Add it only after analyzing the closed loop in each mode and across the switch (a common Lyapunov function or a dwell-time argument), and prefer smooth schedules.

**Describing-function analysis in detail.** Consider the loop of a static nonlinearity $\mathrm{NL}$ in series with a linear block $G_0(s)$ under unity negative feedback:

![Nonlinear element in series with a linear block in a feedback loop](https://commons.wikimedia.org/wiki/Special:FilePath/Describing_function_method.png)
Figure 3. The describing-function setup: a static nonlinearity NL followed by a linear block $G_0(s)$ in a feedback loop. Source: [File:Describing function method.png](https://commons.wikimedia.org/wiki/File:Describing_function_method.png). License: CC0.

Drive the nonlinearity with $e(t)=A\sin\omega t$. The output $u(t)$ is periodic, with Fourier series $u(t)=\sum_k\big(a_k\sin k\omega t+b_k\cos k\omega t\big)$. The **describing function** keeps only the fundamental:

$$
N(A)=\frac{a_1+jb_1}{A},\qquad a_1=\frac1\pi\int_0^{2\pi}u(A\sin\theta)\sin\theta\,d\theta,\quad b_1=\frac1\pi\int_0^{2\pi}u(A\sin\theta)\cos\theta\,d\theta .
$$

If $G_0(j\omega)$ attenuates harmonics (a low-pass assumption), a sustained oscillation requires the loop to return the fundamental unchanged:

$$
1+N(A)\,G_0(j\omega)=0\quad\Longleftrightarrow\quad G_0(j\omega)=-\frac{1}{N(A)} .
$$

Plot the locus $-1/N(A)$ against the Nyquist curve of $G_0$; an intersection gives a predicted amplitude $A$ and frequency $\omega$. Standard describing functions for common elements (with $N$ real for odd, memoryless nonlinearities):

| Element | Definition | $N(A)$ |
| --- | --- | --- |
| Relay (ideal, level $M$) | $u=M\,\mathrm{sgn}(e)$ | $\dfrac{4M}{\pi A}$ |
| Saturation (slope $k$, linear range $a$) | $u=k\,\mathrm{sat}_a(e)$ | $\dfrac{2k}{\pi}\Big[\arcsin\dfrac aA+\dfrac aA\sqrt{1-\dfrac{a^2}{A^2}}\Big]$ for $A\ge a$ |
| Dead zone (slope $k$, half-width $d$) | $u=k(e-d\,\mathrm{sgn}\,e)$ for $\lvert e\rvert>d$ | $k-\dfrac{2k}{\pi}\Big[\arcsin\dfrac dA+\dfrac dA\sqrt{1-\dfrac{d^2}{A^2}}\Big]$ for $A\ge d$ |

I checked the three expressions by numerical Fourier integration: for $k=a=d=1$ and $A=1.5$ they give $N=0.781$ (saturation) and $0.219$ (dead zone), and $N=0.637$ for a unit relay at $A=2$, all matching the closed forms to 9 digits. Saturation and dead zone satisfy $N_{sat}+N_{dz}=k$, as expected because their outputs add to the input.

**Worked example: relay feedback.** Take $G_0(s)=\dfrac{1}{s(s+1)^2}$ with a unit relay ($M=1$). The phase of $G_0(j\omega)$ is $-90^\circ-2\arctan\omega$, which reaches $-180^\circ$ at $\arctan\omega=45^\circ$, i.e. $\omega=1$ rad/s, where $|G_0(j1)|=\dfrac{1}{1\cdot2}=0.5$. The condition $G_0(j\omega)=-1/N(A)$ requires $-0.5=-\dfrac{\pi A}{4M}$, so

$$
\omega_{pred}=1\ \text{rad/s},\qquad A_{pred}=\frac{2M}{\pi}=0.637 .
$$

Direct time simulation of the relay loop (unity negative feedback, step $0.01$ s, after the transient) gives an output oscillation with amplitude $0.658$ and period $6.42$ s, against predicted $0.637$ and $2\pi=6.28$ s. The prediction is within about 3% in amplitude and 2% in period: this is the typical accuracy of the method, good enough to size an oscillation and poor as a proof. The residual is the higher harmonics the method discards, and when the linear part does not filter them well the error can be large, which is why the method should be confirmed by simulation or test.

![A limit cycle of a relaxation (van der Pol type) oscillator](https://commons.wikimedia.org/wiki/Special:FilePath/Van_der_Pol_type_slow-fast_limit_cycle.svg)
Figure 4. Phase portrait of a slow-fast (van der Pol type) limit cycle: a closed, isolated trajectory that attracts nearby trajectories. This is the geometric object that describing-function analysis tries to locate. Source: [File:Van der Pol type slow-fast limit cycle.svg](https://commons.wikimedia.org/wiki/File:Van_der_Pol_type_slow-fast_limit_cycle.svg). License: CC0.

### 5.2 Trade-Offs for Strong Nonlinearities

When friction, dead zone, or backlash is strong, no controller delivers both precision and quiet; the realistic move is to choose which to give up, in a specific place:

| Problem | Measure | Cost |
| --- | --- | --- |
| Coulomb-friction hunting at setpoint | set gain to zero inside a small error band | larger steady-state error |
| Stick-slip in the speed loop | raise gain in the sticking speed range, restore outside it | more noise |
| Dead zone | freeze or switch off integrator inside it | slower response |
| Backlash | scale gain when in the gap (if measurable); otherwise avoid the limit-cycle region | tracking not guaranteed |

If precision and quietness _both_ fail with correct engineering, the plant needs improvement (lower friction, tighter backlash, smaller dead zone).

The weak/strong distinction also matters for **identification**, but strong nonlinearities are not inherently unidentifiable. Whether a gap size or a static-friction level can be recovered depends on the assumed model structure (for example a Stribeck or LuGre friction model, or a backlash model), on whether the parameters are structurally identifiable, on excitation that actually exercises the nonlinearity (velocity reversals, small and large amplitudes), on which signals are measured (position, velocity, torque), and on the experimental conditions. Dedicated experiments such as slow ramps or velocity-reversal tests can identify friction and backlash parameters in many setups. What does fail is fitting a _linear_ model to a sine sweep of a nonlinear system: the coefficients then describe a describing-function-like average at one operating amplitude and have no direct physical meaning. Choose the model structure first, excite the nonlinearity deliberately, and validate on data not used in fitting.

## 6. Gain Scheduling and Hybrid Linear-Nonlinear Design

Many real plants operate over wide envelopes where one linear controller is not enough. Gain scheduling uses a family of local linear controllers indexed by operating condition:

- linearize around several operating points,
- design a controller for each one,
- interpolate or switch using a scheduling variable.

This is not a fully nonlinear synthesis method, but it is often the most practical compromise between fidelity and complexity.

The design risks are:

- switching transients,
- hidden coupling between scheduling variable and dynamics,
- lack of a global proof even when each local design is stable.

This is why gain scheduling is often paired with a hybrid linear-nonlinear analysis mindset rather than treated as a pure plug-and-play recipe.

## 7. Feedback Linearization and Dynamic Inversion

If the nonlinear structure is known accurately enough, we can try to cancel it explicitly.

### 7.1 Basic idea

Suppose

$$
\dot x = f(x)+g(x)u.
$$

If the input enters in a suitable way, choose

$$
u=\alpha(x)+\beta(x)v
$$

so the transformed dynamics become approximately linear in the new input $v$.

This is the core of **feedback linearization** and **dynamic inversion**.

### 7.2 Why it is powerful

If it works well:

- nonlinear terms disappear from the closed-loop error dynamics,
- design reduces to a linear tracking problem,
- performance can be very sharp over a wider region than simple local linearization.

### 7.3 Why it is fragile

If the model is wrong:

- the cancellation is wrong,
- uncertainty reappears directly in the closed loop,
- actuator limits and measurement noise can break the idealized design.

So dynamic inversion is powerful when the model is reliable and the bandwidth is realistic. It is dangerous when it pretends uncertainty is negligible.

## 8. Backstepping

Backstepping is one of the most systematic nonlinear-design methods for strict-feedback systems.

Consider the two-state template

$$
\dot x_1 = f_1(x_1) + g_1(x_1)x_2,
$$

$$
\dot x_2 = f_2(x) + g_2(x)u.
$$

The idea is recursive:

1. treat $x_2$ as a virtual control for the $x_1$-subsystem,
2. design a stabilizing virtual control $\alpha_1(x_1)$,
3. define the error

$$
z_2 = x_2 - \alpha_1(x_1),
$$

4. design the real input $u$ so both $z_1$ and $z_2$ decay.

### 8.1 A representative theorem

**Theorem.** For a strict-feedback system with smooth known nonlinearities and nonvanishing input gains, a recursive backstepping design can produce a control law and Lyapunov function such that the origin is asymptotically stable.

**Proof sketch.** Start with a Lyapunov candidate $V_1(z_1)$ for the first subsystem. Introduce a virtual control to make $\dot V_1$ negative up to a residual involving $z_2$. Then augment the Lyapunov function to

$$
V_2 = V_1 + \frac{1}{2} z_2^2
$$

and choose $u$ so the cross terms cancel and $\dot V_2$ becomes negative definite. The same pattern extends recursively.

Backstepping is attractive because it builds the controller and the proof together.

### 8.2 Engineering reading of backstepping

Backstepping is especially useful when:

- the plant has a clear cascaded structure,
- states appear step by step,
- a Lyapunov proof is required,
- uncertainty will later be added in adaptive form.

This is why it reappears in adaptive control, underactuated systems, and nonlinear robotics.

## 9. Sliding Mode Control

Sliding mode control is a variable-structure method that drives the system onto a chosen sliding surface and then keeps it there.

Choose a surface such as

$$
s(x)=0.
$$

A typical reaching law aims for

$$
\dot V = \frac{d}{dt}\left(\frac{1}{2}s^2\right)=s \dot s \le -\eta |s|
$$

for some $\eta>0$.

This yields two phases:

- **reaching**: trajectories move toward the surface,
- **sliding**: the closed-loop dynamics evolve on the surface.

Strengths:

- robustness to matched uncertainty,
- simple reaching conditions,
- clear Lyapunov interpretation.

Weaknesses:

- chattering from discontinuous control,
- actuator wear,
- implementation issues under sampling and noise.

Practical designs often smooth the sign function or use higher-order sliding modes to reduce chattering.

**Equations of the ideal design.** For a plant $\dot x=f(x)+b(x)u+d$ with matched bounded disturbance $|d|\le D$, choose a sliding variable such as $s=\dot e+\lambda e$ for a tracking error $e$. Choose the control

$$
u=u_{eq}-k\,\mathrm{sgn}(s),\qquad k>D+\eta,
$$

where $u_{eq}$ solves $\dot s=0$ for the nominal plant (the continuous control that would keep the state on the surface). Then $s\dot s\le-\eta|s|$, so $s$ reaches zero in finite time $t_r\le|s(0)|/\eta$, and on the surface $e$ decays as $e^{-\lambda t}$ regardless of $d$.

![Reaching and sliding phases of first-order sliding mode control](https://commons.wikimedia.org/wiki/Special:FilePath/First_order_sliding_mode_control.svg)
Figure 5. Phase plane of first-order sliding-mode control: trajectories first move toward the sliding surface $s=0$ (reaching phase), then slide along it toward the origin (sliding phase), with visible chatter along the line. Source: [File:First order sliding mode control.svg](https://commons.wikimedia.org/wiki/File:First_order_sliding_mode_control.svg). License: CC BY-SA 3.0.

**Sampled implementation, in numbers.** The simplest case $\dot x=u+d$, $u=-k\,\mathrm{sgn}(x)$ with sampling period $T$ becomes $x_{j+1}=x_j+T\big(-k\,\mathrm{sgn}(x_j)+d_j\big)$. With $d=0$, $k=2$, $T=0.05$ s the state does not settle to zero: it alternates between two values $kT=0.1$ apart, a peak-to-peak chatter of exactly $kT$. With a bounded disturbance $|d|\le0.5$ the simulated state stays within $\pm(k+D)T=\pm0.125$ (simulated maximum $0.122$). The chatter amplitude is proportional to the switching gain and the delay or sampling time, so reducing it means reducing $k$ toward the true $D$ (which needs a good disturbance bound), shortening $T$, or replacing $\mathrm{sgn}$ by a boundary layer. In the ideal theory these quantities are zero or infinite; in a real loop they are the design variables.

**Why sliding mode is rarely the default in industry.** In more detail:

- _Ideal theory versus implementation._ The ideal sliding-mode theory assumes infinitely fast switching, a perfect model of the sliding variable, and a Filippov solution that stays exactly on the surface; it predicts finite-time reaching and exact invariance to matched uncertainty. Real implementations are sampled, delayed, noisy, and driven through actuators with their own dynamics. Then the state does not remain on the surface but oscillates in a band whose size grows with the delay, sampling period, and switching gain (roughly amplitude $\propto\tau$ times the switching gain), and ideal invariance becomes ultimate boundedness. Boundary layers $\mathrm{sat}(s/\phi)$, higher-order sliding modes, and discrete-time sliding designs trade chatter for steady-state error or smoothness, so one has to pick an amplitude-frequency compromise.
- _Basic designs assume the state, or at least the sliding variable, is measured._ This is not a universal requirement: observer-based, output-feedback, and higher-order (super-twisting) sliding-mode designs exist, including sliding-mode observers and robust differentiators. But they need extra assumptions (relative degree, matching, bounded uncertainty, convergence of the observer before or faster than the switching), the classical separation principle does not apply to discontinuous nonlinear laws, and estimation error degrades the switching and robustness.
- _The analysis is weaker than it looks._ Discontinuous right-hand sides require Filippov solutions; many published guarantees are really derived on an equivalent smoothed or linear surrogate.
- _Each design step is idealized._ Choosing the surface, proving it asymptotically stable, picking the reaching law, and setting gains all assume exact structure and matched uncertainty; the cost rises quickly with order.
- _The "ordinary" variable-structure idea is common and different._ Switching a gain on a condition (integral action only inside an error band, lower gain at high speed) is everywhere in engineering and needs the dwell-time or common-Lyapunov analysis noted in section 5.1, but it is a milder idea than continuous high-frequency switching on a surface.

Use sliding mode where matched uncertainty is large, the actuator is fast and tolerant (power electronics, motor currents), and the sliding variable is measured or can be estimated within the design's assumptions.

## 10. Bang-Bang Control

Bang-bang control uses extreme actuator values:

$$
u(t) \in \{u_{\min}, u_{\max}\}.
$$

This appears naturally when:

- time-optimal control is the goal,
- actuators are effectively on/off,
- switching policies are simpler than continuous control laws.

Bang-bang laws sit at the boundary between nonlinear control and optimal control:

- in nonlinear systems they are variable-structure control laws,
- in optimal control they emerge from Pontryagin-type minimum-time or minimum-fuel arguments.

For the optimal-control version, see [Adaptive, Optimal, Robust, and Learning Control]({% post_url 2025-05-10-adaptive-control %}).

## 11. Fuzzy Control

Fuzzy control is attractive when the system is hard to model precisely but expert rules are available.

The logic is:

- describe operating regimes linguistically,
- encode rules such as "if error is large and increasing, apply strong correction",
- blend rule outputs through fuzzy inference and defuzzification.

Strengths:

- intuitive rule-based design,
- easy incorporation of heuristic knowledge,
- useful when precise first-principles models are unavailable.

Weaknesses:

- guarantees are often weaker than model-based methods,
- tuning can become ad hoc,
- robustness claims require extra analysis.

Fuzzy control can work very well in industry, but it is not a substitute for structural stability analysis when guarantees matter.

## 12. Active Disturbance Rejection Control

ADRC treats unknown plant mismatch and disturbances as an aggregated disturbance to be estimated and cancelled online.

The usual ingredients are:

- a low-order plant model or simple canonical form,
- an **extended state observer** (ESO),
- a control law that cancels the estimated disturbance and closes the loop on the residual dynamics.

### 12.1 Why ADRC is appealing

- it does not demand a perfect plant model,
- it handles disturbances explicitly,
- it often works well in motion-control practice.

### 12.2 What to be careful about

- observer bandwidth can amplify noise,
- cancellation quality depends on estimation quality,
- formal guarantees are usually weaker than idealized disturbance-free derivations suggest.

Conceptually, ADRC sits between model-based feedback linearization and robust disturbance-observer design.

## 13. Nonlinear Controllability and Observability

The linear rank tests do not fully settle nonlinear controllability or observability.

At the nonlinear level, useful ideas include:

- accessibility through Lie brackets,
- observability through Lie derivatives,
- local results around equilibria or trajectories,
- distinctions between local and global reachability.

For many engineering purposes, linearization still gives the first useful answer. But nonlinear systems force more precise language: "controllable near which point, in what sense, and under what input constraints?"

## 14. Reading Map Across the Control Series

This note is the nonlinear-design bridge in the control series:

- for classical transfer functions, root locus, Nyquist, and lead-lag design, see [Control Theory Basics]({% post_url 2019-05-18-control-theory-basics %}),
- for state-space, MIMO, graph-theoretic, and robust multivariable control, see [Modern, Multivariable, and Networked Control]({% post_url 2020-08-18-modern-control-foundations %}),
- for adaptive backstepping, PMP, HJB, RL, and advanced Lyapunov-based guarantees, see [Adaptive, Optimal, Robust, and Learning Control]({% post_url 2025-05-10-adaptive-control %}).

## 15. Compact Recall Map

The shortest useful nonlinear-control workflow is:

1. write the nonlinear model and identify the operating point,
2. separate local questions from global ones,
3. use Jacobian linearization when a local controller is enough,
4. use Lyapunov geometry when guarantees matter,
5. choose a nonlinear design method that matches the structure:
   - gain scheduling for wide but mostly linear regimes,
   - feedback linearization for accurately known nonlinearities,
   - backstepping for cascaded strict-feedback systems,
   - sliding mode for matched uncertainty,
   - ADRC when disturbance estimation is central.

Nonlinear systems are not exceptions to control theory. They are the full problem. Linear theory is the local window that makes pieces of the full problem manageable.
