---
title: Adaptive and Optimal Control
tags: [control theory, adaptive control]
style: fill
color: light
description: PhD-level notes linking Lyapunov-based adaptive control, robustification, optimal control, and reinforcement learning.
---

## Scope and Reading Map

These notes are organized as a proof-oriented path:

1. nonlinear stability tools used repeatedly in adaptive control,
2. linear and nonlinear adaptive designs with explicit assumptions,
3. robustness modifications and what guarantees they change,
4. PMP/HJB optimal control foundations,
5. RL as approximate dynamic programming and where stability gaps appear.

The goal is not formula collection; it is to preserve the logic chain from assumptions to guarantees.

---

## 1. Mathematical Preliminaries for Adaptive Systems

Consider

$$
\dot x = f(t,x,u), \quad x(t_0)=x_0.
$$

### 1.1 Existence, uniqueness, continuation

A standard hypothesis set:

- $f$ piecewise continuous in $t$,
- locally Lipschitz in $x$ uniformly on compact sets.

Then the IVP has a unique maximal solution. If $x(t)$ remains bounded on $[t_0,T)$, continuation extends solution beyond $T$ (no finite escape).

This continuation argument is central in adaptive proofs: we often first show boundedness of all closed-loop signals and then conclude global existence.

### 1.2 Stability notions used later

For equilibrium $x=0$ of autonomous $\dot x=f(x)$:

- Lyapunov stable,
- asymptotically stable,
- globally asymptotically stable (GAS),
- exponentially stable.

For disturbed/adaptive systems, a more realistic notion is **uniform ultimate boundedness (UUB)**.

### 1.3 Lyapunov and invariance tools

Given $V(x) \in C^1$, define

$$
\dot V = \nabla V^\top f.
$$

Typical implications:

- $V$ positive definite and $\dot V\le 0$ -> stability and boundedness.
- $V$ proper and $\dot V\le 0$ -> forward boundedness of $x(t)$.
- LaSalle (autonomous): convergence to largest invariant set inside $\{\dot V=0\}$.
- Barbalat (non-autonomous): if $g\in L_\infty$, $\dot g\in L_\infty$, and $g\in L_1$, then $g(t)\to0$.

Adaptive systems are typically non-autonomous because parameters evolve, so Barbalat-type reasoning appears frequently.

---

## 2. Linear Parametric Uncertainty and MRAC

### 2.1 Matching structure and control objective

For direct MRAC, one common assumption is exact matching:

$$
\dot x = A x + Bu, \quad
\exists\, \theta^*: \; A+ B K_x^{*\top}=A_m,\; BK_r^{*\top}=B_m,
$$

where $(A_m,B_m)$ define desired reference model

$$
\dot x_m = A_m x_m + B_m r,
$$

with $A_m$ Hurwitz.

Control law:

$$
u = K_x^\top x + K_r^\top r.
$$

Define $e=x-x_m$, parameter errors $\tilde K_x=K_x-K_x^*$, $\tilde K_r=K_r-K_r^*$.

Then

$$
\dot e = A_m e + B\left(\tilde K_x^\top x + \tilde K_r^\top r\right).
$$

### 2.2 Lyapunov construction and adaptive law

Let $P=P^\top>0$ solve

$$
A_m^\top P + P A_m = -Q, \quad Q=Q^\top>0.
$$

Choose composite Lyapunov function:

$$
V = e^\top P e
+ \mathrm{tr}(\tilde K_x^\top \Gamma_x^{-1}\tilde K_x)
+ \mathrm{tr}(\tilde K_r^\top \Gamma_r^{-1}\tilde K_r),
$$

with $\Gamma_x,\Gamma_r>0$.

Gradient updates:

$$
\dot K_x = -\Gamma_x x e^\top P B, \qquad
\dot K_r = -\Gamma_r r e^\top P B.
$$

These cancel cross terms and yield

$$
\dot V = -e^\top Q e \le 0.
$$

Hence $e\in L_2\cap L_\infty$, parameters bounded (with projection or leakage if needed), and all closed-loop signals bounded under standard regressor boundedness assumptions.

### 2.3 What does not follow automatically

