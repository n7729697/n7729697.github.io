---
title: Modern, Multivariable, and Networked Control
tags: [control theory, modern control, state space, multivariable control, networked control, MPC, LQG, H-infinity, graph theory]
style: fill
color: light
description: A merged modern-control note covering state-space modelling, controllability and observability, observers, MIMO systems, LQG and MPC, robust multivariable control, and graph-theoretic multi-agent coordination.
---

_This note is adapted from course materials for **FEL3210 Multivariable Control** and **FEL3330 Networked and Multi-Agent Control Systems** at **KTH Royal Institute of Technology**, with state-space and digital-control material from **BME4010 Dynamics and Control** at **City University of Hong Kong** (Dr. Lu Liu). Instructors: course teaching staff._

## Central Question

Modern control asks a different question from classical loop shaping: **what internal state, information pattern, and uncertainty model are needed to make a coupled dynamic system behave well?**

Classical design often begins with one transfer function and one loop. Modern control begins with a state model:

$$
\dot x = Ax + Bu, \qquad y = Cx + Du.
$$

This representation keeps internal modes visible. It also scales naturally to sampled controllers, MIMO plants, observers, optimal control, robust design, and networked agents.

{% include figure.html image="/assets/img/posts/modern-control/state-space-design-loop.svg" alt="State-space control workflow from model to structure tests, controller, observer, and validation." caption="Modern control is a workflow: model the state, test structural properties, synthesize controller and observer, then validate against uncertainty and implementation limits." %}

## 1. State-Space Models

The state $x(t)$ is the information needed, together with future inputs, to predict future behavior. In an LTI model:

- $A$ encodes free dynamics and natural modes,
- $B$ encodes actuator authority,
- $C$ encodes what sensors reveal,
- $D$ encodes direct input-output feedthrough.

For a mass-spring-damper system

$$
m\ddot q + b\dot q + kq = u,
$$

choosing $x_1=q$, $x_2=\dot q$ gives

$$
\dot x =
\begin{bmatrix}
0 & 1 \\
-k/m & -b/m
\end{bmatrix}x+
\begin{bmatrix}
0 \\ 1/m
\end{bmatrix}u.
$$

The point is not only algebraic neatness. The state model tells us which physical energy-storage modes exist, how they are coupled, and which ones can be actuated or measured.

### 1.1 What State Space Buys, and What It Does Not

State-space models are the right language for several jobs, and a poor fit for others. Keeping the two lists apart avoids both over-selling and under-learning them.

