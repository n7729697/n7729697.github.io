---
title: Parallel Programming Notes (OpenMP, MPI, CUDA)
tags: [parallel computing, OpenMP, MPI, CUDA, GPU]
style: fill
color: light
description: Personal notes from a full parallel programming lecture sequence, from performance basics to distributed memory and CUDA.
---

_This note is adapted from course materials for **1TD070 Parallel and Distributed Programming** at **Uppsala University**. Instructor: course teaching staff._

## Central Question

Parallel programming asks: **where is the time really going, and can work be reorganized so processors spend less time waiting?**

Performance is shaped by three constraints:

- available parallelism,
- data movement through memory and networks,
- synchronization and dependency overhead.

Adding threads is rarely the first fix. A good workflow is: make the serial code clear, improve locality, expose parallelism, choose the memory model, then measure scaling.

{% include figure.html image="/assets/img/posts/parallel-programming/parallel-performance-triangle.svg" alt="Triangle connecting algorithmic parallelism, data movement, and synchronization overhead." caption="Parallel speed comes from balancing three forces: independent work, data locality, and coordination cost." %}

## 1. Speedup, Efficiency, and Scaling Limits

If $T_s$ is the best serial time and $T_p$ the time on $p$ processing units, then

$$
S_p=\frac{T_s}{T_p},\qquad E_p=\frac{S_p}{p}.
$$

Amdahl's law shows the strong-scaling ceiling:

$$
S_p\le \frac{1}{f+\frac{1-f}{p}},
$$

where $f$ is the serial fraction. In practice, communication, synchronization, cache misses, and load imbalance increase the effective serial fraction.

Strong scaling fixes problem size and increases processors. Weak scaling grows problem size with processor count. Both are needed: strong scaling reveals overhead, while weak scaling reveals whether the method can handle larger problems.

## 2. Memory Hierarchy and Locality

Most programs do not run near peak floating-point throughput because data movement is the bottleneck. The hierarchy is registers, cache, DRAM, node memory, network, and storage.

Performance improves when code increases:

- temporal locality: reuse data soon,
- spatial locality: access contiguous data,
- arithmetic intensity: more work per byte moved.

Matrix multiplication illustrates the principle. The naive algorithm performs $O(n^3)$ arithmetic, but poor loop order and cache reuse can make it memory-bound. Blocking or tiling reuses submatrices and shifts work toward compute-bound behavior.

{% include figure.html image="/assets/img/posts/parallel-programming/memory-hierarchy-roofline.svg" alt="Memory hierarchy and roofline-like relationship between arithmetic intensity and achievable performance." caption="Locality optimization raises arithmetic intensity, often unlocking more performance than simply adding parallel workers." %}

## 3. Shared Memory with OpenMP

OpenMP uses directives to express parallel regions over shared memory. Core constructs include `parallel`, `for`, `single`, `sections`, `task`, `critical`, `atomic`, `barrier`, and `reduction`.

Scheduling controls iteration distribution:

- `static` is predictable and low overhead,
- `dynamic` helps load imbalance but costs more,
- chunk size trades scheduling overhead against balance.

The key correctness question is dependence. Independent loop iterations parallelize directly. Reductions require structured combination. Prefix scans and loop-carried dependencies require algorithmic restructuring.

{% include figure.html image="/assets/img/posts/parallel-programming/openmp-dependency-scheduling.svg" alt="OpenMP loop scheduling and dependency patterns including independent work, reduction, and loop-carried dependence." caption="OpenMP performance depends on both scheduling and dependence structure; not every loop is parallel just because it has many iterations." %}

## 4. Distributed Memory with MPI

MPI assumes each process has private memory. Communication is explicit, so design begins with data partitioning.

A distributed algorithm should specify:

1. domain decomposition,
2. local computation,
3. halo or neighbor exchange,
4. collective communication,
5. load-balance strategy.

Point-to-point communication uses send and receive calls. Nonblocking communication can overlap data transfer with useful computation if dependencies allow. Collectives express common patterns such as broadcast, scatter, gather, reduce, and all-reduce.

The central cost model is that communication has latency and bandwidth terms. Fewer, larger messages often beat many tiny messages, but memory pressure and overlap opportunities matter.

{% include figure.html image="/assets/img/posts/parallel-programming/mpi-domain-decomposition.svg" alt="MPI domain decomposition with local subdomains, halo exchange, and collective reduction." caption="MPI scalability comes from decomposing data so most work is local and communication is structured, sparse, and overlappable." %}

## 5. GPU Programming with CUDA

CUDA separates host orchestration from device kernels:

```cpp
Kernel<<<numBlocks, blockSize>>>(...);
```

Threads form blocks, blocks form a grid, and warps execute in SIMT fashion. GPUs reward regular data-parallel work and punish divergence, irregular memory access, and excessive synchronization.

Important patterns include:

- coalesced global memory access,
- shared-memory tiling,
- reductions through tree-style combination,
- histogram privatization to reduce atomic contention,
- occupancy balanced against register and shared-memory usage.

For matrix multiplication, a tiled kernel loads subblocks into shared memory and reuses them across many multiply-adds. This reduces global memory traffic and is the same locality story as CPU blocking, but expressed in GPU memory hierarchy.

{% include figure.html image="/assets/img/posts/parallel-programming/cuda-grid-memory-tiling.svg" alt="CUDA grid of thread blocks loading tiles from global memory into shared memory for matrix multiplication." caption="CUDA performance usually comes from mapping data-parallel work onto grids while staging reused data through shared memory." %}

## 6. Case Study: Gaussian Elimination and Dense Linear Algebra

Gaussian elimination with partial pivoting computes

$$
PA=LU.
$$

Naive elimination uses many low-intensity vector operations. Modern dense linear algebra reorganizes work into blocked updates so most time is spent in matrix-matrix operations. This is the BLAS-3 lesson:

- expose large regular kernels,
- reuse cache-resident panels,
- delay updates until they can be batched,
- tune block size to hardware.

The same idea appears in neural-network training, where matrix multiplication, elementwise maps, and reductions dominate forward and backward propagation.

## What This Framework Lets Us Do

Parallel programming gives a practical path from multicore CPUs to distributed clusters and GPUs. It turns performance work into an evidence-driven process: dependency analysis, locality improvement, memory-model choice, and scaling measurement.

## Where the Framework Stops Being Reliable

Benchmarks can mislead if problem size, NUMA placement, I/O, network contention, compiler flags, or warm-up behavior are uncontrolled. Race conditions and nondeterministic reductions can also make "fast" code scientifically wrong.

## Where the Subject Leads Next

The next steps are performance modeling, roofline analysis, task runtimes, hybrid MPI+OpenMP, GPU collectives, distributed deep learning, and reproducible high-performance computing.

## Technical and Editorial Audit

- Rewrote the note around performance causality rather than API listing.
- Preserved the 1TD070 Uppsala University course attribution in the main text.
- Added original figures for performance limits, memory hierarchy, OpenMP scheduling, MPI decomposition, and CUDA tiling.
- Kept key formulas for speedup, efficiency, Amdahl's law, and GEPP.
- Hardware-specific optimization choices should be verified on the target machine with profiling.

## Main Sources Used in This Note

- Uppsala University 1TD070 course materials.
- J. L. Hennessy and D. A. Patterson, _Computer Architecture: A Quantitative Approach_.
- M. J. Quinn, _Parallel Programming in C with MPI and OpenMP_.
- D. B. Kirk and W. W. Hwu, _Programming Massively Parallel Processors_.
