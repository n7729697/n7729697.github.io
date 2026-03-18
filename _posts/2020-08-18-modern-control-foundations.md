---
title: Modern, Multivariable, and Networked Control
tags: [control theory, modern control, state space, multivariable control, networked control, MPC, LQG, H-infinity, graph theory]
style: fill
color: light
description: A merged modern-control note covering state-space modelling, controllability and observability, observers, MIMO systems, LQG and MPC, robust multivariable control, and graph-theoretic multi-agent coordination.
---

## 1. Why Modern Control Needs More Than Classical Loops

Classical control is strongest when one loop dominates and transfer-function design stays readable. Modern control begins when that picture becomes too narrow:

- the system has many internal states,
- several inputs and outputs interact,
- only part of the state is measured,
- the controller is implemented digitally,
- uncertainty and constraints matter,
- multiple agents must coordinate over a network.

The state-space model is the common language:

$$
\dot x = Ax + Bu, \qquad y = Cx + Du.
$$

It keeps the internal dynamics visible and scales naturally from SISO to MIMO, from single agents to networked teams.

## 2. State-Space Modelling and Realization

### 2.1 What the state means

The state $x(t)$ is the minimal information needed, together with future inputs, to predict future behavior. In the linear time-invariant case:

- $A$ describes the free dynamics,
- $B$ tells how inputs move the state,
- $C$ maps the state to measured outputs,
- $D$ represents direct feedthrough.

### 2.2 From physics to state space

For a mass-spring-damper system

$$
m \ddot q + b \dot q + k q = u,
$$

choose

$$
x_1=q, \qquad x_2=\dot q.
$$

Then

$$
\dot x_1=x_2, \qquad
\dot x_2=-\frac{k}{m}x_1-\frac{b}{m}x_2+\frac{1}{m}u.
$$

The higher-order ODE has become a first-order vector equation. That is the standard modern-control move.

### 2.3 From transfer functions to realization

A transfer function can be realized in many state coordinates. Under zero initial conditions:

$$
G(s)=C(sI-A)^{-1}B+D.
$$

So transfer functions do not disappear in modern control; they sit inside the state-space representation.

The important point is structural:

- transfer functions show the input-output map,
- state-space models show the internal geometry used for feedback, observers, and MIMO design.

## 3. Stability, Controllability, and Observability

### 3.1 Stability from eigenvalues

For

$$
\dot x=Ax,
$$

the natural modes are determined by the eigenvalues of $A$, equivalently the roots of

$$
\det(sI-A)=0.
$$

All eigenvalues in the left half plane imply asymptotic stability.

### 3.2 Controllability

The controllability matrix is

$$
\mathcal{C}=\begin{bmatrix}B & AB & A^2B & \cdots & A^{n-1}B\end{bmatrix}.
$$

If $\operatorname{rank}\mathcal{C}=n$, the pair $(A,B)$ is controllable.

### 3.3 Observability

The observability matrix is

$$
\mathcal{O}=
\begin{bmatrix}
C \\
CA \\
\vdots \\
CA^{n-1}
\end{bmatrix}.
$$

If $\operatorname{rank}\mathcal{O}=n$, the pair $(C,A)$ is observable.

### 3.4 Why these tests matter

These are not cosmetic rank conditions. They answer two design questions:

- can feedback move all unstable or poorly damped modes?
- can measurements reveal the internal modes the controller needs to know?

If the answer is no, pole placement or observer design is structurally blocked before tuning even starts.

## 4. State Feedback, Observers, and the Separation Principle

### 4.1 Full-state feedback

With

$$
u=-Kx+Nr,
$$

the closed-loop system becomes

$$
\dot x=(A-BK)x+BNr.
$$

If $(A,B)$ is controllable, the matrix $K$ can place the closed-loop poles where the design requires.

### 4.2 A structural theorem

**Theorem.** If $(A,B)$ is controllable, then state-feedback pole placement is possible for any desired monic characteristic polynomial of degree $n$.

**Proof sketch.** In controllable coordinates, the system can be written in controllable companion form. In that form, the feedback gain enters the last row directly and therefore changes the closed-loop characteristic polynomial coefficients arbitrarily. Similarity transformations preserve eigenvalues, so the pole assignment result holds in the original coordinates as well.

This theorem is the state-space analogue of what root locus hints at in the scalar case.

