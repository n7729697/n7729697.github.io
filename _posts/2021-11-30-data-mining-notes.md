---
title: DD2222 Data Mining Notes
tags: [data mining, graph mining, clustering, recommender systems, representation learning]
style: fill
color: secondary
description: Personal notes synthesized from DD2222 lecture slides: similar items, graph mining, link analysis, clustering, and latent representations.
---

## 1. Course Lens: Mining Large-Scale Data

The central goal is extracting actionable knowledge from large datasets where scale changes algorithm design.

Key framing:

- data mining is not only modeling accuracy, but also computational scalability,
- relationships between entities often matter more than isolated features,
- network-based views unify many tasks (recommendation, ranking, misinformation, communities).

---

## 2. Similarity Search at Scale

### 2.1 Problem statement

Given points/items $x_1,\dots,x_n$ and distance $d(\cdot,\cdot)$, find near pairs:

$$
d(x_i,x_j) \le s.
$$

Naive all-pairs is $O(n^2)$ and often infeasible.

### 2.2 Set similarity and Jaccard

For sets $A,B$:

$$
J(A,B)=\frac{|A\cap B|}{|A\cup B|}.
$$

### 2.3 MinHash + LSH

Pipeline from slides:

1. shingling -> set representation,
2. MinHash signatures approximate Jaccard,
3. LSH buckets likely-similar pairs for subquadratic candidate generation.

Main idea: trade exactness for scalable candidate filtering while preserving high-recall nearest-neighbor behavior.

---

## 3. Graph Fundamentals for Mining

Represent data as graph $G=(V,E)$ or adjacency matrix $A$.

Core notions used repeatedly:

- degree, paths, cycles,
- connected components / giant component,
- directed strong vs weak connectivity,
- local bridges and embeddedness.

Why this matters: many downstream metrics (PageRank, HITS, clustering, recommendation signals) are functions of graph structure.

---

## 4. Random Graphs and Network Effects

### 4.1 Erdos-Renyi models

- $G(n,m)$: fixed edge count,
- $G(n,p)$: independent edge probability $p$.

For large $n$, giant-component phase transition appears around $p\approx 1/n$.

### 4.2 Structural signatures

Slides emphasize comparing real networks to random baselines by:

- degree distribution,
- clustering coefficient,
- diameter scaling,
- component-size profile.

These diagnostics distinguish social/information networks from purely random constructions.

---

## 5. Random Walks, Expansion, and PageRank

For row-stochastic transition matrix $P$, random walk evolves as:

$$
\pi_{t+1}=\pi_t P.
$$

For connected, non-bipartite graphs, walk converges to stationary distribution.

### 5.1 Expansion and mixing

Expanders are sparse but highly connected; large spectral gap implies fast mixing.

### 5.2 PageRank

Teleporting walk (Google matrix):

$$
\pi = \alpha \pi P + (1-\alpha) v,
$$

with damping $\alpha\in(0,1)$ and teleport distribution $v$.

Interpretation: robust centrality from both link structure and random restart behavior.

---

## 6. Beyond PageRank: HITS and Link Analysis

HITS maintains two coupled scores:

- authority score $a$,
- hub score $h$.

Mutual recursion:

$$
a \propto A^\top h, \qquad h \propto A a.
$$

So good hubs point to good authorities, and good authorities are pointed to by good hubs.

This captures role asymmetry in directed information graphs better than single-score ranking.

---

## 7. Graph Clustering and Community Detection

### 7.1 Community notion

Community = dense internal connectivity, sparse external connectivity.

### 7.2 Conductance and cuts

A common objective is minimizing cut quality metrics such as conductance, balancing boundary size against community volume.

### 7.3 Spectral clustering

Use graph Laplacian variants:

- unnormalized: $L=D-A$,
- normalized: $L_{sym}=I-D^{-1/2}AD^{-1/2}$.

Typical recipe:

1. compute first $k$ informative eigenvectors,
2. embed nodes into $\mathbb{R}^k$,
3. run k-means in eigenspace.

This converts combinatorial partitioning into continuous optimization.

### 7.4 Overlapping communities (BigCLAM)

BigCLAM models node-community affiliation strengths via nonnegative factors, enabling overlapping memberships and scalable inference in large graphs.

---

## 8. Dimensionality Reduction and Latent Factors

### 8.1 Low-rank assumption

Data matrix $X\in\mathbb{R}^{n\times d}$ often lies near low-dimensional subspace:

$$
X \approx U_k \Sigma_k V_k^\top.
$$

This supports compression, denoising, and latent-structure discovery.

### 8.2 Rank as intrinsic dimensionality

Rank quantifies linear degrees of freedom; low rank implies fewer latent factors can explain most variation.

### 8.3 Recommender link

User-item matrices are sparse and approximately low-rank; latent factors capture preferences and item semantics used for recommendation.

---

## 9. Graph Representation Learning (GRL)

Slides introduce shift from hand-crafted graph features to learned node/edge/graph embeddings.

General objective:

- map nodes to vectors $z_v\in\mathbb{R}^k$,
- preserve structural or task-specific proximity,
- use embeddings for classification, link prediction, recommendation.

This unifies classical matrix factorization, random-walk context methods, and modern neural graph models.

---

## 10. Practical Synthesis

A useful end-to-end workflow inspired by DD2222:

1. choose representation: tabular vs graph vs set/shingles,
2. define task objective: similarity, ranking, clustering, prediction,
3. select scalable algorithm family (LSH, random-walk ranking, spectral methods, latent factors),
4. compare against simple baselines and random-graph expectations,
5. validate quality + runtime + memory, not quality alone.

---

## Compact Formula Sheet

- Jaccard: $J(A,B)=|A\cap B|/|A\cup B|$.
- Random walk update: $\pi_{t+1}=\pi_tP$.
- PageRank: $\pi=\alpha\pi P+(1-\alpha)v$.
- Laplacian: $L=D-A$.
- Normalized Laplacian: $L_{sym}=I-D^{-1/2}AD^{-1/2}$.
- Low-rank model: $X\approx U_k\Sigma_kV_k^\top$.

These notes summarize the conceptual bridge from classic scalable data mining to modern graph representation learning.