$e\to0$ does not imply $\tilde K_x,\tilde K_r\to0$. Parameter convergence requires excitation.

A sufficient condition is persistent excitation (PE):

$$
\exists \alpha,T>0:\; \int_t^{t+T} \phi(\tau)\phi(\tau)^\top d\tau \ge \alpha I,
$$

for a regressor $\phi$ built from measured signals (e.g., $[x^\top,r^\top]^\top$). Without PE, parameter drift/plateau can coexist with excellent tracking.

### 2.4 Direct vs indirect MRAC

- Direct: adapt controller parameters directly.
- Indirect: estimate plant parameters, then synthesize control from estimates.

Indirect designs often expose identifiability assumptions more clearly but can be more sensitive to estimator transients.

---

## 3. Robust Adaptive Modifications

Ideal MRAC is fragile under noise, unmodeled dynamics, and actuator limits. Standard fixes:

### 3.1 $\sigma$-modification (leakage)

$$
\dot\theta = -\Gamma \phi e - \sigma \theta, \quad \sigma>0.
$$

Effect: prevents parameter drift and ensures UUB-type guarantees; typically sacrifices exact asymptotic tracking.

### 3.2 $e$-modification

$$
\dot\theta = -\Gamma \phi e - \Gamma_e \|e\|^2 \theta.
$$

Leakage weakens near origin, stronger during transients.

### 3.3 Projection operator

Constrain $\hat\theta\in\Omega$ (known compact convex set). Gives bounded estimates by construction while preserving adaptation direction tangentially on boundary.

### 3.4 Dead-zone and normalization

- dead-zone: freeze adaptation for small $|e|$ to avoid noise chasing,
- normalization: scale update by $1+\|\phi\|^2$ to prevent large steps.

These modifications often change claims from asymptotic tracking to boundedness/UUB with explicit residual sets.

---

## 4. Nonlinear Adaptive Control

### 4.1 Backstepping with parametric uncertainty

For strict-feedback form, define virtual controls recursively, each stage adding a stabilizing term and adaptation law for unknown coefficients. A composite Lyapunov function stacks stage errors and parameter errors.

Template (two-state case):

$$
\dot x_1 = f_1(x_1)+g_1(x_1)x_2,
\qquad
\dot x_2 = f_2(x)+g_2(x)u + Y(x)^\top \theta^*.
$$

Set

$$
z_1 = x_1 - x_{1d}, \quad z_2 = x_2 - \alpha_1(x_1,\hat\theta),
$$

choose $u$ and $\dot{\hat\theta}$ so that

$$
\dot V \le -c_1 z_1^2 - c_2 z_2^2
$$

(up to robust residual terms if uncertainty is unmatched).

### 4.2 Adaptive control with unknown control direction

When sign of control gain is unknown, Nussbaum-gain methods are used. They restore regulation under assumptions but with more delicate proofs and poorer transient predictability.

### 4.3 Composite adaptation

Use both tracking error and prediction error in update law:

$$
\dot{\hat\theta} = -\Gamma\left(Y^\top e + W^\top \epsilon_p\right).
$$

Composite adaptation can speed parameter convergence without large tracking transients, especially when filtered regressor models are available.

---

## 5. Observers and Output Feedback

If full state is unavailable, adaptive output feedback combines observer and adaptation. For linear detectable plants:

$$
\dot{\hat x}=A\hat x+Bu+L(y-C\hat x),\quad \dot e_o=(A-LC)e_o.
$$

Separation is not as clean as LQG in general adaptive nonlinear settings; coupling between estimation and adaptation must be handled in Lyapunov analysis.

Kalman filtering remains optimal (minimum variance) for linear Gaussian models and is often used as an estimation front-end in practical adaptive implementations.

---

## 6. Optimal Control Foundations (PMP and HJB)

Consider

$$
\min_{u(\cdot)} \; J = \phi(x(t_f)) + \int_{t_0}^{t_f} L(x,u,t)dt,
\quad \dot x=f(x,u,t).
$$

### 6.1 PMP (necessary conditions)

Define Hamiltonian:

$$
H(x,u,\lambda,t) = L(x,u,t) + \lambda^\top f(x,u,t).
$$

