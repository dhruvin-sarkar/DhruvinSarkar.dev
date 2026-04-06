import UseContext from '../Context'
import React, { useContext, useState, useRef, useEffect } from 'react';
import Draggable from './system/WindowDraggable';
import { motion } from 'framer-motion';
import About from '../assets/ipng.png'
import bioPC from '../assets/pfp.jpg'
import tech from '../assets/tech.png'
import hobby from '../assets/hobby.png'
import linux from '../assets/Tux linux.png'
import job from '../assets/job.png'
import '../css/MyBioFolder.css'


function MyBioFolder() {

  const [generalTap, setGenerapTap] = useState(true)
  const [technologyTap, setTechnologyTap] = useState(false)
  const [linuxTap, setLinuxTap] = useState(false)
  const [hobbTap, setHobbTap] = useState(false)
  const [employmentTap, setEmploymentTap] = useState(false)

  // Refs for each tab's scroll container
  const generalScroll = useRef(null)
  const technologyScroll = useRef(null)
  const linuxScroll = useRef(null)
  const hobbyScroll = useRef(null)
  const employmentScroll = useRef(null)

  const { 
    themeDragBar,
    MybioExpand, setMybioExpand,
    minimizeWindow,
    isTouchDevice,
    handleSetFocusItemTrue,
    inlineStyleExpand,
    inlineStyle,
    deleteTap,
   } = useContext(UseContext);

   const technologyText = (
    <div className="technology-content">
      <div className="tech_section">
        <h3 className="tech_header">Languages</h3>
        <p className="tech_prose">I like languages that let me feel what the system is doing under the hood. C and C++ gave me that first. They taught me to care about memory, performance, and the cost of every abstraction. These days I spend most of my time in JavaScript and TypeScript, building interactive web apps with good tooling and just enough structure to move fast without making a mess. CSS is still one of my favorite parts of the stack because it decides whether an interface feels dead or alive. Bash is what I reach for when I want to automate the annoying parts, and I keep Lua, Dart, and Kotlin around for the projects that call for them.</p>
        <div className="tech_badges">
          <img src="https://img.shields.io/badge/C-00599C?style=for-the-badge&logo=c&logoColor=white" alt="C" />
          <img src="https://img.shields.io/badge/C++-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white" alt="C++" />
          <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
          <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
          <img src="https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS" />
          <img src="https://img.shields.io/badge/Bash-4EAA25?style=for-the-badge&logo=gnu-bash&logoColor=white" alt="Bash" />
          <img src="https://img.shields.io/badge/Dart-%230175C2.svg?style=for-the-badge&logo=dart&logoColor=white" alt="Dart" />
        </div>
      </div>

      <div className="tech_section">
        <h3 className="tech_header">Operating Systems</h3>
        <p className="tech_prose">My OS choice is split between practicality and preference. Windows 11 is still my daily driver because gaming, drivers, and a few tools keep dragging me back. Linux is the one I actually enjoy living in. I've gone through Pop!_OS, Linux Mint, Kali, Fedora, and eventually settled on Arch. Every distro taught me something different, whether that was package management, workflow, system structure, or just how much pain I was willing to tolerate in exchange for control. Arch is the one that really stuck because it gave me full control and forced me to understand what every part of the machine was doing.</p>
        <div className="tech_badges">
          <img src="https://img.shields.io/badge/Windows_11-0078D4?style=for-the-badge&logo=windows-11&logoColor=white" alt="Windows 11" />
          <img src="https://img.shields.io/badge/Pop!_OS-48B9C7?style=for-the-badge&logo=pop!_os&logoColor=white" alt="Pop!_OS" />
          <img src="https://img.shields.io/badge/Linux_Mint-87CF3E?style=for-the-badge&logo=linux-mint&logoColor=white" alt="Linux Mint" />
          <img src="https://img.shields.io/badge/Kali_Linux-268BEE?style=for-the-badge&logo=kali-linux&logoColor=white" alt="Kali Linux" />
          <img src="https://img.shields.io/badge/Fedora-294172?style=for-the-badge&logo=fedora&logoColor=white" alt="Fedora" />
          <img src="https://img.shields.io/badge/Arch_Linux-1793D1?style=for-the-badge&logo=arch-linux&logoColor=white" alt="Arch Linux" />
        </div>
      </div>

      <div className="tech_section">
        <h3 className="tech_header">Frontend & Design</h3>
        <p className="tech_prose">Frontend work is where the technical side of my brain and the design side actually get along. I like building interfaces that feel fast, clear, and good to use. React is my default because it gives me room to build more complex interactive pieces without fighting the framework. HTML and CSS are still the base of everything, and Tailwind helps me prototype quickly without losing visual consistency. I also spend a lot of time in Figma, Framer, and Canva. The part I enjoy most is the feedback loop: build something, see it immediately, tweak it, repeat.</p>
        <div className="tech_badges">
          <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
          <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
          <img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
          <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
          <img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" alt="Figma" />
          <img src="https://img.shields.io/badge/Framer-black?style=for-the-badge&logo=framer&logoColor=blue" alt="Framer" />
          <img src="https://img.shields.io/badge/Canva-%2300C4CC.svg?style=for-the-badge&logo=Canva&logoColor=white" alt="Canva" />
        </div>
      </div>

      <div className="tech_section">
        <h3 className="tech_header">Frameworks</h3>
        <p className="tech_prose">I use frameworks the same way I use tools in general: whatever gets the idea built well without boxing me in. Flutter is my favorite option for cross-platform mobile work because I can move quickly and still ship something that feels polished. On the web, I move between Angular and Vue depending on the project, and I use Electron when I need desktop behavior without leaving the JavaScript ecosystem. For backend work, Django gives me structure, Express gives me flexibility, and Next.js sits nicely in the middle when I want a full-stack setup that doesn't feel heavy.</p>
        <div className="tech_badges">
          <img src="https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white" alt="Flutter" />
          <img src="https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
          <img src="https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D" alt="Vue.js" />
          <img src="https://img.shields.io/badge/Electron-2B2E3A?style=for-the-badge&logo=electron&logoColor=white" alt="Electron.js" />
          <img src="https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white" alt="Django" />
          <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="Express.js" />
          <img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
          <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
        </div>
      </div>

      <div className="tech_section">
        <h3 className="tech_header">Backend & Databases</h3>
        <p className="tech_prose">I naturally lean frontend-first, but I'm comfortable owning the whole stack when a project needs it. Python is my usual choice for backend scripting and data work, and I still use Java and C# when the job fits them better. For databases, I care more about the shape of the problem than brand loyalty. MongoDB is useful when the data wants to stay flexible. MySQL handles the straightforward relational cases. PostgreSQL is usually where I end up when I want stronger features and fewer compromises. I like thinking through schema design, tradeoffs, and how the data model will age once the project stops being small.</p>
        <div className="tech_badges">
          <img src="https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54" alt="Python" />
          <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java" />
          <img src="https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white" alt="C#" />
          <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
          <img src="https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
          <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
        </div>
      </div>

      <div className="tech_section">
        <h3 className="tech_header">Game Development</h3>
        <p className="tech_prose">Game development is where a lot of my curiosity ends up. I've spent plenty of time in Unity and Unreal making 2D and 3D projects, learning the hard way how performance, rendering, scripting, and game feel all fight each other. Blender is part of that workflow too, mostly because I like being able to make or modify assets instead of waiting on them. Godot is great when I want something lighter and more direct, and even Roblox has taught me useful lessons about systems and multiplayer design. Game dev is fun because every technical decision is immediately visible to the player.</p>
        <div className="tech_badges">
          <img src="https://img.shields.io/badge/Unity-100000?style=for-the-badge&logo=unity&logoColor=white" alt="Unity" />
          <img src="https://img.shields.io/badge/Unreal_Engine-313131?style=for-the-badge&logo=unreal-engine&logoColor=white" alt="Unreal Engine" />
          <img src="https://img.shields.io/badge/Blender-%23F5792A.svg?style=for-the-badge&logo=blender&logoColor=white" alt="Blender" />
          <img src="https://img.shields.io/badge/GODOT-%23FFFFFF.svg?style=for-the-badge&logo=godot-engine" alt="Godot Engine" />
          <img src="https://img.shields.io/badge/Roblox-%230a0b0b.svg?style=for-the-badge&logo=Roblox&logoColor=white" alt="Roblox" />
        </div>
      </div>

      <div className="tech_section">
        <h3 className="tech_header">Hardware & Electronics</h3>
        <p className="tech_prose">I really like the point where software stops being abstract and starts affecting something physical. Arduino got me into embedded systems because it made code feel tangible fast. Raspberry Pi pulled me further in with projects that were bigger, messier, and closer to real-world systems. Working with hardware changed how I think about software. You stop treating resources like they're infinite when you've had to deal with power limits, thermals, or physical failure. Also, it's just satisfying to write code and watch an actual thing move because of it.</p>
        <div className="tech_badges">
          <img src="https://img.shields.io/badge/Arduino-00979D?style=for-the-badge&logo=Arduino&logoColor=white" alt="Arduino" />
          <img src="https://img.shields.io/badge/Raspberry%20Pi-A22846?style=for-the-badge&logo=Raspberry%20Pi&logoColor=white" alt="Raspberry Pi" />
        </div>
      </div>

      <div className="tech_section">
        <h3 className="tech_header">Tools & DevOps</h3>
        <p className="tech_prose">A lot of my workflow comes down to a few tools I trust completely. Git and GitHub are non-negotiable at this point. Version control isn't just backup; it's how I think about iteration, collaboration, and not losing my mind. Docker helped a lot too because it made environments more predictable and cut down on machine-specific nonsense. I'm always tweaking my setup, but the goal is simple: less friction, fewer repeated mistakes, and more time spent actually building.</p>
        <div className="tech_badges">
          <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git" />
          <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
          <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
        </div>
      </div>
    </div>
  );

  const linuxText = (
    <div className="technology-content">
      <div className="tech_section">
        <h3 className="tech_header">Linux, ricing, and living inside my OS</h3>
        <p className="tech_prose">My relationship with Linux started earlier than most. In 4th grade, my school gave us PCs running Ubuntu, and that was my first real exposure to an operating system that felt different. I didn&apos;t understand much at the time, but I used it every day and got used to its quirks by force. Eventually curiosity won, I installed Fedora, and that was the beginning of me treating my OS like something I was allowed to mess with instead of just accept.</p>
      </div>

      <div className="tech_section">
        <h3 className="tech_header">Distro-Hopping</h3>
        <p className="tech_prose">That turned into years of distro-hopping. I&apos;ve used and heavily customized Pop!_OS, Linux Mint, Fedora, Kali, and plenty of others. Each one taught me something different about package management, workflow, security, stability, or just how much pain I was willing to tolerate in exchange for control. More importantly, they all pushed me toward ricing.</p>
      </div>

      <div className="tech_section">
        <h3 className="tech_header">Ricing</h3>
        <p className="tech_prose">Ricing became one of my favorite hobbies almost immediately. For me, it&apos;s never been just about aesthetics. It&apos;s about ownership. I like shaping an OS until it feels deliberate, personal, and tuned to the way I actually work. Ricing is how I learned a lot of Bash, config management, window managers, keybindings, and Linux internals in the first place. Every setup meant hours of changing bars, icons, animations, sounds, workflows, and little quality-of-life details until the system felt like mine.</p>
      </div>

      <div className="tech_section">
        <h3 className="tech_header">Arch Linux</h3>
        <p className="tech_prose">Eventually I landed on Arch Linux, and that&apos;s the one that has stayed with me for the last two years. The memes about Arch exist for a reason. Getting it installed, configured, broken, repaired, and broken again was easily the most frustrating and most rewarding OS experience I&apos;ve had. Display issues, drivers, audio, keyboard layouts, Bluetooth, I&apos;ve fought with all of it. I spent a ridiculous amount of time buried in the Arch Wiki, troubleshooting one problem just in time to create another.</p>
        <p className="tech_prose">That&apos;s also why I like it. Even with the install script making setup easier now, the real value of Arch is understanding why the system behaves the way it does. I like the fact that nothing is there unless I put it there. If something runs, it&apos;s because I allowed it. That level of control changed how I think about software in general.</p>
      </div>

      <div className="tech_section">
        <h3 className="tech_header">Windows vs Linux</h3>
        <p className="tech_prose">Windows has always been the OS I keep because I need it, not because I love it. Between software support, gaming, drivers, and plain convenience, it has always been hard to avoid. Over time I got more annoyed with it: limited customization, bloated defaults, terrible search, locked-down features, forced upsells, and too much reliance on third-party tools just to get basic control back. Recall, Copilot, telemetry, and features locked behind higher tiers only made that worse.</p>
        <p className="tech_prose">Linux gives me the opposite feeling. If something bothers me, I can remove it. If something feels slow, I can trace it. If I want the system to look or behave differently, I can change it completely. That level of ownership made me care a lot more about transparency, configurability, and user agency, and it definitely shows up in the way I build things now.</p>
      </div>

      <div className="tech_section">
        <h3 className="tech_header">What stuck with me</h3>
        <p className="tech_prose">Now I maintain multiple versions of my dotfiles, each with a different look, workflow, and mood, all version-controlled on GitHub. Every setup is the result of experimenting, obsessing over details, and slowly refining the parts that matter. Ricing taught me patience, problem-solving, and how much small system decisions can change the experience of using a machine.</p>
        <p className="tech_prose">Linux isn&apos;t just an operating system to me. It&apos;s a sandbox, a learning tool, and honestly a creative medium. It&apos;s where my love for documentation, systems thinking, and customization really came together.</p>
        <div className="tech_badges">
          <img src="https://img.shields.io/badge/Arch_Linux-1793D1?style=for-the-badge&logo=arch-linux&logoColor=white" alt="Arch Linux" />
          <img src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white" alt="Ubuntu" />
          <img src="https://img.shields.io/badge/Fedora-294172?style=for-the-badge&logo=fedora&logoColor=white" alt="Fedora" />
          <img src="https://img.shields.io/badge/Pop!_OS-48B9C7?style=for-the-badge&logo=pop!_os&logoColor=white" alt="Pop!_OS" />
          <img src="https://img.shields.io/badge/Linux_Mint-87CF3E?style=for-the-badge&logo=linux-mint&logoColor=white" alt="Linux Mint" />
          <img src="https://img.shields.io/badge/Kali_Linux-268BEE?style=for-the-badge&logo=kali-linux&logoColor=white" alt="Kali Linux" />
          <img src="https://img.shields.io/badge/GNOME-424242?style=for-the-badge&logo=gnome&logoColor=white" alt="GNOME" />
          <img src="https://img.shields.io/badge/KDE-1D99F3?style=for-the-badge&logo=kde&logoColor=white" alt="KDE" />
          <img src="https://img.shields.io/badge/i3wm-223344?style=for-the-badge&logo=i3wm&logoColor=white" alt="i3wm" />
          <img src="https://img.shields.io/badge/Bash-4EAA25?style=for-the-badge&logo=gnu-bash&logoColor=white" alt="Bash" />
        </div>
      </div>
    </div>
  );

  const bioText = (
    <div className="technology-content">
      <div className="tech_section">
        <h3 className="tech_header">Who I Am</h3>
        <p className="tech_prose">I'm in 11th grade, studying AI and Design Thinking. Tech and electronics have been around me for as long as I can remember. My dad taught me C and C++ when I was eight, which mostly had the effect of making me even more curious about how things work. I care about software that is useful, but I also care about software that feels memorable. I like building things, solving hard problems, and thinking algorithmically through competitive programming and LeetCode. When I'm not coding, I'm usually messing with hardware, working with PCBs, or making small game projects.</p>
      </div>

      <div className="tech_section">
        <h3 className="tech_header">What Drives Me</h3>
        <p className="tech_prose">What keeps me interested is the overlap between building, problem-solving, and design. I don't really see them as separate lanes. Building turns ideas into something real. Problem-solving keeps the system solid. Design makes the whole thing feel human. I like moving between all three instead of staying in just one.</p>
      </div>

      <div className="tech_section">
        <h3 className="tech_header">Why I Build</h3>
        <p className="tech_prose">I build because I like exploration more than comfort. New tools, unfamiliar systems, weird ideas - I want to push into them and see what happens. Part of that is curiosity. Part of it is proving to myself that I can learn quickly and turn that into something real. Building is how I test myself, not just how I make things.</p>
      </div>

      <div className="tech_section">
        <h3 className="tech_header">How I Learn</h3>
        <p className="tech_prose">I feel most at home in documentation. I like learning tools from the ground up instead of just copying the nearest pattern and hoping it holds. I read the docs carefully, cross-reference things, try them, break them, fix them, and try again. Trial and error teaches me faster than anything else because once I see why something fails, I usually remember it. The lesson sticks even better when it's tied to something I'm actually building.</p>
      </div>

      <div className="tech_section">
        <h3 className="tech_header">My Approach to Work</h3>
        <p className="tech_prose">I care a lot about polish, clarity, and correctness. If something feels off, I have a hard time leaving it alone. That probably is a kind of perfectionism, but I try to balance it with iteration. I'd rather ship something strong, then keep tightening it, than wait forever for some imaginary perfect version.</p>
      </div>

      <div className="tech_section">
        <h3 className="tech_header">How I Think</h3>
        <p className="tech_prose">I'm curious in a way that can get a little out of hand. If something works, I want to know why. If it breaks, I want to know exactly where. That usually pulls me deeper into systems than I planned, but it's also how I end up finding cleaner designs and better solutions.</p>
      </div>
    </div>
  );

  const hobbyText = (
    <div className="hobby-content">
      <div className="hobby_section">
        <h3 className="hobby_header hobby_header_intro">Hobbies - curiosity, obsession, and too many rabbit holes</h3>
        <p className="hobby_prose">I&apos;ve never really been good at casual hobbies. If something grabs me, I usually go all the way in. That has left me with a weirdly wide range of interests, and from the outside it probably looks like I spread myself too thin. Maybe I do. But this is just how I move through the world: I get curious, I chase the thing, and I keep going until I understand it better than I did yesterday.</p>
      </div>

      <div className="hobby_section hobby_section_accented">
        <h3 className="hobby_header">Competitive FPS - precision, discipline, and repetition</h3>
        <p className="hobby_prose">FPS games were one of my earliest serious interests. I grew up playing Counter-Strike with my dad, starting with CS 1.6 and Source long before ranked culture and esports were everywhere. Those sessions taught me patience, precision, spacing, and the kind of mechanical discipline that only repetitive failure really teaches.</p>
        <p className="hobby_prose">That interest only got deeper over time. I put thousands of hours into games that punish inconsistency and reward small improvements. Reaching Global Elite in CS:GO and Champion in Rainbow Six Siege wasn&apos;t talent carrying me. It was repetition, reviewing mistakes, tightening small decisions, and caring about marginal gains more than most people probably should. I still like mechanically hard games even when I&apos;m bad at them. Valorant is part of that. I care more about the ceiling than the short-term ego hit.</p>
      </div>

      <div className="hobby_section hobby_section_accented">
        <h3 className="hobby_header">Roguelikes - systems, improvisation, and controlled chaos</h3>
        <p className="hobby_prose">Where FPS games sharpen reflexes, roguelikes sharpen how I think. I get completely locked into systems: how mechanics interact, stack, bend, and occasionally break in ways the designer probably didn&apos;t expect. I love trying to build the perfect run out of imperfect options, especially when randomness forces me to adapt instead of following a script.</p>
        <p className="hobby_prose">That obsession covers a lot of ground. Traditional roguelikes, deck-builders, platformers like Hollow Knight, Celeste, and Dead Cells, even chaotic roguelites where risk management starts feeling like half the game. The loop of experiment, fail, adjust, repeat feels incredibly natural to me because it&apos;s basically the same loop I use when I&apos;m coding.</p>
      </div>

      <div className="hobby_section hobby_section_accented">
        <h3 className="hobby_header">Modding & Tinkering - pushing systems past the intended path</h3>
        <p className="hobby_prose">I&apos;ve always liked modding, even when I haven&apos;t had enough time to go as deep as I want. Roblox scripting, Minecraft modding, weird tweaks that make a system behave differently than it was meant to - that stuff always pulls me in. I like seeing where the boundaries are, then seeing how far they can be bent before something gives way.</p>
      </div>

      <div className="hobby_section hobby_section_accented">
        <h3 className="hobby_header">PC Hardware - engineering I can actually touch</h3>
        <p className="hobby_prose">Hardware curiosity got wired into me early. My dad built PCs regularly, and I grew up watching parts turn into functioning systems. That turned into real fascination pretty quickly. I don&apos;t just like hardware because it looks cool. I like understanding why it works the way it does.</p>
        <p className="hobby_prose">I can spend way too long reading about GPU architecture, CPU design, thermals, power delivery, and tiny performance tradeoffs most people would never care about. I genuinely enjoy the engineering decisions behind all of it. That mindset carries over into software too. I like seeing the constraints, not just the final result.</p>
      </div>

      <div className="hobby_section hobby_section_accented">
        <h3 className="hobby_header">Cars - engineering with personality</h3>
        <p className="hobby_prose">Cars scratch the same part of my brain as PC hardware, just with more emotion attached. I like both the performance side and the aesthetic side, from serious tuning to full-on ricing. Older JDM cars especially live rent-free in my head. If I could Frankenstein the perfect one together, it would probably have the exterior of a 1996 Acura NSX-T and the interior of a 300ZX Turbo.</p>
        <p className="hobby_prose">What I like about cars is the same thing I like about tech: engineering, design, and identity all meeting in the same object.</p>
      </div>

      <div className="hobby_section hobby_section_accented">
        <h3 className="hobby_header">Archery - focus, control, and precision</h3>
        <p className="hobby_prose">Archery is one of the few physical hobbies I&apos;ve consistently stuck with. It doesn&apos;t reward raw speed or endurance, which is probably part of why it clicked for me. It rewards control. Breathing, posture, grip, tension, tiny adjustments - everything matters. It&apos;s quiet, technical, and weirdly calming.</p>
      </div>

      <div className="hobby_section hobby_section_accented">
        <h3 className="hobby_header">Music - always on</h3>
        <p className="hobby_prose">Music is basically always somewhere in the background of my life. I listen to it in class, at home, while coding, studying, eating, and sometimes even while falling asleep. I mostly gravitate toward pop, hip-hop, and rap. It affects my pace, my focus, and honestly the mood of how I work more than I probably notice in the moment.</p>
      </div>

      <div className="hobby_section hobby_section_accented">
        <h3 className="hobby_header">Anime, Manga & Manhwa - the never-ending rabbit hole</h3>
        <p className="hobby_prose">Anime is easily one of my deepest rabbit holes. I&apos;ve been watching since I was nine and I&apos;ve gone through hundreds of series, from rom-coms to shounen to seinen. Manga and manhwa came later, but with the same level of commitment. At this point I&apos;ve read an absurd number of titles across basically every subgenre I could get my hands on.</p>
        <p className="hobby_prose">I&apos;m also completely aware that I enjoy familiar tropes, regression stories, and occasionally some absolute generic slop. I don&apos;t really see that as a problem. Familiarity has its own appeal, and even repetitive stories can still have good pacing, style, or ideas. A lot of my visual taste and narrative instinct comes from spending way too much time in those worlds.</p>
      </div>

      <div className="hobby_section">
        <h3 className="hobby_header hobby_header_outro">Why So Many Things?</h3>
        <p className="hobby_prose">I don&apos;t have a clean explanation for why I get into so many things this deeply. I do spread myself thin. I do chase too many niches. I do have trouble letting interests go once they get their hooks in. But at this point that&apos;s just part of who I am. Each obsession sharpens a different part of how I think.</p>
        <p className="hobby_prose">From the outside it can look like distraction. For me it feels more like creative overlap. Ideas from one thing keep leaking into another, and that changes how I design, build, and solve problems.</p>
      </div>
    </div>
  );

  const employmentText = (
    <div className="technology-content">
      <div className="tech_section">
        <h3 className="tech_header">Hardware Beginnings</h3>
        <p className="tech_prose">A lot of my hands-on experience started with hardware before it moved deeper into software. One of the earliest things I took seriously was Game Boy modding. I sourced parts, rebuilt old handhelds, handled shell swaps, screen upgrades, internal repairs, and tuning, then sold custom units on my own. That work taught me precision, patience, and how much small technical choices can change the final user experience.</p>
      </div>

      <div className="tech_section">
        <h3 className="tech_header">PC Builds & Device Repair</h3>
        <p className="tech_prose">Beyond retro hardware, I&apos;ve spent a lot of time building PCs and repairing devices. I&apos;ve assembled custom desktops, troubleshot laptops, and fixed phones and other consumer electronics. That kind of work sharpens your diagnostic thinking fast. It also gives you a very practical sense of how thermals, power delivery, physical constraints, and software behavior all collide in real systems.</p>
      </div>

      <div className="tech_section">
        <h3 className="tech_header">Professional Software Experience</h3>
        <p className="tech_prose">On the software side, I interned at Anthropic as a model tuner. That gave me a closer look at how large-scale AI systems are evaluated, refined, and aligned in practice. More than anything, it exposed me to production-grade workflows, careful experimentation, and the weight that comes with working on systems real people actually depend on.</p>
      </div>

      <div className="tech_section">
        <h3 className="tech_header">Client Work & Web Development</h3>
        <p className="tech_prose">I&apos;ve also built and shipped websites for real clients, from product landing pages to internal tools and SaaS-style apps. Those projects pushed me past surface-level design and forced me to care about performance, usability, and maintainability at the same time. A lot of that work is documented across my GitHub and portfolio because I care more about shipping real things than building pretty isolated demos.</p>
      </div>

      <div className="tech_section">
        <h3 className="tech_header">Game Development</h3>
        <p className="tech_prose">Game development has been another long-running thread through my work. I&apos;ve built amateur and experimental projects in Godot, Unity, Unreal, and Roblox, and every one of them taught me something about gameplay systems, tooling, rendering, or iteration. Not all of those projects were commercial, but they were all useful. They taught me how to move fast, work within constraints, and make something that actually feels good to interact with.</p>
      </div>

      <div className="tech_section">
        <h3 className="tech_header">Open Source & System Configuration</h3>
        <p className="tech_prose">Outside of client work and internships, I maintain several open-source Arch Linux rice setups. They focus on usability, performance, and aesthetics, and I keep them public because they reflect a part of my work that matters to me: operating systems, workflow design, and the idea that your environment can either help your thinking or get in the way of it.</p>
      </div>

      <div className="tech_section">
        <h3 className="tech_header">Competitions & Team Experience</h3>
        <p className="tech_prose">I&apos;ve also taken part in competitions, hackathons, and game-focused events where the pace is fast and the deadlines are not generous. That kind of environment teaches teamwork quickly. On the competitive side, I&apos;ve done scrims in games like CS2, CS:GO, and Rainbow Six Siege, which reinforced the same things from a different angle: communication, discipline, and staying calm when decisions have to happen fast.</p>
      </div>

      <div className="tech_section">
        <h3 className="tech_header">Academic Tutoring - Mathematics & Physics</h3>
        <p className="tech_prose">I&apos;ve also tutored 8th and 9th grade students in math and physics. What I enjoy there is breaking complicated ideas into steps that actually make sense to the person in front of me. It forced me to communicate clearly, explain the reasoning instead of just the answer, and make sure the student understood the principle rather than memorizing the move. Teaching ended up sharpening my own foundations too.</p>
      </div>

      <div className="tech_section">
        <h3 className="tech_header">Overall Philosophy</h3>
        <p className="tech_prose">Overall, my experience doesn&apos;t fit neatly into one title. It&apos;s been shaped by experimenting, building real things, breaking systems, fixing them, and slowly getting better across both hardware and software.</p>
      </div>
    </div>
  );

      function handleDragStop(event, data) {
        const positionX = data.x 
        const positionY = data.y
        setMybioExpand(prev => ({
          ...prev,
          x: positionX,
          y: positionY
        }))

      }


  function handleBiotap(name) {
    setGenerapTap(name === 'general');
    setTechnologyTap(name === 'technology');
    setLinuxTap(name === 'linux');
    setHobbTap(name === 'hobby');
    setEmploymentTap(name === 'employment');
  }

  // Scroll to top when tab changes
  useEffect(() => {
    if (generalTap && generalScroll.current) {
      generalScroll.current.scrollTop = 0;
    }
  }, [generalTap]);

  useEffect(() => {
    if (technologyTap && technologyScroll.current) {
      technologyScroll.current.scrollTop = 0;
    }
  }, [technologyTap]);

  useEffect(() => {
    if (linuxTap && linuxScroll.current) {
      linuxScroll.current.scrollTop = 0;
    }
  }, [linuxTap]);

  useEffect(() => {
    if (hobbTap && hobbyScroll.current) {
      hobbyScroll.current.scrollTop = 0;
    }
  }, [hobbTap]);

  useEffect(() => {
    if (employmentTap && employmentScroll.current) {
      employmentScroll.current.scrollTop = 0;
    }
  }, [employmentTap]);

  const activeBtnStyle = {
    bottom: '2px',
    outline: '1px dotted black',
    outlineOffset: '-5px',
    borderBottomColor: '#c5c4c4',
    zIndex: '3'
  };


  return (
    <>
      <Draggable
        axis="both" 
        handle={'.folder_dragbar'}
        grid={[1, 1]}
        scale={1}
        disabled={MybioExpand.expand}
        bounds={{top: 0}}
        defaultPosition={{ 
          x: window.innerWidth <= 500 ? 35 : 70,
          y: window.innerWidth <= 500 ? 35 : 40,
        }}
        onStop={(event, data) => handleDragStop(event, data)}
        onStart={() => handleSetFocusItemTrue('About')}
      >
        <motion.div className='bio_folder' 
            onClick={(e) => {
              e.stopPropagation();
              handleSetFocusItemTrue('About');
            }}
            style={ MybioExpand.expand ? inlineStyleExpand('About') : inlineStyle('About')}>
          <div className="folder_dragbar"
             style={{ background: MybioExpand.focusItem? themeDragBar : '#757579'}}
          >
            <div className="bio_barname">
              <img src={About} alt="About" />
              <span>About</span>
            </div>
            <div className="bio_barbtn">
              <div onClick={ !isTouchDevice ? (e) => {
                e.stopPropagation()
                minimizeWindow(setMybioExpand)
              } : undefined
              }   
                onTouchEnd={(e) => {
                e.stopPropagation()
                minimizeWindow(setMybioExpand)
              }}
              onTouchStart={(e) => e.stopPropagation()}
              >
                <p className='dash'></p>
              </div>

                <div>
                <p className='x'
                  onClick={!isTouchDevice ? () => {
                    deleteTap('About')
                    handleBiotap('general')
                  }: undefined}
                  onTouchEnd={() => {
                    deleteTap('About')
                    handleBiotap('general')
                  }}
                >&times;
                </p>
              </div>
            </div>
          </div>
          <div className="file_tap_container-bio">
          <p  onClick={() => handleBiotap('general')}
              style={generalTap ? activeBtnStyle : {}}
          >Who I Am
          </p>
          <p onClick={() => handleBiotap('technology')}
              style={technologyTap ? activeBtnStyle : {}}
          >Technology
          </p>
          <p onClick={() => handleBiotap('linux')}
              style={linuxTap ? activeBtnStyle : {}}
          >Linux
          </p>
          <p onClick={() => handleBiotap('hobby')}
                  style={hobbTap ? activeBtnStyle : {}}
          >Hobby
          </p>
          <p onClick={() => handleBiotap('employment')}
                  style={employmentTap ? activeBtnStyle : {}}
          >Being Employed
          </p>
          </div>
          <div className="folder_content">
            {/* Who I Am Tab */}
            <div className={`folder_content-bio who-i-am-tab ${generalTap ? 'active' : ''}`}
              style={{ display: generalTap ? 'flex' : 'none' }}
            >
              <img
                alt="bioPC"
                className="bio_img"
                src={bioPC}
              />
              <div className="bio_text_1 bio-scroll-container" ref={generalScroll}>
                {bioText}
              </div>   
            </div>

            {/* Technology Tab */}
            <div className={`folder_content-bio technology-tab ${technologyTap ? 'active' : ''}`}
              style={{ display: technologyTap ? 'flex' : 'none' }}
            >
              <img
                alt="tech"
                className="tech_img"
                src={tech}
              />
              <div className="tech_text_container bio-scroll-container" ref={technologyScroll}>
                {technologyText}
              </div>   
            </div>

            {/* Linux Tab */}
            <div className={`folder_content-bio linux-tab ${linuxTap ? 'active' : ''}`}
              style={{ display: linuxTap ? 'flex' : 'none' }}
            >
              <img
                alt="linux"
                className="tech_img"
                src={linux}
              />
              <div className="tech_text_container bio-scroll-container" ref={linuxScroll}>
                {linuxText}
              </div>   
            </div>

            {/* Hobby Tab */}
            <div className={`folder_content-bio hobby-tab ${hobbTap ? 'active' : ''}`}
              style={{ display: hobbTap ? 'flex' : 'none' }}
            >
              <img
                alt="hobby"
                className="hobby_img"
                src={hobby}
              />
              <div className="hobby_text_container bio-scroll-container" ref={hobbyScroll}>
                {hobbyText}
              </div>   
            </div>

            {/* Employment Tab */}
            <div className={`folder_content-bio MyBioFolderEmploymentTap ${employmentTap ? 'active' : ''}`}
              style={{ display: employmentTap ? 'flex' : 'none' }}
            >
              <img
                alt="job"
                className="tech_img"
                src={job}
              />
              <div className="tech_text_container bio-scroll-container" ref={employmentScroll}>
                {employmentText}
              </div>   
            </div>
            <div className="bio_btn_container">
              <div className="bio_btn_ok"
              onClick={!isTouchDevice ? () => {
                deleteTap('About')
                handleBiotap('general')
              } : undefined}
              onTouchEnd={() => {
                deleteTap('About')
                handleBiotap('general')
              }}
              >
                <span>
                  OK
                </span>
              </div>
              <div className="bio_btn_cancel"
              onClick={!isTouchDevice ? () => {
                deleteTap('About')
                handleBiotap('general')
              } : undefined}
              onTouchEnd={() => {
                deleteTap('About')
                handleBiotap('general')
              }}
              ><span>Cancel</span></div>
            </div>
          </div>
        </motion.div>
      </Draggable>
    </>
  )
}          

export default MyBioFolder
