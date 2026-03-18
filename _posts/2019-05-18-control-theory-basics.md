---
title: Control Theory Basics
tags: [control theory, system modelling, feedback control, transfer function, stability, root locus, frequency response, PID, state-space]
style: fill
color: light
description: A course-style introduction to control built around system models, dynamics, stability analysis, feedback, classical design, and the bridge to state-space and nonlinear control.
---

## 1. Why Control Starts with Dynamical Systems

Control theory is not mainly about tuning gains. It begins with a more basic question:

> What kind of system are we trying to influence, and how does it move on its own before we intervene?

That is why control is inseparable from **dynamics**.

A heater does not jump instantly to the commanded temperature because heat must accumulate in thermal mass. A positioning stage does not move instantly to the desired location because mass, damping, and elasticity all matter. A motor does not reject load disturbances automatically because its natural dynamics do not know what target we care about.

So the logic of the subject is:

1. describe the system,
2. build a model of its dynamics,
3. analyze how that model behaves,
4. decide whether the behavior is stable and acceptable,
5. then design feedback to reshape the behavior.

If [Signals & Systems]({% post_url 2020-12-12-Signal-Systems %}) gives the language of LTI models, control theory gives that language a purpose: shaping motion, regulation, and robustness in the presence of disturbances and uncertainty.

---

## 2. What a System Model Is

### 2.1 System, plant, input, output, and disturbance

A **system** is any dynamical object whose future behavior depends on its current condition and on what acts on it.

In control, we usually separate that system into the following roles:

- **plant**: the physical process we want to influence,
- **input** $u(t)$: the actuator signal we are allowed to choose,
- **output** $y(t)$: the variable we care to measure or regulate,
- **reference** $r(t)$: the desired output,
- **disturbance** $d(t)$: anything that affects the plant but is not under our command,
- **sensor**: the measurement channel that turns physical behavior into data.

This separation matters because control is not "change the system however you like." It is "use the available input channel to influence the measured output despite disturbances."

### 2.2 State, parameters, and operating point

A **state** is the smallest set of variables that, together with future inputs, determines future behavior.

Examples:

- for a heated chamber, one useful state is temperature,
- for a mass-spring-damper, position and velocity are natural states,
- for an electrical circuit, capacitor voltages and inductor currents are typical states.

Parameters such as mass, damping, stiffness, resistance, heat capacity, and time constants are not states. They do not evolve because of the current motion in the same way; they describe the plant itself.

An **operating point** is an equilibrium around which we choose to study or control the system. Real plants are often nonlinear, and a good model is usually a good model **around a chosen operating regime**, not everywhere in the universe.

### 2.3 What a model actually does

A model is not the plant. A model is a controlled simplification that keeps the dominant physics and discards the detail that does not matter for the question at hand.

Good control models usually answer these three questions:

1. what variables store energy or memory,
2. what inputs and disturbances drive those variables,
3. what output the controller will see.

The model is "good" if it is simple enough to analyze and accurate enough to support design.

### 2.4 Modelling assumptions are part of the model

When we write a control model, we are also silently making assumptions:

- small deviations around an operating point,
- rigid-body behavior instead of flexible-body vibration,
- negligible transport delay,
- linear actuator behavior,
- constant parameters,
- sensor dynamics faster than plant dynamics.

Those assumptions are not optional footnotes. They define where the control design can be trusted.

---

## 3. From Physics to Equations

To make the modelling idea concrete, keep two running examples in mind:

- a **first-order thermal process**,
- a **second-order mechanical servo**.

### 3.1 First-order example: a heated chamber

Let $\theta(t)$ denote the temperature rise above ambient. A simple energy balance gives

$$
C \dot{\theta} = -\frac{1}{R}\theta + K_h u + d,
$$

where:

- $C$ is the effective thermal capacitance,
- $R$ is the thermal resistance to ambient,
- $K_h$ converts heater command to heating power,
- $d(t)$ is an unknown heat disturbance.

This is commonly rewritten as

$$
\tau \dot{\theta} + \theta = K u + d_\theta,
$$

with $\tau = RC$.

What this means physically is simple: the chamber has one dominant stored-energy state and therefore one dominant time scale. If you stop forcing it, it forgets exponentially rather than instantly.

### 3.2 Second-order example: a position servo

For a mass-spring-damper system driven by force input $u(t)$,

$$
m \ddot{x} + b \dot{x} + kx = u + d.
$$

