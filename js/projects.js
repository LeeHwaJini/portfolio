// ===================================
// Projects 섹션 (GSAP 가로 스크롤 + Pin)
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

  const getScrollAmount = () => -(scrollContainer.scrollWidth - window.innerWidth);
  const getEndValue = () => "+=" + (scrollContainer.scrollWidth - window.innerWidth);

  gsap.to(scrollContainer, {
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
      fastScrollEnd: true,
      id: "projects-horizontal",
      onUpdate: (self) => {
        if (self.progress === 0) {
          gsap.set(scrollContainer, { x: 0 });
        }
      },
      onLeaveBack: () => {
        gsap.set(scrollContainer, { clearProps: "x" });
      },
    },
  });
}
