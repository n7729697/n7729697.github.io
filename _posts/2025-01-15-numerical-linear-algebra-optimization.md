---
title: Numerical Linear Algebra and Optimization Notes
tags: [numerical linear algebra, optimization, scientific computing]
style: fill
color: primary
description: Structured notes following a full syllabus from mathematical foundations to convergence theory.
---

## Mathematical Foundations

### 0.1 Vector Spaces and Norms

#### Vector spaces and subspaces

A vector space $V$ over $\mathbb{R}$ (or $\mathbb{C}$) is closed under addition and scalar multiplication. A subset $W\subseteq V$ is a subspace if:

$$
\forall x,y\in W,\; x+y\in W,\qquad \forall \alpha,\; \alpha x\in W.
$$

Examples: column space, null space, row space.

#### Inner products

An inner product $\langle x,y\rangle$ satisfies linearity, symmetry (Hermitian symmetry), and positivity. Induces orthogonality:

$$
x\perp y \iff \langle x,y\rangle=0.
$$

#### Induced norms

Given inner product, norm is

$$
\|x\| = \sqrt{\langle x,x\rangle}.
$$

Common norms: $\ell_1$, $\ell_2$, $\ell_\infty$.

#### Equivalence of norms

In finite dimensions, all norms are equivalent:

$$
\exists c_1,c_2>0:\; c_1\|x\|_a \le \|x\|_b \le c_2\|x\|_a.
$$

Hence convergence does not depend on norm choice (constants do).

#### Orthogonality and projections

Projection of $b$ onto subspace $\mathcal{S}$:

$$
p = \operatorname{argmin}_{s\in\mathcal{S}}\|b-s\|_2.
$$

Residual $r=b-p$ is orthogonal to $\mathcal{S}$.

---

### 0.2 Matrix Analysis

#### Matrix norms (induced, Frobenius)

Induced norm:

$$
\|A\| = \max_{x\ne 0}\frac{\|Ax\|}{\|x\|}.
$$

Frobenius norm:

$$
\|A\|_F = \sqrt{\sum_{ij}a_{ij}^2} = \sqrt{\operatorname{tr}(A^\top A)}.
$$

#### Spectral radius

$$
\rho(A)=\max_i |\lambda_i(A)|.
$$

Always $\rho(A)\le \|A\|$ for any submultiplicative norm.

#### Singular values

Singular values are square roots of eigenvalues of $A^\top A$:

$$
\sigma_i(A)=\sqrt{\lambda_i(A^\top A)}.
$$

#### Condition number

For nonsingular $A$,

$$
\kappa_2(A)=\|A\|_2\|A^{-1}\|_2=\frac{\sigma_{\max}}{\sigma_{\min}}.
$$

#### Positive definite matrices

$A$ is SPD if

$$
A=A^\top,\qquad x^\top A x>0\;\forall x\ne 0.
$$

Equivalent: all eigenvalues positive; Cholesky exists.

---

### 0.3 Numerical Stability

#### Floating point arithmetic model

Standard model:

$$
\operatorname{fl}(a\circ b)=(a\circ b)(1+\delta),\qquad |\delta|\le u,
$$

where $u$ is machine precision.

#### Backward vs forward error

Forward error: $\|\hat x-x\|$. Backward error: minimal perturbation in data making $\hat x$ exact.

#### Conditioning vs stability

Total error = problem sensitivity (conditioning) + algorithm behavior (stability).

#### Perturbation analysis

For $Ax=b$,

$$
\frac{\|\Delta x\|}{\|x\|}
\lesssim
\kappa(A)\left(\frac{\|\Delta A\|}{\|A\|}+\frac{\|\Delta b\|}{\|b\|}\right).
$$

---

## 1. Direct Methods for Linear Systems

### 1.1 Gaussian Elimination

#### LU factorization

Without pivoting: $A=LU$.

With permutation: $PA=LU$.

#### Existence and uniqueness

LU without pivoting exists if all leading principal minors are nonzero. With row pivoting, factorization exists for nonsingular $A$.

#### Computational complexity

Dense solve cost:

- factorization: $\frac{2}{3}n^3 + O(n^2)$,
- triangular solves: $O(n^2)$ each.

#### Round-off error analysis

