---
title: Computational Game Theory- From Formulation to Equilibrium
tags: [game theory, nash equilibrium, potential games, mechanism design]
style: fill
color: light
description: A concise treatment of computational game theory — deriving key equilibrium concepts from first principles, with worked examples and practical connections to multi-agent coordination.
---

## 1. What Is a Game?

A **strategic (normal-form) game** is a tuple

$$
\Gamma = \langle N,\;(A_i)_{i\in N},\;(u_i)_{i\in N}\rangle
$$

where

| Symbol | Meaning |
|--------|---------|
| $N = \{1,\dots,n\}$ | finite set of **players** |
| $A_i$ | action (strategy) set of player $i$ |
| $A = A_1 \times \cdots \times A_n$ | **joint action space** |
| $u_i : A \to \mathbb{R}$ | **utility (payoff) function** of player $i$ |

Each player picks an action **simultaneously**; the outcome depends on the entire profile $a = (a_1,\dots,a_n) \in A$.

**Key modelling insight.** The utility $u_i$ encodes everything player $i$ cares about — reward, cost, risk, fairness — so *utility engineering* is as important as algorithm design.

---

## 2. Dominant Strategies and Elimination

**Definition (Strict dominance).** Action $a_i$ is **strictly dominated** by $a_i'$ if

