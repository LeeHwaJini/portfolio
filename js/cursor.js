// ===================================
// 커스텀 커서
// ===================================
const { gsap } = window;

export function initCursor() {
  const cursor = document.querySelector(".cursor");
  const cursorFollower = document.querySelector(".cursor-follower");

  if (!cursor || !cursorFollower) return;

  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    gsap.to(cursor, {
      x: mouseX,
      y: mouseY,
      duration: 0.1,
      ease: "power2.out",
    });

    gsap.to(cursorFollower, {
      x: mouseX,
      y: mouseY,
      duration: 0.3,
      ease: "power2.out",
    });

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // 인터랙티브 요소 호버 효과
  const interactiveElements = document.querySelectorAll(
    "a, button, .project-link, input, textarea"
  );

  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      gsap.to(cursorFollower, { scale: 2, duration: 0.3 });
    });

    el.addEventListener("mouseleave", () => {
      gsap.to(cursorFollower, { scale: 1, duration: 0.3 });
    });
  });
}

// ===================================
// 커서 색상 변경 유틸리티
// ===================================
export function setCursorColor(color) {
  if (color === 'white') {
    document.body.classList.add('modal-open');
  } else {
    document.body.classList.remove('modal-open');
  }
}
