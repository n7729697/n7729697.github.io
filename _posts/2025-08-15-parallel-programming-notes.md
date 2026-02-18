---
title: Parallel Programming Notes (OpenMP, MPI, CUDA)
tags: [parallel computing, OpenMP, MPI, CUDA, GPU]
style: fill
color: dark
description: Personal notes from a full parallel programming lecture sequence, from performance basics to distributed memory and CUDA.
---

Source: Slides in `/mnt/d/OneDrive - Uppsala universitet/UU/并行计算` (lecture01_2025 to lecture13_2025).

## 1. Big Picture

Parallel performance is constrained by three coupled factors:

1. **Algorithmic parallelism** (how much work can be done concurrently),
2. **Data movement** (memory hierarchy and communication cost),
3. **Synchronization overhead** (dependencies and coordination).

A practical workflow is:

- optimize serial locality first,
- scale on shared memory (OpenMP),
- scale across nodes (MPI),
- offload data-parallel kernels (CUDA/GPU).

---

## 2. Performance Metrics and Limits

Let $T_s$ be best serial time and $T_p$ parallel time on $p$ processors:

$$
S_p = \frac{T_s}{T_p}, \qquad E_p = \frac{S_p}{p}.
$$

Amdahl-style bound with serial fraction $f$:

$$
S_p \le \frac{1}{f + \frac{1-f}{p}}.
$$

Implications:

- even small serial sections cap scalability,
- communication and synchronization often increase effective serial fraction,
- weak scaling and strong scaling should both be measured.

---

## 3. Memory Hierarchy and Locality

Slides emphasize that many programs run far below peak because of memory bottlenecks.

Hierarchy: registers -> L1/L2/L3 cache -> DRAM -> secondary storage.

Optimization principles:

- exploit **temporal locality** (reuse loaded data),
- exploit **spatial locality** (contiguous access),
- increase computational intensity (FLOPs per byte moved),
- use blocking/tiling and loop unrolling where appropriate.

For matrix multiplication, naive loops are often bandwidth-limited. Blocking raises cache reuse and moves performance toward compute-bound behavior.

---

## 4. Shared-Memory Parallelism (OpenMP)

### 4.1 Execution model

OpenMP provides directive-based multithreading with shared variables and private thread-local variables.

Core constructs:

- `parallel`, `for`, `single`, `sections`, `task`,
- synchronization: `critical`, `atomic`, `barrier`,
- reductions via `reduction(...)` clause.

### 4.2 Scheduling

`for` schedules control iteration distribution:

- `static[,chunk]`: predictable, low runtime overhead,
- `dynamic[,chunk]`: better for load imbalance, higher scheduling overhead.

### 4.3 Dependency considerations

- instruction-level dependencies,
- loop-carried dependencies,
- reduction patterns (sum/min/max),
- scan/prefix operations (parallel but requires staged synchronization).

---

## 5. Distributed-Memory Parallelism (MPI)

### 5.1 Model

Each process has private memory; explicit communication is required.

Design steps:

1. partition data,
2. assign work,
3. design communication pattern,
4. minimize communication volume + synchronization.

### 5.2 Point-to-point and nonblocking

- blocking: `MPI_Send`, `MPI_Recv`,
- combined exchange: `MPI_Sendrecv`,
- nonblocking: `MPI_Isend`, `MPI_Irecv` + completion calls.

Nonblocking communication allows overlap of communication and computation when dependencies permit.

### 5.3 Collectives and data movement

Collectives structure frequent communication motifs; derived datatypes reduce manual packing/unpacking for non-contiguous data.

---

## 6. Parallel Dense Linear Algebra Case Study: GEPP

Gaussian Elimination with Partial Pivoting (GEPP):

$$
PA = LU.
$$

Partial pivoting improves practical numerical stability by selecting large column pivots.

Performance issue: naive elimination relies heavily on BLAS-1/2 operations; modern hardware favors BLAS-3.

Key optimization from slides:

- **blocked GEPP** with delayed updates,
- accumulate rank-1 updates and apply as matrix-matrix operations,
- choose block size to balance cache fit and BLAS-3 efficiency.

This is the recurring HPC theme: reformulate for higher arithmetic intensity.

---

## 7. CUDA Programming Fundamentals

### 7.1 Host-device model

CUDA applications split into:

- host code (CPU, orchestration + memory management),
- device kernels (GPU, massive data-parallel execution).

Kernel launch:

```cpp
Kernel<<<numBlocks, blockSize>>>(...);
```

### 7.2 Thread organization and SIMT

Threads are grouped into blocks; blocks form a grid. Mapping 1D/2D problems to grid/block geometry is central for performance and correctness.

### 7.3 Memory behavior

Global DRAM bandwidth is often limiting. Performance requires:

- coalesced global memory access,
- shared-memory tiling,
- minimizing redundant loads,
- avoiding unnecessary synchronization/divergence.

---

## 8. CUDA Patterns: Reduction, Histogram, Matrix Multiplication

### 8.1 Reduction

Reduction (sum/max/min) is associative pattern:

- partition input,
- local partial reductions,
- tree-style combine.

Parallel reduction gives $O(\log n)$ depth with enough threads.

### 8.2 Histogram

Histogram updates can create high contention.

Techniques in slides:

- atomic updates (global/shared memory),
- privatization (per-block local bins + merge),
- partitioning strategy tradeoffs.

### 8.3 Matrix multiplication on GPU

Naive kernel performs many global reads and is memory-bound. Tiled shared-memory kernel reuses subblocks and greatly reduces DRAM traffic.

---

## 9. Parallelism for ML Workloads

Final lecture links to feedforward neural networks and logistic regression training.

Core kernels:

- matrix multiplication,
- elementwise activation,
- reduction operations in loss/gradient calculations.

Training loop relies on forward + backward propagation; GPU/TPU acceleration is effective because these operations are high-throughput linear algebra primitives.

---

## 10. Design Checklist (Practical)

1. Start from correctness and dependency graph.
2. Quantify baseline (`T_s`, bandwidth, cache misses).
3. Increase locality before increasing thread/process count.
4. For OpenMP: choose schedule based on load variance.
5. For MPI: reduce communication frequency/volume and overlap where possible.
6. For CUDA: coalesce access, use shared memory tiling, minimize atomics contention.
7. Validate speedup with both runtime and efficiency, not runtime alone.

---

## 11. Compact Formula Sheet

- Speedup: $S_p=T_s/T_p$.
- Efficiency: $E_p=S_p/p$.
- Amdahl bound: $S_p\le1/(f+(1-f)/p)$.
- GEPP factorization: $PA=LU$.
- Typical matrix multiply work: $O(n^3)$ compute, but performance depends on data movement.

These notes are meant as a concise technical map from multicore CPU programming to distributed computing and GPU acceleration.