### 4.3 Observers

A standard Luenberger observer is

$$
\dot{\hat x}=A\hat x+Bu+L(y-C\hat x).
$$

The estimation error $\tilde x=x-\hat x$ satisfies

$$
\dot{\tilde x}=(A-LC)\tilde x.
$$

If $(C,A)$ is observable, the observer poles can be placed by choosing $L$.

### 4.4 Separation principle

**Proposition.** For LTI systems, if $(A,B)$ is controllable and $(C,A)$ is observable, state-feedback and observer design can be carried out independently.

**Proof sketch.** In augmented coordinates $(x,\tilde x)$, the combined controller-observer dynamics become block upper triangular. The eigenvalues are therefore the union of the controller poles and observer poles. This triangular structure is the algebraic reason the two designs separate.

In practice, noise, saturation, and model error still couple performance. But structurally, the design split is real and powerful.

## 5. Digital Control and Sampled Systems

Real controllers usually run on processors, so discrete-time models matter:

$$
x_{k+1}=A_d x_k+B_d u_k, \qquad y_k=C_d x_k+D_d u_k.
$$

The key shifts are:

- stability moves from the left half plane to the interior of the unit circle,
- sampling period becomes part of the design,
- zero-order hold, discretization, and aliasing matter,
- observer and feedback design can be done directly in discrete time.

This is one reason modern control is inseparable from implementation. The controller is not only a transfer function on paper; it is a real algorithm executed at a real rate.

## 6. MIMO Systems and Multivariable Feedback

The merged multivariable viewpoint starts with the matrix transfer relation

$$
Y(s)=G(s)U(s),
$$

where $G(s)$ is a transfer-function matrix.

### 6.1 Coupling

The main difficulty is interaction:

- one input may move several outputs,
- one output may depend on several inputs,
- improving one channel may worsen another,
- constraints are shared across the full system.

This is why multivariable control is not just "many SISO loops."

### 6.2 Sensitivity in MIMO form

With feedback law described by a matrix controller $F_y(s)$,

$$
S(s)=\left(I+G(s)F_y(s)\right)^{-1},
$$

$$
T(s)=I-S(s).
$$

These matrix-valued functions describe disturbance propagation, model sensitivity, and closed-loop bandwidth just as in SISO design, but now channel interaction matters too.

### 6.3 Pairing and decoupling

Important multivariable questions include:

- which actuator should primarily regulate which output,
- whether decentralized control is enough,
- whether approximate decoupling is possible,
- whether the system is square, overactuated, or underactuated.

State space is usually cleaner than pure transfer-matrix algebra once these questions become serious.

## 7. LQR, LQG, and MPC

### 7.1 LQR

For

$$
\dot x=Ax+Bu
$$

with quadratic cost

$$
J=\int_0^\infty (x^\top Qx+u^\top Ru)\,dt,
$$

the optimal feedback law is

$$
u^*=-Kx, \qquad K=R^{-1}B^\top P,
$$

where $P$ solves the algebraic Riccati equation.

LQR is attractive because:

- state and input penalties are transparent,
- the resulting controller is multivariable by construction,
- it produces a principled speed-versus-effort tradeoff.

### 7.2 LQG

LQG adds a Kalman filter to LQR:

- LQR handles control optimality,
- Kalman filtering handles state estimation under Gaussian stochastic assumptions.

This is the archetypal observer-based optimal controller for linear systems.

### 7.3 MPC

Model Predictive Control repeats the same cycle:

1. predict future behavior over a horizon,
2. solve a constrained optimization problem,
3. apply the first input,
4. measure again and repeat.

MPC is especially natural for MIMO systems because:

- constraints on states and inputs are central,
- coupled predictions are handled natively,
- tuning is expressed through horizons and weights rather than only pole locations.

## 8. Robust Multivariable Control: $H_\infty$, $\mu$, and Uncertainty

Real design never uses a perfect model. Robust control asks what the controller guarantees under bounded uncertainty.

### 8.1 Uncertainty models

Common uncertainty descriptions include:

- additive uncertainty,
- multiplicative uncertainty,
- parametric uncertainty,
- structured block uncertainty.

The point is not to model everything exactly. The point is to state clearly which modeling errors are being protected against.

### 8.2 $H_\infty$ viewpoint

