---
title: Adaptive, Optimal, Robust, and Learning Control
tags: [control theory, adaptive control, optimal control, robust control, reinforcement learning, LQR, MPC]
style: fill
color: light
description: An advanced control note organized around lemmas, theorems, proof sketches, and applications, linking adaptive control, optimal control, robust control, and the role of reinforcement learning in feedback systems.
---

## Scope and Reading Map

This note is the advanced end of the control series. It assumes the reader is already comfortable with the classical ideas in [Control Theory Basics]({% post_url 2019-05-18-control-theory-basics %}), the state-space and MIMO viewpoint in [Modern, Multivariable, and Networked Control]({% post_url 2020-08-18-modern-control-foundations %}), and the Lyapunov geometry in [Topics in Nonlinear Systems]({% post_url 2023-03-18-topics-in-nonlinear-systems %}).

The organization is theorem-driven:

1. Lyapunov and continuation tools used repeatedly in adaptive proofs,
2. linear and nonlinear adaptive control,
3. robust modifications and output-feedback issues,
4. open-loop and feedback optimal control,
5. robust and disturbance-rejection viewpoints,
6. reinforcement learning and agentic decision-making inside control loops.

The goal is not to collect formulas. It is to keep the logic from assumptions to guarantees visible.

## 1. Standing Assumptions and Lyapunov Toolkit

Consider

$$
\dot x = f(t,x,u), \qquad x(t_0)=x_0.
$$

### 1.1 Existence and continuation

**Lemma 1 (Existence and continuation).** Suppose $f$ is piecewise continuous in $t$ and locally Lipschitz in $x$ uniformly on compact sets. Then the initial-value problem admits a unique maximal solution. If the solution remains bounded on $[t_0,T)$, then it can be continued beyond $T$.

**Proof sketch.** Local existence and uniqueness follow from standard Picard-Lindelof arguments. If the state stays in a compact set, the local-Lipschitz bound and continuity assumptions remain valid, so no finite escape can occur at $T$. Therefore the maximal interval cannot terminate there.

This simple continuation argument is the silent engine behind many adaptive-control proofs: first prove boundedness, then infer global existence.

### 1.2 Lyapunov direct method

Let $V(x) \in C^1$ and define

$$
\dot V = \nabla V^\top f.
$$

**Lemma 2 (Lyapunov boundedness and convergence template).** If there exist class-$\mathcal{K}_\infty$ functions $\alpha_1,\alpha_2$ such that

$$
\alpha_1(\|x\|) \le V(x) \le \alpha_2(\|x\|),
$$

and

$$
\dot V \le -W(x)
$$

for some positive semidefinite function $W$, then trajectories remain bounded and converge to the largest invariant set inside $\{x:W(x)=0\}$.

**Proof sketch.** Properness of $V$ gives bounded sublevel sets, so a nonincreasing $V$ prevents finite escape. LaSalle invariance then identifies the asymptotic limit set.

This is the proof skeleton behind state feedback, backstepping, adaptive laws, and robust modifications.

### 1.3 Barbalat and non-autonomous arguments

When adaptation laws or time-varying references make the system non-autonomous, Barbalat's lemma is often more convenient than LaSalle.

**Lemma 3 (Barbalat).** If $g(t)$ is uniformly continuous and $\int_{t_0}^\infty g(\tau)\, d\tau$ exists, then $g(t)\to 0$.

In control proofs, the usual pattern is:

- show $g \in L_2 \cap L_\infty$,
- show $\dot g \in L_\infty$,
- conclude $g(t)\to 0$.

## 2. Linear Adaptive Control: MRAC

### 2.1 Problem setup

Consider the plant

$$
\dot x = A x + Bu,
$$

and a reference model

$$
\dot x_m = A_m x_m + B_m r,
$$

with $A_m$ Hurwitz. Assume exact matching:

$$
\exists \theta^* \text{ such that the ideal controller yields } A_m,B_m.
$$

Let the tracking error be

$$
e=x-x_m.
$$

### 2.2 Main MRAC theorem

**Theorem 1 (Basic MRAC boundedness).** Suppose exact matching holds, $A_m$ is Hurwitz, and the regressor signals are bounded. Then there exists a gradient adaptive law such that all closed-loop signals remain bounded and the tracking error satisfies $e \in L_2 \cap L_\infty$.

One standard construction is:

$$
u = K_x^\top x + K_r^\top r,
$$

with parameter errors $\tilde K_x,\tilde K_r$, and composite Lyapunov function

$$
V = e^\top P e
+ \operatorname{tr}(\tilde K_x^\top \Gamma_x^{-1}\tilde K_x)
+ \operatorname{tr}(\tilde K_r^\top \Gamma_r^{-1}\tilde K_r),
$$

where $P$ solves

$$
A_m^\top P + P A_m = -Q, \qquad Q>0.
$$

