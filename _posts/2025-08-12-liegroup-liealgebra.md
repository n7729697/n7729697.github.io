---
title: Lie group and lie algebra for robotics
tags: [lie group, matrix, lie algebra, robotics, state estimation]
style: fill
color: light
description: Course-style notes on Lie groups and Lie algebras for robotics, starting from planar rotations and mobile-robot poses, through groups, the matrix exponential, SO(3), quaternions, SE(3), twists, the adjoint, Jacobians, Gauss-Newton on manifolds, uncertainty, error-state Kalman filtering, and camera pose estimation, with worked numerical examples.
---

_These notes are adapted from the 2018 robotics lecture materials on transformations, rotations, angular velocity, twists, Bayesian and Kalman filtering, visual-inertial fusion, camera models, and PnP that I studied from, combined with Barfoot's "State Estimation for Robotics" and Solà, Deray, and Atchuthan's "A micro Lie theory for state estimation in robotics". Every numerical example below has been checked in Python._

## How to Read These Notes

Lie groups in robotics answer one question: **how can we compute with rigid-body poses without pretending that rotations are ordinary vectors?** The question appears everywhere:

- a mobile robot composes odometry increments;
- a manipulator chains joint transforms;
- a camera estimates its pose from image features;
- an IMU integrates angular velocity;
- a Kalman filter stores uncertainty around an orientation;
- a trajectory optimizer updates poses using local residuals.

The tempting mistake is to treat a pose as just another vector. Translation is vector-like; orientation is not. A 3D rotation matrix has nine numbers but only three degrees of freedom; a quaternion has four numbers and a unit-norm constraint; Euler angles have singularities and a dozen conventions. Lie theory is the bridge:

- the **group** describes finite motions;
- the **algebra** describes local perturbations and velocities;
- the **exponential** integrates local motion into finite motion;
- the **logarithm** turns a finite disagreement into a local residual.

The notes start in two dimensions, where everything can be drawn and computed by hand, then build the general machinery, and only then move to 3D rotations, rigid motions, and their use in optimization and estimation.

{% include figure.html image="/assets/img/posts/lie-groups-robotics/group-algebra-robotics-map.svg" alt="Robotics Lie group map showing poses on SE(3), twists in se(3), and exponential/logarithm maps between them." caption="Robotics uses Lie groups for finite poses and Lie algebras for local increments, velocities, residuals, and optimization variables." %}

| Part | Sections | Topic |
|---|---|---|
| Warm-up | 1-2 | Planar rotations SO(2) and planar poses SE(2) |
| Machinery | 3-4 | Groups, Lie groups, tangent spaces, the matrix exponential |
| Geometry | 5-12 | Frames, SO(3), representations, so(3), angular velocity, SE(3), twists, adjoint |
| Calculus | 13-16 | BCH and Jacobians, perturbations, Gauss-Newton on groups, uncertainty |
| Applications | 17-19 | Error-state filtering, camera pose, implementation checklist |

## 1. Warm-up: Rotations in the Plane

### 1.1 The Rotation Matrix

Rotating a vector in the plane by angle $\theta$ is the linear map

$$
R(\theta)=\begin{bmatrix}\cos\theta&-\sin\theta\\ \sin\theta&\cos\theta\end{bmatrix}.
$$

Its columns are the rotated basis vectors. It satisfies $R^\top R=I$ (lengths and angles are preserved) and $\det R=1$ (no reflection). Two rotations compose by multiplying matrices, and the trigonometric addition formulas show

$$
R(\alpha)R(\beta)=R(\alpha+\beta).
$$

So in 2D, composing rotations *is* adding angles. This is why planar orientation feels like a number.

### 1.2 But Angles Are Not Quite Numbers

The catch is that $\theta$ and $\theta+2\pi$ are the same rotation. The set of planar rotations is a **circle**, not a line. Ignoring this breaks simple computations.

**Averaging headings.** A robot reports headings $350^\circ$ and $10^\circ$. The arithmetic mean is $180^\circ$: exactly the wrong direction. The correct average treats each heading as a point on the unit circle, averages $(\cos\theta,\sin\theta)$, and converts back, giving $0^\circ$. Subtraction has the same problem: the difference between $350^\circ$ and $10^\circ$ is $-20^\circ$, not $340^\circ$, so every angular residual must be wrapped into $(-\pi,\pi]$.

In 3D, the problem is much worse, because there is no single angle to wrap. Lie theory is the systematic version of "average on the circle, then come back".

### 1.3 Complex Numbers and the First Exponential

Identify the plane with complex numbers. Rotation by $\theta$ is multiplication by the unit complex number $e^{i\theta}=\cos\theta+i\sin\theta$. Unit complex numbers live on the circle (the "group"); the angle $\theta$ lives on the real line, which we can picture as the tangent line to the circle at 1 (the "algebra"); and the exponential wraps the line onto the circle.

The same happens with matrices. Differentiate $R(\theta)$ at $\theta=0$:

$$
G=\frac{dR}{d\theta}\Big|_{\theta=0}=\begin{bmatrix}0&-1\\1&0\end{bmatrix}.
$$

$G$ is the **generator** of planar rotations: a skew-symmetric matrix representing an infinitesimal rotation. Since $G^2=-I$, the matrix exponential series (section 4) splits into even and odd terms:

$$
\exp(\theta G)=I+\theta G-\frac{\theta^2}{2!}I-\frac{\theta^3}{3!}G+\cdots=I\cos\theta+G\sin\theta=R(\theta).
$$

So $R(\theta)=\exp(\theta G)$, the matrix version of $e^{i\theta}$. This one formula contains the whole structure we will generalize: a curved set of finite motions (the circle), a flat set of infinitesimal motions (multiples of $G$), and an exponential connecting them.

### What to Remember

- Planar rotations compose by adding angles, but angles wrap around: the rotations form a circle.
- Averages and differences must be computed on the circle, not on raw angles.
- $R(\theta)=\exp(\theta G)$ with the skew generator $G$: group, algebra, and exponential in miniature.

## 2. Warm-up: Poses of a Mobile Robot

### 2.1 Homogeneous Coordinates in 2D

A planar robot pose is a position $(x,y)$ and a heading $\theta$. Packing them into a $3\times3$ matrix,

$$
T=\begin{bmatrix}R(\theta)&t\\0^\top&1\end{bmatrix},\qquad t=\begin{bmatrix}x\\y\end{bmatrix},
$$

lets one matrix product apply both rotation and translation to a point in homogeneous coordinates: $T\,[p;1]=[R(\theta)p+t;\ 1]$. These matrices form the **special Euclidean group SE(2)**.