This model already contains the basic ingredients of servo dynamics:

- inertia $m$ resists acceleration,
- damping $b$ dissipates motion,
- stiffness $k$ pulls the position back toward equilibrium.

What this means physically is that the plant can oscillate. The system does not merely "lag"; it can overshoot, ring, and store kinetic and potential energy.

### 3.3 Input-output and state-space forms

The thermal model is naturally written as an input-output ODE. The mechanical model can also be written that way, but a state-space form makes the internal memory explicit:

$$
\dot{x}_1 = x_2,
\qquad
\dot{x}_2 = -\frac{k}{m}x_1 - \frac{b}{m}x_2 + \frac{1}{m}u + \frac{1}{m}d,
$$

with output

$$
y = x_1.
$$

In matrix form,

$$
\dot{x} = Ax + Bu + Ed,
\qquad
y = Cx.
$$

Input-output models are often enough for classical loop design. State-space models are better when we care about internal modes, multiple states, multiple inputs, or structured modern design.

### 3.4 Nonlinear models and linearization

A general nonlinear plant may be written as

$$
\dot{x} = f(x,u,d), \qquad y = h(x,u,d).
$$

Around an equilibrium $(x_0,u_0,d_0)$ satisfying

$$
f(x_0,u_0,d_0) = 0,
$$

small deviations obey the linearized model

$$
\delta \dot{x} = A \delta x + B \delta u + E \delta d,
\qquad
\delta y = C \delta x + D \delta u + F \delta d,
$$

where the matrices are Jacobians evaluated at the operating point.

What this means physically is that even nonlinear plants often look locally linear near the regime where we intend to control them. Classical control lives inside that local picture.

---

## 4. Dynamics Before Control

Before drawing a feedback loop, we should ask how the plant behaves by itself.

### 4.1 Natural response and forced response

Any linear response can be understood as the sum of:

- the **natural response**, caused by stored initial energy,
- the **forced response**, caused by external inputs and disturbances.

For the heated chamber with $u=d_\theta=0$,

$$
\theta(t) = \theta(0)e^{-t/\tau}.
$$

For an underdamped second-order system,

$$
x_n(t) = e^{-\zeta \omega_n t}\left(A \cos \omega_d t + B \sin \omega_d t\right),
$$

where

$$
\omega_d = \omega_n \sqrt{1-\zeta^2}.
$$

What this means physically is that the unforced system already contains the seeds of its future behavior. Control does not create dynamics from nothing; it reshapes the existing ones.

### 4.2 Equilibrium and operating behavior

An **equilibrium** is a condition where the state does not change if the inputs remain fixed.

For the thermal plant, equilibrium means heating exactly balances heat loss. For the mechanical plant, equilibrium means force balance with zero velocity and zero acceleration.

Once a plant is perturbed away from equilibrium, the most important questions are:

- does it return,
- how fast does it return,
- does it oscillate on the way back,
- does it settle to the correct value under forcing?

Those are the raw ingredients of control performance.

### 4.3 Transient versus steady behavior

Control design always balances two time scales:

- **transient behavior**: what happens immediately after a change,
- **steady behavior**: what remains after transients have died out.

Students often jump too fast to steady-state error formulas. But a real controller is judged by both:

- whether it reaches the desired point,
- and whether the path it takes is safe, fast, smooth, and robust.

### 4.4 Poles and eigenvalues as geometry of motion

For linear systems, poles or eigenvalues are the compact summary of natural motion.

- a real negative pole means monotone decay,
- a complex left-half-plane pair means decaying oscillation,
- a pole near the imaginary axis means weak damping and slow settling,
- a right-half-plane pole means the mode grows instead of dying away.

What this means physically is that pole location is a geometry of speed and oscillation. Control design will eventually become the art of moving that geometry.

---

## 5. What Stability Analysis Is Trying to Answer

Stability is not a decorative theorem topic. It is the first pass/fail test of whether a controller deserves to exist.

### 5.1 Internal stability and BIBO stability

Two stability ideas are worth separating.

**Internal stability** asks:

> If I perturb the state and then stop exciting the system, do the internal variables return to equilibrium?

**BIBO stability** asks:

> If the input stays bounded, does the output stay bounded?

For minimal LTI systems these notions line up closely, but conceptually they answer different questions. Internal stability cares about hidden modes. BIBO stability cares about what the external world sees at the output.

