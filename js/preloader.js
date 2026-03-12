// ===================================
// Preloader — PORTFOLIO Drop Animation
// Poppins Bold text + 글자별 구조 끝점 dot
// ===================================

// ⭐ 개발 플래그
const DEV_SKIP_PRELOADER = false;
const DEV_KEEP_VISIBLE   = true;
const DEV_SHOW_BBOX      = false;

// ===================================
// Poppins Bold 폰트 메트릭 (font-size=165, baseline y=410)
// getBBox()는 타이포그래픽 전체 높이(ascender~descender)를 반환하므로
// y 좌표는 폰트 메트릭으로 직접 계산한 절대값을 사용
// ===================================
const FONT_SIZE = 165;
const BASELINE  = 410;                          // text y="410" (HTML 일치)
const CAP_TOP   = BASELINE - FONT_SIZE * 0.68; // ≈ 297.8 (대문자 상단)
const CAP_H     = FONT_SIZE * 0.68;            // ≈ 112.2 (대문자 높이)

// b.x, b.width 는 getBBox() 사용 (수평은 정확)
// cy 는 CAP_TOP / BASELINE 기반 절대 좌표 사용 (수직 정확)
const LETTER_DOTS = {
  // P: 세로획 위·아래 (0.16→0.19: 세로획 중심으로 이동) + 볼 우측 극단
  'P': b => [
    { cx: b.x + b.width * 0.19, cy: CAP_TOP + 2 },
    { cx: b.x + b.width * 0.91, cy: CAP_TOP + CAP_H * 0.27 },
    { cx: b.x + b.width * 0.19, cy: BASELINE - 2 },
  ],
  // O: 상·우·하·좌 4극단
  'O': b => [
    { cx: b.x + b.width * 0.50, cy: CAP_TOP - 2 },
    { cx: b.x + b.width * 0.94, cy: CAP_TOP + CAP_H * 0.50 },
    { cx: b.x + b.width * 0.50, cy: BASELINE + 2 },
    { cx: b.x + b.width * 0.06, cy: CAP_TOP + CAP_H * 0.50 },
  ],
  // R: 세로획 위·아래 (0.16→0.19) + 볼 우측 극단 + 볼-다리 접합점 + 다리 끝
  'R': b => [
    { cx: b.x + b.width * 0.19, cy: CAP_TOP + 2 },
    { cx: b.x + b.width * 0.91, cy: CAP_TOP + CAP_H * 0.27 },
    { cx: b.x + b.width * 0.87, cy: CAP_TOP + CAP_H * 0.54 },
    { cx: b.x + b.width * 0.93, cy: BASELINE - 2 },
    { cx: b.x + b.width * 0.19, cy: BASELINE - 2 },
  ],
  // T: 가로획 좌·중·우 끝 (0.04/0.96→0.07/0.93) + 세로획 하단
  'T': b => [
    { cx: b.x + b.width * 0.07, cy: CAP_TOP + 2 },
    { cx: b.x + b.width * 0.50, cy: CAP_TOP + 2 },
    { cx: b.x + b.width * 0.93, cy: CAP_TOP + 2 },
    { cx: b.x + b.width * 0.50, cy: BASELINE - 2 },
  ],
  // F: 상단 가로획 양끝 + 중단 가로획 끝 + 세로획 하단
  // mid-bar는 top-bar보다 짧음 → 0.84→0.74
  'F': b => [
    { cx: b.x + b.width * 0.10, cy: CAP_TOP + 2 },
    { cx: b.x + b.width * 0.92, cy: CAP_TOP + 2 },
    { cx: b.x + b.width * 0.74 + 2, cy: CAP_TOP + CAP_H * 0.38 },
    { cx: b.x + b.width * 0.10, cy: BASELINE - 2 },
  ],
  // L: 세로획 상단 + 가로획 좌·우 끝
  'L': b => [
    { cx: b.x + b.width * 0.10, cy: CAP_TOP + 2 },
    { cx: b.x + b.width * 0.10, cy: BASELINE - 2 },
    { cx: b.x + b.width * 0.94, cy: BASELINE - 2 },
  ],
  // I: 상단 가로획 양끝 + 하단 가로획 양끝
  // Poppins Bold I는 사이드베어링이 커서 실제 세리프바가 bbox 안쪽 20% 지점에 위치
  'I': b => [
    { cx: b.x + b.width * 0.20, cy: CAP_TOP + 2 },
    { cx: b.x + b.width * 0.80, cy: CAP_TOP + 2 },
    { cx: b.x + b.width * 0.20, cy: BASELINE - 2 },
    { cx: b.x + b.width * 0.80, cy: BASELINE - 2 },
  ],
};

// SVG 네임스페이스
const SVG_NS = 'http://www.w3.org/2000/svg';