### 2.2 Composing Odometry

Odometry reports motion **in the robot's own frame**: "I moved forward 1 m and turned left $90^\circ$". If the robot is at pose $T$ and reports a body-frame increment $\Delta$, the new pose is $T\,\Delta$.

Write increments as $(\Delta x,\Delta y,\Delta\theta)$. Starting at the origin facing along $x$:

- **Forward then turn.** $a=(1,0,0)$ then $b=(0,0,90^\circ)$. The product $T_aT_b$ gives position $(1,0)$, heading $90^\circ$.
- **Turn then forward.** $T_bT_a$: after turning, "forward" points along $y$, so the position is $(0,1)$, heading $90^\circ$.

**The order matters: rigid motions do not commute.** Now take the increment $c=(1,0,90^\circ)$ (move forward 1 m, then turn left) and apply it twice. Matrix composition gives position $(1,0)+R(90^\circ)(1,0)=(1,1)$ and heading $180^\circ$. Naively adding the vectors $(1,0,90^\circ)+(1,0,90^\circ)$ gives $(2,0,180^\circ)$, which ignores that the second forward step happens after the first turn. **Poses are not vectors**; composition rotates the translation.

### 2.3 The Algebra of SE(2)

A robot driving with forward speed $v$ and turn rate $\omega$ has, at each instant, an infinitesimal motion described by the matrix

$$
\xi^\wedge=\begin{bmatrix}0&-\omega&v\\ \omega&0&0\\0&0&0\end{bmatrix}.
$$

Driving with constant $(v,\omega)$ for one second gives the pose $\exp(\xi^\wedge)$, which is a **circular arc**, not "translate by $v$, then rotate by $\omega$". We will compute exactly this in 3D in section 11.4. The lesson for now: the natural "vector" for a pose change is a velocity-like quantity (a **twist**), and the exponential turns it into a pose.

### What to Remember

- SE(2) poses are $3\times3$ homogeneous matrices; composition is matrix multiplication.
- Body-frame increments multiply on the right; order matters.
- Adding pose vectors is wrong; integrating a constant twist gives an arc.

## 3. Groups, Lie Groups, and Tangent Spaces

### 3.1 Groups

A **group** is a set $G$ with an operation $\circ$ such that:

1. **closure**: $a\circ b\in G$;
2. **associativity**: $(a\circ b)\circ c=a\circ(b\circ c)$;
3. **identity**: there is $e$ with $e\circ a=a\circ e=a$;
4. **inverses**: every $a$ has $a^{-1}$ with $a\circ a^{-1}=a^{-1}\circ a=e$.

Commutativity is *not* required. Examples:

| Group | Elements | Operation | Commutative? |
|---|---|---|---|
| $(\mathbb R^n,+)$ | vectors | addition | yes |
| unit complex numbers | $e^{i\theta}$ | multiplication | yes |
| $GL(n)$ | invertible $n\times n$ matrices | matrix product | no |
| $SO(2)$ | planar rotations | matrix product | yes |
| $SO(3)$ | 3D rotations | matrix product | no |
| $SE(2)$, $SE(3)$ | rigid motions | matrix product | no |

The group axioms are exactly what pose composition needs: composing two poses gives a pose, there is a "do nothing" pose, every motion can be undone, and grouping does not matter (though order does).

### 3.2 Lie Groups and Manifolds

A **Lie group** is a group that is also a smooth **manifold**: a set that looks like $\mathbb R^n$ near every point, in which the group operations are smooth. The circle looks like a line locally; the sphere looks like a plane locally; $SO(3)$ looks like $\mathbb R^3$ locally.

The **dimension** is the number of independent directions you can move in. Count constraints:

- $SO(3)$: nine entries, $R^\top R=I$ gives six independent equations, so $9-6=3$ dimensions.
- unit quaternions: four entries, one constraint $\lVert q\rVert=1$, so 3 dimensions.
- $SE(3)$: three for rotation plus three for translation, so 6 dimensions.

"Locally like $\mathbb R^3$" does not mean "globally like $\mathbb R^3$". No single set of three coordinates covers all of $SO(3)$ without singularities or jumps. This is a topological fact, not a failing of any particular parameterization, and it explains why every three-number representation of rotation (Euler angles, rotation vectors) has a bad spot somewhere.

### 3.3 The Tangent Space at the Identity

Take a smooth curve $X(t)$ in a matrix Lie group with $X(0)=I$. Its velocity $\dot X(0)$ is a matrix, an element of the **tangent space at the identity**. That tangent space is a vector space, called the **Lie algebra** of the group and written in lower-case fraktur: $\mathfrak{so}(3)$, $\mathfrak{se}(3)$.

For rotations, differentiating $R(t)^\top R(t)=I$ at $t=0$ gives $\dot R(0)^\top+\dot R(0)=0$: **the Lie algebra of $SO(n)$ consists of skew-symmetric matrices**. In 2D these are multiples of $G$ (one dimension); in 3D they have three free entries (three dimensions), matching the group's dimension.

Because the Lie algebra is a vector space, we can add, scale, average, take derivatives, and put Gaussian distributions on it. That is the whole point: **do the vector-space work in the algebra, and use the exponential to move the result onto the group.**

### What to Remember

- A group needs closure, associativity, identity, inverses; not commutativity.
- A Lie group is also a smooth manifold; its dimension is the number of free directions.
- The Lie algebra is the tangent space at the identity; for rotation groups it is the skew-symmetric matrices.

## 4. The Matrix Exponential

### 4.1 Definition and Basic Properties

For a square matrix $A$,

$$
\exp(A)=I+A+\frac{A^2}{2!}+\frac{A^3}{3!}+\cdots,
$$

which converges for every $A$. Properties worth knowing:

- $\exp(0)=I$ and $\exp(A)^{-1}=\exp(-A)$, so $\exp(A)$ is always invertible.
- $\det\exp(A)=e^{\mathrm{tr}\,A}$. Skew-symmetric matrices have zero trace, so their exponentials have determinant 1.
- If $A$ is skew-symmetric, $\exp(A)^\top\exp(A)=\exp(-A)\exp(A)=I$. So **the exponential of a skew-symmetric matrix is a rotation.**
- $\exp(A+B)=\exp(A)\exp(B)$ **if $A$ and $B$ commute**, but not in general.

### 4.2 Why the Exponential Is the Right Map

The matrix exponential solves linear ODEs: $\dot X=AX$, $X(0)=I$ has the solution $X(t)=\exp(tA)$. Read in our setting: if a body rotates with constant angular velocity (a constant element of the algebra), its orientation after time $t$ is the exponential. The curves $t\mapsto\exp(tA)$ are **one-parameter subgroups**, the group's version of straight lines: $\exp(sA)\exp(tA)=\exp((s+t)A)$.