### 5.2 Asymptotic, marginal, and unstable behavior

For continuous-time LTI systems:

- all poles in the left half plane -> asymptotically stable,
- poles on the imaginary axis with no decay -> marginal case requiring care,
- any right-half-plane pole -> unstable.

Examples:

- the thermal chamber is asymptotically stable in open loop if $\tau > 0$,
- the undamped oscillator is marginal,
- an inverted pendulum linearized upright is open-loop unstable.

### 5.3 Why stability comes before tuning

The question is not "Can I reduce the error?" The question is "Can I reduce the error **without creating divergence or unacceptable oscillation**?"

This is why classical design tools are organized around stability:

- Routh-Hurwitz asks whether a polynomial can be stable at all,
- root locus asks how poles move as gain changes,
- Nyquist and Bode margins ask how much modelling error the loop can tolerate.

Only after stability is understood does controller tuning become meaningful.

### 5.4 Stability is necessary, not sufficient

A stable loop may still be bad:

- too slow,
- too oscillatory,
- too sensitive to noise,
- too fragile to parameter error,
- too aggressive for actuator limits.

So control design is never only "stabilize the plant." It is "stabilize it with acceptable performance and robustness."

---

## 6. LTI Modelling Tools: Laplace, Transfer Functions, and Pole-Zero Maps

Once the model is linear and time-invariant around an operating point, Laplace transforms turn differential equations into algebra.

### 6.1 Transfer function under zero initial conditions

The transfer function is defined by

$$
G(s) = \frac{Y(s)}{U(s)}
$$

under zero initial conditions.

That zero-initial-condition phrase matters. A transfer function describes how input shapes output; it does not by itself carry the full memory of arbitrary initial state.

### 6.2 Transfer functions of the running examples

For the heated chamber,

$$
G_\theta(s) = \frac{\Theta(s)}{U(s)} = \frac{K}{\tau s + 1}.
$$

For the mass-spring-damper,

$$
G_x(s) = \frac{X(s)}{U(s)} = \frac{1}{m s^2 + b s + k}.
$$

What this means physically is that the first plant has one dominant mode and the second has two interacting modes. The order of the denominator reflects the amount of dynamic memory that matters.

### 6.3 Poles and zeros

- **poles** are roots of the denominator,
- **zeros** are roots of the numerator.

Poles govern natural motion. Zeros shape how inputs are filtered and how transient responses are bent.

Zeros do not by themselves create instability, but they can make control harder, especially when they introduce phase lag or non-minimum-phase behavior.

### 6.4 Why transfer functions are so useful

Transfer functions are powerful because they compress several ideas into one object:

- interconnections become algebraic,
- poles summarize stability-relevant dynamics,
- zeros summarize input-output shaping,
- frequency response is obtained by evaluating $G(j\omega)$.

This is why classical control can move quickly between equations, geometry, and design plots.

---

## 7. Feedback Structure and Closed-Loop Logic

Now that the plant model exists, control can begin.

### 7.1 Open loop versus closed loop

In **open-loop control**, we choose the actuator input without checking whether the output followed the command.

In **closed-loop control**, we measure the output, compare it with the reference, and drive the error toward zero.

The common negative-feedback structure is:

- reference $r(t)$,
- error $e(t) = r(t) - y_m(t)$,
- controller $D(s)$,
- plant $G(s)$,
- sensor or feedback path $H(s)$.

Closed loop is powerful because it reacts to disturbances and model mismatch rather than hoping the original command was perfect.

### 7.2 Closed-loop transfer function

For the standard loop,

$$
E(s) = R(s) - H(s)Y(s),
\qquad
U(s) = D(s)E(s),
\qquad
Y(s) = G(s)U(s).
$$

Hence,

$$
\frac{Y(s)}{R(s)} = \frac{D(s)G(s)}{1 + D(s)G(s)H(s)}.
$$

For unity feedback, $H(s)=1$ and the loop gain is

$$
L(s) = D(s)G(s).
$$

What this means physically is that control changes the denominator of the system. The closed-loop characteristic equation

$$
1 + L(s) = 0
$$

determines the new poles, so feedback is literally a way of reshaping the plant's dynamics.

### 7.3 Disturbance rejection and measurement tradeoffs

Feedback is attractive because the same loop that tracks reference changes can also reject disturbances. But the loop cannot improve everything at once:

