// ===================================
// Experience Section
// SVG 좌표를 JS로 동적 계산 → 화면 크기에 무관하게 선이 카드에 정확히 연결됨
// ===================================

export function initExperience() {
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) {
    console.warn("[Experience] GSAP 또는 ScrollTrigger를 찾을 수 없습니다.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const section = document.querySelector(".experience-section");
  const svgEl = section.querySelector(".exp-svg-layer");
  const sticky = section.querySelector(".exp-sticky");
  const cards = [0, 1, 2, 3]
    .map((i) => document.getElementById(`expCard${i}`))
    .filter(Boolean);
  const CARD_POSITIONS = [0.1, 0.33, 0.56, 0.79];

  gsap.set(cards, { opacity: 0, x: 24, force3D: true });
  gsap.set(
    [
      ".exp-sec-label",
      ".exp-title-eyebrow",
      ".exp-title-big",
      ".exp-title-sub",
    ],
    {
      opacity: 0,
      y: 10,
    },
  );

  function buildSVG() {
    if (!svgEl || cards.length === 0) return;

    const stickyRect = sticky.getBoundingClientRect();
    const W = stickyRect.width;
    const H = stickyRect.height;

    svgEl.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svgEl.setAttribute("preserveAspectRatio", "none");
    svgEl.innerHTML = "";

    // GSAP x 오프셋을 일시 제거 후 자연 위치 측정 (opacity:0 상태이므로 깜빡임 없음)
    gsap.set(cards, { x: 0 });
    const cardRects = cards.map((card) => card.getBoundingClientRect());
    gsap.set(cards, { opacity: 0, x: 24, force3D: true });

    const stickyLeft = stickyRect.left;
    const stickyTop = stickyRect.top;

    const lineX = cardRects[0].left - stickyLeft - 60;
    const lineY1 = cardRects[0].top - stickyTop + cardRects[0].height / 2;
    const lineY2 =
      cardRects[cardRects.length - 1].top -
      stickyTop +
      cardRects[cardRects.length - 1].height / 2;
    const lineLen = lineY2 - lineY1;
    const nodeYs = cardRects.map((r) => r.top - stickyTop + r.height / 2);

    function el(tag, attrs) {
      const e = document.createElementNS("http://www.w3.org/2000/svg", tag);
      Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
      return e;
    }

    // gradientUnits="userSpaceOnUse": 수평/수직 선의 degenerate bounding box 문제 방지
    // 고유 ID: 동일 페이지 내 gradient ID 충돌 방지
    const uid = Date.now();
    const lineGradId = `expLG_${uid}`;
    const nodeGradId = `expNG_${uid}`;

    const defs = el("defs", {});
    const grad = el("linearGradient", {
      id: lineGradId,
      gradientUnits: "userSpaceOnUse",
      x1: String(lineX),
      y1: String(lineY1),
      x2: String(lineX),
      y2: String(lineY2),
    });
    grad.appendChild(el("stop", { offset: "0%", "stop-color": "#7998f2" }));
    grad.appendChild(el("stop", { offset: "100%", "stop-color": "#74e7fa" }));

    const nodeGrad = el("linearGradient", {
      id: nodeGradId,
      gradientUnits: "userSpaceOnUse",
      x1: String(lineX - 5),
      y1: String(lineY1),
      x2: String(lineX + 5),
      y2: String(lineY2),
    });
    nodeGrad.appendChild(el("stop", { offset: "0%", "stop-color": "#7998f2" }));
    nodeGrad.appendChild(el("stop", { offset: "100%", "stop-color": "#74e7fa" }));

    defs.appendChild(grad);
    defs.appendChild(nodeGrad);
    svgEl.appendChild(defs);

    // 배경 장식 점
    const dotGroup = el("g", { opacity: "0.05" });
    [
      [lineX - 80, lineY1 - 40],
      [lineX - 120, lineY1 + 60],
      [lineX - 60, lineY1 + 140],
      [lineX - 100, lineY2 - 60],
    ].forEach(([dx, dy]) => {
      dotGroup.appendChild(
        el("circle", { cx: dx, cy: dy, r: "2", fill: "#7998f2" }),
      );
    });
    svgEl.appendChild(dotGroup);

    // <rect> fill 방식: stroke-dashoffset보다 안정적, fallback 색으로 그라디언트 미지원 시 대비
    const mainLine = el("rect", {
      id: "expMainLine",
      x: lineX - 0.75,
      y: lineY1,
      width: 1.5,
      height: 0,
      fill: `url(#${lineGradId}) #7998f2`,
      opacity: "0.7",
    });
    svgEl.appendChild(mainLine);

    nodeYs.forEach((ny, i) => {
      // 수평선: 세로선 → 카드 왼쪽
      const hlLen = cardRects[i].left - stickyLeft - lineX;
      const hl = el("rect", {
        id: `expHl${i}`,
        x: lineX,
        y: ny - 0.5,
        width: 0,
        height: 1,
        fill: `url(#${lineGradId}) #7998f2`,
        opacity: "0.9",
        "data-hllen": String(hlLen),
      });
      svgEl.appendChild(hl);

      // 노드 원
      const nd = el("circle", {
        id: `expNd${i}`,
        cx: lineX,
        cy: ny,
        r: "0",
        fill: `url(#${nodeGradId}) #7998f2`,
        stroke: `url(#${lineGradId}) #7998f2`,
        "stroke-width": "1.5",
        opacity: "0",
      });
      svgEl.appendChild(nd);
    });

    return { mainLine, lineLen, nodeYs };
  }

  // ScrollTrigger scrub 대신 rAF 직접 사용 → position 계산 문제 우회
  let rafId = null;

  function setupAnimations() {
    ScrollTrigger.getAll()
      .filter((t) => t.trigger && (t.trigger === section || section.contains(t.trigger)))
      .forEach((t) => t.kill());

    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    const svgData = buildSVG();
    if (!svgData) return;

    const { mainLine, lineLen, nodeYs } = svgData;
    const hls = [0, 1, 2, 3]
      .map((i) => document.getElementById(`expHl${i}`))
      .filter(Boolean);
    const nds = [0, 1, 2, 3]
      .map((i) => document.getElementById(`expNd${i}`))
      .filter(Boolean);

    const P = CARD_POSITIONS;
    let titleShown = false;

    // rect.top = 0: 섹션이 viewport 상단 도착 → progress = 0
    // rect.top = -(offsetHeight - innerHeight): progress = 1
    function getProgress() {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      return Math.max(0, Math.min(1, -rect.top / scrollable));
    }

    // P[i] 도달 시 세로선이 node[i]까지, P[i]→P[i+1] 구간에서 node[i]→node[i+1]까지 그려짐
    const nodeLens = nodeYs.map((ny) => ny - nodeYs[0]);

    function getLineOffset(p) {
      if (!mainLine || lineLen <= 0) return lineLen;

      if (p <= P[0]) {
        const t = p / P[0];
        return lineLen - nodeLens[1] * 0.08 * t;
      }

      for (let i = 0; i < P.length - 1; i++) {
        if (p <= P[i + 1]) {
          const t = (p - P[i]) / (P[i + 1] - P[i]);
          const fromLen = i === 0 ? nodeLens[1] * 0.08 : nodeLens[i];
          const toLen = nodeLens[i + 1];
          return Math.max(0, lineLen - (fromLen + (toLen - fromLen) * t));
        }
      }

      return 0;
    }

    const shown = [false, false, false, false];

    function tick() {
      const p = getProgress();

      if (!titleShown) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          titleShown = true;
          gsap
            .timeline()
            .to('.exp-sec-label', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0)
            .to('.exp-title-eyebrow', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.1)
            .to('.exp-title-big', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.2)
            .to('.exp-title-sub', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.35);
        }
      }

      if (mainLine) {
        const offset = getLineOffset(p);
        const drawnLen = Math.max(0, lineLen - offset);
        mainLine.setAttribute('height', drawnLen.toFixed(1));
        mainLine.setAttribute('opacity', '0.5');
      }

      // 카드 등장 / 역방향 숨김 (양방향 처리)
      let batchIdx = 0;
      P.forEach((pos, i) => {
        const shouldShow = p >= pos;

        if (!shown[i] && shouldShow) {
          shown[i] = true;
          const delay = batchIdx * 0.12; // 동시 트리거 시 stagger
          batchIdx++;

          if (hls[i]) {
            const hlLen = parseFloat(hls[i].getAttribute('data-hllen') || '50');
            gsap.fromTo(
              hls[i],
              { attr: { width: 0 } },
              { attr: { width: hlLen }, duration: 0.4, delay, ease: 'power2.out' },
            );
          }
          if (nds[i]) {
            gsap.fromTo(
              nds[i],
              { attr: { r: 0 }, opacity: 0 },
              { attr: { r: 5 }, opacity: 1, duration: 0.4, delay, ease: 'back.out(2)' },
            );
          }
          if (cards[i]) {
            gsap.fromTo(
              cards[i],
              { opacity: 0, x: 24 },
              { opacity: 1, x: 0, duration: 0.65, delay, ease: 'power3.out' },
            );
          }

        } else if (shown[i] && !shouldShow) {
          shown[i] = false;

          if (hls[i]) gsap.to(hls[i], { attr: { width: 0 }, duration: 0.25, ease: 'power2.in' });
          if (nds[i]) gsap.to(nds[i], { attr: { r: 0 }, opacity: 0, duration: 0.25, ease: 'power2.in' });
          if (cards[i]) gsap.to(cards[i], { opacity: 0, x: 24, duration: 0.3, ease: 'power2.in' });
        }
      });

      let active = 0;
      P.forEach((pos, i) => { if (p >= pos) active = i; });
      document
        .querySelectorAll('.exp-pdot')
        .forEach((d, j) => d.classList.toggle('on', j === active));

      rafId = requestAnimationFrame(tick);
    }

    tick(); // 루프 시작

    window.expJumpTo = (idx) => {
      const scrollable = section.offsetHeight - window.innerHeight;
      const target = section.offsetTop + scrollable * P[idx];
      window.scrollTo({ top: target, behavior: 'smooth' });
    };
  }

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () =>
      gsap.to(card, {
        x: 6,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      }),
    );
    card.addEventListener("mouseleave", () =>
      gsap.to(card, {
        x: 0,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      }),
    );
  });

  // 화면 크기 변경 시 SVG 좌표 재계산
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      gsap.set(cards, { opacity: 0, x: 24 });
      setupAnimations();
    }, 300);
  });

  // 폰트/레이아웃 완전 로드 후 실행 → getBoundingClientRect 정확도 보장
  if (document.readyState === "complete") {
    setupAnimations();
  } else {
    window.addEventListener("load", setupAnimations);
  }

  // Canvas 아이콘 애니메이션
  const iconDefs = [
    { color: "#2563eb", type: "build" },
    { color: "#7c3aed", type: "renew" },
    { color: "#059669", type: "maintain" },
    { color: "#ea580c", type: "landing" },
  ];

  class LottieIcon {
    constructor(canvas, def) {
      this.cv = canvas;
      this.ctx = canvas.getContext("2d");
      this.def = def;
      this.t = 0;
      this.speed = 0.01;
      this.hovered = false;
    }
    tick() {
      this.t += this.speed * (this.hovered ? 2.5 : 1);
      if (this.t > 1) this.t -= 1;
      this._draw();
    }
    _drawGlow(ctx, x, y, r, color, alpha) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(
        0,
        color +
          Math.floor(alpha * 255)
            .toString(16)
            .padStart(2, "0"),
      );
      g.addColorStop(1, color + "00");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    _drawRing(ctx, cx, cy, r, color, alpha, width) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle =
        color +
        Math.floor(alpha * 255)
          .toString(16)
          .padStart(2, "0");
      ctx.lineWidth = width;
      ctx.stroke();
    }
    _drawParticles(ctx, cx, cy, t, color, count, orbitR) {
      for (let i = 0; i < count; i++) {
        const a = t * Math.PI * 2 + (i / count) * Math.PI * 2;
        const wobble = Math.sin(t * Math.PI * 4 + i) * 3;
        const px = cx + Math.cos(a) * (orbitR + wobble);
        const py = cy + Math.sin(a) * (orbitR + wobble);
        const pr = 1.2 + Math.sin(t * Math.PI * 3 + i * 1.3) * 0.7;
        const pa = 0.4 + Math.sin(t * Math.PI * 2 + i) * 0.3;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fillStyle =
          color +
          Math.floor(pa * 255)
            .toString(16)
            .padStart(2, "0");
        ctx.fill();
      }
    }
    _draw() {
      const ctx = this.ctx,
        t = this.t,
        cx = 28,
        cy = 28,
        c = this.def.color;
      ctx.clearRect(0, 0, 56, 56);
      const pulse = 0.93 + Math.sin(t * Math.PI * 2) * 0.07;

      if (this.def.type === "build") {
        this._drawGlow(ctx, cx, cy, 22, c, 0.12);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * Math.PI * 2 * 0.3);
        this._drawRing(ctx, 0, 0, 20, c, 0.15, 0.8);
        ctx.restore();
        this._drawParticles(ctx, cx, cy, t, c, 5, 18);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(pulse, pulse);
        [
          [0, -9],
          [9, 0],
          [-9, 0],
          [0, 9],
        ].forEach(([dx, dy], i) => {
          const a = t * Math.PI * 2 + (i * Math.PI) / 2,
            ox = Math.cos(a) * 1.5,
            oy = Math.sin(a) * 1.5;
          this._drawGlow(ctx, dx + ox, dy + oy, 8, c, 0.3);
          ctx.fillStyle = c + ["ff", "cc", "aa", "66"][i];
          ctx.beginPath();
          ctx.roundRect(dx - 4 + ox, dy - 4 + oy, 9, 9, 2);
          ctx.fill();
        });
        ctx.restore();
      } else if (this.def.type === "renew") {
        this._drawGlow(ctx, cx, cy, 22, c, 0.12);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-t * Math.PI * 2 * 0.2);
        this._drawRing(ctx, 0, 0, 20, c, 0.12, 0.8);
        ctx.restore();
        this._drawParticles(ctx, cx, cy, -t, c, 4, 17);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * Math.PI * 2 * 0.5);
        ctx.scale(pulse, pulse);
        this._drawGlow(ctx, 0, 0, 12, c, 0.35);
        ctx.fillStyle = c + "ee";
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const a1 = (i / 5) * Math.PI * 2 - Math.PI / 2,
            a2 = a1 + Math.PI / 5;
          if (i === 0) ctx.moveTo(Math.cos(a1) * 12, Math.sin(a1) * 12);
          else ctx.lineTo(Math.cos(a1) * 12, Math.sin(a1) * 12);
          ctx.lineTo(Math.cos(a2) * 5, Math.sin(a2) * 5);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else if (this.def.type === "maintain") {
        this._drawGlow(ctx, cx, cy, 22, c, 0.1);
        [20, 14].forEach((r, i) => {
          const a = Math.sin(t * Math.PI * 2 + i * Math.PI) * 0.45 + 0.2;
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(t * Math.PI * 2 * (i === 0 ? 0.15 : -0.2));
          this._drawRing(ctx, 0, 0, r, c, a, 0.8);
          ctx.restore();
        });
        this._drawParticles(ctx, cx, cy, t * 0.7, c, 4, 16);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(Math.sin(t * Math.PI * 3) * 0.2);
        ctx.scale(pulse, pulse);
        this._drawGlow(ctx, 0, 0, 11, c, 0.3);
        ctx.fillStyle = c + "dd";
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          if (i === 0) ctx.moveTo(Math.cos(a) * 11, Math.sin(a) * 11);
          else ctx.lineTo(Math.cos(a) * 11, Math.sin(a) * 11);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else if (this.def.type === "landing") {
        this._drawGlow(ctx, cx, cy, 22, c, 0.12);
        const wave = Math.sin(t * Math.PI * 4) * 0.5 + 0.5,
          wave2 = Math.sin(t * Math.PI * 4 + Math.PI) * 0.5 + 0.5;
        this._drawRing(ctx, cx, cy, 10 + wave * 10, c, (1 - wave) * 0.5, 0.8);
        this._drawRing(ctx, cx, cy, 8 + wave2 * 12, c, (1 - wave2) * 0.3, 0.5);
        this._drawParticles(ctx, cx, cy, t * 1.2, c, 5, 17);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * Math.PI * 2 * 0.15);
        ctx.scale(pulse, pulse);
        this._drawGlow(ctx, 0, 0, 11, c, 0.35);
        ctx.fillStyle = c + "ee";
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(10, 0);
        ctx.lineTo(0, 12);
        ctx.lineTo(-10, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }
  }

  const icons = iconDefs
    .map((def, i) => {
      const canvas = document.getElementById(`expIc${i}`);
      return canvas ? new LottieIcon(canvas, def) : null;
    })
    .filter(Boolean);

  cards.forEach((card, i) => {
    if (!icons[i]) return;
    card.addEventListener("mouseenter", () => {
      icons[i].hovered = true;
    });
    card.addEventListener("mouseleave", () => {
      icons[i].hovered = false;
    });
  });

  (function loop() {
    icons.forEach((ic) => ic && ic.tick());
    requestAnimationFrame(loop);
  })();
}
