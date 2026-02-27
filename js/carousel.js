// ===================================
// Experience Showcase Carousel
// ===================================
const { gsap, ScrollTrigger } = window;

export function initTechShowcase() {
  let progress = 0;
  let startX = 0;
  let active = 0;
  let isDown = false;

  const speedWheel = 0.02;
  const speedDrag = -0.1;

  const $section = document.querySelector('.tech-showcase-section');
  const $carousel = document.querySelector('.showcase-carousel');
  const $items = document.querySelectorAll('.carousel-item');

  if (!$items.length || !$section) return;

  // Z-index 계산
  const getZindex = (array, index) =>
    array.map((_, i) => (index === i ? array.length : array.length - Math.abs(index - i)));

  // 아이템 배치
  const displayItems = (item, index, active) => {
    const zIndex = getZindex([...$items], active)[index];
    item.style.setProperty('--zIndex', zIndex);
    item.style.setProperty('--active', (index - active) / $items.length);
  };

  // 애니메이션
  const animate = () => {
    progress = Math.max(0, Math.min(progress, 100));
    active = Math.floor((progress / 100) * ($items.length - 1));
    $items.forEach((item, index) => displayItems(item, index, active));
  };

  animate();

  // 더미 트윈으로 pin 처리 (projects.js와 동일한 방식으로 통일)
  const dummyObj = { val: 0 };
  gsap.to(dummyObj, {
    val: 1,
    ease: "none",
    scrollTrigger: {
      id: 'experience-pin',
      trigger: $section,
      start: 'top top',
      end: () => `+=${window.innerHeight * 2.5}`, // 카드 6개 + 마지막 카드 여유 구간 확보
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,   // pin 시작 직전 jump 방지
      scrub: true,
      invalidateOnRefresh: true,
      fastScrollEnd: true,
      onUpdate: (self) => {
        progress = self.progress * 100;
        animate();
      },
    },
  });


}
