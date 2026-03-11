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

  console.log("🎯 Projects section found:", {
    section: projectSection,
    wrapper: scrollWrapper,
    container: scrollContainer,
    sectionOffsetTop: projectSection.offsetTop,
    containerScrollWidth: scrollContainer.scrollWidth,
    windowWidth: window.innerWidth
  });

  // ⭐ 가로 이동 거리 계산
  const getScrollAmount = () => {
    const amount = -(scrollContainer.scrollWidth - window.innerWidth);
    console.log("📏 Scroll amount calculated:", amount);
    return amount;
  };

  // ⭐ 스크롤 길이 계산
  const getEndValue = () => {
    const end = "+=" + (scrollContainer.scrollWidth - window.innerWidth);
    console.log("📐 End value calculated:", end);
    return end;
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
      fastScrollEnd: true,
      markers: false,
      id: "projects-horizontal",
      // 역방향 스크롤 처리
      onUpdate: (self) => {
        // 진행도가 0이면 초기화
        if (self.progress === 0) {
          gsap.set(scrollContainer, { x: 0 });
        }
      },
      onLeaveBack: (self) => {
        console.log("⬆️ Projects section left (scrolling up)");
        // 섹션을 벗어날 때 확실히 리셋
        gsap.set(scrollContainer, { clearProps: "x" });
      },
      onRefresh: () => console.log("🔄 Projects ScrollTrigger refreshed"),
      onEnter: () => console.log("✅ Projects section entered"),
      onLeave: () => console.log("✅ Projects section left"),
      onEnterBack: () => console.log("✅ Projects section entered back"),
    },
  });

  console.log("✅ Projects scroll initialized");
}
