---
title: Topics in Nonlinear Systems
tags: [control theory, nonlinear systems, Lyapunov stability, feedback linearization, backstepping, sliding mode, ADRC, fuzzy control]
style: fill
color: light
description: A nonlinear-control note centered on Lyapunov geometry, local and global behavior, gain scheduling, dynamic inversion, backstepping, sliding mode, bang-bang control, fuzzy control, and active disturbance rejection.
---

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

## 5. Gain Scheduling and Hybrid Linear-Nonlinear Design

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

## 6. Feedback Linearization and Dynamic Inversion

If the nonlinear structure is known accurately enough, we can try to cancel it explicitly.

### 6.1 Basic idea

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

### 6.2 Why it is powerful

If it works well:

- nonlinear terms disappear from the closed-loop error dynamics,
- design reduces to a linear tracking problem,
- performance can be very sharp over a wider region than simple local linearization.

### 6.3 Why it is fragile

If the model is wrong:

- the cancellation is wrong,
- uncertainty reappears directly in the closed loop,
- actuator limits and measurement noise can break the idealized design.

So dynamic inversion is powerful when the model is reliable and the bandwidth is realistic. It is dangerous when it pretends uncertainty is negligible.

## 7. Backstepping

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

### 7.1 A representative theorem

**Theorem.** For a strict-feedback system with smooth known nonlinearities and nonvanishing input gains, a recursive backstepping design can produce a control law and Lyapunov function such that the origin is asymptotically stable.

**Proof sketch.** Start with a Lyapunov candidate $V_1(z_1)$ for the first subsystem. Introduce a virtual control to make $\dot V_1$ negative up to a residual involving $z_2$. Then augment the Lyapunov function to

$$
V_2 = V_1 + \frac{1}{2} z_2^2
$$

and choose $u$ so the cross terms cancel and $\dot V_2$ becomes negative definite. The same pattern extends recursively.

Backstepping is attractive because it builds the controller and the proof together.

### 7.2 Engineering reading of backstepping

Backstepping is especially useful when:

- the plant has a clear cascaded structure,
- states appear step by step,
- a Lyapunov proof is required,
- uncertainty will later be added in adaptive form.

This is why it reappears in adaptive control, underactuated systems, and nonlinear robotics.

## 8. Sliding Mode Control

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

## 9. Bang-Bang Control

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

## 10. Fuzzy Control

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

## 11. Active Disturbance Rejection Control

ADRC treats unknown plant mismatch and disturbances as an aggregated disturbance to be estimated and cancelled online.

The usual ingredients are:

- a low-order plant model or simple canonical form,
- an **extended state observer** (ESO),
- a control law that cancels the estimated disturbance and closes the loop on the residual dynamics.

### 11.1 Why ADRC is appealing

- it does not demand a perfect plant model,
- it handles disturbances explicitly,
- it often works well in motion-control practice.

### 11.2 What to be careful about

- observer bandwidth can amplify noise,
- cancellation quality depends on estimation quality,
- formal guarantees are usually weaker than idealized disturbance-free derivations suggest.

Conceptually, ADRC sits between model-based feedback linearization and robust disturbance-observer design.

## 12. Nonlinear Controllability and Observability

The linear rank tests do not fully settle nonlinear controllability or observability.

At the nonlinear level, useful ideas include:

- accessibility through Lie brackets,
- observability through Lie derivatives,
- local results around equilibria or trajectories,
- distinctions between local and global reachability.

For many engineering purposes, linearization still gives the first useful answer. But nonlinear systems force more precise language: "controllable near which point, in what sense, and under what input constraints?"

## 13. Reading Map Across the Control Series

This note is the nonlinear-design bridge in the control series:

- for classical transfer functions, root locus, Nyquist, and lead-lag design, see [Control Theory Basics]({% post_url 2019-05-18-control-theory-basics %}),
- for state-space, MIMO, graph-theoretic, and robust multivariable control, see [Modern, Multivariable, and Networked Control]({% post_url 2020-08-18-modern-control-foundations %}),
- for adaptive backstepping, PMP, HJB, RL, and advanced Lyapunov-based guarantees, see [Adaptive, Optimal, Robust, and Learning Control]({% post_url 2025-05-10-adaptive-control %}).

## 14. Compact Recall Map

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