Then

$$
\dot x = \frac{\partial H}{\partial \lambda},
\quad
\dot\lambda = -\frac{\partial H}{\partial x},
\quad
u^*(t)\in\arg\min_u H.
$$

PMP is necessary (not generally sufficient).

### 6.2 HJB (sufficient under regularity)

Value function $V(x,t)$ satisfies

$$
-\partial_t V = \min_u\{L(x,u,t)+\nabla_x V^\top f(x,u,t)\},
\quad V(x,t_f)=\phi(x).
$$

If a smooth solution exists and minimizer is well-defined, derived policy is optimal.

### 6.3 LQR as the tractable bridge

For linear dynamics and quadratic costs,

$$
\dot x=Ax+Bu,
\quad
J=\int_0^\infty (x^\top Qx + u^\top Ru)dt,
$$

optimal $u^*=-Kx$, with

$$
K=R^{-1}B^\top P,
$$

and $P$ solves ARE:

$$
A^\top P + PA - PBR^{-1}B^\top P + Q = 0.
$$

LQR is often used as a local terminal controller in nonlinear/adaptive architectures.

---

## 7. RL Through the Control-Theoretic Lens

### 7.1 Bellman recursion and approximation

In discrete MDPs:

$$
V^*(s)=\max_a\left[r(s,a)+\gamma\sum_{s'}P(s'|s,a)V^*(s')\right].
$$

Q-learning update:

$$
Q_{k+1}(s,a)=Q_k(s,a)+\alpha\left[r+\gamma\max_{a'}Q_k(s',a')-Q_k(s,a)\right].
$$

This is stochastic approximation to Bellman fixed point.

### 7.2 Continuous-time connection

Continuous-time actor-critic approximates HJB solution:

- critic approximates value (or cost-to-go),
- actor approximates minimizing policy from critic gradient information.

The key gap vs classical adaptive control: finite-sample function approximation errors can violate Lyapunov monotonicity unless explicitly constrained.

### 7.3 Stability-aware RL ideas

Common strategies to recover guarantees:

- Lyapunov-constrained policy updates,
- CLF/CBF-regularized RL,
- robust MPC shield around learned policy,
- two-time-scale adaptation with bounded critic errors.

These methods push RL closer to adaptive/robust control guarantees, but assumptions are usually stronger than in model-based proofs.

---

## 8. Comparing Guarantees: Adaptive vs Optimal vs RL

- Adaptive control: strongest closed-loop stability claims under structural uncertainty assumptions (matching, bounded disturbances, excitation conditions).
- Optimal control: strongest performance optimality when model is known and HJB/PMP assumptions hold.
- RL: strongest flexibility under unknown models and rich function classes, but weakest worst-case stability guarantees unless safety/stability structure is imposed.

In practice, high-performance systems are hybrid:

1. robust/adaptive inner-loop for guaranteed stability,
2. optimal/RL outer-loop for performance tuning and long-horizon objectives.

---

## 9. Proof Checklist for Research-Grade Writeups

1. State uncertainty class precisely (matched/unmatched, parametric/nonparametric).
2. State regularity assumptions (Lipschitz, bounded derivatives, excitation).
3. Define candidate Lyapunov function with explicit definiteness bounds.
4. Derive $\dot V$ and isolate negative terms vs residual terms.
5. Conclude boundedness, convergence, or UUB with exact theorem invoked.
6. If claiming parameter convergence, prove PE/IE condition explicitly.
7. Discuss what changes under noise, saturation, and sampling.

---

## Minimal Formula Reference

- Lyapunov equation: $A_m^\top P+PA_m=-Q$.
- MRAC gradient law: $\dot K_x=-\Gamma_x x e^\top PB$, $\dot K_r=-\Gamma_r r e^\top PB$.
- PE: $\int_t^{t+T}\phi\phi^\top d\tau\ge\alpha I$.
- ARE (LQR): $A^\top P+PA-PBR^{-1}B^\top P+Q=0$.
- HJB: $-V_t=\min_u\{L+\nabla V^\top f\}$.

These formulas are only the endpoints of arguments; the assumptions and Lyapunov/Hamiltonian logic are the substance.
