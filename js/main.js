// ===================================
// Main Entry Point
// ===================================
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

// 페이지 새로고침 시 항상 최상단에서 시작
history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

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
  // 1. UI 컴포넌트 초기화
  initCursor();
  initNavigation();
  
  // 2. 섹션별 애니메이션 초기화
  initHero();               // 01. Hero (파티클 네트워크)
  initAboutAlternatives();  // 01. About Alternatives (타임라인/매거진/스플릿)
  initSkillsAnimations();   // 02. Expertise
  initModernExpertise();    // 02. Modern Expertise Alternatives
  initCircularSlider();     // 03. Experience (도넛 슬라이더)
  initPlatforms();          // 04. Platforms & Solutions
  initProjects();           // 05. Projects (가로 스크롤)
  initScrollSequence();     // 마지막. Scroll Sequence

  // 3. 프리로더 동안 스크롤 차단 (프리로더 비활성화로 주석 처리)
  // document.body.style.overflow = 'hidden';

  // 4. 프리로더 실행 → 완료 후 페이지 활성화
  initPreloader(() => {
    // 프리로더 강제 제거
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      preloader.style.display = 'none';
      preloader.remove(); // DOM에서 완전히 제거
    }
    
    document.body.style.overflow = '';
    window.scrollTo(0, 0);

    // ScrollTrigger 재계산 (정확한 위치 계산을 위해 2프레임 대기)
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
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    ScrollTrigger.refresh();
    console.log("%c🔄 ScrollTrigger Refreshed", "color: #4CAF50; font-weight: 600;");
  }, 250);
});
