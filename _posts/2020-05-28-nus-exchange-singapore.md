---
title: Singapore Is Not Hong Kong — an Exchange Semester at NUS
tags: [exchange, NUS, Singapore, Hong Kong, engineering education, COVID-19, aerodynamics]
style: fill
color: info
description: Reflections on a mechanical-engineering exchange at the National University of Singapore in early 2020, on why Singapore and Hong Kong look alike and are not, how NUS and CityU teach differently, and what it was like to study through the first months of the pandemic and travel home.
---

_Based on the exchange report I wrote for the department, my course files and my own photographs. Semester 2, 2019/20 at NUS; Semester B at CityU._

## Two cities that people confuse

Before I left, nearly everyone told me some version of the same sentence: _Singapore is like Hong Kong, only cleaner._ It is an understandable shortcut. Both are former British trading ports on the edge of Asia, both are dense, wealthy, English-speaking, finance- and logistics-driven, and both are run with a reputation for efficiency. For a student from Hong Kong, even the surface is familiar: the Mandarin on the street, the food courts, the MRT.

After a few weeks the comparison stopped being useful, because the differences are structural, not cosmetic.

- **A state versus a city.** Singapore is a sovereign city-state, so planning, housing, education and industrial policy are one coherent project under one government. That coherence is visible everywhere, from the way a campus is laid out to how a public-health response is organised.
- **Housing as policy.** Singapore is known in China, and rightly, for its public housing model, in which most residents live in state-built flats they can own. Hong Kong, with its land-sale economy and very high private prices, produces a very different city and very different anxieties. Seeing the contrast first-hand taught me more about how an engineer's work is shaped by policy than any lecture did.
- **Plural by design.** Singapore is deliberately multi-ethnic and multilingual, with English as the working language and Mandarin, Malay and Tamil alongside. Chinese is common enough that I could get by easily, but the social texture is not that of a Chinese city.
- **Landscape and climate.** The tropics are an engineering input. There is one hot, humid season with a dry and a rainy phase; buildings are open, shaded and ventilated, and greenery is treated as infrastructure (a "garden city" is a planning goal, not a slogan). Hong Kong is hillier, more vertical, and has an actual winter.

I did not leave thinking one place was better. I left understanding that the similarity is the thing you notice from outside, and the difference is the thing you learn from inside.

![Jewel Changi Airport on arrival, January 2020]({{ site.baseurl }}/files/nus-exchange/jewel-before-covid.jpg)
_Singapore airport (the Jewel and its indoor waterfall), January 2020._

![A large tree beside the campus walkways]({{ site.baseurl }}/files/nus-exchange/old-tree.jpg)
_Greenery as infrastructure: a large tree beside a campus walkway._

## NUS and CityU: two engineering educations

NUS is a very good university, and I do not want the rest of this section to sound otherwise. It is large and research-heavy, with strong aerospace and mechanical teaching and a close link to industry: mechanical graduates find work in the sector, and students take the discipline seriously because the sector takes them seriously.

![The NUS Faculty of Engineering]({{ site.baseurl }}/files/nus-exchange/nus-engineering.jpg)
_The Faculty of Engineering._

The differences from CityU that I noticed were these:

- **Breadth versus depth of instruction.** NUS lecturers tend to teach more broadly and expect you to close the gap yourself. This builds independence, and I came to appreciate it, but it is less forgiving when you are learning a subject for the first time.
- **Flexibility.** CityU's mechanical programme leaves more room for electives and for programming. At NUS the emphasis is more on aerospace subjects, and the choice of electives is narrower.
- **Teaching under pressure.** When the semester moved online, the materials NUS supplied were lecture videos and slides for self-study, and in my experience the quality and the responsiveness were below what I had known in Hong Kong. This is a comment about one exceptional semester, not a verdict on either institution.

Summing it up honestly: **NUS is excellent, but I like CityU a little more.** The reasons are practical rather than sentimental. I prefer a programme that lets me combine mechanics with programming and control; I learn better with close, quick feedback from teaching staff; and CityU's scale lets you be a person to your lecturers instead of a name in a large cohort. Someone who wants a deep, industry-aligned aerospace training would reasonably choose the other way.