$H_\infty$ control frames design as a worst-case gain minimization problem:

> make the largest closed-loop amplification from disturbance to performance output as small as possible.

This naturally emphasizes:

- disturbance rejection,
- robustness margins,
- weighted sensitivity shaping.

In that sense, $H_\infty$ is a mathematically sharpened version of loop shaping.

### 8.3 $\mu$-synthesis

$\mu$-synthesis extends the robust story to structured uncertainty. The structured singular value $\mu$ measures how close the uncertain closed loop is to instability or poor performance under block-structured perturbations.

High-level interpretation:

- $H_\infty$ treats uncertainty in a more aggregated way,
- $\mu$-synthesis keeps track of structure,
- the price is more analytical and computational complexity.

For many engineers, the conceptual takeaway is enough: robust multivariable design is about guaranteeing performance not only for one nominal plant but for a family of plausible plants.

## 9. Graph-Theoretic and Multi-Agent Control

Modern control also applies when many dynamic agents interact over a communication graph.

### 9.1 Graph language

Let the graph have Laplacian $L$. For single-integrator agents

$$
\dot x_i=u_i,
$$

a basic consensus law is

$$
u_i=-\sum_{j \in \mathcal{N}_i} a_{ij}(x_i-x_j).
$$

Stacking all states gives

$$
\dot x=-(L \otimes I)x.
$$

### 9.2 Consensus lemma

**Lemma.** For a connected undirected graph, the Laplacian $L$ is positive semidefinite and has a simple zero eigenvalue associated with the vector of all ones.

**Proof sketch.** Symmetry gives real eigenvalues. Also

$$
z^\top L z = \frac{1}{2}\sum_{i,j} a_{ij}(z_i-z_j)^2 \ge 0,
$$

so $L$ is positive semidefinite. The nullspace consists of vectors constant on each connected component. If the graph is connected, the nullspace is exactly the span of the all-ones vector.

### 9.3 Consensus theorem

**Theorem.** Under the consensus law above, agents on a connected undirected graph converge to a common state.

**Proof sketch.** Decompose the state into the consensus subspace and disagreement subspace. The disagreement dynamics are governed by strictly positive Laplacian eigenvalues, which create exponential decay. Only the average component remains.

This is the core geometric fact behind consensus, formation maintenance, and cooperative estimation.

### 9.4 Leader-follower, formation, and swarms

Once pure consensus is understood, several extensions become natural:

- **leader-follower** control: some agents track a designated leader trajectory,
- **formation control**: agents stabilize relative positions or distances,
- **swarm and team coordination**: collective objectives emerge from local rules,
- **distributed MPC**: optimization is split across agents that exchange predictions.

These topics sit naturally beside graph Laplacians because the communication structure is part of the control problem.

## 10. Game-Theoretic Control

Not every multi-agent problem is cooperative. Sometimes each controller optimizes its own objective.

That leads to game-theoretic control ideas:

- Nash equilibria,
- differential games,
- dynamic games with coupled costs,
- cooperative versus non-cooperative resource allocation.

The central conceptual shift is simple:

- in standard optimal control there is one decision-maker,
- in game-theoretic control there are many,
- each agent changes the environment seen by the others.

This viewpoint matters in traffic systems, energy systems, autonomous fleets, and adversarial control settings.

## 11. Reading Map Across the Control Series

This note is the bridge between the classical and advanced notes:

- for loop shaping, root locus, Nyquist, and classical compensators, see [Control Theory Basics]({% post_url 2019-05-18-control-theory-basics %}),
- for Lyapunov geometry, backstepping, sliding mode, and nonlinear design, see [Topics in Nonlinear Systems]({% post_url 2023-03-18-topics-in-nonlinear-systems %}),
- for adaptive, optimal, robust, and learning guarantees, see [Adaptive, Optimal, Robust, and Learning Control]({% post_url 2025-05-10-adaptive-control %}).

## 12. Compact Recall Map

Modern control can be reduced to one recurring workflow:

1. write a state-space model,
2. test stability, controllability, and observability,
3. design state feedback and observers,
4. move naturally to MIMO, digital, and optimal control,
5. add uncertainty, constraints, and network structure without changing the core language.

Classical control teaches how to shape one loop well. Modern control teaches how to reason about internal state, coupled channels, uncertainty, and coordinated agents as one system.
