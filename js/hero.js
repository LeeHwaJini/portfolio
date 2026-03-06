// ===================================
// Hero Section - Interactive Grid System (2026 Style)
// ===================================
const { gsap } = window;

export function initHero() {
  const heroSection = document.querySelector('.hero-section');
  if (!heroSection) return;

  // ===================================
  // 1. Interactive Grid System
  // ===================================
  initInteractiveGrid();

  // ===================================
  // 2. 히어로 요소 등장 애니메이션
  // ===================================
  initHeroAnimations();
}

// ===================================
// Interactive Grid System
// ===================================
function initInteractiveGrid() {
  const section = document.querySelector('.hero-section');
  if (!section) return;

  // Canvas 생성
  const canvas = document.createElement('canvas');
  canvas.classList.add('grid-canvas');
  section.insertBefore(canvas, section.firstChild);

  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = section.offsetHeight;
  let animationId = null;

  canvas.width = width;
  canvas.height = height;

  // 그리드 설정
  const gridSize = 60;
  const cols = Math.ceil(width / gridSize) + 1;
  const rows = Math.ceil(height / gridSize) + 1;

  // 마우스 위치
  let mouseX = -1000;
  let mouseY = -1000;

  // 그리드 포인트 클래스
  class GridPoint {
    constructor(x, y) {
      this.baseX = x;
      this.baseY = y;
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
    }

    update() {
      // 마우스와의 거리
      const dx = mouseX - this.baseX;
      const dy = mouseY - this.baseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 마우스 근처에서 밀려나는 효과
      if (distance < 150) {
        const force = (150 - distance) / 150;
        this.vx += dx * force * 0.3;
        this.vy += dy * force * 0.3;
      }

      // 원래 위치로 복귀
      this.vx += (this.baseX - this.x) * 0.05;
      this.vy += (this.baseY - this.y) * 0.05;

      // 감쇠
      this.vx *= 0.9;
      this.vy *= 0.9;

      // 위치 업데이트
      this.x += this.vx;
      this.y += this.vy;
    }
  }

  // 그리드 포인트 생성
  const points = [];
  for (let row = 0; row < rows; row++) {
    points[row] = [];
    for (let col = 0; col < cols; col++) {
      points[row][col] = new GridPoint(col * gridSize, row * gridSize);
    }
  }

  // 마우스 이벤트
  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    mouseX = e.clientX;
    mouseY = e.clientY - rect.top;
  });

  section.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  // 애니메이션 루프
  function animate() {
    // 밝은 배경
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // 그리드 업데이트
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        points[row][col].update();
      }
    }

    // 그리드 라인 그리기 (미묘한 회색)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 1;

    // 가로 라인
    for (let row = 0; row < rows; row++) {
      ctx.beginPath();
      for (let col = 0; col < cols; col++) {
        const point = points[row][col];
        if (col === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      }
      ctx.stroke();
    }

    // 세로 라인
    for (let col = 0; col < cols; col++) {
      ctx.beginPath();
      for (let row = 0; row < rows; row++) {
        const point = points[row][col];
        if (row === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      }
      ctx.stroke();
    }

    // 그리드 포인트 그리기 (마우스 근처만)
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const point = points[row][col];
        const dx = mouseX - point.x;
        const dy = mouseY - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const opacity = 1 - distance / 100;
          ctx.fillStyle = `rgba(102, 126, 234, ${opacity * 0.6})`;
          const size = 4 * opacity;
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  // 리사이즈
  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = section.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  });

  animate();
  console.log('%c✨ Interactive Grid Initialized', 'color: #667eea; font-weight: 700;');
}

// ===================================
// 히어로 요소 등장 애니메이션
// ===================================
function initHeroAnimations() {
  const section = document.querySelector('.hero-section');
  if (!section) {
    console.warn('Hero section not found');
    return;
  }

  const heroLabel = section.querySelector('.hero-label');
  const heroLines = section.querySelectorAll('.hero-title .line');
  const heroSubtitle = section.querySelector('.hero-subtitle');
  const heroScroll = section.querySelector('.hero-scroll');

  // 요소가 없으면 애니메이션 스킵
  if (!heroLabel && !heroLines.length && !heroSubtitle && !heroScroll) {
    console.warn('Hero animation elements not found');
    return;
  }

  const tl = gsap.timeline({ delay: 0.3 });

  if (heroLabel) {
    tl.from(heroLabel, {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
  }

  if (heroLines.length > 0) {
    tl.from(heroLines, {
      y: 120,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power4.out'
    }, '-=0.6');
  }

  if (heroSubtitle) {
    tl.from(heroSubtitle, {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.8');
  }

  if (heroScroll) {
    tl.from(heroScroll, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.6');
  }
}
