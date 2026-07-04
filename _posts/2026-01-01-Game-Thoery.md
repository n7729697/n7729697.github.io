---
title: Computational Game Theory- From Formulation to Equilibrium
tags: [game theory, nash equilibrium, potential games, mechanism design]
style: fill
color: light
description: A concise treatment of computational game theory — deriving key equilibrium concepts from first principles, with worked examples and practical connections to multi-agent coordination.
---

_This note is adapted from course materials for **1MA083 Game Theory** at **Uppsala University**. Instructor: course teaching staff._

## Central Question

Game theory asks: **what outcomes are stable when decision-makers optimize while affecting one another?**

A normal-form game is

$$
\Gamma=\langle N,(A_i)_{i\in N},(u_i)_{i\in N}\rangle,
$$

where $N$ is the player set, $A_i$ is player $i$'s action set, and $u_i:A\to\mathbb R$ is the utility function. The modeling burden is in $u_i$: it encodes reward, cost, risk, information, fairness, and incentives.

{% include figure.html image="/assets/img/posts/game-theory/game-modeling-loop.svg" alt="Game-theory modeling loop from players and actions to utilities, equilibrium concept, computation, and mechanism redesign." caption="Game-theoretic modeling is iterative: define incentives, compute stable behavior, then redesign rules if the outcome is undesirable." %}

## 1. Dominance, Best Response, and Nash Equilibrium

Action $a_i$ is strictly dominated by $a_i'$ if