![Block diagram of a state-space model](https://commons.wikimedia.org/wiki/Special:FilePath/Typical_State_Space_model.svg)
Figure 1. State-space block diagram: the input $u$ enters through $B$, the state derivative $\dot x$ is integrated to $x$, the feedback path $A$ closes the loop, the output is $Cx$, and $D$ is the direct feedthrough. Source: [File:Typical State Space model.svg](https://commons.wikimedia.org/wiki/File:Typical_State_Space_model.svg). License: CC0.

Reading the diagram as equations, the integrator input is $\dot x=Ax+Bu$ and the output is $y=Cx+Du$. Taking Laplace transforms with zero initial state, $sX=AX+BU$ gives $X=(sI-A)^{-1}BU$, so

$$
G(s)=C(sI-A)^{-1}B+D=\frac{C\,\mathrm{adj}(sI-A)\,B}{\det(sI-A)}+D .
$$

The poles are the roots of $\det(sI-A)$ (the eigenvalues of $A$), unless cancelled by zeros of the numerator, which happens exactly for modes that are uncontrollable or unobservable. The following shows why the state is not unique. Substitute $x=Tz$ for any invertible $T$: the new matrices are $\tilde A=T^{-1}AT$, $\tilde B=T^{-1}B$, $\tilde C=CT$, and

$$
\tilde C(sI-\tilde A)^{-1}\tilde B=CT\,\big(sI-T^{-1}AT\big)^{-1}T^{-1}B=CT\,T^{-1}(sI-A)^{-1}T\,T^{-1}B=C(sI-A)^{-1}B ,
$$

so the transfer function (and the eigenvalues) are unchanged while every individual matrix entry has changed.

**Where state space is strongest:**

- time-varying and nonlinear systems, where there is no transfer function at all;
- multiple inputs and outputs, with the whole of matrix theory available (singular values for robustness, eigen-structure, Lyapunov and Riccati equations);
- convex design tools such as linear matrix inequalities;
- internal questions that input-output models hide: controllability, observability, hidden modes, and energy storage.

**Where it adds little for single-loop LTI synthesis, a point practitioners raise often:**

- **The state is not unique.** Any invertible change of coordinates $x=Tz$ gives an equivalent model $(T^{-1}AT,\ T^{-1}B,\ CT)$ with identical eigenvalues, input-output behavior, and transfer function. Only the eigenvalues (and the transfer function) are invariants. A hand-tuned entry of a matrix has no stable meaning, so tuning individual matrix entries is not practical.
- **Parameter count.** An order-$n$ SISO transfer function has about $2n+1$ coefficients; a general state-space model has $n^2+2n$ entries, most of them redundant. Canonical forms remove the redundancy but hide physical meaning.
- **Changing the order is global.** Adding one filter or one more mode is a local factor in a transfer function, while in state space it changes the dimensions of all four matrices and every gain computed from them.
- **Pole placement hides trade-offs.** Choosing closed-loop eigenvalues is algebraically easy, but the cost shows up elsewhere: moving a pole a long way needs large gains and large actuator effort, and moving a pole that sits near a zero (the usual case for lightly damped modes) makes the loop fragile. Frequency-domain shaping makes those costs visible.

The honest summary is that state space has greater expressive power and wider range, but for tuning a single LTI loop the frequency-domain picture is usually the more transparent one. Synthesis in state space (LQR, observers) still ends in a design that must be checked as a loop transfer function.

## 2. Structural Tests: Can We Control and Observe It?

For $\dot x=Ax$, stability follows from eigenvalues of $A$: continuous-time asymptotic stability requires all eigenvalues in the open left-half plane.

Controllability asks whether inputs can move every state direction:

$$
\mathcal{C}=\begin{bmatrix}B & AB & A^2B & \cdots & A^{n-1}B\end{bmatrix}, \qquad
\operatorname{rank}\mathcal{C}=n.
$$

Observability asks whether outputs reveal every internal mode:

$$
\mathcal{O}=
\begin{bmatrix}
C\\
CA\\
\vdots\\
CA^{n-1}
\end{bmatrix}, \qquad
\operatorname{rank}\mathcal{O}=n.
$$

These are design gates. If an unstable mode is uncontrollable, feedback cannot move it. If an important mode is unobservable, an observer cannot reconstruct it from the available measurements.

{% include figure.html image="/assets/img/posts/modern-control/controllability-observability-map.svg" alt="A diagram mapping actuator authority and sensor visibility to controllable and observable state directions." caption="Controllability and observability are geometric questions about which state directions actuators can reach and sensors can distinguish." %}

## 3. Feedback, Observers, and Separation

Full-state feedback uses

$$
u=-Kx+Nr,
$$

which yields closed-loop dynamics

$$
\dot x=(A-BK)x+BNr.
$$

If $(A,B)$ is controllable, the closed-loop poles can be assigned through $K$. **Ackermann's formula** gives the single-input gain for a desired characteristic polynomial $\alpha_d(s)$: $K=\begin{bmatrix}0&\cdots&0&1\end{bmatrix}\mathcal C^{-1}\alpha_d(A)$, where $\mathcal C$ is the controllability matrix. For $A=\begin{bmatrix}0&1\\\\-2&-3\end{bmatrix}$, $B=\begin{bmatrix}0\\\\1\end{bmatrix}$ and desired poles $-4,-5$, it gives $K=\begin{bmatrix}18&6\end{bmatrix}$ (checked numerically). The same gain follows by matching coefficients of $\det(sI-A+BK)$ directly. Moving poles a long way requires large gains.

For asymptotic tracking of a constant reference with output $y=Cx$, choose the feedforward gain so that the steady-state output equals $r$: $N=-\big[C(A-BK)^{-1}B\big]^{-1}$. In the example with $C=\begin{bmatrix}1&0\end{bmatrix}$ this gives $N=20$ and a steady-state output of 1 for $r=1$. Stabilization is the special case $r=0$. This is feedforward cancellation of the DC gain, so it depends on an accurate model; integral action is the robust alternative.

In practice, pole placement is most useful for intuition and small systems; for larger coupled systems, optimal or robust methods often give better-conditioned designs.

When $x$ is not measured directly, a Luenberger observer estimates it:

$$
\dot{\hat x}=A\hat x+Bu+L(y-C\hat x).
$$

The estimation error $\tilde x=x-\hat x$ follows

$$
\dot{\tilde x}=(A-LC)\tilde x.
$$

For LTI systems, the separation principle says controller poles and observer poles can be designed independently when controllability and observability hold. The practical caveat is important: noise, delay, saturation, and model error still couple the designs in implementation.

An observer is the dual of state feedback and should be judged by the loop it produces (bandwidth, margins), not only by how closely $\hat x$ tracks $x$. LQR and the Kalman filter each have good margins alone, yet LQG has no general margin guarantee, particularly when controller and estimator poles are close. Designing the two by different people with separate tuning, as is common with a Kalman filter plus MPC, invites the same fragility; verify the combined loop's sensitivity peak rather than each half. See the [practitioner's perspective]({% post_url 2019-05-18-control-theory-basics %}) in the basics note.

### 3.1 The Observer-Based Compensator as One Transfer Function

With $u=-K\hat x$ and the observer above, the controller seen by the plant is itself a dynamic system:

```
                 u                          y
   r --->(+)--->[ plant: x' = Ax + Bu ]--+--[ y = Cx ]---+---> y
          ^                              |               |
          |                              v               |
          |              +--------[ observer: x^' = A x^ + B u + L (y - C x^) ]
          |              |                x^
          +--- -K  <-----+
```

Eliminating $\hat x$ gives the output-feedback compensator

$$
\dot{\hat x}=(A-BK-LC)\hat x+Ly,\qquad u=-K\hat x
\quad\Longrightarrow\quad
D(s)=K\big(sI-A+BK+LC\big)^{-1}L ,
$$

so the loop gain at the plant input is $D(s)G(s)$, with $G(s)=C(sI-A)^{-1}B$. Two facts follow.

- The closed-loop eigenvalues are those of $A-BK$ together with those of $A-LC$ (separation), because the estimation error $\tilde x=x-\hat x$ obeys $\dot{\tilde x}=(A-LC)\tilde x$ independently of $K$.
- The compensator $D(s)$ has the same order as the plant and contains the plant's dynamics. If the observer is made much faster than the controller, $D(s)$ approaches a lead-like transfer function with a large high-frequency gain, which is the practical cost of fast estimation (noise amplification).

Margins are properties of $D(s)G(s)$, not of $K$ or $L$ separately, so verify the combined loop rather than each half. The detailed margin statements and their assumptions are in [Adaptive, Optimal, Robust, and Learning Control]({% post_url 2025-05-10-adaptive-control %}) (section 7.3).

## 4. MIMO Control Is Not Many Independent SISO Loops

For a multivariable plant,

$$
Y(s)=G(s)U(s),
$$

the entries of $G(s)$ reveal interaction: one actuator can influence several outputs, and one output may need several actuators. Pairing, decoupling, and robustness are therefore structural decisions, not tuning afterthoughts.

The sensitivity functions generalize to matrices:

$$
S(s)=\left(I+G(s)F_y(s)\right)^{-1}, \qquad T(s)=I-S(s).
$$

Good multivariable design balances disturbance rejection, actuator effort, channel interaction, and uncertainty. If decentralized loops are used, the reason should be justified by weak coupling, robust pairing, or implementation constraints rather than convenience.

{% include figure.html image="/assets/img/posts/modern-control/mimo-coupling-sensitivity.svg" alt="MIMO block diagram showing actuator-output coupling and matrix sensitivity functions." caption="MIMO control treats cross-coupling explicitly; sensitivity is matrix-valued, so improvement in one channel can move risk into another." %}

## 5. Optimal and Predictive Control

Linear Quadratic Regulator design chooses $u=-Kx$ to minimize

$$
J=\int_0^\infty (x^\top Qx+u^\top Ru)\,dt.
$$

The matrices $Q$ and $R$ encode a design philosophy: which state deviations are expensive, and how costly actuator effort should be. The gain is obtained from an algebraic Riccati equation.

LQG combines LQR with a Kalman filter. The controller handles optimal regulation, while the estimator handles noisy measurements under linear-Gaussian assumptions.

Model Predictive Control repeatedly solves a constrained finite-horizon problem:

1. predict future state trajectories,
2. optimize inputs subject to constraints,
3. apply the first input,
4. measure again and repeat.

MPC is especially natural for MIMO plants because input bounds, state limits, and coupled dynamics are part of the optimization problem rather than external patches.

Keep the relationship to LQR in view: MPC truncates the infinite horizon, so the closed-form gain $K$ and its optimality are lost unless a terminal cost or constraint restores them, constraints can make the problem infeasible, and online solves cost far more computation. When constraints are inactive MPC behaves much like LQR, so choose it for active constraints and prediction needs, not by default. Also, $Q$ and $R$ are tuning weights rather than physical covariances in practice, and an inaccurate $(A,B)$ means the result is not truly optimal.

{% include figure.html image="/assets/img/posts/modern-control/mpc-receding-horizon.svg" alt="Receding-horizon control diagram showing predicted trajectory, constraints, first input application, and horizon shift." caption="MPC turns control into repeated constrained prediction: optimize a horizon, apply the first move, then shift the horizon after measurement." %}

### 5.1 Model Predictive Control as Truncated LQR

For the discrete plant $x_{k+1}=Ax_k+Bu_k$, finite-horizon LQR minimizes

$$
J=x_N^\top P_Nx_N+\sum_{i=0}^{N-1}\big(x_i^\top Qx_i+u_i^\top Ru_i\big),
$$

and its optimal first-step gain $K_N$ comes from the backward Riccati recursion $P_{i}=Q+A^\top P_{i+1}(A-BK_i)$, $K_i=(R+B^\top P_{i+1}B)^{-1}B^\top P_{i+1}A$, run from $i=N-1$ to $0$. MPC solves the same problem at each sample, adds constraints $u_{min}\le u\le u_{max}$, $x\in\mathcal X$ (so it becomes a quadratic program), applies only the first input, and repeats. The comparison with infinite-horizon LQR is exact:

- with terminal weight $P_N=P_\infty$ (the solution of the algebraic Riccati equation), the first-step gain is $K_N=K_\infty$ **for every horizon $N$**, because the terminal cost already summarizes the cost-to-go;
- with a naive terminal weight $P_N=0$, $K_N\to K_\infty$ only as $N\to\infty$, and short horizons give a different (less aggressive) gain.

A numerical check on a double integrator sampled at $T=0.1$ s, $Q=I$, $R=0.1$: the infinite-horizon gain is $K_\infty=[2.586,\ 3.443]$. With $P_N=P_\infty$ every horizon gives exactly this. With $P_N=0$:

| Horizon $N$ | 2 | 5 | 10 | 20 | 40 |
| --- | --- | --- | --- | --- | --- |
| $K_N$ (first gain) | 0.045 | 0.511 | 1.444 | 2.395 | 2.583 |
| $K_N$ (second gain) | 0.913 | 2.454 | 3.061 | 3.379 | 3.442 |

So a short horizon without a terminal cost throws away most of the gain, which is why MPC needs a terminal cost or terminal constraint (and a long enough horizon) to inherit LQR's properties. When constraints are inactive, MPC with $P_N=P_\infty$ equals LQR; when they are active, the control law is piecewise affine in the state and no longer has a closed form $u=-Kx$, and its stability and margin properties must be argued separately (terminal set, feasibility) rather than borrowed from LQR.

## 6. Robustness, Sampling, and Implementation

Real controllers run on imperfect models and processors. A continuous controller becomes software or firmware with a sampling period, quantization, computation delay, actuator saturation, and sensor noise.

In discrete time,

$$
x_{k+1}=A_d x_k+B_d u_k,\qquad y_k=C_d x_k+D_d u_k,
$$

stability moves from the left-half $s$-plane to the inside of the unit circle in the $z$-plane. Sampling should be chosen from bandwidth, delay margin, sensor noise, and actuator limits, not by a generic rule alone.

There are two routes to a digital controller. **Design by emulation** designs a continuous controller $D(s)$ first and then converts it to a discrete equivalent. Tustin's (bilinear) method substitutes $s\to\frac{2}{T}\frac{1-z^{-1}}{1+z^{-1}}$, which is trapezoidal integration; it maps the stable left half-plane into the unit disk (for $T=0.1$ s, the pole $s=-5+3j$ maps to $|z|\approx0.61$) and warps frequency. The matched pole-zero (MPZ) method maps poles and zeros through $z=e^{sT}$ and then matches DC gain. **Direct discrete design** discretizes the plant (including the zero-order hold, which adds about half a sample of delay) and designs $D(z)$ on $G(z)$. As a rule of thumb from the course, emulation is adequate when the sample rate is about ten to twenty times the closed-loop natural frequency or faster; below that, performance degrades and direct discrete design is preferred. A practical path is to start from an emulated design and tune it in the discrete domain. Discrete-time BIBO stability requires all poles of the transfer function to lie inside the unit circle.

Robust control formalizes uncertainty. $H_\infty$ design minimizes worst-case amplification from disturbances to performance outputs, while structured singular value ideas track block-structured uncertainty. The engineering lesson is broader than any one method: state what model errors are protected against, and validate performance over that model family.

## 7. Networked and Multi-Agent Control

For single-integrator agents

$$
\dot x_i=u_i,
$$

a basic consensus controller is

$$
u_i=-\sum_{j\in\mathcal{N}_i}a_{ij}(x_i-x_j).
$$

Stacking all states gives

$$
\dot x=-(L\otimes I)x,
$$

where $L$ is the graph Laplacian. For a connected undirected graph, $L$ is positive semidefinite and has one zero eigenvalue corresponding to the consensus direction. All disagreement modes decay, so agents converge to a common value.

{% include figure.html image="/assets/img/posts/modern-control/consensus-laplacian-modes.svg" alt="Networked agents decomposed into consensus and disagreement modes governed by Laplacian eigenvalues." caption="Consensus separates into an average mode that remains and disagreement modes that decay according to Laplacian eigenvalues." %}

Leader-follower tracking, formation control, distributed estimation, and cooperative MPC extend this logic by changing the graph, objectives, constraints, or information pattern.

## What This Framework Lets Us Do

Modern control lets us design systems where internal state, coupling, constraints, uncertainty, and network structure matter simultaneously. It is the natural bridge from classical feedback to robotics, power systems, process control, autonomous vehicles, and distributed infrastructure.

## Where the Framework Stops Being Reliable

Linear models are local approximations. If saturation, contact, switching, delays, unmodeled resonances, packet loss, or human interaction dominate behavior, state-space methods still help, but the design must be extended with nonlinear analysis, hybrid models, robust validation, or experiments.

## Where the Subject Leads Next

For loop shaping, root locus, Nyquist, and classical compensators, see [Control Theory Basics]({% post_url 2019-05-18-control-theory-basics %}). For Lyapunov geometry, backstepping, sliding mode, and nonlinear design, see [Topics in Nonlinear Systems]({% post_url 2023-03-18-topics-in-nonlinear-systems %}). For adaptive, optimal, robust, and learning guarantees, see [Adaptive, Optimal, Robust, and Learning Control]({% post_url 2025-05-10-adaptive-control %}).

## Technical and Editorial Audit

- Corrected the emphasis from a list of methods to the causal design chain: model, structural tests, synthesis, robustness, implementation.
- Kept the course attribution in the main body rather than front matter.
- Preserved internal links to the surrounding control-note sequence.
- Added original figures for state-space workflow, structural tests, MIMO sensitivity, MPC, and consensus modes.
- Claims are standard LTI/control facts; exact controller synthesis details require numerical plant data and software verification.

## Main Sources Used in This Note

- K. J. Astrom and R. M. Murray, _Feedback Systems_.
- T. Kailath, _Linear Systems_.
- S. Skogestad and I. Postlethwaite, _Multivariable Feedback Control_.
- D. P. Bertsekas, _Dynamic Programming and Optimal Control_.
- R. Olfati-Saber, J. A. Fax, and R. M. Murray, "Consensus and Cooperation in Networked Multi-Agent Systems."