So the exponential is not an arbitrary formula. It is "integrate a constant velocity for unit time".

### 4.3 Non-Commutativity and the Lie Bracket

Because rotations do not commute, $\exp(A)\exp(B)\neq\exp(A+B)$ in general. The failure is measured by the **Lie bracket** (commutator)

$$
[A,B]=AB-BA.
$$

The **Baker-Campbell-Hausdorff (BCH) formula** expresses the product exactly in the algebra:

$$
\log\big(\exp(A)\exp(B)\big)=A+B+\tfrac12[A,B]+\tfrac1{12}\big([A,[A,B]]-[B,[A,B]]\big)+\cdots
$$

For small $A$ and $B$, the correction is second order, so composing small motions is approximately adding them. For finite motions it is not, and section 13 shows how the Jacobians of the group capture the first-order correction exactly.

### What to Remember

- $\exp(A)=\sum A^k/k!$ solves $\dot X=AX$: integrate a constant velocity.
- Exponentials of skew matrices are rotations.
- $\exp(A)\exp(B)=\exp(A+B+\frac12[A,B]+\cdots)$: the bracket measures non-commutativity.

## 5. Frames First: Coordinates Are Not the Object

A physical vector is independent of coordinates. Its coordinate column changes when the reference frame changes. If a frame has basis vectors $\mathbf e_1,\mathbf e_2,\mathbf e_3$, then

$$
\mathbf a=[\mathbf e_1,\mathbf e_2,\mathbf e_3]\begin{bmatrix}a_1\\a_2\\a_3\end{bmatrix}.
$$

For two frames $A$ and $B$, let $R_{AB}$ be the rotation whose columns are the axes of frame $B$ expressed in frame $A$. If $p_B$ is the coordinate column of a point in frame $B$, the same point in frame $A$ is

$$
p_A=R_{AB}p_B+t_{AB},
$$

where $t_{AB}$ is the origin of frame $B$ expressed in frame $A$. Homogeneous coordinates package rotation and translation:

$$
T_{AB}=\begin{bmatrix}R_{AB}&t_{AB}\\0^\top&1\end{bmatrix},\qquad\bar p_A=T_{AB}\bar p_B.
$$

The inverse is not the transpose of the whole homogeneous matrix:

$$
T_{AB}^{-1}=\begin{bmatrix}R_{AB}^\top&-R_{AB}^\top t_{AB}\\0^\top&1\end{bmatrix}.
$$

(Check: apply $T_{AB}$ then this matrix to $\bar p_B$ and you get $\bar p_B$ back.)

{% include figure.html image="/assets/img/posts/lie-groups-robotics/frame-transform-pose.svg" alt="Two coordinate frames with a point represented by rotation and translation between frames." caption="A pose is a relationship between frames: the same physical point has different coordinates depending on rotation and translation." %}

The notation $T_{AB}$ is already a convention. In these notes it means "transform coordinates from frame $B$ into frame $A$", equivalently "the pose of $B$ in $A$". Some libraries write the indices the other way, some use active transforms that move physical vectors, and some use row vectors. The mathematics supports all of these; software cannot survive mixing them casually.

## 6. Composition: Current Frame or Fixed Frame?

Rigid-body transformations compose by matrix multiplication, and the indices chain:

$$
T_{AC}=T_{AB}T_{BC}.
$$

If a motion is specified relative to the **current/body frame**, it is post-multiplied; relative to the **fixed/world frame**, pre-multiplied:

$$
\text{body update:}\quad T^+=T\,\Delta T,\qquad\text{world update:}\quad T^+=\Delta T\,T.
$$

These differ because rigid transforms do not commute, as the odometry example of section 2.2 showed.

{% include figure.html image="/assets/img/posts/lie-groups-robotics/composition-conventions.svg" alt="Two pose-update conventions: post-multiplying a body-frame increment and pre-multiplying a world-frame increment." caption="The same incremental transform means different things depending on whether it is expressed in the body/current frame or the world/fixed frame." %}

A useful debugging habit: annotate every transform with its frames. In $T_{AB}T_{BC}$ the inner indices match and cancel; if they do not, the product is probably wrong.

## 7. The Rotation Group SO(3) and Its Representations

### 7.1 The Group

Valid 3D rotation matrices form the special orthogonal group

$$
SO(3)=\lbrace R\in\mathbb R^{3\times3}\mid R^\top R=I,\ \det R=1\rbrace,
$$

with closure, identity $I$, inverse $R^{-1}=R^\top$, and associativity from matrix multiplication. It is a 3-dimensional curved manifold inside the 9-dimensional space of matrices.

### 7.2 Euler Angles and Gimbal Lock

Euler angles write a rotation as three rotations about coordinate axes. In the common aerospace **ZYX (yaw-pitch-roll)** convention,

$$
R=R_z(\psi)\,R_y(\theta)\,R_x(\phi).
$$

They are compact and easy to read, but singular. At pitch $\theta=90^\circ$, the first and last rotations act about the same physical axis, and the product depends only on the *difference* $\psi-\phi$. For example, $(\psi,\phi)=(0.3,0.5)$ and $(0.5,0.7)$ give exactly the same matrix. One degree of freedom has disappeared: this is **gimbal lock**. Near it, small changes in orientation require huge changes in the angles, and the map from angle rates to angular velocity becomes singular (section 9.3).

Also note that "Euler angles" means at least twelve different conventions (axis order, intrinsic or extrinsic, active or passive). Always write down which one you use.

### 7.3 Axis-Angle and the Rotation Vector

Euler's rotation theorem: every rotation is a rotation by some angle $\theta$ about some unit axis $u$. The **rotation vector** $\phi=\theta u\in\mathbb R^3$ packs both into three numbers. It is the natural coordinate for small rotations (it is the Lie algebra coordinate, section 8), but it has trouble at $\theta=0$ (axis undefined) and $\theta=\pi$ ($\pm u$ give the same rotation).

### 7.4 Unit Quaternions

A quaternion $q=s+v_1i+v_2j+v_3k$, written $q=[s,\ v]$, multiplies by the rule

$$
q_aq_b=\big[s_as_b-v_a^\top v_b,\ \ s_av_b+s_bv_a+v_a\times v_b\big].
$$

The cross product makes the product non-commutative, just like rotations. A **unit quaternion** encodes the rotation by angle $\theta$ about unit axis $u$ as

$$
q=\Big[\cos\frac\theta2,\ \ u\sin\frac\theta2\Big],
$$

