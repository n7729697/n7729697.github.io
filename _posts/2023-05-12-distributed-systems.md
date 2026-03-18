---
title: Distributed Systems Notes
tags: [distributed systems, parallel computing, many-core, real-time systems, NoC, CAN, TSN]
style: fill
color: light
description: A dense exam-oriented note connecting threads, processes, many-core architecture, and real-time distributed communication.
---

## Table of Contents

1. [Big Picture and Vocabulary](#1-big-picture-and-vocabulary)
2. [From One Thread to Many Threads](#2-from-one-thread-to-many-threads)
3. [From Threads to Processes](#3-from-threads-to-processes)
4. [From Processes to Cores](#4-from-processes-to-cores)
5. [From Many Cores to Network-on-Chip](#5-from-many-cores-to-network-on-chip)
6. [Communication Mechanics Inside a Many-Core System](#6-communication-mechanics-inside-a-many-core-system)
7. [When On-Chip Becomes Distributed: Real-Time Systems](#7-when-on-chip-becomes-distributed-real-time-systems)
8. [CAN: Deterministic Arbitration on a Shared Bus](#8-can-deterministic-arbitration-on-a-shared-bus)
9. [TTP and FlexRay: Time-Triggered and Hybrid Real-Time Communication](#9-ttp-and-flexray-time-triggered-and-hybrid-real-time-communication)
10. [Automotive Ethernet, AVB, TTEthernet, and TSN](#10-automotive-ethernet-avb-ttethernet-and-tsn)
11. [Compact Recall Map](#11-compact-recall-map)

## 1. Big Picture and Vocabulary

These notes use **distributed systems** in a deliberately broad but disciplined sense. In the narrow textbook sense, distributed systems usually mean multiple networked machines coordinating over unreliable communication. In this note, the phrase covers a wider ladder:

```text
one thread -> many threads -> many processes -> many cores -> many nodes
```

The reason for using that ladder is simple: the same design problems recur at every level. Once there are multiple active execution contexts, a designer has to decide:

- what is shared and what is isolated,
- how communication occurs,
- how resources are allocated under contention,
- how fairness is defined,
- how progress is guaranteed,
- how failure or delay propagates,
- how global behavior is inferred from local rules.

The material is strongest on embedded many-core architecture and real-time communication, not on cloud storage or consensus. That is fine. A many-core chip is already a small distributed machine: there are many processing elements, communication is not free, local decisions create global congestion, and correctness depends on the interaction between computation, communication, and timing.

### Concurrency, Parallelism, Distribution, and Real-Time

These terms are often blurred together in exams. They should not be.

| Term | Core idea | Main question | Canonical resource |
|---|---|---|---|
| Concurrency | multiple tasks can make progress in overlapping time | how do independent activities coordinate? | logical execution contexts |
| Parallelism | multiple tasks execute at the same instant | how do we exploit hardware simultaneously? | cores / pipelines / lanes |
| Distribution | computation is separated by communication boundaries | how do components coordinate without free shared state? | processes / nodes / networks |
| Real-time | correctness includes time bounds, not only logical output | can the result arrive before its deadline? | schedules, clocks, bounded delay |

A program can be concurrent but not parallel. For example, 100 threads on 2 cores are concurrent, but only 2 threads can run physically at the same instant. A system can be distributed but not parallel in any useful sense if most time is spent waiting for communication. A system can be parallel but not real-time if it is fast on average but misses occasional deadlines.

That distinction matters because each notion adds a new class of failure:

- concurrency introduces races and coordination bugs,
- parallelism introduces load imbalance and locality issues,
- distribution introduces serialization and communication uncertainty,
- real-time design introduces deadline misses and jitter.

### Thread, Process, Core, and Node

The next vocabulary distinction is even more important.

| Entity | What it is | Memory relation | Failure boundary | Usual coordination style |
|---|---|---|---|---|
| Thread | schedulable flow of control within a process | shares address space with peer threads | weak isolation | locks, atomics, condition variables |
| Process | isolated program instance | private address space by default | stronger isolation | IPC, message passing, explicit shared memory |
| Core | physical execution engine | hardware, not a software object | not a software failure boundary | scheduling, cache coherence, interconnect |
| Node | independently addressable system element | local state, explicit communication | strongest boundary in this note | buses, links, protocols, clocks |

A very common exam mistake is to speak as if more threads automatically imply more cores, or as if a process is just a heavier thread. That is too loose. Threads are software entities; cores are hardware execution resources. Processes are software compartments with stronger isolation and explicit communication boundaries. Nodes are the next step: communication is not merely explicit, it becomes architectural.

### The Same Questions Keep Coming Back

What makes this note worth studying as a single continuous story is that the same structural questions return again and again.

| Level | Main contention | Main correctness risk | Main performance limit |
|---|---|---|---|
| threads | locks, queues, shared variables | races, deadlock, starvation | scheduler overhead, lock contention |
| processes | IPC channels, kernel objects | protocol mismatch, partial failure | serialization and copy cost |
| cores | caches, memory system, interconnect | stale views, ordering bugs | locality, coherence traffic |
| many-core networks | buffers, channels, arbiters | deadlock, livelock, interference | hop count, congestion, flow control |
| distributed real-time networks | bus/network access, schedules, clocks | deadline miss, jitter, safety failure | worst-case delay, arbitration, synchronization |

That is why the arc makes sense. It starts with many-core architecture, then quickly turns into routing, flow control, deadlock, QoS, analysis, and finally concrete real-time communication protocols. Communication becomes the center of the system.

### Running Example Used Across the Note

A good way to keep the sections connected is to imagine a simple automotive control path:

1. A sensor produces a measurement.
2. Software filters the signal.
3. A controller computes a response.
4. A message is sent to an actuator.
5. The actuator must respond before a deadline.

In a toy implementation, all five steps might live in one thread on one processor. As the design grows, the path may split across multiple threads, then multiple processes, then multiple cores, then multiple ECUs connected over CAN, FlexRay, or Ethernet. Nothing essential changes about the purpose of the system, but everything changes about coordination.

### What to Remember

- Concurrency is about overlapping activities; parallelism is about simultaneous execution.
- Distribution starts when communication boundaries become explicit and non-free.
- Real-time means output correctness plus timing correctness.
- Thread, process, core, and node are different entities and should never be used interchangeably.
- The entire note is about one recurring theme: scaling computation turns communication into the main systems problem.

## 2. From One Thread to Many Threads

### The Single-Thread Baseline

A single-threaded program is conceptually comfortable because there is only one control history. One instruction follows another, state changes in one place, and debugging is often little more than reconstructing a sequential story.

In the running example, a single thread might execute:

1. read sensor data,
2. filter it,
3. compute control output,
4. log the event,
5. send the result.

The great advantage of this model is that all ordering is implicit. There is no race between producer and consumer because producer and consumer are the same execution history. There is no lock ordering problem because there may be no locks at all. A huge amount of complexity disappears when only one active locus of control exists.

The weakness is equally obvious: latency accumulates linearly. If each stage waits for the previous one to finish, throughput is low and any blocking action delays everything behind it. Logging delays control. Communication delays sensing. One slow path becomes a slow whole system.

### Concurrency Appears Before Parallelism

The first move toward performance or responsiveness is usually not "get more machines." It is "split the work."

In the example above, we might create:

- a sensor thread,
- a filtering thread,
- a controller thread,
- a logging thread,
- a communication thread.

This is the first step into concurrency. The system can now overlap tasks even if the hardware has only one core. That seems paradoxical, but it is not. Concurrency is about the **structure** of the program, not about how many cores currently exist. The OS can time-slice among runnable threads, giving the appearance and coordination challenges of simultaneity even without much true parallel hardware.

### Scheduler Reality: Runnable Is Not Running

This is a crucial exam point. When a program has `N` runnable threads and the machine has `P` cores, at most `P` threads can execute simultaneously. The others wait in run queues. Therefore:

- many threads do not imply much parallelism,
- oversubscription can improve utilization for I/O-heavy workloads,
- oversubscription can destroy latency for CPU-bound workloads,
- thread count alone says very little about performance.

The scheduler must make several decisions:

- which thread gets a core now,
- how long it runs before preemption,
- whether it should migrate to another core,
- whether affinity to caches or NUMA regions should be preserved.

This leads to a distinction between **throughput optimization** and **latency optimization**. A system may improve total work per second by keeping all cores busy, yet still harm latency because a critical thread waits behind non-critical work, loses cache locality through migration, or suffers more context-switch overhead.

### Context Switching and Affinity

Threads are lighter than processes, but they are not free. Context switching costs:

- scheduler work,
- register save/restore,
- cache disruption,
- branch predictor disruption,
- TLB effects,
- queueing delay before the next run.

Affinity matters because data locality matters. If a thread that was warm in one core's caches is migrated to another core, its working set may need to be fetched again. This is one reason why "just add threads" is often disappointing on memory-intensive code.

An exam-ready way to say it is:

> Thread-level parallelism is limited not only by dependencies, but also by the scheduler's ability to map work onto cores without excessive migration and synchronization cost.

### Shared-Memory Hazards

Threads are attractive because they communicate cheaply through shared memory. That is also why they are dangerous.

The major hazards are:

- **data race**: two threads access the same location without proper synchronization and at least one write occurs,
- **lock contention**: threads serialize on shared critical sections,
- **deadlock**: cyclic waiting for locks or conditions,
- **starvation**: a thread waits indefinitely because others keep being served,
- **priority inversion**: a high-priority thread is blocked by a lower-priority thread holding a needed resource,
- **convoying**: one slow holder of a lock delays many otherwise independent threads.

Notice how familiar these ideas will become later in networks. Replace "thread" with "packet" and "lock" with "buffer or channel" and the structural resemblance is immediate.

### Why Multi-Threading Eventually Stops Being Enough

As systems get larger, threads become an uncomfortable abstraction boundary for at least four reasons.

First, everything is shared by default within the process. That means a bug in one component can corrupt another component's state. Second, synchronization becomes implicit and scattered. Third, scaling across hardware boundaries is awkward because shared memory stops being natural. Fourth, it becomes hard to reason about ownership: which component really owns a given buffer, queue, or timer?

That is why many serious systems move from "many threads in one giant address space" to "many components with explicit communication." That next move is the bridge from concurrency engineering to distributed-systems engineering.

### What to Remember

- A concurrent program may have many runnable threads but only a few can run at once.
- Scheduler behavior matters: preemption, migration, affinity, and run-queue delay all affect performance.
- Threads make communication cheap but correctness hard.
- The classic hazards are race, contention, deadlock, starvation, and priority inversion.
- Multi-threading is often the last comfortable stop before stronger isolation becomes worth the cost.

## 3. From Threads to Processes

### The Shift from Implicit Sharing to Explicit Boundaries

Moving from threads to processes is one of the most important conceptual steps in systems design. A multi-threaded process shares memory by default. A multi-process design isolates memory by default. That single change forces communication to become explicit.

This is good engineering pressure. Once components cannot silently reach into one another's heap, they must communicate through defined interfaces. At that point, questions that were previously hidden become visible:

- what is the message format,
- who owns the data,
- how is failure reported,
- can the receiver be slow,
- what happens if the sender crashes halfway through an interaction?

Processes therefore increase overhead but improve architecture.

### Threads vs Processes as a Design Choice

| Property | Threads | Processes |
|---|---|---|
| address space | shared | isolated |
| data exchange | direct shared memory | IPC or explicitly mapped memory |
| creation/switch cost | lower | higher |
| fault containment | weaker | stronger |
| accidental coupling | easier to create | harder to create |
| scaling toward distribution | awkward | natural |

This table should be mentally linked to the distinction between multiprocessor shared-variable systems and multiprocessor distributed systems. Once tasks communicate by messages over a bus or network, the design philosophy starts to resemble process-based rather than thread-based architecture.

### IPC as the First Distributed-System Interface

Inter-process communication is the first place where many software engineers encounter distributed-systems tradeoffs in miniature.

| Mechanism | Strength | Weakness | Typical lesson |
|---|---|---|---|
| pipes / FIFOs | simple ordered byte stream | weak structure, local scope | ordering is not the same as typed protocol |
| sockets | uniform local or network IPC | serialization and buffering cost | communication boundaries persist across machines |
| message queues | decoupling and buffering | queue management and backpressure | communication is a resource, not magic |
| shared memory | high throughput | reintroduces synchronization complexity | isolation can be relaxed, but then coordination returns |
| RPC / request-response | convenient abstraction | hides latency and partial failure | remote calls are not local calls |

Even local IPC teaches two important distributed-systems lessons.

The first is that data transfer has a cost. You may need copying, serialization, framing, checksum work, or kernel mediation. The second is that failure semantics become interesting. If a producer dies, a consumer might still be blocked on an empty queue or waiting on a socket. In threads, "everything dies together" is common. In processes, partial failure becomes visible.

### Serialization Is a Real Design Constraint

One reason processes feel different is that a pointer stops being a meaningful communication primitive. In threads, a pointer can be handed from one component to another if the address space is shared. In processes, a pointer is merely a number in the wrong address space. Data must be serialized, copied, or explicitly mapped.

That has architectural consequences:

- interfaces become data-oriented rather than pointer-oriented,
- ownership and lifetime must be stated explicitly,
- versioning and schema become important,
- performance depends on payload size and shape.

This is exactly the mindset needed later for node-to-node communication. Processes are the first training ground.

### Fault Boundaries and Recovery

Processes also make one of the central distributed-systems ideas easier to see: **containment**. If one process crashes, another process may survive. That means recovery, restart, timeouts, supervision, and watchdog logic all become meaningful. With threads inside one process, many failures are total-process failures. With processes, the system can at least aspire to partial recovery.

That is a direct bridge to embedded distributed systems. An ECU or subsystem should ideally fail in a contained way, not as a chaotic shared-memory collapse.

### The Running Example Becomes a Pipeline of Components

Our earlier single-threaded control loop might evolve into:

- a sensor acquisition process,
- a filtering process,
- a control process,
- a logger process,
- a communication process.

At this stage, each component may already be message-driven. It may still run on the same machine, but the system is no longer conceptually monolithic. Once that happens, mapping some components to other processors or ECUs is no longer a conceptual leap. It is a deployment change on top of an already distributed design style.

### What to Remember

- Processes trade cheaper communication for stronger isolation and cleaner architecture.
- IPC is the first real distributed-systems interface because communication now has framing, latency, and failure semantics.
- Serialization is not a nuisance detail; it changes API design.
- Process boundaries make partial failure visible.
- Designing with explicit processes is often the first serious step toward distributed architecture.

## 4. From Processes to Cores

### The Hardware-Software Mapping Problem

Once a design has multiple processes or threads, the next question is not merely "how do they communicate?" but also "where do they run?" This is the point where software abstractions meet hardware execution resources.

The fundamental mapping chain is:

```text
application -> components -> processes/threads -> scheduler/runtime -> hardware threads -> cores -> sockets -> memory hierarchy
```

The reason this mapping became central: frequency scaling stalled because of power and heat limits. The answer was not to make one core infinitely fast, but to put more compute elements on the chip. That created multicore and many-core systems, and with them a new kind of systems problem. Software performance was now limited by how well work matched the topology and locality of hardware.

### Hardware Thread, Core, Socket, NUMA Region

| Term | Meaning | Typical exam trap |
|---|---|---|
| hardware thread | a logical execution slot, often from SMT | treating it as equivalent to a physical core |
| core | physical execution engine with private or semi-private resources | ignoring resource sharing inside SMT pairs |
| socket / package | processor package containing multiple cores | forgetting memory locality effects across sockets |
| NUMA node | region with relatively fast local memory and slower remote memory | assuming all memory is equally close |

The exact hardware organization varies, but the pattern is consistent: not all cores see all memory with the same cost, and not all execution contexts are equally independent. This is already a distributed-systems fact in miniature. Distance matters.

### Cache Hierarchy and Locality

Most real performance on many-core systems depends less on raw arithmetic capability than on data movement. A core may have:

- private L1 caches,
- private or shared L2,
- larger shared LLC/L3,
- DRAM behind much higher latency,
- perhaps remote DRAM in another NUMA region.

Two components can therefore have the same asymptotic algorithm and still show very different runtime depending on locality. That is why scheduling and placement are not separate from communication design.

An exam-ready phrasing is:

> In many-core systems, communication occurs not only over explicit networks but also implicitly through caches, coherence traffic, and memory hierarchy.

### Cache Coherence: Keeping a Single Location Sensible

The point toward coherence in two places:

- bus serialization and broadcast are noted as useful for snooping cache-coherence protocols,
- network interfaces for shared-memory systems are said to be complicated by cache coherency.

The slides do not fully develop coherence, but this is the missing bridge that turns threads, processes, and cores into one story.

**Cache coherence** asks: if multiple caches hold copies of the same memory location, how do they avoid diverging forever?

Coherence is a **per-location** property. It does not, by itself, tell you everything about the ordering of multiple different locations. It only says that updates to one memory location should have a consistent meaning across observers.

Without coherence, a thread on one core might keep reading an old value while another core has already written a new one. With coherence, the system ensures some valid propagation and invalidation discipline.

### Memory Consistency: When Different Locations Become Visible

Consistency is a different question. Once a program writes to two different memory locations, in what order must other cores see those writes?

That is why the following conceptual pattern matters:

1. Producer writes data.
2. Producer sets a flag.
3. Consumer observes the flag and reads the data.

If the memory model is weak and no proper synchronization is used, the consumer may observe the flag without observing the intended data order. Coherence alone does not fix that. Consistency and synchronization do.

This is the right conceptual distinction:

| Topic | Main question |
|---|---|
| coherence | what values can a single location have across caches? |
| consistency | in what order do reads and writes across locations become visible? |
| synchronization | what programming operations force order and visibility? |

This is not exam trivia. It is the exact bridge between shared-memory threads and explicit message-passing systems. If memory order is weak, programmers must create explicit happens-before relationships just as protocol designers create explicit message order.

### False Sharing

False sharing is one of the classic many-core pathologies and deserves explicit memorization.

It occurs when two threads update different variables that happen to live on the same cache line. The threads are not logically sharing the variables, but the hardware treats the cache line as the coherence unit. The result is needless invalidation traffic and terrible scaling.

This is a good example of how the real communication granularity is often larger than the program's conceptual granularity. In networks we will later see the same issue with packets and flits: the resource unit matters.

### NUMA: Distance Inside One Machine

NUMA stands for non-uniform memory access. The name already says why it belongs in this note: memory is not equally distant from all cores.

Consequences:

- a thread may run on one core while touching memory allocated near another socket or controller,
- migration can silently worsen memory latency,
- "shared memory" can behave like a network when accessed remotely and heavily,
- placement of data and computation must be coordinated.

NUMA is one of the most useful bridge concepts between many-core architecture and distributed systems. It teaches that even within one machine, distance, locality, contention, and explicit placement all matter.

### Scheduling Beyond Correctness

At this level, scheduling is no longer merely "ensure each thread eventually runs." It becomes:

- which tasks should be pinned,
- which workloads tolerate migration,
- which cores are close to which memory banks,
- whether tasks that communicate heavily should be co-located,
- whether high-priority or real-time workloads should be isolated.

This is precisely why modern systems engineering cannot separate software structure from hardware topology. A poor mapping can make a logically elegant design perform disastrously.

### Bridge-Out Note

The consistency, coherence, false sharing, and NUMA discussion is the main contextual extension beyond the explicit material. It is added here because it is the cleanest missing bridge between:

- threads in shared memory,
- processes mapped to real hardware,
- many-core communication networks,
- explicit distributed real-time systems.

- Threads and processes are mapped onto hardware execution resources through schedulers and runtimes.
- Hardware thread, core, socket, and NUMA node are different levels of physical organization.
- Cache coherence is about one location; memory consistency is about ordering across locations.
- False sharing is a performance bug caused by the hardware coherence granularity.
- NUMA means that even within one machine, memory access can be distributed in effect.

## 5. From Many Cores to Network-on-Chip

### Why the Architecture Had to Change

The many-core era and the power wall for a reason. Once clock frequency stopped scaling freely, performance growth depended more on replication and communication structure than on a single faster pipeline. More cores meant more need for interconnect.

The slides emphasize two trends:

- from one processor to many processors,
- from homogeneous systems to heterogeneous systems.

They also emphasize a remarkably stable architectural pattern:

- buses are attractive locally,
- networks are needed globally.

That is the shift from single communication medium to hierarchical communication fabric.

### Bus, Crossbar, and Network-on-Chip

| Interconnect | Strength | Weakness | Best mental model |
|---|---|---|---|
| bus | simple, broadcast, total order | serialization bottleneck, limited bandwidth, poor scalability | one shared road |
| crossbar | many simultaneous point-to-point transfers | wiring and complexity grow quickly | direct switching fabric |
| NoC | scalable parallel communication resources | routing, buffering, and protocol complexity | packet network on chip |

The bus lecture gives two key bus properties:

- **serialization**: only one sender can transmit at a time,
- **broadcast**: all listeners can observe the transfer at no extra routing cost.

These are powerful properties. Snooping cache coherence exploits both. But they also become limiting. If every transfer uses a shared medium, total bandwidth is bounded and power is wasted broadcasting traffic that many components do not need.

Crossbars improve concurrency but grow badly in complexity and wiring cost. That is why networks-on-chip become attractive as systems grow.

### Arbitration and Fairness

Buses make arbitration unavoidable, and is careful to say arbiters matter everywhere shared resources exist. The exact fairness notion depends on application needs.

| Fairness notion | Meaning |
|---|---|
| weak fairness | every request is eventually served |
| strong fairness | requests are served equally often over time |
| weighted fairness | service is proportional to configured weights |
| FIFO fairness | requests are served in order of arrival |

This is not just bus theory. The same fairness questions later reappear in router arbitration, QoS, and best-effort networking. Exams often test whether you can see fairness as a resource-policy question, not a bus-specific detail.

### Bus Protocol Optimizations and Their Tradeoffs

The bus lecture also discusses:

- pipelined bus protocols,
- split transactions,
- burst transfers.

Bursting is especially instructive. Longer bursts improve efficiency because arbitration and command overhead are amortized across more data. But longer bursts also delay everyone else, which is dangerous for real-time systems. This is the pattern that will return throughout the note: higher average efficiency can worsen worst-case latency.

### Topology as a First-Order Design Choice

The topology lecture treats topology as a first concern, not a detail added after everything else. That is exactly right. A topology determines:

- how many hops messages travel,
- how much traffic can cross a cut,
- how much wiring exists,
- how symmetric the design is,
- how predictable latency can be.

Meshes and tori are attractive because they are regular and symmetric. That regularity simplifies layout, routing logic, and analysis.

### Core Metrics: Hop Count, Diameter, Bisection, Throughput

| Metric | Intuition | Why it matters |
|---|---|---|
| hop count | number of routers/links traversed | affects delay and load |
| diameter | worst-case shortest-path distance | bounds worst-case distance |
| bisection bandwidth | minimum bandwidth across a cut splitting the network | indicates global communication capacity |
| channel load | average or peak traffic on channels | determines bottlenecks |
| zero-load latency | latency with no congestion | lower bound on latency |
| saturation throughput | highest sustainable load before queues explode | tells where the network stops behaving linearly |

The slides use both hop-count and bisection arguments to derive throughput limits. A compact way to say it is:

$$
\Theta_{\text{ideal}} \approx \frac{b}{\gamma_{\max}},
$$

where `b` is channel bandwidth and `\gamma_{\max}` is the maximum bottleneck channel load implied by the traffic pattern and routing. The exact form depends on the bound used, but the intuition is stable: the busiest resource limits the network.

### Latency Decomposition

An excellent latency decomposition:

$$
T_0 = H_{\min} t_r + \frac{D_{\min}}{v} + \frac{L}{b}.
$$

Interpretation:

- `H_min t_r` is the router-delay term: every hop spends time in routers,
- `D_min / v` is the wire-flight term: distance divided by propagation velocity,
- `L / b` is serialization latency: how long it takes the tail of the message to enter the channel after the head.

If there is congestion, another term must be added for queueing delay. This decomposition is extremely exam-friendly because it separates structural latency from congestion latency.

A good verbal explanation is:

> Even with no contention, a message is not instant. It must be processed by routers, physically traverse wires, and be serialized onto finite-bandwidth channels.

### Why Bus-to-Network Is a Distributed-Systems Transition

The move from bus to NoC is not only a hardware scaling trick. It is a conceptual shift:

- local arbitration replaces global serialization,
- traffic is routed rather than globally visible,
- buffering and flow control become explicit,
- deadlock and livelock become possible,
- path choice affects performance.

That is exactly why this is a distributed-systems story. The moment communication is no longer one shared total order, the system must manage multiple partial orders across a constrained network.

### What to Remember

- The power wall pushed architecture from one fast core toward many communicating cores.
- Bus, crossbar, and NoC are distinct interconnect choices with different scaling behavior.
- Arbitration fairness matters everywhere shared resources exist.
- Topology determines hop count, bisection bandwidth, latency structure, and throughput bounds.
- The latency formula `T_0 = H_min t_r + D_min / v + L / b` is one of the most important compact formulas in the note.

## 6. Communication Mechanics Inside a Many-Core System

Once a system is a network, the next exam question is usually not "what is the topology?" but "how does communication actually work?" organizes the answer around routing, flow control, deadlock, router architecture, QoS, and performance analysis. That is the right grouping.

### Units of Communication: Message, Packet, Flit, Phit

One elegant detail in the flow-control lecture is the distinction between communication units.

| Unit | Meaning | Why it exists |
|---|---|---|
| message | application-level communication object | what software means to send |
| packet | network-level piece of a message | routing and buffering operate on packets |
| flit | flow-control digit | fine-grained unit for allocation and movement |
| phit | physical transfer unit on the wire | actual width moved per cycle |

This matters because systems rarely allocate resources at the same granularity that software reasons about them. A "message" may be fragmented into packets, packets may move flit by flit, and phits determine how many cycles that movement takes.

### Routing: Algorithm vs Mechanics

The routing lecture wisely separates two different questions.

The first is the **routing algorithm**: what kind of path choice policy is used?

- deterministic,
- oblivious,
- adaptive.

The second is the **routing mechanism**: where is route information stored or computed?

- source-table routing,
- node-table routing,
- algorithmic routing.

Students often mix these. They should not.

Deterministic routing gives one fixed path or path rule for a source-destination pair. It is easy to analyze and often easier to make deadlock-free. Dimension-order routing in mesh/torus networks is the standard example.

Oblivious routing allows multiple possible paths but chooses without looking at current congestion.

Adaptive routing uses congestion or state information to steer traffic away from busy regions.

The tradeoff is subtle:

- deterministic routing helps analysis and predictability,
- adaptive routing can improve throughput under skewed traffic,
- but adaptive routing creates harder correctness and global-state problems.

The lecture also notes that local information is often insufficient in adaptive routing. Backpressure is how remote congestion becomes visible. Small buffers can actually help adaptation because congestion propagates back sooner.

### Flow Control: Who Gets Which Resource, When?

Routing decides *where* a packet wants to go. Flow control decides *when* it may move and which resources it can hold while moving.

The lecture defines flow control as a problem of:

- resource allocation,
- contention resolution.

The resources are:

- channel bandwidth,
- buffers,
- control state.

This is a very clean exam definition. Flow control is not merely "avoid overflow." It is the discipline by which packets acquire and release scarce network resources.

### Bufferless and Buffered Families

The flow-control lecture distinguishes:

- bufferless approaches,
- buffered approaches,
- network-level flow control,
- link-level flow control.

A useful summary table is:

| Scheme | Main idea | Strength | Weakness |
|---|---|---|---|
| circuit switching | reserve path before sending | no dropping or misrouting | setup latency, signaling overhead, low efficiency |
| store-and-forward | whole packet buffered at each hop | simple correctness | high latency and buffer cost |
| cut-through | forward before whole packet arrives | lower latency | still buffer-heavy under blockage |
| wormhole | packet split into flits, holds path incrementally | low buffer cost | blocking can spread through network |
| virtual channels | multiple logical channels per physical link | more throughput, deadlock control, class separation | extra complexity and buffering |

Circuit switching is instructive because it highlights a recurring system tradeoff. By reserving resources early, it avoids misrouting and some contention complexity. But it pays with high setup latency and lower payload efficiency. Predictability often costs utilization.

### Wormhole Routing and Why It Matters

Wormhole flow control is central in many-core design. A packet moves as a chain of flits. The head flit explores the route and reserves resources; body flits follow. This lowers buffer requirements compared with storing whole packets.

The danger is that blocking becomes distributed. If the head flit is waiting downstream, body flits can occupy upstream buffers, which can block other traffic, which can block still more traffic. This is the physical basis for many deadlock scenarios.

### Link-Level Control: Credits, On/Off, Ack/Nack

At the switch-to-switch level, discusses:

- credit-based flow control,
- on/off flow control,
- ack/nack flow control.

Credit-based flow control is particularly important. The upstream sender may transmit only when it knows downstream buffer space exists. A returned credit signals that one buffer slot has become available again. The credit round-trip delay is critical because it limits how well the channel can be kept busy.

That is a very exam-friendly systems insight:

> Throughput is constrained not only by raw bandwidth but also by how quickly buffer availability information returns to the sender.

Ack/nack is simple but inefficient. On/off is useful with larger buffers. Credit-based schemes are common when buffering is tighter and more precisely managed.

### Deadlock and Livelock

Deadlock and livelock deserve full conceptual clarity.

**Deadlock** means no agent can progress because of cyclic waiting on resources.

**Livelock** means agents continue moving or retrying, but some agent never makes true forward progress.

In networks, deadlock is often explained through:

- resource dependency graphs,
- wait-for graphs.

If a cycle exists in the dependency structure, deadlock is possible. If a cycle exists in the actual waiting relation, deadlock is occurring.

Several techniques for avoiding deadlock:

- order resources,
- split resources into classes,
- restrict legal turns or routes,
- use hybrid route restrictions,
- detect and recover with timeouts.

Livelock, especially in adaptive non-minimal routing, is often prevented by giving packets age or misroute count and then prioritizing older packets. This is structurally similar to starvation prevention in thread scheduling.

### Protocol Deadlock

One especially important slide points out **protocol deadlock**, where the cyclic dependency is not purely inside the network but arises from endpoint protocol logic. The example uses cache-coherence-style messages and queues. This matters because it reminds us that communication correctness is end-to-end. A deadlock-free network fabric does not guarantee a deadlock-free protocol using it.

This is a major systems lesson:

> Communication layers cannot be reasoned about in total isolation. Endpoint dependencies can create system-level deadlock even when the transport network itself is sound.

### Router Architecture: Datapath and Control Plane

The router lecture treats modern routers as pipelined flit-level machines. That is a helpful abstraction. A typical virtual-channel router contains:

- input buffers,
- switch fabric,
- output structures,
- route computation,
- virtual-channel allocation,
- switch allocation.

The datapath moves flits. The control plane decides how the movement may occur. The pipeline stages matter because they contribute directly to per-hop delay.

Important stages to remember:

- route computation determines the desired output,
- virtual-channel allocation claims a downstream VC,
- switch allocation claims a time slot across the switch,
- flit traversal actually moves the flit.

Credits close the loop: when a downstream buffer is freed, the upstream side learns it can reuse a slot.

### Network Interfaces: What Software Actually Touches

A network interface is the boundary between processors or memory and the network fabric. This is where software-visible communication abstractions meet network-visible packet machinery.

Discusses:

- two-register interfaces,
- descriptor-based interfaces,
- processor-network interfaces,
- memory-network interfaces.

The two-register interface is conceptually simple and efficient for short messages, but it is unsafe and inefficient for long ones. A misbehaving processor can tie up the network. Descriptor-based interfaces are more structured and better suited to longer transfers.

This is an important exam point because it shows how communication semantics change near the hardware boundary. Software never just "throws bits onto the network." There is a carefully defined injection and reception discipline.

### QoS: Guarantees vs Best Effort

The QoS lecture frames the topic around two broad classes:

- **guaranteed service**,
- **best-effort service**.

Guaranteed service needs a traffic specification. Best-effort service mainly worries about fairness and average behavior.

The standard traffic model used in the slides is the `(sigma, rho)` model:

$$
A(T) \le \sigma + \rho T
$$

for any interval of length `T`, where:

- `sigma` is burstiness,
- `rho` is long-term average rate.

This is extremely important. Timing guarantees require assumptions about offered traffic. No system can promise bounded delay for unbounded burstiness.

In a simple single-server setting with service rate `b > rho`, a standard delay bound has the form:

$$
D_{\max} = \frac{\sigma}{b - \rho}.
$$

The precise model details matter, but the intuition is the key thing to remember: more burstiness or a smaller service margin means larger worst-case delay.

### Interference and Non-Interfering Designs

QoS is not only about direct contention on one resource. The lecture stresses indirect interference as well. Congestion can propagate through the network and affect flows that do not obviously share an endpoint.

To isolate classes perfectly, one would need a non-interfering network where no indefinitely held resource is shared across classes. Virtual channels can help, but full non-interference is expensive. This is another recurring lesson: strong isolation is possible, but usually costly in buffers, queues, or underutilized resources.

### Performance Evaluation

The performance lecture recommends a three-part toolbox:

- formal analysis,
- simulation,
- experiment or prototype.

This is the right systems workflow because each method answers different questions:

- formal analysis provides insight and bounds,
- simulation explores design space,
- experiment finds real implementation behavior.

The lecture also distinguishes:

- application-driven workloads,
- trace-driven workloads,
- synthetic workloads.

This matters because a network can look excellent under uniform random traffic and terrible under structured application traffic.

### What to Remember

- Flow control is resource allocation plus contention resolution.
- Routing policy and routing mechanism are different things.
- Wormhole flow control is efficient but makes blocking highly distributed.
- Deadlock is cyclic waiting; livelock is endless motion without progress.
- QoS needs traffic models such as `(sigma, rho)`.
- The standard evaluation triad is analysis, simulation, and experiment.

## 7. When On-Chip Becomes Distributed: Real-Time Systems

### Correctness Now Includes Time

The real-time lectures make a clean and critical point:

> Correct operation means not only that the result is logically correct, but also that it arrives in good time.

That extra clause changes the nature of system design. In ordinary throughput-oriented computing, an occasional long tail may be inconvenient. In real-time systems, a long tail may be a failure.

The standard deadline classification is:

| Deadline type | Meaning |
|---|---|
| soft | missing the deadline degrades quality but system value remains |
| firm | late results are useless, but not necessarily catastrophic |
| hard | deadline miss is a system failure |

When this classification appears on an exam, the expected answer is not merely definitional. It should connect to design consequences. Hard real-time systems need stronger analysis, stronger scheduling discipline, and usually less tolerance for best-effort sharing.

### Computation, Communication, Sensing, Control

One strength of is that it does not treat communication in isolation. It emphasizes the joint system:

- computation,
- communication,
- sensing,
- control.

That is a better model of embedded distributed systems than a pure computer-networking view. A message often represents the state of the physical world, not just a software object. Delay therefore changes the meaning of the data. A perfectly correct but late control message may command the wrong actuation because the world has moved on.

### Closed Systems and Why That Helps Analysis

The slides distinguish embedded real-time networks from open networking systems. Embedded systems are often:

- closed-world deployments,
- built for known applications,
- operating on known traffic classes,
- using known nodes and bounded message sizes.

This is why stronger timing guarantees are possible. The system does not need the full overhead of the seven OSI layers. In many cases there is:

- no need for general presentation-layer concerns,
- no need for arbitrary inter-domain routing,
- no need for large fragmentation/reassembly machinery.

A closed world is analytically friendly because uncertainty is reduced. Of course, the price is less openness and flexibility.

### MAC Protocols as Timing Policy

The real-time networking lecture discusses several medium-access policies:

- master-slave,
- TDMA,
- token circulation,
- CSMA,
- CSMA-CD,
- CSMA-CR.

This list should not be memorized as disconnected acronyms. Each is a different answer to the same question:

> When multiple nodes want to use shared communication media, who goes next and how predictable is that decision?

For real-time systems:

- CSMA-CD is problematic because destructive collisions and randomized backoff make behavior hard to bound,
- CSMA-CR, as in CAN, is far more analyzable because arbitration is deterministic,
- TDMA and time-triggered designs are often easiest to bound,
- token and master-slave systems can be predictable if their control assumptions are bounded.

### Three Addressing Styles Worth Remembering

The lecture also gives a very useful addressing distinction at the data-link layer:

| Addressing style | Meaning | Example |
|---|---|---|
| direct addressing | sender explicitly names receiver(s) | Ethernet MAC addressing |
| indirect source/content addressing | the message names the content or identifier; interested receivers consume it | CAN |
| indirect time-based addressing | the message is identified by when it is sent | TTP |

This table is unusually powerful because it explains why these protocols feel so different architecturally. Ethernet says "deliver to this destination." CAN often says "this is message type X; whoever needs it listens." TTP says "this time slot means this message."

### End-to-End Delay, Not Just Per-Hop Delay

Real-time systems are evaluated by end-to-end behavior. An event may trigger:

1. a task on one node,
2. a message on the network,
3. another task on a second node,
4. another message,
5. an actuation.

The true response time is the sum of the delays along the chain, plus the way jitter propagates from one element to the next. This is why lecture 10 later develops holistic end-to-end WCRT analysis for CAN.

The systems lesson is simple but deep:

> You cannot verify a distributed control path by verifying computation and communication separately. The chain matters.

### Clock Synchronization Is a First-Class Topic

Real-time distribution forces clock synchronization into the center of the story. It matters for:

- time-triggered transmission schedules,
- bounded jitter,
- coordinated sampling and actuation,
- schedule execution in networks such as TTP, FlexRay, AVB, and TSN.

Without synchronized or sufficiently bounded clocks, a time-triggered design is only nominally time-triggered. In real systems, synchronization quality sets the floor for how small timing uncertainty can become.

This is one of the major bridge topics between many-core and distributed real-time communication. On-chip networks often focus on throughput and buffer behavior; real-time distributed systems add explicit global or bounded-local time.

### What to Remember

- In real-time systems, late can be wrong even when the payload is logically correct.
- Hard, firm, and soft deadlines imply different design disciplines.
- Embedded distributed systems are often closed systems, which enables stronger timing analysis.
- MAC protocol choice is timing policy.
- Direct, indirect-content, and indirect-time addressing explain major protocol families.
- End-to-end timing is the real correctness object, not isolated link latency.

## 8. CAN: Deterministic Arbitration on a Shared Bus

CAN is the first major concrete protocol in the note and deserves detailed treatment because it connects so many themes at once:

- shared-medium arbitration,
- deterministic priority resolution,
- non-preemptive blocking,
- worst-case response-time analysis,
- end-to-end task-message chains.

### What CAN Is

The slides describe CAN as a **multi-master CSMA/CR serial bus**. Multi-master means many nodes may initiate transmission. CSMA/CR means nodes sense the medium and resolve collisions through bit-wise arbitration rather than destructive retransmission.

The slides also note typical physical-layer figures such as:

- 1 Mbit/s up to about 50 m,
- 500 Kbit/s up to about 100 m.

The exact numbers are less important than the design lesson: CAN is a shared serial medium optimized for analyzable arbitration, not raw high bandwidth.

### Why CAN Was Attractive

Token-ring style schemes had an obvious weakness for real-time control traffic: urgent traffic might wait for the token. CAN's core improvement was to associate a priority with every message and resolve arbitration in favor of the highest-priority one without destroying the winner's transmission.

This is a beautiful design because it turns contention into deterministic priority scheduling at the physical layer.

### Identifier Semantics and Arbitration

Every CAN message has a global identifier. In the standard priority interpretation:

- smaller identifier value means higher priority,
- identifiers must be unique for distinct message types,
- each node may publish many different message types.

The physical layer supports two logical levels:

- dominant `0`,
- recessive `1`.

Nodes transmit identifier bits while simultaneously reading the bus. If a node sends a recessive bit but observes a dominant bit on the bus, it knows a higher-priority identifier is present and drops out of arbitration. The highest-priority message continues without being corrupted.

That means CAN gives:

- non-destructive arbitration,
- deterministic winner selection,
- immediate retry opportunity for losers after the winner finishes.

This is the exact opposite of CSMA-CD Ethernet, where collisions destroy the attempt and random backoff follows.

### Frame Structure and Non-Preemptive Transmission

The slides describe CAN frames with arbitration, control, data, CRC, and inter-frame spacing fields, along with bit stuffing rules. One important exam point is:

- once a frame has begun transmission, it is **non-preemptive**.

This creates a subtle but crucial behavior. A higher-priority message wins arbitration at the start of a frame, but it cannot interrupt a lower-priority frame that is already in progress. This is why lower-priority messages can still cause bounded blocking for higher-priority ones.

The slides also show that worst-case bit stuffing is bounded. For the standard 11-bit identifier case, the maximum frame transmission time can be bounded, and the slide gives a maximum frame size of 135 bit times in the worst stuffed case. That boundedness is what makes hard timing analysis feasible.

### CAN as a Scheduling Problem

Lecture 10 makes an elegant conceptual move: it adapts fixed-priority scheduling ideas from CPUs to message scheduling on CAN.

Each periodic message `i` is modeled with:

- priority `P_i`,
- period `T_i`,
- maximum transmission time `C_i`,
- queuing jitter `J_i`,
- deadline `D_i`,
- worst-case response time `R_i`.

The bridge to CPU scheduling is immediate. Higher-priority traffic interferes with lower-priority traffic. Because transmission is non-preemptive, lower-priority traffic can also block higher-priority traffic for bounded intervals.

### Critical Instant and Blocking

The critical instant idea is one of the most important CAN analysis concepts.

A message `M_i` suffers its worst-case delay when:

- it arrives with maximum queuing jitter,
- all higher-priority messages are released simultaneously,
- higher-priority messages continue arriving as early as allowed,
- a lower-priority frame may already have started transmission, causing blocking.

The blocking term is:

$$
B_i = \max_{k \in lp(i)} C_k
$$

where `lp(i)` is the set of lower-priority messages. This says that the maximum blocking for a message is the longest lower-priority frame that could have started just before `M_i` became ready.

### WCRT Formula

The lecture gives the standard iterative waiting-time computation:

$$
R_i = J_i + w_i
$$

and

$$
w_i^{n+1} = C_i + B_i + \sum_{k \in hp(i)} \left\lceil \frac{J_k + w_i^n}{T_k} \right\rceil C_k
$$

where:

- `hp(i)` is the set of higher-priority messages,
- `C_i` is the transmission time of message `i`,
- `B_i` is blocking from lower-priority transmission,
- `J_k` is release jitter of a higher-priority message `k`,
- `T_k` is the period of higher-priority message `k`.

The equation is solved iteratively until convergence. Conceptually, it says:

- a message always pays its own transmission cost,
- it may be blocked once by a lower-priority message,
- it may be repeatedly delayed by all higher-priority messages that arrive during its waiting interval.

This is exam gold because it is both mathematically specific and conceptually intuitive.

### Queuing Jitter

Students often under-explain jitter. In this context, queuing jitter means the difference between the reference arrival of the message-producing computation and the actual enqueue time of the message. If a task sometimes finishes early and sometimes late, the message it produces inherits that uncertainty.

That is why communication analysis cannot ignore computation. A message may have fixed transmission cost but still variable release timing because the task producing it is not constant-time.

### End-to-End WCRT and Attribute Inheritance

The most important extension in lecture 10 is that real systems care about **chains**, not isolated messages.

Suppose:

- task `T_A` runs on node A,
- message `M_A` is sent on CAN,
- task `T_B` runs on node B after receiving the message.

The jitter and worst-case response of one stage become input attributes to the next stage. The slides call this attribute inheritance. End-to-end worst-case response time is therefore a holistic property of the entire task-message-task path.

This is one of the central lessons of the whole course:

> A distributed real-time path is schedulable only if both local computations and communications compose into a bounded end-to-end chain.

### Why CAN Still Matters

CAN is not the highest-bandwidth protocol in the note, but it is pedagogically ideal because it makes arbitration, scheduling, and timing analysis concrete on a shared bus. It teaches that:

- deterministic shared-medium access is possible,
- priorities can be embedded in identifiers,
- non-preemptive transmission creates bounded blocking,
- worst-case response time can be derived rather than guessed.

### What to Remember

- CAN is multi-master CSMA/CR with non-destructive bit-wise arbitration.
- Smaller identifier means higher priority.
- Transmission is non-preemptive once a frame starts.
- WCRT analysis on CAN mirrors fixed-priority scheduling analysis on CPUs.
- The critical instant includes both higher-priority interference and lower-priority blocking.
- End-to-end real-time analysis must compose tasks and messages, not analyze them separately.

## 9. TTP and FlexRay: Time-Triggered and Hybrid Real-Time Communication

If CAN is the clean example of event-triggered prioritized arbitration, TTP and FlexRay show what happens when determinism and schedule structure are pushed further.

### Event-Triggered, Time-Triggered, and Hybrid

The real-time networking lecture classifies communication styles as:

- **event-triggered (ET)**: send when something happens,
- **time-triggered (TT)**: send at predefined times,
- **hybrid ET+TT**: combine both.

The tradeoff is central:

| Style | Main strength | Main weakness |
|---|---|---|
| ET | flexible, responsive to sporadic events | harder worst-case analysis, traffic-dependent jitter |
| TT | strong predictability, easier bounded delay | less flexible, unused slots can waste capacity |
| hybrid | balances determinism with adaptability | more design complexity |

CAN is on the ET side. TTP is on the TT side. FlexRay occupies the hybrid space.

### TTP: The Time-Triggered Idea

TTP was designed around the principle that global temporal structure can make dependability and timing assurance easier. The slides state that TTP/C is a dual-channel 25 Mbit/s time-triggered field bus and can use one or both channels, with redundant communication possible by replicating data.

The most important thing about TTP is not the raw number. It is the idea that communication is driven by time rather than contention.

In TTP, hosts know ahead of time when messages will be transmitted. That enables:

- coordinated local activity scheduling,
- bounded latency jitter,
- better predictability for sensing and control loops.

The slides explicitly note that while CAN has traffic-dependent jitter, TTP's latency jitter is determined largely by clock synchronization precision and is on the order of microseconds.

### What a Message Means in TTP

One nice conceptual point in lecture 11 is that a message can be treated as an atomic statement about system state. A message carries:

- the name of the state variable or event,
- the observed value,
- the observation time.

This framing is very natural for control systems. Communication is not just moving bytes. It is establishing a temporally meaningful shared view of state across nodes.

### TTP/A vs TTP/C

| Protocol | Intended class | Character |
|---|---|---|
| TTP/A | soft real-time, lower-cost settings | scaled-down, cheaper, master/slave variant |
| TTP/C | hard real-time, safety-critical settings | full time-triggered, fault-tolerant distributed variant |

This split is helpful because it reminds us that one "time-triggered" idea can be implemented at different cost and assurance levels.

### MEDL and Schedule Knowledge

The slides reference MEDL, the message descriptor list, as the structured schedule knowledge used by the system. The details are protocol-specific, but the deeper lesson is that TT systems externalize communication policy into a schedule artifact. Communication becomes table-driven and analyzable.

That is a major difference from ET protocols where timing emerges from releases, priorities, and contention.

### FlexRay as a Hybrid Design

FlexRay is the bridge protocol between pure time-triggered determinism and more dynamic event-driven behavior. The slides describe it as:

- deterministic,
- scalable,
- fault-tolerant,
- designed for automotive applications,
- supporting up to 10 Mbit/s,
- usable in single- or dual-channel configurations.

Dual channels can either:

- increase bandwidth by using both channels productively,
- or increase fault tolerance by sending redundant data.

That is a classic systems design choice: efficiency versus redundancy.

### FlexRay Communication Cycle

FlexRay organizes time into cycles, typically around 1 to 5 ms. Each cycle contains four main parts:

- static segment,
- dynamic segment,
- symbol window,
- network idle time.

This is one of the most important structures to memorize.

#### Static Segment

The static segment is TDMA-like. Slots are reserved for deterministic periodic data. All static slots have the same duration. In dual-channel systems, the corresponding slot sizes are synchronized across channels.

If a node owns the slot:

- it sends its frame if one is scheduled and ready,
- otherwise it still sends a null frame.

This is conceptually important. A slot is owned, not opportunistically reused by others. Determinism is gained by sacrificing some efficiency.

#### Dynamic Segment

The dynamic segment handles event-driven traffic with a priority-like minislot mechanism. Lower slot numbers have higher precedence. This resembles CAN in spirit but not in exact arbitration behavior.

The slides emphasize a subtle but exam-worthy fact:

> It is possible for a message to be ready and for the network to have had enough idle time in principle, yet the message still does not transmit because the minislot schedule and priorities work against it.

That is the price of fitting dynamic behavior into a cycle-structured protocol.

#### Symbol Window and Network Idle Time

The symbol window is used for maintenance and startup signaling. Network idle time provides a quiet interval that supports synchronization between node clocks.

This again shows how real-time communication protocols must explicitly budget maintenance and synchronization overhead rather than pretending communication is only payload.

### Scheduling and Composition

The FlexRay slides discuss schedule composition and cycle multiplexing. That is important because real applications may need different message periods, not just one fixed cycle rate. Frames can be transmitted on cycle multiples to achieve slower periodic rates.

This is a broader systems lesson:

> Deterministic communication is not merely about fixed slots; it is about composing schedules so that application periods, bandwidth, and synchronization all coexist.

### CAN vs TTP vs FlexRay

| Protocol | Communication style | Strength | Cost |
|---|---|---|---|
| CAN | event-triggered, priority-based | flexible and analyzable ET communication | traffic-dependent jitter, lower bandwidth |
| TTP | time-triggered | strongest determinism and low jitter | inflexible, schedule-centric |
| FlexRay | hybrid static + dynamic | combines deterministic and event-driven traffic | more protocol complexity |

This comparison is precisely the kind of synthesis exams often reward.

### What to Remember

- ET, TT, and hybrid protocols answer different timing problems.
- TTP pushes predictability through synchronized schedules and very low jitter.
- TTP/A and TTP/C target different assurance and cost levels.
- FlexRay combines a static deterministic segment with a dynamic event-driven segment.
- Dual channels can buy either bandwidth or fault tolerance.
- Schedule composition is part of the protocol design problem, not an afterthought.

## 10. Automotive Ethernet, AVB, TTEthernet, and TSN

The final protocol family in the note shows how the bandwidth and integration pressure of modern systems pushes toward switched Ethernet, but only after Ethernet is augmented with time and traffic management features.

### Why Ethernet Enters the Car

The Automotive Ethernet slides describe the car as a distributed computer and communication system partitioned into functional domains such as:

- powertrain,
- chassis,
- body and comfort,
- telematics and infotainment,
- ADAS.

These domains are bridged by gateways. As cameras, diagnostics, software updates, infotainment streams, and ADAS workloads grow, bandwidth demand grows too. The slides emphasize both application pull and technology push:

- more data-intensive applications,
- better scalability of switching compared with buses,
- low-cost mass-production ecosystem,
- compatibility with IP-based tooling and infrastructure.

This is why Ethernet enters even though CAN and FlexRay remain deeply entrenched.

### Why Plain Ethernet Is Not Enough

Traditional shared Ethernet with CSMA-CD is not a good real-time solution because collisions are destructive and backoff is randomized. The real-time networking lecture already made that point. Switched Ethernet removes much of the collision issue, but it still does not automatically provide deterministic end-to-end timing.

Therefore the real question becomes:

> How do we keep Ethernet's scalability while restoring analyzable timing behavior?

The rest of the section answers that question.

### AVB: Audio Video Bridging

The slides present AVB as a set of IEEE mechanisms that provide time-synchronized low-latency streaming over Ethernet. The cited components include:

- `802.1AS` for time synchronization,
- `802.1Qat` for stream reservation,
- `802.1Qav` for queueing and forwarding with credit-based shaping,
- `802.1BA` for AVB system profiles.

The basic idea is:

- synchronize clocks,
- reserve resources along the path,
- shape traffic to reduce bursts,
- separate traffic classes.

This is already a huge conceptual shift from best-effort Ethernet. Communication is no longer "send and hope the switch fabric behaves." It is contract-oriented and class-aware.

The slides note that AVB supports bounded-latency stream classes across a multi-hop network. The exact numbers matter less than the structural point: Ethernet begins to support analyzable service classes rather than only best effort.

### Credit-Based Shaping

AVB uses credit-based shaping to smooth traffic. The mechanism maintains per-class credit variables. A queue may transmit when its credit is nonnegative. Credit rises while the class waits and falls when it transmits.

Advantages:

- fairer treatment of lower-priority traffic than naive strict priority,
- smoother traffic and less burst-induced congestion,
- better practical QoS separation.

Disadvantages:

- average delay can increase,
- non-preemptive transmission still hurts worst-case behavior,
- large interfering frames can still delay time-sensitive traffic.

The slides explicitly note that worst-case delay can become too high for some control applications, which is one reason AVB alone is not the final answer for hard real-time automotive communication.

### TTEthernet

TTEthernet is an especially elegant bridge because it mixes time-triggered determinism with Ethernet compatibility. The slides describe three traffic classes:

- **TT**: time-triggered deterministic traffic with highest precedence,
- **RC**: rate-constrained traffic with bounded rate and jitter/delay properties,
- **ET**: event-triggered best-effort traffic.

This is a superb example of mixed-criticality communication design. Different traffic classes do not merely get different priorities; they get different service contracts.

### TSN: Time-Sensitive Networking

TSN extends and generalizes the time-aware and reservation-oriented direction beyond AVB. The Automotive Ethernet slides highlight one key conceptual change:

- AVB uses more distributed hop-by-hop shaping,
- TSN introduces more centralized scheduling for critical traffic.

That matters because distributed shaping can still leave non-deterministic interference patterns, while global schedule knowledge can eliminate them more aggressively.

### Time-Aware Shaping

The `802.1Qbv` time-aware shaper is one of the anchor TSN concepts. Switch output queues are gated according to a communication schedule synchronized through `802.1AS`. In effect, Ethernet acquires a time-triggered discipline per traffic class.

That means:

- scheduled classes get contention-free transmission windows,
- queues are opened and closed according to time,
- time synchronization becomes a direct dependency of communication correctness.

This is precisely the point where Ethernet starts to resemble time-triggered field buses in behavior, while still retaining the scalability of switching.

### Guard Bands and Preemption

The slides note that guard bands are needed so that a non-time-aware frame does not overrun into a scheduled time slot. Guard bands waste capacity if left idle. Frame preemption reduces this waste by allowing a long frame to be fragmented and resumed around higher-criticality scheduled traffic.

This is a beautiful illustration of a recurring systems theme:

- hard guarantees often waste resources,
- additional mechanism can claw some efficiency back,
- but only by increasing protocol complexity.

### Path Control and Reservation

The slides also mention path control and reservation work such as `802.1Qca`, which supports explicit path control, bandwidth reservation, redundancy, and distribution of timing-control parameters. This is important because hard real-time service depends not only on local switch behavior but on path-level structure across the whole network.

### Safety and Timing Contracts

The last part of the Automotive Ethernet material is about safety, not just performance. TSN is not only about delay and throughput; automotive communication is safety-critical. The slides mention:

- hazard analysis,
- risk management,
- risk control,
- contract-based timing safety,
- timing budgeting and monitoring,
- compositional guarantees.

This is the right end point for the entire note. We began with threads and contention. We end with a system where timing itself is a contractual safety property spanning components and network infrastructure.

### Ethernet vs CAN/FlexRay: The Big Picture

| Protocol family | Main strength | Main weakness | Typical role |
|---|---|---|---|
| CAN | simple deterministic arbitration on a shared bus | limited bandwidth, traffic-dependent jitter | distributed control and status traffic |
| FlexRay | hybrid deterministic + event-driven automotive bus | higher complexity, still specialized | safety-critical and x-by-wire style applications |
| AVB/TSN Ethernet | scalable switched fabric with rich traffic classes | greater infrastructure and scheduling complexity | high-bandwidth integrated in-vehicle networking |

The important exam answer is not "Ethernet replaces everything." The slides are much more nuanced. Ethernet is likely to coexist with entrenched protocols while expanding into more demanding domains. The future question is how far a homogeneous Ethernet-based E/E architecture can go while still satisfying energy, safety, and timing demands.

- Ethernet enters automotive systems because of bandwidth, scalability, and ecosystem advantages.
- Plain Ethernet is not enough for hard timing guarantees.
- AVB adds synchronization, reservation, and shaping for low-latency stream traffic.
- TTEthernet explicitly supports TT, RC, and ET traffic classes.
- TSN uses synchronized schedules and time-aware shaping to push Ethernet toward hard real-time service.
- Safety turns timing into a contractual, system-wide property.

### Final Framing Sentence

The most important framing sentence in the entire note is this:

> A many-core architecture is not the same thing as a cloud distributed system, but it already forces us to think like a distributed-systems engineer: about contention, locality, communication contracts, partial progress, interference, timing, and compositional correctness.

If that sentence feels true by the end of the note, the note has done its job.

## 11. Compact Recall Map

### Most Important Distinctions

| Distinction | One-line answer to remember |
|---|---|
| concurrency vs parallelism | concurrency is overlapping progress; parallelism is simultaneous execution |
| distribution vs parallelism | distribution is separated by communication boundaries, not just multiple cores |
| thread vs process | threads share address space by default; processes isolate it by default |
| core vs thread | a core is hardware; a thread is a schedulable software context |
| coherence vs consistency | coherence is per-location correctness; consistency is cross-location visibility order |
| event-triggered vs time-triggered | ET reacts to events; TT follows an explicit schedule |
| best effort vs guaranteed service | best effort aims for fairness and average behavior; guaranteed service needs traffic assumptions and bounds |
| deadlock vs livelock | deadlock means no progress; livelock means endless motion without useful progress |

### Core Formulas

1. **Zero-load network latency**

$$
T_0 = H_{\min} t_r + \frac{D_{\min}}{v} + \frac{L}{b}
$$

Interpretation: router delay + wire delay + serialization delay.

2. **Traffic envelope**

$$
A(T) \le \sigma + \rho T
$$

Interpretation: in any interval `T`, injected traffic is bounded by burst `sigma` plus rate `rho T`.

3. **Simple delay bound**

$$
D_{\max} = \frac{\sigma}{b - \rho}, \qquad b > \rho
$$

Interpretation: if service margin shrinks, worst-case delay grows rapidly.

4. **CAN blocking**

$$
B_i = \max_{k \in lp(i)} C_k
$$

Interpretation: message `i` can be blocked by one lower-priority frame already in transmission.

5. **CAN response time**

$$
R_i = J_i + w_i
$$

$$
w_i^{n+1} = C_i + B_i + \sum_{k \in hp(i)} \left\lceil \frac{J_k + w_i^n}{T_k} \right\rceil C_k
$$

Interpretation: own transmission + lower-priority blocking + repeated interference from higher-priority traffic.

### Best Comparison Tables to Memorize

#### Interconnects

| Interconnect | Best property | Main limitation |
|---|---|---|
| bus | simple, broadcast, total order | serialization bottleneck |
| crossbar | many simultaneous transfers | wiring and complexity cost |
| NoC | scalable parallel communication | routing and buffering complexity |

#### Real-Time Protocols

| Protocol | Style | Key idea |
|---|---|---|
| CAN | event-triggered | non-destructive priority arbitration on a shared bus |
| TTP | time-triggered | globally scheduled, low-jitter communication |
| FlexRay | hybrid | static deterministic slots plus dynamic event-driven segment |
| TSN Ethernet | scheduled switched Ethernet | time-aware shaping and class-based traffic control |

#### Major Design Tradeoffs

| If you want more... | you usually pay with... |
|---|---|
| flexibility | weaker predictability |
| stronger isolation | more communication overhead |
| higher utilization | worse worst-case latency |
| stronger guarantees | lower average efficiency or more complexity |
| more adaptivity | harder analysis and deadlock/livelock risk |

