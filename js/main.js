// ===================================
// Main Entry Point
// ===================================

// ⭐ 스크립트 로드 즉시 스크롤 위치 리셋 (브라우저 복원 방지)
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

import { initPreloader } from './preloader.js';
import { initCursor } from './cursor.js';
import { initNavigation } from './navigation.js';
import { initHero } from './hero.js';
import { initProjects } from './projects.js';
import { initCircularSlider } from './circular-slider.js';
import { initSkillsAnimations } from './skills.js';
import { initScrollSequence } from './sequence.js';
import { initPlatforms } from './platforms.js';
import { initModernExpertise } from './expertise-modern.js';
import { initAboutAlternatives } from './about-alternatives.js';
import { initProjectsOverlay } from './projects-overlay.js';
import { initRotatingGallery } from './rotating-gallery.js';

// GSAP 초기화
const { gsap, ScrollTrigger, ScrollToPlugin } = window;
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ===================================
// 전역 스크롤 프로그레스 바
// ===================================
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

// ===================================
// 초기화 시퀀스
// ===================================
function init() {
  // ⭐ 다시 한번 확인 (브라우저가 늦게 복원할 수도 있음)
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  
  // 1. UI 컴포넌트 초기화
  initCursor();
  initNavigation();
  initProjectsOverlay(); // 프로젝트 오버레이 추가
  
  // 2. 섹션별 애니메이션 초기화
  initHero();               // 01. Hero (파티클 네트워크)
  initAboutAlternatives();  // 01. About Alternatives (타임라인/매거진/스플릿)
  initSkillsAnimations();   // 02. Expertise
  // initModernExpertise();    // 02. Modern Expertise Alternatives (교체됨)
  initRotatingGallery();    // 02. Rotating Gallery (Expertise)
  initCircularSlider();     // 03. Experience (도넛 슬라이더)
  initPlatforms();          // 04. Platforms & Solutions
  initProjects();           // 05. Projects (가로 스크롤)
  initScrollSequence();     // 마지막. Scroll Sequence

  // 3. 프리로더 실행 → 완료 후 페이지 활성화
  initPreloader(() => {
    // 프리로더 강제 제거
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      preloader.style.display = 'none';
      preloader.remove();
    }

    // ⭐ 프리로더 완료 후에도 다시 맨 위로
    window.scrollTo(0, 0);
    
    // ⭐ 스크롤 다시 허용
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    // ScrollTrigger 재계산
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

// DOM 준비 확인 후 초기화
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// ===================================
// 리사이즈 핸들러 (전역 ScrollTrigger 갱신)
// ===================================
let resizeTimer;
let lastWidth = window.innerWidth;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  
  resizeTimer = setTimeout(() => {
    const currentWidth = window.innerWidth;
    
    // 너비가 실제로 변경된 경우만 처리 (모바일 주소창 숨김 등 무시)
    if (Math.abs(currentWidth - lastWidth) > 50) {
      // refresh(true) 한 번만 — 중복 호출 시 pin-spacer 계산 꼬임
      ScrollTrigger.refresh(true);
      lastWidth = currentWidth;
    }
  }, 150);
});