and rotates a vector $p$ by $$p'=q\,[0,p]\,q^\ast$$, where $q^\ast=[s,-v]$ is the conjugate (and the inverse, for unit $q$).

**Worked example.** A $90^\circ$ rotation about $z$: $q=[\cos45^\circ,\ (0,0,\sin45^\circ)]\approx[0.7071,\ (0,0,0.7071)]$. Rotating $p=(1,0,0)$ with $q\,[0,p]\,q^\ast$ gives $(0,1,0)$, as it should.

The half angle has a consequence: $q$ and $-q$ represent the same rotation (the angle $\theta+2\pi$ flips the sign). Unit quaternions **double cover** $SO(3)$. When interpolating or computing differences, choose the sign so that $q_a^\top q_b\ge0$, or you will take the long way around. Spherical linear interpolation between unit quaternions is

$$
\mathrm{slerp}(q_a,q_b;\tau)=\frac{\sin((1-\tau)\Omega)}{\sin\Omega}q_a+\frac{\sin(\tau\Omega)}{\sin\Omega}q_b,\qquad\cos\Omega=q_a^\top q_b.
$$

Quaternions have no gimbal lock, only one constraint, and cheap composition, which is why most estimators store orientation as a unit quaternion.

### 7.5 Comparing Representations

| Representation | Numbers | Constraint | Singularities | Good for |
|---|---|---|---|---|
| Rotation matrix | 9 | $R^\top R=I$, $\det R=1$ | none | composing, transforming points |
| Euler angles | 3 | none | gimbal lock | human input/output |
| Rotation vector | 3 | none | $\theta=\pi$, axis at $\theta=0$ | small increments, residuals |
| Unit quaternion | 4 | $\lVert q\rVert=1$ | none (double cover) | storage, integration, interpolation |

{% include figure.html image="/assets/img/posts/lie-groups-robotics/rotation-representation-tradeoffs.svg" alt="Comparison of rotation matrix, Euler angles, quaternion, and axis-angle representations." caption="Rotation representations trade constraints, singularities, redundancy, and computational convenience." %}

The Lie-group workflow uses each where it is strongest: store a matrix or quaternion (no singularities), and express small changes as rotation vectors in the algebra (three unconstrained numbers).

## 8. The Lie Algebra so(3): Cross Products as Matrices

### 8.1 The Hat and Vee Operators

The Lie algebra $\mathfrak{so}(3)$ is the set of $3\times3$ skew-symmetric matrices. Each is determined by a 3-vector through the **hat** operator:

$$
\phi^\wedge=\begin{bmatrix}0&-\phi_3&\phi_2\\ \phi_3&0&-\phi_1\\-\phi_2&\phi_1&0\end{bmatrix},\qquad\phi^\wedge x=\phi\times x.
$$

The inverse, **vee** ($\cdot^\vee$), reads the vector back out. So $\mathfrak{so}(3)\cong\mathbb R^3$, and a rotation vector is an element of the algebra.

The Lie bracket of two skew matrices corresponds to the cross product of their vectors:

$$
[\phi^\wedge,\psi^\wedge]=(\phi\times\psi)^\wedge.
$$

### 8.2 Deriving Rodrigues' Formula

Write $\phi=\theta u$ with $\lVert u\rVert=1$ and $K=u^\wedge$. The key identity is

$$
K^3=-K,
$$

which follows from $K^2=uu^\top-I$ (expand $u\times(u\times x)$). The exponential series therefore collapses: every odd power is $\pm K$ and every even power (beyond the zeroth) is $\pm K^2$:

$$
\exp(\theta K)=I+\Big(\theta-\frac{\theta^3}{3!}+\cdots\Big)K+\Big(\frac{\theta^2}{2!}-\frac{\theta^4}{4!}+\cdots\Big)K^2.
$$

Recognizing the series gives **Rodrigues' formula**:

$$
\mathrm{Exp}(\theta u)=\exp(\theta u^\wedge)=I+\sin\theta\,u^\wedge+(1-\cos\theta)(u^\wedge)^2.
$$

This is the 3D version of $\exp(\theta G)=I\cos\theta+G\sin\theta$ from section 1.3. (Capitalized $\mathrm{Exp}$ takes a 3-vector; lower-case $\exp$ takes the matrix.)

### 8.3 The Logarithm

To go back, use the trace and the skew part. From Rodrigues, $\mathrm{tr}\,R=1+2\cos\theta$, so

$$
\theta=\arccos\frac{\mathrm{tr}\,R-1}{2},\qquad u=\frac{(R-R^\top)^\vee}{2\sin\theta}.
$$

**Worked example.** $$R=\begin{bmatrix}0&-1&0\\1&0&0\\0&0&1\end{bmatrix}$$ (a $90^\circ$ rotation about $z$). Then $\mathrm{tr}\,R=1$, so $\theta=\arccos0=\pi/2$. The skew part $R-R^\top$ has vee $(0,0,2)$, and dividing by $2\sin(\pi/2)=2$ gives $u=(0,0,1)$. So $\mathrm{Log}(R)=(0,0,\pi/2)$.

Numerically, use the first-order expansion $\mathrm{Log}(R)\approx\frac12(R-R^\top)^\vee$ when $\theta$ is tiny, and a special branch near $\theta=\pi$, where $\sin\theta\approx0$ and the axis must be extracted from the symmetric part $R+I$.

## 9. Angular Velocity: Spatial Versus Body

### 9.1 Two Angular Velocities

Differentiating $R^\top R=I$ shows that $R^\top\dot R$ and $\dot RR^\top$ are skew-symmetric. Therefore they correspond to angular-velocity vectors:

$$
\omega_b^\wedge=R^\top\dot R,\qquad\omega_s^\wedge=\dot RR^\top.
$$

- $\omega_b$ is the angular velocity expressed in the **body** frame (what a gyroscope measures).
- $\omega_s$ is the angular velocity expressed in the **spatial/world** frame.

They are related by $\omega_s=R\omega_b$, and the kinematics can be written either way:

$$
\dot R=R\,\omega_b^\wedge\qquad\text{or}\qquad\dot R=\omega_s^\wedge R.
$$

{% include figure.html image="/assets/img/posts/lie-groups-robotics/rotation-velocity-frames.svg" alt="Rotation matrix with body angular velocity on the right and spatial angular velocity on the left." caption="Body angular velocity and spatial angular velocity describe the same physical spin, but in different coordinate frames." %}

### 9.2 Integrating a Gyroscope

If the body angular velocity is constant over a step $\Delta t$, the exact solution of $\dot R=R\omega_b^\wedge$ is

