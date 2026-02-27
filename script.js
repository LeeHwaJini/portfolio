// ===================================
// GSAP 초기화
// ===================================
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ===================================
// 커스텀 커서
// ===================================
const cursor = document.querySelector(".cursor");
const cursorFollower = document.querySelector(".cursor-follower");

let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  gsap.to(cursor, {
    x: mouseX,
    y: mouseY,
    duration: 0.1,
    ease: "power2.out",
  });

  gsap.to(cursorFollower, {
    x: mouseX,
    y: mouseY,
    duration: 0.3,
    ease: "power2.out",
  });

  requestAnimationFrame(animateCursor);
}

animateCursor();

// 링크 호버 시 커서 확대
const interactiveElements = document.querySelectorAll(
  "a, button, .project-link, input, textarea",
);
interactiveElements.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    gsap.to(cursorFollower, {
      scale: 2,
      duration: 0.3,
    });
  });

  el.addEventListener("mouseleave", () => {
    gsap.to(cursorFollower, {
      scale: 1,
      duration: 0.3,
    });
  });
});

// ===================================
// 프리로더
// ===================================
window.addEventListener("load", () => {
  const timeline = gsap.timeline();

  timeline
    .to(".loader-bar", {
      width: "100%",
      duration: 1.5,
      ease: "power2.inOut",
    })
    .to(".preloader", {
      y: "-100%",
      duration: 0.8,
      ease: "power3.inOut",
      onComplete: () => {
        document.querySelector(".preloader").style.display = "none";
      },
    })
    .from(
      ".navbar",
      {
        y: -100,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.3",
    )
    .from(
      ".hero-label",
      {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.4",
    );

  // ===================================
  // Text Split Reveal - Hero Title
  // ===================================
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    // 단어별로 분리
    const words = heroTitle.querySelectorAll(".word");

    words.forEach((word) => {
      // 각 단어를 글자로 분리
      const text = word.textContent;
      word.innerHTML = "";

      text.split("").forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        word.appendChild(span);
      });
    });

    // 글자별 애니메이션
    timeline.from(
      ".hero-title .word span",
      {
        y: 100,
        opacity: 0,
        rotateX: -90,
        stagger: {
          each: 0.03,
          from: "start",
        },
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.3",
    );
  }

  timeline
    .from(
      ".hero-subtitle",
      {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.4",
    )
    .from(
      ".hero-scroll",
      {
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.3",
    );
});

// ===================================
// 네비게이션
// ===================================
const navbar = document.querySelector(".navbar");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  lastScroll = currentScroll;
});

// 햄버거 메뉴
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger) {
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");

    const spans = hamburger.querySelectorAll("span");
    if (navMenu.classList.contains("active")) {
      gsap.to(spans[0], { rotation: 45, y: 4.5, duration: 0.3 });
      gsap.to(spans[1], { rotation: -45, y: -4.5, duration: 0.3 });
    } else {
      gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
      gsap.to(spans[1], { rotation: 0, y: 0, duration: 0.3 });
    }
  });
}

// 부드러운 스크롤
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");

    if (targetId === "#home") {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: 0 },
        ease: "power3.inOut",
      });
    } else {
      const target = document.querySelector(targetId);
      if (target) {
        gsap.to(window, {
          duration: 1.2,
          scrollTo: { y: target, offsetY: 100 },
          ease: "power3.inOut",
        });
      }
    }

    // 모바일 메뉴 닫기
    if (navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      const spans = hamburger.querySelectorAll("span");
      gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
      gsap.to(spans[1], { rotation: 0, y: 0, duration: 0.3 });
    }
  });
});

// ===================================
// About 섹션 애니메이션
// ===================================
// gsap.from(".about-section .section-label", {
//   scrollTrigger: {
//     trigger: ".about-section",
//     start: "top 80%",
//     toggleActions: "play none none reverse",
//   },
//   y: 50,
//   opacity: 0,
//   duration: 0.8,
//   ease: "power3.out",
// });

