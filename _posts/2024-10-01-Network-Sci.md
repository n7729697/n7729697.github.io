---
title: Network Science Notes
tags: [network science, complex systems, graph theory, epidemic modeling]
style: fill
color: light
description: Personal technical notes on propagation, clustering, inference, temporal graphs, and applications to multi-robot systems.
---

## Topic Map

- Propagation and epidemic thresholds
- Temporal networks and causal paths
- Node distances and centrality measures
- Modularity and Louvain clustering
- Random graph baselines and detectability limits
- Bayesian network inference and model selection
- Roles, positions, and blockmodeling
- Multi-robot systems applications

---

## 1. Why Networks Instead of Flat Euclidean Features

Classical pipelines focus on vectors $x_i\in\mathbb{R}^d$ and similarity metrics (Euclidean distance, cosine, Pearson correlation). That is sufficient when interaction structure is weak.

In many systems, the object of interest is relational:

- communication links,
- contact events,
- influence pathways,
- team topology.

A graph $G=(V,E)$ with adjacency $A$ captures these relations. The dynamics then live on topology, for example:

$$
\dot z_i = f_i(z_i) + \sum_{j=1}^n A_{ij} g_{ij}(z_i,z_j).
$$

So structure and dynamics are coupled; this is the central reason network science is not just “another clustering method.”

---

## 2. Propagation and Epidemic Modeling on Networks

### 2.1 SIS dynamics and threshold condition

For SIS on graph $A$, let $p_i(t)$ be infection probability of node $i$. The NIMFA form is

$$
\dot p_i = -\delta p_i + \beta (1-p_i)\sum_j A_{ij}p_j.
$$

Linearizing near disease-free state $p=0$:

$$
\dot p \approx (\beta A - \delta I)p.
$$

Disease-free equilibrium is unstable when

$$
\beta\lambda_1(A)-\delta>0
\quad\Longleftrightarrow\quad
\tau=\frac{\beta}{\delta}>\frac{1}{\lambda_1(A)}.
$$

This spectral criterion explains why hub-heavy networks are vulnerable: large $\lambda_1(A)$ reduces threshold.

![SIS spectral threshold sketch](/files/network/propagation-threshold.svg)
Source: Author-generated figure.

### 2.2 Structure effects

Given fixed $\beta,\delta$:

- degree heterogeneity usually increases endemic prevalence,
- modular bottlenecks can delay cross-community outbreaks,
- assortativity changes where outbreaks concentrate,
- targeted immunization of high-centrality nodes can shift effective threshold more than random immunization.

A useful control surrogate is spectral radius reduction: design interventions so that $\lambda_1(A_{\text{effective}})$ decreases.

### 2.3 Resource-limited spreading

For information diffusion with bounded attention $b_i$, transmission can be modeled as constrained flow:

$$
\sum_j u_{ij}(t) \le b_i,
$$

where $u_{ij}$ is outgoing transmission effort. This turns diffusion into a coupled dynamics-allocation problem, not pure SI/SIS.

---

## 3. Temporal Networks

A temporal network is an event sequence

$$
\mathcal{E}=\{(i,j,t_k)\}_{k=1}^M.
$$

A temporal path $i_0\to i_1\to\cdots\to i_r$ is valid only if times are nondecreasing:

$$
t_1 \le t_2 \le \cdots \le t_r.
$$

Hence static shortest-path calculations can be wrong for causality.

Key metrics:

- earliest arrival time,
- temporal reachability ratio,
- latency-respecting betweenness.

![Temporal path and causality](/files/network/temporal-network.svg)
Source: Author-generated figure.

In robotic communication networks, this distinction is critical because links appear/disappear with motion and occlusion.

---

## 4. Node Distances and Measures

### 4.1 Distances

Common notions (not interchangeable):

- Geodesic distance $d_G(i,j)$.
- Effective resistance distance
$$
r_{ij}=(e_i-e_j)^\top L^\dagger(e_i-e_j),
$$
where $L$ is graph Laplacian.
- Temporal distance $d_T(i,j)$ (minimum arrival time in event graph).

### 4.2 Centralities

- Degree: $k_i=\sum_j A_{ij}$.
- Betweenness:
$$
C_B(i)=\sum_{s\neq i\neq t}\frac{\sigma_{st}(i)}{\sigma_{st}}.
$$
- Eigenvector centrality: $Ax=\lambda_1 x$.
- PageRank:
$$
\pi = \alpha P^\top\pi + (1-\alpha)v.
$$

Measure selection should match task dynamics (routing, influence, epidemic suppression, etc.).

---

## 5. Modularity Clustering and Louvain

### 5.1 Modularity

For partition labels $c_i$,

$$
Q=\frac{1}{2m}\sum_{ij}\left(A_{ij}-\frac{k_i k_j}{2m}\right)\mathbf{1}[c_i=c_j].
$$

This compares observed within-community edge mass against configuration-model expectation.

### 5.2 Louvain heuristic

Louvain iterates:

1. local node moves maximizing modularity gain $\Delta Q$,
2. aggregation of communities into supernodes,
3. repeat on coarsened graph.

One useful local gain expression (node $i$ moved into community $C$) is:

$$
\Delta Q = \frac{k_{i,\text{in}}}{m} - \frac{k_i\,\Sigma_{tot,C}}{2m^2},
$$

