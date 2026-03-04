// ===================================
// Projects 섹션 (GSAP 가로 스크롤 + Pin) - 개선 버전
// ===================================
const { gsap, ScrollTrigger } = window;

export function initProjects() {
  const projectSection = document.querySelector(".projects-section");
  const scrollWrapper = document.querySelector(".projects-scroll-wrapper");
  const scrollContainer = document.querySelector(".projects-scroll-container");

  if (!projectSection || !scrollWrapper || !scrollContainer) {
    console.warn("Projects section elements not found");
    return;
  }

  // ⭐ 가로 이동 거리 계산
  const getScrollAmount = () => {
    return -(scrollContainer.scrollWidth - window.innerWidth);
  };

  // ⭐ 스크롤 길이 계산
  const getEndValue = () => {
    return "+=" + (scrollContainer.scrollWidth - window.innerWidth);
  };

  // 가로 스크롤 애니메이션
  const scrollTween = gsap.to(scrollContainer, {
    x: getScrollAmount,
    ease: "none",
    force3D: true,
    scrollTrigger: {
      trigger: projectSection,
      start: "top top",
      end: getEndValue,
      scrub: 1,
      pin: true,
      pinSpacing: true,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onEnter: () => console.log("Projects section entered"),
      onLeave: () => console.log("Projects section left"),
    },
  });

  console.log("Projects scroll initialized:", {
    scrollWidth: scrollContainer.scrollWidth,
    windowWidth: window.innerWidth,
    scrollAmount: scrollContainer.scrollWidth - window.innerWidth
  });

  // 리사이즈는 main.js에서 전역으로 처리
}
