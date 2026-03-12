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

  const total = items.length; // 12장

  // 360° 원형 배치: 카드 간격 = 360 / total
  const angleStep = 360 / total; // 30° (12장 기준)

  // 각 카드의 최종 회전 각도 (0°, 30°, 60° ... 330°)
  const finalRotations = Array.from({ length: total }, (_, i) => i * angleStep);

  // 마지막 카드 등장 애니메이션이 끝나는 시점
  const animStartTime = 0.15 * Math.floor((total - 1) / 2) + 1;

  let currentTimeline = null;
  let draggableReady = false;

  // ─── 원근감 효과: 앞(0°)은 크고 선명, 뒤(180°)는 작고 흐릿
  const updateDepth = () => {
    const containerRot = gsap.getProperty('.gallery-items', 'rotation') || 0;
    items.forEach((item, index) => {
      // 전역 각도 계산 (0~360)
      const globalAngle = ((containerRot + finalRotations[index]) % 360 + 360) % 360;
      // -180~180으로 정규화
      const normalized = globalAngle > 180 ? globalAngle - 360 : globalAngle;
      // cos 값으로 깊이 계산 (앞: 1, 뒤: 0)
      const depth = (Math.cos((normalized * Math.PI) / 180) + 1) / 2;

      gsap.set(item, {
        scale: 0.55 + depth * 0.45,    // 0.55 ~ 1.0
        opacity: 0.2 + depth * 0.8,    // 0.2 ~ 1.0
        zIndex: Math.round(depth * 100),
      });
    });
  };

  // ─── 초기화 & 애니메이션 실행
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

      // 원형 배치로 이동 (모든 등장 애니메이션이 끝난 후)
      timeline.to(item, { scale: 1, duration: 0 }, animStartTime);
      timeline.to(
        item,
        {
          transformOrigin: 'center 120vh',
          rotation: finalRotations[index],
          duration: 1,
          ease: 'power1.out',
        },
        animStartTime
      );
    });

    // 원형 배치 완료 후 원근감 효과 적용
    timeline.call(updateDepth, null, animStartTime + 1.1);

    currentTimeline = timeline;
    return timeline;
  };

  // ─── 드래그 설정 (카드 1장씩 스냅)
  const setupDraggable = () => {
    if (draggableReady) return;
    draggableReady = true;

    let start = 0;
    Draggable.create('.gallery-items', {
      type: 'rotation',
      onDragStart: function () {
        start = this.rotation;
      },
      onDrag: updateDepth, // 드래그 중 실시간 원근감 업데이트
      onDragEnd: function () {
        const diff = this.rotation - start;

        let targetRotation;
        if (Math.abs(diff) < angleStep / 2) {
          // 조금만 움직였으면 원위치
          targetRotation = start;
        } else if (diff > 0) {
          // 시계 방향 → 다음 카드
          targetRotation = start + angleStep;
        } else {
          // 반시계 방향 → 이전 카드
          targetRotation = start - angleStep;
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

  // 스크롤 UP 시 애니메이션 없이 카드를 원형 위치에 바로 배치
  const quickArrange = () => {
    if (currentTimeline) {
      currentTimeline.kill();
      currentTimeline = null;
    }
    gsap.set(items, { clearProps: 'all' });
    gsap.set('.gallery-items', { rotation: 0 });
    items.forEach((item, index) => {
      gsap.set(item, {
        transformOrigin: 'center 120vh',
        rotation: finalRotations[index],
        scale: 1,
        opacity: 1,
      });
    });
    updateDepth();
  };

  // 섹션이 뷰포트 상단에 도달하면 애니메이션 재생
  ScrollTrigger.create({
    trigger: '.rotating-gallery-section',
    start: 'top top',
    invalidateOnRefresh: true,  // 리프레시 시 시작 위치 재계산
    onEnter: () => {
      init();
      setupDraggable();
    },
    onEnterBack: () => {
      quickArrange();
      setupDraggable();
    },
  });
}