$$
R_{k+1}=R_k\,\mathrm{Exp}(\omega_b\Delta t).
$$

This stays exactly on $SO(3)$. The naive Euler step $R_{k+1}=R_k(I+\omega_b^\wedge\Delta t)$ leaves the group (the result is no longer orthogonal) and drifts. Integrating body-frame rates as if they were world-frame rates, i.e. multiplying on the wrong side, produces an estimator that is slowly and silently wrong.

### 9.3 Euler-Angle Rates Are Not Angular Velocity

For ZYX angles $(\psi,\theta,\phi)$, the body rates $(p,q,r)=\omega_b$ relate to the angle rates by

$$
\begin{bmatrix}\dot\phi\\ \dot\theta\\ \dot\psi\end{bmatrix}=
\begin{bmatrix}1&\sin\phi\tan\theta&\cos\phi\tan\theta\\0&\cos\phi&-\sin\phi\\0&\sin\phi/\cos\theta&\cos\phi/\cos\theta\end{bmatrix}
\begin{bmatrix}p\\q\\r\end{bmatrix}.
$$

The matrix blows up at $\theta=\pm90^\circ$: gimbal lock appears as a singularity in the kinematics. Integrating $\dot R=R\omega_b^\wedge$ (or the quaternion equivalent) never has this problem.

## 10. SE(3): Rigid Poses as a Lie Group

Rigid-body poses in 3D form

$$
SE(3)=\left\lbrace\begin{bmatrix}R&t\\0^\top&1\end{bmatrix}\ \middle|\ R\in SO(3),\ t\in\mathbb R^3\right\rbrace,
$$

with homogeneous-matrix multiplication as the group operation:

$$
\begin{bmatrix}R_1&t_1\\0^\top&1\end{bmatrix}\begin{bmatrix}R_2&t_2\\0^\top&1\end{bmatrix}=\begin{bmatrix}R_1R_2&R_1t_2+t_1\\0^\top&1\end{bmatrix}.
$$

The term $R_1t_2$ is the reason a pose is not "three numbers for rotation plus three for translation": translation is rotated during composition. This coupling is exactly what makes the group structure useful for odometry chains, camera extrinsics, manipulator kinematics, and pose graphs.

## 11. Twists and se(3)

### 11.1 The Lie Algebra

The Lie algebra $\mathfrak{se}(3)$ contains **twists**. In these notes a twist is ordered linear part first, angular part second:

$$
\xi=\begin{bmatrix}\rho\\ \phi\end{bmatrix}\in\mathbb R^6,\qquad
\xi^\wedge=\begin{bmatrix}\phi^\wedge&\rho\\0^\top&0\end{bmatrix}.
$$

(Many references, including some robotics libraries, use the opposite order. Check before copying formulas.)

### 11.2 The Exponential

Since $(\xi^\wedge)^k$ has the block form $$\begin{bmatrix}(\phi^\wedge)^k&(\phi^\wedge)^{k-1}\rho\\0&0\end{bmatrix}$$, the series gives

$$
\mathrm{Exp}(\xi)=\begin{bmatrix}\mathrm{Exp}(\phi)&V(\phi)\,\rho\\0^\top&1\end{bmatrix},\qquad
V(\phi)=I+\frac{1-\cos\theta}{\theta^2}\phi^\wedge+\frac{\theta-\sin\theta}{\theta^3}(\phi^\wedge)^2,
$$

with $\theta=\lVert\phi\rVert$. The matrix $V$ (which is also the left Jacobian of $SO(3)$, section 13) is the correction for the fact that translation and rotation happen *simultaneously*. The logarithm inverts this: extract $\phi=\mathrm{Log}(R)$, then $\rho=V(\phi)^{-1}t$.

### 11.3 Velocities as Twists

For a time-varying pose $T(t)$, the spatial and body twists are

$$
\xi_s^\wedge=\dot TT^{-1},\qquad\xi_b^\wedge=T^{-1}\dot T,
$$

so that $\dot T=\xi_s^\wedge T=T\xi_b^\wedge$. They are the same physical rigid-body velocity in different frames, related by the adjoint (section 12).

### 11.4 Worked Example: A Constant Twist Is an Arc

Take $\phi=(0,0,\pi/2)$ (turn $90^\circ$ about $z$) and $\rho=(\pi/2,0,0)$ (move forward at speed $\pi/2$), applied for unit time. Naively, one might say the pose translates by $(\pi/2,0,0)\approx(1.571,0,0)$. Compute $V\rho$ with $\theta=\pi/2$:

- $\frac{1-\cos\theta}{\theta^2}=\frac{4}{\pi^2}$ and $\phi^\wedge\rho=(0,\ \pi^2/4,\ 0)$, contributing $(0,1,0)$;
- $\frac{\theta-\sin\theta}{\theta^3}=\frac{\pi/2-1}{\pi^3/8}$ and $(\phi^\wedge)^2\rho=(-\pi^3/8,0,0)$, contributing $(-(\pi/2-1),0,0)$.

So $V\rho=(\pi/2,0,0)+(0,1,0)+(1-\pi/2,0,0)=(1,1,0)$. The exponential lands at position $(1,1,0)$ facing along $y$: exactly the end of a quarter circle of radius 1, which is what a robot driving forward while turning at a constant rate does. Integrating the ODE $\dot T=T\xi^\wedge$ numerically gives the same point. More generally, **Chasles' theorem** says every rigid motion is a screw motion (rotation about an axis plus translation along it), and the exponential of a constant twist traces exactly that screw.

## 12. The Adjoint: Moving Velocities and Perturbations Between Frames

### 12.1 Definition and Derivation

How does a twist expressed in one frame look in another? Conjugate by the pose: $T\xi^\wedge T^{-1}$ is again in $\mathfrak{se}(3)$, and it equals $$(\mathrm{Ad}_T\,\xi)^\wedge$$ for the $6\times6$ **adjoint matrix**

$$
\mathrm{Ad}_T=\begin{bmatrix}R&t^\wedge R\\0&R\end{bmatrix}\qquad\text{for }T=\begin{bmatrix}R&t\\0^\top&1\end{bmatrix},\ \xi=[\rho;\phi].
$$

To see it, multiply out $T\xi^\wedge T^{-1}$: the rotation block is $R\phi^\wedge R^\top=(R\phi)^\wedge$, and the translation block is $R\rho-(R\phi)^\wedge t=R\rho+t^\wedge R\phi$.

So the angular part rotates by $R$, and the linear part rotates and picks up a lever-arm term $t\times(R\phi)$: a rotation about a distant axis produces linear velocity at the origin. The spatial and body twists are related by

