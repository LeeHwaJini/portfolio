// ===================================
// Preloader - Space Invaders + Pixel Explosion
// ===================================
const { gsap } = window;

export function initPreloader(onComplete) {
  const preloader = document.querySelector('.preloader');
  if (!preloader) { onComplete?.(); return; }

  const wordEl = document.querySelector('.preloader-word');
  const pixelsContainer = document.querySelector('.preloader-pixels');

  // ===================================
  // 유틸 함수
  // ===================================
  const lerp = (v0, v1, t) => v0 * (1 - t) + v1 * t;
  const scale = (a, b, c, d, e) => (a - b) * (e - d) / (c - b) + d;

  // ===================================
  // Space Invaders 옵션
  // ===================================
  const opt = {
    radius: 130,
    radiusY: 0.32,
    maxSpeed: 0.045,
    maxRotation: 25,
    minOpacity: 0.1,
    baseSpeed: 0.025,
  };

  // ===================================
  // 글자 생성 (PORTFOLIO 역순 배치)
  // ===================================
  const word = 'PORTFOLIO';
  const Letters = word.split('').reverse();
  wordEl.innerHTML = '';
  Letters.forEach(char => {
    const span = document.createElement('span');
    span.textContent = char;
    wordEl.appendChild(span);
  });
  const letters = wordEl.querySelectorAll('span');

  // ===================================
  // 픽셀 그리드 생성
  // ===================================
  const pixelSize = 40;
  const cols = Math.ceil(window.innerWidth / pixelSize);
  const rows = Math.ceil(window.innerHeight / pixelSize);
  pixelsContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  pixelsContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  const pixels = [];
  for (let i = 0; i < cols * rows; i++) {
    const pixel = document.createElement('div');
    pixel.classList.add('pixel');
    pixelsContainer.appendChild(pixel);
    pixels.push(pixel);
  }

  // ===================================
  // 마우스/터치 이벤트
  // ===================================
  let mouseX = window.innerWidth * 0.5;
  const handleMouse = (e) => {
    mouseX = e.clientX ?? e.touches?.[0]?.clientX ?? mouseX;
  };
  window.addEventListener('mousemove', handleMouse);
  window.addEventListener('touchmove', handleMouse, { passive: true });

  // ===================================
  // Space Invaders 회전 애니메이션
  // ===================================
  let time = 0;
  let lerpX = 0.5;
  let rafId;

  const animateInvaders = () => {
    lerpX = lerp(lerpX, mouseX / window.innerWidth, 0.08);
    const rotation = -opt.maxRotation + lerpX * opt.maxRotation * 2;
    const speed = opt.baseSpeed + (-opt.maxSpeed + lerpX * opt.maxSpeed * 2);
    const modY = Math.PI * 0.3; // 사선 회전 기울기

    time -= speed;

    letters.forEach((letter, ind) => {
      const theta = 1 - ind / letters.length;
      const x = opt.radius * Math.sin(time + theta * Math.PI * 2);
      const y = opt.radius * opt.radiusY * Math.cos(modY + time + theta * Math.PI * 2);
      const s = scale(y, -opt.radius * opt.radiusY, opt.radius * opt.radiusY, opt.minOpacity, 1);

      Object.assign(letter.style, {
        zIndex: Math.min(2, Math.max(-2, Math.ceil(y))),
        filter: `blur(${Math.max(0, 3.5 - 4.5 * s).toFixed(2)}px)`,
        opacity: s,
        transform: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rotation.toFixed(2)}deg)`,
      });
    });

    rafId = requestAnimationFrame(animateInvaders);
  };
  animateInvaders();

  // ===================================
  // 픽셀 폭발 + 프리로더 종료
  // ===================================
  const startPixelExplosion = () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('mousemove', handleMouse);
    window.removeEventListener('touchmove', handleMouse);

    if (!gsap) {
      preloader.style.display = 'none';
      onComplete?.();
      return;
    }

    // 배경 투명화 (픽셀 폭발 후 뒤의 페이지가 보이도록)
    preloader.style.background = 'transparent';

    // 텍스트 페이드아웃
    gsap.to('.preloader-inner', {
      opacity: 0,
      scale: 1.2,
      filter: 'blur(12px)',
      duration: 0.4,
      ease: 'power2.in',
    });

    // 픽셀 폭발 분산
    gsap.to(Array.from(pixels), {
      opacity: 0,
      scale: () => Math.random() * 0.3 + 0.1,
      x: () => (Math.random() - 0.5) * window.innerWidth * 1.2,
      y: () => (Math.random() - 0.5) * window.innerHeight * 1.2,
      rotation: () => Math.random() * 900 - 450,
      duration: () => 0.5 + Math.random() * 0.6,
      stagger: { amount: 0.8, from: 'center', grid: 'auto' },
      ease: 'power2.in',
      onComplete: () => {
        preloader.style.display = 'none';
        onComplete?.();
      },
    });
  };

  setTimeout(startPixelExplosion, 2800);
}