- more low-frequency gain helps regulation,
- too much high-frequency gain amplifies sensor noise,
- aggressive tuning can destroy phase margin.

So the feedback loop is a tradeoff machine, not a free lunch.

---

## 8. Time-Domain Analysis: Speed, Damping, and Accuracy

Once the loop is closed, we ask what the transient and steady response look like.

### 8.1 Step-response specifications

The usual time-domain performance measures are:

- **rise time**: how quickly the response initially reaches the target,
- **settling time**: how long it takes to stay near the final value,
- **overshoot**: how far it exceeds the target,
- **steady-state error**: the remaining offset after transients die out.

These are not arbitrary metrics. They are compact proxies for speed, damping, and accuracy.

### 8.2 Standard second-order template

The most important reference model is

$$
G_{cl}(s) = \frac{\omega_n^2}{s^2 + 2 \zeta \omega_n s + \omega_n^2}.
$$

Here:

- $\omega_n$ is the natural frequency,
- $\zeta$ is the damping ratio.

Useful memory formulas are

$$
M_p \approx e^{-\pi \zeta/\sqrt{1-\zeta^2}} \times 100\%,
$$

$$
t_s \approx \frac{4}{\zeta \omega_n}.
$$

What this means physically is:

- increasing $\omega_n$ usually makes the loop faster,
- increasing $\zeta$ usually reduces ringing,
- trying to get both at once is the main tuning tradeoff.

### 8.3 Final value and steady-state error

When the closed loop is stable, the final-value theorem gives

$$
\lim_{t \to \infty} y(t) = \lim_{s \to 0} sY(s).
$$

This lets us reason about steady-state error for step, ramp, and disturbance inputs.

One particularly important classical idea is **system type**, meaning the number of integrators in the open loop:

- Type 0 systems usually retain constant-input error,
- Type 1 systems can remove constant-input steady-state error,
- higher type improves polynomial tracking but costs robustness.

That is why integral action is so common in servo and process control, and also why it must be added carefully.

---

## 9. Classical Stability Tests and Design Views

Once we know what kind of performance we want, classical control gives several complementary views of stability and design.

### 9.1 Routh-Hurwitz criterion

Routh-Hurwitz tests whether a characteristic polynomial has any right-half-plane roots without explicitly solving for all of them.

For the cubic

$$
s^3 + a_2 s^2 + a_1 s + a_0,
$$

stability requires

$$
a_2 > 0, \qquad
a_1 > 0, \qquad
a_0 > 0, \qquad
a_2 a_1 > a_0.
$$

What this means physically is that we can rule out unstable closed-loop pole patterns directly from the controller-dependent polynomial. It is one of the fastest algebraic sanity checks in classical design.

### 9.2 Root locus

Root locus answers the question:

> If I change a gain parameter, where do the closed-loop poles go?

The key picture is:

- branches begin at open-loop poles,
- branches end at open-loop zeros or at infinity,
- the path reveals whether increasing gain helps speed or destroys damping.

This is why root locus is especially useful for first passes with `P`, `PI`, lead, and lag design.

### 9.3 Pole-zero plots

Pole-zero plots are the static geometric summary. Root locus adds the dynamic "what happens when the gain changes?" story.

Together they teach an important idea: controller tuning is pole shaping, whether done graphically, algebraically, or with state-space methods.

### 9.4 Bode plots

Bode plots evaluate the open-loop or closed-loop response across frequency.

For a first-order low-pass element,

$$
G(s) = \frac{1}{\tau s + 1},
$$

we get

$$
|G(j\omega)| = \frac{1}{\sqrt{1+(\omega \tau)^2}},
\qquad
\angle G(j\omega) = -\tan^{-1}(\omega \tau).
$$

What this means physically is that the plant follows slow variations well but lags and attenuates rapid variations. The controller must work with that limitation, not wish it away.

### 9.5 Gain margin and phase margin

Margins quantify how much extra uncertainty the loop can tolerate before it loses stability.

- **gain margin** measures how much loop gain can increase,
- **phase margin** measures how much extra phase lag can be added near crossover.

These are not just textbook numbers. They are practical robustness indicators against unmodelled dynamics, delay, and sensor/actuator imperfections.

### 9.6 Nyquist and Nichols

Nyquist connects the open-loop frequency plot to exact closed-loop stability:

$$
N = Z - P,
$$