Choose

$$
\dot K_x = -\Gamma_x x e^\top P B, \qquad
\dot K_r = -\Gamma_r r e^\top P B.
$$

Then

$$
\dot V = -e^\top Q e \le 0.
$$

**Proof sketch.** Differentiate $V$ along the closed-loop error dynamics. The adaptive laws cancel the cross terms involving parameter errors. What remains is the negative semidefinite term $-e^\top Q e$. Therefore $V$ is bounded and nonincreasing, so $e$ and the parameter errors remain bounded and $e \in L_2$.

### 2.3 What MRAC does not give for free

Bounded tracking error does **not** imply parameter convergence.

**Corollary 1 (Need for excitation).** Parameter convergence requires additional excitation, typically persistent excitation:

$$
\exists \alpha,T>0 \text{ such that }
\int_t^{t+T} \phi(\tau)\phi(\tau)^\top d\tau \ge \alpha I.
$$

Without PE, excellent tracking can coexist with poor parameter identification.

### 2.4 Application example

**Application.** Suppose a motion-control loop has uncertain effective inertia. A fixed controller tuned for one inertia may become sluggish or oscillatory as the payload changes. MRAC adapts the feedback law online so the plant keeps imitating a chosen reference model. The guarantee is tracking boundedness under the structural assumptions, not magic immunity to all uncertainty.

## 3. Robust Adaptive Modifications and Output Feedback

Ideal adaptive control is fragile under noise, unmodeled dynamics, saturation, and poor excitation. Several robust modifications exist.

### 3.1 Sigma-modification

$$
\dot \theta = -\Gamma \phi e - \sigma \theta, \qquad \sigma>0.
$$

The leakage term prevents parameter drift. The typical tradeoff is:

- better robustness,
- weaker asymptotic claims,
- uniform ultimate boundedness instead of exact asymptotic tracking.

### 3.2 e-modification, projection, dead zone, normalization

Useful variants include:

- `e`-modification: leakage scaled by tracking error,
- projection: keep estimates inside a known feasible set,
- dead zone: stop adapting when the error is tiny and mostly noise,
- normalization: scale updates to avoid exploding parameter motion.

These are best viewed as guarantee-adjustment tools. They change the theorem being proved, not only the transient behavior.

### 3.3 Composite adaptation

Composite adaptation augments tracking-error learning with prediction-error learning:

$$
\dot{\hat \theta} = -\Gamma(Y^\top e + W^\top \epsilon_p).
$$

The goal is better parameter convergence without requiring large tracking excursions.

### 3.4 Unknown control direction

When the sign of the control gain is unknown, Nussbaum-gain constructions are often used. They are powerful but more delicate:

- proofs become subtler,
- transients become harder to interpret,
- implementation is less forgiving.

### 3.5 Output feedback and observers

If the full state is unavailable, adaptive control must be combined with estimation.

For linear detectable plants:

$$
\dot{\hat x}=A\hat x+Bu+L(y-C\hat x).
$$

Unlike standard LQG, separation is not perfectly clean in general adaptive nonlinear settings. Estimation error and parameter adaptation can couple in ways that must be handled inside the Lyapunov proof.

## 4. Nonlinear Adaptive Control and Backstepping

Adaptive backstepping merges nonlinear design with parameter learning.

Consider a strict-feedback structure with uncertain parameters:

$$
\dot x_1 = f_1(x_1)+g_1(x_1)x_2,
$$

$$
\dot x_2 = f_2(x)+g_2(x)u + Y(x)^\top \theta^*.
$$

Define

$$
z_1=x_1-x_{1d}, \qquad z_2=x_2-\alpha_1(x_1,\hat \theta).
$$

### 4.1 Theorem template

**Theorem 2 (Adaptive backstepping template).** Suppose the plant is in strict-feedback form, the input gain is nonzero, and the uncertain nonlinearities are linearly parameterized. Then there exists a recursive control law and adaptation law such that the tracking and parameter-error states remain bounded, and the tracking errors converge to zero under standard regularity conditions.

**Proof sketch.** Construct the Lyapunov function recursively:

$$
V_1 = \frac{1}{2} z_1^2,
$$

then augment it to

$$
V_2 = V_1 + \frac{1}{2} z_2^2 + \frac{1}{2}\tilde \theta^\top \Gamma^{-1}\tilde \theta.
$$

Choose the virtual control $\alpha_1$ to stabilize $z_1$, then choose the real input $u$ and adaptation law to cancel cross terms in $\dot V_2$. The resulting derivative becomes negative semidefinite, and boundedness plus convergence follow by LaSalle or Barbalat-type reasoning.

### 4.2 Application example

**Application.** In an underactuated robotic subsystem with uncertain friction or payload parameters, adaptive backstepping lets the controller stabilize the cascaded dynamics while estimating the uncertain coefficients online. This is much more structured than "tune a bigger gain and hope."

