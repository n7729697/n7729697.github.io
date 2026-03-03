---
title: Signals & Systems — From Time Domain to Spectral Thinking
tags: [signals, systems, LTI, convolution, Fourier, Laplace, Z-transform, sampling, filtering, FIR, IIR, DSP, stochastic processes]
style: fill
color: light
description: A course-level treatment of continuous-time and discrete-time signals and systems — covering time-domain analysis, frequency-domain transforms, analog and digital filter design, DSP implementation, and stochastic signal processing.
---

## 1. What Signals and Systems Theory Actually Does

Every piece of technology that senses, communicates, or controls involves **signals** (functions that carry information) and **systems** (operators that transform those signals). A microphone converts air pressure into a voltage signal; an amplifier system scales it; a filter system removes hum; an ADC system samples it; an FFT algorithm reveals its frequency content; a codec compresses it; a DAC reconstructs it; a speaker converts it back to pressure.

Signals and Systems theory provides the **mathematical machinery** to predict, analyze, and design every stage of this chain. The core insight is that certain classes of systems — **Linear Time-Invariant (LTI)** — are completely characterized by a single function (the impulse response $h(t)$ or $h[n]$), and that transforming from time to frequency domain converts the hard operation (convolution) into the easy one (multiplication).

---

## 2. Signal Fundamentals

### 2.1 Continuous-Time (CT) vs. Discrete-Time (DT)
- **CT signal** $x(t)$: defined for all $t \in \mathbb{R}$. Examples: voltage from a sensor, air pressure (sound), electromagnetic field.
- **DT signal** $x[n]$: defined only at integer indices $n \in \mathbb{Z}$. Examples: sampled sensor data, digital audio (44,100 samples/sec for CD), pixel rows in an image.

DT signals are not inherently "digital" — they are just defined at discrete instants. Digital signals are further quantized in amplitude.

### 2.2 Energy and Power
- **Energy signal:** $E = \int_{-\infty}^{\infty} |x(t)|^2 dt < \infty$. A single pulse is an energy signal — it has finite total energy.
- **Power signal:** $P = \lim_{T\to\infty} \frac{1}{2T} \int_{-T}^{T} |x(t)|^2 dt < \infty$. A sinusoid goes on forever (infinite energy) but has finite average power.

This distinction matters because the Fourier Transform exists for energy signals, while periodic (power) signals need the Fourier Series or generalized functions ($\delta$-functions in the spectrum).

### 2.3 Elementary Signals — The Building Blocks

**Unit Impulse $\delta(t)$ / $\delta[n]$:**
The single most important signal. In CT, $\delta(t)$ is not a function in the usual sense — it is a **distribution** defined by its action under integration:
$$\int_{-\infty}^{\infty} f(t)\delta(t-t_0) dt = f(t_0)$$
This is the **sifting property**. It says: the impulse "picks out" the value of $f$ at $t_0$. Why does this matter? Because any signal can be decomposed as a weighted sum of shifted impulses:
$$x(t) = \int_{-\infty}^{\infty} x(\tau)\delta(t-\tau) d\tau$$
In DT, $\delta[n]$ is simply 1 at $n=0$ and 0 everywhere else — no distribution subtlety needed.

**Unit Step $u(t)$ / $u[n]$:**
$u(t) = 1$ for $t \geq 0$, $0$ for $t < 0$. Related to the impulse by $u(t) = \int_{-\infty}^{t}\delta(\tau)d\tau$, or equivalently $\delta(t) = \frac{du}{dt}$. The step is the canonical "switching on" signal — it models turning on a voltage, opening a valve, starting a motor.

**Complex Exponential $e^{st}$ / $z^n$:**
The eigenfunctions of LTI systems. If you feed $e^{st}$ into an LTI system, you get $H(s)e^{st}$ out — the system scales and phase-shifts, but doesn't change the functional form. This is why the Laplace and Z transforms work: they decompose arbitrary signals into sums of exponentials, and each exponential passes through the system independently.

---

## 3. LTI Systems: The Framework

### 3.1 Why LTI?
**Linearity** (superposition + scaling) means: if input $x_1 \to y_1$ and $x_2 \to y_2$, then $ax_1 + bx_2 \to ay_1 + by_2$. This is incredibly powerful — it means we can analyze each component of a signal independently and add the results.

**Time Invariance** means: if $x(t) \to y(t)$, then $x(t - t_0) \to y(t - t_0)$. The system behaves the same way regardless of when the input arrives. A guitar amp that distorts is nonlinear. A time-varying channel (fading in wireless) is not time-invariant.

Together, LTI means the system is completely characterized by its response to a single impulse.

### 3.2 Impulse Response and Convolution
If the system's response to $\delta(t)$ is $h(t)$, then the response to any input $x(t)$ is:

$$y(t) = x(t) * h(t) = \int_{-\infty}^{\infty} x(\tau) h(t - \tau) d\tau$$

**Why this works:** We decomposed $x(t)$ into infinitely many shifted, scaled impulses ($x(\tau)\delta(t-\tau)d\tau$). By linearity, the response is the sum of the system's responses to each impulse. By time invariance, the response to $\delta(t-\tau)$ is $h(t-\tau)$. Add them all up → convolution integral.

