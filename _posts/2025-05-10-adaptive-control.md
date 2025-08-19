---
title: Adaptive and Optimal Control
tags: [control theory, adaptive control]
style: fill
color: light
description: This is a compact reference, moving from stability of LTI and nonlinear systems to adaptive and robust control, and then to optimal control and reinforcement learning.
---
# Table of Contents

- [1. LTI systems, controllability, observability](#1-lti-systems-controllability-observability)
- [2. IVP, Lipschitz, finite escape time](#2-ivp-lipschitz-finite-escape-time)
- [2a. LTV systems: ẋ = A(t)x + B(t)u, y = C(t)x + D(t)u](#2a-ltv-systems--ẋ--atx--btu-y--ctx--dtu)
- [2b. Existence theorem (f continuous on a rectangle around (x₀,t₀))](#2b-existence-theorem-f-continuous-on-a-rectangle-around-x₀t₀)
- [2c. Existence & uniqueness (piecewise-continuous in t, locally Lipschitz in x)](#2c-existence--uniqueness-piecewise-continuous-in-t-locally-lipschitz-in-x)
- [3. Equilibria, Jacobian, linearization](#3-equilibria-jacobian-linearization)
- [4. Lyapunov basics: psd, pd, candidate, surface, radially unbounded](#4-lyapunov-basics-psd-pd-candidate-surface-radially-unbounded)
- [5. Stability notions for autonomous systems](#5-stability-notions-for-autonomous-systems)
- [6. Invariance principles: LaSalle and Barbalat](#6-invariance-principles-lasalle-and-barbalat)
- [7. Boundedness via V(t) having a finite limit](#7-boundedness-vt-having-a-finite-limit)
- [8. Uniform ultimate boundedness (UUB)](#8-uniform-ultimate-boundedness-uub)
- [9. MRAC (Model Reference Adaptive Control)](#9-mrac-model-reference-adaptive-control)
- [10. Dynamic inversion (feedback linearization)](#10-dynamic-inversion-feedback-linearization)
- [11. Robust control snippets (backstepping, bang-bang, adaptive robustness)](#11-robust-control-snippets-backstepping-bang-bang-adaptive-robustness)
- [12. Observers and the Kalman filter (Luenberger, Kalman)](#12-observers-and-the-kalman-filter-luenberger-kalman)
- [13. Calculus of variations and PMP](#13-calculus-of-variations-and-pmp)
- [14. Bellman principle and HJB](#14-bellman-principle-and-hjb)
- [15. Linear Quadratic Regulator (LQR): continuous and discrete](#15-linear-quadratic-regulator-lqr-continuous-and-discrete)
- [16. Multivariable frequency-domain analysis](#16-multivariable-frequency-domain-analysis)
- [17. Robust output-feedback and H∞](#17-robust-output-feedback-and-h-infinity)
- [18. H∞ control and μ-synthesis (D–K iteration)](#18-h-infinity-control-and-mu-synthesis-d-k-iteration)
- [19. LQG (Linear-Quadratic-Gaussian)](#19-lqg-linear-quadratic-gaussian)
- [20. Optimal control via PMP and Bellman](#20-optimal-control-via-pmp-and-bellman)
- [21. Reinforcement learning (RL) links](#21-reinforcement-learning-rl-links)
- [22. Known vs unknown vs controllable states](#22-known-vs-unknown-vs-controllable-states)
- [23. When V(t) converges and signals are bounded](#23-when-vt-converges-and-signals-are-bounded)
- [24. Quick proof checklist](#24-quick-proof-checklist)
- [25. Minimal formula crib](#25-minimal-formula-crib)


## 1. LTI systems, controllability, observability

State-space model:

$$
\dot x(t)=Ax(t)+Bu(t),\qquad y(t)=Cx(t)+Du(t),\qquad x(0)=x_0.
$$

**Controllability (Kalman):**

$$
\mathcal C=\begin{bmatrix}B&AB&\cdots&A^{n-1}B\end{bmatrix},\quad
\operatorname{rank}(\mathcal C)=n.
$$

**Observability (Kalman):**

$$
\mathcal O=\begin{bmatrix}C\\ CA\\ \vdots\\ CA^{n-1}\end{bmatrix},\quad
\operatorname{rank}(\mathcal O)=n.
$$

**Known vs unknown parameters:** write

$$
\dot x = A(\theta)x + B(\theta)u,\quad \theta\in\mathbb R^p \text{ known or unknown}.
$$

Unknown parameters can be estimated online via adaptation $\hat\theta(t)$.

---

## 2. IVP, Lipschitz, finite escape time

Consider the initial value problem (IVP)

$$
\dot x = f(t,x), \qquad x(t_0)=x_0.
$$


- **Local Lipschitz in \(x\)** on a neighborhood of \((t_0,x_0)\): \(\exists L>0\) with
  
$$
  \|f(t,x)-f(t,y)\| \le L \|x-y\|.
$$

  Ensures a unique solution on some interval \([t_0, t_0+\delta)\).

- **Finite escape time** \(T_e\): the maximal solution may blow up, i.e.
  
$$
  \lim_{t \uparrow T_e} \|x(t)\| = \infty \quad \text{with } T_e<\infty.
$$


- **Global Lipschitz** in \(x\) (uniform in \(t\)) rules out finite escape and ensures global existence for \(t \ge t_0\).

---

## 2a. LTV systems

Linear time-varying (LTV) model:

$$
\dot{x} = A(t)x + B(t)u, \qquad y = C(t)x + D(t)u.
$$

Controllability/observability become time-varying concepts (e.g., via Grammians).

---

## 2b. Existence theorem (continuity on a rectangle)

**Peano existence.** If \(f\) is continuous on a rectangle

$$
\mathcal R = \{(x,t): \|x - x_0\| \le \Gamma,\ \ |t-t_0| \le \tau\},
$$

then at least one solution \(x(t)\) exists on \([t_0, t_0+\epsilon]\subset [t_0, t_0+\tau]\). Uniqueness is not guaranteed.

---

## 2c. Existence and uniqueness (piecewise-continuous in \(t\), locally Lipschitz in \(x\))

**Picard–Lindelöf.** If \(f(\cdot,\cdot)\) is piecewise-continuous in \(t\) and locally Lipschitz in \(x\) on \(\mathcal R\),

$$
\|f(x,t)-f(y,t)\| \le L \|x-y\| \quad \forall (x,y,t)\in\mathcal R,
$$

then there exists a unique solution on some \([t_0, t_0+\delta]\). With global Lipschitz in \(x\), solution is unique for all \(t\ge t_0\).

---

## 3. Equilibria, Jacobian, linearization

**Equilibrium:** $x^\star$ such that $f(x^\star,0)=0$.

**Jacobian:** $J(x)=\dfrac{\partial f}{\partial x}(x)$.

**Linearization around $(x^\star,u^\star)$:**

$$
\dot{\tilde x} = A\tilde x + B\tilde u,\quad
A=\left.\frac{\partial f}{\partial x}\right|*{x^\star,u^\star},\quad
B=\left.\frac{\partial f}{\partial u}\right|*{x^\star,u^\star}.
$$

---

## 4. Lyapunov basics: psd, pd, candidate, surface, radially unbounded

A **Lyapunov candidate** $V:\mathbb R^n\to\mathbb R_{\ge 0}$ with:

- **Positive semidefinite (psd):** $V(x)\ge 0$.
- **Positive definite (pd):** $V(x)>0$ for $x\neq 0$, and $V(0)=0$.
- **Radially unbounded (proper):** $V(x)\to\infty$ as $\|x\|\to\infty$.
- **Lyapunov surface:** level set $\{x: V(x)=c\}$.

Time derivative along trajectories of $\dot x=f(x,u)$:

$$
\dot V(x) = \nabla V(x)^\top f(x,u).
$$

---

## 5. Stability notions for autonomous systems $\dot x=f(x)$

- **Lyapunov stability:** $\forall \varepsilon>0\ \exists \delta>0:\ \|x(0)\|<\delta \Rightarrow \|x(t)\|<\varepsilon,\ \forall t\ge 0.$
- **Asymptotic stability:** stable and $\lim_{t\to\infty}x(t)=0.$
- **Exponential stability:** $\exists M,\alpha>0$ such that

$$
\|x(t)\|\le M e^{-\alpha t}\|x(0)\|,\ \forall t\ge 0.
$$

**Lyapunov theorems (nonlinear):**

- If $V$ is pd and $\dot V\le 0$ (negative semidefinite), then the origin is stable.
- If $V$ pd, radially unbounded, and $\dot V<0$ for $x\neq 0$, then the origin is **globally asymptotically stable**.

**Quadratic Lyapunov for LTI:** $A$ Hurwitz iff $\exists P=P^\top>0$ and $Q=Q^\top>0$ with

$$
A^\top P + P A = -Q,\qquad V=x^\top P x.
$$

---

## 6. Invariance principles: LaSalle and Barbalat

**LaSalle’s Invariance Principle (autonomous $\dot x=f(x)$):**

If $V$ is pd and $\dot V(x)\le 0$, then solutions converge to the largest invariant set contained in

$$
\mathcal S=\{x: \dot V(x)=0\}.
$$

**Non-autonomous case $\dot x=f(t,x)$:** LaSalle does not directly apply. Use **Barbalat’s Lemma**.

**Barbalat’s Lemma:** If $g(t)$ is uniformly continuous and $\int_0^\infty g(t)\,dt<\infty$, then $g(t)\to 0$. Typical application: if

$$
\dot V(t) = -W(x,t),\quad V\ge 0,\quad W\ge 0,\quad \dot W \text{ bounded},
$$

then $W(t)\to 0$ as $t\to\infty$.

---

## 7. Boundedness via $V(t)$ having a finite limit

If $V$ is pd and proper, and $\dot V\le 0$, then $V(t)$ is nonincreasing and bounded below, hence

$$
\lim_{t\to\infty} V(t) = V_\infty \text{ exists and is finite.}
$$

Properness implies **signal boundedness**: $\sup_t \|x(t)\|<\infty$. If additionally $\dot V=-W(x)$ with $W$ pd, then $x(t)\to 0$ (LaSalle for autonomous; Barbalat for certain non-autonomous cases).

---

## 8. Uniform ultimate boundedness (UUB)

A signal $x(t)$ is **UUB** if $\exists b>0$ and $\forall r>0\ \exists T(r)>0$ such that

$$
\|x(0)\|\le r \ \Rightarrow\ \|x(t)\|\le b,\ \forall t\ge T(r).
$$

Lyapunov test (one form): if $\dot V\le -W(x)+\sigma$ with $W$ pd and constant $\sigma\ge 0$, then trajectories enter and remain in $\{x: W(x)\le \sigma\}$.

---

## 9. MRAC (Model Reference Adaptive Control)

**Reference model:**

$$
\dot x_m = A_m x_m + B_m r,\quad A_m \text{ Hurwitz}.
$$

**Plant (uncertain but linearly parameterized):**

$$
\dot x = A x + B u = A_m x + B\theta^{*\top}\phi(x,r),
$$

with regressor $\phi$ and constant unknown $\theta^*$.

**Direct MRAC (MIMO) control:**

$$
u = K_x^\top x + K_r^\top r,\quad \Theta=\{K_x,K_r\}.
$$

**Error dynamics:** $e=x-x_m$. Choose $P>0$ satisfying $A_m^\top P+PA_m=-Q$, $Q>0$.

**Adaptive laws (gradient):**

$$
\dot K_x = -\Gamma_x\, x\, e^\top P B,\qquad
\dot K_r = -\Gamma_r\, r\, e^\top P B,
$$

with $\Gamma_x,\Gamma_r>0$.

**Lyapunov function:**

$$
V = e^\top P e + \operatorname{tr}\!\left[(K_x-K_x^*)^\top \Gamma_x^{-1}(K_x-K_x^*)\right]
- \operatorname{tr}\!\left[(K_r-K_r^*)^\top \Gamma_r^{-1}(K_r-K_r^*)\right].
$$

Then $\dot V\le 0\Rightarrow e\in \mathcal L_\infty$. Projection or $\sigma$-modification ensures parameter boundedness.

**Persistent excitation (PE. for parameter convergence:**

$$
\exists T,\alpha>0:\ \int_t^{t+T}\phi(\tau)\phi(\tau)^\top d\tau \ge \alpha I \ \Rightarrow\ \tilde\Theta\to 0.
$$

---

## 10) Dynamic inversion (feedback linearization)

For $\dot x = f(x)+g(x)u$, output $y=h(x)$. If relative degree $r$ is well-defined and decoupling matrix is invertible, set

$$
u(x,v)=g^\dagger(x)\big(-f(x)+v\big),
$$

so that the internal dynamics seen by $v$ are linearized; pick $v$ to stabilize or track. With uncertainty, add robust terms or adaptive estimates.

---

## 11. Robust control snippets

**Backstepping (strict-feedback):**

$$
\begin{aligned}
\dot x_1 &= f_1(x_1)+g_1(x_1)x_2,\\
\dot x_2 &= f_2(x_1,x_2)+g_2(x_1,x_2)u.
\end{aligned}
$$

Choose virtual control $\alpha(x_1)$, define $z_1=x_1$, $z_2=x_2-\alpha$,

$$
V=\tfrac12 z_1^2+\tfrac12 z_2^2,\quad
u=\frac{1}{g_2}\big(-f_2+\dot\alpha-k_1 z_1-k_2 z_2\big).
$$

Bang-bang (time-optimal under $\|u\|\le u_{\max}$):

$$
u(t)=u_{\max}\,\operatorname{sgn}(s(x)),\quad \text{e.g., } s=\dot x + k x.
$$

**Adaptive robustness (examples):**

$$
\dot\theta = -\Gamma \phi e - \sigma \theta \quad (\sigma>0),\qquad
\dot\theta = -\Gamma \phi e - \Gamma e^2 \theta.
$$

---

## 12. Observers and the Kalman filter

**Luenberger observer:**

$$
\dot{\hat x}=A\hat x+Bu+L(y-C\hat x),\quad \dot e=(A-LC)e.
$$

Pick $L$ so $A-LC$ is Hurwitz.

**Discrete Kalman filter:**

$$
x_{k+1}=A x_k + B u_k + w_k,\ \ w_k\sim\mathcal N(0,Q),\qquad
y_k=C x_k + v_k,\ \ v_k\sim\mathcal N(0,R).
$$

Prediction:

$$
\hat x_{k|k-1}=A\hat x_{k-1|k-1}+B u_{k-1},\quad
P_{k|k-1}=A P_{k-1|k-1}A^\top + Q.
$$

Update:

$$
K_k=P_{k|k-1}C^\top(C P_{k|k-1}C^\top+R)^{-1},\qquad
\hat x_{k|k}=\hat x_{k|k-1}+K_k(y_k-C\hat x_{k|k-1}).
$$

$$
P_{k|k}=(I-K_k C)P_{k|k-1}.
$$

**LQG separation:** Design LQR and Kalman observer independently; combine $u=-K\hat x$.

---

## 13. Calculus of variations and PMP

**Euler–Lagrange equation:**

$$
J[x]=\int_{t_0}^{t_f} L(x,\dot x,t)\,dt,\quad
\frac{d}{dt}\Big(\frac{\partial L}{\partial \dot x}\Big)-\frac{\partial L}{\partial x}=0.
$$

**Optimal control problem:**

$$
\min_{u(\cdot)} J=\phi(x(t_f))+\int_{t_0}^{t_f} L(x,u,t)\,dt,\quad \dot x=f(x,u,t).
$$

**Pontryagin Minimum Principle (PMP):**

$$
H=L+\lambda^\top f,\quad
\dot x=\frac{\partial H}{\partial \lambda},\quad
\dot\lambda=-\frac{\partial H}{\partial x},\quad
u^\star=\arg\min_u H(x,\lambda,u,t).
$$

---

## 14. Bellman principle and HJB

**Bellman’s principle of optimality** implies value function $V(x,t)$ satisfies the **HJB** PDE:

$$
-\frac{\partial V}{\partial t}=\min_u\Big\{L(x,u,t)+\nabla_x V^\top f(x,u,t)\Big\},\quad
V(x,t_f)=\phi(x).
$$

---

## 15. Linear Quadratic Regulator (LQR)

**Continuous-time:**

$$
\dot x=Ax+Bu,\qquad J=\int_0^\infty (x^\top Q x+u^\top R u)\,dt.
$$

Optimal feedback $u^\star=-Kx$ with $K=R^{-1}B^\top P$. The matrix $P=P^\top>0$ solves the algebraic Riccati equation (ARE):

$$
A^\top P + P A - P B R^{-1} B^\top P + Q=0.
$$

**Discrete-time:**

$$
x_{k+1}=A x_k + B u_k,\qquad
J=\sum_{k=0}^{\infty}\big(x_k^\top Q x_k + u_k^\top R u_k\big).
$$

Riccati recursion and gain:

$$
P=A^\top P A - A^\top P B(R+B^\top P B)^{-1}B^\top P A + Q,\qquad
K=(R+B^\top P B)^{-1}B^\top P A.
$$

---

## 16. Multivariable frequency-domain analysis

For MIMO $G(s)$, use singular values $\bar\sigma(G(j\omega))$ for gain margins and loop-shaping. Stability via generalized Nyquist on $\det(I+L(j\omega))$ for $L=G K$.

---

## 17. Robust output-feedback and $H_\infty$

Generalized plant $P$ with exogenous input $w$, measured $y$, control $u$, performance output $z$. Find stabilizing $K$ minimizing

$$
\|T_{zw}(s)\|*\infty = \sup*\omega \bar\sigma\big(T_{zw}(j\omega)\big) < \gamma.
$$

Synthesis via $H_\infty$ Riccati equations or LMIs; use weights to shape sensitivity and complementary sensitivity.

---

## 18. $H_\infty$ control and $\mu$-synthesis

**Structured singular value $\mu$:**

$$
\mu_\Delta(M)=\frac{1}{\min\{\bar\sigma(\Delta): \det(I-M\Delta)=0\}},
$$

with block-diagonal $\Delta$ capturing real/complex parametric and dynamic uncertainties. **D–K iteration** alternates scaling (D) and controller design (K).

---

## 19. LQG (Linear-Quadratic-Gaussian)

Combine LQR with Kalman filter:

$$
u=-K\hat x.
$$

Optimal for linear Gaussian settings with quadratic cost. **Separation principle** holds: estimation and control design can be decoupled.

---

## 20. Optimal control via PMP and Bellman

For linear-quadratic problems, PMP and HJB yield the same Riccati equations. For general nonlinear systems, PMP provides necessary conditions; HJB is sufficient if a smooth value function exists and the minimizer is unique.

---

## 21. Reinforcement learning (RL) links

**Bellman optimality (discrete MDP):**

$$
V^\star(s)=\max_a \Big\{ r(s,a)+\gamma \sum_{s'} P(s'|s,a) V^\star(s')\Big\}.
$$

**Q-learning (model-free):**

$$
Q_{k+1}(s,a)=Q_k(s,a)+\alpha\big[r+\gamma\max_{a'} Q_k(s',a')-Q_k(s,a)\big].
$$

**Policy gradient:**

$$
\nabla_\theta J(\theta)=\mathbb E\big[\nabla_\theta \log \pi_\theta(a|s)\, \hat A(s,a)\big].
$$

Continuous-time RL connects to HJB; actor–critic approximates value function and policy.

---

## 22. Known vs unknown vs controllable states

- **Known state:** full state $x$ measured; use state feedback.
- **Unknown state:** only $y=Cx$ measured; design observer $\hat x$.
- **Controllable subspace:** span of columns of $\mathcal C$. Stabilization requires controllability or stabilizability.

---

## 23. When $V(t)$ converges and signals are bounded

If $V$ is pd and proper, and $\dot V\le 0$, then $V(t)$ converges to a finite limit. Properness implies all closed-loop signals tied to $x$ are bounded. If $\dot V=-W(x)$ with $W$ pd, then $x(t)\to 0$ (use LaSalle for autonomous or Barbalat for non-autonomous with regularity conditions).

---

## 24. Quick proof checklist

1. Pick $V(x)$ (pd, proper).
2. Compute $\dot V$.
3. Show $\dot V\le 0$ or $\dot V\le -W(x)+\sigma$.
4. Apply LaSalle (autonomous), Barbalat (non-autonomous), or UUB bound.

---

### Minimal formula crib

- **ARE (CT-LQR):** $A^\top P+PA-PBR^{-1}B^\top P+Q=0$.
- **Kalman gain:** $K=P^- C^\top(CP^-C^\top+R)^{-1}$.
- **HJB:** $-V_t=\min_u\{L+\nabla V^\top f\}$.
- **Direct MRAC MIMO:** $\dot K_x=-\Gamma_x x e^\top PB,\ \dot K_r=-\Gamma_r r e^\top PB$.
- **Backstepping:** $u=\frac{1}{g_2}(-f_2+\dot\alpha-k_1 z_1-k_2 z_2)$.
- **Bang-bang:** $u=u_{\max}\operatorname{sgn}(s(x))$.