// About 제목 Text Split
const aboutTitle = document.querySelector(".about-title");
if (aboutTitle) {
  const text = aboutTitle.innerHTML;
  const lines = text.split("<br>");
  aboutTitle.innerHTML = "";

  lines.forEach((line, lineIndex) => {
    const lineDiv = document.createElement("div");
    lineDiv.style.overflow = "hidden";

    const words = line.split(" ");
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement("span");
      wordSpan.style.display = "inline-block";
      wordSpan.style.marginRight = "0.3em";
      wordSpan.textContent = word;
      lineDiv.appendChild(wordSpan);
    });

    aboutTitle.appendChild(lineDiv);
    if (lineIndex < lines.length - 1) {
      aboutTitle.appendChild(document.createElement("br"));
    }
  });

  gsap.from(".about-title div span", {
    scrollTrigger: {
      trigger: ".about-title",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
    y: 100,
    opacity: 0,
    stagger: 0.05,
    duration: 0.8,
    ease: "power3.out",
  });
}

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

// 통계 애니메이션 (Number Counter 강화)
const statNumbers = document.querySelectorAll(".stat-number");

statNumbers.forEach((stat, index) => {
  const target = parseInt(stat.getAttribute("data-count"));

  // 등장 애니메이션
  gsap.from(stat.parentElement, {
    scrollTrigger: {
      trigger: stat.parentElement,
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
    delay: index * 0.15,
  });

  // 숫자 카운트 애니메이션 (개선)
  ScrollTrigger.create({
    trigger: stat,
    start: "top 80%",
    onEnter: () => {
      let obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2.5,
        ease: "power2.out",
        onUpdate: function () {
          stat.innerHTML = Math.ceil(obj.val);
        },
        onComplete: function () {
          stat.innerHTML = target;
        },
      });
    },
  });
});

// ===================================
// Expertise 섹션 - Interactive Skills Canvas
// ===================================
// gsap.from(".expertise-section .section-label", {
//   scrollTrigger: {
//     trigger: ".expertise-section",
//     start: "top 80%",
//     toggleActions: "play none none reverse",
//   },
//   y: 50,
//   opacity: 0,
//   duration: 0.8,
//   ease: "power3.out",
// });

// Tech Nodes 애니메이션
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