In DT, the convolution sum:
$$y[n] = \sum_{k=-\infty}^{\infty} x[k] \, h[n-k]$$

**Graphical convolution** (flip $h$, slide it across $x$, compute the overlap area at each position) builds powerful intuition for what convolution does: it smears, smooths, or shapes the input according to the impulse response.

### 3.3 System Properties from $h(t)$
- **Causal:** $h(t) = 0$ for $t < 0$. The system doesn't respond before the input arrives.
- **BIBO Stable:** $\int_{-\infty}^{\infty} |h(t)| dt < \infty$ (CT) or $\sum |h[n]| < \infty$ (DT). Bounded input always produces bounded output. An exponentially decaying $h(t)$ is stable; a constant $h(t) = 1$ for $t \geq 0$ (integrator) is unstable (step input → ramp output → unbounded).
- **Memoryless:** $h(t) = c\,\delta(t)$. Output depends only on the present input (pure gain).
- **Invertible:** There exists $g(t)$ such that $h(t) * g(t) = \delta(t)$. The system can be "undone."

---

## 4. Time-Domain Analysis of CT Systems

### 4.1 Differential Equation Representation
CT LTI systems are described by constant-coefficient linear ODEs:
$$\sum_{k=0}^{N} a_k \frac{d^k y(t)}{dt^k} = \sum_{m=0}^{M} b_m \frac{d^m x(t)}{dt^m}$$

For example, a simple RC lowpass filter: $RC\dot{y} + y = x$. This is a 1st-order ODE with $a_0 = 1$, $a_1 = RC$, $b_0 = 1$.

### 4.2 Impulse Response of CT Systems
To find $h(t)$, set $x(t) = \delta(t)$ and solve the ODE with zero initial conditions. For the RC filter:
$$h(t) = \frac{1}{RC} e^{-t/(RC)} u(t)$$
This is an exponential decay. The **time constant** $\tau = RC$ controls how fast the system "forgets" — after $5\tau$, the response has decayed to <1% of its peak. A large $\tau$ means the system averages over a long time window (heavy smoothing); a small $\tau$ means it reacts quickly (light smoothing).

### 4.3 Step Response
The step response $s(t)$ is the response to $u(t)$:
$$s(t) = \int_{-\infty}^{t} h(\tau) d\tau = h(t) * u(t)$$
For the RC filter: $s(t) = (1 - e^{-t/(RC)}) u(t)$. It starts at 0 and exponentially approaches 1. The step response reveals:
- **Rise time:** How fast the system responds (10%→90% of final value).
- **Steady-state value:** Does the system track a constant input? (For stable systems, $s(\infty) = H(s)\big|_{s=0}$ = DC gain.)
- **Overshoot:** Does it exceed the final value? (Underdamped 2nd-order systems overshoot; 1st-order systems never do.)

### 4.4 Second-Order Systems
$$\ddot{y} + 2\zeta\omega_n \dot{y} + \omega_n^2 y = \omega_n^2 x$$
Characterized by:
- **Natural frequency $\omega_n$:** How fast the system oscillates when undriven.
- **Damping ratio $\zeta$:**
  - $\zeta > 1$: **Overdamped.** Two real decaying exponentials. Sluggish, no oscillation.
  - $\zeta = 1$: **Critically damped.** Fastest return to equilibrium without oscillation (door closers, galvanometers).
  - $0 < \zeta < 1$: **Underdamped.** Oscillates with exponentially decaying envelope. The damped frequency is $\omega_d = \omega_n\sqrt{1-\zeta^2}$.
  - $\zeta = 0$: **Undamped.** Oscillates forever (ideal LC circuit, lossless pendulum).

The step response of an underdamped system exhibits **overshoot** $\approx e^{-\pi\zeta/\sqrt{1-\zeta^2}} \times 100\%$ and **settling time** $\approx 4/(\zeta\omega_n)$. These formulas drive control system design — choosing $\zeta$ and $\omega_n$ sets the speed-vs-overshoot tradeoff.

---

## 5. Time-Domain Analysis of DT Systems

### 5.1 Difference Equation Representation
DT LTI systems are described by constant-coefficient linear difference equations:
$$\sum_{k=0}^{N} a_k y[n-k] = \sum_{m=0}^{M} b_m x[n-m]$$

For example, a first-order DT lowpass: $y[n] = \alpha y[n-1] + (1-\alpha) x[n]$. This is a single-pole recursive filter — the DT analog of the RC circuit.

### 5.2 DT Impulse and Step Response
Set $x[n] = \delta[n]$: the impulse response $h[n]$ is obtained by iterating the difference equation. For $y[n] = \alpha y[n-1] + (1-\alpha)\delta[n]$:
$$h[n] = (1-\alpha)\alpha^n u[n]$$
If $|\alpha| < 1$, $h[n]$ decays geometrically → stable. If $|\alpha| \geq 1$, $h[n]$ grows → unstable.

The DT step response is: $s[n] = \sum_{k=0}^{n} h[k] = (1 - \alpha^{n+1}) u[n]$. It approaches 1 as $n \to \infty$ (for $|\alpha| < 1$), just like the CT RC step response approaches 1 as $t \to \infty$.

