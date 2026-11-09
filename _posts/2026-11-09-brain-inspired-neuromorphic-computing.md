---
title: Brain-Inspired Learning and Neuromorphic Computing
tags: [neuromorphic computing, brain-inspired learning, dynamical systems, Hopfield networks, Hebbian learning, spiking neural networks, reservoir computing, state-space models, contraction theory, predictive coding]
style: fill
color: light
description: A dynamical-systems tour of brain-inspired learning, from neuron models and equilibria to Hopfield and firing-rate networks, local learning rules, predictive coding, reservoir computing, spiking networks, deep state-space models, contraction analysis, and neuromorphic hardware.
---

_These notes are adapted from the 2026 PhD course **Brain-Inspired Learning: A Dynamical Systems Perspective** at the Centre for Interdisciplinary Mathematics (CIM) Graduate School, **Uppsala University**. Course director: Ayça Özçelikkale. The notes also use a guest lecture by Veronica Centorrino (ETH Zürich) on contractivity of recurrent networks, and follow F. Bullo's lecture notes on neural dynamics and E. Izhikevich's "Dynamical Systems in Neuroscience."_

## Central Question

If brains compute with recurrent dynamics, local learning rules, and sparse spikes, what can be learned by treating those mechanisms as dynamical systems, and what do we gain for energy-efficient computing on time-series data?

The course answers with one framing. A brain-inspired system has three coupled ingredients:

$$
\underbrace{\dot{x}=f(x,u;W)}_{\text{neural state dynamics}},\qquad
\underbrace{\dot{W}=g(W,x)}_{\text{learning dynamics}},\qquad
\underbrace{\dot W_{ij}=f_L(x_i,x_j,m_i)}_{\text{local rule with modulation}} .
$$

State-space language from [Control Theory Basics]({% post_url 2019-05-18-control-theory-basics %}), stability from [Topics in Nonlinear Systems]({% post_url 2023-03-18-topics-in-nonlinear-systems %}), and online adaptation from [Adaptive, Optimal, Robust, and Learning Control]({% post_url 2025-05-10-adaptive-control %}) all carry over. The new feature is that the same network is both a computer and a plant whose stability must be certified.

A debatable but useful list of brain-inspired computing principles:

- neural dynamics and recurrent computation;
- event-based (spike-based), sparse, asynchronous activity;
- memory and computation located together;
- parallel, decentralized processing;
- local, activity-dependent, online plasticity, often reward-modulated;
- predictive processing and active inference.

---

## 1. Neurons as Dynamical Systems

### 1.1 Biology in one paragraph

A neuron receives transmitter signals at synapses, which raise or lower its membrane potential. If the potential reaches a threshold, the neuron fires an action potential (a spike) that travels down its axon. A human brain has roughly 60 to 100 billion neurons with 1,000 to 20,000 synapses each. The same cell can be a threshold device, an integrator, a resonator, or a burster depending on its parameters, which is the reason dynamical systems theory is the right language.

### 1.2 Hodgkin-Huxley

The Hodgkin-Huxley model of the squid giant axon (Nobel Prize 1963) is a four-state nonlinear system $(V,m,h,n)$:

$$
C_m\dot V=I_{ext}-g_L(V-E_L)-\bar g_{Na}m^3h\,(V-E_{Na})-\bar g_Kn^4(V-E_K),
$$

with gating variables $q\in\{m,h,n\}$ obeying $\dot q=\alpha_q(V)(1-q)-\beta_q(V)q$. The terms are leak, sodium, and potassium currents; $C_m$ is membrane capacitance, $E_\cdot$ are reversal potentials, and $\alpha_q,\beta_q$ are opening and closing rates. A spike is an abrupt, transient excursion of $V$ that propagates to other neurons.

The model has a circuit reading: the membrane is a capacitor $C_m$ in parallel with voltage-gated conductances $g_{Na}$ and $g_K$ and a leak $g_L$, each in series with its reversal potential (battery) $E_{Na}$, $E_K$, $E_L$. The current balance of that circuit is the voltage equation above.

