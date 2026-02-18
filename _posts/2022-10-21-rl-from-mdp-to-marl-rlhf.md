---
title: Reinforcement Learning Notes From MDP to RLHF and MARL
tags: [reinforcement learning, RLHF, MARL]
style: fill
color: light
description: In-depth notes from AI foundations extended to modern deep RL, RLHF, and multi-agent reinforcement learning.
---

## 1. MDP Foundations

An MDP is a tuple

$$
\mathcal{M}=(\mathcal{S},\mathcal{A},P,R,\gamma).
$$

- $\mathcal{S}$: states
- $\mathcal{A}$: actions
- $P(s'\mid s,a)$: transition model
- $R(s,a)$ or $R(s,a,s')$: reward
- $\gamma\in[0,1)$: discount factor

Objective (episodic/infinite horizon variants):

$$
\pi^* = \arg\max_\pi \mathbb{E}_\pi\left[\sum_{t=0}^{\infty} \gamma^t r_t\right].
$$

Core value functions:

$$
V^\pi(s)=\mathbb{E}_\pi\left[\sum_{t=0}^\infty\gamma^t r_t\mid s_0=s\right],
$$

$$
Q^\pi(s,a)=\mathbb{E}_\pi\left[\sum_{t=0}^\infty\gamma^t r_t\mid s_0=s,a_0=a\right].
$$

Bellman expectation equations:

$$
V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\left[R(s,a,s')+\gamma V^\pi(s')\right].
$$

Bellman optimality:

$$
V^*(s)=\max_a\sum_{s'}P(s'\mid s,a)\left[R(s,a,s')+\gamma V^*(s')\right].
$$

---

## 2. Dynamic Programming (DP)

DP assumes known model $P,R$.

### 2.1 Policy Evaluation

Iterative updates for fixed policy $\pi$:

$$
V_{k+1}(s) \leftarrow \sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\left[R+\gamma V_k(s')\right].
$$

### 2.2 Policy Improvement

Greedy w.r.t. current value:

$$
\pi_{new}(s)=\arg\max_a\sum_{s'}P(s'\mid s,a)\left[R+\gamma V^\pi(s')\right].
$$

### 2.3 Policy Iteration and Value Iteration

- Policy Iteration: evaluate + improve until stable.
- Value Iteration:

$$
V_{k+1}(s) \leftarrow \max_a\sum_{s'}P(s'\mid s,a)[R+\gamma V_k(s')].
$$

DP is exact but scales poorly with large/continuous state spaces.

---

## 3. Temporal-Difference (TD) Learning

TD learns from sampled transitions without full model.

### 3.1 TD(0) for state values

$$
V(s_t) \leftarrow V(s_t) + \alpha\big[r_t + \gamma V(s_{t+1}) - V(s_t)\big].
$$

### 3.2 SARSA (on-policy)

$$
Q(s_t,a_t)\leftarrow Q(s_t,a_t)+\alpha\big[r_t+\gamma Q(s_{t+1},a_{t+1})-Q(s_t,a_t)\big].
$$

### 3.3 Q-learning (off-policy)

$$
Q(s_t,a_t)\leftarrow Q(s_t,a_t)+\alpha\big[r_t+\gamma\max_a Q(s_{t+1},a)-Q(s_t,a_t)\big].
$$

TD bootstraps (uses estimates) and typically learns faster than pure Monte Carlo.

---

## 4. Dyna-Q (Model-based + TD Hybrid)

Dyna-Q combines real experience and planning with learned model.

Loop:

1. take real action, observe $(s,a,r,s')$,
2. TD update on real transition,
3. update model $\hat P,\hat R$ (often tabular memorization),
4. simulate $n$ model rollouts and apply extra TD updates.

Why it works: each real sample gets amplified through synthetic planning updates.

---

## 5. Deep Q-Learning Family

### 5.1 DQN

Approximate $Q(s,a;\theta)$ with neural network.

Loss:

$$
\mathcal{L}(\theta)=\mathbb{E}_{(s,a,r,s')\sim\mathcal D}\left[\left(y-r-Q(s,a;\theta)\right)^2\right],
$$

where

$$
y=r+\gamma\max_{a'}Q(s',a';\theta^-).
$$

Key stabilizers:

- replay buffer $\mathcal D$ (decorrelates samples),
- target network $\theta^-$ (slow-moving target).

### 5.2 Double DQN

Reduces max-operator overestimation:

$$
y=r+\gamma Q\left(s',\arg\max_{a'}Q(s',a';\theta);\theta^-\right).
$$

### 5.3 Dueling DQN

Decomposes Q into value and advantage streams:

$$
Q(s,a)=V(s)+\left(A(s,a)-\frac{1}{|\mathcal A|}\sum_{a'}A(s,a')\right).
$$

Helps when action values are similar in many states.

---

## 6. Actor-Critic Methods

Actor-critic optimizes policy directly while learning value baseline.

Policy gradient theorem:

$$
\nabla_\theta J(\theta)=\mathbb{E}_{\pi_\theta}\left[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\,A^{\pi}(s_t,a_t)\right].
$$

Critic estimates $V$ or $Q$; actor uses advantage estimate to reduce variance.

Typical advantage estimate (GAE form):

$$
\hat A_t = \sum_{l=0}^{\infty}(\gamma\lambda)^l\delta_{t+l},
\quad
\delta_t = r_t + \gamma V(s_{t+1}) - V(s_t).
$$

---

## 7. TRPO and PPO

### 7.1 TRPO

Trust-region objective:

$$
\max_\theta\; \mathbb E\left[\frac{\pi_\theta(a\mid s)}{\pi_{\theta_{old}}(a\mid s)}\hat A\right]
\quad
\text{s.t.}\quad
\mathbb E\big[D_{KL}(\pi_{\theta_{old}}\|\pi_\theta)\big]\le \delta.
$$

It gives monotonic improvement guarantees (under approximations) but is complex.

### 7.2 PPO

Practical simplification via clipped surrogate:

$$
L^{clip}(\theta)=\mathbb E\left[\min\left(r_t(\theta)\hat A_t,\;\operatorname{clip}(r_t(\theta),1-\epsilon,1+\epsilon)\hat A_t\right)\right],
$$

$$
r_t(\theta)=\frac{\pi_\theta(a_t\mid s_t)}{\pi_{old}(a_t\mid s_t)}.
$$

PPO is robust and widely used in both single-agent and multi-agent on-policy settings.

---

## 8. Deterministic and Maximum-Entropy Continuous Control

### 8.1 DDPG

Off-policy actor-critic for continuous actions.

Actor: deterministic policy $\mu_\theta(s)$.

Critic target:

$$
y=r+\gamma Q_{\phi^-}(s',\mu_{\theta^-}(s')).
$$

Actor update via deterministic policy gradient:

$$
\nabla_\theta J\approx \mathbb E\left[\nabla_a Q_\phi(s,a)\vert_{a=\mu_\theta(s)}\nabla_\theta \mu_\theta(s)\right].
$$

### 8.2 SAC

Maximum-entropy objective:

$$
J(\pi)=\sum_t\mathbb E\big[r(s_t,a_t)+\alpha\mathcal H(\pi(\cdot\mid s_t))\big].
$$

Uses stochastic actor + twin Q critics + entropy temperature tuning. SAC is generally more stable and sample-efficient than DDPG in many benchmarks.

---

## 9. RLHF (Reinforcement Learning from Human Feedback)

Standard pipeline:

1. **SFT**: supervised fine-tuning on demonstrations.
2. **Preference data**: human chooses better output among candidates.
3. **Reward model** $r_\psi(x,y)$ trained from pairwise preferences.
4. **RL fine-tuning** (often PPO-style) to maximize reward model while constraining divergence from reference model.

Common objective form:

$$
\max_\pi \mathbb E_{y\sim\pi(\cdot\mid x)}\left[r_\psi(x,y) - \beta D_{KL}(\pi(\cdot\mid x)\|\pi_{ref}(\cdot\mid x))\right].
$$

Key challenges:

- reward hacking/specification gaming,
- distribution shift in reward model,
- balancing helpfulness/honesty/safety,
- expensive and noisy human preference labels.

---

## 10. Multi-Agent Reinforcement Learning (MARL)

Each agent $i$ has policy $\pi_i(a_i\mid o_i)$; joint environment dynamics depend on all actions $\mathbf a=(a_1,...,a_n)$.

Core issue: non-stationarity from each agent's policy changing during training.

### 10.1 CTDE paradigm

**Centralized Training, Decentralized Execution**:

- training may use global state and joint actions,
- execution uses each agent’s local observation.

---

## 11. IPPO, MAPPO, MADDPG, MASAC

### 11.1 IPPO

Independent PPO per agent, often parameter sharing for homogeneous agents.

Pros: simple and strong baseline.
Cons: ignores explicit centralized critic information.

### 11.2 MAPPO

PPO-style actor updates with centralized critic (global state/joint info).

Why strong in cooperative tasks:

- stable on-policy updates,
- good credit-assignment support via critic design,
- fewer brittle hyperparameter interactions than many off-policy MARL methods.

### 11.3 MADDPG

Extends DDPG with centralized critics per agent:

$$
Q_i(s,a_1,...,a_n),\quad \pi_i(o_i).
$$

Historically important, but often not SOTA now.

### 11.4 Why MADDPG is often not SOTA now

Common reasons in modern benchmarks:

1. **Off-policy instability under multi-agent non-stationarity** (replay becomes stale quickly).
2. **Deterministic policies** can under-explore compared to entropy-regularized stochastic methods.
3. **High sensitivity** to hyperparameters and target-update choices.
4. **Scaling issues** with many agents due to critic input growth and coordination complexity.
5. **Weaker robustness** than MAPPO-like methods in partially observable cooperative domains (e.g., SMAC-style settings).

So MADDPG remains a valuable baseline/teaching algorithm, but newer PPO- and entropy-based CTDE methods often outperform it in practice.

### 11.5 MASAC

Multi-agent extension of SAC using CTDE with entropy-regularized stochastic actors.

Benefits:

- improved exploration,
- better stability than deterministic counterparts,
- often stronger performance in continuous-control MARL tasks.

Design choices vary by implementation (shared vs per-agent critics, factorized critics, centralized temperature tuning).

---

## 12. Practical Algorithm Selection Guide

- Small tabular MDP: DP/TD/Q-learning.
- Discrete high-dimensional single-agent: DQN variants (Double + Dueling as default baseline).
- Continuous control single-agent: SAC first, DDPG if deterministic policy needed.
- On-policy robust control / RLHF fine-tuning: PPO family.
- Cooperative MARL with partial observability: MAPPO/IPPO baselines first.
- Continuous-action MARL: MASAC (and MAPPO variants) before MADDPG in many modern settings.

---

## Compact Formula Sheet

- Bellman optimality: $V^*(s)=\max_a\sum_{s'}P(s'\mid s,a)[R+\gamma V^*(s')]$.
- TD(0): $V\leftarrow V+\alpha[r+\gamma V'-V]$.
- Q-learning target: $r+\gamma\max_{a'}Q(s',a')$.
- Double DQN target: $r+\gamma Q_{\theta^-}(s',\arg\max_{a'}Q_\theta(s',a'))$.
- PPO ratio: $r_t(\theta)=\pi_\theta/\pi_{old}$ with clipping.
- SAC objective: maximize reward + entropy.
- RLHF objective: reward-model score with KL penalty to reference policy.

These notes connect classical decision-making foundations to modern deep RL and multi-agent practice.
