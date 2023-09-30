<style>
  span[title]:hover::after {
    content: attr(title);
    background-color: #f1f1f1;
    color: #333;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
    position: absolute;
    z-index: 1;
    top: 100%;
    left: 0;
    width: max-content;
    display: none;
  }

  span[title]:hover::after {
    display: block;
  }
</style>

---
layout: page
title: About
permalink: /about/
weight: 3
---

# **About Me**

Hi I am NIU <span title="Xuezhi">It pronounces like "**Sh**e+**ü**+b**e**d ju**dge**".</span> :wave:,<br>
<div style="text-align: justify">
	I am a first year Ph.D. student in Computer Science at Uppsala University supervised by Prof. Didem Gürdür Broo, <a href="https://www.it.uu.se/research/group/CPS-Lab" target="_blank"> Cyber-physical Systems Lab </a>. My research interests lie in robotics. As a Mechatronics graduate with a strong mechanical background. I have a strong background in designing and developing complex systems that integrate mechanical, electronic and software components. Experienced in interdisciplinary collaboration and leading teams to achieve project milestones. Proficient in C/C++, Matlab, Python. proficient in design and analysis using SolidWorks, AutoCAD, MATLAB, ROS and other software. Expertise in hardware development, 3D printing and PCB design. Fluent in English and Chinese. <br><br>
	Link to my <a href="https://n7729697.github.io/files/CV_NIU_Xuezhi.pdf" target="_blank">CV</a>.
</div>

<div class="row">
{% include about/skills.html title="Programming Skills" source=site.data.programming-skills %}
{% include about/skills.html title="Other Skills" source=site.data.other-skills %}
</div>

<div class="row">
{% include about/timeline.html %}
</div>