### 5.3 The Moving Average Filter
$$y[n] = \frac{1}{M} \sum_{k=0}^{M-1} x[n-k]$$
This is an **FIR (Finite Impulse Response)** system: $h[n]$ has only $M$ non-zero terms. It averages the last $M$ samples — a simple smoother. Its frequency response is a **sinc-like** function with nulls at multiples of $2\pi/M$. Wider window ($M$ larger) → narrower passband → more smoothing.

---

## 6. Frequency-Domain Analysis: CT (Fourier & Laplace)

### 6.1 Fourier Series (Periodic CT Signals)
A periodic signal $x(t)$ with period $T_0$ can be decomposed into harmonics:
$$x(t) = \sum_{k=-\infty}^{\infty} C_k \, e^{jk\omega_0 t}, \quad \omega_0 = \frac{2\pi}{T_0}$$
$$C_k = \frac{1}{T_0} \int_{T_0} x(t) e^{-jk\omega_0 t} dt$$

**What this means:** Any periodic signal — a square wave, a sawtooth, a heartbeat — is a superposition of sinusoids at integer multiples of the fundamental frequency $\omega_0$. The coefficients $C_k$ tell you how much energy is at each harmonic. A square wave has strong odd harmonics ($C_1, C_3, C_5, ...$) falling off as $1/k$ — this is why a square wave sounds "buzzy" compared to a pure sine (which has only $C_1$).

**Gibbs phenomenon:** Truncating the series at $K$ terms produces ~9% overshoot at discontinuities, regardless of $K$. The overshoot doesn't shrink — it just gets narrower. This is a fundamental limit of representing a discontinuity with a finite number of smooth sinusoids.

### 6.2 Continuous-Time Fourier Transform (CTFT)
For aperiodic signals:
$$X(j\omega) = \int_{-\infty}^{\infty} x(t) e^{-j\omega t} dt$$
$$x(t) = \frac{1}{2\pi} \int_{-\infty}^{\infty} X(j\omega) e^{j\omega t} d\omega$$

$X(j\omega)$ is the **spectrum** — it tells you the density of signal content at each frequency $\omega$. The magnitude $|X(j\omega)|$ is the amplitude spectrum; the angle $\angle X(j\omega)$ is the phase spectrum.

**Key transform pairs (build your intuition around these):**
- **Rectangular pulse** $\leftrightarrow$ **sinc:** A pulse of width $T$ has spectrum $T\,\text{sinc}(\omega T/2\pi)$. Narrower pulse → wider spectrum (more bandwidth needed to represent fast transitions). This is the time-frequency duality in action.
- **Exponential decay** $e^{-at}u(t) \leftrightarrow \frac{1}{a + j\omega}$: A first-order system's impulse response. The spectrum rolls off at $-20$ dB/decade — low frequencies pass, high frequencies are attenuated. This is a lowpass filter.
- **Gaussian** $\leftrightarrow$ **Gaussian:** The Gaussian is its own Fourier transform (up to scaling). It achieves the **uncertainty principle** equality: $\Delta t \cdot \Delta \omega \geq 1/2$, with equality only for Gaussians. You cannot be arbitrarily localized in both time and frequency simultaneously.
- **Impulse** $\delta(t) \leftrightarrow 1$: The impulse has all frequencies equally — it is the "white" signal. Conversely, a DC signal ($x(t)=1$) has spectrum $2\pi\delta(\omega)$ — all energy at zero frequency.

**Key properties:**
- Convolution in time $\leftrightarrow$ multiplication in frequency: $y = x * h \Rightarrow Y(j\omega) = X(j\omega)H(j\omega)$. This is the single most important property — it turns the hard integral (convolution) into simple pointwise multiplication.
- Time shift $\leftrightarrow$ phase shift: $x(t-t_0) \leftrightarrow e^{-j\omega t_0} X(j\omega)$. Delaying a signal only changes its phase, not its magnitude spectrum.
- Differentiation $\leftrightarrow$ multiplication by $j\omega$: $\frac{dx}{dt} \leftrightarrow j\omega X(j\omega)$. Differentiation amplifies high frequencies — this is why differentiators are noise-sensitive.
- **Parseval's theorem:** $\int |x(t)|^2 dt = \frac{1}{2\pi}\int |X(j\omega)|^2 d\omega$. Energy is preserved across domains.

### 6.3 Laplace Transform
The Fourier Transform only exists for signals whose integral converges (energy signals, or with generalized functions). The Laplace Transform generalizes by adding a convergence factor:
$$X(s) = \int_{0}^{\infty} x(t) e^{-st} dt, \quad s = \sigma + j\omega$$

Setting $\sigma = 0$ recovers the Fourier Transform (on the imaginary axis). The extra degree of freedom $\sigma$ allows us to handle growing signals (like $e^{2t}$) and, critically, to solve ODEs with initial conditions.

