---
title: Automation, Robotics, and Machine Vision Basics
tags: [automation, robotics, machine vision, PLC, pneumatics, sensors, kinematics, Denavit-Hartenberg, manipulator dynamics, image processing, design for assembly]
style: fill
color: light
description: A foundations note on automated production, from part feeding, sensing, PLC logic and pneumatics to robot kinematics, dynamics and control, and the image-processing chain of machine vision.
---

_This note is adapted from course materials for **MNE3046 Automation Technology** and **MNE4032 Robotics and Machine Vision** at **City University of Hong Kong**. Instructor: Dr. Alexandar Djordjevich._

## Central Question

How do we make a physical process run repeatedly without a person in the loop, and what sensing, logic, motion, and perception do we need to make that safe, flexible, and worth the cost?

Automation is a technique for lowering cost, raising quality, or doing work people should not do. It is rarely a single device. It is a chain: parts are presented, sensed, moved, processed, and checked, and each link has its own physics and failure modes. The note follows that chain:

$$
\text{part handling}
\rightarrow \text{sensing}
\rightarrow \text{logic control}
\rightarrow \text{actuation}
\rightarrow \text{robot motion}
\rightarrow \text{vision}
\rightarrow \text{system cost and limits}.
$$

It sits between the process view in [Manufacturing Notes]({% post_url 2019-06-21-Manufacturing %}) and the feedback view in [Control Theory Basics]({% post_url 2019-05-18-control-theory-basics %}) and [Modern, Multivariable, and Networked Control]({% post_url 2020-08-18-modern-control-foundations %}).

---

## 1. Fixed, Programmable, and Flexible Automation

- **Fixed (hard) automation** is a dedicated sequence built into the hardware: cams, mechanical stops, hard-wired relays. It gives the lowest unit cost at very high volume and is expensive and slow to change.
- **Programmable automation** changes the sequence by changing a program (a PLC program, a robot program). Changeover happens in batches.
- **Flexible automation** changes between products with little or no lost time, because part identity, tooling, and program are selected automatically.

The choice is economic and organizational as much as technical. Fixed cost is spread over volume, so the cost per part is roughly $C_F/N + C_V$ (see the cost discussion in the manufacturing note). A frequent practical problem is where to start: the first automation step is usually the cheapest repeated motion with the clearest sensing, not the most impressive one. Automated workcells then combine into larger systems, and a systems engineer must be able to talk to specialists in several narrow disciplines (mechanics, pneumatics, electronics, software, vision) without a communications gap.

---

## 2. Part Handling: Feeding, Orienting, Transferring

Most automation effort goes into getting the right part to the right place in the right orientation, not into the operation itself.

**Feeders** supply parts from bulk:

- **Vibratory bowl feeders** use a tilted helical track and a small vibration. The track motion lets parts hop and creep up the track; the maximum acceleration grows with vibration amplitude and frequency. A part moves when the vertical acceleration lifts it or the tangential acceleration exceeds friction, so orientation tooling can be built into the track.
- **Hopper feeders** (reciprocating tube, external gate, centreboard, elevating) lift or select parts from a pile. They are load-sensitive: their throughput changes with how full the hopper is, so check performance with prisms, headed parts, and different shapes, not just the design part.
- **Orienting devices** are passive and exploit geometry: cutouts remove parts lying the wrong way, wiper blades and dams knock off stacked or edge-standing parts, and shaped tracks admit only the correct orientation.

