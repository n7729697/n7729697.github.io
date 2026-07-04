---
title: Lie group and lie algebra for robotics
tags: [lie group, matrix, lie algebra]
style: fill
color: light
description: SE(2) is the Special Euclidean group in two dimensions, and it’s fundamental in robotics, control, and computer vision for describing rigid-body motions (translations + rotations) in a 2D plane.
---

_This note is a personal robotics-geometry synthesis. I have not attached a specific university course code to this version because the source note did not identify one._

## Central Question

Lie groups in robotics ask: **how can we compute with rigid-body poses without pretending that rotations are ordinary Euclidean vectors?**

Robots move on nonlinear spaces. A 3D rotation matrix has nine entries but only three degrees of freedom. A pose in $SE(3)$ combines rotation and translation, but pose composition is not vector addition. Lie theory gives the bridge:

- the group describes finite transformations,
- the algebra describes local perturbations,
- exponential and logarithm maps move between them.

{% include figure.html image="/assets/img/posts/lie-groups-robotics/group-algebra-robotics-map.svg" alt="Robotics Lie group map showing poses on SE(3), twists in se(3), and exponential/logarithm maps between them." caption="Robotics uses Lie groups for finite poses and Lie algebras for local increments, velocities, residuals, and optimization variables." %}

## 1. Frames, Vectors, and Rigid Motion

A vector is physical, but its coordinates depend on a frame. If the basis is $[\mathbf e_1,\mathbf e_2,\mathbf e_3]$, then

$$
\mathbf a=[\mathbf e_1,\mathbf e_2,\mathbf e_3]
\begin{bmatrix}a_1\\a_2\\a_3\end{bmatrix}.
$$

Rigid motion preserves distances and angles. In coordinates, a point transforms as

$$
p'=Rp+t,
$$

where $R$ is a rotation and $t$ is a translation. Homogeneous coordinates package this into

$$
T=
\begin{bmatrix}
R&t\\
0^\top&1
\end{bmatrix}.
$$

{% include figure.html image="/assets/img/posts/lie-groups-robotics/frame-transform-pose.svg" alt="Two coordinate frames with a point represented by rotation and translation between frames." caption="A pose is a relationship between frames: the same physical point has different coordinates depending on rotation and translation." %}

## 2. Rotation Representations

Valid rotation matrices form

$$
SO(3)=\{R\in\mathbb R^{3\times3}\mid RR^\top=I,\ \det R=1\}.
$$

Euler angles are intuitive but singular. Axis-angle vectors are compact but need exponential/logarithm care near special angles. Unit quaternions avoid gimbal lock and are efficient for interpolation, but they live on $S^3$ and double-cover $SO(3)$.

For a unit axis $a$ and angle $\theta$, Rodrigues' formula is

$$
R=\cos\theta I+(1-\cos\theta)aa^\top+\sin\theta a^\wedge.
$$

Here $a^\wedge$ is the skew-symmetric matrix satisfying

$$
a^\wedge b=a\times b.
$$

{% include figure.html image="/assets/img/posts/lie-groups-robotics/rotation-representation-tradeoffs.svg" alt="Comparison of rotation matrix, Euler angles, quaternion, and axis-angle representations." caption="Rotation representations trade constraints, singularities, redundancy, and computational convenience." %}

## 3. Lie Groups: SO(3) and SE(3)

A group has closure, associativity, identity, and inverse. A Lie group is also a smooth manifold, so group operations are smooth.

For rotations:

$$
SO(3)=\{R\mid RR^\top=I,\det R=1\}.
$$

For rigid poses:

$$
SE(3)=\left\{
\begin{bmatrix}
R&t\\
0^\top&1
\end{bmatrix}
\middle| R\in SO(3),\ t\in\mathbb R^3
\right\}.
$$

Composition is matrix multiplication:

$$
T_{ac}=T_{ab}T_{bc}.
$$

This is why pose graphs, odometry chains, manipulator forward kinematics, and camera extrinsics naturally use group operations.

## 4. Lie Algebras and Twists

The Lie algebra is the tangent space at the identity. For $SO(3)$,

$$
\mathfrak{so}(3)=\{\phi^\wedge\mid \phi\in\mathbb R^3\},
$$

with