Computed factors correspond to nearby matrix $A+\Delta A$; stability depends on growth factor.

---

### 1.2 Pivoting Strategies

#### Partial pivoting

Swap rows to maximize pivot magnitude in current column.

#### Complete pivoting

Swap rows and columns to maximize pivot globally in active submatrix.

#### Growth factor

$$
\gamma = \frac{\max_{i,j,k}|a_{ij}^{(k)}|}{\max_{i,j}|a_{ij}|}.
$$

Larger $\gamma$ can amplify roundoff.

#### Stability considerations

Partial pivoting is usually stable in practice; complete pivoting is more robust but more expensive.

---

### 1.3 Cholesky Factorization

#### SPD matrices

If $A$ is SPD, then

$$
A=LL^\top,
$$

with $L$ lower triangular.

#### Derivation

Match entries recursively from $A=LL^\top$.

#### Stability properties

Backward stable for SPD matrices; about half LU cost.

---

### 1.4 QR Factorization

#### Gram–Schmidt (classical and modified)

- CGS: numerically weaker (loss of orthogonality).
- MGS: improved stability.

#### Householder reflections

Stable and standard for dense QR.

#### Givens rotations

Useful for sparse/structured problems and incremental updates.

#### Stability comparison

Householder > MGS > CGS (typically, in finite precision).

---

## 2. Orthogonality and Least Squares

### 2.1 Orthogonal Projections

#### Projection theorem

For closed subspace $\mathcal S$ in Hilbert space, each $b$ decomposes uniquely as

$$
b=p+r,\quad p\in\mathcal S,\; r\perp\mathcal S.
$$

#### Geometric interpretation

Least-squares solution is the orthogonal projection of $b$ onto $\operatorname{col}(A)$.

---

### 2.2 Linear Least Squares

#### Normal equations

$$
A^\top A x = A^\top b.
$$

#### QR-based solution

If $A=QR$, solve

$$
Rx = Q^\top b.
$$

#### Conditioning issues

$$
\kappa(A^\top A)=\kappa(A)^2,
$$

so normal equations can significantly worsen conditioning.

---

### 2.3 Rank Deficiency

#### Pseudoinverse

Minimum-norm least-squares solution:

$$
x^* = A^+b.
$$

#### SVD-based least squares

If $A=U\Sigma V^\top$, then

$$
A^+ = V\Sigma^+U^\top.
$$

Handles rank deficiency robustly.

---

## 3. Eigenvalue Problems

### 3.1 Spectral Theory

#### Eigenvalues and eigenvectors

$$
Ax=\lambda x.
$$

#### Diagonalization

$A=V\Lambda V^{-1}$ when eigenvectors form a basis.

#### Spectral decomposition

For symmetric $A$:

$$
A=Q\Lambda Q^\top,
$$

with orthonormal eigenvectors.

---

### 3.2 Power Iteration

#### Convergence analysis

$$
x_{k+1}=\frac{Ax_k}{\|Ax_k\|}.
$$

Converges to dominant eigenvector if initial vector has nonzero component in that direction.

#### Rate of convergence

Roughly geometric with factor $|\lambda_2/\lambda_1|$.

#### Dependence on spectral gap

Larger gap -> faster convergence.

---

### 3.3 Inverse Iteration

#### Shift-and-invert

Solve

$$
(A-\mu I)y_k=x_k,
$$

then normalize.

#### Rayleigh quotient iteration

Use dynamic shift:

$$
\mu_k=\frac{x_k^\top A x_k}{x_k^\top x_k}.
$$

For symmetric matrices, local cubic convergence.

---

### 3.4 QR Algorithm

#### Hessenberg reduction

Reduce $A$ to Hessenberg form first: $A=QHQ^\top$ (or $Q^*HQ$).

#### Implicit QR

Use shifted QR steps without forming $Q$ explicitly at each stage.

#### Convergence properties

With shifts, practical and robust; delivers Schur form/eigenvalues.

---

### 3.5 Singular Value Decomposition

#### Geometric interpretation

$A$ maps unit sphere to ellipsoid with principal axes $\sigma_i$.

#### Low-rank approximation

Best rank-$k$ approximation:

$$
A_k = \sum_{i=1}^k \sigma_i u_i v_i^\top.
$$

