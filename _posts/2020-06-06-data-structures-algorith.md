---
title: Data Structures and Algorithms Notes
tags: [data structures, algorithms, sorting, graph algorithms, dynamic programming, complexity]
style: fill
color: light
description: A structured DSA note covering core data structures, graph algorithms, dynamic programming, greedy methods, and complexity tradeoffs.
---

## Table of Contents

1. [Algorithmic Thinking and Complexity Basics](#1-algorithmic-thinking-and-complexity-basics)
2. [Arrays, Searching, and Sorting](#2-arrays-searching-and-sorting)
3. [Linked Lists, Stacks, and Queues](#3-linked-lists-stacks-and-queues)
4. [Hash Tables, Hash Sets, and Hash Maps](#4-hash-tables-hash-sets-and-hash-maps)
5. [Trees, Binary Search Trees, and Balancing](#5-trees-binary-search-trees-and-balancing)
6. [Graphs, Traversal, and Cycle Structure](#6-graphs-traversal-and-cycle-structure)
7. [Shortest Paths, Spanning Trees, and Flow](#7-shortest-paths-spanning-trees-and-flow)
8. [Dynamic Programming, Greedy Design, and Reference Algorithms](#8-dynamic-programming-greedy-design-and-reference-algorithms)
9. [Time Complexity and Choosing the Right Tool](#9-time-complexity-and-choosing-the-right-tool)
10. [Sources](#10-sources)

## 1. Algorithmic Thinking and Complexity Basics

A data structure is a contract about how data is stored and what operations are cheap. An algorithm is a strategy for composing those operations to solve a problem. The two should never be studied separately for long. Binary search is fast only because arrays allow direct indexing. Dijkstra is efficient only because edge relaxations are organized with the right graph representation and priority queue. Dynamic programming becomes practical only when subproblems are represented in a way that can be cached or tabulated.

A good algorithm has five properties:

- it has a clearly defined input,
- it produces a clearly defined output,
- each step is precise enough to be executed mechanically,
- it terminates,
- it can be argued to be correct.

A tiny example already contains all of these ideas.

```text
maxValue(A):
  best = A[0]
  for each x in A:
    if x > best:
      best = x
  return best
```

The key invariant is that after scanning the first `i` elements, `best` is the maximum among those `i` elements. This is the bridge from code to proof. Correctness is not something added after the implementation. It should be visible in the structure of the implementation itself.

### Asymptotics

Correctness alone is not enough. We also need to know how cost grows with input size. That is the role of asymptotic analysis.

- `O(f(n))` is an upper bound.
- `Omega(f(n))` is a lower bound.
- `Theta(f(n))` is a tight bound.

A single scan of an array is `Theta(n)`. A nested loop over all pairs is usually `Theta(n^2)`. A divide-and-conquer algorithm often leads to a recurrence such as

$$
T(n) = 2T(n/2) + O(n),
$$

which solves to `Theta(n log n)`.

Recurrences matter because they expose the true structure of recursive algorithms. It is one thing to notice that mergesort splits the input in half and another to derive why its runtime remains `O(n log n)` in every case.

### Worst Case, Average Case, and Randomization

Worst-case analysis asks how bad things can get on the most difficult input of size `n`. This is the most robust default because it does not require trusting input distributions.

Average-case analysis can be more realistic, but only if the probability model is justified. Randomized algorithms use probability as a design tool. Randomized quicksort, for example, avoids systematically bad pivots by choosing them unpredictably.

Another useful viewpoint is that some performance barriers are structural. Comparison-based sorting has an `Omega(n log n)` lower bound because any such algorithm must distinguish among all possible orderings. If we beat that bound with counting sort or radix sort, it is because we used stronger assumptions about the keys, not because the lower bound was wrong.

### Selection and Problem-Specific Design

Not every problem should be solved by reducing it to sorting. If the goal is to find the `k`th smallest element, a selection algorithm may be more appropriate than a full sort. This is a recurring pattern in DSA: define the actual target operation first, then choose the representation and strategy that match that target. Unnecessary generality is often where runtime is wasted.

## 2. Arrays, Searching, and Sorting

Arrays are the standard example of a data structure that gives up flexibility in exchange for direct indexing and strong locality. Elements are stored contiguously, so reading `A[i]` is `O(1)` under the RAM model. This makes arrays the natural home for binary search, most textbook sorting algorithms, dynamic-programming tables, heaps, and adjacency matrices.

### Arrays and Their Tradeoffs

Main strengths:

- constant-time indexing,
- compact memory layout,
- very good cache behavior,
- compatibility with divide-and-conquer and pointer-free iteration.

Main weakness:

- insertion and deletion in the middle require shifting elements.

| Operation on Array | Cost |
|---|---|
| Read by index | `O(1)` |
| Update by index | `O(1)` |
| Append to dynamic array, amortized | `O(1)` |
| Insert/delete in middle | `O(n)` |
| Full scan | `O(n)` |

Dynamic arrays are especially important in practice. Appending can stay amortized `O(1)` because occasional resizing is spread across many cheap appends.

### Linear Search and Binary Search

**Linear search** is the baseline. It works whenever elements can be scanned one by one.

```text
linearSearch(A, target):
  for i from 0 to n-1:
    if A[i] == target:
      return i
  return not found
```

Worst-case time is `O(n)`.

**Binary search** is dramatically faster, `O(log n)`, but only under two assumptions:

- the data is sorted,
- indexing by position is cheap.

```text
binarySearch(A, target):
  low = 0
  high = n-1
  while low <= high:
    mid = floor((low + high) / 2)
    if A[mid] == target:
      return mid
    else if A[mid] < target:
      low = mid + 1
    else:
      high = mid - 1
  return not found
```

This contrast is fundamental. A fast algorithm often depends on a specific structural promise from the data structure.

### Bubble Sort, Selection Sort, and Insertion Sort

These three `O(n^2)` sorting algorithms remain useful because they expose different design patterns.

**Bubble sort** repeatedly swaps adjacent out-of-order elements. It is easy to visualize, but it does a large number of comparisons and swaps.

**Selection sort** repeatedly selects the minimum remaining element and places it at the next output position. It performs many comparisons but relatively few swaps.

**Insertion sort** grows a sorted prefix one element at a time. It performs especially well on nearly sorted data and has low constant factors.

The point of these algorithms is not that they are always practical. The point is that they teach invariants:

- bubble sort keeps pushing large elements to the end,
- selection sort grows a correct prefix by global choice,
- insertion sort maintains a sorted prefix by local insertion.

These ideas reappear in more advanced algorithms.

### Merge Sort and Quick Sort

**Merge sort** uses divide-and-conquer. Split the array, recursively sort both halves, then merge the results.

```text
mergeSort(A):
  if length(A) <= 1:
    return A
  split A into left and right
  return merge(mergeSort(left), mergeSort(right))
```

Its recurrence yields `O(n log n)` time in the worst case. It is also stable, which matters when equal keys must preserve relative order.

**Quick sort** partitions the array around a pivot so smaller elements go left and larger elements go right, then recursively sorts the parts.

```text
quickSort(A):
  choose pivot p
  partition A into < p, = p, > p
  recursively sort left and right parts
```

Average runtime is `O(n log n)`, but worst-case can degrade to `O(n^2)` with consistently bad pivots. Randomized pivot selection helps avoid that in practice.

| Algorithm | Typical Strength | Stable | Extra Space | Worst Case |
|---|---|---|---|---|
| Merge Sort | predictable performance | yes | usually `O(n)` | `O(n log n)` |
| Quick Sort | fast in-memory average behavior | no, standard form | small stack overhead | `O(n^2)` |

### Counting Sort, Radix Sort, and Lower Bounds

Counting sort and radix sort are important because they show that not all sorting is comparison-based.

**Counting sort** assumes keys come from a manageable integer range. It counts frequencies and reconstructs the sorted output. Runtime is `O(n + k)`, where `k` is the key range.

**Radix sort** sorts by digits or positions, usually using a stable subroutine such as counting sort on each pass. If the number of digits is bounded, runtime can be close to linear in the input size.

The lesson is subtle but important. These algorithms are faster than `O(n log n)` only because they exploit stronger assumptions about the keys. They do not contradict the lower bound for comparison sorting.

### Sorting Summary

| Sorting Algorithm | Time Complexity | Stable | In-Place | Core Idea |
|---|---|---|---|---|
| Bubble Sort | `O(n^2)` | yes | yes | repeated adjacent swaps |
| Selection Sort | `O(n^2)` | no | yes | repeatedly choose minimum |
| Insertion Sort | `O(n^2)` worst case | yes | yes | grow sorted prefix |
| Merge Sort | `O(n log n)` | yes | no, typical array version | divide and merge |
| Quick Sort | `O(n log n)` average | no, typical version | mostly | partition by pivot |
| Counting Sort | `O(n + k)` | yes | no | count key frequencies |
| Radix Sort | `O(d(n + k))` | depends on inner sort | no, typical version | sort digit by digit |

## 3. Linked Lists, Stacks, and Queues

### Linked Lists and Memory Layout

A linked list node stores a value and one or more pointers. In a singly linked list, each node points to the next. Nodes need not be contiguous in memory, which changes the cost model completely.

| Operation on Singly Linked List | Cost |
|---|---|
| Insert at head | `O(1)` |
| Delete at head | `O(1)` |
| Search by value | `O(n)` |
| Access kth node | `O(n)` |
| Insert after known node | `O(1)` |

The advantage is flexible local updates. The disadvantage is poor indexing and weaker cache locality than arrays.

### Linked List Types

- **Singly linked list**: minimal pointer overhead, forward traversal only.
- **Doubly linked list**: easier deletion and backward traversal, but more memory and pointer maintenance.
- **Circular linked list**: tail connects back to head, useful for round-robin behavior.

The right list type depends on which local edits must be cheap.

### Stacks

A stack is **last in, first out**. Core operations are `push`, `pop`, and `peek`.

Stacks appear in:

- function-call management,
- expression parsing,
- undo systems,
- depth-first search,
- backtracking.

Array-backed stacks are often best when capacity growth is manageable. Linked-list stacks are more flexible when nodes are created and destroyed dynamically.

### Queues

A queue is **first in, first out**. Core operations are `enqueue`, `dequeue`, and `front`.

Queues appear in:

- breadth-first search,
- buffering and scheduling,
- producer-consumer pipelines,
- event systems.

A practical array queue is usually circular. Otherwise dequeueing from the front would require shifting every element.

The structural difference between stack and queue is algorithmically decisive. DFS and BFS differ primarily because one explores depth first and the other explores by layers, and that difference is entirely driven by the underlying structure.

## 4. Hash Tables, Hash Sets, and Hash Maps

Hashing is the standard way to trade ordering for direct access. A hash table computes an array index from a key:

```text
index = h(key)
```

If `h` spreads keys well, lookup, insertion, and deletion are `O(1)` on average.

### Hash Sets and Hash Maps

A **hash set** stores keys only. A **hash map** stores key-value pairs. Both rely on the same underlying table and collision strategy.

Common uses:

- membership tests,
- frequency counting,
- memoization tables,
- caches,
- visited sets in graph traversal.

### Collisions and Load Factor

Different keys can hash to the same location, so collisions must be handled explicitly.

Common strategies:

- **chaining**, with a small list or vector per bucket,
- **open addressing**, where the table probes for alternative positions.

The load factor

$$
\alpha = \frac{n}{m}
$$

measures how full the table is, where `n` is the number of stored items and `m` is the number of buckets. As `alpha` grows, collisions become more frequent.

Hash tables are fast when their assumptions hold:

- hash values are reasonably uniform,
- the table resizes before load factor becomes too large,
- equality checking on keys is not too expensive,
- ordered iteration is not required.

Hashing is typically an **expected-time** technique. In adversarial settings, worst-case behavior can still become linear if collisions are severe.

## 5. Trees, Binary Search Trees, and Balancing

### Tree Basics and Traversal

Trees represent hierarchical structure. They appear in parsing, search, scheduling, filesystems, decision procedures, and many graph decompositions.

A binary tree node has up to two children. The classic traversals are:

- **pre-order**: node, left, right,
- **in-order**: left, node, right,
- **post-order**: left, right, node.

These orders are not arbitrary. Pre-order is useful for copying or serializing rooted structure, in-order exposes sorted order in search trees, and post-order is useful when children must be processed before the parent.

### Array Implementation

Array representation is natural for **complete binary trees**. If a node sits at index `i`, then:

- left child is `2i + 1`,
- right child is `2i + 2`,
- parent is `floor((i - 1)/2)`.

This is why heaps fit arrays so well. Sparse trees do not, because too many array positions would be wasted.

### Binary Search Trees

A binary search tree has the invariant:

- every key in the left subtree is smaller than the node key,
- every key in the right subtree is larger.

Search, insert, and delete are all `O(h)` where `h` is the height. If the tree stays balanced, `h = O(log n)`. If not, the tree can collapse into a chain and operations degrade to `O(n)`.

### AVL Trees and Red-Black Trees

Balanced trees protect the BST invariant from bad insertion order.

- **AVL trees** enforce a stricter balance condition and often give very fast lookup.
- **Red-black trees** use a looser color-based invariant and are often preferred in standard libraries because updates are easier to keep efficient.

| Tree Type | Search | Insert/Delete | Balance Strictness |
|---|---|---|---|
| Plain BST | `O(h)` | `O(h)` | none |
| AVL Tree | `O(log n)` | `O(log n)` | strict |
| Red-Black Tree | `O(log n)` | `O(log n)` | moderate |

Balanced trees are the ordered counterpart to hash maps. They give predecessor, successor, and range queries naturally.

## 6. Graphs, Traversal, and Cycle Structure

Graphs represent relationships rather than containment. They are the right abstraction for networks, dependencies, reachability, roads, communication paths, and state transitions.

### Graph Representation

The two standard representations are:

- **adjacency list**, best for sparse graphs,
- **adjacency matrix**, best for dense graphs or constant-time edge tests.

| Representation | Space | Best Use |
|---|---|---|
| Adjacency List | `O(n + m)` | sparse graphs |
| Adjacency Matrix | `O(n^2)` | dense graphs |

### BFS and DFS

**Breadth-first search (BFS)** explores in layers using a queue. In an unweighted graph, BFS finds shortest paths measured in number of edges.

**Depth-first search (DFS)** explores as far as possible before backtracking, using recursion or an explicit stack. DFS is the foundation of cycle detection, topological reasoning, component decomposition, and many graph proofs.

Both run in `O(n + m)` with adjacency lists.

### Cycle Detection and Strongly Connected Components

Cycle detection changes what is algorithmically possible. Many algorithms become much simpler on DAGs because there is a topological order and no need to revisit states through cycles.

- In directed graphs, DFS can detect back edges by tracking which nodes are currently on the recursion stack.
- In undirected graphs, a visited neighbor that is not the current node's parent reveals a cycle.

**Strongly connected components** are the maximal regions of a directed graph in which every vertex can reach every other. SCC decomposition is powerful because it compresses cyclic regions into single meta-vertices, producing a DAG of components.

## 7. Shortest Paths, Spanning Trees, and Flow

### Shortest Paths

The shortest-path problem has several forms:

- single-source shortest path,
- single-pair shortest path,
- all-pairs shortest path.

**Dijkstra's algorithm** works when all edge weights are nonnegative. It repeatedly finalizes the unsettled node with smallest tentative distance.

**Bellman-Ford** allows negative edges by repeatedly relaxing all edges. It can also detect negative cycles.

**Floyd-Warshall** solves all-pairs shortest path through dynamic programming by gradually allowing more intermediate vertices.

| Algorithm | Negative Edges Allowed? | Typical Time |
|---|---|---|
| Dijkstra | no | `O((n + m) log n)` with heap |
| Bellman-Ford | yes | `O(nm)` |
| Floyd-Warshall | yes, if no negative cycle | `O(n^3)` |

The most important conceptual warning is that Dijkstra is greedy and therefore depends on the assumption that edge weights are nonnegative. Once negative edges exist, a node that looks final may later become improvable.

### Minimum Spanning Trees

A minimum spanning tree connects all vertices of a connected weighted graph using minimum total edge weight and no cycles.

**Prim's algorithm** grows one tree outward, always taking the lightest edge that connects the current tree to a new vertex.

**Kruskal's algorithm** sorts all edges by weight and keeps adding the lightest edge that does not form a cycle, usually with a union-find structure.

| Algorithm | Core Idea | Typical Strength |
|---|---|---|
| Prim | expand one tree | good with adjacency lists and heaps |
| Kruskal | add globally light safe edges | simple for sparse graphs |

These are both greedy algorithms, but they work because spanning trees satisfy structural exchange properties.

### Maximum Flow

A flow network has capacities on directed edges, a source `s`, and a sink `t`. A feasible flow must respect:

- capacity constraints,
- conservation at intermediate nodes.

The goal is to maximize the value sent from source to sink.

**Ford-Fulkerson** works with a residual graph. As long as there is an augmenting path, more flow can be pushed.

```text
while there exists augmenting path P:
  push bottleneck amount along P
  update residual capacities
```

**Edmonds-Karp** chooses the augmenting path with the fewest edges, which gives a polynomial runtime bound.

The deep structural result is the **max-flow min-cut theorem**: the maximum possible flow equals the minimum capacity of any `s-t` cut.

## 8. Dynamic Programming, Greedy Design, and Reference Algorithms

This is where a lot of DSA courses suddenly become either powerful or confusing. The topics are related, but they answer different kinds of questions.

- Dynamic programming is for problems with overlapping subproblems and optimal substructure.
- Greedy algorithms are for problems where a local choice can be proved globally safe.
- Reference algorithms like Euclid, Huffman coding, knapsack, and TSP matter because each one highlights a distinct way of thinking.

### Memoization, Tabulation, and the DP Workflow

Dynamic programming begins when naive recursion repeats the same work many times. Instead of recomputing a subproblem every time it appears, we solve it once and reuse the answer.

The two standard styles are:

- **memoization**, which is top-down recursion plus a cache,
- **tabulation**, which is bottom-up table filling.

Memoization is often the easiest way to get a correct version from a recurrence. Tabulation is often easier to optimize because the order of computation is explicit and recursion overhead disappears.

A reliable DP workflow is:

1. define the state,
2. define the recurrence,
3. define the base cases,
4. choose memoization or tabulation,
5. compute the time and space cost,
6. if needed, reconstruct the actual solution from stored choices.

The hardest step is almost always the state design. If the state is too small, important information is missing and the recurrence becomes wrong. If the state is too large, the solution may become impractical even if correct.

### Longest Common Subsequence

The **Longest Common Subsequence (LCS)** problem asks for the longest sequence of characters that appears in order in both strings, not necessarily contiguously.

If `LCS(i, j)` means the answer for suffixes `s[i:]` and `t[j:]`, then the recurrence is

$$
LCS(i,j) =
\begin{cases}
0 & \text{if } i \text{ or } j \text{ reaches the end} \\
1 + LCS(i+1, j+1) & \text{if } s_i = t_j \\
\max(LCS(i+1,j), LCS(i,j+1)) & \text{otherwise.}
\end{cases}
$$

This example is important because it demonstrates the essence of DP clearly:

- progress is measured by indices,
- branches overlap heavily,
- caching those index pairs turns exponential recursion into polynomial time.

### 0/1 Knapsack

In **0/1 Knapsack**, each item may be taken once or not taken at all. Each item has a weight and a value, and the goal is to maximize value under a capacity budget.

If `DP[i][w]` means the best value achievable using the first `i` items with capacity `w`, then

$$
DP[i][w] =
\begin{cases}
DP[i-1][w] & \text{if item } i \text{ does not fit} \\
\max(DP[i-1][w],\; value_i + DP[i-1][w-weight_i]) & \text{otherwise.}
\end{cases}
$$

The first term means item `i` is excluded. The second means it is included, so the remaining capacity shrinks accordingly.

Knapsack is one of the clearest examples of why DP is not the same as greed. A high value-to-weight ratio does not guarantee an optimal global combination. Sometimes a slightly worse-looking local choice opens room for several later choices that dominate overall.

### Weighted Independent Set on a Path

A smaller and cleaner DP example is **weighted independent set on a path**. Each vertex has a weight, and adjacent vertices cannot both be chosen.

If `OPT(i)` is the best value using the first `i` vertices of the path, then either vertex `i` is excluded, giving `OPT(i-1)`, or it is included, forcing vertex `i-1` to be excluded, giving `weight(i) + OPT(i-2)`. So

$$
OPT(i) = \max(OPT(i-1),\; weight(i) + OPT(i-2)).
$$

This example is useful because it removes complicated indexing and leaves only the central DP logic: compare mutually exclusive structural choices and reuse optimal answers to smaller cases.

### Traveling Salesman and State Explosion

The **Traveling Salesman Problem (TSP)** is valuable because it demonstrates both the reach and the limit of dynamic programming. Yes, there is an exact DP for TSP. A common formulation uses states like `(S, j)`, meaning the length of the shortest path that starts at a fixed source, visits every city in subset `S`, and ends at city `j`.

That is far better than checking all permutations, but it is still exponential because subsets are part of the state. TSP teaches an important boundary lesson: a clever recurrence can reduce brute force substantially and still remain intractable at large scale.

### Greedy Algorithms and Proof Patterns

A **greedy algorithm** makes the locally best choice according to some rule and never revisits that choice. When greed works, the algorithm is often extremely elegant. When greed fails, it usually fails because the local choice blocks a better future configuration.

The real challenge is not inventing a plausible greedy rule. It is proving that the rule is safe. Common proof styles include:

- **exchange arguments**, where any optimal solution can be transformed to agree with the greedy step,
- **stays-ahead arguments**, where the greedy partial solution is never worse than any competitor at the same stage,
- **cut or frontier arguments**, common in MSTs and shortest-path settings, where the current boundary identifies a safe next choice.

This is why greedy algorithms feel different from dynamic programming. DP says "store all the structurally relevant choices and compare them." Greedy says "there is one structurally safe choice right now, and a proof says we lose nothing by committing to it immediately."

### Huffman Coding

**Huffman coding** is one of the best examples of successful greedy design. Given symbol frequencies, we want a prefix code with minimum expected codeword length.

The algorithm repeatedly merges the two least frequent symbols or subtrees:

1. place all symbols in a min-priority queue by frequency,
2. remove the two minimum elements,
3. combine them into a new node with summed weight,
4. reinsert the new node,
5. continue until one tree remains.

Why is this greedy step correct? Because in an optimal prefix code, the two least frequent symbols can be placed as deepest siblings without increasing the total cost. Once that structural fact is established, merging them first is safe.

This is a good model for greedy thinking in general. The local rule is not justified by intuition alone. It is justified by a theorem about the structure of optimal solutions.

### Euclidean Algorithm

The **Euclidean algorithm** computes the greatest common divisor by repeated remainder reduction:

```text
gcd(a, b):
  while b != 0:
    (a, b) = (b, a mod b)
  return a
```

Its correctness rests on the invariant

$$
gcd(a,b) = gcd(b, a \bmod b),
$$

because subtracting multiples of `b` from `a` does not change the set of common divisors. The algorithm also has a natural shrinking measure: the second argument strictly decreases until it reaches zero.

This is one of the cleanest examples of a strong algorithmic pattern:

- preserve equivalence of the problem at every step,
- reduce a well-founded measure,
- stop when the base case is trivial.

### A Compact Reference Map

| Problem | Main Idea | Main Lesson |
|---|---|---|
| Euclidean Algorithm | repeated remainder reduction | shrinking measure + invariant |
| Huffman Coding | greedy tree construction | local choice needs proof |
| LCS | DP over two indices | cache overlapping subproblems |
| 0/1 Knapsack | DP over prefix and capacity | local best item is not enough |
| Weighted Independent Set | include/exclude recurrence | structural constraints drive state |
| Traveling Salesman | subset DP | even good DP can stay exponential |

## 9. Time Complexity and Choosing the Right Tool

Complexity analysis is not a final chapter. It is the language that lets us compare competing designs honestly.

A practical selection table looks like this:

| Problem | Usual Structure | Typical Choice |
|---|---|---|
| random indexed access | array | array or dynamic array |
| stack behavior | stack | array-backed stack |
| FIFO processing | queue | circular queue or linked queue |
| average-case fast dictionary lookup | hash map | hash table |
| ordered dictionary and range queries | balanced BST | AVL or red-black tree |
| unweighted shortest path | graph | BFS |
| shortest path with nonnegative weights | graph | Dijkstra |
| shortest path with negative edges | graph | Bellman-Ford |
| all-pairs shortest paths on moderate dense graph | graph | Floyd-Warshall |
| minimum connection cost | graph | Prim or Kruskal |
| capacity-constrained routing | flow network | Ford-Fulkerson / Edmonds-Karp |
| overlapping subproblems | table or state DAG | memoization or tabulation |
| provably safe local optimization | greedy structure | greedy algorithm |

The hardest part of DSA is often classification, not coding. We look at a problem and ask whether it is really:

- search over ordered data,
- graph reachability,
- shortest path,
- minimum cut or flow,
- greedy scheduling,
- dynamic programming over prefixes, subsets, or indices,
- direct access through hashing,
- ordered search through a balanced tree.

That classification step turns a long list of topics into engineering judgment.

One final caution: asymptotic notation hides constants, memory behavior, and implementation overhead. That does not make asymptotics unimportant. It means asymptotics must be combined with workload knowledge. Insertion sort can beat merge sort on tiny arrays. Hash maps can beat trees for point lookups but lose ordered operations. Floyd-Warshall is asymptotically worse than repeated Dijkstra on sparse graphs, but it is simple and often ideal for dense graphs or for teaching the DP viewpoint on graph problems.

## 10. Sources

Primary source pages used for the topic map and lecture structure:

- W3Schools DSA index: [https://www.w3schools.com/dsa/](https://www.w3schools.com/dsa/)
- W3Schools simple algorithm page: [https://www.w3schools.com/dsa/dsa_algo_simple.php](https://www.w3schools.com/dsa/dsa_algo_simple.php)
- Stanford CS161 lecture index: [https://cs161-stanford.github.io/lectures/](https://cs161-stanford.github.io/lectures/)

The explanations in this post are synthesized notes rather than direct quotations from those sources.
