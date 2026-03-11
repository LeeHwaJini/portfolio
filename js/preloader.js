// ===================================
// Preloader - Space Invaders + Pixel Explosion
// ===================================
import { lerp, scale } from './utils.js';
const { gsap } = window;

export function initPreloader(onComplete) {
  const preloader = document.querySelector('.preloader');
  if (!preloader) { onComplete?.(); return; }

  const preloaderInner = document.querySelector('.preloader-inner');
  const wordEl = document.querySelector('.preloader-word');
  const pixelsContainer = document.querySelector('.preloader-pixels');

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
  let frameCount = 0;

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

    // 첫 프레임 이후 preloader 표시
    if (frameCount === 1) {
      preloaderInner.classList.add('ready');
    }
    frameCount++;

    rafId = requestAnimationFrame(animateInvaders);
  };
  
  // 애니메이션 시작
  animateInvaders();

  // ===================================
  // 픽셀 폭발 + 프리로더 종료
  // ===================================
  const startPixelExplosion = () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('mousemove', handleMouse);
    window.removeEventListener('touchmove', handleMouse);

    // GSAP이 없으면 즉시 종료
    if (!gsap) {
      console.warn('GSAP not found, skipping preloader animation');
      preloader.style.display = 'none';
      onComplete?.();
      return;
    }

    // 배경 투명화 (픽셀 폭발 후 뒤의 페이지가 보이도록)
    preloader.style.background = 'transparent';

    // 텍스트 페이드아웃 (더 빠르게)
    gsap.to('.preloader-inner', {
      opacity: 0,
      scale: 1.2,
      filter: 'blur(12px)',
      duration: 0.3,
      ease: 'power2.in',
    });

    // 픽셀 폭발 분산 (더 빠르게)
    gsap.to(Array.from(pixels), {
      opacity: 0,
      scale: () => Math.random() * 0.3 + 0.1,
      x: () => (Math.random() - 0.5) * window.innerWidth * 1.2,
      y: () => (Math.random() - 0.5) * window.innerHeight * 1.2,
      rotation: () => Math.random() * 900 - 450,
      duration: () => 0.3 + Math.random() * 0.3, // 0.3~0.6초로 단축
      stagger: { amount: 0.4, from: 'center', grid: 'auto' }, // 0.4초로 단축
      ease: 'power2.in',
      onComplete: () => {
        preloader.style.display = 'none';
        onComplete?.();
      },
    });
  };

  // 1초 후 자동 시작 (더 빠르게)
  setTimeout(startPixelExplosion, 1000);
  
  // 안전장치: 2.5초 후 무조건 종료
  setTimeout(() => {
    if (preloader.style.display !== 'none') {
      console.warn('Preloader timeout - forcing close');
      preloader.style.display = 'none';
      onComplete?.();
    }
  }, 2500);
}