![The Department of Mechanical Engineering]({{ site.baseurl }}/files/nus-exchange/nus-mech-dept.jpg)
_The Department of Mechanical Engineering._

## What I actually took from the courses

I took four courses: **ME4231 Aerodynamics**, **ME3281 Microsystems Design and Applications**, **ME4253 Biomaterials Engineering** and **CS2030 Programming Methodology II** (Java). Taken together they were an unusual mix, and the value was in how different the ways of thinking were.

**Aerodynamics** was the one that mattered most. It gave me a working framework for incompressible flow: thin-airfoil theory, with lift slope $c_{l,\alpha} = 2\pi$ per radian for a thin section; lift as circulation, $L' = \rho V_\infty \Gamma$; and, for a finite wing, induced drag
$$
C_{D,i} = \frac{C_L^{2}}{\pi\, e\, AR},
$$
which explains in one line why a glider has a very long, slender wing. I later used this directly in a blade-design project; the connection is written up in [Wind Turbine Blade Design]({{ site.baseurl }}/projects/wind-turbine-blade-design).

**Microsystems** matched what I studied at CityU and later at KTH, and reinforced one scaling fact that I now use as a sanity check: the tip stiffness of a cantilever, $k = E w t^{3} / (4L^{3})$, depends on the _cube_ of thickness, so in microfabrication the process control of thickness is the design problem. My fuller note is in [Micro-Fabrication]({{ site.baseurl }}/posts/Micro-Fabrication.html).

**Biomaterials** changed the requirement list. In ordinary mechanical design, strength and stiffness are the goals; in an implant, a material that is too stiff is itself a failure, because it carries the load that bone needs in order to stay healthy (stress shielding). The lesson, that matching the body matters as much as maximising a property, generalises well beyond medicine.

**Java** was less about the language than about discipline: abstraction barriers, testability, substitutability, avoiding `null`, and preferring declarative, composable code. It was the course that most improved how I write software afterwards.

## Living and studying in lockdown

I lived in **Sheares Hall**, in a single room. The hall is inexpensive and the environment is good, with one real drawback for a tropical country: fans only, no air conditioning, which matters when you are in your room all day. Meals were on a plan covering weekday breakfast and dinner, much cheaper than eating out; lunch and weekends were on me.

![My single room in the hall]({{ site.baseurl }}/files/nus-exchange/hall-room.jpg)
_My single room._

The semester began normally. The one organised event I attended before everything changed was Engineering Day, a day given to students to present ideas to each other and to researchers. Then the pandemic took over: teaching went online, the campus emptied, and my life became a room, a laptop and a bus ride to UTown that I could no longer take. I had planned to work from the UTown cafés, where a little background noise suits me, and instead spent most of the semester studying alone.

![UTown in the evening]({{ site.baseurl }}/files/nus-exchange/utown-evening.jpg)
_UTown, in the evening, mostly empty._

Two things stand out in hindsight. Singapore had prepared before the first cases and its early response was orderly, and I was impressed by how quickly the institutions adapted. I also, as an exchange student, saw very little of the country: the lockdown replaced the exchange I had planned with a different one, which was mostly intellectual and, to be frank, solitary. I do not regret it, but I would not call it the year I had signed up for.

## The way home

Leaving was harder than arriving. By April the airport that had been a bright, busy hub in January was almost empty, flights were few and uncertain, and travellers returning to Hong Kong faced compulsory quarantine on arrival. I travelled home in that setting, with a mask, a small bag and a long list of things that could go wrong, and my report from that period notes that I spent the weeks around it quarantined at home, which is also why I had almost no unplanned spending.

![The same airport, nearly empty, in April 2020]({{ site.baseurl }}/files/nus-exchange/jewel-after-covid.jpg)
_The same terminal in April 2020._

It is a strange feeling to come home from a place you only partly got to know. Looking back, the exchange did what a good exchange should do, though not in the way I had planned: it removed an assumption (that two similar-looking cities are alike), it showed me a second way of teaching engineering, and it left me more certain about what I value in my own university.
