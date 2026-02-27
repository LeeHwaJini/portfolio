// ===================================
// Projects 섹션 (GSAP 가로 스크롤 + Pin) - 개선 버전
// ===================================
const { gsap, ScrollTrigger } = window;

export function initProjects() {
  const projectSection = document.querySelector(".projects-section");
  const list = document.querySelector(".projects-scroll-wrapper");
  const items = document.querySelectorAll(".project-card");

  if (!projectSection || !list) return;

  // ⭐ 가로 이동 거리 (한 번만 안정적으로 계산)
  const getScrollAmount = () => {
    return list.scrollWidth - window.innerWidth;
  };

  // ⭐ 스크롤 길이 = 가로 길이 + 여유값 (끊김 방지 핵심)
  const getEndValue = () => {
    return "+=" + (list.scrollWidth - window.innerWidth);
  };

  const scrollTween = gsap.to(list, {
    x: () => -getScrollAmount(),
    ease: "none",
    force3D: true,
    scrollTrigger: {
      trigger: projectSection,
      start: "top top",
      end: getEndValue,
      scrub: 1.2,
      pin: true,
      pinSpacing: true,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
    },
  });

  // 리사이즈 시 정확하게 재계산 (필수)
  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });
}
