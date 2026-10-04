---
title: Computational Game Theory- From Formulation to Equilibrium
tags: [game theory, nash equilibrium, potential games, mechanism design]
style: fill
color: light
description: Course notes on game theory built up from the classic two-by-two games through dominance, Nash equilibrium, Cournot and Stackelberg competition, mixed strategies, zero-sum games, backward induction, repeated games, Bayesian games and auctions, mechanism design and VCG, the core and Shapley value, congestion and potential games, correlated equilibrium, learning dynamics, and computation, with every example worked by hand.
---

_These notes are adapted from course materials for **1MA083 Game Theory** at **Uppsala University**, and follow the order of Osborne's "An Introduction to Game Theory" and Maschler, Solan, and Zamir's "Game Theory", with algorithmic topics from Shoham and Leyton-Brown's "Multiagent Systems" and Nisan et al.'s "Algorithmic Game Theory". Every number in the worked examples has been checked._

## How to Read These Notes

Game theory asks: **what outcomes are stable when several decision-makers each optimize, and each one's result depends on what the others do?** Single-agent optimization asks "what is best for me?". Game theory asks "what is best for me, given that you are also choosing what is best for you, given what I choose?". That circularity is the whole subject, and *equilibrium* is the name for a resolution of it.

The notes start from four tiny games that every course uses, because nearly every concept can be seen in them first. Each later section adds one ingredient (randomization, timing, repetition, private information, coalitions, design of the rules) and asks what equilibrium means once it is added.

{% include figure.html image="/assets/img/posts/game-theory/game-modeling-loop.svg" alt="Game-theory modeling loop from players and actions to utilities, equilibrium concept, computation, and mechanism redesign." caption="Game-theoretic modeling is iterative: define incentives, compute stable behavior, then redesign rules if the outcome is undesirable." %}

| Section | New ingredient | Solution concept |
|---|---|---|
| 1 | players, actions, payoffs | - |
| 2 | rationality | dominance, iterated elimination |
| 3 | mutual best responses | pure Nash equilibrium |
| 4 | randomization | mixed Nash equilibrium |
| 5 | strict conflict | minimax, value of a game |
| 6 | timing | subgame-perfect equilibrium |
| 7 | repetition | folk theorem, trigger strategies |
| 8 | private information | Bayesian Nash equilibrium, auctions |
| 9 | designing the rules | incentive compatibility, VCG |
| 10 | binding agreements | core, Shapley value, bargaining |
| 11 | many players, shared resources | potential games, price of anarchy |
| 12 | a mediator | correlated equilibrium |
| 13 | learning and evolution | fictitious play, regret, ESS |
| 14 | computation | LP, Lemke-Howson, PPAD |

## 1. What Is a Game?

### 1.1 Four Games to Keep in Mind

In each table the row player chooses a row, the column player a column, and the cell lists (row payoff, column payoff).

**Prisoner's Dilemma.** Two suspects can cooperate (stay silent) or defect (testify).

| | Cooperate | Defect |
|---|---|---|
| **Cooperate** | 3, 3 | 0, 5 |
| **Defect** | 5, 0 | 1, 1 |

**Battle of the Sexes (coordination with conflict).** Two friends want to meet; one prefers the opera, the other football.

| | Opera | Football |
|---|---|---|
| **Opera** | 2, 1 | 0, 0 |
| **Football** | 0, 0 | 1, 2 |

**Matching Pennies (pure conflict).** Row wins if the pennies match, column wins if they differ.

| | Heads | Tails |
|---|---|---|
| **Heads** | 1, -1 | -1, 1 |
| **Tails** | -1, 1 | 1, -1 |

**Stag Hunt (coordination with risk).** Hunting a stag needs both hunters; a hare can be caught alone.

| | Stag | Hare |
|---|---|---|
| **Stag** | 4, 4 | 0, 3 |
| **Hare** | 3, 0 | 3, 3 |

These four capture the basic tensions: individual versus collective interest (PD), coordination with disagreement (BoS), pure opposition (MP), and coordination against safety (SH).

### 1.2 The Normal Form

A **normal-form (strategic-form) game** is

$$
\Gamma=\big\langle N,\ (A_i)_{i\in N},\ (u_i)_{i\in N}\big\rangle,
$$

where $N=\lbrace1,\ldots,n\rbrace$ is the set of players, $A_i$ is player $i$'s action set, and $u_i:A\to\mathbb R$, with $A=A_1\times\cdots\times A_n$, is player $i$'s utility. We write $a=(a_i,a_{-i})$ to separate player $i$'s action from everyone else's.

### 1.3 What Utilities Mean

Payoffs are not necessarily money. They represent preferences: $u_i(a)>u_i(b)$ means player $i$ prefers outcome $a$. Once players randomize (section 4), we need more: the **von Neumann-Morgenstern** theorem says that if preferences over lotteries satisfy a few axioms (completeness, transitivity, continuity, independence), then they can be represented by the *expected value* of a utility function. A risk-averse person has a concave utility of money, so a lottery's expected utility is lower than the utility of its expected payout. All the expected-payoff calculations below assume such vNM utilities.

The modelling burden lies in the payoffs. If the "Prisoner's Dilemma" players care about each other's sentence, or fear retaliation, the payoffs change and so does the game. A game-theoretic prediction is only as good as the payoffs.

### What to Remember

- A game: players, actions, payoffs that depend on everyone's actions.
- PD, BoS, MP, and Stag Hunt are the four reference examples.
- Payoffs are vNM utilities; the model is only as good as its payoffs.

## 2. Dominance and Iterated Elimination

### 2.1 Dominant Strategies

Action $$a_i'$$ **strictly dominates** $a_i$ if it is better against everything the others might do:

$$
u_i(a_i',a_{-i})>u_i(a_i,a_{-i})\qquad\text{for all }a_{-i}.
$$

**Weak dominance** requires $\ge$ everywhere and $>$ somewhere. A rational player never plays a strictly dominated action.

In the Prisoner's Dilemma, Defect strictly dominates Cooperate for each player: against Cooperate, $5>3$; against Defect, $1>0$. So rational players defect and get $(1,1)$, although both would prefer $(3,3)$. The dilemma is not a puzzle about irrationality. It is a clean demonstration that **individually rational choices can produce a collectively bad outcome**. Arms races, overfishing, and price wars share this structure.

### 2.2 Iterated Elimination of Strictly Dominated Strategies

If players know that others are rational, they can eliminate dominated actions *of others*, then re-examine their own. Consider

| | L | C | R |
|---|---|---|---|
| **U** | 4, 3 | 5, 1 | 6, 2 |
| **M** | 2, 1 | 8, 4 | 3, 6 |
| **D** | 3, 0 | 9, 6 | 2, 8 |

- For the column player, C is strictly dominated by R ($1<2$, $4<6$, $6<8$). Remove C.
- In the remaining game (columns L and R), for the row player, D is strictly dominated by U ($3<4$, $2<6$), and M is strictly dominated by U ($2<4$, $3<6$). Remove M and D.
- Only row U remains; the column player compares L (3) and R (2) and picks L.

The unique survivor is $(U,L)$ with payoffs $(4,3)$. Notice that in the original game D looked attractive against C (payoff 9); it was eliminated only after we reasoned that the column player would never play C.

Facts worth knowing: the order of eliminating *strictly* dominated actions does not matter; with *weak* dominance, it can. Iterated elimination requires **common knowledge of rationality**: I am rational, I know you are, I know you know I am, and so on, as many levels as there are rounds.

### 2.3 How Many Levels Do People Reason?

In the "guess $\frac23$ of the average" game, each of many players picks a number in $[0,100]$, and whoever is closest to $\frac23$ of the average wins. Any guess above $\frac23\cdot100\approx66.7$ is dominated. If nobody plays above 66.7, guesses above $\frac23\cdot66.7\approx44.4$ become dominated, and so on: after $k$ rounds, everything above $100(\frac23)^k$ is eliminated, and in the limit only 0 survives. In experiments, typical winning guesses are well above 0 (often in the 20s or 30s), consistent with people performing one to three rounds of reasoning. Common knowledge of rationality is a strong assumption.

### What to Remember

- Strictly dominated actions are never played; dominant strategies are always played.
- Iterated elimination needs common knowledge of rationality; strict elimination is order-independent.
- Rational individual choices can be collectively bad (Prisoner's Dilemma).

## 3. Best Responses and Nash Equilibrium

### 3.1 Best Responses

Most games have no dominant strategies: what is best for me depends on what you do. Player $i$'s **best-response set** to the others' actions is

$$
BR_i(a_{-i})=\arg\max_{a_i\in A_i}u_i(a_i,a_{-i}).
$$

### 3.2 Nash Equilibrium

> **Definition.** A profile $a^\ast$ is a **(pure) Nash equilibrium** if every player's action is a best response to the others':
>
> $$a_i^\ast\in BR_i(a_{-i}^\ast)\quad\text{for all }i,\qquad\text{equivalently}\qquad u_i(a^\ast)\ge u_i(a_i,a_{-i}^\ast)\quad\text{for all }i,\ a_i.$$

No player can gain by deviating **alone**. Two readings help. As a *prediction*: if players somehow arrive at $a^\ast$, nobody has a reason to leave. As a *self-enforcing agreement*: if players agree on $a^\ast$ and then choose independently, nobody wants to break the agreement.

**Finding pure equilibria in a table.** For each column, mark the row player's best payoff; for each row, mark the column player's best payoff; cells marked twice are equilibria.

- Prisoner's Dilemma: $(D,D)$ only.
- Battle of the Sexes: $(O,O)$ and $(F,F)$. Two equilibria, and the players disagree about which is better.
- Matching Pennies: none. In every cell, someone wants to switch.
- Stag Hunt: $(S,S)$ and $(H,H)$. $(S,S)$ is better for both (**payoff dominant**), but Hare guarantees 3 regardless of the other, while Stag risks 0 (Hare is **risk dominant**). Which one people coordinate on is an empirical question.

{% include figure.html image="/assets/img/posts/game-theory/best-response-nash-matrix.svg" alt="Two-by-two payoff matrix with best-response arrows and Nash equilibrium cell." caption="A Nash equilibrium is a mutual best response, not necessarily the best joint outcome." %}

Nash equilibrium is not efficiency. $(D,D)$ is the unique equilibrium of the PD and is worse for everyone than $(C,C)$. An outcome is **Pareto efficient** if no other outcome makes someone better off without making anyone worse off; equilibria need not be.

### 3.3 Cournot Duopoly: Equilibrium with Continuous Actions

Two firms choose quantities $q_1,q_2\ge0$ of an identical product. The market price is $P=a-b(q_1+q_2)$ and each unit costs $c$. Firm 1's profit is

$$
\pi_1(q_1,q_2)=\big(a-b(q_1+q_2)-c\big)\,q_1.
$$

**Best response.** Setting $\partial\pi_1/\partial q_1=a-c-2bq_1-bq_2=0$ gives

$$
BR_1(q_2)=\frac{a-c-bq_2}{2b},
$$

and symmetrically for firm 2. The more the rival produces, the less I want to produce (**strategic substitutes**).

**Equilibrium.** Intersect the best responses. By symmetry $q_1=q_2=q$, so $q=\frac{a-c-bq}{2b}$, giving

$$
q^\ast=\frac{a-c}{3b},\qquad P^\ast=\frac{a+2c}{3},\qquad\pi^\ast=\frac{(a-c)^2}{9b}.
$$

**Numbers.** With $a=100$, $b=1$, $c=10$: each firm produces 30, the price is 40, and each earns 900. Compare:

| Market structure | Total quantity | Price | Total profit |
|---|---|---|---|
| Monopoly | 45 | 55 | 2025 |
| Cournot duopoly | 60 | 40 | 1800 |
| Perfect competition | 90 | 10 | 0 |

The duopolists would jointly earn more by each producing 22.5 (half the monopoly output), but that agreement is not an equilibrium: each would want to increase output. A cartel is a Prisoner's Dilemma.

**Bertrand.** If firms instead choose *prices* and consumers buy from the cheaper firm, any price above $c$ can be undercut slightly, so the only equilibrium is $p_1=p_2=c$ with zero profit: two firms are enough for the competitive outcome. Whether firms compete in quantities or prices changes the prediction dramatically; the choice of action space is part of the model.

### What to Remember

- Nash equilibrium: everyone best-responds to everyone else; no profitable unilateral deviation.
- Games can have zero, one, or several pure equilibria; equilibria need not be efficient.
- With continuous actions: compute best-response functions, intersect them (Cournot: $q^\ast=(a-c)/3b$).

## 4. Mixed Strategies

### 4.1 Why Randomize?

Matching Pennies has no pure equilibrium. Yet anyone who has played it knows the answer: be unpredictable. If you favour Heads, your opponent exploits it. A **mixed strategy** $\sigma_i\in\Delta(A_i)$ is a probability distribution over actions. With independent randomization, player $i$'s expected payoff is

$$
U_i(\sigma)=\sum_{a\in A}\Big(\prod_{j}\sigma_j(a_j)\Big)u_i(a).
$$

A **mixed Nash equilibrium** is a profile of mixed strategies in which each is a best response to the others.

### 4.2 The Indifference Principle

**Key fact.** In a mixed equilibrium, every action a player uses with positive probability must give the same expected payoff, and that payoff must be at least that of every unused action.

Why: if one action in the support were strictly better, moving probability to it would raise the payoff, so the mix would not be a best response. The surprising consequence is that **each player's mixing probabilities are determined by the other player's payoffs**: I randomize so as to make *you* indifferent.

**Matching Pennies.** Let the column player play Heads with probability $q$. The row player's expected payoffs are $U(H)=q-(1-q)=2q-1$ and $U(T)=-q+(1-q)=1-2q$. Indifference requires $2q-1=1-2q$, so $q=\frac12$. By symmetry the row player also mixes $\frac12$. Each player's expected payoff is 0.

### 4.3 Worked Example: Battle of the Sexes

Let the column player choose Opera with probability $q$, and the row player choose Opera with probability $p$.

- Row's indifference: $U_{\text{row}}(O)=2q$ and $U_{\text{row}}(F)=1\cdot(1-q)$. Equal when $q=\frac13$.
- Column's indifference: $U_{\text{col}}(O)=1\cdot p$ and $U_{\text{col}}(F)=2(1-p)$. Equal when $p=\frac23$.

So in the mixed equilibrium, the row player chooses Opera with probability $\frac23$ (her favourite more often) and the column player Opera with probability $\frac13$ (football, his favourite, more often). Each gets an expected payoff of $\frac23$, **less than either player gets in either pure equilibrium**: they miscoordinate with probability $\frac23\cdot\frac23+\frac13\cdot\frac13=\frac59$. The game has three equilibria: two pure, one mixed.

**General $2\times2$ formula.** If the row player's payoffs are $$\begin{bmatrix}a_{11}&a_{12}\\a_{21}&a_{22}\end{bmatrix}$$ and the game has a fully mixed equilibrium, the column player's probability on the first column is

$$
q=\frac{a_{22}-a_{12}}{(a_{11}-a_{21})+(a_{22}-a_{12})}.
$$

### 4.4 Nash's Theorem

> **Theorem (Nash, 1950).** Every finite game has at least one Nash equilibrium in mixed strategies.

**Proof idea.** Consider the best-response correspondence $BR(\sigma)=(BR_1(\sigma_{-1}),\ldots,BR_n(\sigma_{-n}))$, mapping the set of mixed profiles (a product of simplices, compact and convex) to subsets of itself. Because expected utility is linear in one's own mixed strategy, each best-response set is nonempty and convex; by continuity of payoffs, the correspondence has a closed graph. **Kakutani's fixed-point theorem** then guarantees a profile $\sigma^\ast\in BR(\sigma^\ast)$: a mixed profile that is a best response to itself, i.e. an equilibrium.

The theorem guarantees existence but not uniqueness, efficiency, or that anyone will find the equilibrium. For $2\times2$ games, the **best-response graph** makes the equilibria visible: plot each player's best response $p(q)$ and $q(p)$ in the unit square; equilibria are the intersections. In BoS, the two step-shaped curves cross three times.

### 4.5 Interpreting Mixed Equilibria

Do people really flip coins? Three interpretations:

1. **Deliberate randomization**: in competitive settings (penalty kicks, poker, security patrols), unpredictability is the point. Studies of professional penalty kicks find kickers and goalkeepers mixing close to equilibrium proportions.
2. **Population shares**: in a large population, a fraction $p$ of individuals plays each pure action (section 13.4).
3. **Beliefs**: $\sigma_j$ describes what others *believe* $j$ will do; equilibrium means beliefs are consistent with best responses.

### What to Remember

- Mixed strategies are probability distributions; payoffs are expected utilities.
- Indifference principle: used actions earn equal payoffs; my mix makes *you* indifferent.
- Nash's theorem: every finite game has a mixed equilibrium (Kakutani fixed point).

## 5. Zero-Sum Games

### 5.1 Maxmin and Minmax

In a **two-player zero-sum game**, $u_2=-u_1$, so we write one payoff matrix $A$ for the row player (the maximizer). A cautious row player picks the strategy that maximizes her guaranteed payoff:

$$
\underline v=\max_{p}\min_{q}\ p^\top Aq\quad\text{(maxmin)},\qquad
\overline v=\min_q\max_p\ p^\top Aq\quad\text{(minmax)}.
$$

Always $\underline v\le\overline v$: moving second can only help.

### 5.2 The Minimax Theorem

> **Theorem (von Neumann, 1928).** For every finite two-player zero-sum game, with mixed strategies, $\max_p\min_q p^\top Aq=\min_q\max_p p^\top Aq=v$, the **value** of the game.

In zero-sum games, Nash equilibrium is exceptionally well-behaved: equilibrium strategies are exactly the maxmin strategies, all equilibria give the same value, and equilibrium strategies can be mixed and matched. There is no coordination problem and no reason to fear the opponent "knowing" your strategy.

**Worked example.** Row's payoff matrix $$A=\begin{bmatrix}2&-1\\-1&1\end{bmatrix}$$. If the row player plays row 1 with probability $p$, her expected payoff against column 1 is $2p-(1-p)=3p-1$, and against column 2 is $-p+(1-p)=1-2p$. The column player will pick whichever is lower, so the row player maximizes $\min(3p-1,\ 1-2p)$, which happens where they are equal: $p=\frac25$, giving a guaranteed $\frac15$. The same calculation for the column player gives $q=\frac25$ and the same value $v=\frac15$. The game slightly favours the row player.

**Rock-Paper-Scissors** has value 0 with the uniform mix; any deviation from uniform can be exploited.

### 5.3 Zero-Sum Games Are Linear Programs

The row player's problem is a linear program:

$$
\max_{v,\,p}\ v\quad\text{s.t.}\quad\sum_ip_ia_{ij}\ge v\ \ \text{for every column }j,\qquad\sum_ip_i=1,\ p\ge0.
$$

The column player's problem is its LP dual, and LP strong duality *is* the minimax theorem. So zero-sum games can be solved in polynomial time, unlike general games (section 14).

### What to Remember

- Zero-sum: maxmin = minmax = value (von Neumann). Equilibrium = security strategies.
- Solve $2\times2$ zero-sum games by equalizing; larger ones by linear programming.

## 6. Extensive-Form Games and Subgame Perfection

### 6.1 Game Trees

Many interactions are sequential: one player moves, the other observes and responds. An **extensive-form game** is a tree: nodes are decision points labelled with the player to move, edges are actions, leaves carry payoffs. A **strategy** is a *complete contingent plan*: an action at every decision node of the player, including nodes that will never be reached if the plan is followed.

### 6.2 Entry Deterrence: A Non-Credible Threat

A potential entrant decides whether to enter a market held by an incumbent. If it enters, the incumbent either fights a price war or accommodates. Payoffs are (entrant, incumbent):

```text
Entrant
 ├── Out ............................ (0, 2)
 └── In ── Incumbent
             ├── Fight .............. (-1, -1)
             └── Accommodate ........ (1, 1)
```

Write the normal form with strategies Out/In for the entrant and Fight/Accommodate for the incumbent:

| | Fight | Accommodate |
|---|---|---|
| **Out** | 0, 2 | 0, 2 |
| **In** | -1, -1 | 1, 1 |

There are two pure Nash equilibria: (In, Accommodate) and (Out, Fight). The second is suspicious. The incumbent's "Fight" is a **threat** that keeps the entrant out, and because the entrant stays out, carrying out the threat never costs anything. But if the entrant did enter, fighting would give the incumbent $-1<1$: the threat is not **credible**.

### 6.3 Backward Induction and Subgame-Perfect Equilibrium

**Backward induction** solves the tree from the leaves: at each last decision node, pick the best action; replace the node by the resulting payoffs; repeat. Here, the incumbent would accommodate ($1>-1$), so the entrant compares Out (0) with In (1) and enters. The result is (In, Accommodate).

A **subgame** is a part of the tree that starts at a single node and contains everything that follows it. A **subgame-perfect equilibrium (SPE)** is a strategy profile that induces a Nash equilibrium in *every* subgame, including those off the equilibrium path. This rules out non-credible threats. In finite games of perfect information, backward induction finds the SPE.

**Zermelo's theorem.** Every finite game of perfect information has a pure-strategy SPE. For chess this implies that either White can force a win, Black can force a win, or both can force at least a draw. We just do not know which, because the tree is far too large.

**One-shot deviation principle.** To check that a profile is subgame perfect, it suffices to check that no player can gain by deviating at a *single* node and then returning to the strategy. This makes verification local.

### 6.4 Stackelberg Competition: The Value of Commitment

Return to the Cournot market ($a=100$, $b=1$, $c=10$), but let firm 1 choose its quantity first and firm 2 observe it. By backward induction, firm 2 plays its best response $q_2=\frac{a-c-bq_1}{2b}$. Firm 1 anticipates this and maximizes

$$
\pi_1=\Big(a-b\big(q_1+\tfrac{a-c-bq_1}{2b}\big)-c\Big)q_1=\frac{a-c-bq_1}{2}\,q_1,
$$

which gives $q_1=\frac{a-c}{2b}=45$ and $q_2=22.5$. The price is $32.5$; the leader earns $1012.5$ (more than the Cournot 900) and the follower $506.25$ (less). Moving first is valuable here because commitment to a large quantity forces the rival to shrink. Commitment, credible only if it cannot be undone, is a recurring strategic theme.

### 6.5 Ultimatum and Centipede: Where Theory Meets Behaviour

In the **ultimatum game**, a proposer offers a split of 10 euros; the responder accepts (the split happens) or rejects (both get 0). Backward induction: the responder accepts any positive offer, so the proposer offers the smallest unit. In experiments, offers around 40-50% are common, and low offers are often rejected. People care about fairness or reciprocity, so the monetary payoffs are not their utilities. In the **centipede game**, backward induction predicts stopping at the first move, yet people often continue for a while. These games test how far backward induction (and common knowledge of rationality) describe real reasoning.

### 6.6 Imperfect Information

When a player does not observe some earlier moves, nodes she cannot distinguish are grouped into an **information set**, and she must choose the same action at all of them. Simultaneous-move games are the special case where the second mover's nodes form one information set. Subgames cannot cut through information sets, so SPE has less bite; refinements such as perfect Bayesian equilibrium add beliefs at information sets.

{% include figure.html image="/assets/img/posts/game-theory/information-time-equilibrium-map.svg" alt="Map showing normal-form, Bayesian, extensive-form, and repeated games by information and time structure." caption="Different equilibrium concepts arise because information, timing, and possible deviations change." %}

### What to Remember

- Strategies in trees are complete contingent plans; Nash equilibria can rely on non-credible threats.
- SPE = Nash in every subgame; backward induction computes it in finite perfect-information games.
- Commitment can be valuable (Stackelberg leader earns more). Experiments show limits of backward induction.

## 7. Repeated Games and Cooperation

### 7.1 Finite Repetition Unravels

Play the Prisoner's Dilemma $T$ times with known $T$. In the last round, nothing follows, so both defect. Knowing that, in round $T-1$ the future is fixed, so both defect again, and so on back to round 1. **With a known finite horizon, the unique SPE is to defect in every round.**

### 7.2 Infinite Repetition and Discounting

If the game continues forever (or ends at a random time, with continuation probability $\delta$ each round), future payoffs are discounted. Player $i$'s payoff from a stream $u_i^0,u_i^1,\ldots$ is

$$
\sum_{t=0}^{\infty}\delta^tu_i^t,\qquad0<\delta<1.
$$

Now future rounds can reward cooperation and punish defection.

### 7.3 Grim Trigger: Deriving the Threshold

Use generic PD payoffs $T>R>P>S$ (Temptation, Reward, Punishment, Sucker); above, $T=5$, $R=3$, $P=1$, $S=0$. **Grim trigger**: cooperate as long as nobody has ever defected; after any defection, defect forever.

- **Cooperate forever**: $R+\delta R+\delta^2R+\cdots=\dfrac{R}{1-\delta}$.
- **Deviate now** (best one-shot deviation): $T$ today, then mutual defection forever: $T+\dfrac{\delta P}{1-\delta}$.

Cooperation is sustainable when

$$
\frac{R}{1-\delta}\ge T+\frac{\delta P}{1-\delta}\iff\delta\ge\frac{T-R}{T-P}.
$$

With our payoffs, $\delta\ge\frac{5-3}{5-1}=\frac12$. If players value the future at least half as much as the present, cooperation is an equilibrium. (Punishment is also credible: after a defection, mutual defection forever is a Nash equilibrium of every subgame, so grim trigger is subgame perfect.)

**Tit-for-tat** (start cooperating, then copy the opponent's last move) forgives after one round of punishment. In Axelrod's computer tournaments it did remarkably well: nice (never defects first), retaliatory, forgiving, and clear.

### 7.4 The Folk Theorem

> **Folk theorem (informal).** In an infinitely repeated game, any feasible payoff vector that gives every player strictly more than her minmax payoff (the worst punishment the others can inflict) can be sustained by a subgame-perfect equilibrium, if players are patient enough ($\delta$ close to 1).

Repetition turns the problem from "too few equilibria" into "too many". Which one is played depends on norms, communication, and history. This is the formal basis of reputation, trust, and self-enforcing agreements: relationships that last make cooperation rational.

### What to Remember

- Known finite horizon: cooperation unravels by backward induction.
- Infinite horizon with discount $\delta$: grim trigger sustains cooperation iff $\delta\ge(T-R)/(T-P)$.
- Folk theorem: patience makes many outcomes sustainable.

## 8. Bayesian Games and Auctions

### 8.1 Private Information

Often players do not know each other's payoffs: a bidder does not know rivals' valuations; a firm does not know a competitor's cost. Harsanyi's insight was to model this as uncertainty about **types**. A **Bayesian game** is

$$
\Gamma^B=\big\langle N,\ (A_i),\ (\Theta_i),\ (u_i),\ p\big\rangle,
$$

where $\Theta_i$ is player $i$'s set of types (her private information), $p$ is a common prior over type profiles, and $u_i(a,\theta)$ may depend on all types. "Nature" draws types; each player learns only her own; then everyone acts.

A **strategy** is now a function $s_i:\Theta_i\to A_i$: what to do for each possible type. A **Bayesian Nash equilibrium** requires that each type of each player best-responds in expectation:

$$
s_i^\ast(\theta_i)\in\arg\max_{a_i}\ \mathbb E_{\theta_{-i}\mid\theta_i}\Big[u_i\big(a_i,s_{-i}^\ast(\theta_{-i}),\theta\big)\Big].
$$

### 8.2 Worked Example: First-Price Sealed-Bid Auction

Two bidders have private values $v_1,v_2$ drawn independently and uniformly from $[0,1]$. Each submits a sealed bid; the highest bid wins and pays **its own bid**.

Bidding your value guarantees zero profit, so bidders **shade** their bids. Guess a symmetric linear equilibrium $b(v)=kv$. If bidder 2 uses it, bidder 1 with value $v$ who bids $b$ wins when $kv_2 < b$, which has probability $b/k$ (for $b\le k$). Her expected profit is

$$
(v-b)\cdot\frac bk,
$$

maximized at $b=v/2$. This is linear with $k=\frac12$, consistent with the guess. **Equilibrium: bid half your value.** (With $n$ bidders the equilibrium is $b(v)=\frac{n-1}{n}v$: more competition, less shading.)

The seller's expected revenue is $\mathbb E[\max(v_1,v_2)]/2=\frac{2/3}{2}=\frac13$.

### 8.3 Second-Price Auction: Truth-Telling Is Dominant

In a **second-price (Vickrey) auction**, the highest bidder wins but pays the *second-highest* bid. Claim: bidding your true value $v$ is a weakly dominant strategy. Let $B$ be the highest rival bid.

- If $B < v$: bidding $v$ wins and pays $B$, profit $v-B>0$. Any bid above $B$ gives the same result; a bid below $B$ loses this profit.
- If $B>v$: bidding $v$ loses, profit 0. Winning would require bidding above $B$ and paying $B>v$, a loss.

Your bid only determines *whether* you win, never *what* you pay, so there is no reason to misreport. The revenue is the expected second-highest value, $\mathbb E[\min(v_1,v_2)]=\frac13$, **the same as the first-price auction**.

### 8.4 Revenue Equivalence

That coincidence is a theorem. **Revenue equivalence**: with independent private values from a common distribution and risk-neutral bidders, any auction in which the highest value always wins and a bidder with the lowest possible value pays nothing yields the same expected revenue. First-price, second-price, English (ascending), and Dutch (descending) auctions all raise $\frac13$ in the example. Differences appear when the assumptions fail: risk-averse bidders, correlated values, or asymmetric bidders.

### What to Remember

- Private information = types; strategies map types to actions; BNE = each type best-responds in expectation.
- First-price with uniform values: bid $\frac{n-1}{n}v$. Second-price: bid truthfully (weakly dominant).
- Revenue equivalence under independent private values.

## 9. Mechanism Design: Engineering the Rules

### 9.1 The Inverse Problem

So far, the game was given and we predicted behaviour. **Mechanism design** reverses the question: given an outcome we want (efficient allocation, maximal revenue, fair division), **design the game** so that self-interested players produce it in equilibrium, even though only they know their private information. The second-price auction is the prototype: it allocates the item to whoever values it most, even though the seller never learns the values directly.

### 9.2 The Revelation Principle

A mechanism could be any complicated game. The **revelation principle** says we lose nothing by restricting attention to **direct mechanisms**, which simply ask each player to report her type, provided truthful reporting is an equilibrium (**incentive compatibility**). The reason: any equilibrium of any mechanism can be simulated by a direct mechanism that takes the reports and plays the original equilibrium strategies on the players' behalf. This turns "search over all games" into "search over truthful direct mechanisms", which is tractable.

### 9.3 The VCG Mechanism

Assume **quasi-linear** utilities: player $i$'s utility is $v_i(x)-t_i$, value of outcome $x$ minus a payment. The **Vickrey-Clarke-Groves** mechanism:

1. Choose the outcome that maximizes reported total value: $x^\ast=\arg\max_x\sum_iv_i(x)$.
2. Charge each player the **externality** she imposes on the others:

$$
t_i=\underbrace{\max_x\sum_{j\neq i}v_j(x)}_{\text{others' best welfare without }i}-\underbrace{\sum_{j\neq i}v_j(x^\ast)}_{\text{others' welfare with }i}.
$$

With these payments, each player's utility equals total welfare minus a term she cannot influence, so maximizing her own utility means maximizing total welfare, which truthful reporting achieves. **Truth-telling is a dominant strategy**, and the outcome is efficient.

**Worked example: one item.** Values 10, 7, 4. The item goes to bidder 1. Without bidder 1, the best the others could do is 7 (give it to bidder 2); with bidder 1 present, the others get 0. So bidder 1 pays $7-0=7$: **VCG for one item is the second-price auction.**

**Worked example: two identical items, unit demand.** Same values. Bidders 1 and 2 win. For bidder 1: without her, the others would get $7+4=11$; with her, they get 7. She pays $11-7=4$. For bidder 2: without him, the others get $10+4=14$; with him, they get 10. He pays $14-10=4$. Each winner pays the highest losing bid, 4.

### 9.4 Limits

VCG is efficient and truthful, but it can run a deficit or raise little revenue, it is vulnerable to collusion and false-name bids, and it needs the planner to solve the welfare maximization exactly (hard in combinatorial auctions). Two famous impossibility results bound what any mechanism can do: **Gibbard-Satterthwaite** (with three or more outcomes and unrestricted preferences, the only dominant-strategy truthful voting rules are dictatorial) and **Myerson-Satterthwaite** (in bilateral trade with private values, no mechanism is simultaneously efficient, incentive compatible, individually rational, and budget balanced).

### What to Remember

- Mechanism design chooses the rules so equilibrium play achieves a goal.
- Revelation principle: restrict to truthful direct mechanisms.
- VCG: efficient outcome, each pays her externality, truth-telling dominant; one item = second-price auction.

## 10. Cooperative Games

### 10.1 Coalitions and Characteristic Functions

When players can sign binding agreements, the question changes from "what will each do?" to "which coalitions form, and how will they split the gains?". A **transferable-utility (TU) game** is $(N,v)$, where $v(S)$ is the total value coalition $S$ can secure on its own, with $v(\emptyset)=0$. An **allocation** $x\in\mathbb R^n$ divides $v(N)$ among the players.

### 10.2 The Core

An allocation is in the **core** if it is efficient and no coalition can do better on its own:

$$
\sum_{i\in N}x_i=v(N),\qquad\sum_{i\in S}x_i\ge v(S)\quad\text{for all }S\subseteq N.
$$

The core is the set of stable agreements. It can be empty (no allocation satisfies every coalition) or large.

**Glove game.** Player 1 owns a left glove; players 2 and 3 each own a right glove. A pair is worth 1: $v(S)=1$ if $S$ contains player 1 and at least one of players 2, 3; otherwise $v(S)=0$. Core conditions: $x_1+x_2\ge1$, $x_1+x_3\ge1$, and $x_1+x_2+x_3=1$. Subtracting, $x_3\le0$ and $x_2\le0$, so the core is the single point $(1,0,0)$. The scarce left glove captures everything: each right-glove owner can be replaced by the other, so competition drives their share to zero.

### 10.3 The Shapley Value

The Shapley value asks a different question: what is a fair share? It is the unique allocation satisfying four axioms (efficiency, symmetry, null player, additivity), and it equals each player's **average marginal contribution** over all orders in which the grand coalition could be assembled:

$$
\phi_i(v)=\sum_{S\subseteq N\setminus\lbrace i\rbrace}\frac{\lvert S\rvert!\,(n-\lvert S\rvert-1)!}{n!}\Big[v(S\cup\lbrace i\rbrace)-v(S)\Big].
$$

**Glove game.** Over the $3!=6$ orders, player 1's marginal contribution is 1 whenever she arrives after at least one right-glove owner, which happens in 4 of the 6 orders. So $\phi_1=\frac46=\frac23$ and $\phi_2=\phi_3=\frac16$. The Shapley value (fairness) and the core (stability) disagree: the Shapley value rewards the right-glove owners for being needed *by someone*, while the core notes that each is individually replaceable.

**Airport game.** Three airlines need a runway; plane types require runways costing 4, 6, and 10 (a runway long enough for the largest serves all). The Shapley cost shares split each runway segment equally among the planes that need it: the first segment (cost 4) among all three, the second (cost 2) among planes 2 and 3, the third (cost 4) for plane 3 alone:

$$
\phi=\Big(\tfrac43,\ \tfrac43+1,\ \tfrac43+1+4\Big)\approx(1.33,\ 2.33,\ 6.33),
$$

which sums to the total cost 10. This "sequential equal sharing" rule has been used in practice for landing fees.

### 10.4 Nash Bargaining

Two players split a surplus; if they disagree they get the **disagreement point** $d=(d_1,d_2)$. Nash proposed axioms (Pareto efficiency, symmetry, invariance to affine rescaling of utilities, independence of irrelevant alternatives) and showed they single out

$$
\max_{u}\ (u_1-d_1)(u_2-d_2)\quad\text{over feasible agreements}.
$$

Splitting one euro with $d=(0,0)$ gives $(\frac12,\frac12)$. If player 1 has an outside option worth $0.3$, maximizing $(x-0.3)(1-x)$ gives $x=0.65$: she gets her outside option plus half the remaining surplus. Better outside options mean better deals.

### What to Remember

- TU game $(N,v)$; core = efficient allocations no coalition can block (may be empty).
- Shapley value = average marginal contribution; fair, not necessarily stable.
- Nash bargaining maximizes the product of gains over the disagreement point.

## 11. Congestion, Potential Games, and the Price of Anarchy

### 11.1 Selfish Routing: Pigou's Example

One unit of traffic travels from $s$ to $t$ over two roads. The top road always takes 1 hour. The bottom road takes $x$ hours, where $x$ is the fraction of traffic using it.

- **Equilibrium.** If anyone uses the top road, the bottom road takes less than 1 hour, so they should switch. In equilibrium everyone takes the bottom road, and everyone's travel time is 1. Average: **1**.
- **Social optimum.** Send a fraction $y$ to the bottom: average time $y\cdot y+(1-y)\cdot1$, minimized at $y=\frac12$, giving $\frac14+\frac12=$ **$\frac34$**.

Selfish routing is 33% worse than coordinated routing. The **price of anarchy** is the worst-case ratio of equilibrium cost to optimal cost; here it is $\frac43$, and Roughgarden and Tardos proved that $\frac43$ is the worst possible for any network with linear latency functions.

### 11.2 Braess's Paradox

4000 drivers go from $s$ to $t$ via either $A$ or $B$. Roads $s\to A$ and $B\to t$ take $T/100$ minutes when $T$ drivers use them; roads $A\to t$ and $s\to B$ take 45 minutes regardless. In equilibrium the drivers split evenly: each route takes $2000/100+45=65$ minutes.

Now open a zero-minute shortcut $A\to B$. The route $s\to A\to B\to t$ costs at most $40+0+40=80$ minutes, and for any driver it beats the alternatives once others use it. The new equilibrium has everyone on the shortcut route: $4000/100+0+4000/100=80$ minutes, and no driver can improve (switching to $s\to A\to t$ or $s\to B\to t$ costs $40+45=85$). **Adding a road made everyone worse off.** Observed in real cities, and in electrical and mechanical networks with the same equilibrium structure.

### 11.3 Potential Games

Why did these routing games have pure equilibria, and why does selfish improvement find them? A game is an **exact potential game** if there is a single function $\Phi$ that tracks every player's unilateral payoff changes:

$$
u_i(a_i',a_{-i})-u_i(a_i,a_{-i})=\Phi(a_i',a_{-i})-\Phi(a_i,a_{-i}).
$$

Consequences:

- Every maximizer of $\Phi$ is a pure Nash equilibrium, so finite potential games always have pure equilibria.
- **Better-response dynamics** (one player at a time switches to a better action) strictly increases $\Phi$ at each step and therefore must stop, at a pure equilibrium (the **finite improvement property**).

**Congestion games are potential games** (Rosenthal, 1973). If each player chooses a set of resources (a path) and the cost of resource $e$ used by $x_e$ players is $c_e(x_e)$, then

$$
\Phi(a)=-\sum_e\sum_{k=1}^{x_e}c_e(k)
$$

is an exact potential (with payoffs as negative costs). Each player's switch changes exactly the terms of the resources she leaves and joins, by exactly her own cost change.

{% include figure.html image="/assets/img/posts/game-theory/potential-game-dynamics.svg" alt="Potential landscape with better-response dynamics climbing to a local equilibrium." caption="In a potential game, decentralized better responses climb a shared potential landscape." %}

Potential games are the main reason game theory is practical for engineered multi-agent systems: if we can *design* agents' utilities so that the game has a potential aligned with the system objective, simple local learning converges.

**Supermodular games** are a second friendly class: when actions are **strategic complements** (my best response increases when yours does, e.g. technology adoption), best responses are monotone, pure equilibria exist, the set of equilibria has a largest and smallest element, and best-response dynamics from the extremes converge to them.

### What to Remember

- Selfish routing can be inefficient (Pigou: PoA $=\frac43$) and adding capacity can hurt (Braess).
- Potential games: one function tracks all unilateral gains; pure equilibria exist and better-response dynamics converge.
- Congestion games have Rosenthal's potential.

## 12. Correlated Equilibrium

### 12.1 A Traffic Light for the Game of Chicken

Two drivers approach an intersection. Each can Dare (drive through) or Chicken (yield). Aumann's version of the payoffs:

| | Dare | Chicken |
|---|---|---|
| **Dare** | 0, 0 | 7, 2 |
| **Chicken** | 2, 7 | 6, 6 |

There are two pure equilibria, (Dare, Chicken) and (Chicken, Dare), and a mixed one in which each dares with probability $\frac13$ (check: if the other dares with probability $q$, Dare gives $7(1-q)$ and Chicken gives $2q+6(1-q)$; these are equal at $q=\frac13$), with expected payoff $\frac{14}3\approx4.67$ each. The mixed equilibrium is fair but crashes with probability $\frac19$.

Now add a **mediator** (a traffic light) that draws one of three recommendations with probability $\frac13$ each, $(C,C)$, $(D,C)$, $(C,D)$, and tells each driver only *her own* recommendation. Is obeying an equilibrium?

- Told **Dare**: the other must have been told Chicken. Dare gives 7, Chicken gives 6. Obey.
- Told **Chicken**: the other was told Chicken or Dare with probability $\frac12$ each. Chicken gives $\frac{6+2}2=4$; Dare gives $\frac{7+0}2=3.5$. Obey.

Obedience is optimal, the crash never happens, and each driver's expected payoff is $\frac{6+7+2}3=5>4.67$. Correlation through a shared signal does better than independent randomization.

### 12.2 Definition and Computation

A **correlated equilibrium** is a distribution $\pi$ over action profiles such that, when a profile is drawn and each player is told her own component, no player gains by deviating from her recommendation:

$$
\sum_{a_{-i}}\pi(a_i,a_{-i})\Big[u_i(a_i,a_{-i})-u_i(a_i',a_{-i})\Big]\ge0\qquad\text{for all }i,\ a_i,\ a_i'.
$$

These constraints are **linear in $\pi$**. So the set of correlated equilibria is a convex polytope, it contains every Nash equilibrium (independent mixing is a special case), and finding one that maximizes total welfare is a linear program, solvable in polynomial time. Correlated equilibrium is both a more permissive and a more computable concept than Nash equilibrium.

### What to Remember

- A mediator's private recommendations can coordinate play better than independent mixing.
- CE constraints are linear: CE is a polytope containing all Nash equilibria; optimize over it by LP.

## 13. Learning and Evolution in Games

Equilibrium analysis asks what is stable. Learning asks whether, and how, players get there.

### 13.1 Fictitious Play

Each player best-responds to the **empirical frequency** of the opponent's past actions. If play converges, it converges to a Nash equilibrium. The empirical frequencies are guaranteed to converge in two-player zero-sum games (Robinson, 1951), in potential games, and in $2\times2$ games, but not always: Shapley exhibited a $3\times3$ game in which fictitious play cycles forever.

### 13.2 No-Regret Learning

Player $i$'s **external regret** after $T$ rounds compares her total payoff with the best fixed action in hindsight:

$$
R_i^T=\max_{a_i}\sum_{t=1}^{T}u_i\big(a_i,a_{-i}^{(t)}\big)-\sum_{t=1}^{T}u_i\big(a^{(t)}\big).
$$

Algorithms such as multiplicative weights (Hedge) guarantee $R_i^T/T\to0$ against *any* opponent sequence, even an adversarial one. If all players use no-regret algorithms, the **time-averaged** joint play converges to the set of **coarse correlated equilibria**; with no-*swap*-regret algorithms, to correlated equilibria. This links the LP-friendly concept of section 12 to simple decentralized learning, and it underlies modern algorithms for large games such as poker (counterfactual regret minimization).

### 13.3 Zero-Sum Learning

In zero-sum games, if both players use no-regret learning, their average strategies converge to minimax strategies, and the average payoff converges to the value. This is one way to solve large zero-sum games without writing down the LP.

### 13.4 Evolutionary Game Theory

Think of a large population in which individuals are "programmed" with pure strategies and meet at random; payoff is reproductive fitness. The **replicator dynamics** let a strategy's population share grow in proportion to how much better than average it does:

$$
\dot x_s=x_s\big(f_s(x)-\bar f(x)\big).
$$

An **evolutionarily stable strategy (ESS)** is one that, once common, cannot be invaded by a small group of mutants.

**Hawk-Dove.** Two animals contest a resource of value $V$. Hawks fight; a fight costs the loser $C$. Payoffs: Hawk vs Hawk $\frac{V-C}2$ each; Hawk vs Dove: $V$ to the hawk, 0 to the dove; Dove vs Dove: $\frac V2$ each. If $C>V$, neither pure strategy is stable: in a population of doves, a hawk does very well; in a population of hawks, a dove avoids injury and does better. The ESS is a mixed population with **hawk share $V/C$**, at which both strategies earn equal fitness. For $V=2$, $C=6$: one third hawks, and both types earn $\frac23$. This is the mixed Nash equilibrium of the game, now read as a stable population composition.

### What to Remember

- Fictitious play converges in zero-sum and potential games, but can cycle in general.
- No-regret learning: time averages converge to coarse correlated equilibria.
- Replicator dynamics and ESS reinterpret mixed equilibria as stable population shares (Hawk-Dove: $V/C$ hawks).

## 14. Computing Equilibria

| Problem | Complexity | Method |
|---|---|---|
| Two-player zero-sum | polynomial | linear programming |
| Correlated equilibrium (any finite game) | polynomial | linear programming |
| Pure NE, small normal form | polynomial in table size | check every cell |
| Mixed NE, two-player general-sum | PPAD-complete | support enumeration, Lemke-Howson |
| Mixed NE, $n$ players | PPAD-complete | homotopy methods, approximations |
| Pure NE in congestion games | PLS-complete | better-response dynamics (may be slow) |

**Support enumeration** guesses which actions each player uses, solves the indifference equations (section 4.2) for that support, and checks that unused actions are not better; it is exponential in the worst case but simple. The **Lemke-Howson** algorithm follows a path of almost-equilibria to an equilibrium, much like the simplex method. The surprising theoretical result (Daskalakis, Goldberg, and Papadimitriou; Chen and Deng) is that computing a Nash equilibrium of a two-player game is **PPAD-complete**: an equilibrium is guaranteed to exist, but finding one is believed to be intractable in general. This is a serious objection to Nash equilibrium as a prediction for large games: if computers cannot find it, it is unclear how players would. It also explains the appeal of correlated equilibrium and of no-regret dynamics.

## 15. Game Theory in Multi-Agent Systems

Game theory is a design tool, not only a predictive one, when autonomous agents share resources: robots allocating tasks, drones sharing airspace, vehicles at intersections, devices competing for bandwidth or charging slots. A typical engineering workflow:

1. **Design local utilities** whose unilateral changes are aligned with the global objective, ideally making the game a potential game (e.g. marginal-contribution or Shapley-value utilities).
2. **Choose a learning rule** with convergence guarantees for that class (better-response dynamics, log-linear learning, no-regret learning).
3. **Check efficiency**: bound the price of anarchy of the equilibria the dynamics reach.
4. **Wrap the result in safety constraints**: an equilibrium plan must still pass collision checks, actuator limits, and communication constraints before execution.

{% include figure.html image="/assets/img/posts/game-theory/multi-agent-game-architecture.svg" alt="Multi-agent architecture connecting local utilities, equilibrium solver, shared resources, safety filter, and coordinated action." caption="In engineered multi-agent systems, game-theoretic plans should be filtered through safety and feasibility constraints before execution." %}

The same caveats as in economics apply: an equilibrium can be stable yet unfair, unsafe, inefficient, or unreachable by the dynamics actually used. Learning in multi-agent reinforcement learning faces all of these at once (see the [RL note]({% post_url 2022-10-21-rl-from-mdp-to-marl-rlhf %})).

## 16. Summary of Solution Concepts

| Concept | Setting | Requirement | Exists? | Computation |
|---|---|---|---|---|
| Dominant-strategy equilibrium | normal form | each action best against everything | rarely | easy |
| Iterated strict dominance | normal form | survives elimination rounds | always (maybe many survivors) | easy |
| Pure Nash | normal form | mutual best responses | not always | check cells |
| Mixed Nash | finite games | mutual best responses in mixtures | always (Nash) | PPAD-complete |
| Minimax / value | two-player zero-sum | security strategies | always (von Neumann) | LP |
| Subgame-perfect | extensive form | Nash in every subgame | finite perfect info: yes (Zermelo) | backward induction |
| Bayesian Nash | private types | each type best-responds in expectation | finite: yes | game-specific |
| Correlated | with mediator | obedience constraints | always (contains Nash) | LP |
| ESS | population | resists invasion | not always | replicator analysis |
| Core | cooperative TU | no blocking coalition | not always | LP feasibility |
| Shapley value | cooperative TU | four axioms | always, unique | sum over coalitions |

**Where the framework stops being reliable.** Every prediction depends on the payoffs, the information structure, the rationality assumptions, and the class of deviations considered. Multiple equilibria make prediction ambiguous; computational hardness makes some equilibria implausible; experiments show bounded reasoning and social preferences. Used carefully, game theory is less a crystal ball than a disciplined way to ask what incentives a situation creates and how to change them.

## References and Reading Guide

- M. J. Osborne, _An Introduction to Game Theory_ (Oxford, 2004). Chapters 2-4 (Nash equilibrium, mixed strategies), 5-7 (extensive games), 9 (Bayesian games), 14-15 (repeated games). The most readable first text.
- M. Maschler, E. Solan, and S. Zamir, _Game Theory_ (2nd ed., Cambridge, 2020). Rigorous coverage including cooperative games, the core, the Shapley value, and bargaining.
- M. J. Osborne and A. Rubinstein, _A Course in Game Theory_ (MIT Press, 1994).
- D. Fudenberg and J. Tirole, _Game Theory_ (MIT Press, 1991).
- Y. Shoham and K. Leyton-Brown, _Multiagent Systems: Algorithmic, Game-Theoretic, and Logical Foundations_ (Cambridge, 2009). Computation of equilibria, learning, mechanism design.
- N. Nisan, T. Roughgarden, É. Tardos, and V. V. Vazirani (eds.), _Algorithmic Game Theory_ (Cambridge, 2007). Complexity, price of anarchy, mechanism design.
- T. Roughgarden, _Twenty Lectures on Algorithmic Game Theory_ (Cambridge, 2016).
- V. Krishna, _Auction Theory_ (2nd ed., Academic Press, 2009).
- R. J. Aumann, "Subjectivity and Correlation in Randomized Strategies," _Journal of Mathematical Economics_ 1(1), 1974.
- J. Maynard Smith, _Evolution and the Theory of Games_ (Cambridge, 1982).
