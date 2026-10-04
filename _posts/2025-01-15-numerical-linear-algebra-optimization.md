---
title: Numerical Linear Algebra and Optimization Notes
tags: [numerical linear algebra, optimization, scientific computing]
style: fill
color: light
description: Course-style notes that build numerical linear algebra and optimization from first principles, from floating point, norms, conditioning, and stability through LU, Cholesky, QR, SVD, eigenvalue algorithms, Krylov methods, gradient and Newton methods, quasi-Newton, nonlinear least squares, KKT conditions, and stochastic optimization, each with worked numerical examples.
---

_This is a personal synthesis of numerical linear algebra and optimization, written as course notes. It follows the order and spirit of Trefethen and Bau's "Numerical Linear Algebra" for the first half and Nocedal and Wright's "Numerical Optimization" for the second, with material from Golub and Van Loan, Saad, and Boyd and Vandenberghe. I have not attached a university course code because the source notes did not identify one._

## How to Read These Notes

Numerical linear algebra and optimization answer one practical question: **how do we compute reliable answers when exact algebra is too expensive, the data are noisy, and every arithmetic operation rounds?** The two subjects belong together. Almost every optimization algorithm spends its time solving linear systems or least-squares problems, and many linear algebra problems are best understood as optimization problems (least squares, the Rayleigh quotient, conjugate gradients).

The notes are organized in five parts. Each section starts from a small example that you can compute by hand (every number in the examples has been checked in Python), then generalizes. Two ideas run through everything:

1. **Conditioning** is a property of the *problem*: how much the answer moves when the data move.
2. **Stability** is a property of the *algorithm*: whether it gives the exact answer to a nearby problem.

Accuracy is roughly conditioning times stability. Keep that sentence in mind and most of the subject falls into place.

{% include figure.html image="/assets/img/posts/numerical-linear-algebra-optimization/numerical-decision-map.svg" alt="Decision map linking problem structure, conditioning, algorithm choice, stability, and validation." caption="Scientific computing begins by matching problem structure to an algorithm, then checking conditioning, stability, and residual evidence." %}

| Part | Sections | Core question |
|---|---|---|
| I. Foundations | 1-4 | What can go wrong with numbers? |
| II. Linear systems and least squares | 5-7 | How do we solve $Ax=b$ and $\min\lVert Ax-b\rVert$ reliably? |
| III. Eigenvalues | 8 | How do we compute $Ax=\lambda x$ without the characteristic polynomial? |
| IV. Iterative methods | 9-10 | What if $A$ is huge and sparse? |
| V. Optimization | 11-17 | How do we minimize functions, with and without constraints? |

## Part I. Foundations

## 1. Why Numerical Computation Is Different

### 1.1 A System That Looks Harmless

Solve

$$
\begin{bmatrix}1&1\\1&1.0001\end{bmatrix}
\begin{bmatrix}x_1\\x_2\end{bmatrix}=
\begin{bmatrix}2\\2.0001\end{bmatrix}.
$$

Subtracting the first equation from the second gives $0.0001\,x_2=0.0001$, so $x=(1,1)$. Now change the right-hand side in the fifth significant digit, to $(2,\ 2.0002)$. The same steps give $0.0001\,x_2=0.0002$, so $x_2=2$ and $x_1=0$. A change of $0.0001$ in the data changed the answer completely.

Nothing went wrong with the arithmetic. The *problem* is sensitive: the two rows are nearly parallel, so their intersection point slides a long way when one line moves slightly. If the data came from a measurement with error $10^{-4}$, the solution is essentially unknown. No algorithm can fix that. This is **conditioning**, and section 3 makes it quantitative.

### 1.2 Floating-Point Numbers

Computers store real numbers in binary scientific notation,

$$
x=\pm(1.b_1b_2\ldots b_{52})_2\times 2^{e},
$$

which is IEEE double precision: 52 stored fraction bits (53 significant bits including the leading 1) and an exponent range of about $10^{\pm308}$. Between 1 and 2 the representable numbers are spaced $2^{-52}\approx2.2\times10^{-16}$ apart. Two constants matter:

- **machine epsilon** $\epsilon_{\text{mach}}=2^{-52}\approx2.22\times10^{-16}$, the gap between 1 and the next double;
- **unit roundoff** $u=2^{-53}\approx1.11\times10^{-16}$, the maximum relative error of rounding to nearest.

So doubles carry about 16 significant decimal digits. Familiar consequences:

```python
>>> 0.1 + 0.2
0.30000000000000004
>>> 0.1 + 0.2 == 0.3
False
```

Neither 0.1 nor 0.2 is exactly representable in binary (just as 1/3 is not in decimal), and the rounding errors do not cancel.

### 1.3 The Fundamental Axiom

All of rounding-error analysis rests on one model. For each basic operation $\circ\in\lbrace+,-,\times,\div\rbrace$, the computed result is the exact result, rounded:

$$
\mathrm{fl}(a\circ b)=(a\circ b)(1+\delta),\qquad \lvert\delta\rvert\le u.
$$

Each single operation is accurate to a relative error $u$. Errors become dangerous only when they are **amplified**, and the two amplifiers are ill-conditioned problems and unstable algorithms.

### 1.4 Catastrophic Cancellation

Subtracting two nearly equal numbers exposes their rounding errors. Compute $1-\cos x$ for $x=10^{-8}$. The true value is about $x^2/2=5\times10^{-17}$. But $\cos(10^{-8})=1-5\times10^{-17}$ rounds to exactly $1$ in double precision, so the computed result is $0$: **every digit is lost**. Rewriting with the identity $1-\cos x=2\sin^2(x/2)$ avoids the subtraction and gives $5.0\times10^{-17}$, correct to full precision.

The quadratic formula has the same trap. The roots of $x^2-10^8x+1=0$ are about $10^8$ and $10^{-8}$. The textbook formula for the small root,

$$
x_-=\frac{10^8-\sqrt{10^{16}-4}}{2},
$$

subtracts two numbers that agree in their first 16 digits. In double precision it returns $7.45\times10^{-9}$, a 25% error. The stable alternative uses Vieta's relation $x_+x_-=c$: compute the large root without cancellation, then $x_-=1/x_+=1.0\times10^{-8}$, correct to all digits.

### What to Remember

- Doubles have about 16 significant digits; unit roundoff $u\approx1.1\times10^{-16}$.
- One operation is accurate; danger comes from amplification.
- Subtracting nearly equal numbers loses digits. Reformulate to avoid it.

## 2. Norms: Measuring Size

To talk about "small errors" we need to measure vectors and matrices.

### 2.1 Vector Norms

For $x\in\mathbb R^n$:

$$
\lVert x\rVert_1=\sum_i\lvert x_i\rvert,\qquad
\lVert x\rVert_2=\Big(\sum_i x_i^2\Big)^{1/2},\qquad
\lVert x\rVert_\infty=\max_i\lvert x_i\rvert.
$$

For $x=(3,-4)$: $\lVert x\rVert_1=7$, $\lVert x\rVert_2=5$, $\lVert x\rVert_\infty=4$. All norms on $\mathbb R^n$ are equivalent up to constants depending on $n$, for example $\lVert x\rVert_\infty\le\lVert x\rVert_2\le\sqrt n\,\lVert x\rVert_\infty$, so "small" means the same thing in each, up to those constants.

### 2.2 Matrix Norms

A matrix is an operator, so the natural norm measures its largest stretching factor:

$$
\lVert A\rVert=\max_{x\neq0}\frac{\lVert Ax\rVert}{\lVert x\rVert}.
$$

This **induced norm** satisfies $\lVert Ax\rVert\le\lVert A\rVert\lVert x\rVert$ and $\lVert AB\rVert\le\lVert A\rVert\lVert B\rVert$. For the common vector norms it has closed forms:

- $\lVert A\rVert_1$ = maximum absolute **column** sum;
- $\lVert A\rVert_\infty$ = maximum absolute **row** sum;
- $\lVert A\rVert_2=\sigma_{\max}(A)$, the largest singular value, which is the square root of the largest eigenvalue of $A^\top A$.

The **Frobenius norm** $\lVert A\rVert_F=\big(\sum_{ij}a_{ij}^2\big)^{1/2}$ is not induced, but is easy to compute and satisfies $\lVert A\rVert_2\le\lVert A\rVert_F$.

**Worked example.** For $$A=\begin{bmatrix}1&-2\\3&4\end{bmatrix}$$:

- $\lVert A\rVert_1=\max(1+3,\ 2+4)=6$;
- $\lVert A\rVert_\infty=\max(1+2,\ 3+4)=7$;
- $\lVert A\rVert_F=\sqrt{1+4+9+16}=\sqrt{30}\approx5.477$;
- $$A^\top A=\begin{bmatrix}10&10\\10&20\end{bmatrix}$$ has eigenvalues $15\pm\sqrt{125}$, i.e. $26.18$ and $3.82$, so $\lVert A\rVert_2=\sqrt{26.18}\approx5.117$.

### What to Remember

- Induced norms measure maximum stretch; they are submultiplicative.
- 1-norm: column sums. $\infty$-norm: row sums. 2-norm: largest singular value.

## 3. Conditioning: How Sensitive Is the Problem?

### 3.1 The Condition Number of a Problem

Think of a problem as a function $f$ from data $x$ to answer $f(x)$. Its **relative condition number** is the worst-case ratio of relative output change to relative input change, for small perturbations:

$$
\kappa=\lim_{\varepsilon\to0}\ \sup_{\lVert\delta x\rVert\le\varepsilon}
\frac{\lVert f(x+\delta x)-f(x)\rVert/\lVert f(x)\rVert}{\lVert\delta x\rVert/\lVert x\rVert}
=\frac{\lVert J(x)\rVert\,\lVert x\rVert}{\lVert f(x)\rVert},
$$