$$
\phi^\wedge=
\begin{bmatrix}
0&-\phi_3&\phi_2\\
\phi_3&0&-\phi_1\\
-\phi_2&\phi_1&0
\end{bmatrix}.
$$

For $SE(3)$, a twist $\xi=[\rho^\top,\phi^\top]^\top$ maps to

$$
\xi^\wedge=
\begin{bmatrix}
\phi^\wedge&\rho\\
0^\top&0
\end{bmatrix}.
$$

The Lie bracket is the matrix commutator:

$$
[X,Y]=XY-YX.
$$

For $\mathfrak{so}(3)$, this corresponds to the vector cross product.

## 5. Exponential, Logarithm, Plus, and Minus

The exponential map turns a local perturbation into a group motion:

$$
\exp:\mathfrak g\to G.
$$

The logarithm map moves a group displacement back into a tangent vector:

$$
\log:G\to\mathfrak g.
$$

For robotics optimization, these maps define box-plus and box-minus operations:

$$
x\oplus \tau := x\exp(\tau),
$$

$$
x_2\ominus x_1 := \log(x_1^{-1}x_2).
$$

This is how optimization remains unconstrained in the tangent space while the updated pose stays on the manifold.

{% include figure.html image="/assets/img/posts/lie-groups-robotics/exp-log-plus-minus.svg" alt="Pose on manifold, tangent perturbation, exponential update, and logarithm residual." caption="The exp/log maps let estimators and optimizers use vector increments while preserving pose geometry." %}

## 6. Jacobians, Adjoint, and Robotics Use

Perturbations require Jacobians on manifolds:

$$
J=\frac{Df(x)}{Dx}
=\lim_{\tau\to0}\frac{f(x\oplus\tau)\ominus f(x)}{\tau}.
$$

Covariance propagation then uses local coordinates:

$$
P_y=JP_xJ^\top.
$$

The adjoint maps twists between frames. For

$$
T=\begin{bmatrix}R&t\\0&1\end{bmatrix}\in SE(3),
$$

one common convention is

$$
\operatorname{Ad}(T)=
\begin{bmatrix}
R&t^\wedge R\\
0&R
\end{bmatrix}.
$$

The algebra adjoint is

$$
\operatorname{ad}(\xi)=
\begin{bmatrix}
\phi^\wedge&\rho^\wedge\\
0&\phi^\wedge
\end{bmatrix},
$$

and

$$
\operatorname{Ad}(\exp(\xi^\wedge))=\exp(\operatorname{ad}(\xi)).
$$

{% include figure.html image="/assets/img/posts/lie-groups-robotics/adjoint-twist-frame-map.svg" alt="Twist vector transformed between coordinate frames using the SE(3) adjoint." caption="The adjoint is the bookkeeping tool that transforms twists, perturbations, and covariance-like quantities between frames." %}

## What This Framework Lets Us Do

Lie groups let robotics algorithms compose poses, integrate velocities, compute residuals, optimize trajectories, and propagate uncertainty without violating rotation constraints.

## Where the Framework Stops Being Reliable

Conventions matter. Left versus right perturbations, body versus spatial velocity, quaternion ordering, and adjoint block order can differ across libraries. Mixing conventions silently creates wrong Jacobians and unstable estimators.

## Where the Subject Leads Next

The next steps are pose-graph SLAM, invariant EKFs, manipulator Jacobians, screw theory, visual-inertial odometry, and optimization on manifolds.

## Technical and Editorial Audit

- Replaced external and legacy image references with local original SVG figures.
- Condensed the previous long formula collection into a robotics computation path: frames, rotations, groups, algebras, exp/log, and adjoints.
- Kept core equations for $SO(3)$, $SE(3)$, wedges, twists, exp/log, plus/minus, Jacobians, and adjoints.
- Marked attribution as personal synthesis because no source course code was present.
- Flagged convention dependence as the most important practical risk.

## Main Sources Used in This Note

- T. D. Barfoot, _State Estimation for Robotics_.
- J. Sola, J. Deray, and D. Atchuthan, "A micro Lie theory for state estimation in robotics."
- R. M. Murray, Z. Li, and S. S. Sastry, _A Mathematical Introduction to Robotic Manipulation_.
- E. Eade, _Lie Groups for 2D and 3D Transformations_.
