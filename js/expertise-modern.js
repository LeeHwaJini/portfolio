// ===================================
// Modern Expertise Alternatives (2026)
// ===================================

const { gsap, ScrollTrigger } = window;

/**
 * Initialize all modern expertise sections
 */
export function initModernExpertise() {
  initGlassmorphism3D();
}

// ===================================
// Style 1: Glassmorphism + 3D Floating Cards
// ===================================
function initGlassmorphism3D() {
  const section = document.querySelector('.expertise-glass-3d');
  if (!section) return;

  const cards = section.querySelectorAll('.glass-card');

  // Entrance animations
  gsap.from(cards, {
    scrollTrigger: {
      trigger: section,
      start: 'top 70%',
      toggleActions: 'play none none none'
    },
    y: 100,
    opacity: 0,
    rotationY: -30,
    duration: 1,
    stagger: 0.15,
    ease: 'power3.out'
  });

  // Card flip on click
  cards.forEach((card, index) => {
    const cardInner = card.querySelector('.glass-card-inner');
    
    if (!cardInner) {
      console.warn(`Card ${index}: .glass-card-inner not found`);
      return;
    }
    
    // 각 카드마다 다른 3D 회전 각도 패턴 (확장 가능)
    const rotationPatterns = [-10, -8, -12, -9, -11, -10, -8, -12]; // 8개 패턴
    const rotationX = rotationPatterns[index % rotationPatterns.length]; // 순환
    
    // 각 카드마다 살짝 다른 scale 효과
    const scalePatterns = [1.05, 1.04, 1.06, 1.05, 1.04, 1.05, 1.06, 1.04];
    const scaleAmount = scalePatterns[index % scalePatterns.length];
    
    let isFlipped = false;
    
    card.addEventListener('click', () => {
      console.log(`Card ${index} clicked! Flipping with rotationX: ${rotationX}deg`);
      
      isFlipped = !isFlipped;
      
      // GSAP로 직접 180도 회전 애니메이션 (카드마다 다른 각도)
      gsap.to(cardInner, {
        rotationY: isFlipped ? 180 : 0,
        rotationX: isFlipped ? rotationX : 0, // 카드마다 다른 X축 회전
        scale: isFlipped ? scaleAmount : 1,   // 카드마다 살짝 다른 scale
        duration: 0.5,
        ease: 'power2.inOut'
      });
      
      console.log(`Card ${index} flipped state:`, isFlipped);
    });

    // 3D tilt effect on mouse move (only when NOT flipped)
    card.addEventListener('mousemove', (e) => {
      if (isFlipped) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      gsap.to(cardInner, {
        rotationX: rotateX,
        rotationY: rotateY,
        duration: 0.3,
        ease: 'power2.out',
        transformOrigin: 'center center'
      });
    });

    card.addEventListener('mouseleave', () => {
      if (isFlipped) return;

      gsap.to(cardInner, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });
  
  console.log(`✅ ${cards.length} cards initialized for flipping`);

  // Animate background blobs
  const blobs = section.querySelectorAll('.glass-bg-blob');
  blobs.forEach((blob, index) => {
    gsap.to(blob, {
      x: `random(-100, 100)`,
      y: `random(-100, 100)`,
      duration: `random(15, 25)`,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: index * 5
    });
  });
}