**Why the s-domain is powerful for system analysis:**
- The ODE $a_N y^{(N)} + \cdots + a_0 y = b_M x^{(M)} + \cdots + b_0 x$ transforms to:
$$H(s) = \frac{Y(s)}{X(s)} = \frac{b_M s^M + \cdots + b_0}{a_N s^N + \cdots + a_0}$$
A ratio of polynomials — a **rational transfer function**. Factor the numerator and denominator to find **zeros** (where $H(s)=0$) and **poles** (where $H(s)=\infty$).

**Pole-zero interpretation:**
- **Poles** determine the natural modes of the system. A pole at $s = -a$ contributes a term $e^{-at}$ to the impulse response. A complex conjugate pair $s = -\sigma \pm j\omega_d$ contributes a decaying sinusoid $e^{-\sigma t}\sin(\omega_d t + \phi)$.
- **Zeros** shape which frequencies are passed or blocked. A zero on the imaginary axis ($s = j\omega_0$) means the system has zero response at frequency $\omega_0$ — a **notch**.
- Stability: all poles must have $\Re\{s\} < 0$ (left half-plane). If any pole has $\Re\{s\} > 0$, the impulse response grows exponentially — the system is unstable.

**Region of Convergence (ROC):** The set of $s$ values where the Laplace integral converges. For causal signals, ROC is to the right of the rightmost pole. The ROC determines whether a given pole-zero map corresponds to a causal/stable, causal/unstable, or anticausal system.

### 6.4 Partial Fraction Expansion
To find $h(t)$ from $H(s)$, decompose $H(s)$ into simple fractions:
$$H(s) = \frac{A_1}{s - p_1} + \frac{A_2}{s - p_2} + \cdots$$
Each term inverts to $A_i e^{p_i t} u(t)$ (for causal systems). This is how we go from an algebraic transfer function back to a time-domain impulse response.

---

## 7. Frequency-Domain Analysis: DT (DTFT & Z-Transform)

### 7.1 Discrete-Time Fourier Transform (DTFT)
$$X(e^{j\Omega}) = \sum_{n=-\infty}^{\infty} x[n] e^{-j\Omega n}$$
$$x[n] = \frac{1}{2\pi} \int_{-\pi}^{\pi} X(e^{j\Omega}) e^{j\Omega n} d\Omega$$

The key difference from CTFT: the DTFT is **periodic in $\Omega$ with period $2\pi$**. This is because $e^{j(\Omega + 2\pi)n} = e^{j\Omega n}$ for integer $n$. Frequencies $\Omega$ and $\Omega + 2\pi$ are indistinguishable in DT — this is the mathematical root of aliasing.

The unique frequency range is $-\pi < \Omega \leq \pi$ (or equivalently $0$ to $2\pi$). $\Omega = 0$ is DC; $\Omega = \pi$ is the highest frequency representable (Nyquist frequency), corresponding to the pattern $+1, -1, +1, -1, \ldots$

### 7.2 Z-Transform
$$X(z) = \sum_{n=-\infty}^{\infty} x[n] z^{-n}, \quad z \in \mathbb{C}$$

The Z-Transform is to DT what the Laplace Transform is to CT. Setting $z = e^{j\Omega}$ (the unit circle) recovers the DTFT. The extra freedom of complex $z$ allows us to handle growing sequences and solve difference equations.

**Transfer function:**
$$H(z) = \frac{Y(z)}{X(z)} = \frac{b_0 + b_1 z^{-1} + \cdots + b_M z^{-M}}{1 + a_1 z^{-1} + \cdots + a_N z^{-N}}$$

- **Poles** of $H(z)$ determine the natural modes. A pole at $z = r e^{j\theta}$ contributes $r^n \cos(n\theta + \phi)$ to $h[n]$. If $|r| < 1$ (pole inside the unit circle), this decays → stable. If $|r| > 1$ → unstable.
- **Zeros** shape the frequency response.
- Stability ↔ all poles inside the unit circle.
- Frequency response $H(e^{j\Omega})$ is obtained by evaluating $H(z)$ on the unit circle.

**Geometric interpretation:** At any frequency $\Omega$, $|H(e^{j\Omega})|$ is proportional to the product of distances from zeros to the point $e^{j\Omega}$ divided by the product of distances from poles. A pole near the unit circle creates a peak in the frequency response (resonance); a zero near the unit circle creates a dip (notch).

### 7.3 DFT and FFT
The **Discrete Fourier Transform (DFT)** is a sampled version of the DTFT for finite-length sequences:
$$X[k] = \sum_{n=0}^{N-1} x[n] e^{-j2\pi kn/N}, \quad k = 0, 1, \ldots, N-1$$

It transforms $N$ time samples into $N$ frequency samples. The **FFT (Fast Fourier Transform)** computes the DFT in $O(N \log N)$ instead of $O(N^2)$ by exploiting symmetry (Cooley-Tukey). This makes real-time spectral analysis, fast convolution, and compressed sensing practical.

**Spectral leakage:** The DFT assumes the signal is periodic with period $N$. If the signal's period doesn't divide $N$ evenly, the DFT "sees" a discontinuity at the boundary, spreading energy across all bins. **Windowing** (Hamming, Hanning, Blackman) smoothly tapers the signal edges to reduce leakage at the cost of wider main lobes (reduced frequency resolution).

