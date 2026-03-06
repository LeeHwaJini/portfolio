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

  // 각 타임라인 아이템에 ScrollTrigger 애니메이션 적용
  timelineItems.forEach((item, index) => {
    // 초기 상태 설정
    gsap.set(item, {
      y: 60,
      opacity: 0,
    });

    // 스크롤 트리거 애니메이션
    gsap.to(item, {
      scrollTrigger: {
        trigger: item, // 각 아이템이 개별 트리거
        start: 'top 85%', // 화면 85% 지점에 도달하면 시작
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
        // markers: true, // 디버깅용 (확인 후 제거)
        onEnter: () => console.log(`Item ${index + 1} animated`),
      },
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
    });
  });

  console.log('✨ Timeline animations initialized');
}