## 5. Open-Loop and Feedback Optimal Control

The merged open-loop optimal material lives here because it belongs beside adaptive and feedback-optimal design.

### 5.1 Standard finite-horizon problem

Consider

$$
\min_{u(\cdot)} J = \phi(x(t_f)) + \int_{t_0}^{t_f} L(x,u,t)\, dt
$$

subject to

$$
\dot x = f(x,u,t), \qquad x(t_0)=x_0.
$$

This is the generic optimal-control problem. It can represent:

- minimum energy,
- minimum time,
- tracking with effort penalties,
- constrained trajectory planning.

### 5.2 Pontryagin's minimum principle

Define the Hamiltonian

$$
H(x,u,\lambda,t)=L(x,u,t)+\lambda^\top f(x,u,t).
$$

**Theorem 3 (Pontryagin minimum principle).** If $u^*(t)$ is optimal, then there exists a costate $\lambda(t)$ such that

$$
\dot x = \frac{\partial H}{\partial \lambda}, \qquad
\dot \lambda = -\frac{\partial H}{\partial x},
$$

and

$$
u^*(t) \in \arg\min_u H(x,u,\lambda,t),
$$

with terminal condition determined by the terminal cost.

**Proof sketch.** The argument comes from first-order variations of the cost functional under admissible input perturbations. Stationarity of the augmented functional introduces the costate and yields the canonical state-costate equations together with the Hamiltonian minimization condition.

Pontryagin gives necessary conditions, not automatic sufficiency.

### 5.3 Bang-bang structure

When the control appears linearly in the Hamiltonian and input bounds are active, the minimizing input often sits at an extreme value:

$$
u^*(t) \in \{u_{\min}, u_{\max}\}.
$$

This is the mathematical origin of bang-bang optimal control.

**Application.** For a double integrator with bounded input and a minimum-time objective, the optimal policy switches between maximum acceleration and maximum braking. The structure is simple, but the switching surface is what matters.

### 5.4 HJB viewpoint

The value function $V(x,t)$ satisfies

$$
-\partial_t V = \min_u \left\{ L(x,u,t) + \nabla_x V^\top f(x,u,t) \right\},
$$

with terminal condition

$$
V(x,t_f)=\phi(x).
$$

If a smooth solution exists and the minimizer is well-defined, HJB gives a sufficient route to optimal feedback. Conceptually:

- Pontryagin gives necessary conditions along optimal trajectories,
- HJB gives a global dynamic-programming view through the value function.

## 6. Tractable Optimal Feedback: LQR, LQG, and MPC

### 6.1 LQR theorem

For linear dynamics

$$
\dot x = Ax + Bu
$$

and quadratic cost

$$
J=\int_0^\infty (x^\top Q x + u^\top R u)\, dt,
$$

the optimal control law is

$$
u^*=-Kx, \qquad K=R^{-1}B^\top P,
$$

where $P$ solves

$$
A^\top P + P A - P B R^{-1} B^\top P + Q = 0.
$$

**Theorem 4 (Infinite-horizon LQR).** If $(A,B)$ is stabilizable and $(Q^{1/2},A)$ is detectable with $Q \succeq 0$, $R \succ 0$, then the stabilizing solution of the algebraic Riccati equation yields the optimal state-feedback law.

**Proof sketch.** Insert the quadratic ansatz $V(x)=x^\top P x$ into the HJB equation. Matching coefficients produces the Riccati equation. The minimizing input is the quadratic-completion solution $u=-R^{-1}B^\top Px$.

### 6.2 LQG

LQG combines LQR with Kalman filtering. It is the canonical linear Gaussian observer-based optimal controller:

- LQR solves the control part,
- the Kalman filter solves the estimation part,
- separation connects them cleanly in the LTI Gaussian setting.

### 6.3 MPC

Model Predictive Control repeatedly solves a finite-horizon optimal-control problem online:

1. predict over a horizon,
2. optimize with constraints,
3. apply the first input only,
4. shift the horizon and repeat.

MPC is best understood as open-loop optimal control wrapped inside a feedback architecture.

## 7. Robust Control Viewpoint and Disturbance Rejection

Adaptive control learns uncertain parameters. Robust control guarantees performance against an uncertainty set. They solve related but different problems.

### 7.1 Worst-case design and $H_\infty$

The $H_\infty$ viewpoint asks for a controller that minimizes the worst-case closed-loop gain from disturbances to performance outputs.

High-level interpretation:

- adaptive control says "learn the uncertainty while staying stable,"
- $H_\infty$ says "protect against the worst uncertainty in the modeled set,"
- neither dominates the other universally.

### 7.2 Relation to $\mu$-synthesis