where $N$ counts encirclements of $-1$, $P$ is the number of open-loop right-half-plane poles, and $Z$ is the number of closed-loop right-half-plane poles.

Nichols charts compress gain and phase into one plane with closed-loop performance contours. They are useful when thinking directly in loop-shaping terms rather than alternating between separate magnitude and phase plots.

Together, Bode, Nyquist, and Nichols are three views of the same problem: frequency-domain stability and robustness.

---

## 10. Sensitivity, Complementary Sensitivity, and Loop Shaping

Classical control becomes more coherent once everything is expressed through the loop gain

$$
L(s) = D(s)G(s)H(s).
$$

### 10.1 Sensitivity functions

Two central closed-loop quantities are

$$
S(s) = \frac{1}{1+L(s)},
\qquad
T(s) = \frac{L(s)}{1+L(s)}.
$$

Here:

- $S$ is the **sensitivity function**,
- $T$ is the **complementary sensitivity function**.

What this means physically is:

- small $S$ at low frequency means good disturbance rejection and good tolerance to model mismatch where regulation matters,
- small $T$ at high frequency means reduced noise transmission and less fragility to unmodelled fast dynamics.

Because

$$
S(s) + T(s) = 1,
$$

the controller cannot make both small everywhere. That is the core loop-shaping tradeoff.

### 10.2 Practical loop-shaping goals

In many servo and process loops, we want:

- high low-frequency loop gain for tracking and regulation,
- adequate phase margin near crossover for damping,
- strong high-frequency roll-off to avoid noise amplification.

So "good control" rarely means "large gain." It means gain placed in the right frequency regions.

### 10.3 Why loop shaping unifies the classical toolbox

Root locus, Bode, Nyquist, Nichols, margins, and compensator design can feel like unrelated chapters. Loop shaping is what unifies them.

Each tool is answering the same question in a different language:

> How should we reshape the open-loop dynamics so that the closed loop becomes fast enough, accurate enough, and robust enough?

---

## 11. Controllers as Model-Shaping Tools

Controllers are easiest to understand once we stop treating them as mysterious formulas and instead view them as deliberate ways of changing low-frequency gain, crossover behavior, damping, and steady-state accuracy.

### 11.1 P, PI, and PID

The standard PID controller is

$$
D(s) = K_P + \frac{K_I}{s} + K_D s.
$$

Roles of the terms:

- `P`: immediate reaction to error,
- `I`: eliminates common steady-state offsets by adding an integrator,
- `D`: adds predictive damping but is noise-sensitive.

What this means physically is:

- `P` stiffens the response,
- `I` remembers past error,
- `D` reacts to trend rather than just magnitude.

Most real loops end up at `PI` or `PID` because pure proportional control is often too biased in steady state, while integral action alone is too blunt without damping support.

### 11.2 Lead and lag compensation

A lead compensator has the form

$$
D_{lead}(s) = K \frac{1+\tau s}{1+\alpha \tau s},
\qquad
0 < \alpha < 1.
$$

A lag compensator has the form

$$
D_{lag}(s) = K \frac{1+\tau s}{1+\beta \tau s},
\qquad
\beta > 1.
$$

Interpretation:

- **lead** adds phase near crossover and often improves damping and bandwidth,
- **lag** raises low-frequency gain to improve steady-state accuracy without pushing crossover too high,
- **lead-lag** tries to do both in one design.

### 11.3 Anti-windup

Actuators saturate. When they do, the integral term may continue accumulating error that the actuator cannot physically realize. That is **integrator windup**.

Anti-windup schemes keep the controller's internal memory consistent with actuator reality, so recovery after saturation is not unnecessarily slow or oscillatory.

### 11.4 Servo design, feedforward, and 2-DOF thinking

In reference-tracking problems, feedback alone is not always the cleanest structure.

Useful additions are:

- **feedforward**, which anticipates the nominal control effort needed,
- **reference shaping**, which avoids demanding impossible transients,
- **two-degree-of-freedom control**, which lets tracking and disturbance rejection be shaped somewhat separately.

This is often where classical design starts to feel like engineering rather than pure mathematics.

---

## 12. The State-Space Bridge: Internal Structure, Controllability, and Observability

Transfer functions are excellent for single-loop classical design, but they hide internal structure.

### 12.1 Why transfer functions become limiting

Transfer functions answer an input-output question. They are less natural when:

- several states matter explicitly,
- multiple inputs and outputs interact,
- we want direct pole placement through full-state feedback,
- hidden internal modes matter for sensing or estimation.

