---
title: Parallel Programming Notes (OpenMP, MPI, CUDA)
tags: [parallel computing, OpenMP, MPI, CUDA, GPU]
style: fill
color: light
description: Course notes for parallel and distributed programming, built up from summing an array in parallel to performance laws, the memory hierarchy and roofline model, threads and data races, OpenMP, MPI and domain decomposition, CUDA kernels for reduction, histograms, and tiled matrix multiplication, and parallel Gaussian elimination, with tested code and measured examples.
---

_These notes are adapted from course materials for **1TD070 Parallel and Distributed Programming** at **Uppsala University**, with the theory filled in from Hennessy and Patterson's "Computer Architecture: A Quantitative Approach", Pacheco's "An Introduction to Parallel Programming", and Kirk and Hwu's "Programming Massively Parallel Processors". The OpenMP examples were compiled with `gcc -fopenmp` and run; timings quoted are from a desktop machine and are only meant to show orders of magnitude._

## How to Read These Notes

Parallel programming asks one question: **where is the time really going, and can the work be reorganized so that processors spend less time waiting?** The usual first instinct, "add more threads", is rarely the first fix. Performance is shaped by three forces:

1. **available parallelism**: how much work can run at the same time;
2. **data movement**: through caches, memory, and networks;
3. **coordination**: synchronization, communication, and load imbalance.

{% include figure.html image="/assets/img/posts/parallel-programming/parallel-performance-triangle.svg" alt="Triangle connecting algorithmic parallelism, data movement, and synchronization overhead." caption="Parallel speed comes from balancing three forces: independent work, data locality, and coordination cost." %}

The notes follow the course's path from a single core to a GPU, and use one tiny problem, **summing an array**, as a thread running through every programming model. Each section ends with what to remember.

| Section | Topic | Programming model |
|---|---|---|
| 1 | Why parallel, and a first parallel sum | - |
| 2 | Measuring performance: speedup, Amdahl, Gustafson, work-span | - |
| 3 | Memory hierarchy, locality, roofline | serial C |
| 4 | Threads, races, and synchronization | shared memory |
| 5 | OpenMP | shared memory |
| 6 | MPI | distributed memory |
| 7 | CUDA | GPU |
| 8 | Case study: parallel Gaussian elimination | all |
| 9 | Machine learning workloads | GPU |
| 10 | Methodology and checklist | - |

## 1. Why Parallel, and a First Parallel Sum

### 1.1 The End of Free Speedups

For decades, programs got faster without changes because clock frequencies rose. Around 2005 that stopped. Dynamic power in a chip scales roughly like

$$
P\propto C\,V^2f,
$$