where $J$ is the Jacobian of $f$. Small $\kappa$ (say up to 100) means **well-conditioned**; huge $\kappa$ means **ill-conditioned**.

**Examples.**

- $f(x)=\sqrt x$: $J=\frac{1}{2\sqrt x}$, so $\kappa=\frac{(1/(2\sqrt x))\,x}{\sqrt x}=\frac12$. Square roots are very well conditioned.
- $f(x_1,x_2)=x_1-x_2$: using the 1-norm, $\kappa=\frac{\lvert x_1\rvert+\lvert x_2\rvert}{\lvert x_1-x_2\rvert}$, which is enormous when $x_1\approx x_2$. **Cancellation is an ill-conditioned problem**, not a bug in subtraction.

### 3.2 Conditioning of Linear Systems

Perturb the right-hand side of $Ax=b$: $A(x+\delta x)=b+\delta b$, so $\delta x=A^{-1}\delta b$ and $\lVert\delta x\rVert\le\lVert A^{-1}\rVert\lVert\delta b\rVert$. Also $\lVert b\rVert\le\lVert A\rVert\lVert x\rVert$. Dividing,

$$
\frac{\lVert\delta x\rVert}{\lVert x\rVert}\le
\underbrace{\lVert A\rVert\,\lVert A^{-1}\rVert}_{\kappa(A)}\ \frac{\lVert\delta b\rVert}{\lVert b\rVert}.
$$

A similar argument for perturbations of $A$ gives, to first order,

$$
\frac{\lVert\delta x\rVert}{\lVert x\rVert}\lesssim\kappa(A)\left(\frac{\lVert\delta A\rVert}{\lVert A\rVert}+\frac{\lVert\delta b\rVert}{\lVert b\rVert}\right).
$$

In the 2-norm, $\kappa_2(A)=\sigma_{\max}/\sigma_{\min}$, the ratio of the largest to the smallest stretching. A singular matrix has $\kappa=\infty$.

**Back to section 1.1.** The matrix $$\begin{bmatrix}1&1\\1&1.0001\end{bmatrix}$$ has eigenvalues about $2.00005$ and $0.00005$ (it is symmetric, so these are its singular values), so $\kappa_2\approx4\times10^4$. The perturbation had $\lVert\delta b\rVert/\lVert b\rVert\approx0.0001/2.83\approx3.5\times10^{-5}$. The bound allows a relative change in $x$ of up to $4\times10^4\times3.5\times10^{-5}\approx1.4$; the observed change was $\lVert(-1,1)\rVert/\lVert(1,1)\rVert=1$. The bound is nearly attained.

{% include figure.html image="/assets/img/posts/numerical-linear-algebra-optimization/conditioning-vs-stability.svg" alt="Diagram separating conditioning as problem sensitivity from stability as algorithm behavior." caption="Conditioning belongs to the problem; stability belongs to the algorithm. Both shape the final error." %}

### 3.3 Rule of Thumb: Digits Lost

If the data are known to relative accuracy $u\approx10^{-16}$, the answer is known to about $\kappa\,u$. So **you lose about $\log_{10}\kappa$ digits**. The Hilbert matrix $H_{ij}=1/(i+j-1)$ of size 10 has $\kappa_2\approx1.6\times10^{13}$. Solving $H_{10}x=b$ in double precision, with $b$ chosen so the exact solution is all ones, returns a solution with errors around $10^{-4}$: only 3-4 correct digits, exactly as predicted.

### What to Remember

- $\kappa=\lVert J\rVert\lVert x\rVert/\lVert f(x)\rVert$ measures the problem's sensitivity.
- For linear systems $\kappa(A)=\lVert A\rVert\lVert A^{-1}\rVert=\sigma_{\max}/\sigma_{\min}$.
- Expect to lose about $\log_{10}\kappa$ digits, whatever algorithm you use.

## 4. Stability: Is the Algorithm Trustworthy?

### 4.1 Forward and Backward Error

Let an algorithm compute $\tilde y$ as an approximation to $y=f(x)$.

- The **forward error** is $\lVert\tilde y-y\rVert$: how wrong the answer is.
- The **backward error** is the smallest $\lVert\delta x\rVert$ such that $\tilde y=f(x+\delta x)$ exactly: how much we would have to change the *data* to make the computed answer exact.

Backward error is the more useful question. Our data already contain measurement and rounding errors of size about $u$. If the algorithm's backward error is of the same size, the algorithm has done as well as the data deserve.

### 4.2 Backward Stability

An algorithm is **backward stable** if, for every input $x$, the computed $\tilde y$ equals $f(\tilde x)$ for some $\tilde x$ with $\lVert\tilde x-x\rVert/\lVert x\rVert=O(u)$. In words: **it gives exactly the right answer to nearly the right question.**

Examples:

- Floating-point addition, subtraction, multiplication, division: backward stable, directly from the fundamental axiom.
- The inner product $x^\top y$: backward stable (each term's rounding can be pushed back onto the entries of $x$).
- The outer product $xy^\top$: *not* backward stable. The computed matrix is generally not exactly rank one, so it is not the exact outer product of any nearby vectors. It is still accurate entry by entry. Backward stability is a strong property, and not every useful algorithm has it.

### 4.3 The Fundamental Theorem of Error Analysis

Combine the definitions. If the algorithm is backward stable, $\tilde y=f(\tilde x)$ with relative perturbation $O(u)$, and the conditioning definition bounds how much $f$ can move:

$$
\frac{\lVert\tilde y-y\rVert}{\lVert y\rVert}\lesssim\kappa\cdot O(u).
$$

**Forward error ≲ condition number × backward error.** This is the precise form of "accuracy = conditioning × stability". It tells you where to look when a result is wrong: either the problem is ill-conditioned (reformulate, regularize, or get better data) or the algorithm is unstable (choose a better algorithm).

### 4.4 An Unstable Algorithm for a Well-Conditioned Problem

Compute $e^{-20}\approx2.06\times10^{-9}$ by summing the Taylor series $\sum_k(-20)^k/k!$. The problem is well-conditioned. But the terms grow to about $4.3\times10^7$ (at $k=20$) before decaying, alternating in sign. Each large term carries a rounding error of about $4.3\times10^7\times10^{-16}\approx4\times10^{-9}$, larger than the answer. In double precision the sum is $6.15\times10^{-9}$, three times the true value. The stable algorithm computes $e^{20}$ by the same series (all terms positive, no cancellation) and takes the reciprocal, giving $2.0611536\times10^{-9}$, correct to all digits.

### What to Remember

- Backward stable = exact answer for slightly perturbed data.
- Forward error ≲ $\kappa$ × backward error.
- A wrong answer means an ill-conditioned problem or an unstable algorithm; the fixes differ.

## Part II. Linear Systems and Least Squares

## 5. Gaussian Elimination Is LU Factorization

### 5.1 Elimination by Hand

Take

$$
A=\begin{bmatrix}2&1&1\\4&3&3\\8&7&9\end{bmatrix}.
$$

Eliminate below the first pivot: subtract $2\times$ row 1 from row 2 and $4\times$ row 1 from row 3:

$$
\begin{bmatrix}2&1&1\\0&1&1\\0&3&5\end{bmatrix}.
$$

Eliminate below the second pivot: subtract $3\times$ row 2 from row 3:

$$
U=\begin{bmatrix}2&1&1\\0&1&1\\0&0&2\end{bmatrix}.
$$

The **multipliers** we used (2, 4, and 3) are exactly the entries of a unit lower triangular matrix

$$
L=\begin{bmatrix}1&0&0\\2&1&0\\4&3&1\end{bmatrix},
$$

and you can check that $LU=A$. For example, row 3 of $LU$ is $4\cdot(2,1,1)+3\cdot(0,1,1)+1\cdot(0,0,2)=(8,7,9)$. **Gaussian elimination is the factorization $A=LU$.**

### 5.2 Solving with the Factors

To solve $Ax=b$, write $L(Ux)=b$ and solve two triangular systems. With $b=(4,10,24)$:

- **Forward substitution** $Ly=b$: $y_1=4$, $y_2=10-2\cdot4=2$, $y_3=24-4\cdot4-3\cdot2=2$.
- **Back substitution** $Ux=y$: $x_3=2/2=1$, $x_2=2-1=1$, $x_1=(4-1-1)/2=1$.

So $x=(1,1,1)$, and indeed $A(1,1,1)^\top=(4,10,24)^\top$.

### 5.3 Cost

At step $k$, elimination updates an $(n-k)\times(n-k)$ submatrix with one multiply and one subtract per entry, about $2(n-k)^2$ flops. Summing,

$$
\sum_{k=1}^{n}2(n-k)^2\approx\frac{2}{3}n^3\ \text{flops}.
$$

Each triangular solve costs about $n^2$ flops. So **factor once ($O(n^3)$), then solve for many right-hand sides cheaply ($O(n^2)$ each)**. This is why you should never compute $A^{-1}$ explicitly to solve a system: it costs more and is less accurate.

### 5.4 Why We Must Pivot

Consider, with $\varepsilon=10^{-20}$,

$$
A=\begin{bmatrix}\varepsilon&1\\1&1\end{bmatrix},\qquad b=\begin{bmatrix}1\\2\end{bmatrix},
$$

whose exact solution is very close to $(1,1)$. The matrix is perfectly well-conditioned ($\kappa\approx2.6$). Eliminate without row exchanges: the multiplier is $1/\varepsilon=10^{20}$, and

$$
u_{22}=1-10^{20}\ \xrightarrow{\ \mathrm{fl}\ }\ -10^{20}.
$$

The "1" has been rounded away. Then $y_2=2-10^{20}\to-10^{20}$, $x_2=1$, and $x_1=(1-x_2)/\varepsilon=0$. The computed solution $(0,1)$ is completely wrong for a well-conditioned problem: **elimination without pivoting is unstable**. The culprit is the tiny pivot, which produced a huge multiplier, which swamped the other entries.

Swap the rows first. The pivot is now 1, the multiplier is $\varepsilon$, $u_{22}=1-\varepsilon\to1$, and back substitution gives $x_2=1$, $x_1=2-1=1$. Correct.

### 5.5 Partial Pivoting

**Partial pivoting** chooses, at each step, the row with the largest entry in the pivot column and swaps it into the pivot position. All multipliers then satisfy $\lvert l_{ij}\rvert\le1$. The result is a factorization

$$
PA=LU,
$$

where $P$ is a permutation matrix recording the swaps.

How stable is it? The backward error is bounded in terms of the **growth factor** $\rho=\max_{ij}\lvert u_{ij}\rvert/\max_{ij}\lvert a_{ij}\rvert$. In the worst case $\rho=2^{n-1}$ (Wilkinson constructed such matrices), which would be disastrous for large $n$. In practice, for matrices arising in applications, growth is almost always modest, and Gaussian elimination with partial pivoting is the standard dense solver. Trefethen and Bau call it "explosively unstable in theory, stable in practice", one of the curious facts of numerical analysis.

{% include figure.html image="/assets/img/posts/numerical-linear-algebra-optimization/direct-solver-selection.svg" alt="Solver selection tree choosing LU, Cholesky, QR, or SVD based on matrix structure and rank." caption="Direct solver choice follows matrix structure: general matrices use LU, SPD matrices use Cholesky, least-squares problems use QR or SVD." %}

### What to Remember

- Gaussian elimination computes $A=LU$; the multipliers fill $L$.
- Factor in $\frac23n^3$ flops, solve in $n^2$. Never form $A^{-1}$ to solve a system.
- Small pivots make huge multipliers; partial pivoting ($PA=LU$) fixes this in practice.

## 6. Cholesky Factorization

### 6.1 Symmetric Positive Definite Matrices

A symmetric matrix is **positive definite** (SPD) if $x^\top Ax>0$ for all $x\neq0$. Equivalent tests: all eigenvalues are positive; all leading principal minors are positive. SPD matrices are everywhere: covariance matrices, stiffness matrices, Hessians at strict minima, normal equations $A^\top A$ with independent columns.

### 6.2 The Factorization

Every SPD matrix has a unique factorization $A=LL^\top$ with $L$ lower triangular with positive diagonal. To derive it, compare entries of $A$ and $LL^\top$ column by column. For a $2\times2$ example,

$$
\begin{bmatrix}4&2\\2&3\end{bmatrix}=
\begin{bmatrix}l_{11}&0\\l_{21}&l_{22}\end{bmatrix}
\begin{bmatrix}l_{11}&l_{21}\\0&l_{22}\end{bmatrix}
=\begin{bmatrix}l_{11}^2&l_{11}l_{21}\\l_{11}l_{21}&l_{21}^2+l_{22}^2\end{bmatrix}.
$$

So $l_{11}=\sqrt4=2$, $l_{21}=2/2=1$, $l_{22}=\sqrt{3-1}=\sqrt2$. In general,

$$
l_{jj}=\Big(a_{jj}-\sum_{k<j}l_{jk}^2\Big)^{1/2},\qquad
l_{ij}=\frac{1}{l_{jj}}\Big(a_{ij}-\sum_{k<j}l_{ik}l_{jk}\Big)\quad(i>j).
$$

### 6.3 Why Prefer Cholesky

- **Half the cost** of LU: about $\frac13n^3$ flops, because symmetry is exploited.
- **No pivoting needed** and backward stable: the entries of $L$ are bounded by $\sqrt{a_{jj}}$, so there is no growth.
- **A free test for positive definiteness**: if the algorithm tries to take the square root of a non-positive number, the matrix was not SPD. Optimization codes use this to check whether a Hessian is positive definite.

### What to Remember

- SPD: $x^\top Ax>0$. Cholesky $A=LL^\top$ costs $\frac13n^3$, needs no pivoting, and tests definiteness.

## 7. Least Squares, QR, and the SVD

### 7.1 Fitting a Line

Fit a line $y=c_0+c_1t$ to the points $(0,1)$, $(1,2)$, $(2,2)$, $(3,4)$. Four equations, two unknowns:

$$
\underbrace{\begin{bmatrix}1&0\\1&1\\1&2\\1&3\end{bmatrix}}_{A}
\begin{bmatrix}c_0\\c_1\end{bmatrix}\approx
\underbrace{\begin{bmatrix}1\\2\\2\\4\end{bmatrix}}_{b}.
$$

No line passes through all four points, so we minimize the sum of squared residuals $\lVert Ax-b\rVert_2^2$.

### 7.2 The Geometry: Orthogonal Projection

$Ax$ ranges over the column space $\mathrm{range}(A)$, a plane in $\mathbb R^4$. The closest point to $b$ in that plane is the **orthogonal projection** of $b$. At the optimum, the residual $r=b-Ax$ is perpendicular to every column of $A$:

$$
A^\top(b-Ax)=0\quad\Longleftrightarrow\quad A^\top Ax=A^\top b.
$$

These are the **normal equations**. For our data, $$A^\top A=\begin{bmatrix}4&6\\6&14\end{bmatrix}$$ and $$A^\top b=\begin{bmatrix}9\\18\end{bmatrix}$$. Solving, $c_0=0.9$ and $c_1=0.9$. The residuals are $(0.1,\ 0.2,\ -0.7,\ 0.4)$, and you can check that they sum to zero and that $0\cdot0.1+1\cdot0.2+2\cdot(-0.7)+3\cdot0.4=0$: the residual is orthogonal to both columns, as the geometry demands.

### 7.3 The Danger of the Normal Equations

Forming $A^\top A$ squares the condition number:

$$
\kappa_2(A^\top A)=\kappa_2(A)^2.
$$

If $\kappa(A)=10^8$, then $\kappa(A^\top A)=10^{16}$ and the normal equations may have no correct digits, even though the least-squares problem itself only loses about 8. A classic example (Läuchli):

$$
A=\begin{bmatrix}1&1\\ \varepsilon&0\\0&\varepsilon\end{bmatrix},\qquad
A^\top A=\begin{bmatrix}1+\varepsilon^2&1\\1&1+\varepsilon^2\end{bmatrix}.
$$

With $\varepsilon=10^{-8}$, $\varepsilon^2=10^{-16}$ is below the unit roundoff relative to 1, so $1+\varepsilon^2$ rounds to $1$ and the computed $A^\top A$ is exactly singular, although $A$ has full rank. The information was destroyed by forming the product.

### 7.4 QR Factorization

Any $m\times n$ matrix with $m\ge n$ and full column rank can be written $A=QR$, where $Q$ is $m\times n$ with orthonormal columns ($Q^\top Q=I$) and $R$ is $n\times n$ upper triangular. Orthogonal matrices preserve lengths, so

$$
\lVert Ax-b\rVert_2^2=\lVert QRx-b\rVert_2^2=\lVert Rx-Q^\top b\rVert_2^2+\lVert(I-QQ^\top)b\rVert_2^2.
$$

The second term does not depend on $x$, and the first is zero when

$$
Rx=Q^\top b,
$$

an upper triangular system. No squaring of the condition number occurs: QR-based least squares is backward stable.

### 7.5 Computing QR

**Gram-Schmidt** orthogonalizes the columns one at a time: subtract from column $j$ its components along the previous $q$'s, then normalize. Classical Gram-Schmidt loses orthogonality badly in floating point when columns are nearly dependent; **modified Gram-Schmidt** (subtract the components one at a time from the running vector) is much better, but still not perfect.

**Householder reflections** are the standard. A reflector

$$
H=I-2\frac{vv^\top}{v^\top v}
$$

is symmetric and orthogonal, and maps a vector $x$ onto a multiple of $e_1$ if we choose $v=x+\mathrm{sign}(x_1)\lVert x\rVert e_1$. (The sign choice avoids cancellation in $v_1$.)

**Worked example.** $x=(3,4)$, $\lVert x\rVert=5$, so $v=(3+5,\ 4)=(8,4)$. Then $v^\top x=40$, $v^\top v=80$, and

$$
Hx=x-2\frac{v^\top x}{v^\top v}v=(3,4)-(8,4)=(-5,0).
$$

The reflector zeroed the second entry. Applying such reflectors column by column, each zeroing everything below the diagonal, turns $A$ into $R$; the product of the reflectors is $Q^\top$. Cost: about $2mn^2-\frac23n^3$ flops, and the computed $Q$ is orthogonal to working precision.

**Givens rotations** zero one entry at a time with a $2\times2$ rotation. They are useful for sparse or structured matrices and for updating a factorization when a row is added.

### 7.6 The Singular Value Decomposition

Every $m\times n$ matrix has a factorization

$$
A=U\Sigma V^\top,
$$

with $U$ ($m\times m$) and $V$ ($n\times n$) orthogonal and $\Sigma$ diagonal with entries $\sigma_1\ge\sigma_2\ge\cdots\ge0$. The SVD always exists, even for rank-deficient or rectangular matrices.

**Geometric meaning.** $A$ maps the unit sphere to a hyperellipse. The right singular vectors $v_i$ are the directions that map to the ellipse's principal axes; the left singular vectors $u_i$ are those axes; the singular values $\sigma_i$ are their lengths: $Av_i=\sigma_iu_i$.

**Worked example.** $$A=\begin{bmatrix}3&0\\4&5\end{bmatrix}$$. Then $$A^\top A=\begin{bmatrix}25&20\\20&25\end{bmatrix}$$ with eigenvalues $45$ and $5$, eigenvectors $(1,1)/\sqrt2$ and $(-1,1)/\sqrt2$. So $\sigma_1=\sqrt{45}=3\sqrt5\approx6.708$, $\sigma_2=\sqrt5\approx2.236$, and $\kappa_2(A)=3$. The left vectors follow from $u_i=Av_i/\sigma_i$: $u_1=(1,3)/\sqrt{10}$, $u_2=(-3,1)/\sqrt{10}$.

**Uses.**

- **Rank and conditioning.** The numerical rank is the number of singular values above a tolerance; $\kappa_2=\sigma_1/\sigma_n$.
- **Pseudoinverse and rank-deficient least squares.** $A^+=V\Sigma^+U^\top$, where $\Sigma^+$ inverts the nonzero $\sigma_i$. Then $x=A^+b$ is the least-squares solution of *minimum norm*, which is the sensible choice when the solution is not unique.
- **Best low-rank approximation (Eckart-Young).** Truncating to $A_k=\sum_{i\le k}\sigma_iu_iv_i^\top$ gives the closest rank-$k$ matrix: $\lVert A-A_k\rVert_2=\sigma_{k+1}$. This underlies PCA, compression, and denoising.
- **Regularization.** The least-squares solution is $x=\sum_i\frac{u_i^\top b}{\sigma_i}v_i$. Small $\sigma_i$ amplify noise in $b$. **Tikhonov regularization** minimizes $\lVert Ax-b\rVert^2+\lambda^2\lVert x\rVert^2$, which replaces $1/\sigma_i$ by the filter $\sigma_i/(\sigma_i^2+\lambda^2)$, damping exactly the noisy directions.

### 7.7 Which Least-Squares Method?

| Method | Cost | Accuracy | Use when |
|---|---|---|---|
| Normal equations + Cholesky | $mn^2+\frac13n^3$ | loses $2\log_{10}\kappa$ digits | $A$ well-conditioned, speed critical |
| Householder QR | $2mn^2-\frac23n^3$ | loses about $\log_{10}\kappa$ digits | the default |
| SVD | several times QR | best; handles rank deficiency | ill-conditioned or rank-deficient $A$ |

### What to Remember

- Least squares = orthogonal projection; residual ⟂ range($A$).
- Normal equations square $\kappa$; QR does not. Householder QR is the default.
- The SVD reveals rank, conditioning, the pseudoinverse, best low-rank approximations, and how to regularize.

## Part III. Eigenvalues

## 8. Computing Eigenvalues

### 8.1 Why Not the Characteristic Polynomial?

In a linear algebra course, eigenvalues are roots of $\det(A-\lambda I)$. Numerically this is a bad idea twice over. First, by Abel's theorem there is no formula for roots of polynomials of degree 5 or more, so *any* eigenvalue algorithm for general matrices must be iterative. Second, polynomial roots can be extremely sensitive to the coefficients (Wilkinson's famous example: perturbing one coefficient of $(x-1)(x-2)\cdots(x-20)$ by $2^{-23}$ turns ten real roots complex), while the eigenvalues of the original matrix may be perfectly well-conditioned. Forming the polynomial throws the good conditioning away.

