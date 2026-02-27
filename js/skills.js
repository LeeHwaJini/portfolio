// ===================================
// Skills & About 섹션 애니메이션
// ===================================
const { gsap, ScrollTrigger } = window;

export function initSkillsAnimations() {
  // About 제목 Text Split
  // const aboutTitle = document.querySelector(".about-title");
  // if (aboutTitle) {
  //   const text = aboutTitle.innerHTML;
  //   const lines = text.split("<br>");
  //   aboutTitle.innerHTML = "";

  //   lines.forEach((line, lineIndex) => {
  //     const lineDiv = document.createElement("div");
  //     lineDiv.style.overflow = "hidden";

  //     const words = line.split(" ");
  //     words.forEach((word) => {
  //       const wordSpan = document.createElement("span");
  //       wordSpan.style.display = "inline-block";
  //       wordSpan.style.marginRight = "0.3em";
  //       wordSpan.textContent = word;
  //       lineDiv.appendChild(wordSpan);
  //     });

  //     aboutTitle.appendChild(lineDiv);
  //     if (lineIndex < lines.length - 1) {
  //       aboutTitle.appendChild(document.createElement("br"));
  //     }
  //   });

  //   gsap.from(".about-title div span", {
  //     scrollTrigger: {
  //       trigger: ".about-title",
  //       start: "top 80%",
  //       toggleActions: "play none none reverse",
  //     },
  //     y: 100,
  //     opacity: 0,
  //     stagger: 0.05,
  //     duration: 0.8,
  //     ease: "power3.out",
  //   });
  // }

  // About Description
  gsap.from(".about-description", {
    scrollTrigger: {
      trigger: ".about-description",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
    delay: 0.2,
  });

  // Stats Counter Animation
  const statNumbers = document.querySelectorAll(".stat-number");
  statNumbers.forEach((stat) => {
    const target = parseInt(stat.getAttribute("data-count") || "0");

    ScrollTrigger.create({
      trigger: stat,
      start: "top 85%",
      onEnter: () => {
        gsap.from(stat, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });

        gsap.to(stat, {
          innerHTML: target,
          duration: 2,
          ease: "power1.out",
          snap: { innerHTML: 1 },
          onUpdate: function () {
            stat.innerHTML = Math.ceil(stat.innerHTML);
          },
        });
      },
    });
  });

  // Tech Nodes
  gsap.from(".tech-node", {
    scrollTrigger: {
      trigger: ".tech-cluster",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
    scale: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "back.out(1.7)",
  });

  // Connection Lines
  const connectionLines = document.querySelectorAll(".connection-line");
  if (connectionLines.length) {
    gsap.from(connectionLines, {
      scrollTrigger: {
        trigger: ".tech-cluster",
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      strokeDasharray: 1000,
      strokeDashoffset: 1000,
      duration: 1.5,
      stagger: 0.2,
      ease: "power2.inOut",
    });
  }

  // Skills Progress Bars
  const skillItems = document.querySelectorAll(".skill-item");
  skillItems.forEach((item) => {
    const progressBar = item.querySelector(".skill-progress");
    const percentage = item.querySelector(".skill-percentage");
    const target = parseInt(percentage?.getAttribute("data-target") || "0");

    ScrollTrigger.create({
      trigger: item,
      start: "top 85%",
      onEnter: () => {
        gsap.from(item, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });

        gsap.to(progressBar, {
          width: target + "%",
          duration: 1,
          ease: "power2.out",
          delay: 0.2,
        });

        gsap.to(percentage, {
          innerHTML: target,
          duration: 1,
          ease: "power1.out",
          delay: 0.2,
          snap: { innerHTML: 1 },
          onUpdate: function () {
            percentage.innerHTML = Math.ceil(percentage.innerHTML) + "%";
          },
        });
      },
    });
  });

  // Tech Nodes Interactive
  initTechNodesInteractive();

  // Skills CTA (있을 경우만)
  const skillsCta = document.querySelector(".skills-cta");
  if (skillsCta) {
    gsap.from(skillsCta, {
      scrollTrigger: {
        trigger: ".skills-action",
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  }

  // Tech Cluster 마우스 인터랙션
  initTechClusterInteraction();
}

function initTechNodesInteractive() {
  const techNodes = document.querySelectorAll(".tech-node");

  techNodes.forEach((node) => {
    node.addEventListener("mouseenter", () => {
      gsap.to(node, {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out",
      });

      const lines = document.querySelectorAll(".connection-line");
      gsap.to(lines, {
        stroke: "#7998f2",
        opacity: 1,
        strokeWidth: 2,
        duration: 0.3,
      });
    });

    node.addEventListener("mouseleave", () => {
      gsap.to(node, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      const lines = document.querySelectorAll(".connection-line");
      gsap.to(lines, {
        stroke: "#666666",
        opacity: 0.3,
        strokeWidth: 1,
        duration: 0.3,
      });
    });

    node.addEventListener("click", () => {
      gsap.to(node, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    });
  });
}

function initTechClusterInteraction() {
  const techCluster = document.querySelector(".tech-cluster");

  if (!techCluster) return;

  techCluster.addEventListener("mousemove", (e) => {
    const rect = techCluster.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;

    gsap.to(techCluster, {
      rotateY: x,
      rotateX: -y,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 1000,
    });
  });

  techCluster.addEventListener("mouseleave", () => {
    gsap.to(techCluster, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    });
  });
}