#### Eckart–Young theorem

$$
\|A-A_k\|_2=\sigma_{k+1},\qquad
\|A-A_k\|_F=\left(\sum_{i>k}\sigma_i^2\right)^{1/2}.
$$

---

## 4. Iterative Methods for Linear Systems

### 4.1 Fixed-Point Iterations

#### Convergence criteria

For $x_{k+1}=Tx_k+c$, convergence for all starts iff $\rho(T)<1$.

#### Spectral radius condition

Necessary and sufficient in linear case: $\rho(T)<1$.

---

### 4.2 Jacobi and Gauss–Seidel

#### Iteration matrices

With $A=D-L-U$:

- Jacobi: $x^{k+1}=D^{-1}(L+U)x^k + D^{-1}b$.
- GS: $x^{k+1}=(D-L)^{-1}Ux^k+(D-L)^{-1}b$.

#### Convergence conditions

Guaranteed for strictly diagonally dominant matrices; for SPD, GS converges.

#### Comparison

GS usually converges faster than Jacobi.

---

### 4.3 Successive Over-Relaxation (SOR)

#### Optimal relaxation parameter

SOR update uses $\omega\in(0,2)$; optimal $\omega$ depends on spectrum.

#### Convergence acceleration

Can significantly accelerate GS when $\omega$ is tuned well.

---

### 4.4 Krylov Subspace Methods

#### Krylov subspaces

$$
\mathcal K_k(A,r_0)=\operatorname{span}\{r_0,Ar_0,\dots,A^{k-1}r_0\}.
$$

#### Arnoldi process

Build orthonormal basis for general $A$.

#### Lanczos process

Three-term recurrence for symmetric/Hermitian $A$.

---

### 4.5 Conjugate Gradient Method

#### Derivation from quadratic minimization

For SPD $A$, solve

$$
\min_x \left(\tfrac12 x^\top A x - b^\top x\right).
$$

#### A-orthogonality

Search directions are $A$-conjugate: $p_i^\top A p_j=0$ for $i\neq j$.

#### Convergence bounds

$$
\frac{\|e_k\|_A}{\|e_0\|_A}
\le
2\left(\frac{\sqrt\kappa-1}{\sqrt\kappa+1}\right)^k.
$$

---

### 4.6 GMRES

#### Residual minimization

At step $k$, choose $x_k\in x_0+\mathcal K_k$ minimizing $\|b-Ax_k\|_2$.

#### Restarting

GMRES($m$) limits memory/work but may slow convergence.

#### Computational cost

Per-iteration orthogonalization and storage grow with $k$ unless restarted.

---

## 5. Fundamentals of Optimization

### 5.1 Problem Formulation

#### Unconstrained vs constrained problems

$$
\min_x f(x)\quad\text{vs}\quad
\min_x f(x)\;\text{s.t.}\; g(x)\le0,\; h(x)=0.
$$

#### Convex vs nonconvex

Convex problems admit global optimality from local conditions; nonconvex may have local minima/saddles.

#### First- and second-order conditions

First-order (unconstrained): $\nabla f(x^*)=0$.

Second-order sufficient: $\nabla^2 f(x^*)\succ0$.

---

### 5.2 Convex Analysis

#### Convex sets

$C$ convex iff $\theta x+(1-\theta)y\in C$ for all $x,y\in C$, $\theta\in[0,1]$.

#### Convex functions

$$
f(\theta x+(1-\theta)y)\le \theta f(x)+(1-\theta)f(y).
$$

#### Subgradients

$g\in\partial f(x)$ if

$$
f(y)\ge f(x)+g^\top(y-x),\;\forall y.
$$

#### Strong convexity

$$
f(y)\ge f(x)+\nabla f(x)^\top(y-x)+\frac\mu2\|y-x\|^2.
$$

---

## 6. Unconstrained Optimization

### 6.1 Gradient Descent

#### Derivation

Steepest descent in Euclidean norm:

$$
x_{k+1}=x_k-\alpha_k\nabla f(x_k).
$$

#### Step-size strategies

Constant, diminishing, exact line-search, backtracking.

#### Convergence analysis

For $L$-smooth convex and $\alpha\le 1/L$: $f(x_k)-f^*=O(1/k)$.

