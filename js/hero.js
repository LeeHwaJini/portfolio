// ===================================
// Hero Section
// ===================================
const { gsap } = window;

export function initHero() {
  const heroSection = document.querySelector('.hero-section');
  if (!heroSection) return;

  initInteractiveGrid();
  initHeroAnimations();
}

function initInteractiveGrid() {
  const section = document.querySelector('.hero-section');
  if (!section) return;

  const canvas = document.createElement('canvas');
  canvas.classList.add('grid-canvas');
  section.insertBefore(canvas, section.firstChild);

  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = section.offsetHeight;

  canvas.width = width;
  canvas.height = height;

  const gridSize = 60;
  const cols = Math.ceil(width / gridSize) + 1;
  const rows = Math.ceil(height / gridSize) + 1;

  let mouseX = -1000;
  let mouseY = -1000;

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
      const dx = mouseX - this.baseX;
      const dy = mouseY - this.baseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 마우스 근처에서 밀려나는 효과
      if (distance < 150) {
        const force = (150 - distance) / 150;
        this.vx += dx * force * 0.3;
        this.vy += dy * force * 0.3;
      }

      this.vx += (this.baseX - this.x) * 0.05;
      this.vy += (this.baseY - this.y) * 0.05;
      this.vx *= 0.9;
      this.vy *= 0.9;
      this.x += this.vx;
      this.y += this.vy;
    }
  }

  const points = [];
  for (let row = 0; row < rows; row++) {
    points[row] = [];
    for (let col = 0; col < cols; col++) {
      points[row][col] = new GridPoint(col * gridSize, row * gridSize);
    }
  }

  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    mouseX = e.clientX;
    mouseY = e.clientY - rect.top;
  });

  section.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  function animate() {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        points[row][col].update();
      }
    }

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 1;

    for (let row = 0; row < rows; row++) {
      ctx.beginPath();
      for (let col = 0; col < cols; col++) {
        const point = points[row][col];
        col === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();
    }

    for (let col = 0; col < cols; col++) {
      ctx.beginPath();
      for (let row = 0; row < rows; row++) {
        const point = points[row][col];
        row === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();
    }

    // 마우스 근처 포인트 하이라이트
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const point = points[row][col];
        const dx = mouseX - point.x;
        const dy = mouseY - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const opacity = 1 - distance / 100;
          ctx.fillStyle = `rgba(102, 126, 234, ${opacity * 0.6})`;
          ctx.beginPath();
          ctx.arc(point.x, point.y, 4 * opacity, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = section.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  });

  animate();
}

function initHeroAnimations() {
  const section = document.querySelector('.hero-section');
  if (!section) return;

  const heroLabel = section.querySelector('.hero-label');
  const heroLines = section.querySelectorAll('.hero-title .line');
  const heroSubtitle = section.querySelector('.hero-subtitle');
  const heroScroll = section.querySelector('.hero-scroll');

  const tl = gsap.timeline({ delay: 0.3 });

  if (heroLabel) {
    tl.from(heroLabel, { y: 30, opacity: 0, duration: 1, ease: 'power3.out' });
  }

  if (heroLines.length > 0) {
    tl.from(heroLines, {
      y: 120, opacity: 0, duration: 1.2, stagger: 0.15, ease: 'power4.out',
    }, '-=0.6');
  }

  if (heroSubtitle) {
    tl.from(heroSubtitle, { y: 30, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.8');
  }

  if (heroScroll) {
    tl.from(heroScroll, { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6');
  }
}
