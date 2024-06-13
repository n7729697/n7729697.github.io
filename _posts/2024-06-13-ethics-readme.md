---
title: Ethical Principles 
tags: [Ethics, Lab]
style: 
color: 
description: Ethics fetched from the lab manual by deleting the confidential information. It serves as an examination of the doctoral course "Research Ethics for Science and Technology," which I took in the year 2024.
---

The "[Research Ethics for Science and Technology](https://www.uu.se/en/staff/faculty/science-and-technology/education-and-teaching/doctoral-studies/doctoral-student/courses/faculty-courses/research-ethics-for-science-and-technology-2-credits)" course aimed to equip students with the ability to recognize and critically discuss ethical issues in research. For the course's examination component, I chose to undertake an A project, focusing on returning what I learned to my institution by creating a comprehensive README file for research groups. This file addresses various ethical issues encountered in scientific research, providing guidelines to ensure ethical compliance and integrity in our research practices.

**Confidential information is deleted to share**

## Ethical Principles

### Lab Safety

Before we dive into the exciting world of robotics and cyber-physical systems, we must ensure that every lab member is equipped with the knowledge and respect for safety protocols that govern our operations. This commitment to maintaining a secure environment is not just about adhering to rules but about fostering a culture of mindfulness and responsibility towards oneself and others in the lab. 
<details>
  <summary>Under no circumstances should any robotic operation be manually interrupted by hand</summary>

  Direct physical interaction with moving parts or operational machinery presents a significant risk of injury and can damage the equipment. If there is a need to halt a robot's operation, the first course of action should always be an attempt to interrupt the process via command through the controlling software. If the software fails to respond or an immediate stop is necessary, the next step is to safely power off the equipment. Only after these measures are taken should new operations be initiated.
</details>

<details>
  <summary>No unattended robotic operations</summary>

  It is imperative that robotic operations are not left unattended. When actuating ideas on the robots, your presence is required at all times. This rule ensures that any unexpected issues can be addressed promptly and reduces the risk of accidents or damage to the lab equipment. Unattended operations increase the likelihood of unforeseen incidents, which can lead to potential harm to both the individual and the workspace.
</details>

<details>
  <summary>Pre-Operation Inspection</summary>

  Before initiating any experiment or operation with robotic systems, perform a thorough pre-operation inspection. This includes checking for any signs of wear and tear, ensuring all parts are secured and in their correct positions, and verifying that the software and hardware communication is functioning correctly. Regular inspections help prevent accidents caused by equipment malfunction or failure.
</details>

<details>
  <summary>Shutdown Before Leaving</summary>

  All robotic systems must be properly shut down before leaving the lab. This rule is crucial to prevent any accidental activation or continuation of operations that could occur in the absence of supervision. A powered-down state ensures that the equipment remains safe and secure until it is next used under direct supervision.
</details>

<details>
  <summary>Also take care of robots</summary>

  When working with robots, consider not only your safety but also the well-being of the robots. Abrupt shutdowns or erratic operational commands can lead to wear and tear or even permanent damage to sensitive components. Always shut down the robots gently and as per the recommended procedures when you are done or if you are leaving the lab, even for a short period. This practice extends the lifespan of the robots and maintains their readiness for future experiments.
</details>