(capacitance, voltage squared, frequency), and voltage could no longer be lowered with each new transistor generation (the end of **Dennard scaling**). Raising $f$ further would melt the chip. Transistor counts kept growing (Moore's law), so manufacturers spent them on **more cores**, wider vector units, and GPUs. Since then, a program that does not run in parallel uses a shrinking fraction of the machine.

### 1.2 Kinds of Parallel Hardware

Flynn's taxonomy classifies machines by instruction and data streams:

| Class | Meaning | Example |
|---|---|---|
| SISD | one instruction stream, one data stream | a classic single core |
| SIMD | one instruction applied to many data | CPU vector units (AVX), GPU warps |
| MIMD | independent instruction streams | multicore CPUs, clusters |

A second, more practical distinction is about memory:

- **Shared memory**: all cores see one address space (a multicore laptop). Communication is implicit, through loads and stores. Programming models: threads, OpenMP.
- **Distributed memory**: each node has its own memory (a cluster). Communication is explicit, through messages. Programming model: MPI.
- **Accelerators**: a GPU with its own memory and thousands of lightweight threads. Programming model: CUDA.

### 1.3 Summing an Array: The Running Example

Serially, $s=\sum_{i=0}^{n-1}a_i$ is a loop with $n-1$ additions, each depending on the previous one. To parallelize it, use the fact that addition is **associative**: split the array into $p$ chunks, let each worker sum its chunk, then combine the $p$ partial sums. Combining can itself be done in parallel as a binary tree: pairs of partial sums are added, then pairs of those, and so on, in $\log_2p$ rounds.

This pattern, a **reduction**, will appear in every programming model below: as `reduction(+:sum)` in OpenMP, `MPI_Allreduce` in MPI, and a shared-memory tree in CUDA. Two lessons are already visible:

- Parallelism came from an algebraic property (associativity), not from the loop syntax.
- Floating-point addition is *not exactly* associative, so a parallel sum may differ from the serial one in the last bits, and may differ between runs. Bitwise reproducibility needs extra care.

### What to Remember

- Clock speed stopped growing; core counts did. Parallelism is how modern hardware is used.
- Shared memory (threads, OpenMP), distributed memory (MPI), accelerators (CUDA).
- Reductions parallelize because the operation is associative.

## 2. Measuring Performance

### 2.1 Speedup and Efficiency

Let $T_1$ be the time of the **best serial** program (not the parallel program run on one core, which may carry overhead) and $T_p$ the time on $p$ processing units. Then

$$
S_p=\frac{T_1}{T_p},\qquad E_p=\frac{S_p}{p}.
$$

Ideal ("linear") speedup is $S_p=p$, i.e. $E_p=1$. Efficiency below 1 measures overhead: idle time, communication, synchronization, redundant work.

### 2.2 Amdahl's Law: Strong Scaling

Suppose a fraction $f$ of the serial run time cannot be parallelized. Even with infinitely many processors the time is at least $fT_1$, and with $p$ processors at best

$$
T_p=fT_1+\frac{(1-f)T_1}{p}\quad\Longrightarrow\quad S_p\le\frac{1}{f+\frac{1-f}{p}}\ \xrightarrow{p\to\infty}\ \frac1f.
$$

**Worked example.** With $f=5\%$:

| $p$ | $S_p$ bound | Efficiency |
|---|---|---|
| 8 | $1/(0.05+0.95/8)=5.9$ | 74% |
| 64 | $1/(0.05+0.95/64)=15.4$ | 24% |
| $\infty$ | 20 | 0% |

A program that is 95% parallel can never run more than 20 times faster. And in practice, communication and synchronization *grow* with $p$, so the effective serial fraction increases as you scale. Amdahl's law describes **strong scaling**: a fixed problem, more processors.

### 2.3 Gustafson's Law: Weak Scaling

Amdahl's assumption of a fixed problem is often unrealistic: with a bigger machine we solve a bigger problem. If the parallel part grows with $p$ while the serial part stays fixed, and $f$ is the serial fraction measured *on the parallel machine*, the **scaled speedup** is

$$
S_p=p-f\,(p-1).
$$

With $f=5\%$ and $p=64$, $S_p=64-0.05\cdot63\approx60.9$. **Weak scaling** (problem size grows with $p$, time per processor fixed) answers "can we solve bigger problems in the same time?", while strong scaling answers "can we solve this problem faster?". A good performance study reports both.

### 2.4 The Karp-Flatt Metric

Given a measured speedup, the **experimentally determined serial fraction** is

$$
e=\frac{1/S_p-1/p}{1-1/p}.
$$

If you measure $S_8=6$, then $e=(1/6-1/8)/(1-1/8)\approx0.048$. Computing $e$ for several $p$ is diagnostic: if $e$ stays constant, the limit is genuinely serial work; if $e$ grows with $p$, overhead (communication, synchronization) is growing.

### 2.5 The Work-Span Model

For algorithms rather than programs, describe the computation as a dependency graph (a DAG). Two numbers characterize it:

- **work** $T_1$: total number of operations (time on one processor);
- **span** $T_\infty$: length of the longest dependency chain (time on infinitely many processors).

Their ratio $T_1/T_\infty$ is the **parallelism**: the maximum useful number of processors. **Brent's theorem** says a greedy scheduler achieves

$$
T_p\le\frac{T_1}{p}+T_\infty.
$$

**The sum again.** The serial loop has work $n-1$ and span $n-1$: no parallelism. The tree reduction has the same work $n-1$ but span $\log_2n$. For $n=10^6$, the parallelism is about $10^6/20=50{,}000$. Restructuring the dependency graph, not adding threads, created the parallelism.

### What to Remember

- Speedup against the best serial code; efficiency = speedup per processor.
- Amdahl: serial fraction $f$ caps speedup at $1/f$ (strong scaling). Gustafson: bigger machines solve bigger problems (weak scaling).
- Karp-Flatt diagnoses whether overhead grows with $p$.
- Work and span: parallelism $=T_1/T_\infty$; Brent: $T_p\le T_1/p+T_\infty$.

## 3. The Memory Hierarchy and Locality

### 3.1 The Memory Wall

Arithmetic is cheap; moving data is expensive. A modern core can do several floating-point operations per nanosecond, while a load from main memory takes on the order of 100 ns. Caches bridge the gap:

| Level | Typical size | Typical latency |
|---|---|---|
| registers | a few hundred bytes | < 1 ns |
| L1 cache | tens of KB per core | ~1 ns |
| L2 cache | hundreds of KB to a few MB per core | a few ns |
| L3 cache | tens of MB, shared | ~10-20 ns |
| DRAM | GBs | ~50-100 ns |
| another node (network) | - | ~1-10 μs |

Data moves between levels in **cache lines** (typically 64 bytes). Caches pay off when programs have:

- **temporal locality**: data used once is used again soon;
- **spatial locality**: after using one address, nearby addresses are used next (the rest of the cache line comes for free).

### 3.2 Loop Order Matters: A Measured Example

C stores 2D arrays **row-major**: `A[i][j]` and `A[i][j+1]` are adjacent. Consider matrix multiplication with $n=1024$:

```c
/* ijk: inner loop walks down a column of B (stride n) */
for (int i = 0; i < N; i++)
    for (int j = 0; j < N; j++)
        for (int k = 0; k < N; k++)
            C[i][j] += A[i][k] * B[k][j];

/* ikj: inner loop walks along rows of B and C (stride 1) */
for (int i = 0; i < N; i++)
    for (int k = 0; k < N; k++) {
        double aik = A[i][k];
        for (int j = 0; j < N; j++)
            C[i][j] += aik * B[k][j];
    }
```

Both perform exactly the same $2n^3$ floating-point operations. On my machine (gcc `-O2`) the `ijk` version took **2.78 s** and the `ikj` version **0.39 s**, a factor of 7 from loop order alone. In `ijk`, each step of the inner loop jumps $n\times8$ bytes through `B`, touching a new cache line every time; in `ikj`, the inner loop streams through contiguous memory, uses every byte of each cache line, and lets the compiler vectorize.

### 3.3 Blocking (Tiling)

Even with good loop order, large matrices do not fit in cache, so rows of `B` are evicted before they are reused. **Blocking** splits the matrices into $b\times b$ tiles small enough that three tiles fit in cache, and multiplies tile by tile:

```c
for (int ii = 0; ii < N; ii += BS)
  for (int kk = 0; kk < N; kk += BS)
    for (int jj = 0; jj < N; jj += BS)
      /* multiply tile A[ii.., kk..] by tile B[kk.., jj..] into C[ii.., jj..] */
      for (int i = ii; i < ii + BS; i++)
        for (int k = kk; k < kk + BS; k++) {
          double aik = A[i][k];
          for (int j = jj; j < jj + BS; j++)
            C[i][j] += aik * B[k][j];
        }
```

Each tile is loaded once and used $b$ times. For $b=64$ in double precision, three tiles take 96 KB, which fits comfortably in a typical L2 cache.

### 3.4 Arithmetic Intensity and the Roofline Model

The **arithmetic intensity** of a kernel is

$$
I=\frac{\text{floating-point operations}}{\text{bytes moved to/from memory}}.
$$

A machine has a peak compute rate $P_{\text{peak}}$ (flop/s) and a peak memory bandwidth $B$ (bytes/s). A kernel cannot run faster than either limit, so the attainable performance is

$$
P=\min\big(P_{\text{peak}},\ B\cdot I\big).
$$

Plotted on log-log axes, this is a "roofline": a slanted bandwidth roof for low intensity and a flat compute roof for high intensity. They meet at the **ridge point** $I^\ast=P_{\text{peak}}/B$.

**Worked example.** A CPU with $P_{\text{peak}}=200$ GFLOP/s and $B=50$ GB/s has ridge point $I^\ast=4$ flop/byte.

- **daxpy**, $y\leftarrow\alpha x+y$: 2 flops per element; reads $x_i$ and $y_i$ and writes $y_i$, 24 bytes. $I=2/24\approx0.083$, so $P\le50\times0.083\approx4.2$ GFLOP/s, about **2% of peak**. No amount of threading changes that; it is memory-bound.
- **Blocked matrix multiply** with $b\times b$ tiles: about $2b^3$ flops per $2b^2$ doubles loaded ($16b^2$ bytes), so $I\approx b/8$. With $b=64$, $I\approx8>I^\ast$: **compute-bound**, able to approach peak.

{% include figure.html image="/assets/img/posts/parallel-programming/memory-hierarchy-roofline.svg" alt="Memory hierarchy and roofline-like relationship between arithmetic intensity and achievable performance." caption="Locality optimization raises arithmetic intensity, often unlocking more performance than simply adding parallel workers." %}

The roofline tells you which optimization to try. Below the ridge, reduce data movement (blocking, fusion of loops, smaller data types). Above it, increase parallelism and vectorization.

### What to Remember

- Data moves in cache lines; exploit spatial and temporal locality.
- Loop order alone gave 7× on matrix multiplication; blocking makes tiles reusable in cache.
- Roofline: $P=\min(P_{\text{peak}},BI)$. Low-intensity kernels are memory-bound regardless of thread count.

## 4. Threads, Data Races, and Synchronization

### 4.1 Threads Share Memory

A **thread** is an independent flow of control within a process. Threads share the process's heap and global variables; each has its own stack and registers. Sharing makes communication cheap (just read the variable) and dangerous (anyone can write it).

### 4.2 A Data Race, Measured

Eight threads each increment a shared counter; together they perform ten million increments:

```c
long counter = 0;
#pragma omp parallel for
for (long i = 0; i < 10000000; i++)
    counter++;                 /* data race! */
printf("%ld\n", counter);
```

Compiled without optimization, a run printed **1,850,945** instead of 10,000,000. The statement `counter++` is three operations: load, add, store. Two threads can load the same old value, both add one, and both store, losing an increment:

```text
thread A: load counter (= 41)
thread B: load counter (= 41)
thread A: store 42
thread B: store 42            <- one increment lost
```

A **data race** is two threads accessing the same memory location concurrently, at least one writing, without synchronization. In C and C++, a data race is *undefined behaviour*: the program may print a wrong number, the right number (with optimization, the compiler happened to hoist the increments and the bug hid), or anything else. Races are the classic shared-memory bug because they are intermittent and timing-dependent.

### 4.3 Synchronization Tools

- **Mutex / critical section**: only one thread at a time executes the protected code. Correct, but serializes, and contended locks are slow.
- **Atomic operations**: hardware-supported indivisible read-modify-write (`atomic` increment, compare-and-swap). Much cheaper than locks for single variables, still a serialization point under heavy contention.
- **Barriers**: every thread waits until all have arrived.
- **Privatization + reduction**: each thread accumulates into its own private variable; combine once at the end. This removes the contention entirely and is usually the best fix.

Locks also bring their own hazards: **deadlock** (two threads each hold a lock the other needs; prevent by acquiring locks in a global order), **priority inversion**, and **convoying**.

### 4.4 False Sharing

Even *without* a logical race, threads can slow each other down. Suppose each thread increments its own counter, but the counters are adjacent in an array:

```c
long count[NTHREADS];          /* count[0..7] share one 64-byte cache line */
#pragma omp parallel
{
    int id = omp_get_thread_num();
    for (long i = 0; i < ITERS; i++)
        count[id]++;
}
```

The cache-coherence protocol works on whole cache lines. Every write by one core invalidates the line in the other cores' caches, so the line ping-pongs between cores even though no data is actually shared. This is **false sharing**. Fixes: pad each counter to its own cache line, or (better) accumulate in a local variable and write once at the end. How much false sharing costs depends strongly on the hardware; on some machines it makes the loop several times slower, on others the effect is modest, which is exactly why it is easy to miss without measuring.

### What to Remember

- A data race (concurrent access, one write, no synchronization) is undefined behaviour; `counter++` lost 80% of its increments.
- Prefer privatization and reduction over locks; use atomics for single updates.
- False sharing: independent data on the same cache line still causes coherence traffic.

## 5. Shared-Memory Programming with OpenMP

### 5.1 The Fork-Join Model

OpenMP adds parallelism to C, C++, and Fortran through compiler directives. A program starts with one thread; at a `parallel` region it **forks** a team of threads, and at the end of the region they **join**:

```c
#include <omp.h>
#include <stdio.h>

int main(void) {
    #pragma omp parallel
    {
        int id = omp_get_thread_num();
        int p  = omp_get_num_threads();
        printf("hello from thread %d of %d\n", id, p);
    }
    return 0;
}
```

Compile with `gcc -fopenmp` and set the team size with the environment variable `OMP_NUM_THREADS`. Without `-fopenmp`, the pragmas are ignored and the program is a valid serial program, a useful property for incremental parallelization.

### 5.2 Data-Sharing Clauses

Every variable in a parallel region is either **shared** (one copy, visible to all threads) or **private** (one copy per thread). Defaults: variables declared outside the region are shared; variables declared inside, and loop indices of work-shared loops, are private. Clauses override this:

| Clause | Meaning |
|---|---|
| `shared(x)` | one copy of `x` for the whole team |
| `private(x)` | each thread gets an uninitialized copy |
| `firstprivate(x)` | private copy initialized from the value before the region |
| `reduction(op:x)` | private copies, combined with `op` at the end |
| `default(none)` | force the programmer to declare every variable (recommended while learning) |

Most OpenMP bugs are data-sharing bugs. `default(none)` turns them into compile errors.

### 5.3 Computing π: Three Versions

The integral $\int_0^1\frac{4}{1+x^2}dx=\pi$ is approximated with the midpoint rule. The correct, fast version uses a reduction:

```c
const long n = 100000000;
const double h = 1.0 / n;
double sum = 0.0;

#pragma omp parallel for reduction(+:sum)
for (long i = 0; i < n; i++) {
    double x = (i + 0.5) * h;
    sum += 4.0 / (1.0 + x * x);
}
printf("pi ~ %.12f\n", sum * h);   /* prints 3.141592653590 */
```

The two wrong turns are instructive. Without `reduction`, `sum` is shared and the update races (section 4.2). With `#pragma omp critical` around the update, the answer is correct but every iteration takes a lock, so the "parallel" loop runs slower than the serial one. The reduction gives each thread a private `sum`, and combines the $p$ partial sums once at the end: the parallel sum of section 1.3.

### 5.4 Work Sharing and Scheduling

`#pragma omp for` divides loop iterations among threads. The `schedule` clause controls how:

- `schedule(static)`: contiguous chunks of equal size, decided in advance. Lowest overhead; best when every iteration costs the same.
- `schedule(static, c)`: chunks of size `c` dealt round-robin (cyclic).
- `schedule(dynamic, c)`: threads grab chunks of `c` iterations from a queue as they finish. Balances uneven work at the cost of scheduling overhead.
- `schedule(guided)`: dynamic with chunk sizes that shrink over time.

**Example: a triangular loop.** In

```c
#pragma omp parallel for schedule(static)
for (int i = 0; i < n; i++)
    for (int j = 0; j < i; j++)
        work(i, j);
```

iteration `i` costs about `i` units, so with a plain static schedule the thread that gets the last block does far more work than the thread that gets the first: with 4 threads, the last quarter of the rows holds about 44% of the work. `schedule(static, 1)` (cyclic) or `schedule(dynamic, 16)` fixes the imbalance.

{% include figure.html image="/assets/img/posts/parallel-programming/openmp-dependency-scheduling.svg" alt="OpenMP loop scheduling and dependency patterns including independent work, reduction, and loop-carried dependence." caption="OpenMP performance depends on both scheduling and dependence structure; not every loop is parallel just because it has many iterations." %}

### 5.5 Dependences: Which Loops Can Be Parallelized?

A loop can be run in parallel only if its iterations are independent. Three kinds of dependence between iterations block naive parallelization:

- **Flow (true) dependence**: iteration $i$ reads what iteration $i-1$ wrote. `a[i] = a[i-1] + b[i]` (a prefix sum).
- **Anti dependence**: iteration $i$ reads what a later iteration overwrites. `a[i] = a[i+1] + 1`. Removable by reading from a copy.
- **Output dependence**: two iterations write the same location. Removable by privatization.

Flow dependences require a different *algorithm*. The prefix sum $s_i=a_0+\cdots+a_i$ looks inherently sequential, but associativity again rescues it: each thread scans its own block, the block totals are scanned (cheap, $p$ numbers), and each thread adds its block's offset.

```c
/* Inclusive prefix sum s[i] = a[0] + ... + a[i], two passes over the data. */
void prefix_sum(const double *a, double *s, long n) {
    double *block_sum = NULL;
    #pragma omp parallel
    {
        int p = omp_get_num_threads();
        int t = omp_get_thread_num();
        #pragma omp single
        block_sum = calloc(p + 1, sizeof(double));
        /* implicit barrier after single: all threads see block_sum */

        long lo = n * t / p, hi = n * (t + 1) / p;
        double run = 0.0;                        /* pass 1: local scan */
        for (long i = lo; i < hi; i++) { run += a[i]; s[i] = run; }
        block_sum[t + 1] = run;

        #pragma omp barrier
        #pragma omp single
        for (int k = 1; k <= p; k++) block_sum[k] += block_sum[k - 1];

        double off = block_sum[t];               /* pass 2: add offset */
        for (long i = lo; i < hi; i++) s[i] += off;
    }
    free(block_sum);
}
```

(Tested against a serial scan on ten million elements: identical.) The parallel version does about twice the work of the serial loop, so it needs at least two or three threads to win. That trade, extra work for less span, is typical of parallel algorithms.

### 5.6 Tasks

Loops are not the only source of parallelism. Recursive and irregular algorithms (tree traversals, divide and conquer) use **tasks**:

```c
void tree_sum(const double *a, long n, double *out) {
    if (n < 100000) {                 /* cutoff: small problems run serially */
        double s = 0.0;
        for (long i = 0; i < n; i++) s += a[i];
        *out = s;
        return;
    }
    double left, right;
    #pragma omp task shared(left)
    tree_sum(a, n / 2, &left);
    #pragma omp task shared(right)
    tree_sum(a + n / 2, n - n / 2, &right);
    #pragma omp taskwait
    *out = left + right;
}

/* called as:
   #pragma omp parallel
   #pragma omp single
   tree_sum(a, n, &total);                                  */
```

The cutoff matters: creating a task costs far more than adding two numbers, so the recursion must stop spawning tasks once the pieces are small.

### What to Remember

- Fork-join regions; work-shared loops; `default(none)` to catch sharing bugs.
- Reductions for accumulations; `critical` serializes.
- Static scheduling for uniform work, dynamic or cyclic for uneven work.
- Loop-carried flow dependences need new algorithms (scan); tasks handle recursion, with a cutoff.

## 6. Distributed-Memory Programming with MPI

### 6.1 The Model

On a cluster, each process has its own private memory. There is no shared variable to race on, and no way to read another process's data except by **sending a message**. MPI (the Message Passing Interface) is the standard library for this. Programs are usually written in **SPMD** style (single program, multiple data): every process runs the same program, distinguishes itself by its **rank**, and works on its own part of the data.

```c
#include <mpi.h>
#include <stdio.h>

int main(int argc, char **argv) {
    MPI_Init(&argc, &argv);
    int rank, size;
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);   /* who am I?       */
    MPI_Comm_size(MPI_COMM_WORLD, &size);   /* how many of us? */
    printf("hello from rank %d of %d\n", rank, size);
    MPI_Finalize();
    return 0;
}
```

Run with `mpirun -np 4 ./hello`. Since memory is private, **designing an MPI program starts with deciding how the data is partitioned.**

### 6.2 Point-to-Point Messages

```c
MPI_Send(buf, count, MPI_DOUBLE, dest, tag, MPI_COMM_WORLD);
MPI_Recv(buf, count, MPI_DOUBLE, source, tag, MPI_COMM_WORLD, &status);
```

A message is matched by communicator, source, and tag. `MPI_Recv` blocks until a matching message has arrived. `MPI_Send` may return as soon as the data is buffered (typical for small messages), *or* it may block until the receiver has started receiving (typical for large messages). Correct programs must work under either behaviour.

**A deadlock that hides.** Two ranks exchange arrays:

```c
/* Both ranks send first, then receive: UNSAFE */
int other = 1 - rank;
MPI_Send(mine,   N, MPI_DOUBLE, other, 0, MPI_COMM_WORLD);
MPI_Recv(theirs, N, MPI_DOUBLE, other, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
```

For small `N` this works, because both sends are buffered. For large `N`, both sends wait for a receive that is never posted: **deadlock**. Three fixes:

1. Order the calls: rank 0 sends then receives, rank 1 receives then sends.
2. Use the combined call `MPI_Sendrecv`, which the library schedules safely.
3. Use **nonblocking** calls `MPI_Isend`/`MPI_Irecv`, which return immediately, followed by `MPI_Waitall`. Between posting and waiting, the process can compute on data that does not depend on the message, **overlapping communication with computation**.

### 6.3 A Cost Model for Messages

The time to send a message of $n$ bytes is modelled as

$$
T(n)=\alpha+\beta n,
$$

with **latency** $\alpha$ (startup cost, about a microsecond on a fast interconnect) and inverse **bandwidth** $\beta$ (about 0.1 ns/byte at 10 GB/s).

**Worked example.** Sending 1000 doubles as 1000 separate messages costs $1000\times(1\,\mu\text{s}+8\times0.1\,\text{ns})\approx1.0$ ms. Sending them as one 8000-byte message costs $1\,\mu\text{s}+0.8\,\mu\text{s}=1.8\,\mu$s. **Aggregate small messages**: latency dominates them.

### 6.4 Collective Operations

Common communication patterns have dedicated, optimized calls:

| Collective | Effect | Typical cost (tree/ring algorithms) |
|---|---|---|
| `MPI_Bcast` | root sends the same data to all | $\log_2p\,(\alpha+\beta n)$ |
| `MPI_Scatter` / `MPI_Gather` | distribute / collect pieces | $\log_2p\,\alpha+\beta n$ (for total size $n$) |
| `MPI_Reduce` | combine values with an operation, result at root | $\log_2p\,(\alpha+\beta n)$ |
| `MPI_Allreduce` | reduce, result at every rank | ring: $2(p-1)\alpha+2\frac{p-1}{p}\beta n$ |
| `MPI_Alltoall` | every rank sends a distinct piece to every other | the most expensive |
| `MPI_Barrier` | synchronize | $\log_2p\,\alpha$ |

Our running example becomes one line: each rank sums its local part, then

```c
double local = 0.0, total;
for (int i = 0; i < n_local; i++) local += a[i];
MPI_Allreduce(&local, &total, 1, MPI_DOUBLE, MPI_SUM, MPI_COMM_WORLD);
```

Always prefer a collective to a hand-written loop of sends: the library knows the network topology and uses tree, ring, or recursive-doubling algorithms.

### 6.5 Domain Decomposition and Halo Exchange

Most scientific codes update each grid point from its neighbours (a **stencil**). Partition the grid among processes; each process then needs a layer of values owned by its neighbours, its **halo** or **ghost cells**, before each update.

**1D example: Jacobi iteration for $$-u''=f$$.** Each rank owns `n_local` interior points plus two ghost cells, `u[0]` and `u[n_local+1]`:

```c
int left  = (rank > 0)        ? rank - 1 : MPI_PROC_NULL;
int right = (rank < size - 1) ? rank + 1 : MPI_PROC_NULL;

for (int iter = 0; iter < max_iter; iter++) {
    /* send first interior value left, receive right ghost from the right */
    MPI_Sendrecv(&u[1],           1, MPI_DOUBLE, left,  0,
                 &u[n_local + 1], 1, MPI_DOUBLE, right, 0,
                 MPI_COMM_WORLD, MPI_STATUS_IGNORE);
    /* send last interior value right, receive left ghost from the left */
    MPI_Sendrecv(&u[n_local],     1, MPI_DOUBLE, right, 1,
                 &u[0],           1, MPI_DOUBLE, left,  1,
                 MPI_COMM_WORLD, MPI_STATUS_IGNORE);

    double local_diff = 0.0;
    for (int i = 1; i <= n_local; i++) {
        unew[i] = 0.5 * (u[i - 1] + u[i + 1] + h * h * f[i]);
        local_diff += (unew[i] - u[i]) * (unew[i] - u[i]);
    }
    double diff;
    MPI_Allreduce(&local_diff, &diff, 1, MPI_DOUBLE, MPI_SUM, MPI_COMM_WORLD);

    double *tmp = u; u = unew; unew = tmp;      /* swap buffers */
    if (sqrt(diff) < tol) break;
}
```

`MPI_PROC_NULL` turns the sends and receives at the physical boundary into no-ops, so the boundary ghost cells keep their boundary values. The convergence test needs a global quantity, hence the `MPI_Allreduce`.

{% include figure.html image="/assets/img/posts/parallel-programming/mpi-domain-decomposition.svg" alt="MPI domain decomposition with local subdomains, halo exchange, and collective reduction." caption="MPI scalability comes from decomposing data so most work is local and communication is structured, sparse, and overlappable." %}

### 6.6 Surface-to-Volume: Choosing a Decomposition

For an $N\times N$ grid on $p$ processes, compare two decompositions. Computation per process is $N^2/p$ in both.

- **1D strips**: each strip has two edges of length $N$, so communication is $2N$ values per process, *independent of $p$*. Ratio communication/computation $=2p/N$.
- **2D blocks**: each block has four edges of length $N/\sqrt p$, so communication is $4N/\sqrt p$. Ratio $=4\sqrt p/N$.

For $N=1024$ and $p=64$: strips give $0.125$, blocks give $0.031$, four times less communication per unit of work. Blocks win for $p>4$, at the price of four neighbours instead of two (more messages, more latency). In 3D the advantage of blocks is even larger. The general principle: **communication scales with the surface of a subdomain, computation with its volume**, so make subdomains as compact as possible.

### What to Remember

- Private memory, explicit messages, SPMD with ranks. Start design from data partitioning.
- Blocking send/receive can deadlock; use ordering, `MPI_Sendrecv`, or nonblocking calls.
- Message cost $\alpha+\beta n$: aggregate small messages, overlap communication with computation.
- Use collectives; decompose to minimize surface-to-volume.

## 7. GPU Programming with CUDA

### 7.1 The Architecture in One Paragraph

A GPU trades single-thread speed for throughput. It contains dozens of **streaming multiprocessors (SMs)**, each running many threads at once. Threads are executed in groups of 32 called **warps**, in **SIMT** fashion (single instruction, multiple threads): all threads of a warp execute the same instruction at the same time on different data. While one warp waits for memory, the SM switches to another, so GPUs hide memory latency with massive parallelism rather than large caches. The GPU has its own memory (high bandwidth, separate from the CPU's), connected over a bus that is slow compared with either memory.

### 7.2 The Programming Model

A CUDA program has **host** code (CPU) that manages memory and launches **kernels** (GPU functions). A kernel launch creates a **grid** of **thread blocks**; each block has up to 1024 threads that can cooperate through fast **shared memory** and synchronize with `__syncthreads()`. Blocks are independent and may run in any order.

**Vector addition**, the "hello world":

```cpp
__global__ void vec_add(const float *a, const float *b, float *c, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;   /* global thread index */
    if (i < n)                                        /* guard the tail      */
        c[i] = a[i] + b[i];
}

/* host side */
float *da, *db, *dc;
cudaMalloc(&da, n * sizeof(float));
cudaMalloc(&db, n * sizeof(float));
cudaMalloc(&dc, n * sizeof(float));
cudaMemcpy(da, a, n * sizeof(float), cudaMemcpyHostToDevice);
cudaMemcpy(db, b, n * sizeof(float), cudaMemcpyHostToDevice);

int threads = 256;
int blocks  = (n + threads - 1) / threads;          /* round up */
vec_add<<<blocks, threads>>>(da, db, dc, n);

cudaMemcpy(c, dc, n * sizeof(float), cudaMemcpyDeviceToHost);
cudaFree(da); cudaFree(db); cudaFree(dc);
```

Two observations. First, each thread computes one element, the index arithmetic maps threads to data, and the `if (i < n)` guard handles sizes that are not multiples of the block size. Second, vector addition does 1 flop per 12 bytes: it is hopelessly memory-bound, and the two host-to-device copies probably take longer than the kernel. **Keep data on the GPU** across many kernels, and only move it when necessary.

### 7.3 Memory Spaces

| Memory | Scope | Speed | Use |
|---|---|---|---|
| registers | one thread | fastest | local variables |
| shared memory | one block | very fast, on-chip | staging reused data, cooperation |
| global memory | all threads | high bandwidth, high latency | inputs and outputs |
| constant memory | all threads, read-only | cached | small read-only parameters |

**Coalescing.** When the 32 threads of a warp access 32 consecutive 4-byte words, the hardware combines them into a few wide memory transactions. When they access scattered addresses (for instance, thread $i$ reads `A[i * n]`, walking down a column of a row-major matrix), each access becomes its own transaction and effective bandwidth collapses. Arrange data and indexing so that **consecutive threads touch consecutive addresses**.

**Divergence.** If threads of the same warp take different branches of an `if`, the warp executes both branches one after the other, with some threads masked off. Branches that split warps cost performance; branches that are uniform across a warp are free.

### 7.4 Reduction

Our running example on the GPU: each block reduces a piece of the array in shared memory with a tree, and writes one partial sum.

```cpp
__global__ void reduce_sum(const float *in, float *out, int n) {
    extern __shared__ float s[];                 /* blockDim.x floats */
    int tid = threadIdx.x;
    int i   = blockIdx.x * blockDim.x * 2 + threadIdx.x;

    float v = 0.0f;                              /* each thread adds two */
    if (i < n)              v  = in[i];
    if (i + blockDim.x < n) v += in[i + blockDim.x];
    s[tid] = v;
    __syncthreads();

    /* tree in shared memory; blockDim.x must be a power of two */
    for (int stride = blockDim.x / 2; stride > 0; stride >>= 1) {
        if (tid < stride)
            s[tid] += s[tid + stride];
        __syncthreads();
    }
    if (tid == 0)
        out[blockIdx.x] = s[0];
}
/* launch: reduce_sum<<<blocks, threads, threads * sizeof(float)>>>(d_in, d_out, n); */
```

Design choices worth noticing:

- **Sequential addressing** (`tid < stride`, partner `tid + stride`) keeps the active threads contiguous, so whole warps retire together instead of diverging. The naive version (`if (tid % (2*stride) == 0)`) leaves every warp partially active at every step.
- **Each thread adds two elements while loading**, halving the number of blocks and idle threads in the first round.
- `__syncthreads()` separates rounds; it must be reached by all threads of the block, so it must not sit inside a divergent branch.

The kernel produces one value per block; a second launch (or an `atomicAdd` of each block's result) finishes the sum. This is the same tree as in section 1.3, mapped onto blocks and shared memory.

### 7.5 Histogram: Contention and Privatization

Counting how many bytes of an image fall into each of 256 bins seems trivially parallel, but every thread may update any bin, so updates must be atomic. With one global histogram, popular bins become hot spots where thousands of threads queue on the same address. **Privatization** gives each block its own histogram in shared memory, where atomics are fast and contention is limited to one block, and merges once at the end:

```cpp
#define BINS 256

__global__ void histogram(const unsigned char *data, int n, unsigned int *hist) {
    __shared__ unsigned int local[BINS];
    for (int b = threadIdx.x; b < BINS; b += blockDim.x)
        local[b] = 0;
    __syncthreads();

    /* grid-stride loop: works for any n and any grid size */
    for (int i = blockIdx.x * blockDim.x + threadIdx.x; i < n;
         i += blockDim.x * gridDim.x)
        atomicAdd(&local[data[i]], 1u);
    __syncthreads();

    for (int b = threadIdx.x; b < BINS; b += blockDim.x)
        atomicAdd(&hist[b], local[b]);
}
```

This is the GPU version of the shared-memory lesson in section 4: privatize, then reduce.

### 7.6 Tiled Matrix Multiplication

A naive kernel with one thread per output element reads a full row of $A$ and a full column of $B$ from global memory: $2n$ loads for $2n$ flops, intensity far below the GPU's ridge point. **Tiling** applies the cache-blocking idea of section 3.3 with shared memory as an explicitly managed cache:

```cpp
#define TILE 16

__global__ void matmul_tiled(const float *A, const float *B, float *C, int n) {
    __shared__ float As[TILE][TILE];
    __shared__ float Bs[TILE][TILE];

    int row = blockIdx.y * TILE + threadIdx.y;
    int col = blockIdx.x * TILE + threadIdx.x;
    float acc = 0.0f;

    for (int t = 0; t < (n + TILE - 1) / TILE; t++) {
        int a_col = t * TILE + threadIdx.x;
        int b_row = t * TILE + threadIdx.y;
        /* each thread loads one element of each tile (coalesced) */
        As[threadIdx.y][threadIdx.x] = (row < n && a_col < n) ? A[row * n + a_col] : 0.0f;
        Bs[threadIdx.y][threadIdx.x] = (b_row < n && col < n) ? B[b_row * n + col] : 0.0f;
        __syncthreads();                     /* tile fully loaded */

        for (int k = 0; k < TILE; k++)
            acc += As[threadIdx.y][k] * Bs[k][threadIdx.x];
        __syncthreads();                     /* done with this tile */
    }
    if (row < n && col < n)
        C[row * n + col] = acc;
}

/* launch:
   dim3 block(TILE, TILE);
   dim3 grid((n + TILE - 1) / TILE, (n + TILE - 1) / TILE);
   matmul_tiled<<<grid, block>>>(dA, dB, dC, n);              */
```

Each element loaded into shared memory is used `TILE` times, so global-memory traffic drops by a factor of `TILE` (16 here). The two `__syncthreads()` calls are essential: the first prevents reading a tile before it is fully loaded; the second prevents overwriting it while others still read it. Production libraries (cuBLAS) go further with register tiling, double buffering, and tensor cores, but the principle is the same.

{% include figure.html image="/assets/img/posts/parallel-programming/cuda-grid-memory-tiling.svg" alt="CUDA grid of thread blocks loading tiles from global memory into shared memory for matrix multiplication." caption="CUDA performance usually comes from mapping data-parallel work onto grids while staging reused data through shared memory." %}

### 7.7 Occupancy

The number of warps an SM can keep in flight is limited by registers and shared memory per thread block. **Occupancy** is the ratio of active warps to the maximum. More resident warps hide more latency, but occupancy is a means, not a goal: a kernel with moderate occupancy and excellent data reuse often beats one with full occupancy and poor reuse. Measure with a profiler (Nsight Compute) rather than guessing.

### What to Remember

- Grid of blocks of threads; warps of 32 execute in lockstep (SIMT).
- Coalesce global accesses; avoid divergence within warps; keep data on the device.
- Reductions use shared-memory trees; histograms use privatized shared-memory bins; matrix multiplication uses shared-memory tiles.

## 8. Case Study: Parallel Gaussian Elimination

Gaussian elimination with partial pivoting computes $PA=LU$ (see the [numerical linear algebra note]({% post_url 2025-01-15-numerical-linear-algebra-optimization %}) for the numerics). It costs $\frac23n^3$ flops, so it is a natural target for parallelism, and it shows every issue of the course at once.

### 8.1 The Naive Algorithm Is Memory-Bound

At step $k$, the algorithm finds the pivot in column $k$, swaps rows, computes multipliers, and updates the trailing submatrix with a rank-1 update $A_{22}\leftarrow A_{22}-\ell u^\top$. A rank-1 update performs $2m^2$ flops on $m^2$ matrix entries that are read and written: intensity about $2/16$ flop/byte, deep in the memory-bound region of the roofline. Most of the time is spent moving the matrix through the memory hierarchy once per step.

### 8.2 Blocking: Turning BLAS-2 into BLAS-3

**Blocked (right-looking) LU** processes $b$ columns at a time:

1. **Panel factorization**: factor the $n\times b$ panel with ordinary elimination and pivoting (BLAS-2, but only on a thin panel).
2. **Triangular solve**: compute the block row of $U$, $U_{12}=L_{11}^{-1}A_{12}$ (`TRSM`).
3. **Trailing update**: $A_{22}\leftarrow A_{22}-L_{21}U_{12}$, a matrix-matrix multiplication (`GEMM`, BLAS-3).

The trailing update contains almost all the flops, and it is matrix multiplication, with intensity proportional to $b$. Delaying $b$ rank-1 updates and applying them together as one rank-$b$ update is what makes LAPACK's LU run near peak. The block size balances cache fit and GEMM efficiency (too small: low intensity; too large: slow panels).

### 8.3 Distributing the Matrix

On a distributed-memory machine, how should columns be assigned to processes?

- **Block distribution** (process 0 gets the first $n/p$ columns, ...): as elimination proceeds, the active submatrix shrinks towards the bottom right, and the processes owning the left columns go idle. Severe load imbalance.
- **Cyclic distribution** (column $j$ to process $j\bmod p$): every process keeps owning part of the active submatrix until the end. Good balance, but single columns cannot use BLAS-3.
- **Block-cyclic distribution** (blocks of $b$ columns dealt round-robin, in 2D over a process grid): balances load *and* keeps blocks for BLAS-3. This is what ScaLAPACK uses.

The pivot search in each column is a reduction (find the maximum) across the processes in that column, and the panel must be broadcast along process rows: the communication pattern is collectives along rows and columns of a 2D process grid.

### What to Remember

- Naive elimination is BLAS-2 and memory-bound; blocking makes the bulk of the work GEMM.
- Block distribution idles processes; cyclic balances; block-cyclic balances and keeps BLAS-3.
- One algorithm combines locality, load balance, reductions, and broadcasts.

## 9. Parallelism in Machine Learning Workloads

The course closes with neural networks because their training is dominated by exactly the kernels above.

- **Logistic regression.** For data $X\in\mathbb R^{N\times d}$, labels $y$, and weights $w$, the gradient of the average log-loss is $\frac1NX^\top(\sigma(Xw)-y)$: a matrix-vector product, an elementwise function, and another matrix-vector product, i.e. two reductions over $N$ data points.
- **A feedforward layer.** Forward: $Z=XW+b$, then an elementwise activation. Backward: $\partial L/\partial W=X^\top\,\partial L/\partial Z$ and $\partial L/\partial X=\partial L/\partial Z\,W^\top$. A minibatch turns matrix-vector products into **matrix-matrix products**, raising arithmetic intensity, which is one reason minibatches are efficient on GPUs.
- **Data parallelism.** Replicate the model on several GPUs, give each a slice of the minibatch, and average gradients with an **allreduce** after each step (the ring algorithm of section 6.4). Communication volume per step equals the model size, so large models need gradient compression, overlap of communication with the backward pass, or model parallelism.

Matrix multiplication, elementwise maps, and reductions: the same three patterns as in sections 5-7.

## 10. Methodology and Checklist

### 10.1 A Workflow

1. **Make the serial code correct and clear**, with a test that checks results.
2. **Measure** the serial baseline; profile to find where time goes.
3. **Improve locality** (loop order, blocking, data layout): often the biggest single win, and it helps every later step.
4. **Find the parallelism**: dependency analysis; restructure algorithms (reductions, scans) where needed.
5. **Choose the model**: OpenMP within a node, MPI across nodes (often MPI+OpenMP hybrid), CUDA for data-parallel kernels with high intensity.
6. **Measure scaling**: strong and weak, efficiency and Karp-Flatt, against the best serial time.
7. **Check correctness again**: races and nondeterministic reductions can make fast code wrong.

### 10.2 Benchmarking Pitfalls

- Too-small problems (everything fits in cache) or too-short runs (timer resolution, warm-up).
- Comparing against a poor serial baseline to inflate speedup.
- Uncontrolled thread placement (NUMA, hyperthreads), frequency scaling, or background load.
- For GPUs: forgetting that kernel launches are asynchronous (synchronize before stopping the timer), or excluding data transfers that the real application must pay.

### 10.3 Summary Table

| | OpenMP | MPI | CUDA |
|---|---|---|---|
| Memory | shared | distributed | separate device memory |
| Unit of parallelism | thread | process (rank) | thread in block in grid |
| Communication | implicit (loads/stores) | explicit messages | shared memory in block; global memory |
| Main hazard | data races, false sharing | deadlock, communication cost | divergence, uncoalesced access, transfers |
| Reduction | `reduction(+:x)` | `MPI_Allreduce` | shared-memory tree + second pass |
| Scales to | one node | thousands of nodes | one or a few GPUs per node |

### 10.4 Formula Sheet

- Speedup $S_p=T_1/T_p$; efficiency $E_p=S_p/p$.
- Amdahl: $S_p\le1/(f+(1-f)/p)$. Gustafson: $S_p=p-f(p-1)$.
- Karp-Flatt: $e=(1/S_p-1/p)/(1-1/p)$.
- Brent: $T_p\le T_1/p+T_\infty$.
- Roofline: $P=\min(P_{\text{peak}},\ B\cdot I)$, ridge $I^\ast=P_{\text{peak}}/B$.
- Message time: $\alpha+\beta n$. Broadcast: $\log_2p(\alpha+\beta n)$.
- Surface-to-volume: strips $2p/N$, blocks $4\sqrt p/N$.

## References and Reading Guide

- Uppsala University, 1TD070 Parallel and Distributed Programming, course materials.
- P. Pacheco and M. Malensek, _An Introduction to Parallel Programming_ (2nd ed., Morgan Kaufmann, 2021). Chapters on performance, Pthreads, OpenMP, and MPI.
- J. L. Hennessy and D. A. Patterson, _Computer Architecture: A Quantitative Approach_ (6th ed., Morgan Kaufmann, 2017). Memory hierarchy, cache coherence, and thread-level parallelism.
- S. Williams, A. Waterman, and D. Patterson, "Roofline: An Insightful Visual Performance Model for Multicore Architectures," _Communications of the ACM_ 52(4), 2009.
- D. B. Kirk and W. W. Hwu, _Programming Massively Parallel Processors_ (4th ed., Morgan Kaufmann, 2022). CUDA, reduction, histogram, and tiled matrix multiplication.
- M. Harris, "Optimizing Parallel Reduction in CUDA," NVIDIA technical presentation.
- W. Gropp, E. Lusk, and A. Skjellum, _Using MPI_ (3rd ed., MIT Press, 2014).
- G. E. Blelloch, "Prefix Sums and Their Applications," technical report CMU-CS-90-190, 1990.
- J. Demmel, _Applied Numerical Linear Algebra_ (SIAM, 1997), and the ScaLAPACK Users' Guide for block-cyclic distributions.