For strongly convex: linear convergence.

---

### 6.2 Line Search Methods

#### Exact line search

$$
\alpha_k=\arg\min_{\alpha>0} f(x_k+\alpha p_k).
$$

#### Backtracking

Armijo rule with shrink factor $\beta\in(0,1)$.

#### Wolfe conditions

Sufficient decrease + curvature conditions to ensure robust steps.

---

### 6.3 Newton’s Method

#### Quadratic model

Minimize local model

$$
m_k(p)=f_k+\nabla f_k^\top p+\tfrac12 p^\top \nabla^2 f_k p.
$$

#### Local quadratic convergence

Near solution with Lipschitz Hessian and PD Hessian at optimum.

#### Globalization strategies

Damped Newton, line-search Newton, trust-region Newton.

---

### 6.4 Quasi-Newton Methods

#### Secant condition

$$
B_{k+1}s_k = y_k,
\quad s_k=x_{k+1}-x_k,\; y_k=\nabla f_{k+1}-\nabla f_k.
$$

#### BFGS

Standard positive-definite update when $s_k^\top y_k>0$.

#### L-BFGS

Limited-memory version for large $n$.

---

### 6.5 Trust-Region Methods

#### Model-based steps

$$
\min_{\|p\|\le \Delta_k} m_k(p).
$$

#### Dogleg method

Efficient approximate subproblem solver for PD Hessian models.

#### Convergence properties

Global convergence to first-order critical points under standard assumptions.

---

## 7. Constrained Optimization

### 7.1 Equality-Constrained Problems

#### Lagrange multipliers

$$
\mathcal L(x,\lambda)=f(x)+\lambda^\top h(x).
$$

#### KKT conditions

Stationarity + primal feasibility (+ regularity assumptions).

---

### 7.2 Quadratic Programming

#### Convex QP

$$
\min_x\; \tfrac12 x^\top Qx + c^\top x
\quad\text{s.t.}\quad Ax\le b,
$$

with $Q\succeq0$.

#### Active-set methods

Iteratively guess active constraints and solve equality-constrained subproblems.

---

### 7.3 Interior-Point Methods

#### Barrier methods

Replace inequality constraints using log barriers.

#### Central path

Solutions of barrier problems as parameter $\mu\downarrow 0$.

#### Primal–dual formulation

Solve coupled KKT-like nonlinear systems with Newton steps.

---

### 7.4 Augmented Lagrangian Methods

#### Penalty methods

Add penalty terms to enforce constraints.

#### ADMM framework

Alternating Direction Method of Multipliers for decomposable objectives/constraints.

---

## 8. Large-Scale Optimization

### 8.1 Sparsity and Structure

#### Sparse matrix storage

CSR/CSC and block formats reduce memory and arithmetic.

#### Computational complexity

Exploit sparsity to avoid dense $O(n^3)$ bottlenecks.

---

### 8.2 Stochastic Gradient Methods

#### SGD

$$
x_{k+1}=x_k-\alpha_k g_k,\quad \mathbb E[g_k]=\nabla f(x_k).
$$

#### Variance reduction

SVRG/SAGA-type methods reduce stochastic noise and improve rates.

---

### 8.3 Distributed Optimization

#### Consensus formulation

$$
\min_{x_i}\; \sum_{i=1}^N f_i(x_i)
\quad\text{s.t.}\quad x_i=x_j\;\forall (i,j)\in E.
$$

#### Decomposition methods

Dual decomposition, ADMM, and gradient tracking methods.

---

## 9. Convergence Theory

### 9.1 Rates of Convergence

- Linear: $\|e_{k+1}\|\le c\|e_k\|$, $0<c<1$.
- Superlinear: $\|e_{k+1}\|/\|e_k\|\to 0$.
- Quadratic: $\|e_{k+1}\|\le C\|e_k\|^2$.

### 9.2 Global vs Local Convergence

- Global: convergence from broad initialization set.
- Local: convergence guaranteed only near solution.

### 9.3 Complexity Analysis

Track:

- iteration complexity (e.g., $O(1/k)$, linear rate),
- arithmetic cost per iteration,
- memory complexity,
- wall-clock scaling with problem size and sparsity.

These four dimensions are needed for practical algorithm comparison.