---

## 8. Sampling and Reconstruction

### 8.1 The Sampling Theorem (Nyquist-Shannon)
Ideal sampling multiplies $x(t)$ by a Dirac comb:
$$x_s(t) = x(t) \sum_{k=-\infty}^{\infty} \delta(t - kT_s)$$

In the frequency domain, this replicates the spectrum at multiples of $\omega_s = 2\pi/T_s$:
$$X_s(j\omega) = \frac{1}{T_s} \sum_{k=-\infty}^{\infty} X(j(\omega - k\omega_s))$$

If $\omega_s > 2\omega_{max}$ (the Nyquist criterion), the replicas don't overlap, and the original spectrum can be perfectly recovered by an ideal lowpass filter with cutoff $\omega_s/2$. If $\omega_s \leq 2\omega_{max}$, the replicas overlap (**aliasing**), and the original signal is irrecoverably corrupted.

**Practical implications:**
- **Anti-aliasing filter:** Before any ADC, a lowpass analog filter must remove frequency content above $f_s/2$. Without it, a 15 kHz signal sampled at 20 kHz would alias to 5 kHz — an audible artifact.
- **Oversampling:** Sample at $4\times$–$8\times$ the Nyquist rate. This pushes aliased replicas far from the signal band, allowing a gentler (cheaper) anti-aliasing filter. CD players use $\Delta\Sigma$ oversampling DACs at 64× or 128× to achieve this.

### 8.2 Reconstruction
Ideal reconstruction convolves the samples with a sinc function:
$$x(t) = \sum_{n} x[n] \, \text{sinc}\left(\frac{t - nT_s}{T_s}\right)$$
Each sample contributes a sinc pulse, and the sum reconstructs $x(t)$ exactly (if Nyquist was satisfied). But a sinc is non-causal and infinite — impractical.

**Zero-Order Hold (ZOH):** The simplest practical DAC — hold each sample value constant until the next sample. The ZOH output has a staircase shape. Its frequency response is $H_{ZOH}(j\omega) = T_s \,\text{sinc}(\omega T_s / 2\pi) \, e^{-j\omega T_s/2}$, which introduces a sinc droop in the passband. Compensation ("sinc correction") flattens this.

---

## 9. Analog (CT) Filter Design

Filters are defined by what they pass and what they stop.

### 9.1 Ideal vs. Realizable
An ideal lowpass filter has $H(j\omega) = 1$ for $|\omega| < \omega_c$ and $0$ otherwise. Its impulse response is $h(t) = \text{sinc}(\omega_c t / \pi)$ — non-causal (extends to $t = -\infty$) and infinite in duration. No physical system can implement this. All real filter design is about **approximating** this ideal within constraints.

### 9.2 Filter Specifications
- **Passband:** Frequencies with gain close to 1 (within ripple tolerance $\delta_p$, typically <1 dB).
- **Stopband:** Frequencies with gain close to 0 (below attenuation floor, e.g., $-40$ dB).
- **Transition band:** The region between passband and stopband. Narrower transition → more complex (higher-order) filter.
- **Group delay:** $\tau_g(\omega) = -\frac{d\phi}{d\omega}$. Constant group delay means all frequencies are delayed equally — no waveform distortion. Non-constant group delay distorts transient signals.

### 9.3 Classic Analog Filter Families

**Butterworth (Maximally Flat):**
$$|H(j\omega)|^2 = \frac{1}{1 + (\omega/\omega_c)^{2N}}$$
- Monotonically decreasing — no ripple in passband or stopband.
- Rolls off at $-20N$ dB/decade (a 4th-order Butterworth drops at $-80$ dB/decade).
- Group delay is not constant (phase distortion).
- Use when: you need a smooth, ripple-free response and can tolerate a wider transition band.

**Chebyshev Type I (Equiripple Passband):**
- Allows controlled ripple in the passband to achieve a **steeper rolloff** than Butterworth for the same order.
- Sharper transition at the cost of passband undulation.
- Use when: transition band must be narrow, and some passband ripple is acceptable.

**Chebyshev Type II (Equiripple Stopband):**
- Flat passband, ripple in the stopband.
- Less common; useful when passband flatness is critical.

**Elliptic (Cauer):**
- Ripple in **both** passband and stopband → achieves the **sharpest possible transition** for a given order.
- Use when: the filter order must be minimized (fewest components, lowest cost) and some ripple is tolerable everywhere.

**Bessel (Maximally Flat Group Delay):**
- Optimizes for **constant group delay** (linear phase).
- Poorest rolloff of all families — but no waveform distortion.
- Use when: preserving pulse shape matters more than frequency selectivity (oscilloscope inputs, data links).

### 9.4 Filter Transformations
All the above are designed as **lowpass prototypes**. Standard transformations convert them:
- Lowpass → Highpass: $s \to \omega_c/s$
- Lowpass → Bandpass: $s \to (s^2 + \omega_0^2)/(Bs)$ (where $B$ is bandwidth)
- Lowpass → Bandstop (Notch): $s \to Bs/(s^2 + \omega_0^2)$

This means you design a normalized lowpass, then algebraically transform it to any type.