$$
\xi_s=\mathrm{Ad}_T\,\xi_b.
$$

The adjoint also moves exponentials: $$T\,\mathrm{Exp}(\xi)\,T^{-1}=\mathrm{Exp}(\mathrm{Ad}_T\xi)$$, which converts right perturbations into left ones.

{% include figure.html image="/assets/img/posts/lie-groups-robotics/adjoint-twist-frame-map.svg" alt="Twist vector transformed between coordinate frames using the SE(3) adjoint." caption="The adjoint is the bookkeeping tool that transforms twists, perturbations, and covariance-like quantities between frames." %}

### 12.2 The Algebra Adjoint

The infinitesimal version is

$$
\mathrm{ad}_\xi=\begin{bmatrix}\phi^\wedge&\rho^\wedge\\0&\phi^\wedge\end{bmatrix},\qquad\mathrm{ad}_\xi\eta=[\xi^\wedge,\eta^\wedge]^\vee,
$$

with $$\mathrm{Ad}_{\mathrm{Exp}(\xi)}=\exp(\mathrm{ad}_\xi)$$. For $SO(3)$ alone, both reduce to simple forms: $$\mathrm{Ad}_R=R$$ and $$\mathrm{ad}_\phi=\phi^\wedge$$.

### 12.3 Moving Covariances

Because perturbations transform with the adjoint, so do their covariances. If a body-frame tangent perturbation has covariance $P_b$, the corresponding spatial-frame covariance is

$$
P_s=\mathrm{Ad}_T\,P_b\,\mathrm{Ad}_T^\top.
$$

## 13. BCH and the Jacobians of SO(3)

### 13.1 Why Jacobians Appear

In estimation and optimization we constantly need: "if I perturb the rotation vector $\phi$ a little, how does $\mathrm{Exp}(\phi)$ change?" Because of non-commutativity, $\mathrm{Exp}(\phi+\delta\phi)\neq\mathrm{Exp}(\phi)\mathrm{Exp}(\delta\phi)$. The first-order BCH correction is captured exactly by the **left and right Jacobians** of $SO(3)$:

$$
\mathrm{Exp}(\phi+\delta\phi)\approx\mathrm{Exp}(\phi)\,\mathrm{Exp}\big(J_r(\phi)\,\delta\phi\big)\approx\mathrm{Exp}\big(J_l(\phi)\,\delta\phi\big)\,\mathrm{Exp}(\phi).
$$

### 13.2 Closed Forms

With $\theta=\lVert\phi\rVert$ and $u=\phi/\theta$:

$$
J_l(\phi)=I+\frac{1-\cos\theta}{\theta^2}\phi^\wedge+\frac{\theta-\sin\theta}{\theta^3}(\phi^\wedge)^2,\qquad J_r(\phi)=J_l(-\phi),
$$

$$
J_l^{-1}(\phi)=\frac\theta2\cot\frac\theta2\,I+\Big(1-\frac\theta2\cot\frac\theta2\Big)uu^\top-\frac\theta2u^\wedge.
$$

$J_l$ is the same matrix $V$ that appeared in the $SE(3)$ exponential. $J_l^{-1}$ is singular when $\theta=2k\pi$, $k\neq0$, which is one more reason to keep rotation vectors in $(-\pi,\pi]$. For small $\theta$, $J_l\approx I+\frac12\phi^\wedge$.

### 13.3 Using Them

A typical use is to propagate an increment through the logarithm:

$$
\mathrm{Log}\big(\mathrm{Exp}(\phi)\,\mathrm{Exp}(\delta)\big)\approx\phi+J_r^{-1}(\phi)\,\delta.
$$

This appears in IMU preintegration, in the Jacobians of rotation residuals, and in covariance propagation for orientations.

## 14. Calculus with Plus and Minus

### 14.1 Box-Plus and Box-Minus

Optimization and filtering code wants vector increments. Lie groups provide them without leaving the manifold. With the **right perturbation** convention,

$$
X\oplus\delta:=X\,\mathrm{Exp}(\delta),\qquad Y\ominus X:=\mathrm{Log}(X^{-1}Y).
$$

{% include figure.html image="/assets/img/posts/lie-groups-robotics/exp-log-plus-minus.svg" alt="Pose on manifold, tangent perturbation, exponential update, and logarithm residual." caption="The exp/log maps let estimators and optimizers use vector increments while preserving pose geometry." %}

### 14.2 Jacobians on the Group

The derivative of a function $f$ between groups is defined through these operations:

$$
\frac{Df(X)}{DX}=\lim_{\delta\to0}\frac{f(X\oplus\delta)\ominus f(X)}{\delta}.
$$

Each column says how the output moves, in its tangent space, when the input is nudged along one tangent direction. Covariance then propagates as $P_y\approx JP_xJ^\top$.

### 14.3 Worked Jacobians for SO(3)

All with right perturbations, using $\mathrm{Exp}(\delta)\approx I+\delta^\wedge$.

**Rotating a point.** $f(R)=Rp$. Then $R\,\mathrm{Exp}(\delta)p\approx Rp+R\delta^\wedge p=Rp-R\,p^\wedge\delta$, so

$$
\frac{\partial(Rp)}{\partial\delta}=-R\,p^\wedge.
$$

With a left perturbation $\mathrm{Exp}(\delta)R$, the same computation gives $-(Rp)^\wedge$. The Jacobian depends on the convention.

**Composition.** $f(R_1,R_2)=R_1R_2$. Perturbing $R_2$: $R_1R_2\mathrm{Exp}(\delta)$, so the Jacobian is $I$. Perturbing $R_1$: $R_1\mathrm{Exp}(\delta)R_2=R_1R_2\,\mathrm{Exp}(R_2^\top\delta)$ (using the adjoint), so the Jacobian is $R_2^\top$.

**Inverse.** $(R\,\mathrm{Exp}(\delta))^{-1}=\mathrm{Exp}(-\delta)R^\top=R^\top\mathrm{Exp}(-R\delta)$, so the Jacobian is $$-R=-\mathrm{Ad}_R$$.

These small rules, chained together, give the Jacobian of any residual you will meet. A Jacobian derived for $T^+=T\,\mathrm{Exp}(\delta)$ is *not* correct for $T^+=\mathrm{Exp}(\delta)T$: mixing conventions is one of the most common bugs in estimation code. Always verify a hand-derived Jacobian against finite differences.

## 15. Optimization on the Group

### 15.1 Gauss-Newton with a Manifold Update

To estimate a rotation from data, minimize a sum of squared residuals over $SO(3)$. Point-set alignment is the cleanest example: given matched points $p_i$ and $q_i\approx Rp_i$, minimize $\sum_i\lVert q_i-Rp_i\rVert^2$.