with standard notation for $i$'s links into $C$ and total degree mass in $C$.

![Modularity partition and Louvain aggregation](/files/network/modularity-louvain.svg)
Source: Author-generated figure.

### 5.3 Resolution limit

Modularity has a known scale bias: small true communities can be merged if global gain is larger. So “high $Q$” is not equivalent to “ground-truth recovery.”

---

## 6. Random Graphs and Community Detectability

Community claims should be benchmarked against random graph models.

For symmetric SBM with $q$ groups and average within/between expected degrees $c_{in},c_{out}$, detectability has a Kesten-Stigum-type boundary (tree/large-sparse limit intuition):

$$
\frac{(c_{in}-c_{out})^2}{q\left(c_{in}+(q-1)c_{out}\right)} > 1.
$$

Below threshold, no algorithm can recover labels better than chance asymptotically.

![SBM detectability transition sketch](/files/network/sbm-detectability.svg)
Source: Author-generated figure.

This is the practical meaning of “universal lower bound” for community structure recovery in sparse random graphs.

---

## 7. Bayesian Inference in Networks

### 7.1 Posterior and model evidence

For model $\mathcal{M}$ with parameters $\Theta$:

$$
p(\Theta\mid G,\mathcal M) \propto p(G\mid\Theta,\mathcal M)p(\Theta\mid\mathcal M),
$$

$$
p(G\mid\mathcal M)=\int p(G\mid\Theta,\mathcal M)p(\Theta\mid\mathcal M)d\Theta.
$$

Model evidence supports Bayesian model selection, balancing fit and complexity.

### 7.2 Inferential community detection

Instead of maximizing $Q$, infer latent block assignments $z$ in SBM/DC-SBM:

$$
p(z,\Theta\mid G) \propto p(G\mid z,\Theta)p(z)p(\Theta).
$$

Advantages:

- uncertainty quantification on assignments,
- principled comparison of block counts,
- better behavior with noise and missing edges.

### 7.3 Inferential link prediction

Missing link score is posterior predictive probability:

$$
p(A_{ij}=1\mid G_{obs}) = \int p(A_{ij}=1\mid\Theta) p(\Theta\mid G_{obs}) d\Theta.
$$

---

## 8. Roles, Positions, and Blockmodeling

Roles and positions are related but not identical.

- Position: similar adjacency profile.
- Role: similar function in flow/control processes.

Blockmodeling builds mesoscale interaction matrices.

### 8.1 Indirect blockmodeling

Fit a block pattern by optimizing agreement between observed ties and idealized block image matrix.

### 8.2 Direct blockmodeling

Optimize a criterion directly on observed adjacency under allowed block types (null, dense, regular, etc.).

### 8.3 Generalized blockmodeling

Unifies multiple equivalence notions and block constraints; useful when role definitions are domain-specific.

---

## 9. Information-Theoretic Community Detection

Flow-based methods (e.g., map equation perspective) define good communities as those giving short description length for trajectories.

Optimization target is code length $L(\mathcal P)$ for partition $\mathcal P$:

$$
\mathcal P^* = \arg\min_{\mathcal P} L(\mathcal P).
$$

This differs from modularity:

- modularity is edge-density surprise vs null model,
- map-equation style methods are trajectory compression objectives.

So they can produce different, complementary partitions.

---

## 10. Multi-Robot Systems Mapping

Network science tools map naturally to multi-robot systems.

### 10.1 Communication and resilience

Model communication graph $G_t$ as temporal network. Maintain algebraic connectivity $\lambda_2(L_t)$ above threshold for consensus and robustness.

### 10.2 Failure and misinformation propagation

Use SIS/SIR-type processes over robot interaction network to evaluate containment policies and critical nodes.

### 10.3 Role-aware coordination

Use blockmodeling/community structure to assign:

- relay robots,
- sensing clusters,
- bridge agents across subteams.

### 10.4 Partial observability

When each robot sees only local neighborhoods, infer global structure probabilistically and propagate uncertainty into planner/controller decisions.

---

## 11. Decision-Based Models

Spreading is not always passive. Agents may act strategically under cost/utility:

$$
\max_{a_i\in\mathcal A_i} \; U_i(a_i,a_{-i},G) - \lambda_i\,\text{risk}_i(a_i,G).
$$

Coupling strategic decisions with network dynamics leads to adaptive graphs and nonstationary diffusion.

This is a key bridge to control and RL in networked systems.

---

## 12. Quick Reference Equations

- SIS threshold (spectral): $\beta/\delta > 1/\lambda_1(A)$.
- Modularity: $Q=\frac{1}{2m}\sum_{ij}(A_{ij}-\frac{k_i k_j}{2m})\mathbf{1}[c_i=c_j]$.
- Resistance distance: $r_{ij}=(e_i-e_j)^\top L^\dagger(e_i-e_j)$.
- Bayesian evidence: $p(G\mid\mathcal M)=\int p(G\mid\Theta,\mathcal M)p(\Theta\mid\mathcal M)d\Theta$.
- SBM detectability indicator: $\frac{(c_{in}-c_{out})^2}{q(c_{in}+(q-1)c_{out})}$.

These notes are intended as working technical references, not final polished lecture notes.
