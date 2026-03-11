// ===================================
// About Timeline 애니메이션
// ===================================
const { gsap, ScrollTrigger } = window;

export function initAboutAlternatives() {
  const timelineSection = document.querySelector('.about-timeline');
  if (!timelineSection) {
    console.log('⚠️ Timeline section not found');
    return;
  }

  console.log('✅ Timeline section found');

  // 타임라인 아이템들
  const timelineItems = timelineSection.querySelectorAll('.timeline-item');
  
  if (timelineItems.length === 0) {
    console.log('⚠️ No timeline items found');
    return;
  }

  console.log(`✅ Found ${timelineItems.length} timeline items`);

  // 각 타임라인 아이템에 개별 ScrollTrigger 적용
  timelineItems.forEach((item, index) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 80%', // 아이템이 화면 80% 지점에 도달하면
        end: 'bottom 20%',
        toggleActions: 'play reverse play reverse', // 스크롤 왕복 시 애니메이션 반복
        // markers: true, // 디버깅용
        onEnter: () => console.log(`✨ Card ${index + 1} appeared`)
      },
      y: 60,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  });

  console.log('✨ Timeline animations initialized (no pin)');
}
