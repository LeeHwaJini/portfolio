// ===================================
// Main Entry Point
// ===================================

// 브라우저 스크롤 복원 방지 — 스크립트 로드 즉시 실행
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

import { initPreloader } from './preloader.js';
import { initCursor } from './cursor.js';
import { initNavigation } from './navigation.js';
import { initHero } from './hero.js';
import { initProjects } from './projects.js';
import { initExperience } from './experience.js';
import { initSkillsAnimations } from './skills.js';
import { initScrollSequence } from './sequence.js';
import { initPlatforms } from './platforms.js';
import { initAboutAlternatives } from './about-alternatives.js';
import { initProjectsOverlay } from './projects-overlay.js';
import { initRotatingGallery } from './rotating-gallery.js';

const { gsap, ScrollTrigger, ScrollToPlugin } = window;
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// 전역 스크롤 프로그레스 바
const scrollProgressBar = document.querySelector(".scroll-progress-bar");
if (scrollProgressBar) {
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      scrollProgressBar.style.width = `${self.progress * 100}%`;
    },
  });
}

function init() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  initCursor();
  initNavigation();
  initProjectsOverlay();

  // pin: true 섹션을 먼저 초기화 → pin spacer가 DOM에 추가된 후
  // 이후 섹션들이 정확한 ScrollTrigger 위치를 계산할 수 있음
  initHero();
  initAboutAlternatives();
  initProjects();
  initScrollSequence();
  initSkillsAnimations();
  initRotatingGallery();
  initExperience();
  initPlatforms();

  initPreloader(() => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      preloader.style.display = 'none';
      preloader.remove();
    }

    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    window.scrollTo(0, 0);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh(true);
        console.log(
          "%c✨ Portfolio Loaded",
          "color: #fff; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-size: 14px; font-weight: 700; padding: 8px 16px; border-radius: 4px;"
        );
      });
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// 너비 변경 시에만 ScrollTrigger 갱신 (모바일 주소창 높이 변화 등 무시)
let resizeTimer;
let lastWidth = window.innerWidth;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    const currentWidth = window.innerWidth;
    if (Math.abs(currentWidth - lastWidth) > 50) {
      ScrollTrigger.refresh(true);
      lastWidth = currentWidth;
    }
  }, 150);
});
