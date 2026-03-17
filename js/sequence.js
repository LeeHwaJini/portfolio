// ===================================
// Scroll Sequence Animation
// ===================================
const { gsap, ScrollTrigger } = window;

export function initScrollSequence() {
  const section = document.querySelector(".scroll-sequence-section");
  const folder = document.querySelector(".folder-container");
  const folderFront = document.querySelector(".folder-front");
  const folderTab = document.querySelector(".folder-tab");
  const cards = document.querySelectorAll(".feature-card");
  const sequenceText = document.querySelector(".sequence-text");

  if (!section || !cards.length || !folder) return;

  // 메인 타임라인 생성
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      pin: ".sequence-container",
      pinSpacing: false,
    },
  });

  // 0단계: 폴더만 보임 (초기 상태)
  tl.set(folder, { opacity: 1, scale: 1 })

    // 1단계: 폴더가 열리면서 카드들이 나옴
    .to(folderFront, {
      rotateX: -45,
      transformOrigin: "bottom center",
      duration: 1.5,
      ease: "power2.inOut",
    })
    .to(
      folderTab,
      {
        rotateX: -35,
        y: -10,
        duration: 1.5,
        ease: "power2.inOut",
      },
      "<",
    )

    // 카드들이 폴더에서 튀어나옴
    .to(
      cards[0],
      {
        opacity: 1,
        scale: 0.8,
        z: 50,
        y: -50,
        x: -120,
        rotateY: -10,
        rotateZ: -3,
        duration: 1,
        ease: "back.out(1.2)",
      },
      "-=1",
    )
    .to(
      cards[1],
      {
        opacity: 1,
        scale: 0.85,
        z: 80,
        y: -80,
        x: 30,
        rotateZ: 2,
        duration: 1,
        ease: "back.out(1.2)",
      },
      "-=0.8",
    )
    .to(
      cards[2],
      {
        opacity: 1,
        scale: 0.8,
        z: 50,
        y: 40,
        x: 150,
        rotateY: 12,
        rotateZ: -5,
        duration: 1,
        ease: "back.out(1.2)",
      },
      "-=0.8",
    )

    // 2단계: 폴더 사라지고 카드들 확산
    .to(folder, {
      opacity: 0,
      scale: 0.8,
      duration: 1,
      ease: "power2.in",
    })
    .to(
      cards[0],
      {
        x: -400,
        y: -120,
        z: 0,
        rotateY: -18,
        rotateZ: -8,
        scale: 0.9,
        duration: 1.2,
        ease: "power2.out",
      },
      "<",
    )
    .to(
      cards[1],
      {
        x: 50,
        y: -200,
        z: 0,
        rotateZ: 3,
        scale: 0.95,
        duration: 1.2,
        ease: "power2.out",
      },
      "<",
    )
    .to(
      cards[2],
      {
        x: 420,
        y: 80,
        z: 0,
        rotateY: 20,
        rotateZ: -10,
        scale: 0.88,
        duration: 1.2,
        ease: "power2.out",
      },
      "<",
    )

    // 3단계: 카드들이 사라짐
    .to(cards, {
      opacity: 0,
      scale: 0.7,
      y: -150,
      rotateX: -25,
      duration: 1.2,
      stagger: 0.1,
      ease: "power2.in",
    })

    // 4단계: 텍스트 등장 (양쪽에서 슬라이드인)
    .to(
      ".text-left",
      {
        opacity: 1,
        x: 0,
        duration: 1.5,
        ease: "power3.out",
      },
      "-=0.3",
    )
    .to(
      ".text-right",
      {
        opacity: 1,
        x: 0,
        duration: 1.5,
        ease: "power3.out",
      },
      "<0.2",
    ); // 약간의 딜레이로 순차적 효과

  // 모바일 대응
  ScrollTrigger.matchMedia({
    // 데스크톱
    "(min-width: 769px)": function () {
      // 위의 애니메이션 그대로 사용
    },

    // 모바일
    "(max-width: 768px)": function () {
      // 모바일용 간소화된 애니메이션
      cards.forEach((card) => {
        gsap.set(card, { x: 0 });
      });
    },
  });
}
