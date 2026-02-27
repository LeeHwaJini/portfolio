// ===================================
// 네비게이션
// ===================================
const { gsap } = window;

export function initNavigation() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (!hamburger || !navMenu) return;

  // 햄버거 메뉴 토글
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");

    const spans = hamburger.querySelectorAll("span");
    if (navMenu.classList.contains("active")) {
      gsap.to(spans[0], { rotation: 45, y: 8, duration: 0.3 });
      gsap.to(spans[1], { rotation: -45, y: -8, duration: 0.3 });
    } else {
      gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
      gsap.to(spans[1], { rotation: 0, y: 0, duration: 0.3 });
    }
  });

  // 스크롤 시 헤더 배경
  const header = document.querySelector(".header");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }

    // 스크롤 방향에 따라 헤더 숨기기/보이기
    if (currentScroll > lastScroll && currentScroll > 500) {
      header?.classList.add("hidden");
    } else {
      header?.classList.remove("hidden");
    }

    lastScroll = currentScroll;
  });

  // 스무스 스크롤
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1); // # 제거

      if (targetId === "home" || targetId === "") {
        gsap.to(window, {
          duration: 1.2,
          scrollTo: { y: 0 },
          ease: "power3.inOut",
        });
      } else {
        const target = document.querySelector(`[data-section="${targetId}"]`);
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
}