### 8.2 Power Iteration

The simplest idea: multiply a vector by $A$ repeatedly. Write the starting vector in the eigenvector basis, $x_0=\sum_jc_jv_j$, with $\lvert\lambda_1\rvert>\lvert\lambda_2\rvert\ge\cdots$. Then

$$
A^kx_0=\lambda_1^k\Big(c_1v_1+\sum_{j\ge2}c_j\big(\tfrac{\lambda_j}{\lambda_1}\big)^kv_j\Big).
$$

The other components die out like $\lvert\lambda_2/\lambda_1\rvert^k$, so the normalized iterates converge to $v_1$, provided $c_1\neq0$.

**Worked example.** $$A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$$ has eigenvalues 3 and 1 with eigenvectors $(1,1)$ and $(1,-1)$. Start from $x_0=(1,0)$: $Ax_0=(2,1)$, $A^2x_0=(5,4)$, $A^3x_0=(14,13)$. The direction approaches $(1,1)$; the error shrinks by a factor $\lambda_2/\lambda_1=1/3$ per step. The **Rayleigh quotient** $r(x)=\frac{x^\top Ax}{x^\top x}$ estimates the eigenvalue: $r(x_0)=2$, $r(Ax_0)=2.8$, $r(A^2x_0)=2.976$, $r(A^3x_0)=2.997$. For symmetric matrices the Rayleigh quotient error is *quadratic* in the vector error, so it converges twice as fast as the vector.

### 8.3 Inverse Iteration and Rayleigh Quotient Iteration

Power iteration is slow when $\lvert\lambda_2/\lambda_1\rvert\approx1$, and it only finds the dominant eigenvalue. **Shift and invert**: $(A-\mu I)^{-1}$ has eigenvalues $1/(\lambda_j-\mu)$, which is huge for the eigenvalue closest to the shift $\mu$. Power iteration on $(A-\mu I)^{-1}$ (implemented by solving a linear system with a pre-factored matrix each step) converges rapidly to the eigenvector nearest $\mu$. This is **inverse iteration**.

If we update the shift every step with the current Rayleigh quotient, we get **Rayleigh quotient iteration**, which for symmetric matrices converges *cubically*: the number of correct digits roughly triples per step.

### 8.4 The QR Algorithm

The workhorse for all eigenvalues of a dense matrix is deceptively simple:

$$
A_k=Q_kR_k\ \ (\text{QR factorization}),\qquad A_{k+1}=R_kQ_k.
$$

Since $A_{k+1}=Q_k^\top A_kQ_k$, every iterate is similar to $A$ and has the same eigenvalues. Under mild conditions $A_k$ converges to upper triangular form (the Schur form), with the eigenvalues on the diagonal. Why? The QR algorithm is secretly power iteration applied to a whole basis at once (simultaneous iteration), with orthogonalization to keep the vectors independent; the last column also performs inverse iteration.

The practical algorithm adds three ingredients:

1. **Hessenberg reduction.** First reduce $A$ by Householder similarity transforms to upper Hessenberg form (zero below the first subdiagonal), or tridiagonal form if $A$ is symmetric. This costs $O(n^3)$ once, and makes each QR step cost only $O(n^2)$ (or $O(n)$ for tridiagonal).
2. **Shifts.** Factor $A_k-\mu_kI$ instead of $A_k$, with a shift $\mu_k$ near an eigenvalue (the Wilkinson shift). This turns the convergence quadratic or cubic.
3. **Deflation.** When a subdiagonal entry becomes negligible, split the problem into two smaller ones.

With these, each eigenvalue takes only a few iterations, and the total cost is $O(n^3)$, roughly $10n^3$ flops for all eigenvalues and eigenvectors of a general matrix. This is what `numpy.linalg.eig` and MATLAB's `eig` call (via LAPACK).

### 8.5 Sensitivity of Eigenvalues

**Symmetric matrices are benign.** By Weyl's theorem, $\lvert\lambda_i(A+E)-\lambda_i(A)\rvert\le\lVert E\rVert_2$: eigenvalues move no more than the perturbation.

**Nonsymmetric matrices can be wild.** The matrix $$\begin{bmatrix}0&1\\ \varepsilon&0\end{bmatrix}$$ has eigenvalues $\pm\sqrt\varepsilon$. A perturbation of size $\varepsilon=10^{-10}$ moves the eigenvalues (from 0) by $10^{-5}$, amplified by a factor of $10^5$. Defective and highly non-normal matrices have ill-conditioned eigenvalues, and for them pseudospectra are more informative than eigenvalues.

### What to Remember

- Eigenvalue algorithms must iterate; never go through the characteristic polynomial.
- Power iteration converges at rate $\lvert\lambda_2/\lambda_1\rvert$; shifts and inversion focus on any eigenvalue; RQI is cubic.
- The QR algorithm (Hessenberg + shifts + deflation) finds all eigenvalues in $O(n^3)$.
- Symmetric eigenvalues are well-conditioned; nonsymmetric ones may not be.

## Part IV. Iterative Methods for Large Sparse Systems

## 9. Sparse Systems and Classical Iterations

### 9.1 Where Large Sparse Systems Come From

Discretize the 1D Poisson problem $$-u''(t)=f(t)$$ on $[0,1]$ with $u(0)=u(1)=0$ on a grid of spacing $h=1/(n+1)$. The second derivative becomes $-(u_{i-1}-2u_i+u_{i+1})/h^2$, giving the tridiagonal system

$$
\frac{1}{h^2}\begin{bmatrix}2&-1\\-1&2&-1\\&\ddots&\ddots&\ddots\\&&-1&2\end{bmatrix}u=f.
$$

Only $3n$ of the $n^2$ entries are nonzero. In 2D and 3D, PDE matrices have a handful of nonzeros per row but millions of rows. Dense LU would need $O(n^2)$ memory and $O(n^3)$ time, and even sparse LU suffers **fill-in**: the factors have many more nonzeros than $A$. Iterative methods only need to multiply by $A$, which costs $O(\text{nnz})$.

**Storage.** Sparse matrices are stored in formats such as CSR (compressed sparse row). For

$$
A=\begin{bmatrix}5&0&0&1\\0&8&0&0\\0&0&3&0\\0&6&0&4\end{bmatrix},
$$

CSR stores three arrays:

```text
values  = [5, 1, 8, 3, 6, 4]     # nonzeros, row by row
col_idx = [0, 3, 1, 2, 1, 3]     # their column indices
row_ptr = [0, 2, 3, 4, 6]        # row i occupies values[row_ptr[i]:row_ptr[i+1]]
```

and a matrix-vector product is a single loop over the nonzeros:

```python
def csr_matvec(values, col_idx, row_ptr, x):
    y = [0.0] * (len(row_ptr) - 1)
    for i in range(len(y)):
        for k in range(row_ptr[i], row_ptr[i + 1]):
            y[i] += values[k] * x[col_idx[k]]
    return y
```

### 9.2 Splitting Methods

Split $A=M-N$ where $M$ is easy to invert. Then $Ax=b$ becomes $Mx=Nx+b$, suggesting the iteration

$$
x_{k+1}=M^{-1}(Nx_k+b).
$$

The error $e_k=x_k-x$ satisfies $e_{k+1}=M^{-1}Ne_k$, so $e_k=(M^{-1}N)^ke_0$. **The iteration converges for every starting vector if and only if the spectral radius $\rho(M^{-1}N)<1$**, and $\rho$ is the asymptotic error reduction per step.

Writing $A=D+L+U$ (diagonal, strictly lower, strictly upper):

- **Jacobi**: $M=D$. Each component is updated from the old values of the others.
- **Gauss-Seidel**: $M=D+L$. Use new values as soon as they are computed.
- **SOR**: $M=\frac1\omega D+L$, over-relaxing Gauss-Seidel by a factor $\omega\in(0,2)$.

**Worked example.** $$A=\begin{bmatrix}4&1\\1&3\end{bmatrix}$$, $b=(1,2)$, exact solution $x=(1/11,\ 7/11)\approx(0.0909,\ 0.6364)$. Jacobi from $x_0=0$:

$$
x_1=\Big(\tfrac{1-0}{4},\ \tfrac{2-0}{3}\Big)=(0.25,\ 0.667),\qquad
x_2=\Big(\tfrac{1-0.667}{4},\ \tfrac{2-0.25}{3}\Big)=(0.083,\ 0.583).
$$

The Jacobi iteration matrix is $$-D^{-1}(L+U)=\begin{bmatrix}0&-1/4\\-1/3&0\end{bmatrix}$$ with $\rho=\sqrt{1/12}\approx0.289$, so each step gains about half a digit. For this matrix Gauss-Seidel has $\rho=1/12\approx0.083$, twice as fast in digits per step.

### 9.3 Why Classical Iterations Are Not Enough

For the 1D Poisson matrix, $\rho_{\text{Jacobi}}=\cos(\pi h)\approx1-\frac{\pi^2h^2}{2}$. With $n=1000$ unknowns, $\rho\approx1-5\times10^{-6}$, and reducing the error by $10^{-6}$ takes millions of iterations. The classical methods damp high-frequency error quickly but low-frequency error very slowly. Two remedies dominate modern practice: **Krylov methods** (next section) and **multigrid**, which uses coarse grids to kill the smooth error components.

### What to Remember

- Sparse matrices: store and multiply in $O(\text{nnz})$; avoid fill-in.
- Splitting iterations converge iff $\rho(M^{-1}N)<1$.
- Jacobi and Gauss-Seidel are simple but slow on PDE problems; they are building blocks (smoothers, preconditioners).

## 10. Krylov Subspace Methods

### 10.1 The Krylov Idea

If all we can do with $A$ is multiply vectors by it, then after $k$ multiplications starting from the residual $r_0=b-Ax_0$, the vectors available span the **Krylov subspace**

$$
\mathcal K_k(A,r_0)=\mathrm{span}\lbrace r_0,\ Ar_0,\ A^2r_0,\ \ldots,\ A^{k-1}r_0\rbrace.
$$

Krylov methods choose the "best" approximation $x_k\in x_0+\mathcal K_k$. Why should this work? By the Cayley-Hamilton theorem, $A^{-1}$ is a polynomial in $A$ of degree less than $n$, so the exact solution lies in $x_0+\mathcal K_n$. The hope, often realized, is that a good approximation appears long before $k=n$.

Equivalently, $r_k=p_k(A)r_0$ for some polynomial $p_k$ of degree $k$ with $p_k(0)=1$. A Krylov method is good when there is a low-degree polynomial that is small on the eigenvalues of $A$ while equal to 1 at the origin. Clustered eigenvalues, away from zero, make that easy.

{% include figure.html image="/assets/img/posts/numerical-linear-algebra-optimization/krylov-subspace-growth.svg" alt="Krylov subspace growing from residual through repeated matrix-vector products and approximating a solution." caption="Krylov methods build useful low-dimensional search spaces from repeated matrix-vector products, which is why they scale to sparse systems." %}

### 10.2 Arnoldi and GMRES

The raw Krylov vectors $A^jr_0$ quickly become nearly parallel (they all converge toward the dominant eigenvector, as in power iteration), so we need an orthonormal basis. The **Arnoldi process** is Gram-Schmidt applied as the space grows: it produces orthonormal $q_1,\ldots,q_{k+1}$ and a $(k+1)\times k$ upper Hessenberg matrix $\tilde H_k$ with

$$
AQ_k=Q_{k+1}\tilde H_k.
$$

**GMRES** picks $x_k\in x_0+\mathcal K_k$ that minimizes the residual norm $\lVert b-Ax_k\rVert_2$. Writing $x_k=x_0+Q_ky$, the relation above reduces this to a tiny $(k+1)\times k$ least-squares problem $\min_y\lVert\beta e_1-\tilde H_ky\rVert$, solved by QR (section 7). GMRES works for any nonsingular $A$. Its weakness is cost: storing $k$ basis vectors and orthogonalizing against all of them grows with $k$, so in practice one uses **restarted GMRES(m)**, which throws the basis away every $m$ steps (at some cost in convergence).

For symmetric $A$, the Hessenberg matrix becomes tridiagonal and Arnoldi becomes the **Lanczos process**, with short three-term recurrences. Lanczos is also the method of choice for a few extreme eigenvalues of large symmetric matrices.

### 10.3 Conjugate Gradients

For SPD $A$, solving $Ax=b$ is equivalent to minimizing the quadratic

$$
\phi(x)=\tfrac12x^\top Ax-b^\top x,
$$

because $\nabla\phi(x)=Ax-b=-r$, and the Hessian $A$ is positive definite. This links linear algebra to optimization.

**Steepest descent** would move along $-\nabla\phi=r$. On elongated level sets it zigzags (section 12 shows why). **Conjugate gradients** instead chooses search directions that are **$A$-conjugate**, $p_i^\top Ap_j=0$ for $i\neq j$. Minimizing along conjugate directions never spoils the minimization along previous ones, so after $k$ steps $x_k$ minimizes $\phi$ over all of $x_0+\mathcal K_k$. Remarkably, each new conjugate direction can be computed from the current residual and the previous direction alone:

```text
r0 = b - A x0,  p0 = r0
for k = 0, 1, 2, ...
    alpha_k = (r_k' r_k) / (p_k' A p_k)
    x_{k+1} = x_k + alpha_k p_k
    r_{k+1} = r_k - alpha_k A p_k
    beta_k  = (r_{k+1}' r_{k+1}) / (r_k' r_k)
    p_{k+1} = r_{k+1} + beta_k p_k
```

One matrix-vector product and a few vector operations per step; only four vectors stored.

**Worked example.** $$A=\begin{bmatrix}4&1\\1&3\end{bmatrix}$$, $b=(1,2)$, $x_0=0$.

- $r_0=p_0=(1,2)$, $Ap_0=(6,7)$, $\alpha_0=\frac{5}{20}=0.25$, so $x_1=(0.25,\ 0.5)$ and $r_1=(1,2)-0.25(6,7)=(-0.5,\ 0.25)$.
- $\beta_0=\frac{0.3125}{5}=0.0625$, $p_1=(-0.5,0.25)+0.0625(1,2)=(-0.4375,\ 0.375)$, $Ap_1=(-1.375,\ 0.6875)$, $\alpha_1=\frac{0.3125}{0.859375}=\frac{4}{11}$.
- $x_2=(0.25,0.5)+\frac{4}{11}(-0.4375,\ 0.375)=(1/11,\ 7/11)$.

Exact after $n=2$ steps, as the theory promises in exact arithmetic.

**Convergence.** In the $A$-norm $\lVert e\rVert_A=\sqrt{e^\top Ae}$,

$$
\frac{\lVert e_k\rVert_A}{\lVert e_0\rVert_A}\le2\left(\frac{\sqrt\kappa-1}{\sqrt\kappa+1}\right)^k.
$$

Compare steepest descent, whose factor is $\frac{\kappa-1}{\kappa+1}$. For $\kappa=10^4$, reducing the error by $10^{-6}$ needs about **725 CG iterations** but about **69,000 steepest descent iterations**. The square root of $\kappa$ is the whole story.

### 10.4 Preconditioning

The convergence of CG and GMRES depends on the spectrum of $A$. **Preconditioning** solves an equivalent system with a better spectrum, such as $M^{-1}Ax=M^{-1}b$, where $M\approx A$ but systems with $M$ are cheap to solve. If $\kappa(M^{-1}A)\ll\kappa(A)$, the iteration count drops dramatically. Common choices:

- **Jacobi**: $M=\mathrm{diag}(A)$. Trivial, sometimes surprisingly effective for badly scaled problems.
- **Incomplete Cholesky / incomplete LU**: perform elimination but discard fill-in outside a pattern.
- **Multigrid**: one V-cycle as the preconditioner; for elliptic PDEs the iteration count becomes nearly independent of grid size.

In practice, **the preconditioner matters more than the choice of Krylov method.**

### What to Remember

- Krylov methods search $x_0+\mathcal K_k$ using only matrix-vector products; residuals are polynomials in $A$.
- GMRES: any $A$, minimal residual, growing cost (restart). CG: SPD $A$, minimal $A$-norm error, short recurrences.
- CG iterations scale like $\sqrt\kappa$; steepest descent like $\kappa$.
- Preconditioning changes the spectrum and is usually the decisive choice.