That is why modern control reorganizes the same problem in state-space form.

### 12.2 State-space model

The standard linear model is

$$
\dot{x} = Ax + Bu,
\qquad
y = Cx + Du.
$$

The eigenvalues of $A$ are the internal-mode version of the pole picture. For minimal realizations, they line up with the transfer-function poles.

### 12.3 Controllability and observability

The controllability matrix is

$$
\mathcal{C} = \begin{bmatrix} B & AB & \cdots & A^{n-1}B \end{bmatrix}.
$$

The observability matrix is

$$
\mathcal{O} =
\begin{bmatrix}
C \\
CA \\
\vdots \\
CA^{n-1}
\end{bmatrix}.
$$

Full rank means:

- **controllable**: every mode can be influenced through the chosen actuator channel,
- **observable**: every mode leaves a visible signature in the measurements.

What this means physically is that no clever controller can move a mode it cannot actuate, and no clever observer can reconstruct a mode that never shows up in measured data.

### 12.4 Full-state feedback and pole placement

With state feedback,

$$
u = -Kx + Nr,
$$

the closed-loop matrix becomes

$$
A_{cl} = A - BK.
$$

This is the modern form of the same idea classical control has been using all along: move the poles to reshape the dynamics.

For the full state-space, observer, MIMO, and robust multivariable story, continue to [Modern, Multivariable, and Networked Control]({% post_url 2020-08-18-modern-control-foundations %}).

---

## 13. The Bridge to Nonlinear Control

Classical control mostly lives in a locally linear world, but physical plants are rarely perfectly linear.

### 13.1 Phase plane and local behavior

For second-order systems, the phase plane gives a geometric picture of state trajectories:

- one axis for position-like state,
- one axis for velocity-like state,
- curves showing attraction, oscillation, repulsion, and limit behavior.

This is the simplest doorway into nonlinear thinking because it makes stability visible as geometry rather than just algebra.

### 13.2 Linear models are local, nonlinear behavior is global

Linearization near an operating point is often extremely useful, but only locally.

Outside that region, real plants may show:

- saturation,
- dead zones,
- friction,
- switching,
- geometric nonlinearity,
- gain scheduling effects.

That is why many practical controllers are hybrids:

- linear around the nominal operating point,
- nonlinear in saturation handling, scheduling, or disturbance compensation,
- checked with both classical frequency tools and nonlinear stability reasoning.

For the broader nonlinear story, including Lyapunov methods, backstepping, and sliding mode, continue to [Topics in Nonlinear Systems]({% post_url 2023-03-18-topics-in-nonlinear-systems %}).

---

## 14. Reading Map Across the Control Series

Use this note for the first pass through control logic:

1. what the plant is,
2. how the model is built,
3. how dynamics and stability are interpreted,
4. how feedback reshapes the poles,
5. how classical tools express performance and robustness.

Then branch outward:

- go to [Modern, Multivariable, and Networked Control]({% post_url 2020-08-18-modern-control-foundations %}) when transfer functions stop being enough,
- go to [Topics in Nonlinear Systems]({% post_url 2023-03-18-topics-in-nonlinear-systems %}) when local linear models stop telling the full story,
- go to [Adaptive, Optimal, Robust, and Learning Control]({% post_url 2025-05-10-adaptive-control %}) when guarantees, optimization, robustness, and learning become the main focus.

---

## 15. Compact Recall Map

When control theory starts to feel like too many disconnected formulas, compress it to this logic:

1. A controller acts on a **system**, not on an equation in isolation.
2. A useful **model** identifies states, inputs, outputs, disturbances, and operating assumptions.
3. The plant has its own **dynamics** before any controller is added.
4. **Stability analysis** asks whether those dynamics return, drift, or diverge.
5. **Feedback** changes the characteristic equation and therefore reshapes the poles.
6. **Time-domain tools** describe speed, damping, and accuracy.
7. **Frequency-domain tools** describe robustness, crossover, margins, and noise tradeoffs.
8. **Compensators** such as PID, lead, and lag are ways of shaping the loop, not isolated formulas.
9. **State-space methods** reveal which internal modes can be controlled and observed.
10. **Nonlinear methods** take over when local linear reasoning is no longer enough.

That is the natural logic of basic control: model the system, understand the dynamics, analyze stability, then design feedback to reshape behavior.