Linearize each residual with a right perturbation, $r_i(R\,\mathrm{Exp}(\delta))\approx r_i(R)+J_i\delta$, where, from section 14.3,

$$
r_i=q_i-Rp_i,\qquad J_i=R\,p_i^\wedge.
$$

The Gauss-Newton step solves the $3\times3$ normal equations $\big(\sum J_i^\top J_i\big)\delta=-\sum J_i^\top r_i$, and the update is applied **on the group**, $R\leftarrow R\,\mathrm{Exp}(\delta)$. The optimization variable is always a valid rotation; only the step lives in $\mathbb R^3$.

```python
import numpy as np

def hat(w):
    return np.array([[0, -w[2], w[1]],
                     [w[2], 0, -w[0]],
                     [-w[1], w[0], 0]])

def Exp(phi):
    th = np.linalg.norm(phi)
    if th < 1e-12:
        return np.eye(3) + hat(phi)
    K = hat(phi / th)
    return np.eye(3) + np.sin(th) * K + (1 - np.cos(th)) * K @ K

def fit_rotation(P, Q, R=np.eye(3), iters=10):
    """Find R minimizing sum ||q_i - R p_i||^2 by Gauss-Newton on SO(3)."""
    for _ in range(iters):
        H = np.zeros((3, 3))
        g = np.zeros(3)
        for p, q in zip(P, Q):
            r = q - R @ p               # residual
            J = R @ hat(p)              # d r / d delta  for  R <- R Exp(delta)
            H += J.T @ J
            g += J.T @ r
        delta = np.linalg.solve(H, -g)
        R = R @ Exp(delta)              # update on the manifold
        if np.linalg.norm(delta) < 1e-12:
            break
    return R
```

With 20 random points rotated by a $2.4$ rad rotation and corrupted by noise of standard deviation $0.01$, this converges from the identity in a few iterations to within about $0.2^\circ$ of the truth, and the result is orthogonal to machine precision. The same pattern, with $SE(3)$ and many poses, is the core of pose-graph SLAM and bundle adjustment; Levenberg-Marquardt adds damping as described in the [numerical optimization note]({% post_url 2025-01-15-numerical-linear-algebra-optimization %}).

### 15.2 A Closed-Form Check: Kabsch/Umeyama

For point alignment specifically, there is a closed-form solution. Center both point sets, form $H=\sum_ip_iq_i^\top$, take the SVD $H=U\Sigma V^\top$, and set

$$
R=V\,\mathrm{diag}\big(1,1,\det(VU^\top)\big)\,U^\top.
$$

The determinant correction prevents a reflection. The closed form is a good initializer and a good test for an iterative solver.

## 16. Uncertainty on Lie Groups

A Gaussian cannot live directly on $SO(3)$: the group is curved and bounded. The standard construction is a **concentrated Gaussian** defined in the tangent space around a mean:

$$
R=\bar R\,\mathrm{Exp}(\varepsilon),\qquad\varepsilon\sim\mathcal N(0,\Sigma).
$$

$\Sigma$ is an ordinary $3\times3$ covariance, interpreted in the body frame of $\bar R$ (for right perturbations). Operations on uncertain poses then follow from the Jacobians:

- **Composition** $R_1R_2$: $\Sigma\approx R_2^\top\Sigma_1R_2+\Sigma_2$ (from the composition Jacobians in section 14.3).
- **Change of frame**: through the adjoint, $\mathrm{Ad}\,\Sigma\,\mathrm{Ad}^\top$.
- **Mean of several rotations**: iterate $\bar R\leftarrow\bar R\,\mathrm{Exp}\big(\frac1N\sum_i\mathrm{Log}(\bar R^\top R_i)\big)$ until the update vanishes. This is the 3D version of averaging headings on the circle (section 1.2).

These approximations are accurate when the uncertainty is small compared with the curvature (say, standard deviations of a few tens of degrees or less).

## 17. Estimation: From Bayes Filters to the Error-State EKF

### 17.1 State and Kinematics

A Bayes or Kalman filter needs a state that makes the future conditionally independent of the past given the present and the inputs. For a moving robot, position alone is not enough; velocity, orientation, and sensor biases belong in the state. A typical visual-inertial state is

$$
x=\lbrace p,\ v,\ q,\ b_g,\ b_a\rbrace
$$

(position, velocity, orientation, gyroscope bias, accelerometer bias; sometimes gravity and camera extrinsics too). With gyroscope reading $\omega_m$ and accelerometer reading $a_m$ (both in the body frame), the continuous-time kinematics are

$$
\dot R=R\,(\omega_m-b_g-n_g)^\wedge,\qquad\dot v=R\,(a_m-b_a-n_a)+g,\qquad\dot p=v,
$$

with slowly varying biases driven by small noise. The orientation equation is the body-frame kinematics of section 9.

### 17.2 Why an Error State

Most components can be perturbed by addition, but orientation is perturbed by composition:

$$
R=\hat R\,\mathrm{Exp}(\delta\theta),\qquad\text{or in quaternions}\qquad q=\hat q\otimes\delta q,\quad\delta q\approx\begin{bmatrix}1\\ \frac12\delta\theta\end{bmatrix}.
$$

The **error-state EKF** keeps two things apart:

- the **nominal state** $\hat x$, which carries the actual pose-like quantities and is integrated with the full nonlinear kinematics (staying on the group);
- the **error state** $\delta x=(\delta p,\delta v,\delta\theta,\delta b_g,\delta b_a)\in\mathbb R^{15}$, which is small, lives in a vector space, and carries the covariance.

The cycle is: **predict** by integrating IMU measurements into the nominal state and propagating the error covariance with the linearized error dynamics; **update** by comparing predicted and actual measurements (e.g. camera features) to estimate $\delta x$; **inject** the error into the nominal state ($\hat R\leftarrow\hat R\,\mathrm{Exp}(\delta\theta)$, $\hat p\leftarrow\hat p+\delta p$, ...); and **reset** the error to zero.

{% include figure.html image="/assets/img/posts/lie-groups-robotics/error-state-vio-loop.svg" alt="Visual-inertial error-state filtering loop with IMU prediction, camera feature update, tangent error, and nominal state reset." caption="Error-state visual-inertial estimation keeps the nominal orientation on the manifold while the covariance evolves in a local tangent vector." %}

### 17.3 Innovations Must Respect Geometry

For Euclidean measurements, the innovation is a subtraction. For an orientation measurement, the innovation should be a logarithm of a relative rotation, $\mathrm{Log}(\hat R^\top R_{\text{meas}})$, never a component-wise difference of quaternions or Euler angles.

