---
layout: default
title: Publication
permalink: /pub/
weight: 1
---

# Research
*(\*: equal contribution)*

**Please feel free to contact me if you are interested in any of the following works.**

### Journal Publications

<div class="pub-entry">
  <img src="https://ars.els-cdn.com/content/image/1-s2.0-S1568494624013425-gr4.jpg" alt="Control system architecture. The actuator and electrical firmware are physically integrated into the robot. The unidirectional arrows surrounding radio waves denote the transmission and reception of messages between soft robots and the edge server." class="pub-thumb">
  <div class="pub-text">
    <h3>Optimal gait design for a soft quadruped robot via multi-fidelity Bayesian optimization</h3>
    <p><strong>Authors:</strong> <a href="https://kaigetan.github.io/">Kaige Tan</a>, <strong>Xuezhi Niu</strong>, <a href="https://qinglei.tech/">Qinglei Ji</a>, <a href="https://www.kth.se/profile/lfeng">Lei Feng</a> & <a href="https://www.kth.se/profile/martint">Martin Törngren</a></p>
    <p><em>Applied Soft Computing</em>, 2025</p>
    <p class="pub-links">
      <a href="https://doi.org/10.1016/j.asoc.2024.112568">[Paper]</a>
      <a href="https://github.com/KaigeTan/MFBO_KTH">[Code]</a>
      <a href="#" class="toggle" data-target="abs-asoc">[Abstract]</a>
      <a href="#" class="toggle" data-target="bib-asoc">[BibTeX]</a>
    </p>
    <div class="pub-toggle-container">
			<div id="abs-asoc" class="toggle-target" hidden>
        <div class="pub-abs-body">
          This study focuses on the locomotion capability improvement in a tendon-driven soft quadruped robot through an online adaptive learning approach. Leveraging the inverse kinematics model of the soft quadruped robot, we employ a central pattern generator to design a parametric gait pattern, and use Bayesian optimization (BO) to find the optimal parameters. Further, to address the challenges of modeling discrepancies, we implement a multi-fidelity BO approach, combining data from both simulation and physical experiments throughout training and optimization. This strategy enables the adaptive refinement of the gait pattern and ensures a smooth transition from simulation to real-world deployment for the controller. Compared to previous result using a fixed gait pattern, the multi-fidelity BO approach improves the robot’s average walking speed from 0.14 m/s to <strong>0.214 m/s</strong>, an increase of <strong>52.7%</strong>. Moreover, we integrate a computational task off-loading architecture by edge computing, which reduces the onboard computational and memory overhead, to improve real-time control performance and facilitate an effective online learning process. The proposed approach successfully achieves optimal walking gait design for physical deployment with high efficiency, effectively addressing challenges related to the reality gap in soft robotics.
        </div>
      </div>
      <div id="bib-asoc" class="toggle-target" hidden>
        <div class="pub-bib-body">
            <button class="copy-bib" data-copy="#bib-text-asoc" aria-label="Copy BibTeX">📋</button>
            <pre><code id="bib-text-asoc">@article{TAN2025112568,
  title = {Optimal gait design for a soft quadruped robot via multi-fidelity Bayesian optimization},
  journal = {Applied Soft Computing},
  volume = {169},
  pages = {112568},
  year = {2025},
  issn = {1568-4946},
  doi = {https://doi.org/10.1016/j.asoc.2024.112568},
  url = {https://www.sciencedirect.com/science/article/pii/S1568494624013425},
  author = {Kaige Tan and Xuezhi Niu and Qinglei Ji and Lei Feng and Martin Törngren},
}</code></pre>
        </div>
      </div>
    </div>
  </div>
</div>

### Conference Publications

<div class="pub-entry">
  <img src="../files/icra2026.jpg" alt="Electronic-free pneumatic interface for sensorimotor concept. Mechanical forces at the robotic gripper generate force that actuate soft components worn by the user, enabling both sensing and actuation through purely pneumatics." class="pub-thumb">
  <div class="pub-text">
    <h3>Electronic-free Pneumatic Interface for Sensorimotor Human-Robot Interaction</h3>
    <p><strong>Authors:</strong> Jing Xu, <strong>Xuezhi Niu </strong>, <a href="https://didemgurdur.com/">Didem Gürdür Broo</a> & Klas Hjort</p>
    <p>Submitted to <em>IEEE International Conference on Robotics and Automation (ICRA2026)</em></p>
    <p class="pub-links">
      <a href="#">[Paper coming soon]</a>
      <!-- <a href="https://github.com/Cyber-physical-Systems-Lab/RewMARL">[Code]</a> -->
      <a href="#" class="toggle" data-target="abs-chi">[Abstract]</a>
      <!-- <a href="#" class="toggle" data-target="bib-chi">[BibTeX]</a> -->
    </p>
    <div class="pub-toggle-container">
			<div id="abs-chi" class="toggle-target" hidden>
        <div class="pub-abs-body">
          Most existing haptic interfaces for human-robot interaction rely on electronic components, which pose challenges in harsh environments and require complex control architectures. This paper presents a novel pneumatic interface that provides electronic-free sensorimotor functions, integrating both sensing and actuation using purely pneumatic principles. The key technical innovation is a pneumatic valve architecture that achieves direct mechanical-fluidic coupling between contact sensing and haptic actuation, eliminating the need for electronic sensors, digital processing, or continuous power supplies. The system operates through a closed-loop mechanism where pressure variations generated by contact forces directly regulate pneumatic valve states, which in turn actuate wearable soft components. System characterization experiments demonstrate consistent force activation thresholds and reliable valve switching behavior across varying contact conditions. The technical approach is validated through two proof-of-concept applications: a perceptive haptic glove and an assistive grasping system with human feedback. Preliminary user trials confirm functional performance and provide initial usability feedback, demonstrating the system's ability to convey tactile information for object discrimination and grasp control. This work establishes the technical feasibility of electronics-free sensorimotor coupling and opens new possibilities for potential advantages for haptic interfaces in challenging environments where conventional electronic systems cannot operate reliably.
        </div>
      </div>
      <!-- <div id="bib-chi" class="toggle-target" hidden>
        <div class="pub-bib-body">
            <button class="copy-bib" data-copy="#bib-text-chi" aria-label="Copy BibTeX">📋</button>
            <pre><code id="bib-text-chi">@INPROCEEDINGS{11108729,
  author={Niu, Xuezhi and Broo, Didem Gürdür},
  booktitle={2025 9th International Conference on Robotics and Automation Sciences (ICRAS)}, 
  title={Investigating Symbiosis in Robotic Ecosystems: A Case Study for Multi-Robot Reinforcement Learning Reward Shaping}, 
  year={2025},
  pages={112-117},
  doi={10.1109/ICRAS65818.2025.11108729}
}</code></pre>
        </div>
      </div> -->
    </div>
  </div>
</div>

<div class="pub-entry">
  <img src="../files/Chi.jpg" alt="The figure is a schematic of the collaborative experimental setup in a 4 × 4 m room. A 1.6 × 1.6 m working table sits in the room with the participant seated along the bottom edge facing upward toward the Dobot Nova 5 robotic arm fitted with a Robotiq 2F85 gripper in the near center. Four main areas are marked on the table: an item stack on the right, a central repair area, a small waiting area in the center, and a packaging area on the left. Green cubes indicate functional items moved directly to packaging; red cubes indicate faulty items handed over by the robot for repair and then returned to packaging after participant action. The robot workspace is shaded light blue, the human workspace light green, and the overlapping repair space highlighted between them to show the area of shared interaction. A fixed RGB camera is shown in the southwest corner of the room capturing the entire setup. Arrows in the diagram show the cobot’s movement between these zones and the handover points to the participant." class="pub-thumb">
  <div class="pub-text">
    <h3>"What am I supposed to do now?": Exploring Unscripted Human Responses During Robot Malfunction in a Collaborative Quality Control and Repair Task</h3>
    <p><strong>Authors:</strong> Alexandros Rouchitsas, <strong>Xuezhi Niu </strong>, Ginevra Castellano & <a href="https://didemgurdur.com/">Didem Gürdür Broo</a></p>
    <p>Submitted to <em>The ACM Conference on Human Factors in Computing Systems (CHI2026)</em></p>
    <p class="pub-links">
      <a href="#">[Paper coming soon]</a>
      <!-- <a href="https://github.com/Cyber-physical-Systems-Lab/RewMARL">[Code]</a> -->
      <a href="#" class="toggle" data-target="abs-chi">[Abstract]</a>
      <!-- <a href="#" class="toggle" data-target="bib-chi">[BibTeX]</a> -->
    </p>
    <div class="pub-toggle-container">
			<div id="abs-chi" class="toggle-target" hidden>
        <div class="pub-abs-body">
          Robot malfunctions are unavoidable in human–robot collaboration and oftentimes detrimental. Yet humans are rarely instructed on how to respond in such moments, leaving ample room for spontaneity and unpredictability. We studied 65 participants working alongside a collaborative robot under both normal operation and deliberate malfunction conditions. We analyzed unscripted vocal and action responses regarding situational awareness (SA)—whether malfunctions were noticed—and task-oriented response appropriateness—whether responses advanced or undermined the collaboration. During malfunctions, SA was nearly universal, as was frustration and confusion, yet appropriateness diverged sharply: 22 participants responded only productively, 7 only unproductively or counterproductively, 15 did both, while 20 attempted nothing whatsoever. Unscripted responses ranged from clarifying questions and corrective actions to sarcasm, comedic gestures, and erroneous markings. Our findings reveal a fragile link between SA and collaboration quality, highlighting the need for robot transparency, explainability and adaptability, so collaborators are actively supported when things fail.
        </div>
      </div>
      <!-- <div id="bib-chi" class="toggle-target" hidden>
        <div class="pub-bib-body">
            <button class="copy-bib" data-copy="#bib-text-chi" aria-label="Copy BibTeX">📋</button>
            <pre><code id="bib-text-chi">@INPROCEEDINGS{11108729,
  author={Niu, Xuezhi and Broo, Didem Gürdür},
  booktitle={2025 9th International Conference on Robotics and Automation Sciences (ICRAS)}, 
  title={Investigating Symbiosis in Robotic Ecosystems: A Case Study for Multi-Robot Reinforcement Learning Reward Shaping}, 
  year={2025},
  pages={112-117},
  doi={10.1109/ICRAS65818.2025.11108729}
}</code></pre>
        </div>
      </div> -->
    </div>
  </div>
</div>

<div class="pub-entry">
  <img src="https://github.com/Cyber-physical-Systems-Lab/RewMARL/raw/main/docs/MobileFranka.gif" alt="Mobile Manipulation: Combining base movement and arm control agents that benefit from shared reward signals to perform coordinated navigation and manipulation tasks." class="pub-thumb">
  <div class="pub-text">
    <h3>Investigating Symbiosis in Robotic Ecosystems: A Case Study for Multi-Robot Reinforcement Learning Reward Shaping</h3>
    <p><strong>Authors: Xuezhi Niu </strong> & <a href="https://didemgurdur.com/">Didem Gürdür Broo</a></p>
    <p><em>2025 9th International Conference on Robotics and Automation Sciences (ICRAS)</em></p>
    <p class="pub-links">
      <a href="https://doi.org/10.1109/ICRAS65818.2025.11108729">[Paper]</a>
      <a href="https://github.com/Cyber-physical-Systems-Lab/RewMARL">[Code]</a>
      <a href="#" class="toggle" data-target="abs-icras">[Abstract]</a>
      <a href="#" class="toggle" data-target="bib-icras">[BibTeX]</a>
    </p>
    <div class="pub-toggle-container">
			<div id="abs-icras" class="toggle-target" hidden>
        <div class="pub-abs-body">
          This paper presents a bio-inspired reward shaping approach for multi-agent reinforcement learning (MARL) in heterogeneous multi-robot systems, leveraging a formal symbiosis model to enhance cooperation. We categorize interactions based on mutualism, commensalism, and parasitism, introducing constructs such as graph models, state transition systems, and resource flow models to characterize inter-agent dependencies. By incorporating a taxonomy of symbiotic relationships into MARL, we define reward structures that reinforce cooperative behavior in complex tasks. Our experimental results demonstrate that while traditional rewards suffice for simple tasks like CartPendulum, mutualistic rewards provide qualitative benefits in high-dimensional tasks such as ShadowHand Object Passing and Mobile Manipulation, including increased learning stability, smoother convergence, and reduced performance variance. These findings suggest that symbiotic reward shaping provides a structured mechanism for enhancing multi-robot cooperation, with benefits that extend beyond numerical performance metrics. Future work should explore adaptive interaction mechanisms and generalization across diverse robotic applications.
        </div>
      </div>
      <div id="bib-icras" class="toggle-target" hidden>
        <div class="pub-bib-body">
            <button class="copy-bib" data-copy="#bib-text-icras" aria-label="Copy BibTeX">📋</button>
            <pre><code id="bib-text-icras">@INPROCEEDINGS{11108729,
  author={Niu, Xuezhi and Broo, Didem Gürdür},
  booktitle={2025 9th International Conference on Robotics and Automation Sciences (ICRAS)}, 
  title={Investigating Symbiosis in Robotic Ecosystems: A Case Study for Multi-Robot Reinforcement Learning Reward Shaping}, 
  year={2025},
  pages={112-117},
  doi={10.1109/ICRAS65818.2025.11108729}
}</code></pre>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="pub-entry">
  <img src="../files/ICPS.png" alt="Agents share battery information through symbiosis connections (blue dashed lines) while maintaining individual Q-networks for local decision making. The framework integrates sampling from the environment (orange arrows), sharing of symbiotic information, and learning through DQN loss computation. Q and Q* represent online and target networks respectively, with individual buffers for experience replay." class="pub-thumb">
  <div class="pub-text">
    <h3>Enabling Symbiosis in Multi-Robot Systems through Multi-Agent Reinforcement Learning</h3>
    <p><strong>Authors: Xuezhi Niu</strong>, <a href="https://www.uu.se/kontakt-och-organisation/personal?query=N18-2159">Natalia Calvo Barajas</a> & <a href="https://didemgurdur.com/">Didem Gürdür Broo</a></p>
    <p><em>2025 IEEE 8th International Conference on Industrial Cyber-Physical Systems (ICPS)</em></p>
    <p class="pub-links">
      <a href="https://doi.org/10.1109/ICPS65515.2025.11087893">[Paper]</a>
      <a href="https://file.notion.so/f/f/5545e1f6-49ca-45ca-b96d-957713429775/51f981db-9e0a-402b-ae08-2314a84f12b7/ICPS.pdf?table=block&id=24cff393-81aa-80dc-848a-ff435141c55d&spaceId=5545e1f6-49ca-45ca-b96d-957713429775&expirationTimestamp=1755540000000&signature=yOne_zcBiqppKVPdnj_dP1wxnOnG-oeT3kPHgNMmM9I&downloadName=ICPS.pdf">[Slides]</a>
      <a href="#" class="toggle" data-target="abs-icps2025">[Abstract]</a>
      <a href="#" class="toggle" data-target="bib-icps2025">[BibTeX]</a>
    </p>
    <div class="pub-toggle-container">
			<div id="abs-icps2025" class="toggle-target" hidden>
        <div class="pub-abs-body">
          Current cyber-physical systems, including multi-robot systems, often fail to interoperate effectively, resulting in suboptimal performance, inefficient resource utilization, and poor resilience. Inspired by natural symbiotic relationships, such as tree-fungi networks, we propose an architecture that integrates ecological symbiosis principles into multi-robot system specifications. Specifically, we incorporate symbiotic principles into multiagent reinforcement learning (MARL) within a centralized training, decentralized execution framework. Comprehensive scenario-based evaluations in a simulated warehouse environment show that our symbiotic MARL framework improves system performance (<strong>10.7%</strong>) and resource utilization (<strong>13.81%</strong>) compared to non-symbiotic baselines. Agents dynamically adjust their behavior in response to environmental changes, ensuring continuous task execution, efficient navigation, and balanced energy use. These findings demonstrate that integrating ecological principles into MARL enhances the system's efficiency and performance. The framework's success in promoting sustainable resource usage while maintaining high task performance suggests broader applications across various cyber-physical domains where adaptive coordination is crucial.
        </div>
      </div>
      <div id="bib-icps2025" class="toggle-target" hidden>
        <div class="pub-bib-body">
            <button class="copy-bib" data-copy="#bib-text-icps2025" aria-label="Copy BibTeX">📋</button>
            <pre><code id="bib-text-icps2025">@INPROCEEDINGS{niu2025enabling,
  author={Niu, Xuezhi and Barajas, Natalia Calvo and Broo, Didem Gürdür},
  booktitle={2025 IEEE 8th International Conference on Industrial Cyber-Physical Systems (ICPS)}, 
  title={Enabling Symbiosis in Multi-Robot Systems Through Multi-Agent Reinforcement Learning}, 
  year={2025},
  pages={1-7},
  doi={10.1109/ICPS65515.2025.11087893}
}</code></pre>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="pub-entry">
  <img src="https://github.com/n7729697/KTH-MasterThesis/raw/main/img/thumbnail.png" alt="Creating a gait control policy. In the initial step, the physical parameters of the robot was identified and the stochastic actions were simulated in the identification to collect the data. In the subsequent step, an action-observation net was train that models complex robot model dynamics. The third step capitalized on the surrogate models produced in the previous two steps to train a control policy. In the fourth step, the trained control policy was further refined in simulation before deploying on the physical system." class="pub-thumb">
  <div class="pub-text">
    <h3>Optimal Gait Control for a Tendon-driven Soft Quadruped Robot by Model-based Reinforcement Learning</h3>
    <p><strong>Authors: Xuezhi Niu*</strong>, <a href="https://kaigetan.github.io/">Kaige Tan</a>*, <a href="https://didemgurdur.com/">Didem Gürdür Broo</a> & <a href="https://www.kth.se/profile/lfeng">Lei Feng</a></p>
    <p><em>2025 IEEE International Conference on Robotics and Automation (ICRA)</em></p>
    <p class="pub-links">
      <a href="https://doi.org/10.1109/ICRA55743.2025.11128611">[PDF]</a>
      <a href="https://github.com/n7729697/KTH-MasterThesis">[Code]</a>
      <a href="#" class="toggle" data-target="abs-softq">[Abstract]</a>
      <a href="#" class="toggle" data-target="bib-softq">[BibTeX]</a>
    </p>
    <div class="pub-toggle-container">
			<div id="abs-softq" class="toggle-target" hidden>
        <div class="pub-abs-body">
          This study presents an innovative approach to optimal gait control for a soft quadruped robot enabled by four compressible tendon-driven soft actuators. Soft quadruped robots, compared to their rigid counterparts, are widely recognized for offering enhanced safety, lower weight, and simpler fabrication and control mechanisms. However, their highly deformable structure introduces nonlinear dynamics, making precise gait locomotion control complex. To solve this problem, we propose a novel model-based reinforcement learning (MBRL) method. The study employs a multi-stage approach, including state space restriction, data-driven surrogate model training, and MBRL development. Compared to benchmark methods, the proposed approach significantly improves the efficiency and performance of gait control policies. The developed policy is both robust and adaptable to the robot's deformable morphology. The study concludes by highlighting the practical applicability of these findings in real-world scenarios.
        </div>
      </div>
      <div id="bib-softq" class="toggle-target" hidden>
        <div class="pub-bib-body">
            <button class="copy-bib" data-copy="#bib-text-softq" aria-label="Copy BibTeX">📋</button>
            <pre><code id="bib-text-softq">@inproceedings{niu2025optimal,
	title     = {Optimal Gait Control for a Tendon-driven Soft Quadruped Robot by Model-based Reinforcement Learning},
	author    = {Niu, Xuezhi and Tan, Kaige and G{\"u}rd{\"u}r Broo, Didem and Feng, Lei},
	booktitle = {2025 IEEE International Conference on Robotics and Automation (ICRA)}, 
	year      = {2025},
  pages     = {9287-9293},
	doi       = {10.1109/ICRA55743.2025.11128611},
	url       = {https://doi.org/10.1109/ICRA55743.2025.11128611}
}</code></pre>
        </div>
      </div>
    </div>
  </div>
</div>

### Thesis
* [Optimal Gait Control of Soft Quadruped Robot by Model-based Reinforcement Learning](https://urn.kb.se/resolve?urn=urn:nbn:se:kth:diva-339056)<br>
**Xuezhi Niu**<br>
*M.Sc. Thesis, KTH Royal Institute of Technology, Stockholm, Sweden,* 2023<br>

### Technical Report
* [Electronically Vacuum Regulated Shut-off Valve for Milking System](https://urn.kb.se/resolve?urn=urn:nbn:se:kth:diva-324226)<br>
Carl Egenäs\*, Felix Ekman\*, Chenqi Ma\*, Tim Naser\*, **Xuezhi Niu\***, Axel Sernelin\*, Samuel Stenow\*, Benjamin StrÖm\* <br>
*H.K. Project, KTH Royal Institute of Technology, Stockholm, Sweden,* 2023<br>

### Reviewer
IEEE International Conference on Robotics and Automation (ICRA), IEEE/ASME International Conference on Advanced Intelligent Mechatronics (AIM), IEEE International Conference on Industrial Cyber-Physical Systems (ICPS), IEEE-RAS International Conference on Humanoid Robots (Humanoids), IEEE International Conference on Robot and Human Interactive Communication (ROMAN). <br>

<!-- Modal (hidden by default) -->
<div id="img-lightbox"
     class="lb-backdrop"
     role="dialog"
     aria-modal="true"
     aria-labelledby="lb-caption"
     hidden>
  <button class="lb-close" aria-label="Close">×</button>
  <img id="lb-image" alt="">
  <div id="lb-caption" class="lb-caption"></div>
</div>

<script>
document.addEventListener('click', (e) => {
  // Toggle Abstract / BibTeX
  const t = e.target.closest('a.toggle');
  if (t) {
    e.preventDefault();
    const id = t.dataset.target;
    const targetBox = document.getElementById(id);

    // close siblings
    const container = t.closest('.pub-text');
    container.querySelectorAll('.toggle-target').forEach(el => {
      if (el !== targetBox) el.hidden = true;
    });

    // toggle clicked one
    targetBox.hidden = !targetBox.hidden;
    return;
  }

  // Copy BibTeX
  const btn = e.target.closest('.copy-bib');
  if (btn) {
    const sel = btn.getAttribute('data-copy');
    const node = document.querySelector(sel);
    if (!node) return;

    const text = node.innerText;
    navigator.clipboard.writeText(text).then(() => {
      const old = btn.textContent;
      btn.textContent = 'Copied ✔';
      setTimeout(() => btn.textContent = old, 1500);
    }).catch(() => {
      // fallback: select for manual copy
      const r = document.createRange();
      r.selectNodeContents(node);
      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
    });
  }
});

(function(){
  const lb = document.getElementById('img-lightbox');
  const lbImg = document.getElementById('lb-image');
  const lbCaption = document.getElementById('lb-caption');
  const closeBtn = lb.querySelector('.lb-close');

  // Open on any .pub-thumb click (event delegation covers future items)
  document.addEventListener('click', (e) => {
    const thumb = e.target.closest('.pub-thumb');
    if (!thumb) return;

    const full = thumb.dataset.full || thumb.src;
    const alt = thumb.getAttribute('alt') || '';
    lbImg.src = full;
    lbImg.alt = alt;
    lbCaption.textContent = alt;
    lb.hidden = false;

    // store last focus for accessibility
    lb.dataset.prevFocus = document.activeElement === null ? '' : (document.activeElement.id || '');
    closeBtn.focus();
  });

  // Close helpers
  function closeLightbox(){
    lb.hidden = true;
    lbImg.src = '';
    // restore focus if possible
    const prevId = lb.dataset.prevFocus;
    if (prevId) {
      const prev = document.getElementById(prevId);
      if (prev) prev.focus();
    }
  }

  // Click backdrop (not on image) closes
  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox();
  });

  // Close button
  closeBtn.addEventListener('click', closeLightbox);

  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (!lb.hidden && e.key === 'Escape') closeLightbox();
  });

  // Optional: prevent page scroll while open
  const observer = new MutationObserver(() => {
    if (!lb.hidden) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  observer.observe(lb, { attributes: true, attributeFilter: ['hidden'] });
})();
</script>
