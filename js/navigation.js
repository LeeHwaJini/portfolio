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

  menuToggle.addEventListener("click", () => {
    const isOpen = navbar.classList.toggle("menu-open");
    fullscreenMenu.classList.toggle("active");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith('#')) return;

      e.preventDefault();

      navbar.classList.remove("menu-open");
      fullscreenMenu.classList.remove("active");
      document.body.style.overflow = "";

      const targetId = href.substring(1);

      if (targetId === "home" || targetId === "") {
        gsap.to(window, { duration: 1.2, scrollTo: { y: 0 }, ease: "power3.inOut" });
      } else {
        const target = document.querySelector(`[data-section="${targetId}"]`);
        if (target) {
          gsap.to(window, { duration: 1.2, scrollTo: { y: target, offsetY: 100 }, ease: "power3.inOut" });
        }
      }
    });
  });

  // 아래로 스크롤 시 헤더 숨김, 위로 스크롤 시 복원
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll && currentScroll > 300) {
      navbar?.classList.add("hidden");
    } else if (currentScroll < lastScroll) {
      navbar?.classList.remove("hidden");
    }

    lastScroll = currentScroll;
  });
}