$$
u_i(a_i', a_{-i}) > u_i(a_i, a_{-i}) \quad \forall\, a_{-i} \in A_{-i}.
$$

A rational player never plays a strictly dominated action. We can therefore **iteratively eliminate** dominated strategies (IESDS) to simplify the game; the order of elimination does not matter for strict dominance.

### Example: Prisoner's Dilemma

|  | **C** (cooperate) | **D** (defect) |
|--|:-:|:-:|
| **C** | $(-1,-1)$ | $(-3,\;0)$ |
| **D** | $(0,-3)$ | $(-2,-2)$ |

For Player 1: $u_1(D,C)=0 > -1 = u_1(C,C)$ and $u_1(D,D)=-2 > -3 = u_1(C,D)$, so $D$ strictly dominates $C$. By symmetry the same holds for Player 2.

$$
\Rightarrow \text{Unique outcome: } (D,D) \text{ with payoffs } (-2,-2).
$$

Both players could do better at $(C,C)$, but **unilateral deviation** from $C$ is profitable — the core tension game theory formalises.

![Prisoner's Dilemma payoff matrix](https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Prisoners_dilemma.svg/900px-Prisoners_dilemma.svg.png)
*Prisoner's Dilemma normal form. Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Prisoners_dilemma.svg), CC BY-SA 3.0.*

---

## 3. Best Response and Nash Equilibrium

### 3.1 Best Response

Given opponents' actions $a_{-i}$, player $i$'s **best response** set is

$$
BR_i(a_{-i}) = \arg\max_{a_i \in A_i}\; u_i(a_i, a_{-i}).
$$

### 3.2 Pure Nash Equilibrium (PNE)

A profile $a^* = (a_1^*,\dots,a_n^*)$ is a **Nash equilibrium** if every player is simultaneously best-responding:

$$
\boxed{a_i^* \in BR_i(a_{-i}^*) \quad \forall\, i \in N}
$$

Equivalently, **no player can improve by deviating unilaterally**:

$$
u_i(a_i^*, a_{-i}^*) \geq u_i(a_i, a_{-i}^*) \quad \forall\, a_i \in A_i,\;\forall\, i.
$$

### Example: Coordination Game (Battle of the Sexes)

|  | **Opera** | **Football** |
|--|:-:|:-:|
| **Opera** | $(3,2)$ | $(0,0)$ |
| **Football** | $(0,0)$ | $(2,3)$ |

Check $(O,O)$: Player 1 gets 3 vs 0 if deviating → no incentive. Player 2 gets 2 vs 0 → no incentive. **NE.**

Check $(F,F)$: Player 1 gets 2 vs 0 → no incentive. Player 2 gets 3 vs 0 → no incentive. **NE.**

Check $(O,F)$: Player 1 gets 0, could switch to $F$ and get 2 → deviation profitable. **Not NE.**

Multiple NE are common and create a **coordination problem**: which one will the players settle on?

---

## 4. Mixed Strategies and Nash's Theorem

Not every game has a PNE (e.g., Matching Pennies). We extend to **mixed strategies**.

### 4.1 Mixed Strategy

A mixed strategy for player $i$ is a probability distribution $\sigma_i \in \Delta(A_i)$, where $\sigma_i(a_i)$ is the probability of playing $a_i$.

**Expected utility** under a mixed profile $\sigma = (\sigma_1,\dots,\sigma_n)$:

$$
U_i(\sigma) = \sum_{a \in A} \left(\prod_{j=1}^{n} \sigma_j(a_j)\right) u_i(a).
$$

### 4.2 Indifference Principle

At a mixed NE, every action in the **support** of $\sigma_i^*$ must yield the **same** expected payoff. If some action gave strictly more, the player would shift all probability mass to it.

$$
\text{If } \sigma_i^*(a_i) > 0 \text{ and } \sigma_i^*(a_i') > 0, \text{ then } U_i(a_i, \sigma_{-i}^*) = U_i(a_i', \sigma_{-i}^*).
$$

### 4.3 Derivation: Matching Pennies

|  | **H** | **T** |
|--|:-:|:-:|
| **H** | $(1,-1)$ | $(-1,1)$ |
| **T** | $(-1,1)$ | $(1,-1)$ |

Let Player 2 play $H$ with probability $q$. Player 1's expected payoffs:

$$
U_1(H, q) = q(1) + (1-q)(-1) = 2q - 1
$$

$$
U_1(T, q) = q(-1) + (1-q)(1) = 1 - 2q
$$

For Player 1 to be **willing to mix**, we need indifference:

$$
2q - 1 = 1 - 2q \;\;\Longrightarrow\;\; 4q = 2 \;\;\Longrightarrow\;\; q^* = \tfrac{1}{2}
$$

By symmetry, Player 1 also mixes $p^* = \tfrac{1}{2}$.

$$
\boxed{\sigma^* = \left(\tfrac{1}{2}H + \tfrac{1}{2}T,\;\tfrac{1}{2}H + \tfrac{1}{2}T\right), \quad U_i(\sigma^*) = 0}
$$

### 4.4 Nash's Existence Theorem

> **Theorem (Nash, 1950).** Every finite game (finite $N$, finite $A_i$) has at least one mixed-strategy Nash equilibrium.

The proof uses **Kakutani's fixed-point theorem** on the best-response correspondence $BR: \Delta(A) \rightrightarrows \Delta(A)$, which is non-empty, convex-valued, and upper hemicontinuous when utilities are continuous and action sets are compact convex.

---

## 5. Deriving Equilibrium in $2 \times 2$ Games (General Method)

Consider a general $2 \times 2$ game:

|  | **L** | **R** |
|--|:-:|:-:|
| **T** | $(a_{11}, b_{11})$ | $(a_{12}, b_{12})$ |
| **B** | $(a_{21}, b_{21})$ | $(a_{22}, b_{22})$ |

Let Player 1 play $T$ with probability $p$, Player 2 play $L$ with probability $q$.

**Step 1: Indifference for Player 2** (to find $p^*$).

Player 2 is indifferent between $L$ and $R$:

$$
p\, b_{11} + (1-p)\, b_{21} = p\, b_{12} + (1-p)\, b_{22}
$$

$$
\Longrightarrow \quad p^* = \frac{b_{22} - b_{21}}{(b_{11} - b_{12}) - (b_{21} - b_{22})}
$$

**Step 2: Indifference for Player 1** (to find $q^*$).

$$
q\, a_{11} + (1-q)\, a_{12} = q\, a_{21} + (1-q)\, a_{22}
$$

$$
\Longrightarrow \quad q^* = \frac{a_{22} - a_{12}}{(a_{11} - a_{21}) - (a_{12} - a_{22})}
$$

If $p^*,q^* \in (0,1)$, a strictly mixed NE exists. Pure NE correspond to corner solutions $(p,q) \in \{0,1\}^2$.

---

## 6. Correlated Equilibrium

A **correlated equilibrium (CE)** generalises NE by allowing a **mediator** to privately recommend actions to each player. Formally:

Let $\pi$ be a distribution over $A$. The mediator draws $a \sim \pi$ and tells player $i$ only their component $a_i$. This is a CE if no player gains from deviating:

$$
\boxed{\sum_{a_{-i}} \pi(a_i, a_{-i})\bigl[u_i(a_i, a_{-i}) - u_i(a_i', a_{-i})\bigr] \geq 0 \quad \forall\, i,\; \forall\, a_i \in \text{supp}_i(\pi),\; \forall\, a_i' \in A_i}
$$

**Why CE matters:**
- Every NE is a CE (product distributions are special cases).
- CE can achieve **higher social welfare** than any NE.
- CE can be computed by **linear programming** (the constraints above are linear in $\pi$), whereas finding NE is PPAD-complete in general.

### Example: Traffic Intersection

Two drivers approach an intersection. If both go, they crash (payoff $-10$). If one goes and the other waits, the goer gets $1$, the waiter gets $0$.

|  | **Go** | **Wait** |
|--|:-:|:-:|
| **Go** | $(-10,-10)$ | $(1,0)$ |
| **Wait** | $(0,1)$ | $(0,0)$ |

Pure NE: $(Go, Wait)$ and $(Wait, Go)$. Mixed NE gives positive crash probability.

A **traffic light (correlated signal)** recommends (Go, Wait) and (Wait, Go) each with probability $\tfrac{1}{2}$:

$$
\pi(Go,Wait) = \pi(Wait,Go) = \tfrac{1}{2}.
$$

Expected payoff per player: $\tfrac{1}{2}(1) + \tfrac{1}{2}(0) = 0.5$. No crash. This CE is better than the mixed NE — the signal *coordinates*.

---

## 7. Bayesian Games and Incomplete Information

When players have **private types** (hidden costs, capabilities, preferences), we model this as a **Bayesian game**:

$$
\Gamma^B = \langle N,\;(A_i),\;(\Theta_i),\;(u_i),\;p \rangle
$$

where $\Theta_i$ is the type space of player $i$, and $p$ is a common prior over $\Theta = \Theta_1 \times \cdots \times \Theta_n$.

A **Bayesian Nash Equilibrium (BNE)** is a strategy profile $s^* = (s_1^*,\dots,s_n^*)$ where $s_i^*: \Theta_i \to A_i$ and:

$$
\boxed{s_i^*(\theta_i) \in \arg\max_{a_i \in A_i} \sum_{\theta_{-i}} p(\theta_{-i}|\theta_i)\, u_i(a_i,\, s_{-i}^*(\theta_{-i}),\, \theta_i,\, \theta_{-i}) \quad \forall\, \theta_i}
$$

Each player maximises **expected** utility over others' types, given their own type and beliefs.

### Example: First-Price Sealed-Bid Auction

Two bidders with private valuations $v_i \sim \text{Uniform}[0,1]$, independent. Highest bidder wins, pays own bid $b_i$. Utility:

$$
u_i(b_i, b_{-i}, v_i) = \begin{cases} v_i - b_i & \text{if } b_i > b_{-i} \\ 0 & \text{if } b_i < b_{-i} \end{cases}
$$

**Deriving the BNE.** Conjecture symmetric linear strategies: $b_j(v_j) = \alpha v_j$.

Player $i$'s expected utility from bidding $b_i$:

$$
\mathbb{E}[u_i] = (v_i - b_i)\, \Pr(b_i > \alpha v_j) = (v_i - b_i)\, \Pr\!\left(v_j < \frac{b_i}{\alpha}\right) = (v_i - b_i)\,\frac{b_i}{\alpha}
$$

Maximise over $b_i$:

$$
\frac{d}{d b_i}\left[\frac{b_i(v_i - b_i)}{\alpha}\right] = \frac{v_i - 2b_i}{\alpha} = 0 \quad\Longrightarrow\quad b_i^* = \frac{v_i}{2}
$$

This gives $\alpha = \tfrac{1}{2}$, confirming the conjecture. In equilibrium, **each bidder bids half their valuation** — they shade their bid to extract surplus.

$$
\boxed{b_i^*(v_i) = \frac{v_i}{2} \quad \text{(BNE of 2-player first-price auction)}}
$$

For $n$ bidders the result generalises to $b_i^*(v_i) = \frac{n-1}{n}\,v_i$.

---

## 8. Extensive-Form Games and Subgame Perfection

An **extensive-form game** models **sequential** decisions via a game tree.

![Extensive-form game tree](https://upload.wikimedia.org/wikipedia/commons/2/2a/Extensive_form_game_4.JPG)
*Example game tree with branching decisions and terminal payoffs. Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Extensive_form_game_4.JPG), CC BY-SA 3.0.*

### 8.1 Subgame Perfect Equilibrium (SPE)

Nash equilibrium in extensive form can involve **non-credible threats** — a player threatens an action they would never actually carry out. SPE eliminates this:

> A strategy profile is a **subgame perfect equilibrium** if it induces a Nash equilibrium in **every subgame**.

We find SPE by **backward induction**: solve from the terminal nodes upward.

### Example: Entry Deterrence

- **Stage 1:** Entrant chooses **Enter** or **Stay Out**.
- **Stage 2:** If entry occurs, Incumbent chooses **Fight** ($(-1,-1)$) or **Accommodate** ($(1,1)$).

**Backward induction:** At stage 2, Incumbent prefers Accommodate ($1 > -1$). Knowing this, Entrant enters ($1 > 0$).

$$
\text{SPE: (Enter, Accommodate)} \quad \text{payoffs } (1,1).
$$

The "threat to fight" is not credible — once entry happens, fighting hurts the Incumbent too.

### 8.2 One-Deviation Principle

To verify SPE in finite games, it suffices to check that **no player** can improve by deviating at **exactly one** decision node (keeping future strategy the same). This reduces verification from exponential to linear in the tree size.

---

## 9. Repeated Games and Cooperation

When a stage game $G$ is played **repeatedly** (possibly infinitely), richer strategic behaviour emerges.

### 9.1 Discount Factor and Payoffs

With discount factor $\delta \in [0,1)$, the **discounted** average payoff from a stream $(u^0, u^1, u^2, \dots)$ is:

$$
V_i = (1-\delta)\sum_{t=0}^{\infty} \delta^t\, u_i^t
$$

### 9.2 The Folk Theorem (Informal)

> If $\delta$ is sufficiently close to 1, **any** feasible payoff vector that gives each player more than their **minimax value** can be sustained as a (subgame perfect) equilibrium of the infinitely repeated game.

The **minimax value** for player $i$:

$$
\underline{v}_i = \min_{a_{-i}} \max_{a_i} u_i(a_i, a_{-i})
$$

This is the lowest payoff others can force on player $i$ when $i$ plays optimally.

### 9.3 Deriving the Threshold: Grim Trigger in Prisoner's Dilemma

Using the payoff matrix from Section 2, consider the **Grim Trigger** strategy: cooperate initially; if anyone defects, defect forever.

**Cooperation payoff stream:** $-1$ every period.

$$
V_i^{\text{coop}} = (1-\delta)\sum_{t=0}^{\infty}\delta^t(-1) = -1
$$

**Deviation payoff stream:** deviation yields $0$ today, then $-2$ forever (punished by both playing $D$).

$$
V_i^{\text{dev}} = (1-\delta)\Bigl[0 + \delta(-2) + \delta^2(-2) + \cdots\Bigr] = (1-\delta)\cdot\frac{-2\delta}{1-\delta} = -2\delta
$$

**Cooperation is sustainable iff**:

$$
V_i^{\text{coop}} \geq V_i^{\text{dev}} \quad\Longrightarrow\quad -1 \geq -2\delta \quad\Longrightarrow\quad \boxed{\delta \geq \frac{1}{2}}
$$

When players are **patient enough** ($\delta \geq \frac{1}{2}$), the threat of perpetual punishment makes cooperation self-enforcing — even without binding contracts.

---

## 10. Potential Games

A game has an **exact potential function** $\Phi: A \to \mathbb{R}$ if, for every player $i$, changing $i$'s action while others stay fixed changes $\Phi$ by the same amount as $i$'s utility:

$$
\boxed{u_i(a_i', a_{-i}) - u_i(a_i, a_{-i}) = \Phi(a_i', a_{-i}) - \Phi(a_i, a_{-i}) \quad \forall\, i,\;a_i,a_i',a_{-i}}
$$

### Why Potential Games Are Computationally Attractive

1. **PNE exist** — any maximiser of $\Phi$ is a PNE.
2. **Best-response dynamics converge** — each best-response strictly increases $\Phi$ (finite improvement property).
3. **Decentralised optimisation** — players independently maximising their own $u_i$ collectively climb $\Phi$.

### Example: Congestion Game

$n$ players choose among resources $E$. Each resource $e$ has a cost $c_e(x_e)$ depending on congestion $x_e$ (number of users). Player $i$ chooses a subset $S_i \subseteq E$ and pays:

$$
u_i(S_i, S_{-i}) = -\sum_{e \in S_i} c_e(x_e)
$$

**Rosenthal's potential:**

$$
\Phi(S_1,\dots,S_n) = -\sum_{e \in E}\sum_{k=1}^{x_e} c_e(k)
$$

**Verification.** When player $i$ switches from resource $e$ to $e'$:
- Potential change from dropping $e$: removes $c_e(x_e)$ from the sum → $\Delta\Phi = +c_e(x_e)$.
- Potential change from adding $e'$: adds $c_{e'}(x_{e'}+1)$ → $\Delta\Phi = -c_{e'}(x_{e'}+1)$.
- Utility change = same. ✓

This proves every congestion game is an exact potential game with guaranteed PNE.

### Price of Anarchy in Congestion Games

The **Price of Anarchy (PoA)** measures equilibrium inefficiency:

$$
\text{PoA} = \frac{\text{Social welfare at worst NE}}{\text{Optimal social welfare}} = \frac{\min_{a^*\in \text{NE}} \sum_i u_i(a^*)}{\max_a \sum_i u_i(a)}
$$

For linear congestion games ($c_e(x) = a_e x + b_e$), the PoA is bounded by $\frac{5}{2}$ — decentralised behaviour is at most 2.5× worse than optimal. This bound is tight.

---

## 11. Supermodular Games and Monotone Dynamics

A game is **supermodular** if actions are **strategic complements**: when opponents increase their actions, a player's best response weakly increases too.

**Formally**, with ordered action sets, the game is supermodular if $u_i$ has **increasing differences**:

$$
u_i(a_i', a_{-i}') - u_i(a_i, a_{-i}') \geq u_i(a_i', a_{-i}) - u_i(a_i, a_{-i}) \quad \text{for } a_i' \geq a_i,\; a_{-i}' \geq a_{-i}
$$

### Key Results

1. **Extremal NE exist**: iterating best responses from the lattice minimum $\underline{a}$ converges monotonically to the **smallest NE** $\underline{a}^*$; from the maximum $\bar{a}$ converges to the **largest NE** $\bar{a}^*$.
2. **Comparative statics**: if a parameter shifts payoffs upward, equilibria shift upward — useful for policy analysis.

### Example: Technology Adoption

$n$ firms each choose investment level $a_i \in [0, \bar{a}]$. The more others invest, the more valuable one's own investment (network effects):

$$
u_i(a_i, a_{-i}) = a_i \cdot f\!\left(\sum_{j\neq i} a_j\right) - c(a_i)
$$

where $f$ is increasing (strategic complementarity) and $c$ is convex cost. Increasing differences hold because $\frac{\partial^2 u_i}{\partial a_i \,\partial a_j} = f'(\cdot) > 0$.

---

## 12. Mechanism Design: Engineering the Rules

Mechanism design **inverts** game theory: instead of analysing a given game, we **design** the rules so that strategic behaviour produces desired outcomes.

### 12.1 Setup

- Players have **private types** $\theta_i \in \Theta_i$ (e.g., valuations).
- **Social choice function** $f: \Theta \to X$ maps type profiles to outcomes.
- A **mechanism** $(M, g)$ specifies message spaces $M_i$ and an outcome function $g: M \to X$.
- $f$ is **implementable** if there exists a mechanism where equilibrium play produces $f(\theta)$ for all $\theta$.

### 12.2 VCG (Vickrey-Clarke-Groves) Mechanism

The VCG mechanism achieves **efficient** outcomes under quasi-linear utilities $u_i(x, \theta_i) = v_i(x, \theta_i) - t_i$:

**Allocation:** Choose the efficient outcome:

$$
x^*(\hat{\theta}) = \arg\max_x \sum_{i} v_i(x, \hat{\theta}_i)
$$

**Payment (Clarke pivot rule):**

$$
\boxed{t_i = \max_x \sum_{j \neq i} v_j(x, \hat{\theta}_j) - \sum_{j \neq i} v_j(x^*(\hat{\theta}), \hat{\theta}_j)}
$$

**Truthfulness derivation.** Under truthful reporting ($\hat{\theta}_i = \theta_i$), player $i$'s net utility is:

$$
u_i = v_i(x^*, \theta_i) - t_i = v_i(x^*, \theta_i) + \sum_{j\neq i} v_j(x^*, \hat{\theta}_j) - \max_x \sum_{j\neq i} v_j(x, \hat{\theta}_j)
$$

$$
= \sum_j v_j(x^*, \theta) - \underbrace{\max_x \sum_{j\neq i} v_j(x, \hat{\theta}_j)}_{\text{constant w.r.t. } \hat{\theta}_i}
$$

Since the subtracted term doesn't depend on $i$'s report, player $i$ maximises personal utility by maximising $\sum_j v_j(x^*, \theta)$ — which requires $\hat{\theta}_i = \theta_i$. **Truthful reporting is a dominant strategy.**

### Example: Second-Price Auction (Vickrey Auction)

Single item, $n$ bidders. In VCG: winner is highest bidder, payment equals **second-highest bid**.

Bidder with value $v_i$: bidding $v_i$ is weakly dominant regardless of others' strategies. Underbidding risks losing when $b_2 < v_i$; overbidding risks winning when $b_2 > v_i$ (negative surplus).

---

## 13. Coalitional (Cooperative) Games

When players can form **binding coalitions** and share surplus, we use **transferable-utility (TU) coalitional games**:

$$
(N, v) \quad \text{where } v: 2^N \to \mathbb{R}, \;\; v(\emptyset) = 0
$$

$v(S)$ is the **worth** of coalition $S$ — the total payoff $S$ can guarantee itself.

### 13.1 The Core

An allocation $x = (x_1,\dots,x_n)$ with $\sum_i x_i = v(N)$ is in the **core** if no coalition can do better:

$$
\boxed{\sum_{i \in S} x_i \geq v(S) \quad \forall\, S \subseteq N}
$$

The core may be **empty** (no stable allocation exists). It is non-empty iff the game is **balanced** (Bondareva-Shapley theorem).

### 13.2 Shapley Value

The **Shapley value** allocates payoff based on average marginal contribution:

$$
\boxed{\phi_i(v) = \sum_{S \subseteq N \setminus \{i\}} \frac{|S|!\,(n-|S|-1)!}{n!}\;\bigl[v(S \cup \{i\}) - v(S)\bigr]}
$$

It is the **unique** allocation satisfying efficiency, symmetry, dummy player, and additivity axioms.

### Example: Airport Runway Cost Sharing

Three airlines need runways of different lengths: $v(\{1\})=60$, $v(\{2\})=90$, $v(\{3\})=120$, and $v(S)=\max_{i\in S} v(\{i\})$ (only one runway is built for the longest need).

Marginal contributions of Player 3 to all coalitions:

| Coalition $S$ | $v(S)$ | $v(S \cup \{3\})$ | Marginal |
|:-:|:-:|:-:|:-:|
| $\emptyset$ | 0 | 120 | 120 |
| $\{1\}$ | 60 | 120 | 60 |
| $\{2\}$ | 90 | 120 | 30 |
| $\{1,2\}$ | 90 | 120 | 30 |

$$
\phi_3 = \frac{1}{6}(2 \cdot 120 + 1 \cdot 60 + 1 \cdot 30 + 2 \cdot 30) = \frac{1}{6}(240 + 60 + 30 + 60) = 65
$$

The largest plane pays the most but not the full cost — a principled cost-sharing rule.

---

## 14. Learning in Games

When players don't know others' strategies, they **learn** through repeated play.

### 14.1 Fictitious Play

Each player maintains **empirical frequencies** of opponents' past actions and best-responds to those beliefs:

$$
\hat{\sigma}_{-i}^{(t)}(a_{-i}) = \frac{1}{t}\sum_{\tau=1}^{t} \mathbb{1}[a_{-i}^{(\tau)} = a_{-i}]
$$

$$
a_i^{(t+1)} \in \arg\max_{a_i} U_i(a_i, \hat{\sigma}_{-i}^{(t)})
$$

**Convergence:** guaranteed in $2\times 2$ games, zero-sum games, potential games, and supermodular games. May cycle otherwise.

### 14.2 No-Regret Learning

A player uses a **no-regret** algorithm if the **external regret** vanishes:

$$
R_i^T = \max_{a_i \in A_i} \sum_{t=1}^{T} u_i(a_i, a_{-i}^{(t)}) - \sum_{t=1}^{T} u_i(a_i^{(t)}, a_{-i}^{(t)}) \quad\Longrightarrow\quad \frac{R_i^T}{T} \to 0
$$

**Key result:** If **all** players use no-regret algorithms, the time-averaged joint strategy converges to a **coarse correlated equilibrium** — a computationally attractive solution concept.

---

## 15. Multi-Agent Systems Application: Where It All Connects

The theory directly applies to **multi-robot** and **multi-agent** coordination:

| Problem | Game Model | Equilibrium Concept |
|---------|-----------|-------------------|
| Task allocation | Congestion / assignment game | PNE via potential function |
| Path deconfliction | Local coupling game | Better-response dynamics |
| Charging scheduling | Shared-resource game | Correlated equilibrium (signal = schedule) |
| Communication relay | Role-assignment game | Mechanism design (VCG-like bidding) |
| Formation control | Continuous-action game | Gradient-based NE computation |

![Swarm robots with autonomous charging](https://upload.wikimedia.org/wikipedia/commons/5/5b/RechargingSwarm.jpg)
*Swarm robotics: coordination, congestion management, and resource scheduling. Source: [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:RechargingSwarm.jpg), CC BY-SA 3.0.*

### Design Principles for Multi-Agent Game-Theoretic Systems

1. **Exploit structure first.** Check if your game is potential, congestion, or supermodular — this determines solver choice.
2. **Safety as hard constraint.** Game-theoretic outputs are *candidate plans*; a safety filter (e.g., control barrier function) must independently verify.
3. **Asynchronous updates.** Synchronous best-response can oscillate; asynchronous better-response with inertia is more robust.
4. **Measure PoA empirically.** Compare decentralised outcome to centralised optimum to quantify the "cost of autonomy."
5. **Fairness by design.** Include burden-tracking terms in utilities to rotate costly roles (relay duty, hazard inspection).

---

## Summary of Equilibrium Concepts

| Concept | Setting | Key Property |
|---------|---------|-------------|
| **Nash (Pure)** | Normal form | No unilateral profitable deviation |
| **Nash (Mixed)** | Normal form | Existence guaranteed (finite games) |
| **Correlated** | Normal form + mediator | LP-computable, welfare ≥ NE |
| **Bayesian Nash** | Incomplete information | Best-response given type & beliefs |
| **Subgame Perfect** | Extensive form | NE in every subgame; no empty threats |
| **Folk Theorem** | Repeated games | Patient players sustain cooperation |
| **Core** | Coalitional | No coalition can profitably deviate |
| **Shapley Value** | Coalitional | Unique fair allocation by axioms |

Every concept answers the same fundamental question: *when is a strategy profile stable against some class of deviations?* The answer depends on what deviations are possible — unilateral, coalitional, or intertemporal — and what information is available.

---

### Figure Credits
- Figure 1: [Prisoners_dilemma.svg](https://commons.wikimedia.org/wiki/File:Prisoners_dilemma.svg), AustinF / Martin H., CC BY-SA 3.0.
- Figure 2: [Extensive form game 4.JPG](https://commons.wikimedia.org/wiki/File:Extensive_form_game_4.JPG), Methyl, CC BY-SA 3.0.
- Figure 3: [RechargingSwarm.jpg](https://commons.wikimedia.org/wiki/File:RechargingSwarm.jpg), M. Rubenstein, CC BY-SA 3.0.