// Connection Lines 애니메이션
gsap.from(".connection-line", {
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

// Skills Intro 애니메이션
gsap.from(".skills-intro", {
  scrollTrigger: {
    trigger: ".skills-progress-container",
    start: "top 80%",
    toggleActions: "play none none reverse",
  },
  y: 40,
  opacity: 0,
  duration: 0.8,
  ease: "power3.out",
});

// Skills Progress Bars
const skillItems = document.querySelectorAll(".skill-item");
skillItems.forEach((item, index) => {
  const progressBar = item.querySelector(".skill-progress");
  const percentage = item.querySelector(".skill-percentage");
  const target = parseInt(percentage.getAttribute("data-target"));

  ScrollTrigger.create({
    trigger: item,
    start: "top 85%",
    onEnter: () => {
      // 등장 애니메이션
      gsap.from(item, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // 프로그레스 바 애니메이션
      gsap.to(progressBar, {
        width: target + "%",
        duration: 2,
        ease: "power2.out",
        delay: 0.2,
      });

      // 퍼센티지 카운터 애니메이션
      gsap.to(percentage, {
        innerHTML: target,
        duration: 2,
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

// Tech Nodes 인터랙티브 효과
const techNodes = document.querySelectorAll(".tech-node");
techNodes.forEach((node) => {
  node.addEventListener("mouseenter", () => {
    gsap.to(node, {
      scale: 1.1,
      duration: 0.3,
      ease: "power2.out",
    });

    // 연결선 강조 - 검정색으로
    const lines = document.querySelectorAll(".connection-line");
    gsap.to(lines, {
      stroke: "#0a0a0a", // 검정색
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
      stroke: "#666666", // 회색으로 복구
      opacity: 0.3,
      strokeWidth: 1,
      duration: 0.3,
    });
  });

  // 클릭 시 펄스 효과
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

// Skills CTA 애니메이션
gsap.from(".skills-cta", {
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

// Tech Cluster 마우스 인터랙션 (3D 효과)
const techCluster = document.querySelector(".tech-cluster");
if (techCluster) {
  techCluster.addEventListener("mousemove", (e) => {
    const rect = techCluster.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;

    // 각 노드에 대해 다른 속도로 움직임
    techNodes.forEach((node, index) => {
      const speed = (index + 1) * 0.5;
      const moveX = deltaX * speed * 10;
      const moveY = deltaY * speed * 10;

      gsap.to(node, {
        x: moveX,
        y: moveY,
        duration: 0.8,
        ease: "power2.out",
      });
    });
  });

  techCluster.addEventListener("mouseleave", () => {
    techNodes.forEach((node) => {
      gsap.to(node, {
        x: 0,
        y: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
      });
    });
  });
}

// ===================================
// Scroll Progress Bar (프로젝트 기준)
// ===================================
const scrollProgressBar = document.querySelector(".scroll-progress-bar");

ScrollTrigger.create({
  trigger: ".projects-section",
  start: "top top",
  end: "bottom bottom",
  onUpdate: (self) => {
    const progress = self.progress * 100;
    scrollProgressBar.style.width = `${progress}%`;
  },
});

// ===================================
// Projects 섹션 - 가로 스크롤만
// ===================================
const projectsContainer = document.querySelector(".projects-scroll-container");

if (projectsContainer) {
  const projectsMM = gsap.matchMedia();

  projectsMM.add("(min-width: 969px)", () => {
    // 가로 스크롤
    // const getScrollAmount = () => {
    //   const scrollWidth = projectsContainer.scrollWidth;
    //   return -(scrollWidth - window.innerWidth + 160);
    // };

    // const scrollTween = gsap.to(projectsContainer, {
    //   x: getScrollAmount,
    //   ease: "none",
    //   scrollTrigger: {
    //     trigger: ".projects-section",
    //     start: "top top",
    //     end: () => {
    //       const distance = projectsContainer.scrollWidth - window.innerWidth + 160;
    //       return `+=${distance}`;
    //     },
    //     pin: ".projects-section",
    //     scrub: 1,
    //     invalidateOnRefresh: true,
    //     anticipatePin: 1,
    //     pinSpacing: true,
    //   },
    // });

    // ===================================
    // Image Reveal 효과
    // ===================================
    const projectCards = document.querySelectorAll(".project-card");

    projectCards.forEach((card, index) => {
      const image = card.querySelector(".project-image");

      // 이미지 Reveal 애니메이션
      gsap.fromTo(
        image,
        {
          clipPath: "inset(0 100% 0 0)",
        },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "left 80%",
            containerAnimation: scrollTween,
            toggleActions: "play none none reverse",
          },
        },
      );

      // 카드 정보 등장
      gsap.from(card.querySelector(".project-info"), {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "left 75%",
          containerAnimation: scrollTween,
          toggleActions: "play none none reverse",
        },
      });
    });

    // ===================================
    // 3D Card Tilt 효과
    // ===================================
    projectCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.5,
          ease: "power2.out",
          transformPerspective: 1000,
        });

        // 이미지도 살짝 움직임
        gsap.to(card.querySelector(".project-image"), {
          x: ((x - centerX) / centerX) * 10,
          y: ((y - centerY) / centerY) * 10,
          duration: 0.5,
          ease: "power2.out",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
        });

        gsap.to(card.querySelector(".project-image"), {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.5)",
        });
      });
    });
  });

  // 모바일
  projectsMM.add("(max-width: 968px)", () => {
    const projectCards = document.querySelectorAll(".project-card");

    projectCards.forEach((card) => {
      const image = card.querySelector(".project-image");

      // 이미지 Reveal
      gsap.fromTo(
        image,
        {
          clipPath: "inset(0 100% 0 0)",
        },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // 카드 정보
      gsap.from(card.querySelector(".project-info"), {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    });
  });
}

// ===================================
// 패럴랙스 효과
// ===================================
// gsap.utils.toArray(".section-label").forEach((label) => {
//   gsap.to(label, {
//     scrollTrigger: {
//       trigger: label,
//       start: "top bottom",
//       end: "bottom top",
//       scrub: 1,
//     },
//     y: -30,
//   });
// });

// Hero 제목 패럴랙스
gsap.to(".hero-title", {
  scrollTrigger: {
    trigger: ".hero-section",
    start: "top top",
    end: "bottom top",
    scrub: 1,
  },
  y: 100,
  opacity: 0.5,
});

gsap.to(".hero-subtitle", {
  scrollTrigger: {
    trigger: ".hero-section",
    start: "top top",
    end: "bottom top",
    scrub: 1,
  },
  y: 150,
  opacity: 0,
});

// ===================================
// 프로젝트 카드 호버 효과
// ===================================
document.querySelectorAll(".project-card").forEach((card) => {
  const image = card.querySelector(".project-image");
  const placeholder = card.querySelector(".project-placeholder");

  card.addEventListener("mouseenter", () => {
    gsap.to(card, {
      y: -10,
      duration: 0.5,
      ease: "power2.out",
    });

    if (placeholder) {
      gsap.to(placeholder, {
        scale: 1.15,
        rotation: 5,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  });

  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    });

    if (placeholder) {
      gsap.to(placeholder, {
        scale: 1,
        rotation: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  });
});

// ===================================
// 버튼 호버 효과
// ===================================
const btnSubmit = document.querySelector(".btn-submit");
if (btnSubmit) {
  btnSubmit.addEventListener("mouseenter", () => {
    gsap.to(btnSubmit, {
      y: -4,
      duration: 0.3,
      ease: "power2.out",
    });
  });

  btnSubmit.addEventListener("mouseleave", () => {
    gsap.to(btnSubmit, {
      y: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  });
}

// ===================================
// 페이지 전환 부드럽게
// ===================================
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
});

// ===================================
// View All 버튼 애니메이션
// ===================================
const viewAllBtn = document.querySelector(".view-all-btn");
if (viewAllBtn) {
  viewAllBtn.addEventListener("click", (e) => {
    e.preventDefault();

    gsap.to(viewAllBtn, {
      scale: 0.96,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
      onComplete: () => {
        console.log("View All 버튼 클릭!");
      },
    });
  });
}

// ===================================
// Tech Showcase Carousel
// ===================================
function initTechShowcase() {
  let progress = 50; // 중간부터 시작
  let startX = 0;
  let active = 0;
  let isDown = false;

  const speedWheel = 0.02;
  const speedDrag = -0.1;

  const $section = document.querySelector(".tech-showcase-section");
  const $carousel = document.querySelector(".showcase-carousel");
  const $items = document.querySelectorAll(".carousel-item");
  const $prevBtn = document.querySelector(".carousel-nav-prev");
  const $nextBtn = document.querySelector(".carousel-nav-next");

  if (!$items.length || !$section) return;

  // Get Z-index for stacking
  const getZindex = (array, index) =>
    array.map((_, i) =>
      index === i ? array.length : array.length - Math.abs(index - i),
    );

  // Display items with proper z-index and active state
  const displayItems = (item, index, active) => {
    const zIndex = getZindex([...$items], active)[index];
    item.style.setProperty("--zIndex", zIndex);
    item.style.setProperty("--active", (index - active) / $items.length);
  };

  // Animate carousel
  const animate = () => {
    progress = Math.max(0, Math.min(progress, 100));
    active = Math.floor((progress / 100) * ($items.length - 1));

    $items.forEach((item, index) => displayItems(item, index, active));
  };

  animate();

  // ScrollTrigger로 섹션 고정 및 스크롤 시 카드 넘기기
  const techST = ScrollTrigger.create({
    trigger: $section,
    start: "top top",
    end: () => `+=${window.innerHeight * 2}`, // 2배 화면 높이 = 카드 6개 전환
    pin: true,
    scrub: 1,
    anticipatePin: 1,
    pinSpacing: true, // 다음 섹션을 위한 공간 확보
    onUpdate: (self) => {
      // 스크롤 진행도를 progress에 매핑 (0% ~ 100%)
      progress = self.progress * 100;
      animate();
    },
  });

  // Navigation Buttons - ScrollTrigger의 scroll 위치를 업데이트
  if ($prevBtn) {
    $prevBtn.addEventListener("click", () => {
      const currentActive = Math.floor((progress / 100) * ($items.length - 1));
      const prevIndex = Math.max(0, currentActive - 1);
      const targetProgress = prevIndex / ($items.length - 1);

      // ScrollTrigger의 스크롤 위치로 이동
      const scrollStart = techST.start;
      const scrollEnd = techST.end;
      const targetScroll =
        scrollStart + (scrollEnd - scrollStart) * targetProgress;

      gsap.to(window, {
        scrollTo: targetScroll,
        duration: 0.8,
        ease: "power2.inOut",
      });
    });
  }

  if ($nextBtn) {
    $nextBtn.addEventListener("click", () => {
      const currentActive = Math.floor((progress / 100) * ($items.length - 1));
      const nextIndex = Math.min($items.length - 1, currentActive + 1);
      const targetProgress = nextIndex / ($items.length - 1);

      // ScrollTrigger의 스크롤 위치로 이동
      const scrollStart = techST.start;
      const scrollEnd = techST.end;
      const targetScroll =
        scrollStart + (scrollEnd - scrollStart) * targetProgress;

      gsap.to(window, {
        scrollTo: targetScroll,
        duration: 0.8,
        ease: "power2.inOut",
      });
    });
  }

  // Click on Items - ScrollTrigger의 scroll 위치를 업데이트
  $items.forEach((item, i) => {
    item.addEventListener("click", () => {
      const targetProgress = i / ($items.length - 1);

      // ScrollTrigger의 스크롤 위치로 이동
      const scrollStart = techST.start;
      const scrollEnd = techST.end;
      const targetScroll =
        scrollStart + (scrollEnd - scrollStart) * targetProgress;

      gsap.to(window, {
        scrollTo: targetScroll,
        duration: 0.8,
        ease: "power2.inOut",
      });
    });
  });

  // ScrollTrigger 강제 새로고침 (겹침 방지)
  ScrollTrigger.refresh();
}

// ===================================
// Detail Modal Animations
// ===================================
function initDetailAnimations(category) {
  switch (category) {
    case "text":
      initTextAnimations();
      break;
    case "scroll":
      initScrollAnimations();
      break;
    case "canvas":
      initCanvasAnimations();
      break;
    case "svg":
      initSvgAnimations();
      break;
    case "particle":
      initParticleAnimations();
      break;
    case "3d":
      init3DAnimations();
      break;
  }
}

// Text Animations
function initTextAnimations() {
  // Split Text Reveal
  const splitText = document.querySelector(".split-text-demo");
  if (splitText) {
    const text = splitText.textContent;
    splitText.innerHTML = text
      .split("")
      .map(
        (char, i) =>
          `<span style="display:inline-block;opacity:0">${char === " " ? "&nbsp;" : char}</span>`,
      )
      .join("");

    gsap.to(".split-text-demo span", {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.8,
      stagger: 0.03,
      ease: "back.out(1.7)",
    });
  }

  // Text Scramble
  const scrambleEl = document.querySelector(".scramble-demo");
  if (scrambleEl) {
    const originalText = scrambleEl.dataset.text;
    const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    const scramble = () => {
      let iteration = 0;
      const interval = setInterval(() => {
        scrambleEl.textContent = originalText
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");

        if (iteration >= originalText.length) {
          clearInterval(interval);
          setTimeout(scramble, 3000);
        }

        iteration += 1 / 3;
      }, 50);
    };

    scramble();
  }
}

// Scroll Animations
function initScrollAnimations() {
  const progressBar = document.querySelector(".progress-bar");
  if (progressBar) {
    gsap.to(progressBar, {
      scaleX: 1,
      duration: 2,
      repeat: -1,
      ease: "none",
    });
  }

  const numberCounter = document.querySelector(".number-counter");
  if (numberCounter) {
    const target = parseInt(numberCounter.dataset.target);
    gsap.to(numberCounter, {
      innerHTML: target,
      duration: 2,
      snap: { innerHTML: 1 },
      repeat: -1,
      repeatDelay: 1,
    });
  }
}

// Canvas Animations
function initCanvasAnimations() {
  // Particle Canvas
  const particleCanvas = document.querySelector(".particle-canvas");
  if (particleCanvas) {
    const ctx = particleCanvas.getContext("2d");
    particleCanvas.width = particleCanvas.offsetWidth;
    particleCanvas.height = particleCanvas.offsetHeight;

    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 2 + 1,
      });
    }

    function animate() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, particleCanvas.width, particleCanvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > particleCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > particleCanvas.height) p.vy *= -1;

        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  // Wave Canvas
  const waveCanvas = document.querySelector(".wave-canvas");
  if (waveCanvas) {
    const ctx = waveCanvas.getContext("2d");
    waveCanvas.width = waveCanvas.offsetWidth;
    waveCanvas.height = waveCanvas.offsetHeight;

    let offset = 0;

    function drawWave() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, waveCanvas.width, waveCanvas.height);

      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let x = 0; x < waveCanvas.width; x++) {
        const y =
          waveCanvas.height / 2 +
          Math.sin((x + offset) * 0.02) * 50 +
          Math.sin((x + offset) * 0.05) * 20;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }

      ctx.stroke();
      offset += 2;
      requestAnimationFrame(drawWave);
    }

    drawWave();
  }
}

// SVG Animations
function initSvgAnimations() {
  const morphPath = document.querySelector(".morph-path");
  if (morphPath) {
    const shapes = [
      "M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.8C64.8,56.4,53.8,69,39.8,76.8C25.8,84.6,8.8,87.6,-6.5,86.1C-21.8,84.6,-35.5,78.6,-48.3,70.3C-61.1,62,-73,51.4,-80.1,37.9C-87.2,24.4,-89.5,8,-87.4,-7.3C-85.3,-22.6,-78.8,-36.8,-69.7,-48.9C-60.6,-61,-48.9,-71,-36.1,-77.6C-23.3,-84.2,-9.4,-87.4,3.6,-93.7C16.6,-100,30.6,-83.6,44.7,-76.4Z",
      "M37.8,-66.4C48.9,-58.1,57.6,-46.3,64.8,-33.1C72,-19.9,77.7,-5.3,78.1,9.8C78.5,24.9,73.6,40.4,64.4,52.8C55.2,65.2,41.7,74.5,27.1,78.9C12.5,83.3,-3.2,82.8,-18.5,78.5C-33.8,74.2,-48.7,66.1,-59.8,54.4C-70.9,42.7,-78.2,27.4,-80.3,11.3C-82.4,-4.8,-79.3,-21.7,-71.5,-36.3C-63.7,-50.9,-51.2,-63.2,-37.3,-70.3C-23.4,-77.4,-7.8,-79.3,5.6,-88.1C19,-96.9,26.7,-74.7,37.8,-66.4Z",
    ];

    let current = 0;
    setInterval(() => {
      current = (current + 1) % shapes.length;
      gsap.to(morphPath, {
        attr: { d: shapes[current] },
        duration: 2,
        ease: "power2.inOut",
      });
    }, 3000);
  }

  // Icon Animation
  const iconCircle = document.querySelector(".icon-circle");
  if (iconCircle) {
    gsap.to(iconCircle, {
      attr: { r: 30 },
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }
}

// Particle Animations (for detail demos)
function initParticleAnimations() {
  const canvases = document.querySelectorAll('[class^="particle-demo-"]');

  canvases.forEach((canvas, index) => {
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        radius: Math.random() * 3 + 1,
      });
    }

    function animate() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw connections
        particles.forEach((p2, j) => {
          if (i !== j) {
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 100) {
              ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / 100})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        });

        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();
  });
}

// 3D Animations
function init3DAnimations() {
  // Tilt effect
  const tiltBox = document.querySelector(".tilt-box");
  if (tiltBox) {
    tiltBox.addEventListener("mousemove", (e) => {
      const rect = tiltBox.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * 15;
      const rotateY = ((x - centerX) / centerX) * 15;

      gsap.to(tiltBox, {
        rotateX: -rotateX,
        rotateY: rotateY,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    tiltBox.addEventListener("mouseleave", () => {
      gsap.to(tiltBox, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    });
  }
}

// Initialize Tech Showcase
initTechShowcase();

// ===================================
// 디버그 정보
// ===================================
console.log(
  "%c포트폴리오 로드 완료",
  "color: #000; font-size: 16px; font-weight: 600;",
);
console.log(
  "%cDesigned with minimalism in mind",
  "color: #666; font-size: 12px;",
);

// ScrollTrigger 디버그 (필요시 주석 해제)
// ScrollTrigger.create({
//     start: 0,
//     end: 'max',
//     markers: true
// });

/* ===================================
   Magic Text Animation (Stars)
   =================================== */
const magicInterval = 1000;
let magicStarsInitialized = false;
let magicIntervals = [];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const animateMagicStar = (star) => {
  star.style.setProperty("--star-left", `${rand(-10, 100)}%`);
  star.style.setProperty("--star-top", `${rand(-40, 80)}%`);

  star.style.animation = "none";
  star.offsetHeight;
  star.style.animation = "";
};

// Magic stars 애니메이션 초기화
const initMagicStars = () => {
  // 이미 초기화되었으면 중복 실행 방지
  if (magicStarsInitialized) return;

  const magicStars = document.getElementsByClassName("magic-star");
  if (magicStars.length === 0) return;

  let index = 0;
  for (const star of magicStars) {
    setTimeout(
      () => {
        animateMagicStar(star);

        const interval = setInterval(() => animateMagicStar(star), 1000);
        magicIntervals.push(interval);
      },
      index++ * (magicInterval / 3),
    );
  }

  magicStarsInitialized = true;
};

// Magic stars 애니메이션 정리
const cleanupMagicStars = () => {
  magicIntervals.forEach((interval) => clearInterval(interval));
  magicIntervals = [];
  magicStarsInitialized = false;
};

// 모달이 열릴 때/닫힐 때 magic stars 애니메이션 제어
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.target.classList.contains("active")) {
      // 모달 열림
      setTimeout(() => initMagicStars(), 100);
    } else {
      // 모달 닫힘
      cleanupMagicStars();
    }
  });
});

// 모달 관찰 시작
const modal = document.querySelector(".showcase-detail-modal");
if (modal) {
  observer.observe(modal, {
    attributes: true,
    attributeFilter: ["class"],
  });
}

/* ===================================
   Scramble/Decode Text Effect
   =================================== */
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const initScrambleText = () => {
  const scrambleElement = document.querySelector(".scramble-text");
  if (!scrambleElement) return;

  let interval = null;

  const scramble = () => {
    let iteration = 0;
    const originalText = scrambleElement.dataset.value;

    clearInterval(interval);

    interval = setInterval(() => {
      scrambleElement.innerText = originalText
        .split("")
        .map((letter, index) => {
          if (index < iteration) {
            return originalText[index];
          }
          return letters[Math.floor(Math.random() * 26)];
        })
        .join("");

      if (iteration >= originalText.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 30);
  };

  scrambleElement.addEventListener("mouseenter", scramble);
  scrambleElement.addEventListener("click", scramble);
};

/* ===================================
   Magnetic Text Effect
   =================================== */
const initMagneticText = () => {
  const magneticText = document.querySelector(".magnetic-text");
  if (!magneticText) return;

  const text = magneticText.dataset.text;
  magneticText.innerHTML = text
    .split("")
    .map((char) => `<span>${char}</span>`)
    .join("");

  const spans = magneticText.querySelectorAll("span");
  const demoArea = document.querySelector("#demo-magnetic");

  demoArea.addEventListener("mousemove", (e) => {
    const rect = demoArea.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    spans.forEach((span) => {
      const spanRect = span.getBoundingClientRect();
      const spanCenterX = spanRect.left + spanRect.width / 2 - rect.left;
      const spanCenterY = spanRect.top + spanRect.height / 2 - rect.top;

      const deltaX = mouseX - spanCenterX;
      const deltaY = mouseY - spanCenterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      const maxDistance = 150;
      const strength = Math.max(0, 1 - distance / maxDistance);

      const moveX = deltaX * strength * 0.3;
      const moveY = deltaY * strength * 0.3;

      span.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });

  demoArea.addEventListener("mouseleave", () => {
    spans.forEach((span) => {
      span.style.transform = "translate(0px, 0px)";
    });
  });
};

/* ===================================
   Particle Explosion Effect
   =================================== */
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = Math.random() * 3 + 1;
    this.speedX = (Math.random() - 0.5) * 8;
    this.speedY = (Math.random() - 0.5) * 8;
    this.gravity = 0.3;
    this.friction = 0.98;
    this.life = 100;
  }

  update() {
    this.speedY += this.gravity;
    this.speedX *= this.friction;
    this.speedY *= this.friction;
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 1;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.life / 100;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  isAlive() {
    return this.life > 0;
  }
}

const initParticleExplosion = () => {
  const canvas = document.querySelector(".particle-text-canvas");
  const triggerText = document.querySelector(".particle-trigger-text");
  const demoArea = document.querySelector("#demo-particle-explosion");

  if (!canvas || !triggerText || !demoArea) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let animationId = null;

  const resizeCanvas = () => {
    const rect = demoArea.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  };

  resizeCanvas();

  const createExplosion = () => {
    triggerText.classList.add("exploding");

    const rect = triggerText.getBoundingClientRect();
    const demoRect = demoArea.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2 - demoRect.left;
    const centerY = rect.top + rect.height / 2 - demoRect.top;

    // Create particles
    for (let i = 0; i < 100; i++) {
      const colors = ["#FFC107", "#FFEB3B", "#FF9800", "#FFFFFF"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      particles.push(new Particle(centerX, centerY, color));
    }

    animate();

    setTimeout(() => {
      triggerText.classList.remove("exploding");
    }, 800);
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles = particles.filter((particle) => particle.isAlive());

    particles.forEach((particle) => {
      particle.update();
      particle.draw(ctx);
    });

    if (particles.length > 0) {
      animationId = requestAnimationFrame(animate);
    }
  };

  demoArea.addEventListener("click", createExplosion);
};

// Initialize advanced text effects when modal opens
const advancedTextObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.target.classList.contains("active")) {
      const activeSection = document.querySelector(".detail-section.active");
      if (activeSection && activeSection.dataset.detail === "text") {
        setTimeout(() => {
          initScrambleText();
          initMagneticText();
          initParticleExplosion();
        }, 200);
      }
    }
  });
});

if (modal) {
  advancedTextObserver.observe(modal, {
    attributes: true,
    attributeFilter: ["class"],
  });
}