### Respect for Privacy
<details>
  <summary>Data Collection</summary>
  <div class="tip" markdown="1">
  Prior informed consent must be obtained explicitly detailing how the data will be used, stored, and eventually disposed of. Consent forms should comply with [GDPR](https://gdpr-info.eu/) standards, clearly stating the purpose and scope of data collection. Provide participants with clear information about the data processing activities and their rights under [GDPR](https://gdpr-info.eu/), including the right to access, rectify, and erase their data. 
  </div>
</details>

<details>
  <summary>Data Handling</summary>
  <div class="tip" markdown="1">
  Implement rigorous data anonymization and pseudonymization techniques to protect personal information. Ensure these techniques conform to [GDPR](https://gdpr-info.eu/) requirements to prevent data re-identification. Adopt robust security measures to protect personal data against unauthorized or unlawful processing and against accidental loss, destruction, or damage. This includes encryption, access control, and regular security assessments.
  </div>
</details>

<details>
  <summary>Data Usage</summary>
  <div class="tip" markdown="1"> 
  Use collected data strictly within the terms agreed upon at the point of collection and in compliance with GDPR. This includes ensuring that data processing is lawful, fair, and transparent. Maintain records of processing activities to demonstrate compliance with [GDPR](https://gdpr-info.eu/). This includes documenting the legal basis for processing, data sharing, and retention practices.
  </div>
</details>

### Safety and Security
<details>
  <summary>Physical Safety</summary>
  <div class="tip" markdown="1">
  - All personnel should complete comprehensive safety training specific to the lab environment, including emergency procedures, proper handling of equipment, and awareness of potential hazards. Record the incident details, including the time, cause, and personnel involved, once it happens.
  - Maintain at least a 0.1-meter distance from operating robots unless performing specific tasks that require closer proximity. Clearly mark all exits, safety equipment like fire extinguishers and first aid kits, and provide easy access to emergency shutdown buttons for all critical equipment.
  - Under no circumstances should any robotic operation be manually interrupted by hand. When actuating ideas on the robots, your presence is required at all times.
  </div>
</details>

<details>
  <summary>Cybersecurity</summary>
  <div class="tip" markdown="1">
  - Ensure that all connections to robotic systems are made strictly through the lab’s secure network. External access should be disabled to prevent unauthorized control from outside networks. 
  - Always shut down robots completely before leaving the lab to prevent unauthorized access or manipulation. This includes turning off the robots' power and disconnecting any network connections. Implement routine checks upon startup to ensure that no unauthorized modifications were made while systems were inactive. This can include verifying software checksums and conducting a quick operational test cycle.
  - Firewalls should remain active at all times to protect against external threats and to manage data flow to and from the robots. Any deactivation of firewalls must be strictly controlled. Deactivation of firewalls is only permissible under the direct authorization of the lab manager for specific, controlled experiments where firewall activity might interfere with necessary communications. Immediately after the completion of experiments requiring firewall deactivation, the firewalls must be reactivated. This process should be documented, including the duration of deactivation, the reasons, and the person responsible for the operation.
  </div>
</details>

<details>
  <summary>Data Security</summary>
  <div class="tip" markdown="1">
  - Use strong encryption protocols for storing and transmitting data, particularly data that is sensitive or proprietary.There are several encryption protocols that provide strong security measures. Some of these include SSL/TLS, AES, RSA, HotP, IPSec, and GPG.
  - Where applicable, anonymize data collected during research to prevent the identification of individual subjects or sensitive characteristics. To anonymize data, you can remove or mask personally identifiable information (PII) such as names, addresses, and social security numbers. One common method is to use k-anonymity, which involves replacing values with a range of possible values that would still maintain anonymity. Other methods include differential privacy, which adds noise to the data, and homomorphic encryption, which allows for calculations to be performed on encrypted data without decryption.
  - Implement robust data backup procedures to ensure data integrity and availability. Regularly test disaster recovery plans to ensure they are effective in the event of data loss or system failure.
  </div>
</details>

#### Shutdown Protocols
<details>
  <summary>Routine Shutdown</summary>
  <div class="tip" markdown="1">
  - Complete Current Task: Ensure all current tasks and operations are completed or safely halted.
  - Robots Shutdown: Turn off the main power switch and disconnect from the network.
  - Controllers Shutdown: Shut down the controllers according to the manufacturer’s instructions.
  - Peripheral Devices Shutdown: Power down all peripheral devices such as sensors, cameras, and actuators.
  - Disconnect Power: Unplug the main power source if necessary.
  - Confirm Shutdown: Verify that all systems are completely powered down and no residual power remains.
  </div>
</details>

<details>
  <summary>Emergency Shutdown</summary>
  <div class="tip" markdown="1">
  - Initiate Emergency Stop: If an emergency shutdown is required, activate the emergency stop button.
  - Follow Emergency Procedures: Recognize the situation that requires an immediate stop (e.g., unexpected robot behavior, physical danger to personnel). Press the emergency stop button or use the remote stop control. Alert all personnel in the lab that might be affected.
  - Assess the Situation: Quickly assess the reason for the stop and ensure the area is safe before taking further action.
  - Secure Area: Ensure the area is safe and secure from any hazards. Log the shutdown events afterwards.
  </div>
</details>


### Compliance with Ethical Research Practices
<details>
  <summary>AI Ethics</summary>
  <div class="tip" markdown="1">
  Follow ethical guidelines specifically designed for AI research to prevent biases and ensure fairness in algorithms. Maintain transparency of algorithms used in research to enable peer reviews and ethical audits. Document the design, decision-making processes, and criteria used by any AI systems. 
  </div>
  <blockquote>
    <details>
      <summary>Examples</summary>
      <div class="tip" markdown="1">
    * If developing an AI that predicts machinery maintenance needs, the lab documents how the algorithm makes predictions, the data it analyzes (like machine operation hours and error logs), and the logic behind its decision-making processes. This documentation is available for peer review to ensure the algorithm’s decisions are understandable and justifiable. 
      </div>
    </details>
  </blockquote>
</details>

<details>
  <summary>Legal Compliance</summary>
  <div class="tip" markdown="1">
  Ensure all research activities comply with national and international laws and regulations applicable to cyber-physical systems, including data protection laws such as GDPR. Secure appropriate licenses for software, datasets, and other intellectual properties used in research, adhering to copyright and patent laws.
  </div>
<blockquote>
  <details>
    <summary>Examples</summary>
    <div class="tip" markdown="1">
  * If a project involves developing drones for monitoring. The team should ensure compliance with both local aviation regulations and international data protection laws by registering the drones with aviation authorities and encrypting the data collected to protect the proprietary information. 
  * If the lab uses proprietary software, the lab should ensure that the software license permits academic use and that any findings published based on this software credit the software's creators appropriately.
    </div>
  </blockquote> </details>
</details>

<details>
  <summary>Documentation and Reporting</summary>
  <div class="tip" markdown="1">
  Keep comprehensive records of all research activities, including experimental setups, data collection methods, analysis techniques, and results. This documentation is crucial for reproducibility, auditing, and historical reference. Follow ethical standards in publishing and sharing research findings. Ensure that all contributions are accurately credited and that any conflicts of interest are declared.
  </div>
  <blockquote>
  <details>
    <summary>Examples</summary>
    <div class="tip" markdown="1">
  * The lab maintains a digital lab notebook that logs all experiments conducted on the lab equipment. 
  * The one who carrys out the experiments should detail the experiment’s purpose, setup, execution, results, and any anomalies, ensuring that the work can be replicated or audited in the future.
    </div>
  </blockquote></details>
</details>

<details>
  <summary>Publishing Protocol</summary>
  <div class="tip" markdown="1">
  * Verify that the work is original, properly cites previous work, and does not plagiarize any content. Utilize plagiarism detection software as required by the journal. 
  * Avoid submitting the same manuscript to more than one journal simultaneously. This practice is considered unethical as it can lead to duplicate publication. 
  * Be prepared to correct any inaccuracies or errors discovered after publication. In cases of significant errors or ethical breaches, retract the publication. 
  * Ensure ongoing access to the published research, including maintaining any data repositories and addressing any copyright or licensing issues that arise post-publication. 
  * Maintain records of all communications with the journal, peer review comments and responses, and revisions to the manuscript. This documentation can be crucial in addressing any questions about the research process or findings.
  </div>
  <blockquote>
  <details>
    <summary>Preparing for Publication</summary>
    <div class="tip" markdown="1">
  * Determine who qualifies for authorship based on significant contributions to the conception, design, execution, or interpretation of the research reported. 
  * All contributors who meet these criteria should be listed as authors. Identify and disclose any potential conflicts of interest that might be perceived as influencing the research results or interpretations. 
  * Ensure that the data supporting the research findings is accessible and reproducible, where applicable. This includes making data available in a public repository and providing necessary code or algorithms under suitable licenses.
    </div>
  </details>

  <details>
    <summary>Submission Process</summary>
    <div class="tip" markdown="1">
  * Choose a publication that aligns with the research field, has a rigorous peer review process, and is recognized for ethical publishing practices. 
  * Follow the specific formatting and submission guidelines provided by the chosen journal. This includes structuring the manuscript with a clear abstract, introduction, methodology, results, discussion, and references.
    </div>
  </blockquote></details>
</details>

**Want to know more?**
<details>
  <summary>The Uppsala Code of Ethics for Scientists</summary>
  <div class="tip" markdown="1">
  Tibell, Gunnar; Lars Rydén; Peter Wallensteen & Bengt Gustafsson (1984) The Uppsala Code of Ethics for Scientists, Journal of Peace Research 21 (4): 311–316. [links](https://phsj.org/wp-content/uploads/2007/10/Uppsala-Code-of-Ethics-for-Scientists.pdf)
  </div>
</details>

<details>
  <summary>Research ethics and good research practice</summary>
  <div class="tip" markdown="1">
  Research ethics and good research practice from uppsala: [https://www.uu.se/en/research/ethics/](https://www.uu.se/en/research/ethics/)
  </div>
</details>

<details>
  <summary>Good Research Practicee</summary>
  <div class="tip" markdown="1">
  Good Research Practice from Vetenskapsrådets (VR): [book online](https://www.vr.se/english/analysis/reports/our-reports/2017-08-31-good-research-practice.html)
  </div>
</details>