![Hodgkin-Huxley equivalent circuit](https://commons.wikimedia.org/wiki/Special:FilePath/Hodgkin-huxley-circuit.svg)
Figure 1. Equivalent circuit of the Hodgkin-Huxley membrane: capacitance $C$ in parallel with variable conductances $g_{Na}$, $g_K$, $g_L$, each with its Nernst potential. Source: [File:Hodgkin-huxley-circuit.svg](https://commons.wikimedia.org/wiki/File:Hodgkin-huxley-circuit.svg). License: Public domain.

### 1.3 One-dimensional dynamics: equilibria and thresholds

For $\dot V=F(V)$ on the phase line, an equilibrium has $F(V^\ast)=0$. It is stable when $F$ changes sign from plus to minus as $V$ increases, and unstable otherwise. A stable equilibrium is an **attractor**, and its **basin** is the set of initial conditions that lead to it. A system with two coexisting attractors is **bistable**, and the unstable equilibrium between them acts as a **threshold**. In one dimension a stable equilibrium is the only attractor; limit cycles, and therefore repetitive spiking, need two or more dimensions.

### 1.4 Excitability

In two dimensions, resting states can lose stability through different bifurcations, which sets the neuron's computational style:

- **Integrators** fire at arbitrarily low rates and behave like coincidence detectors (an input is integrated until a threshold). They map input amplitude to firing frequency.
- **Resonators** respond preferentially to inputs at a particular frequency (a subthreshold oscillation with damping), so they spike only if the input has a certain frequency.

These behaviours are not tuning accidents: they are consequences of the geometry of equilibria and bifurcations.

---

## 2. Recurrent Networks: Memory and Optimization

### 2.1 Hopfield and firing-rate models

Two continuous-time recurrent models are used throughout:

$$
\tau\dot x=-Dx+W\Phi(x)+u\quad(\text{Hopfield-like}),\qquad
\tau\dot x=-Dx+\Phi(Wx+u)\quad(\text{firing-rate}).
$$

Here $x$ is the neuron state vector, $D=\mathrm{diag}(d_i)\succ0$ is the dissipation rate, $W$ the synaptic matrix, $u$ the input, $\tau$ a time scale, and $\Phi$ an elementwise activation. They are not equivalent unless $W$ is invertible and the input is time-invariant. In the firing-rate form the state is a rate and can be kept positive with a positive $\Phi$; inhibition is naturally modelled only there.

### 2.2 Multistability: a worked example

Take the Hopfield-like system $\dot x=-x+W\tanh(x)$ with $W=\begin{bmatrix}1.5&0.1\\\\0.1&1.5\end{bmatrix}$. Solving $x=W\tanh(x)$ numerically gives nine equilibria. The Jacobian is $J=-I+W\,\mathrm{diag}(\mathrm{sech}^2x^\ast_i)$, and its eigenvalues classify them:

| Equilibrium | Eigenvalues of $J$ | Type |
| --- | --- | --- |
| $(0,0)$ | $0.6,\ 0.4$ | unstable node |
| $\pm(1.425,\ 1.425)$ | $-0.669,\ -0.711$ | stable nodes |
| $\pm(1.140,\ -1.140)$ | $-0.461,\ -0.529$ | stable nodes |
| $\pm(1.259,\ -0.176)$ and $\pm(0.176,\ -1.259)$ | $-0.588,\ 0.457$ | saddles |

I reproduced these equilibria and eigenvalues numerically. The network stores four stable patterns (four basins of attraction) separated by saddles: this is **associative memory**, with each stored pattern an attractor and retrieval being convergence from a noisy initial condition.

### 2.3 Why trajectories settle: an energy function

For symmetric $W=W^\top$ and activations $\phi_i$ that are differentiable, bounded, and strictly increasing with $\phi_i(0)=0$, the model $\dot x=-x+W\Phi(x)+u$ has an energy

$$
E(x)=\sum_i\int_0^{x_i}s\,\phi_i'(s)\,ds-\tfrac12\Phi(x)^\top W\Phi(x)-u^\top\Phi(x),
$$

because $\partial E/\partial x_i=\phi_i'(x_i)\big(x_i-(W\Phi)_i-u_i\big)=-\phi_i'(x_i)\dot x_i$ and so

$$
\dot E=-\sum_i\phi_i'(x_i)\,\dot x_i^{2}\le0 .
$$

Energy never increases; if its critical points are isolated, every trajectory converges to a single one. The network is a **natural optimizer**: it descends an energy landscape, and the weights and inputs define the landscape. Symmetry of $W$ is what makes this work. Asymmetric networks can oscillate or be chaotic, which is useful for sequence generation but breaks the guarantee.

---

## 3. Local Learning: Hebb, Oja, and Three-Factor Rules

**Hebb's principle** (1949): when cell A repeatedly helps fire cell B, A's efficiency in firing B increases. Three properties follow for a synapse $w_{ij}$ from neuron $j$ to neuron $i$:

- **locality:** the update depends only on the pre- and postsynaptic activity, $\dot w_{ij}=f(w_{ij};x_i,x_j)$;
- **cooperativity:** simultaneous activity strengthens the synapse, e.g. $\dot w_{ij}\propto x_ix_j$;
- **depression:** pure Hebbian growth is unstable, so a mechanism for decrease is needed.

**Oja's rule** adds depression. For a single output $y=w^\top u$,

$$
w(k+1)=w(k)+\gamma\,y\,u-\gamma\,y^{2}w(k),
$$

where the last term keeps $\|w\|\approx1$ (it is the first-order expansion of normalizing the Hebbian update). The weight vector converges to the leading eigenvector of the input covariance, so the neuron performs online principal component analysis. As a numerical check, with input covariance $\begin{bmatrix}3&1\\\\1&1\end{bmatrix}$ and $\gamma=0.005$, the weight vector converged to the top eigenvector (up to sign) with norm near 1 after 20,000 samples.

**Eligibility traces** give a synapse a short memory: $e_{ij,k+1}=\rho_ee_{ij,k}+u_{j,k}y_{i,k}$ with $0<\rho_e<1$. A **three-factor rule** multiplies the trace by a modulatory signal,

$$
\Delta w_{ij,k}\propto m_{i,k}\,e_{ij,k},
$$

so local activity decides which synapses are eligible and a global reward or error signal decides how they change. This is how reward-modulated learning stays local and online.

---

## 4. Predictive Coding and Active Inference

**Predictive coding** treats a hierarchy of layers as prediction and error. With activities $y_i$ and weights $W_i$, define

$$
E=\tfrac12\|y-W_Ly_{L-1}\|^2+\tfrac\rho2\sum_{i=1}^{L-1}\|y_i-\psi(W_iy_{i-1})\|^2 .
$$

Inference holds weights fixed and finds activities, and learning holds activities fixed and updates weights. Gradient descent on the activities, $y_i\leftarrow y_i-\eta_y\nabla_{y_i}E$, is **local**: it uses only prediction errors from adjacent layers, which makes it plausible for neural tissue. With Gaussian conditionals, $E$ is a negative log joint probability, so minimizing over activities is maximum a posteriori estimation.

**Active inference** extends this to action. Agents minimize variational free energy $F(q,o)=D_{KL}\big(q(s,\theta)\,\|\,p(s,\theta\mid o)\big)-\ln p(o)$, an upper bound on surprise, equivalently maximizing the evidence lower bound. They choose actions by minimizing expected free energy, so the action-perception loop closes. The framework unifies inference, learning, and control, and is a close relative of the estimator-controller loops in [Adaptive, Optimal, Robust, and Learning Control]({% post_url 2025-05-10-adaptive-control %}).

---

## 5. Reservoir Computing

A reservoir is a fixed random recurrent network whose rich dynamics are read out by a trained linear layer. A leaky echo-state network is

$$
x_{k+1}=(1-\beta)x_k+\beta\,\varphi(Wx_k+W^{in}u_k),\qquad y_k=g\big(W^{out}[x_k;u_k]\big),
$$

where $\beta$ is the leak, $W$ and $W^{in}$ are fixed, and only $W^{out}$ is trained (often by least squares). The echo-state property asks that the state forget initial conditions, a contraction-like requirement. Reservoirs are cheap to train and suit time-series prediction, speech recognition, and control, but they lack the versatility of deep learning. **Physical reservoir computing** uses real dynamics as the reservoir: a water surface (a "liquid brain" cut spoken-digit error from 25% to 1.5% in one demonstration) and a soft octopus-like robot body that emulates nonlinear dynamical systems. Liquid state machines are the spiking analogue.

---

## 6. Spiking Neural Networks

Spiking neurons are state-space models with a thresholded output. The leaky integrate-and-fire (LIF) neuron in discrete time is

$$
u[t+1]=\alpha\,u[t]+(1-\alpha)\,i[t]-\alpha\theta\,s[t],\qquad s[t]=\begin{cases}1&u[t]\ge\theta\\0&\text{else}\end{cases}
$$

with leak factor $\alpha$, input current $i$, threshold $\theta$, and a reset term that subtracts the threshold after a spike. Unlike Hodgkin-Huxley, the spike here is not produced by natural neuron dynamics such as a bifurcation, but by an artificially forced threshold. Spikes can be binary, ternary, or graded.

![Leaky integrate-and-fire neuron](https://commons.wikimedia.org/wiki/Special:FilePath/Leaky_Integrate-and-Fire_model_neuron_%28schematic%29.jpg?width=900)
Figure 2. The leaky integrate-and-fire model: input pulses charge a leaky membrane (an RC circuit); when the potential reaches the threshold $\vartheta$ a spike is emitted and the potential is reset. Source: [File:Leaky Integrate-and-Fire model neuron (schematic).jpg](https://commons.wikimedia.org/wiki/File:Leaky_Integrate-and-Fire_model_neuron_%28schematic%29.jpg). License: CC BY-SA 4.0.

The continuous-time form is $\tau_m\dot u=-u+RI(t)$ with a reset $u\leftarrow u_{reset}$ when $u\ge\theta$. For a constant input current $I$ the neuron fires periodically if $RI>\theta$ with period $T=\tau_m\ln\big(\tfrac{RI-u_{reset}}{RI-\theta}\big)$, and does not fire if $RI\le\theta$. This is a firing-rate curve (a threshold-then-saturating function of input), which is the origin of the nonlinear activation $\Phi$ used in the rate models of section 2.

**Learning is difficult** because the step function has zero derivative almost everywhere. Two families are used:

- **surrogate gradients:** the forward pass uses the step, the backward pass substitutes a smooth derivative (piecewise linear, SuperSpike's fast sigmoid derivative, or an exponential), allowing backpropagation through time;
- **local rules:** spike-timing-dependent plasticity (STDP) variants, e-prop, and DECOLLE, which use eligibility traces and avoid backpropagation through time.

---

## 7. Deep State-Space Models

A discrete-time linear state-space model is $x_{k+1}=Ax_k+Bu_k$, $y_k=Cx_k$. Deep SSMs use such systems as the building block of a sequence layer. Variants differ in how $A$ is structured: S4 (structured, HiPPO-initialized), S4D (diagonal), S5 (multi-input, multi-output), and Mamba (input-dependent, "selective" dynamics).

The control view explains why they work. Discrete-time stability needs $|\lambda_i(A)|<1$. Writing $\lambda_i=r_ie^{j\theta_i}$, the radius sets memory and the angle sets oscillation frequency: a mode decays as $r^k$, so its memory length is about $-1/\ln r$ steps. For $r=0.99$ that is about 100 steps, while $r=0.9$ gives about 9.5 steps. Inspecting where trained models place their eigenvalues inside the unit disk (for example on sequential image and ListOps benchmarks) shows what time scales a task needs. The cost is the usual one for linear dynamics: the training must keep eigenvalues inside the unit disk, a design constraint familiar from [Signals and Systems]({% post_url 2020-12-12-Signal-Systems %}).

---

## 8. Stability by Contraction

A recurrent network must be stable and robust to inputs, not only have a stable equilibrium. **Contraction theory** gives that. A system $\dot x=f(t,x)$ is **strongly infinitesimally contracting** with rate $c>0$ on a convex invariant set $C$ with respect to a norm $\|\cdot\|$ if the induced log norm of the Jacobian satisfies

$$
\mu\big(Df_t(x)\big)\le -c\qquad\text{for all }x\in C,\ t\ge0 .
$$

Then any two trajectories converge to each other exponentially at rate $c$: there is a unique equilibrium for a constant input, and it is globally exponentially stable. Contraction is a property of distances, so the right norm matters. For the matrix $A=\begin{bmatrix}-0.1&1\\\\-1&-0.1\end{bmatrix}$ (a rotation with weak damping),

- the 2-norm log norm is $\mu_2(A)=\lambda_{max}\!\big((A+A^\top)/2\big)=-0.1$, so the system is contracting at rate 0.1;
- the 1-norm log norm is $\mu_1(A)=\max_j\big(a_{jj}+\sum_{i\ne j}|a_{ij}|\big)=0.9>0$, so contraction cannot be shown in that norm.

The same system is contracting in one norm and not certified in another. For firing-rate networks $\dot x=-x+\Phi(Wx+u)$ with symmetric weights, there are contraction results with Euclidean weighted norms whose rate depends on the largest eigenvalue $\lambda_W$ of $W$: the contraction rate degrades as $\lambda_W$ approaches 1, and the borderline cases need more careful norms and give weaker (non-strict, or linear-then-exponential) convergence. Non-Euclidean log norms ($\ell_1$, $\ell_\infty$) give conditions for nonnegative or sparse weights. Contraction also extends to open systems (input-to-state stability) and to coupled learning dynamics $\dot x=-c\,x+\phi(Wx+u)$, $\dot W_{ij}=H_{ij}\phi(x_i)\phi(x_j)$, where stability conditions come from non-Euclidean contractivity of the joint system.

### Optimization dynamics and sparse coding

Many neural networks are continuous-time optimizers. For a composite problem $\min_x f(x,u)+g(x)$ with $f$ smooth convex and $g$ closed convex, the **proximal gradient flow**

$$
\dot x=-x+\mathrm{prox}_{\gamma g}\big(x-\gamma\nabla_xf(x,u)\big)
$$

has the minimizer as its equilibrium. For sparse reconstruction, $f=\tfrac12\|u-Dx\|^2$ (dictionary $D$, image patch $u$) and $g=\lambda\|x\|_1$ give

$$
\dot x=-x+\mathrm{ReLU}\big((I-D^\top D)x+D^\top u-\lambda\mathbf 1\big)
$$

for nonnegative states with $\gamma=1$: a **competitive firing-rate network** with lateral inhibition $-D^\top D$ and a threshold $\lambda$. A neural circuit that looks like biology is solving a LASSO problem, and its convergence follows from contraction or monotone-operator arguments. Adding learning of $D$ gives sparse coding.

---

## 9. Neuromorphic Hardware

Key computational properties: event-based, sparse, asynchronous, and memory co-located with computation. The hardware design space (as summarized in the course):

| Dimension | Approach | Advantage | Limitation | Examples |
| --- | --- | --- | --- | --- |
| Computation | Digital | simple IC design | switching and data-movement energy | Loihi, Xylo, Speck, Akida, SpiNNaker2 |
| Computation | Analog or mixed-signal | low-power physical dynamics | mismatch, calibration, design complexity | DYNAP-SE2, T1, Innatera |
| Communication | Routed | flexible sparse connectivity | routing traffic and overhead | Loihi, Xylo, SpiNNaker2 |
| Communication | Crossbar | dense connectivity, in-memory compute | precision and scaling limits | TrueNorth, T1, HERMES |
| Learning | Off-chip | efficient training, simpler hardware | model mapping and deployment | Speck, Xylo, T1 |
| Learning | On-chip | online adaptation, local plasticity | area and training overhead | Loihi |

Reported numbers from the course (from the cited papers, not independently verified here): an image-classification benchmark on IBM NorthPole showed about 5 times more frames per second per billion transistors and about 25 times more frames per joule than a V100 GPU; an LLM on NorthPole reported up to 72.7 times better energy metric and 46.9 times lower latency than state-of-the-art GPUs; and a diagonal SSM (S4D) on Intel's Loihi 2 reported about 1,000 times less energy and 75 times lower latency than a Jetson GPU for token-by-token streaming. These gains come from putting memory next to compute and from sparse, event-driven processing; they depend on workload, batch size, and precision, so treat them as best cases.

---

## 10. What This Framework Lets Us Do

- Read a neuron model as a vector field and predict spiking style from equilibria and bifurcations.
- Show that a recurrent network converges (energy for symmetric weights, contraction for general ones).
- Design local learning rules and know when they are stable (Oja) or need modulation (three-factor).
- Choose between reservoir computing, spiking networks, and deep SSMs for time-series tasks from the memory and energy trade-offs.
- Map an algorithm to a hardware style (digital, analog, crossbar) from its communication and learning needs.

## 11. Where the Framework Stops Being Reliable

- Energy arguments need symmetric weights; real synapses are asymmetric.
- Surrogate gradients make spiking networks trainable but give up some of the biological plausibility and event sparsity that motivated them.
- Contraction certificates are sufficient and can be conservative.
- Neuromorphic efficiency claims depend on workload sparsity, and software ecosystems are immature.
- "Biologically plausible" is not a single definition; local rules still lag backpropagation on large tasks.

## 12. Compact Recall Map

1. A neuron is a dynamical system; the geometry of equilibria sets its behaviour.
2. Hopfield and firing-rate models are related but not equivalent.
3. Symmetric weights give an energy function and convergence.
4. Hebb needs depression; Oja's rule computes the leading eigenvector.
5. Three-factor rules combine local eligibility with global modulation.
6. Predictive coding makes inference a local gradient flow.
7. Reservoirs train only the readout; spiking networks need surrogates or local rules.
8. Deep SSMs set memory with eigenvalue radius.
9. Contraction depends on the norm; check log norms.
10. Neuromorphic gains come from sparsity and co-located memory.

---

## Sources and Further Reading

- Uppsala University CIM PhD course "Brain-Inspired Learning: A Dynamical Systems Perspective," 2026 (Ayça Özçelikkale; guest lecture by Veronica Centorrino).
- E. M. Izhikevich, _Dynamical Systems in Neuroscience: The Geometry of Excitability and Bursting_ (MIT Press, 2007).
- F. Bullo, _Lectures on Neural Dynamics_ (2026).
- W. Gerstner, W. Kistler, R. Naud, and L. Paninski, _Neuronal Dynamics_ (Cambridge, 2014).
- J. Hertz, A. Krogh, and R. G. Palmer, _Introduction to the Theory of Neural Computation_ (1991).
- A. Davydov, A. V. Proskurnikov, and F. Bullo, non-Euclidean contraction analysis of continuous-time neural networks.
- A. Gu et al. on S4, S4D, and Mamba; J. T. H. Smith, A. Warrington, and S. W. Linderman on S5.
- E. O. Neftci, H. Mostafa, and F. Zenke, surrogate gradient learning in spiking neural networks (2019).