---

## 10. Digital (DT) Filter Design

### 10.1 FIR Filters (Finite Impulse Response)

An FIR filter has the form:
$$y[n] = \sum_{k=0}^{M} b_k x[n-k]$$

There are **no feedback terms** (no $a_k y[n-k]$). The impulse response IS the coefficient vector $\{b_0, b_1, \ldots, b_M\}$ — it lasts exactly $M+1$ samples and then dies.

**Advantages:**
- **Always BIBO stable.** No poles (other than at $z=0$, which doesn't affect stability). You cannot make an FIR filter unstable.
- **Exact linear phase** is achievable if the coefficients are symmetric ($b_k = b_{M-k}$). Linear phase means constant group delay — all frequencies delayed by the same amount. Crucial for data communications (no inter-symbol interference) and audio (no phase distortion).
- **Easy to design,** analyze, and implement. No stability concerns.

**Disadvantages:**
- For a sharp cutoff, you need a **very long filter** (large $M$). A sharp transition in frequency requires a long impulse response in time (uncertainty principle). An FIR equivalent of a 4th-order elliptic IIR might need $M = 100$+ taps.

**Design methods:**
- **Windowed sinc:** Start with the ideal impulse response $h_{ideal}[n] = \text{sinc}$ , truncate to $M+1$ samples, multiply by a window (Hamming, Kaiser, etc.) to control sidelobe levels. Simple and intuitive.
- **Parks-McClellan (Remez exchange):** Optimal equiripple design. Given passband/stopband frequencies and ripple specs, it finds the minimum-order FIR that meets them. The industry standard for sharp FIR filters.
- **Frequency sampling:** Specify the desired frequency response at $N$ points, inverse-DFT to get $h[n]$. Fast but gives less control over transition band behavior.

### 10.2 IIR Filters (Infinite Impulse Response)

An IIR filter has the form:
$$y[n] = \sum_{m=0}^{M} b_m x[n-m] - \sum_{k=1}^{N} a_k y[n-k]$$

The feedback terms ($a_k y[n-k]$) create poles, making the impulse response theoretically infinite in duration (though it decays if the filter is stable).

**Advantages:**
- **Much sharper cutoff for a given order.** A 4th-order IIR elliptic filter can match the performance of a 60th-order FIR. Fewer coefficients → less computation → lower latency.

**Disadvantages:**
- **Can be unstable.** If any pole moves outside the unit circle (due to coefficient quantization, for example), the filter oscillates or blows up.
- **Nonlinear phase.** IIR filters inherently have frequency-dependent group delay. This can be mitigated by forward-backward filtering (zero-phase, but non-causal — only for offline/batch processing).
- **Limit cycles:** Finite-precision arithmetic can cause the filter to oscillate at a small amplitude even with zero input.

**Design methods:**
- **Bilinear Transform:** Take a proven analog prototype (Butterworth, Chebyshev, Elliptic) and map it to the $z$-domain via:
$$s = \frac{2}{T_s} \frac{1 - z^{-1}}{1 + z^{-1}}$$
This maps the entire $j\omega$ axis to the unit circle, preserving stability. The catch: frequency warping — analog frequencies are compressed nonlinearly. You must pre-warp the critical frequencies before applying the transform.
- **Impulse Invariance:** Sample the analog impulse response: $h[n] = T_s h_a(nT_s)$. Preserves the time-domain shape but **aliases** the frequency response if it's not bandlimited. Only works for lowpass/bandpass designs (not highpass — the analog highpass extends to $\infty$, which aliases catastrophically).

### 10.3 FIR vs. IIR: When to Use Which

| Criterion | FIR | IIR |
|---|---|---|
| Stability | Guaranteed | Must verify |
| Linear phase | Easy (symmetric) | Not possible (causal) |
| Order for sharp cutoff | High (50–200+) | Low (4–12) |
| Latency | Higher (long filter) | Lower |
| Coefficient sensitivity | Low | High (poles near unit circle) |
| Adaptive filtering | Preferred (LMS, RLS) | Possible but tricky |

**Rule of thumb:** Use FIR when linear phase or guaranteed stability matters (audio, communications, medical). Use IIR when computational budget is tight and some phase distortion is acceptable (control systems, real-time embedded).

---

## 11. Digital Signal Processing (DSP) Implementation

### 11.1 Fixed-Point vs. Floating-Point
- **Fixed-point:** Integer arithmetic with an implied decimal point. Cheaper hardware, lower power, deterministic timing. But limited dynamic range and prone to overflow/quantization noise. Most embedded DSP (hearing aids, modems, MCUs).
- **Floating-point:** Mantissa × 2^exponent. Huge dynamic range (~$10^{38}$), easier to program, less risk of overflow. Higher power/cost. GPUs, workstations, modern SoCs.

**Quantization noise:** When a continuous signal is converted to $B$-bit fixed-point, each sample has a rounding error uniformly distributed in $[-\Delta/2, +\Delta/2]$ where $\Delta = 2^{-B} \times \text{full scale}$. The Signal-to-Quantization-Noise Ratio is approximately:
$$\text{SQNR} \approx 6.02B + 1.76 \text{ dB}$$
Each additional bit adds ~6 dB. A 16-bit audio ADC achieves ~98 dB SQNR; a 24-bit ADC achieves ~146 dB.

### 11.2 Filter Structures
The same transfer function $H(z)$ can be implemented in multiple structures with different numerical properties:
- **Direct Form I:** Straightforward from the difference equation. Two delay lines (one for $x$, one for $y$). Uses $M+N+1$ multiplies.
- **Direct Form II (Transposed):** Combines delay lines into one. Uses fewer delay elements ($\max(M,N)$), but can have worse numerical properties in fixed-point.
- **Cascade (Second-Order Sections / Biquads):** Factor $H(z)$ into a cascade of 2nd-order sections. Each section has well-controlled coefficient range. **The industry standard for IIR implementation** — reduces sensitivity to coefficient quantization.
- **Lattice structure:** Useful for adaptive filters and speech coding. Coefficients are reflection coefficients with magnitudes ≤ 1 (guaranteed stability).

### 11.3 Multirate DSP
- **Decimation (Downsampling by $M$):** Keep every $M$-th sample, discard the rest. Must lowpass filter first to prevent aliasing (just like analog anti-aliasing before ADC). Reduces sample rate and computation.
- **Interpolation (Upsampling by $L$):** Insert $L-1$ zeros between each sample, then lowpass filter to remove imaging artifacts. Increases sample rate.
- **Polyphase decomposition:** Splits a filter into $M$ sub-filters that operate at the lower rate. Makes decimation/interpolation computationally efficient. Used in sample rate converters, filter banks, and channelizers.

---

## 12. Modulation and Communication Systems

### 12.1 Why Modulate?
Baseband signals (audio: 20 Hz–20 kHz, video: 0–6 MHz) cannot be transmitted directly over wireless channels — the antenna would need to be hundreds of kilometers long ($\lambda/4$ at 1 kHz). Modulation shifts the signal to a carrier frequency $f_c$ where efficient transmission is possible.

### 12.2 Amplitude Modulation (AM)
$$y(t) = [1 + m \cdot x(t)] \cos(\omega_c t)$$
The spectrum of $x(t)$ is shifted to $\pm \omega_c$. Simple demodulation (envelope detection), but wastes power and bandwidth (carrier + two sidebands).
- **DSB-SC (Double Sideband Suppressed Carrier):** $y(t) = x(t)\cos(\omega_c t)$. More power-efficient but requires coherent demodulation (a local oscillator synchronized in phase).
- **SSB (Single Sideband):** Transmit only one sideband (upper or lower). Half the bandwidth of DSB. Used in HF radio.

### 12.3 Frequency Modulation (FM)
The instantaneous frequency varies with the signal: $\omega_i(t) = \omega_c + k_f x(t)$. FM is more resistant to amplitude noise than AM — the information is in the frequency, so amplitude variations (static, interference) can be clipped without losing the signal. This is why FM radio sounds cleaner than AM.

### 12.4 Digital Modulation
- **ASK/OOK:** On/off keying. Simple, used in RFID.
- **PSK (Phase Shift Keying):** BPSK (1 bit/symbol, most robust), QPSK (2 bits/symbol), 8-PSK (3 bits/symbol).
- **QAM (Quadrature Amplitude Modulation):** Combines amplitude and phase to pack more bits per symbol. 16-QAM (4 bits), 64-QAM (6 bits), 256-QAM (8 bits). Higher order → more spectral efficiency but more sensitive to noise. Wi-Fi 6 uses up to 1024-QAM.

---

## 13. Stochastic (Random) Signals and Processes

Real-world signals are rarely deterministic — sensor noise, channel fading, stock prices, and biological signals all have random components. Stochastic process theory provides the tools to analyze systems driven by random inputs.

### 13.1 Random Variables and Processes
A **random process** $X(t)$ (or $X[n]$) is a collection of random variables indexed by time. At each fixed $t$, $X(t)$ is a random variable with a probability distribution. One realization (one experiment) gives a deterministic function of time — a **sample function**.

### 13.2 Stationarity and Ergodicity
- **Strict-Sense Stationary (SSS):** All statistical properties are time-invariant. Very strong condition.
- **Wide-Sense Stationary (WSS):** Mean $\mu_X = E[X(t)]$ is constant, and autocorrelation $R_{XX}(t_1, t_2)$ depends only on the time difference $\tau = t_1 - t_2$:
$$R_{XX}(\tau) = E[X(t)X(t+\tau)]$$
Most practical analysis assumes WSS.
- **Ergodic:** Time averages equal ensemble averages. This lets us estimate statistical quantities from a single long observation — crucial because we usually can't run 10,000 parallel experiments.

### 13.3 Power Spectral Density (PSD)
For a WSS process, the **Wiener-Khinchin theorem** says:
$$S_{XX}(\omega) = \mathcal{F}\{R_{XX}(\tau)\} = \int_{-\infty}^{\infty} R_{XX}(\tau) e^{-j\omega\tau} d\tau$$
The PSD $S_{XX}(\omega)$ tells you how the signal's power is distributed across frequency.
- $S_{XX}(\omega) \geq 0$ always (power is non-negative).
- Total power: $P = \frac{1}{2\pi}\int S_{XX}(\omega) d\omega = R_{XX}(0)$.

**White noise:** $S_{NN}(\omega) = N_0/2$ (constant across all frequencies). The autocorrelation of white noise is $R_{NN}(\tau) = \frac{N_0}{2}\delta(\tau)$ — samples are uncorrelated at any nonzero lag. White noise is the standard model for thermal noise, quantization noise, and many interference sources.

### 13.4 LTI Systems with Random Inputs
If WSS input $X(t)$ with PSD $S_{XX}(\omega)$ is fed through an LTI system with transfer function $H(j\omega)$, the output is also WSS with:
$$S_{YY}(\omega) = |H(j\omega)|^2 S_{XX}(\omega)$$
This is enormously useful:
- **Noise shaping:** A lowpass filter on white noise produces bandlimited noise (the output PSD follows the filter's magnitude-squared response).
- **Matched filter:** To detect a known signal in white noise, the optimal filter has $H(j\omega) \propto X^*(j\omega)$ — it maximizes SNR at the output.
- **Wiener filter:** The optimal linear filter for estimating a signal from noisy observations, minimizing mean-square error. Its transfer function is:
$$H_{opt}(j\omega) = \frac{S_{XY}(\omega)}{S_{XX}(\omega)}$$

### 13.5 Noise in Practical Systems
- **Thermal noise (Johnson-Nyquist):** $v_{rms} = \sqrt{4k_BTR\Delta f}$. Fundamental, unavoidable, set by temperature and bandwidth.
- **Shot noise:** Due to discrete charge carriers (current is made of individual electrons). Dominates in photodiodes, tunnel junctions.
- **$1/f$ (flicker) noise:** PSD increases at low frequencies. Origin is complex (trapping/detrapping in semiconductors). Dominates at DC and low frequencies in amplifiers.
- **Noise figure (NF):** $NF = 10\log_{10}(F)$ where $F = SNR_{in}/SNR_{out}$. Measures how much a system degrades SNR. A low-noise amplifier (LNA) with NF = 1 dB adds very little noise. In a cascade, the first stage dominates (**Friis formula**):
$$F_{total} = F_1 + \frac{F_2 - 1}{G_1} + \frac{F_3 - 1}{G_1 G_2} + \cdots$$
This is why the first amplifier in a receiver chain must be low-noise.

---

## 14. Time-Frequency Analysis

### 14.1 The Uncertainty Principle
You cannot simultaneously have perfect time resolution and perfect frequency resolution. For any signal:
$$\Delta t \cdot \Delta \omega \geq \frac{1}{2}$$
A short pulse is well-localized in time but spread in frequency. A pure sinusoid is perfectly localized in frequency but extends forever in time. The Gaussian achieves equality.

### 14.2 Short-Time Fourier Transform (STFT)
$$\text{STFT}\{x(t)\}(\tau, \omega) = \int x(t) w(t - \tau) e^{-j\omega t} dt$$
Chop the signal into overlapping windows $w(t-\tau)$, compute the Fourier Transform of each chunk. The result is a **spectrogram** — a 2D plot of frequency content vs. time. Short windows → good time resolution, poor frequency resolution. Long windows → vice versa. The window length is fixed, so STFT has uniform time-frequency resolution.

### 14.3 Wavelet Transform
Uses scaled and shifted versions of a mother wavelet $\psi(t)$:
$$W(a,b) = \frac{1}{\sqrt{|a|}} \int x(t) \psi^*\left(\frac{t-b}{a}\right) dt$$
At small scale $a$: short, high-frequency wavelet → good time resolution for transients. At large scale $a$: long, low-frequency wavelet → good frequency resolution for slowly varying components. This **multi-resolution** behavior makes wavelets ideal for signals with both sharp events and sustained tones (speech, seismic data, ECG).

---

## 15. The Unified View

All of signals and systems theory rests on a few deep connections:

| Concept | CT | DT |
|---|---|---|
| Elementary signal | $e^{st}$ | $z^n$ |
| Transform | Laplace $\mathcal{L}$ | Z-Transform $\mathcal{Z}$ |
| Frequency analysis | CTFT ($s = j\omega$) | DTFT ($z = e^{j\Omega}$) |
| Periodic signals | Fourier Series | Discrete Fourier Series |
| Stability region | Left-half $s$-plane | Inside unit circle in $z$ |
| Convolution | $\int x(\tau)h(t-\tau)d\tau$ | $\sum x[k]h[n-k]$ |
| System description | ODE | Difference equation |
| Filter design | Butterworth, Cheby, Elliptic | FIR (Parks-McClellan), IIR (Bilinear) |

The Laplace Transform is the mother transform for CT, and the Z-Transform is the mother transform for DT. The Fourier Transform is a special case of each (evaluate on the boundary of the stability region). Sampling bridges the two worlds: it converts a CT signal into a DT signal, and the Z-Transform of the sampled signal relates to the Laplace Transform of the original via $z = e^{sT_s}$.

Understanding this architecture lets you move fluidly between domains and choose the right tool for each problem.
