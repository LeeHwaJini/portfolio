// ===================================
// 네비게이션 - 햄버거 메뉴
// ===================================
const { gsap } = window;

export function initNavigation() {
  const navbar = document.querySelector(".navbar");
  const menuToggle = document.querySelector(".menu-toggle");
  const fullscreenMenu = document.querySelector(".fullscreen-menu");
  const menuLinks = document.querySelectorAll(".menu-link");

  if (!menuToggle || !fullscreenMenu) {
    console.warn("Navigation elements not found");
    return;
  }

  // 햄버거 메뉴 토글
  menuToggle.addEventListener("click", () => {
    const isOpen = navbar.classList.toggle("menu-open");
    fullscreenMenu.classList.toggle("active");
    
    // body 스크롤 제어
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  // 메뉴 링크 클릭 시 메뉴 닫기 + 스크롤
  menuLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      
      if (!href || !href.startsWith('#')) return;
      
      e.preventDefault();
      
      // 메뉴 닫기
      navbar.classList.remove("menu-open");
      fullscreenMenu.classList.remove("active");
      document.body.style.overflow = "";
      
      // 스크롤
      const targetId = href.substring(1);

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
    });
  });

  // 스크롤 시 헤더 자동 숨김
  let lastScroll = 0;
  
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    // 스크롤 방향 감지 (아래로 스크롤 시 숨김)
    if (currentScroll > lastScroll && currentScroll > 300) {
      // 아래로 스크롤 && 300px 이상 내려갔을 때
      navbar?.classList.add("hidden");
    } else if (currentScroll < lastScroll) {
      // 위로 스크롤
      navbar?.classList.remove("hidden");
    }

    lastScroll = currentScroll;
  });

  console.log("✨ Navigation initialized");
}
