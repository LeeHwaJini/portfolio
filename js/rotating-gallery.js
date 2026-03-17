// ===================================
// Rotating Gallery - 원형 캐러셀
// ===================================

export function initRotatingGallery() {
  const { gsap, Draggable, ScrollTrigger } = window;

  if (!gsap || !Draggable || !ScrollTrigger) {
    console.warn('GSAP, Draggable, or ScrollTrigger not found');
    return;
  }

  const items = gsap.utils.toArray('.gallery-item');

  if (items.length === 0) {
    console.warn('No gallery items found');
    return;
  }

  const total = items.length;
  const angleStep = 360 / total;
  const finalRotations = Array.from({ length: total }, (_, i) => i * angleStep);

  // 마지막 카드 등장 애니메이션이 끝나는 시점
  const animStartTime = 0.15 * Math.floor((total - 1) / 2) + 1;

  let currentTimeline = null;
  let draggableReady = false;

  // 앞(0°)은 크고 선명, 뒤(180°)는 작고 흐릿
  const updateDepth = () => {
    const containerRot = gsap.getProperty('.gallery-items', 'rotation') || 0;
    items.forEach((item, index) => {
      const globalAngle = ((containerRot + finalRotations[index]) % 360 + 360) % 360;
      const normalized = globalAngle > 180 ? globalAngle - 360 : globalAngle;
      const depth = (Math.cos((normalized * Math.PI) / 180) + 1) / 2;

      const blurPx = (1 - depth) * 2.5;
      const filterVal = blurPx > 0.1 ? `blur(${blurPx.toFixed(1)}px)` : 'none';

      gsap.set(item, {
        scale:   0.55 + depth * 0.45,  // 0.55 ~ 1.0
        opacity: 0.25 + depth * 0.75,  // 0.25 ~ 1.0
        zIndex:  Math.round(depth * 100),
        filter:  filterVal,
      });
    });
  };

  const init = () => {
    if (currentTimeline) {
      currentTimeline.kill();
      currentTimeline = null;
    }

    gsap.set(items, { clearProps: 'all' });
    gsap.set('.gallery-items', { rotation: 0 });

    const timeline = gsap.timeline();

    items.forEach((item, index) => {
      // 등장 전 흩어진 회전값
      const sign = Math.floor((index / 2) % 2) ? 1 : -1;
      const value = Math.floor((index + 4) / 4) * 4;
      const rotation = index > total - 3 ? 0 : sign * value;

      gsap.set(item, { rotation, scale: 0.5 });

      // 좌우에서 날아오는 등장 애니메이션
      timeline.from(
        item,
        {
          x: () =>
            index % 2
              ? window.innerWidth + item.clientWidth * 4
              : -window.innerWidth - item.clientWidth * 4,
          y: () => window.innerHeight - item.clientHeight,
          rotation: index % 2 ? 200 : -200,
          scale: 4,
          opacity: 1,
          ease: 'power4.out',
          duration: 1,
          delay: 0.15 * Math.floor(index / 2),
        },
        0
      );

      // 모든 등장 애니메이션이 끝난 후 원형 배치로 이동
      timeline.to(item, { scale: 1, duration: 0 }, animStartTime);
      timeline.to(
        item,
        {
          transformOrigin: 'center 90vh',
          rotation: finalRotations[index],
          duration: 1,
          ease: 'power1.out',
        },
        animStartTime
      );
    });

    timeline.call(updateDepth, null, animStartTime + 1.1);

    currentTimeline = timeline;
    return timeline;
  };

  // 카드 1장씩 스냅 드래그
  const setupDraggable = () => {
    if (draggableReady) return;
    draggableReady = true;

    let start = 0;
    Draggable.create('.gallery-items', {
      type: 'rotation',
      onDragStart: function () {
        start = this.rotation;
      },
      onDrag: updateDepth,
      onDragEnd: function () {
        const diff = this.rotation - start;

        let targetRotation;
        if (Math.abs(diff) < angleStep / 2) {
          targetRotation = start;           // 조금만 움직이면 원위치
        } else if (diff > 0) {
          targetRotation = start + angleStep; // 시계 방향
        } else {
          targetRotation = start - angleStep; // 반시계 방향
        }

        gsap.to('.gallery-items', {
          rotation: targetRotation,
          duration: 0.5,
          ease: 'power2.out',
          onUpdate: updateDepth,
        });
      },
    });
  };

  // 쿨다운 동안 재실행 방지 (경계 근처 반복 통과 시 중복 실행 방지)
  const COOLDOWN_MS = Math.ceil((animStartTime + 1.5) * 1000);
  let lastInitAt = 0;

  const tryInit = () => {
    const now = Date.now();
    if (now - lastInitAt < COOLDOWN_MS) return;
    lastInitAt = now;
    init();
    setupDraggable();
  };

  ScrollTrigger.create({
    trigger: '.rotating-gallery-section',
    start: 'top 70%',
    end: 'bottom top',
    invalidateOnRefresh: true,
    onEnter: tryInit,
    onEnterBack: tryInit,
  });
}