$$
u_i(a_i',a_{-i})>u_i(a_i,a_{-i})\qquad\forall a_{-i}.
$$

Strictly dominated actions can be eliminated because a rational player never needs them.

Given opponents' actions, player $i$'s best-response set is

$$
BR_i(a_{-i})=\arg\max_{a_i\in A_i}u_i(a_i,a_{-i}).
$$

A pure Nash equilibrium satisfies

$$
a_i^*\in BR_i(a_{-i}^*)\qquad\forall i.
$$

Equivalently, no player can improve by unilateral deviation. This does not mean the outcome is socially optimal. Prisoner's Dilemma is the canonical warning: individually stable behavior can be collectively inefficient.

{% include figure.html image="/assets/img/posts/game-theory/best-response-nash-matrix.svg" alt="Two-by-two payoff matrix with best-response arrows and Nash equilibrium cell." caption="A Nash equilibrium is a mutual best response, not necessarily the best joint outcome." %}

## 2. Mixed and Correlated Equilibrium

A mixed strategy is a distribution $\sigma_i\in\Delta(A_i)$. Expected utility is

$$
U_i(\sigma)=\sum_{a\in A}\left(\prod_j\sigma_j(a_j)\right)u_i(a).
$$

At a mixed equilibrium, every action in a player's support yields the same expected payoff. Nash's theorem guarantees at least one mixed equilibrium in every finite game.

Correlated equilibrium allows a mediator to draw a joint recommendation $a\sim\pi$ and privately recommend $a_i$ to player $i$. The obedience constraints are linear:

$$
\sum_{a_{-i}}\pi(a_i,a_{-i})
\left[u_i(a_i,a_{-i})-u_i(a_i',a_{-i})\right]\ge0.
$$

Correlated equilibria can coordinate better outcomes than independent mixed strategies and can be computed by linear programming.

## 3. Incomplete Information, Sequential Play, and Repetition

Bayesian games add private types:

$$
\Gamma^B=\langle N,(A_i),(\Theta_i),(u_i),p\rangle.
$$

A Bayesian Nash equilibrium is a type-contingent strategy profile:

$$
s_i^*(\theta_i)\in
\arg\max_{a_i}
\sum_{\theta_{-i}}p(\theta_{-i}\mid\theta_i)
u_i(a_i,s_{-i}^*(\theta_{-i}),\theta_i,\theta_{-i}).
$$

Extensive-form games model sequential decisions. Subgame-perfect equilibrium removes non-credible threats by requiring Nash equilibrium in every subgame. Backward induction is the key computation in finite perfect-information trees.

Repeated games introduce time and incentives for cooperation. With discount factor $\delta$,

$$
V_i=(1-\delta)\sum_{t=0}^{\infty}\delta^t u_i^t.
$$

In repeated Prisoner's Dilemma, grim-trigger cooperation can be sustained when future punishment is valuable enough.

{% include figure.html image="/assets/img/posts/game-theory/information-time-equilibrium-map.svg" alt="Map showing normal-form, Bayesian, extensive-form, and repeated games by information and time structure." caption="Different equilibrium concepts arise because information, timing, and possible deviations change." %}

## 4. Potential, Supermodular, and Computationally Friendly Games

A game has an exact potential function $\Phi$ if unilateral utility changes match potential changes:

$$
u_i(a_i',a_{-i})-u_i(a_i,a_{-i})
=
\Phi(a_i',a_{-i})-\Phi(a_i,a_{-i}).
$$

Potential games are computationally attractive because better-response dynamics climb $\Phi$, and maximizers of $\Phi$ are pure Nash equilibria.

Congestion games have Rosenthal's potential:

$$
\Phi(S)=-\sum_{e\in E}\sum_{k=1}^{x_e}c_e(k).
$$

Supermodular games model strategic complements. Increasing differences imply monotone best responses and useful comparative statics. These structures matter because general equilibrium computation can be hard, but special structure often gives convergence and interpretable algorithms.

{% include figure.html image="/assets/img/posts/game-theory/potential-game-dynamics.svg" alt="Potential landscape with better-response dynamics climbing to a local equilibrium." caption="In a potential game, decentralized better responses climb a shared potential landscape." %}

## 5. Mechanism Design and Coalitional Stability

Mechanism design reverses the usual question. Instead of predicting behavior in a fixed game, it designs rules so strategic behavior implements desired outcomes.

For quasi-linear utilities, VCG chooses

$$
x^*(\hat\theta)=\arg\max_x\sum_i v_i(x,\hat\theta_i)
$$

and charges Clarke pivot payments:

$$
t_i=
\max_x\sum_{j\ne i}v_j(x,\hat\theta_j)
-
\sum_{j\ne i}v_j(x^*(\hat\theta),\hat\theta_j).
$$

This makes truthful reporting a dominant strategy under the VCG assumptions.

Coalitional games ask whether groups can profitably deviate. A transferable-utility game is $(N,v)$ with $v:2^N\to\mathbb R$. An allocation is in the core if

$$
\sum_{i\in S}x_i\ge v(S)\qquad\forall S\subseteq N.
$$

The Shapley value allocates payoff by average marginal contribution:

$$
\phi_i(v)=
\sum_{S\subseteq N\setminus\{i\}}
\frac{|S|!(n-|S|-1)!}{n!}
\left[v(S\cup\{i\})-v(S)\right].
$$

## 6. Learning and Multi-Agent Systems

Fictitious play best-responds to empirical opponent frequencies. No-regret learning guarantees

$$
\frac{R_i^T}{T}\to0,
$$

where

$$
R_i^T=
\max_{a_i}\sum_{t=1}^T u_i(a_i,a_{-i}^{(t)})
-
\sum_{t=1}^T u_i(a_i^{(t)},a_{-i}^{(t)}).
$$

If all players use no-regret algorithms, time-averaged play converges to coarse correlated equilibrium.

Game theory is useful in multi-agent robotics and distributed systems when autonomy creates coupled incentives: task allocation, path deconfliction, charging schedules, relay assignment, resource sharing, and communication congestion.

{% include figure.html image="/assets/img/posts/game-theory/multi-agent-game-architecture.svg" alt="Multi-agent architecture connecting local utilities, equilibrium solver, shared resources, safety filter, and coordinated action." caption="In engineered multi-agent systems, game-theoretic plans should be filtered through safety and feasibility constraints before execution." %}

## What This Framework Lets Us Do

Game theory gives a language for strategic stability, coordination, incentive design, fairness, and decentralized computation. It is especially useful when optimizing one agent in isolation changes the environment seen by others.

## Where the Framework Stops Being Reliable

Equilibrium predictions depend on rationality, information, utility design, and the assumed deviation class. A mathematically stable equilibrium can be unfair, unsafe, inefficient, or unreachable by the learning dynamics used in practice.

## Where the Subject Leads Next

The next steps are algorithmic game theory, auction design, mean-field games, learning in games, multi-agent reinforcement learning, and mechanism design for autonomous systems.

## Technical and Editorial Audit

- Replaced hotlinked Wikimedia images with local original SVG figures.
- Preserved the 1MA083 Uppsala University course attribution in the main text.
- Condensed a long equilibrium survey into a conceptual path from game formulation to equilibria, mechanisms, coalitions, learning, and multi-agent applications.
- Kept core formulas for Nash equilibrium, mixed utility, correlated equilibrium, Bayesian equilibrium, discounting, potential games, VCG, core, Shapley value, and regret.
- The filename typo `Game-Thoery` is preserved to avoid breaking URLs.

## Main Sources Used in This Note

- M. J. Osborne and A. Rubinstein, _A Course in Game Theory_.
- Y. Shoham and K. Leyton-Brown, _Multiagent Systems_.
- N. Nisan et al., _Algorithmic Game Theory_.
- D. Fudenberg and J. Tirole, _Game Theory_.