## Part V. Optimization

## 11. Optimization Fundamentals

### 11.1 The Problem

We study

$$
\min_{x\in\mathbb R^n}f(x)\quad\text{(unconstrained)},\qquad
\min_xf(x)\ \text{ s.t. }\ h(x)=0,\ g(x)\le0\quad\text{(constrained)}.
$$

A point $x^\star$ is a **global minimizer** if $f(x^\star)\le f(x)$ for all feasible $x$, and a **local minimizer** if this holds in a neighbourhood. Most algorithms can only promise local minimizers.

### 11.2 Optimality Conditions from Taylor's Theorem

Expand $f$ near $x^\star$:

$$
f(x^\star+p)=f(x^\star)+\nabla f(x^\star)^\top p+\tfrac12p^\top\nabla^2f(x^\star)p+o(\lVert p\rVert^2).
$$

- If $\nabla f(x^\star)\neq0$, the step $p=-t\nabla f(x^\star)$ decreases $f$ for small $t$. So a local minimizer must satisfy the **first-order necessary condition** $\nabla f(x^\star)=0$.
- With the gradient zero, the quadratic term decides. A local minimizer needs $\nabla^2f(x^\star)\succeq0$ (**second-order necessary**). If $\nabla f(x^\star)=0$ and $\nabla^2f(x^\star)\succ0$, then $x^\star$ is a strict local minimizer (**second-order sufficient**).

**Example.** $f(x)=x^4-2x^2$. Then $$f'(x)=4x^3-4x=0$$ at $x\in\lbrace-1,0,1\rbrace$, and $$f''(x)=12x^2-4$$ gives $$f''(0)=-4$$ (local maximum) and $$f''(\pm1)=8$$ (minima). In two dimensions, $f(x,y)=x^2-y^2$ has zero gradient at the origin but an indefinite Hessian: a saddle point.

### 11.3 Convexity

A function is **convex** if $f(\theta x+(1-\theta)y)\le\theta f(x)+(1-\theta)f(y)$ for $\theta\in[0,1]$. For differentiable $f$ this is equivalent to

$$
f(y)\ge f(x)+\nabla f(x)^\top(y-x)\quad\text{for all }x,y,
$$

which says the tangent plane is a global under-estimator. Consequence: **for convex functions, every stationary point is a global minimizer.** This is why convex problems are "easy": local information is global information.

Two constants quantify how well-behaved a function is:

- **$L$-smooth**: $\lVert\nabla f(x)-\nabla f(y)\rVert\le L\lVert x-y\rVert$, equivalently (for twice differentiable $f$) $\nabla^2f\preceq LI$. The gradient does not change too fast.
- **$\mu$-strongly convex**: $\nabla^2f\succeq\mu I$ with $\mu>0$. The function curves up at least like a quadratic.

Their ratio $\kappa=L/\mu$ is the **condition number** of the optimization problem. For the quadratic $\phi(x)=\frac12x^\top Ax-b^\top x$, $\mu=\lambda_{\min}(A)$ and $L=\lambda_{\max}(A)$, so $\kappa$ is exactly $\kappa_2(A)$. The same number governs linear solvers and optimizers.

### What to Remember

- Necessary: $\nabla f=0$, $\nabla^2f\succeq0$. Sufficient: $\nabla f=0$, $\nabla^2f\succ0$.
- Convex: stationary implies globally optimal.
- $\kappa=L/\mu$ measures difficulty, and equals $\kappa_2(A)$ for quadratics.

## 12. Gradient Descent and Line Search

### 12.1 Derivation from a Quadratic Upper Bound

If $f$ is $L$-smooth, then for any $x,y$

$$
f(y)\le f(x)+\nabla f(x)^\top(y-x)+\frac L2\lVert y-x\rVert^2.
$$

The right side is a quadratic in $y$ that lies above $f$ and touches it at $x$. Minimizing it gives $y=x-\frac1L\nabla f(x)$: **gradient descent with step $1/L$**. Plugging back in gives the **descent lemma**

$$
f(x_{k+1})\le f(x_k)-\frac{1}{2L}\lVert\nabla f(x_k)\rVert^2,
$$

so every step decreases $f$ by an amount proportional to the squared gradient.

### 12.2 Convergence Rates

From the descent lemma one proves:

- **Convex, $L$-smooth**: $f(x_k)-f^\star\le\dfrac{L\lVert x_0-x^\star\rVert^2}{2k}$, a sublinear $O(1/k)$ rate.
- **$\mu$-strongly convex, $L$-smooth**: $\lVert x_k-x^\star\rVert\le\left(1-\frac{1}{\kappa}\right)^k\lVert x_0-x^\star\rVert$ with step $1/L$, a **linear** rate (the error shrinks by a constant factor each step).

### 12.3 Why Ill-Conditioning Hurts: A Worked Quadratic

Take $f(x,y)=\frac12(x^2+10y^2)$, so $\mu=1$, $L=10$, $\kappa=10$. With step $\alpha$, gradient descent is

$$
x_{k+1}=(1-\alpha)x_k,\qquad y_{k+1}=(1-10\alpha)y_k.
$$

Each eigen-direction contracts by $\lvert1-\alpha\lambda_i\rvert$. Stability needs $\lvert1-10\alpha\rvert<1$, i.e. $\alpha<2/L=0.2$: **the step size is limited by the steepest direction**. But then the flat direction contracts by only $1-\alpha>0.8$. The best fixed step, $\alpha=2/(\mu+L)=2/11$, gives factors $9/11$ and $-9/11$ in the two directions: both components shrink by $\frac{\kappa-1}{\kappa+1}=\frac{9}{11}$ per step, and the negative factor makes $y$ flip sign every step, the familiar zigzag. With $\kappa=10^4$ instead of 10, the factor is $0.9998$.

{% include figure.html image="/assets/img/posts/numerical-linear-algebra-optimization/optimization-method-tradeoff.svg" alt="Optimization method tradeoff between cheap gradient steps, curvature-aware quasi-Newton methods, and expensive Newton steps." caption="Optimization methods trade per-iteration cost against curvature information and convergence speed." %}

### 12.4 Line Search

In practice $L$ is unknown, so the step is chosen by a **line search** along the descent direction $p_k$ (with $\nabla f_k^\top p_k<0$). Exact minimization along the line is wasteful; we only need sufficient progress.

- **Armijo (sufficient decrease)**: accept $\alpha$ if $f(x_k+\alpha p_k)\le f(x_k)+c_1\alpha\nabla f_k^\top p_k$, with small $c_1$ such as $10^{-4}$.
- **Curvature condition**: $\nabla f(x_k+\alpha p_k)^\top p_k\ge c_2\nabla f_k^\top p_k$, with $c_1 < c_2 < 1$, which rules out tiny steps. Together these are the **Wolfe conditions**.

**Backtracking** is the simplest implementation:

```python
def backtracking(f, grad_fx, x, p, alpha=1.0, rho=0.5, c1=1e-4):
    fx = f(x)
    slope = grad_fx @ p           # negative for a descent direction
    while f(x + alpha * p) > fx + c1 * alpha * slope:
        alpha *= rho
    return alpha
```

### 12.5 Momentum and Acceleration

Gradient descent has no memory. **Heavy-ball momentum** adds a fraction of the previous step, $x_{k+1}=x_k-\alpha\nabla f(x_k)+\beta(x_k-x_{k-1})$, which builds speed along consistent directions and damps zigzags. **Nesterov's accelerated gradient** evaluates the gradient at an extrapolated point and achieves rate $\left(1-\frac{1}{\sqrt\kappa}\right)^k$ for strongly convex problems and $O(1/k^2)$ for convex ones, which is provably optimal among first-order methods. Note the same $\sqrt\kappa$ as conjugate gradients; CG is, in a sense, the optimal accelerated method for quadratics.

### What to Remember

- Gradient descent minimizes a quadratic upper bound; step $1/L$; $O(1/k)$ convex, linear strongly convex.
- Steps are limited by the steepest curvature; progress by the flattest. Rate $\approx1-1/\kappa$.
- Armijo/Wolfe line searches choose steps without knowing $L$. Acceleration improves $\kappa$ to $\sqrt\kappa$.

## 13. Newton's Method

### 13.1 Newton for Equations: Square Roots

To solve $g(x)=0$, linearize at $x_k$ and solve the linear model: $$x_{k+1}=x_k-g(x_k)/g'(x_k)$$. For $g(x)=x^2-2$:

| $k$ | $x_k$ | error $\lvert x_k-\sqrt2\rvert$ |
|---|---|---|
| 0 | 1 | $4.1\times10^{-1}$ |
| 1 | 1.5 | $8.6\times10^{-2}$ |
| 2 | 1.416667 | $2.5\times10^{-3}$ |
| 3 | 1.4142157 | $2.1\times10^{-6}$ |
| 4 | 1.41421356237469 | $1.6\times10^{-12}$ |

The number of correct digits roughly **doubles** each step: **quadratic convergence**, $\lvert e_{k+1}\rvert\le C\lvert e_k\rvert^2$.

### 13.2 Newton for Minimization

Apply the same idea to $\nabla f(x)=0$, or equivalently minimize the local quadratic model

$$
m_k(p)=f(x_k)+\nabla f(x_k)^\top p+\tfrac12p^\top\nabla^2f(x_k)p.
$$

If the Hessian is positive definite, the minimizer of the model is the **Newton step**

$$
\nabla^2f(x_k)\,p_k=-\nabla f(x_k),\qquad x_{k+1}=x_k+p_k.
$$

Near a minimizer with positive definite Hessian (and Lipschitz Hessian), Newton converges quadratically. It is also **affine invariant**: rescaling or rotating the variables does not change the iterates, so ill-conditioning in the sense of section 12.3 does not slow it down. On a quadratic, Newton converges in one step.

