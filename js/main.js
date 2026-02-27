// ===================================
// Main Entry Point
// ===================================
import { initPreloader } from './preloader.js';
import { initCursor } from './cursor.js';
import { initNavigation } from './navigation.js';
import { initProjects } from './projects.js';
import { initTechShowcase } from './carousel.js';
import { initSkillsAnimations } from './skills.js';
import { initScrollSequence } from './sequence.js';

// 새로고침 시 항상 최상단에서 시작 (브라우저 스크롤 복원 비활성화)
history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// GSAP 전역 객체 사용
const { gsap, ScrollTrigger, ScrollToPlugin } = window;

// GSAP 초기화
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ===================================
// 스크롤 프로그레스 바
// ===================================
const scrollProgressBar = document.querySelector(".scroll-progress-bar");

if (scrollProgressBar) {
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      const progress = self.progress * 100;
      scrollProgressBar.style.width = `${progress}%`;
    },
  });
}

// ===================================
// 초기화
// ===================================
function init() {
  // 섹션들 미리 초기화 (preloader 뒤에서 준비)
  initCursor();
  initNavigation();
  initSkillsAnimations();   // expertise-section
  initTechShowcase();       // tech-showcase-section (03)
  initProjects();           // projects-section (04)
  initScrollSequence();     // scroll-sequence-section (마지막)
  // ※ 여기서 refresh 하지 않음 — preloader 완료 후 한 번만 정확히 refresh

  // preloader 동안 스크롤 차단
  document.body.style.overflow = 'hidden';

  // Preloader 애니메이션 실행 → 완료 후 페이지 진입
  initPreloader(() => {
    // 스크롤 복원
    document.body.style.overflow = '';
    window.scrollTo(0, 0);

    // scrollTo 가 실제로 반영된 뒤 두 프레임 후 refresh
    // (한 프레임만 기다리면 scroll 위치가 아직 반영 안 될 수 있음)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh(true); // true = 강제 재계산
        console.log(
          "%c포트폴리오 로드 완료",
          "color: #fff; background:#000; font-size: 14px; font-weight: 600; padding: 4px 8px;"
        );
      });
    });
  });
}

// DOM 로드 후 초기화
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// 리사이즈 시 ScrollTrigger 새로고침
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
});