$\mu$-synthesis sharpens robust design for structured uncertainty. It is a deeper multivariable robust-control tool and belongs primarily to the modern multivariable note, but conceptually it sits on the same side of the design map: worst-case guarantees under stated uncertainty structure.

### 7.3 ADRC comparison

Active Disturbance Rejection Control treats mismatch and disturbances as an aggregated disturbance estimated by an extended state observer.

Comparison:

- MRAC adapts parameters tied to a model structure,
- ADRC estimates a lumped disturbance without identifying physical parameters,
- $H_\infty$ encodes disturbance attenuation as a norm-bounded worst-case problem.

ADRC can work very well in practice, but it usually does not provide the same explicit uncertainty-class guarantees as a clean robust-control formulation.

## 8. Reinforcement Learning and Agentic Algorithms in Control

### 8.1 RL as approximate dynamic programming

In discrete time, Bellman recursion writes

$$
V^*(s)=\max_a \left[ r(s,a) + \gamma \sum_{s'} P(s'|s,a)V^*(s') \right].
$$

RL replaces exact dynamic programming with approximation, sampling, and learned policies. In continuous control, actor-critic methods can be interpreted as approximate HJB solvers:

- the critic approximates the value or cost-to-go,
- the actor approximates the minimizing control policy.

### 8.2 Role of RL in control systems

RL is useful when:

- the model is incomplete or expensive to derive,
- the task objective is long-horizon and sequential,
- large amounts of simulation data are available,
- a baseline stabilizing controller already exists.

RL is risky when:

- safety constraints are tight,
- data are scarce,
- exploration itself is dangerous,
- worst-case guarantees matter more than average-case performance.

### 8.3 Stability-aware learning

Modern safe-learning strategies often wrap RL around classical control structure:

- Lyapunov-regularized policy optimization,
- control barrier function or CLF safety filters,
- robust MPC shields,
- model-based RL around a stabilizing nominal controller,
- terminal LQR or backup controllers.

This is where "agentic algorithms" belong in control: not as free-floating agents replacing dynamics, but as planning or learning modules embedded inside a feedback architecture.

### 8.4 Application example

**Application.** In an autonomous vehicle stack, a robust low-level controller keeps the vehicle stable. Above it, an MPC or RL planner chooses speed profiles, lane changes, or interaction policies over a longer horizon. The planner is agentic in the sense that it reasons over future consequences, but it should not be the only thing standing between the plant and instability.

## 9. Comparing Guarantees: Adaptive vs Optimal vs Robust vs RL

Each paradigm answers a different question.

| Paradigm | Main question | Strength | Main weakness |
|---|---|---|---|
| Adaptive control | Can the controller adjust to structured uncertainty online? | explicit Lyapunov-style closed-loop guarantees | weak if the uncertainty class is wrong |
| Optimal control | What is the best control law for the model and cost? | strongest performance interpretation | can be model-sensitive |
| Robust control | What survives worst-case modeled uncertainty? | strong worst-case guarantees | can be conservative |
| RL | What can be learned from data and interaction? | flexible for complex tasks and unknown models | guarantees are weaker unless extra safety structure is added |

The most successful real systems are often hybrids:

1. a stabilizing robust or adaptive inner loop,
2. an optimal or predictive mid-level layer,
3. a learned or planning-based outer loop for long-horizon decisions.

## 10. Proof Checklist and Application Workflow

When writing or reading advanced-control proofs, use this checklist:

1. State the uncertainty class precisely.
2. State regularity assumptions precisely.
3. Define the Lyapunov or value function explicitly.
4. Differentiate it carefully and isolate the cross terms.
5. Show how the control or adaptation law removes or bounds those terms.
6. State clearly whether the conclusion is boundedness, asymptotic tracking, UUB, optimality, or worst-case attenuation.
7. Say what breaks under noise, saturation, sampling, or model mismatch.

When moving from theory to engineering:

1. write the nominal model,
2. decide whether uncertainty is better treated as unknown parameters, bounded disturbance, or stochastic process,
3. choose the design family accordingly,
4. keep a baseline stabilizer,
5. add optimization or learning only where it improves the objective without erasing the safety story.

## 11. Minimal Formula Reference

- Lyapunov equation: $A_m^\top P + P A_m = -Q$.
- MRAC gradient law: $\dot K_x=-\Gamma_x x e^\top P B$, $\dot K_r=-\Gamma_r r e^\top P B$.
- Persistent excitation: $\int_t^{t+T} \phi \phi^\top d\tau \ge \alpha I$.
- PMP Hamiltonian: $H=L+\lambda^\top f$.
- HJB: $-V_t=\min_u\{L+\nabla V^\top f\}$.
- LQR ARE: $A^\top P + P A - P B R^{-1} B^\top P + Q = 0$.

These formulas are only the endpoints of arguments. The real substance is the chain from assumptions to guarantee.
