---
title: rendering and control of Nova5 arms with robotiq 2F85 gripper within Isaac Sim 4.2
tags: [Isaac Sim, Nova5, robotiq, Simulation]
style: fill
color: primary
description: Find a way to have graphical output from the ssh server in Windows 10 wsl2
---

Source: [Isaac Sim RMPflow controller](https://docs.omniverse.nvidia.com/isaacsim/latest/advanced_tutorials/tutorial_configure_rmpflow_denso.html)

## Presteps
* Follow the official instructions to install Nvidia Isaac Sim from [NVIDIA's Developer Page](https://developer.nvidia.com/isaac/sim).

* For my case, installation with workstation and ROS 2, details from [official repositories](https://docs.omniverse.nvidia.com/isaacsim/latest/installation/install_workstation.html).

* For a smoother workflow, it's best to implement urdf model and set up the basic simulation early on in the GUI. This approach tends to be more stable with the [USD stages](https://docs.omniverse.nvidia.com/isaacsim/latest/gui_tutorials/tutorial_intro_usd.html) implementation, especially compared to the hassle of importing and adjusting models through scripts in Isaac Sim, which can be quite frustrating.


## Implement URDF description and add controllers


## TO DO
- [ ] **Import Nova5 arm model**

- [ ] **Integrate Robotiq 2F85 gripper**

- [ ] **Set up control framework**

- [ ] **Test rendering and control**

- [ ] **Implement with ROS2 Humble**