![A vibratory bowl feeder with parts climbing a helical track](https://commons.wikimedia.org/wiki/Special:FilePath/Bowl_Feeder.jpg?width=800)
Figure 1. A vibratory bowl feeder: vibration moves the parts up a helical ramp, and a slot in the track wall rejects those that are mis-oriented. Source: [File:Bowl Feeder.jpg](https://commons.wikimedia.org/wiki/File:Bowl_Feeder.jpg). License: Public domain.

**Feed tracks** move parts to the work head by gravity (inclined sections) or by powered tracks. **Escapements** (ratchet, star-wheel, worm, drum-spider) release one part at a time. The ultimate flexible transfer is a pick-and-place mechanism or robot guided by a computer and sensors.

**Design for assembly** (DFA) guidelines make parts easy to automate:

1. Minimise the number of parts.
2. Provide a base part with a good datum and a single assembly direction.
3. Avoid projections, holes, or slots that tangle or jam.
4. Make parts symmetric where possible, or clearly asymmetric where orientation matters.
5. Provide lead-in chamfers and tolerances that tolerate positioning error.

Product design decides how hard automation will be: a part that tangles in a bowl is a design problem, not a feeder problem.

---

## 3. Sensing: What the Controller Can Know

A controller only knows what its sensors tell it. Typical part and motion sensors:

- **Limit and end-of-stroke switches** give a hard two-state signal at a position.
- **Inductive proximity sensors** detect metal without contact and are the most widely used non-contact device in factories.
- **Reflective optical switches** use the difference in reflectivity between an object and its background. Ambient light, the choice of emitter and detector, and sensor-to-sensor interference decide whether the signal is reliable.
- **Analog sensors** produce signals that are continuous at the source and are digitized before logic uses them.
- **Mechanical contact bounce.** A mechanical switch chatters briefly when it opens or closes, so logic needs a debounce delay or a latch.

**Encoders** measure position. An incremental encoder counts pulses from a slotted disc and gives relative position; two channels 90 degrees apart give direction. An absolute encoder reads a code (preferably Gray code, so only one bit changes between neighbours) from several tracks, and with $N$ tracks it resolves $2^N$ positions, so the resolution is $360^\circ/2^N$. A 10-track encoder resolves about $0.35^\circ$. Low-resolution encoders can be moulded cheaply from toothed discs; high resolution needs finer optics.

---

## 4. Logic Control: PLCs, Sequences, and Pneumatics

### 4.1 PLCs and ladder logic

A **programmable logic controller** (PLC) is an industrial computer with rugged input and output modules. It runs a repeating scan: read inputs, execute the program, write outputs. Programs are often drawn as ladder diagrams, where each rung is a Boolean expression: series contacts are AND, parallel contacts are OR, and a coil is the output. A standard **seal-in (latch)** rung is

$$
M = (x + M)\cdot\overline{\text{stop}},
$$

so a momentary start $x$ keeps the output $M$ on until stop is pressed. The same relay can appear on several rungs, so check for unintended interactions.

![Structure of a ladder logic program](https://commons.wikimedia.org/wiki/Special:FilePath/Ladder_logic_diagram.jpg)
Figure 2. Ladder diagram structure: two vertical power rails, with each rung a series of contacts (inputs, such as X1 normally open, X2 normally closed) driving a coil (output, such as Y1, Y2). Source: [File:Ladder logic diagram.jpg](https://commons.wikimedia.org/wiki/File:Ladder_logic_diagram.jpg). License: CC BY-SA 4.0.

For the diagram, rung 0 is $Y1=X1$ and rung 1 is $Y2=\overline{X2}$. In relay logic a normally open contact conducts when its input is true and a normally closed contact conducts when it is false.

Automation control systems fall into four classes: two-state on/off, combinational (the output depends only on current inputs), sequential (the output also depends on history), and continuous control. Sequential problems are best designed with a **state diagram**: list the states (for example a gripper sequence: down, close, up, move, down, open, up, return), the sensor conditions that cause each transition, and the actuator outputs in each state. Encode states so that only one bit changes per transition where possible, to avoid glitches, and always define what happens on a stop, a missed sensor, or a power loss.

### 4.2 Pneumatics

Industrial pneumatics converts compressed air energy into force and motion with cylinders, controlled by valves. More than 60% of machine movements are linear, and a pneumatic cylinder is often simpler and lighter than a motor with reducer and screw, which matters when it is carried by a robot. It is especially good for clamping, holding, and gripping, because holding force costs nothing in energy once pressure is held.

- Theoretical cylinder force is $F=pA$. A 40 mm bore at 6 bar gives $A=\pi(0.02)^2\approx1.26\times10^{-3}\ \text{m}^2$ and $F\approx 750$ N before friction.
- **Single-acting** cylinders return by spring; **double-acting** cylinders are driven both ways. Cushioning slows the piston near the end of stroke; locking units hold a rod between ends.
- A **3/2 directional control valve** (three ports, two positions) drives a single-acting cylinder. A **5/2** valve drives a double-acting one; a **5/3** valve adds a neutral position.
- **Shuttle valves** give logic OR; two-pressure valves give AND. Speed is set by flow controls, and two forward speeds need a switching arrangement.
- A **functional state diagram** shows each cylinder's position against steps, with end-of-stroke sensors triggering the next step, so the control circuit follows directly.

---

## 5. Robot Fundamentals

An industrial robot is a programmable manipulator with three or more axes. About 70% of industrial use is welding and painting, 20% pick and place, and 10% other tasks. Robots are used for heavy or unsafe work, repeatability, rate, and flexibility. Important specifications are workspace, payload, repeatability (return to a taught point) versus accuracy (reach a commanded point), speed, and the number of degrees of freedom (DoF). **Joints** (revolute or prismatic) give DoF; **links** connect them; the **end effector** (gripper, vacuum cup, power tool, welding head) does the work.

Common arm geometries: articulated (revolute), SCARA, Cartesian (linear axes, simplest to control), cylindrical, spherical, and delta. A point-to-point robot moves between taught points; a continuous-path robot follows a trajectory. Offline simulation programs a robot on a computer and downloads the program, avoiding line downtime.

### 5.1 Pose and homogeneous transforms

A point in a frame is $(x,y,z)$; a rigid transformation combines rotation $R$ and translation $\mathbf{p}$ in a $4\times4$ matrix:

$$
T=\begin{bmatrix}R&\mathbf{p}\\\mathbf{0}^\top&1\end{bmatrix}.
$$

Elementary rotation about $z$ by $\theta$ has $R=\begin{bmatrix}c\theta&-s\theta&0\\\\ s\theta&c\theta&0\\\\0&0&1\end{bmatrix}$. Transforms compose by multiplication, and **order matters**: rotating $90^\circ$ about $y$ then $90^\circ$ about $z$ gives a different final orientation from the reverse order. Rotating relative to the current frame post-multiplies; rotating relative to the fixed frame pre-multiplies.

### 5.2 Forward kinematics and the Denavit-Hartenberg convention

**Forward kinematics** maps joint variables to end-effector pose; **inverse kinematics** does the reverse. The Denavit-Hartenberg (D-H) convention assigns a frame to each link and describes the step from frame $i-1$ to frame $i$ with four parameters:

- $\theta_i$: joint angle, rotation about $z_{i-1}$ (variable for a revolute joint);
- $d_i$: offset along $z_{i-1}$ (variable for a prismatic joint);
- $a_i$: link length, distance along $x_i$;
- $\alpha_i$: link twist, rotation about $x_i$.

The transform is

$$
{}^{i-1}T_i=\begin{bmatrix}c\theta_i&-s\theta_i c\alpha_i&s\theta_i s\alpha_i&a_i c\theta_i\\ s\theta_i&c\theta_i c\alpha_i&-c\theta_i s\alpha_i&a_i s\theta_i\\0&s\alpha_i&c\alpha_i&d_i\\0&0&0&1\end{bmatrix},
$$

and the end-effector pose in the base frame is the product ${}^0T_n={}^0T_1\,{}^1T_2\cdots{}^{n-1}T_n$. To assign frames: put $z_{i-1}$ along the axis of joint $i$, place $x_i$ along the common normal between consecutive axes (and use the right-hand rule), and put the last origin at the end-effector tip.

![Denavit-Hartenberg parameters between two coordinate frames](https://commons.wikimedia.org/wiki/Special:FilePath/Denavit-Hartenberg-Transformation.svg?width=500)
Figure 3. Coordinate frames and Denavit-Hartenberg parameters: $\theta_1$ about $Z_0$, offset $d_1$ along $Z_0$, link length $a_1$ along $X_1$, and twist $\alpha_1$ about $X_1$. Source: [File:Denavit-Hartenberg-Transformation.svg](https://commons.wikimedia.org/wiki/File:Denavit-Hartenberg-Transformation.svg). License: Public domain.

Worked example: planar two-link arm, link lengths $l_1=l_2=1$ m, joint angles $\theta_1=30^\circ$, $\theta_2=60^\circ$:

$$
x=l_1c_1+l_2c_{12}=0.866+0=0.866\ \text{m},\qquad y=l_1s_1+l_2s_{12}=0.5+1=1.5\ \text{m},
$$

since $c_{12}=\cos 90^\circ=0$. Inverse kinematics for the same arm: $\cos\theta_2=(x^2+y^2-l_1^2-l_2^2)/(2l_1l_2)$ gives two solutions (elbow up and down), and no solution if the point is out of reach.

### 5.3 Jacobian and singularities

Velocities map through the Jacobian, $\dot{\mathbf{x}}=J(\mathbf q)\dot{\mathbf q}$. For the planar two-link arm,

$$
J=\begin{bmatrix}-l_1s_1-l_2s_{12}&-l_2s_{12}\\ l_1c_1+l_2c_{12}&l_2c_{12}\end{bmatrix},\qquad \det J=l_1l_2\sin\theta_2 .
$$

At $\theta_2=0$ or $\pi$ (arm fully stretched or folded) $\det J=0$: a **singularity**. The arm loses a direction of motion, and near it joint speeds required for a given tip speed grow without bound. The same Jacobian gives forces: $\boldsymbol\tau=J^\top\mathbf F$. Wrist singularities and the choice of a spherical wrist (three axes crossing at a point) decouple position from orientation and simplify inverse kinematics.

### 5.4 Dynamics (Lagrange)

For generalized coordinates $q_i$ the Lagrangian is $\mathcal L=K-P$ (kinetic minus potential energy) and

$$
\frac{d}{dt}\frac{\partial\mathcal L}{\partial\dot q_i}-\frac{\partial\mathcal L}{\partial q_i}=\tau_i .
$$

This yields the manipulator equation $M(\mathbf q)\ddot{\mathbf q}+C(\mathbf q,\dot{\mathbf q})\dot{\mathbf q}+\mathbf g(\mathbf q)=\boldsymbol\tau$, with the inertia matrix $M$ configuration-dependent and symmetric positive definite. For a 2-link planar arm with point masses $m_1,m_2$ at the link ends,

$$
M=\begin{bmatrix}(m_1+m_2)l_1^2+m_2l_2^2+2m_2l_1l_2c_2& m_2l_2^2+m_2l_1l_2c_2\\ m_2l_2^2+m_2l_1l_2c_2& m_2l_2^2\end{bmatrix}.
$$

The off-diagonal terms show **inertial coupling** between joints, and Coriolis and centripetal terms appear with $\dot q_1\dot q_2$ and $\dot q_i^2$. Steps for any manipulator: write $K$ and $P$, form $\mathcal L$, differentiate, and group terms. See [Topics in Nonlinear Systems]({% post_url 2023-03-18-topics-in-nonlinear-systems %}) for why computed-torque or feedback-linearization control relies on exactly this model.

### 5.5 Actuation, control, and mobile robots

- **Electric motors** dominate and need large speed reduction (gears, harmonic drives), which adds backlash and friction; **linear drives** (Cartesian axes with belts or screws) simplify control. Hydraulics suit heavy loads; pneumatics suit grippers.
- **Control architecture:** a task program and user interface feed a motion-demand generator, then axis control loops (position, velocity, current) closed on encoder feedback. Errors in series arms accumulate, so absolute accuracy needs calibration even when repeatability is good. Joint control is covered in [Actuation, Electric Drives, and Embedded Control]({% post_url 2023-10-03-actuation-electric-drives-embedded-control %}).
- **Mobile robots.** A differential-drive base with wheel speeds $v_L,v_R$ and track width $b$ has forward speed $v=(v_R+v_L)/2$ and turn rate $\omega=(v_R-v_L)/b$. Guidance uses wall following, coloured tape, buried conductors, or maps (distance maps, roadmaps); AGVs follow fixed paths and AMRs plan their own.
- **Tactile and force sensing** (fingers and muscles in humans) gives grasp and contact feedback.

---

## 6. Machine Vision

Machine vision extracts information from an image, usually to give a pass/fail inspection result or a part location. Its roots are in industrial automation: optical character recognition, dimensional and defect inspection, object recognition, and measurement. Machine vision is a data-acquisition system: a camera and lens form an image, **lighting** makes the feature of interest separable, and software turns pixel intensities into numbers.

### 6.1 Acquisition and lighting

Photosites on a CCD or CMOS array accumulate charge proportional to light, which is read out in sequence and digitized. Because the whole image changes when the light, camera, or object moves, the great advantage of manufacturing is that lighting and geometry can be controlled:

- **Front illumination** (camera and light on the same side) shows surface texture and defects.
- **Back illumination** (a silhouette) gives sharp edges for dimensional measurement.
- **Structured light** projects a pattern; its distortion on a surface gives shape.
- Good lighting design can make thresholding trivial, which is cheaper than clever software.

### 6.2 Image processing operations

An image is a matrix $I(u,v)$ of intensities. Operations fall into classes:

- **Monadic (point) operations** change each pixel by a function of its own value: stretch, threshold, inverted threshold, interval threshold. A **histogram** with distinct peaks (dark background, bright object) suggests a threshold between peaks.
- **Dyadic operations** combine two images pixel by pixel: subtraction against a background reference image finds a part without needing a plain background.
- **Spatial operations** use a neighbourhood and a kernel: convolution $O(u,v)=\sum_{i,j}K(i,j)I(u-i,v-j)$. An averaging kernel of equal weights summing to one smooths; a Gaussian kernel smooths with better frequency behaviour; a median filter removes salt-and-pepper noise that linear filters smear.
- **Edges** are large intensity gradients, found with derivative kernels (Sobel, Prewitt). The Laplacian responds equally to edges in any direction but amplifies noise, so smooth first. A **corner** is where two edge directions meet.
- **Morphology** uses a small structuring element: erosion shrinks, dilation grows, opening removes small specks, and closing fills small gaps in binary images.

### 6.3 Segmentation and features

Regions are found by thresholding, by colour, or by connectivity (labelling connected components). A region is then described by numbers, for example moments

$$
m_{pq}=\sum_{u,v}u^pv^q I(u,v),
$$

with area $m_{00}$, centroid $(m_{10}/m_{00},\ m_{01}/m_{00})$, and orientation from the second central moments. These feed decisions: pass or fail, pick coordinates for a robot, and so on. Learning-based methods (neural networks) can extract features from complex scenes where hand-built rules fail, but they have failed repeatedly in specific domains, and controlled lighting remains the cheapest path to robustness.

---

## 7. What This Framework Lets Us Do

- Decide whether an operation should be fixed, programmable, or flexible from volume and variety.
- Design a feeder, track, and fixture chain, and use DFA guidelines to make parts automation-friendly.
- Choose sensors by what must be known, and size a pneumatic actuator from pressure and bore.
- Write a sequence as a state diagram and then as ladder logic.
- Compute a robot's pose, singularities, and joint torques for a planar arm, and know what a D-H table is for.
- Plan a vision pipeline: lighting, threshold, filter, segment, measure.

## 8. Where the Framework Stops Being Reliable

- Sequence logic assumes sensors are right; real systems need timeouts, fault states, and manual recovery.
- Rigid-body kinematics ignores compliance, backlash, thermal drift, and calibration error, so accuracy is worse than repeatability.
- Robots are poor at tasks needing both high force and high accuracy, such as machining.
- Vision pipelines with fixed thresholds fail when lighting, surface finish, or part variety changes.
- Singularities, joint limits, and workspace holes are properties of the mechanism, not of the controller.

## 9. Compact Recall Map

1. Automation is a chain: handle, sense, decide, actuate, check.
2. Fixed, programmable, flexible: choose by volume and variety.
3. Most effort goes into part presentation; design parts for it.
4. Sensor choice limits control; debounce and latch.
5. Sequential logic needs a state diagram; PLCs scan inputs, program, outputs.
6. Pneumatics give cheap linear force; $F=pA$.
7. Transforms compose by multiplication, and order matters.
8. D-H turns any serial arm into four parameters per joint.
9. $\det J=0$ is a singularity; $\tau=J^\top F$.
10. Lagrange gives $M\ddot q+C\dot q+g=\tau$.
11. Vision: light first, then threshold, filter, segment, measure.

---

## Sources and Further Reading

- CityU MNE3046 Automation Technology course notes (feeders, part transfer, design for assembly, sensing, PLCs, motion control, pneumatics).
- CityU MNE4032 Robotics and Machine Vision course notes.
- S. B. Morriss, _Automated Manufacturing Systems_.
- N. P. Mahalik, _Mechatronics_.
- M. W. Spong, S. Hutchinson, and M. Vidyasagar, _Robot Modeling and Control_ (Wiley, 2006).
- P. Corke, _Robotics, Vision and Control: Fundamental Algorithms in MATLAB_ (Springer, 2011).
- B. Siciliano and O. Khatib (eds.), _Springer Handbook of Robotics_.