function createDot(cx, cy) {
  const c = document.createElementNS(SVG_NS, 'circle');
  c.setAttribute('class', 'dot');
  c.setAttribute('cx', cx);
  c.setAttribute('cy', cy);
  c.setAttribute('r', '5.5');
  c.setAttribute('fill', 'url(#dotGrad)');
  return c;
}

export function initPreloader(onComplete) {
  const preloader = document.querySelector('.preloader');
  if (!preloader) { onComplete?.(); return; }

  // ⭐ 개발 모드: 즉시 skip
  if (DEV_SKIP_PRELOADER) {
    preloader.style.display = 'none';
    onComplete?.();
    return;
  }

  const { gsap, CustomEase } = window;

  if (!gsap) {
    console.warn('GSAP not found, skipping preloader animation');
    preloader.style.display = 'none';
    onComplete?.();
    return;
  }

  // ===================================
  // CustomEase 등록
  // ===================================
  if (CustomEase) {
    gsap.registerPlugin(CustomEase);
    CustomEase.create(
      'svgDrop',
      'M0,0 C0.574,0.01 0.815,0.71 0.846,1 0.867,1.089 0.899,0.954 0.93,0.954 0.96,0.954 0.989,1.055 1,1'
    );
  }
  const dropEase = CustomEase ? 'svgDrop' : 'power3.out';

  // ===================================
  // 요소 선택
  // ===================================
  const svg          = document.querySelector('.preloader-svg');
  const letterGroups = Array.from(svg.querySelectorAll('.letter-group'));
  const baseline     = svg.querySelector('.baseline');
  const shine        = svg.querySelector('.shine');
  const wholeGroup   = svg.querySelector('.whole');

  // SVG visible
  gsap.set(svg, { visibility: 'visible' });

  // ===================================
  // 폰트 로드 완료 후 레이아웃 & 애니메이션
  // ===================================
  const LETTER_GAP = 6;
  const SVG_WIDTH  = 1200;

  function layoutAndAnimate() {
    const ltrEls = letterGroups.map(g => g.querySelector('.ltr'));

    // --- 1) 글자 x 위치 계산 (getBBox) ---
    ltrEls.forEach(el => el.setAttribute('x', 0));
    const widths     = ltrEls.map(el => el.getBBox().width);
    const totalWidth = widths.reduce((s, w) => s + w, 0)
                     + (widths.length - 1) * LETTER_GAP;
    let x = (SVG_WIDTH - totalWidth) / 2;
    ltrEls.forEach((el, i) => {
      el.setAttribute('x', x);
      x += widths[i] + LETTER_GAP;
    });

    // --- 2) 글자별 구조 끝점에 dot 동적 생성 ---
    letterGroups.forEach(group => {
      // 기존 dot 모두 제거
      group.querySelectorAll('.dot').forEach(d => d.remove());

      const ltr  = group.querySelector('.ltr');
      const char = ltr.textContent.trim();
      const bbox = ltr.getBBox();

      const posFn = LETTER_DOTS[char];
      const positions = posFn
        ? posFn(bbox)
        : [
            { cx: bbox.x + bbox.width / 2, cy: bbox.y + 5 },
            { cx: bbox.x + bbox.width / 2, cy: bbox.y + bbox.height - 5 },
          ];

      positions.forEach(({ cx, cy }) => {
        group.appendChild(createDot(cx, cy));
      });
    });

    // --- 3) DEV: bbox + 점 위치 시각화 ---
    if (DEV_SHOW_BBOX) {
      // 애니메이션 없이 글자 즉시 표시
      gsap.set(svg.querySelectorAll('.ltr'), { opacity: 1 });

      const debugGroup = document.createElementNS(SVG_NS, 'g');
      debugGroup.setAttribute('id', 'debug-overlay');
      wholeGroup.appendChild(debugGroup);

      letterGroups.forEach(group => {
        const ltr  = group.querySelector('.ltr');
        const bbox = ltr.getBBox();

        // bbox 빨간 테두리
        const rect = document.createElementNS(SVG_NS, 'rect');
        rect.setAttribute('x', bbox.x);
        rect.setAttribute('y', bbox.y);
        rect.setAttribute('width',  bbox.width);
        rect.setAttribute('height', bbox.height);
        rect.setAttribute('fill', 'none');
        rect.setAttribute('stroke', 'rgba(255,0,0,0.6)');
        rect.setAttribute('stroke-width', '1');
        debugGroup.appendChild(rect);

        // 점 위치 노란 원 (현재 계산값)
        group.querySelectorAll('.dot').forEach(dot => {
          const marker = document.createElementNS(SVG_NS, 'circle');
          marker.setAttribute('cx', dot.getAttribute('cx'));
          marker.setAttribute('cy', dot.getAttribute('cy'));
          marker.setAttribute('r', '4');
          marker.setAttribute('fill', 'rgba(255,220,0,0.9)');
          marker.setAttribute('stroke', 'red');
          marker.setAttribute('stroke-width', '1');
          debugGroup.appendChild(marker);
        });
      });
      return; // 애니메이션 시작하지 않음
    }

    // --- 4) 초기 상태 ---
    gsap.set(shine, { x: 1400 });

    // ===================================
    // 등장: 글자별 점 낙하 + 글자 fade-in 동시
    // ===================================
    const enterTl = gsap.timeline();
    letterGroups.forEach((group, i) => {
      const groupDots = group.querySelectorAll('.dot');
      const ltrEl     = group.querySelector('.ltr');
      const startAt   = i * 0.12;

      // 점: 위에서 낙하
      enterTl.from(groupDots, {
        duration: 0.95,
        attr: { cy: '-=160', r: 0 },
        ease: dropEase,
        stagger: 0.05,
      }, startAt);

      // 글자: fade-in (fromTo로 0→1 명확히)
      enterTl.fromTo(ltrEl,
        { opacity: 0 },
        { opacity: 1, duration: 0.7, ease: 'power3.out' },
        startAt + 0.05
      );
    });

    // ===================================
    // 광택 스윕
    // ===================================
    const shineTl = gsap.timeline();
    shineTl.to(shine, { duration: 0.6, x: -400, ease: 'power2.inOut' });

    // ===================================
    // 베이스라인 등장
    // ===================================
    const baselineTl = gsap.timeline();
    baselineTl.from(baseline, {
      duration: 0.5,
      attr: { width: 0 },
      x: 120,
      ease: 'power3.inOut',
    });

    // ===================================
    // 낙하: 점들이 베이스라인으로 바운스
    // ===================================
    // 점 반지름(5.5)만큼 올려서 베이스라인 선 위에 살짝 걸치게
    const DOT_R      = 5.5;
    const BASELINE_Y = Number(baseline.getAttribute('y')) - DOT_R + 2;
    const allDots    = svg.querySelectorAll('.dot');
    const fallTl     = gsap.timeline();
    fallTl.to(allDots, {
      duration: 1,
      attr: { cy: BASELINE_Y },
      ease: 'bounce.out',
      stagger: { amount: 0.6, from: 'start' },
    });

    // ===================================
    // 퇴장
    // ===================================
    const exitTl = gsap.timeline();
    exitTl
      .to(wholeGroup, { duration: 1.8, y: 1500, ease: 'power2.in' })
      .to(baseline,   { duration: 0.4, attr: { width: 0 }, x: 600, ease: 'power2.in' }, '<+=0.1');

    // ===================================
    // 메인 타임라인
    // ===================================
    const mainTl = gsap.timeline({
      timeScale: 0.85,
      onComplete: () => {
        // ⭐ DEV_KEEP_VISIBLE: 위치 초기화 후 반복
        if (DEV_KEEP_VISIBLE) {
          // exitTl이 wholeGroup을 y:1500으로 날렸으므로 명시적으로 리셋
          gsap.set(wholeGroup, { x: 0, y: 0 });
          gsap.set(baseline, { x: 0, attr: { width: 1080 } });
          // 모든 dot을 구조적 위치로 되돌림
          letterGroups.forEach(group => {
            const ltr  = group.querySelector('.ltr');
            const bbox = ltr.getBBox();
            const char = ltr.textContent.trim();
            const posFn = LETTER_DOTS[char];
            if (!posFn) return;
            const positions = posFn(bbox);
            group.querySelectorAll('.dot').forEach((dot, i) => {
              if (positions[i]) {
                dot.setAttribute('cx', positions[i].cx);
                dot.setAttribute('cy', positions[i].cy);
              }
            });
          });
          mainTl.restart();
          return;
        }
        gsap.to(preloader, {
          duration: 0.4,
          opacity: 0,
          ease: 'power2.inOut',
          onComplete: () => {
            preloader.style.display = 'none';
            onComplete?.();
          },
        });
      },
    });

    mainTl
      .add(enterTl,    0)
      .add(shineTl,    1.7)
      .add(baselineTl, 0.6)
      .add(fallTl,     2.7)
      .add(exitTl,     4.6);

    // 안전장치
    setTimeout(() => {
      if (DEV_KEEP_VISIBLE) return;
      if (preloader.style.display !== 'none') {
        mainTl.kill();
        preloader.style.display = 'none';
        onComplete?.();
      }
    }, 12000);
  }

  // 폰트 로드 보장 후 실행
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(layoutAndAnimate);
  } else {
    setTimeout(layoutAndAnimate, 150);
  }
}