## 18. Camera Geometry and Pose Estimation

A calibrated pinhole camera maps a 3D point to an image ray. With intrinsics $K$ and a camera pose $T_{CW}$ that maps world coordinates into camera coordinates,

$$
\lambda\begin{bmatrix}u\\v\\1\end{bmatrix}=K\begin{bmatrix}I&0\end{bmatrix}T_{CW}\begin{bmatrix}X_W\\1\end{bmatrix}.
$$

The scalar $\lambda$ is depth. An image measurement gives a ray, not a point, unless depth or multiple views are available.

**Perspective-n-Point (PnP)** estimates the camera pose from known 3D points and their 2D projections. Fiducials such as AprilTags make it concrete: the tag's corners are known in the tag frame, their pixels are detected, and the pose is found by minimizing **reprojection error**

$$
\min_{T_{CW}}\sum_i\big\lVert z_i-\pi\big(K,\ T_{CW}X_i\big)\big\rVert^2
$$

over $SE(3)$, with Gauss-Newton or Levenberg-Marquardt steps $T_{CW}\leftarrow T_{CW}\,\mathrm{Exp}(\delta\xi)$ exactly as in section 15. The residual lives in pixel space; the correction lives in the tangent space of $SE(3)$.

This is where the pieces meet:

- IMU prediction integrates body-frame angular velocity and acceleration on the group;
- the camera update constrains pose through projection geometry;
- the estimator stores orientation uncertainty as a local three-vector;
- every update uses group composition, never raw vector addition.

## 19. Practical Robotics Checklist

Keep this list next to the code:

- Define whether $T_{AB}$ maps coordinates from $B$ to $A$ or the reverse.
- Define left or right perturbations, and derive every Jacobian in that convention.
- Define twist ordering: linear-then-angular (these notes) or angular-then-linear.
- Define whether angular velocities are body/sensor-frame or world-frame.
- Define the quaternion convention: scalar first or last, Hamilton or JPL product.
- Normalize quaternions after integration, but do not use normalization as a substitute for correct kinematics.
- Integrate rotations with $\mathrm{Exp}$, not by adding small matrices.
- Use $\mathrm{Log}(R_1^\top R_2)$ or $\mathrm{Log}(T_1^{-1}T_2)$ for residuals; keep covariances in tangent coordinates.
- Handle the small-angle and near-$\pi$ branches of $\mathrm{Exp}$, $\mathrm{Log}$, and $J^{-1}$.
- Check every analytic Jacobian against finite differences.
- Test with nonzero rotation *and* translation; pure translations hide frame-order mistakes.

## 20. Summary

| Object | Group | Algebra element | Exp | Log |
|---|---|---|---|---|
| Planar rotation | $SO(2)$ | angle $\theta$ | $I\cos\theta+G\sin\theta$ | angle wrapped to $(-\pi,\pi]$ |
| 3D rotation | $SO(3)$ | $\phi\in\mathbb R^3$ | Rodrigues | $\theta=\arccos\frac{\mathrm{tr}R-1}{2}$, axis from $R-R^\top$ |
| Rigid motion | $SE(3)$ | $\xi=[\rho;\phi]\in\mathbb R^6$ | $[\mathrm{Exp}(\phi),\ V\rho]$ | $\phi=\mathrm{Log}R$, $\rho=V^{-1}t$ |

| Operation | Formula (right perturbations) |
|---|---|
| Plus / minus | $X\oplus\delta=X\,\mathrm{Exp}(\delta)$, $Y\ominus X=\mathrm{Log}(X^{-1}Y)$ |
| Body kinematics | $\dot R=R\omega_b^\wedge$, $R_{k+1}=R_k\mathrm{Exp}(\omega_b\Delta t)$ |
| Adjoint ($SE(3)$) | $$\mathrm{Ad}_T=\begin{bmatrix}R&t^\wedge R\\0&R\end{bmatrix}$$, $$\xi_s=\mathrm{Ad}_T\xi_b$$ |
| Jacobians | $\partial(Rp)/\partial\delta=-Rp^\wedge$; composition $R_2^\top$, $I$; inverse $-R$ |
| BCH, first order | $\mathrm{Exp}(\phi+\delta)\approx\mathrm{Exp}(\phi)\mathrm{Exp}(J_r(\phi)\delta)$ |
| Uncertainty | $R=\bar R\,\mathrm{Exp}(\varepsilon)$, $\varepsilon\sim\mathcal N(0,\Sigma)$ |

Lie groups make robotics calculations compositional. They let us chain frames, integrate angular velocity, express rigid-body velocity as twists, move velocities and uncertainty between frames, compute residuals, and optimize without violating rotation constraints. They also explain why robotics code can look almost right while being badly wrong: the formulas are short, but every one carries a convention. Most bugs come not from forgetting $SO(3)$ exists, but from mixing body and world frames, active and passive transforms, or left and right perturbations.

**Where to go next:** manipulator Jacobians and screw theory; pose-graph SLAM; IMU preintegration on manifolds; invariant EKFs; bundle adjustment; Lie-group variational integrators; trajectory optimization on $SE(3)$.

## References and Reading Guide

- T. D. Barfoot, _State Estimation for Robotics_ (Cambridge, 2017; 2nd ed. 2024). Chapters on matrix Lie groups, perturbations, and pose estimation; the twist ordering used here follows this book.
- J. Solà, J. Deray, and D. Atchuthan, "A micro Lie theory for state estimation in robotics," arXiv:1812.01537, 2018. The best short reference for plus/minus, Jacobians, and their conventions.
- J. Solà, "Quaternion kinematics for the error-state Kalman filter," arXiv:1711.02508, 2017. Error-state EKF, quaternion conventions, IMU kinematics.
- R. M. Murray, Z. Li, and S. S. Sastry, _A Mathematical Introduction to Robotic Manipulation_ (CRC, 1994). Twists, screws, the adjoint, and manipulator kinematics.
- K. M. Lynch and F. C. Park, _Modern Robotics_ (Cambridge, 2017). Chapters 3-4 on rigid-body motions and the product of exponentials.
- E. Eade, "Lie Groups for 2D and 3D Transformations," technical note.
- C. Forster, L. Carlone, F. Dellaert, and D. Scaramuzza, "On-Manifold Preintegration for Real-Time Visual-Inertial Odometry," _IEEE T-RO_ 33(1), 2017.
- 2018 robotics lecture materials: transformations, rotations, rotations and velocities, twists, Bayesian filtering, Kalman filter, visual-inertial fusion, extended Kalman filter, camera model, and PnP.