The price: forming the Hessian and solving an $n\times n$ linear system each iteration, $O(n^3)$ if dense (Cholesky, which also checks positive definiteness), or an inner CG solve for large problems ("truncated Newton").

### 13.3 When Newton Fails

Newton's method is a *local* method. Two failure modes:

1. **Indefinite Hessian.** Then $p_k$ may not even be a descent direction; Newton is attracted to saddles and maxima as readily as minima.
2. **Overshooting far from the solution.** Consider $f(x)=\sqrt{1+x^2}$, minimized at $x=0$. Here $$f'(x)=x/\sqrt{1+x^2}$$ and $$f''(x)=(1+x^2)^{-3/2}$$, so the Newton update is

$$
x_{k+1}=x_k-\frac{f'(x_k)}{f''(x_k)}=x_k-x_k(1+x_k^2)=-x_k^3.
$$

From $\lvert x_0\rvert<1$ it converges (very fast); from $\lvert x_0\rvert=1$ it oscillates between $\pm1$ forever; from $\lvert x_0\rvert>1$ it diverges. The function is perfectly convex and smooth; the quadratic model is just a bad description of it far from the minimum.

### 13.4 Globalization

Two strategies make Newton reliable from any starting point.

- **Line search Newton.** If the Hessian is not sufficiently positive definite, modify it (add $\tau I$ until a Cholesky factorization succeeds), then do a backtracking line search along the resulting descent direction. Far away it behaves like a scaled gradient method; close by it takes full Newton steps and converges quadratically.
- **Trust region.** Minimize the model only within a ball where it is trusted: $\min_pm_k(p)$ subject to $\lVert p\rVert\le\Delta_k$. Compare the actual reduction with the predicted one, $\rho_k=\frac{f(x_k)-f(x_k+p_k)}{m_k(0)-m_k(p_k)}$. If $\rho_k$ is close to 1, accept and maybe enlarge $\Delta$; if it is small, reject and shrink $\Delta$. The **dogleg** method approximates the subproblem cheaply by a path from the gradient step to the Newton step.

### What to Remember

- Newton minimizes a local quadratic model; quadratic convergence; affine invariant.
- Costs a Hessian and a linear solve per step.
- Local only: globalize with modified Hessians plus line search, or trust regions.

## 14. Quasi-Newton Methods

### 14.1 The Secant Condition

Can we get Newton-like speed without computing Hessians? In one dimension, the **secant method** replaces $$f''(x_k)$$ by the slope of $$f'$$ between the last two iterates. In $n$ dimensions, we maintain an approximation $B_k\approx\nabla^2f(x_k)$ and require it to reproduce the most recent change in gradient:

$$
B_{k+1}s_k=y_k,\qquad s_k=x_{k+1}-x_k,\quad y_k=\nabla f_{k+1}-\nabla f_k.
$$

This **secant condition** gives $n$ equations for $n(n+1)/2$ unknowns, so we add a preference: change $B$ as little as possible, and keep it symmetric positive definite.

### 14.2 BFGS

The most successful choice, BFGS (Broyden, Fletcher, Goldfarb, Shanno), is usually written for the inverse approximation $H_k\approx\nabla^2f(x_k)^{-1}$:

$$
H_{k+1}=(I-\rho_ks_ky_k^\top)H_k(I-\rho_ky_ks_k^\top)+\rho_ks_ks_k^\top,\qquad\rho_k=\frac{1}{y_k^\top s_k}.
$$

The step is $p_k=-H_k\nabla f_k$, a matrix-vector product, so no linear solve is needed. $H_{k+1}$ stays positive definite as long as the **curvature condition** $y_k^\top s_k>0$ holds, which the Wolfe line search guarantees. BFGS converges **superlinearly** ($\lVert e_{k+1}\rVert/\lVert e_k\rVert\to0$) under standard assumptions, with $O(n^2)$ work per iteration instead of Newton's $O(n^3)$.

### 14.3 L-BFGS

For large $n$, even an $n\times n$ matrix is too much. **Limited-memory BFGS** stores only the last $m$ pairs $(s_i,y_i)$, typically $m=5$ to $20$, and applies $H_k$ to a vector implicitly with a "two-loop recursion" in $O(mn)$ operations. L-BFGS is the default algorithm for large smooth unconstrained problems, from machine learning to geophysical inversion.

### What to Remember

- Quasi-Newton methods learn curvature from gradient differences via the secant condition.
- BFGS: positive definite updates, superlinear convergence, $O(n^2)$ per step.
- L-BFGS: last $m$ pairs, $O(mn)$, the workhorse for large smooth problems.

## 15. Nonlinear Least Squares

Many fitting problems have the form

$$
\min_xf(x)=\tfrac12\sum_{i=1}^{m}r_i(x)^2=\tfrac12\lVert r(x)\rVert^2,
$$

for example fitting $y\approx a\,e^{-bt}$ to data, calibrating a camera, or bundle adjustment in robotics. With the Jacobian $J$ of the residual vector $r$:

$$
\nabla f=J^\top r,\qquad\nabla^2f=J^\top J+\sum_ir_i\nabla^2r_i.
$$

**Gauss-Newton** drops the second-order term, which is small when residuals are small or nearly linear:

$$
J^\top J\,p=-J^\top r.
$$

These are the normal equations of the *linear* least-squares problem $\min_p\lVert Jp+r\rVert$, so each Gauss-Newton step is a linear least-squares solve, best done with QR as in section 7. We need only first derivatives, yet get Newton-like convergence when the fit is good.

**Levenberg-Marquardt** adds damping:

$$
(J^\top J+\lambda I)\,p=-J^\top r.
$$

Large $\lambda$ gives a short gradient-descent-like step; small $\lambda$ gives Gauss-Newton. Adjusting $\lambda$ based on whether steps succeed is exactly a trust-region strategy. LM is the standard algorithm for curve fitting and for pose and map optimization in robotics (see the [Lie group note]({% post_url 2025-08-12-liegroup-liealgebra %}) for the version on rotation manifolds).

### What to Remember

- Gauss-Newton approximates the Hessian by $J^\top J$; each step is a linear least-squares problem.
- Levenberg-Marquardt adds damping $\lambda I$: a trust-region bridge between gradient descent and Gauss-Newton.

## 16. Constrained Optimization

### 16.1 Equality Constraints and Lagrange Multipliers

**Example.** Minimize $f(x,y)=x^2+y^2$ subject to $h(x,y)=x+y-1=0$: the point on the line $x+y=1$ closest to the origin.

Geometric reasoning: at the optimum we cannot decrease $f$ by moving along the constraint, so $\nabla f$ must be perpendicular to the constraint curve, i.e. parallel to $\nabla h$: $\nabla f=\lambda\nabla h$. With the **Lagrangian**

$$
\mathcal L(x,y,\lambda)=x^2+y^2-\lambda(x+y-1),
$$

the conditions $\nabla_{x,y}\mathcal L=0$ and $h=0$ read $2x=\lambda$, $2y=\lambda$, $x+y=1$, so $x=y=\frac12$, $\lambda=1$, $f^\star=\frac12$.

**What the multiplier means.** Replace the constraint by $x+y=c$. Then $x=y=c/2$ and $f^\star(c)=c^2/2$, so $\frac{df^\star}{dc}=c=1=\lambda$ at $c=1$. **The multiplier is the sensitivity of the optimal value to the constraint level**, the "shadow price" of the constraint.

### 16.2 Inequality Constraints and the KKT Conditions

For $\min f(x)$ subject to $h_j(x)=0$ and $g_i(x)\le0$, define $\mathcal L=f+\sum_j\lambda_jh_j+\sum_i\mu_ig_i$. Under a regularity condition (for example, linearly independent gradients of the active constraints, LICQ), a local minimizer satisfies the **Karush-Kuhn-Tucker (KKT) conditions**:

$$
\begin{aligned}
&\nabla f(x^\star)+\sum_j\lambda_j\nabla h_j(x^\star)+\sum_i\mu_i\nabla g_i(x^\star)=0 &&\text{(stationarity)}\\
&h_j(x^\star)=0,\quad g_i(x^\star)\le0 &&\text{(primal feasibility)}\\
&\mu_i\ge0 &&\text{(dual feasibility)}\\
&\mu_i\,g_i(x^\star)=0 &&\text{(complementary slackness)}
\end{aligned}
$$

Complementary slackness says: either a constraint is **active** ($g_i=0$) and may push back ($\mu_i\ge0$), or it is **inactive** ($g_i<0$) and exerts no force ($\mu_i=0$).

**Worked example.** Minimize $(x-2)^2$ subject to $x\le1$, i.e. $g(x)=x-1\le0$. The unconstrained minimizer $x=2$ is infeasible, so guess the constraint is active: $x=1$. Stationarity: $2(x-2)+\mu=0$ gives $\mu=2\ge0$. All KKT conditions hold, so $x^\star=1$. If the constraint were $x\le3$ instead, it would be inactive: $\mu=0$, $x^\star=2$. A negative multiplier in a guessed active set signals that the constraint should be released, which is exactly how active-set methods move.

For **convex** problems (convex $f$ and $g_i$, affine $h_j$), the KKT conditions are also sufficient for global optimality.

### 16.3 Duality in One Paragraph

The **dual function** $q(\lambda,\mu)=\inf_x\mathcal L(x,\lambda,\mu)$ is a lower bound on the optimal value for any $\mu\ge0$ (**weak duality**). Maximizing it gives the dual problem. For convex problems satisfying a mild condition (Slater: a strictly feasible point exists), the bound is tight (**strong duality**) and the optimal multipliers solve the dual. Duality provides certificates of optimality (the duality gap) and is the basis of many decomposition algorithms.

### 16.4 Quadratic Programs and the KKT System

For an equality-constrained quadratic program, $\min\frac12x^\top Gx+c^\top x$ subject to $Ax=b$, the KKT conditions are one linear system:

$$
\begin{bmatrix}G&A^\top\\A&0\end{bmatrix}
\begin{bmatrix}x\\-\lambda\end{bmatrix}=
\begin{bmatrix}-c\\b\end{bmatrix}.
$$

This matrix is symmetric but **indefinite**, so Cholesky does not apply; one uses a symmetric indefinite factorization ($LDL^\top$ with pivoting) or eliminates the constraints with a null-space basis. Inequality-constrained QPs are solved by **active-set methods** (guess which inequalities are active, solve the equality QP, update the guess using the multiplier signs) or by interior-point methods.

### 16.5 Penalties and Augmented Lagrangians

The **quadratic penalty** method replaces constraints by a cost, $\min f(x)+\frac\rho2\lVert h(x)\rVert^2$, and increases $\rho$. It works, but the Hessian's condition number grows like $\rho$, so the subproblems become ill-conditioned (section 12.3 again). The **augmented Lagrangian** method adds a multiplier estimate,

$$
\mathcal L_\rho(x,\lambda)=f(x)+\lambda^\top h(x)+\frac\rho2\lVert h(x)\rVert^2,\qquad\lambda\leftarrow\lambda+\rho\,h(x),
$$

and converges with moderate $\rho$. **ADMM** applies this to problems split as $f(x)+g(z)$ with $Ax+Bz=c$, minimizing over $x$ and $z$ alternately before updating the multiplier, which makes it attractive for distributed and large-scale problems.

### 16.6 Interior-Point Methods

Replace inequality constraints $g_i(x)\le0$ by a **logarithmic barrier** that blows up at the boundary:

$$
\min_x\ f(x)-\mu\sum_i\log(-g_i(x)).
$$

As $\mu\to0$, the minimizers trace the **central path** toward the solution. Each barrier problem is solved by Newton's method (warm-started from the previous $\mu$), so the work is a sequence of linear systems. Primal-dual interior-point methods solve linear, quadratic, second-order cone, and semidefinite programs in a number of Newton steps that grows very slowly with problem size, typically a few dozen.

### What to Remember

- At a constrained optimum, $\nabla f$ is a combination of active constraint gradients; multipliers are sensitivities.
- KKT: stationarity, feasibility, $\mu\ge0$, complementary slackness. Sufficient for convex problems.
- QPs reduce to indefinite KKT linear systems. Penalties ill-condition; augmented Lagrangians and interior points fix this.

## 17. Stochastic and Large-Scale Optimization

### 17.1 Finite Sums and Stochastic Gradients

Machine learning and data fitting minimize averages over $N$ data points:

$$
f(x)=\frac1N\sum_{i=1}^{N}f_i(x).
$$

A full gradient costs $N$ evaluations. **Stochastic gradient descent** (SGD) picks a random index $i_k$ (or a minibatch) and steps along its gradient:

$$
x_{k+1}=x_k-\alpha_kg_k,\qquad g_k=\nabla f_{i_k}(x_k),\qquad\mathbb E[g_k]=\nabla f(x_k).
$$

Each step is $N$ times cheaper, but the direction is noisy.

### 17.2 Step Sizes and Noise

Noise changes the convergence story:

- With a **constant step**, SGD converges quickly at first, then wanders in a "noise ball" around the minimizer whose size is proportional to $\alpha$ times the gradient variance.
- With **decreasing steps** satisfying $\sum_k\alpha_k=\infty$ and $\sum_k\alpha_k^2<\infty$ (the Robbins-Monro conditions, e.g. $\alpha_k\propto1/k$), it converges, but only sublinearly: $O(1/\sqrt k)$ for convex and $O(1/k)$ for strongly convex problems.

Why is SGD popular if it is slower per iteration count? Because per *unit of computation*, early progress is far faster, and in machine learning we rarely need high accuracy on the training objective.

### 17.3 Minibatches, Momentum, and Adaptive Methods

- **Minibatches** of size $B$ reduce the gradient variance by a factor $B$ and use parallel hardware well; beyond some size, the returns diminish.
- **Momentum** averages gradients over time, smoothing noise as well as zigzags.
- **Adam** keeps running averages of the gradient ($m_k$) and of its elementwise square ($v_k$) and steps by $\alpha\,\hat m_k/(\sqrt{\hat v_k}+\epsilon)$ (hats denote bias corrections). This is a cheap **diagonal preconditioner**: coordinates with large, noisy gradients get smaller steps, which helps with badly scaled problems, the same idea as Jacobi preconditioning.
- **Variance reduction** methods (SVRG, SAGA) occasionally compute a full gradient and use it to correct the stochastic ones, recovering linear convergence on strongly convex finite sums.

### 17.4 Scale Changes the Priorities

For large problems, arithmetic is often not the bottleneck. **Memory traffic, sparsity, communication, and parallelism** decide performance. Algorithms that use matrix-vector products (Krylov, L-BFGS, SGD) and exploit sparse storage dominate; algorithms that need dense factorizations do not scale. The [parallel programming note]({% post_url 2025-08-15-parallel-programming-notes %}) follows this thread into hardware.

### What to Remember

- SGD: unbiased noisy gradients, $N$ times cheaper steps, sublinear convergence, noise ball with constant steps.
- Minibatches reduce variance; Adam is a diagonal preconditioner; variance reduction restores linear rates.
- At scale, memory and communication matter more than flop counts.

## 18. Summary and Recall Map

### 18.1 Convergence Rates

| Rate | Definition | Example |
|---|---|---|
| Sublinear | error $\sim1/k$ or $1/\sqrt k$ | gradient descent (convex), SGD |
| Linear | $\lVert e_{k+1}\rVert\le c\lVert e_k\rVert$, $c<1$ | gradient descent (strongly convex), Jacobi, power iteration |
| Superlinear | $\lVert e_{k+1}\rVert/\lVert e_k\rVert\to0$ | BFGS, secant method |
| Quadratic | $\lVert e_{k+1}\rVert\le C\lVert e_k\rVert^2$ | Newton |
| Cubic | $\lVert e_{k+1}\rVert\le C\lVert e_k\rVert^3$ | Rayleigh quotient iteration (symmetric) |

### 18.2 Choosing an Algorithm

| Problem | Small/dense | Large/sparse |
|---|---|---|
| $Ax=b$, general | LU with partial pivoting | GMRES + preconditioner |
| $Ax=b$, SPD | Cholesky | CG + preconditioner (multigrid, IC) |
| Least squares | Householder QR (SVD if rank-deficient) | LSQR / CG on normal equations with care |
| All eigenvalues | QR algorithm (`eig`) | not feasible |
| A few eigenvalues | QR algorithm | Lanczos / Arnoldi (shift-invert) |
| Smooth unconstrained min | Newton / BFGS with line search | L-BFGS, nonlinear CG |
| Data fitting | Levenberg-Marquardt | LM with iterative inner solves |
| Constrained, convex | interior point | interior point / ADMM |
| Huge finite sums | - | SGD, Adam, variance reduction |

### 18.3 The Ideas That Connect Everything

1. **Accuracy ≈ conditioning × stability.** Diagnose which one is failing.
2. **Factor once, solve many.** LU, Cholesky, QR are investments.
3. **Orthogonality is numerically precious.** QR beats normal equations; Householder beats Gram-Schmidt.
4. **The condition number governs iteration counts** in both linear solvers and optimizers ($\kappa$ for gradient descent, $\sqrt\kappa$ for CG and acceleration).
5. **Newton-type methods are fast locally and need globalization.**
6. **Optimization is mostly linear algebra**: every Newton, Gauss-Newton, or interior-point step is a linear system.

### 18.4 Where the Theory Stops

Theorems assume exact structure: SPD matrices, Lipschitz gradients, convexity, independent samples, the floating-point axiom. Real problems violate these through bad scaling and units, missing data, nonsmooth objectives, and hardware effects. The practical defence is the same throughout: check residuals ($\lVert Ax-b\rVert$, $\lVert\nabla f\rVert$, KKT violations), estimate condition numbers, and test algorithms on problems with known answers.

## References and Reading Guide

- L. N. Trefethen and D. Bau III, _Numerical Linear Algebra_ (SIAM, 1997). Lectures 1-5 (norms, SVD), 6-11 (projectors, QR, least squares), 12-15 (conditioning, floating point, stability), 20-23 (LU, pivoting, Cholesky), 24-31 (eigenvalues, QR algorithm), 32-40 (Krylov methods, CG, GMRES, preconditioning).
- G. H. Golub and C. F. Van Loan, _Matrix Computations_ (4th ed., Johns Hopkins, 2013). The reference for algorithms and their analysis.
- N. J. Higham, _Accuracy and Stability of Numerical Algorithms_ (2nd ed., SIAM, 2002). Everything about rounding errors.
- Y. Saad, _Iterative Methods for Sparse Linear Systems_ (2nd ed., SIAM, 2003). Krylov methods and preconditioning.
- J. Nocedal and S. J. Wright, _Numerical Optimization_ (2nd ed., Springer, 2006). Chapters 2-4 (fundamentals, line search, trust region), 5 (CG), 6-7 (quasi-Newton, L-BFGS), 10 (nonlinear least squares), 12 (KKT theory), 16-19 (QP, penalty and augmented Lagrangian, interior point).
- S. Boyd and L. Vandenberghe, _Convex Optimization_ (Cambridge, 2004). Chapters 2-5 (convexity and duality), 9-11 (unconstrained, equality-constrained, interior-point methods).
- L. Bottou, F. E. Curtis, and J. Nocedal, "Optimization Methods for Large-Scale Machine Learning," _SIAM Review_ 60(2), 2018.
