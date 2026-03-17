// ===================================
// About Section – 에디토리얼 타임라인 애니메이션
// ===================================
const { gsap, ScrollTrigger } = window;

export function initAboutAlternatives() {
  const section = document.querySelector('.about-section');
  if (!section) return;

  // 왼쪽 sticky 타이틀 페이드인
  gsap.from('.about-left', {
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top 80%',
    },
    x: -50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
  });

  // 오른쪽 타임라인 아이템들 – 스크롤 왕복 시 반복
  const items = section.querySelectorAll('.about-tl-item');
  items.forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        end: 'bottom 20%',
        toggleActions: 'play reverse play reverse',
      },
      y: 50,
      opacity: 0,
      duration: 0.75,
      delay: i * 0.08,
      ease: 'power3.out',
    });
  });
}
