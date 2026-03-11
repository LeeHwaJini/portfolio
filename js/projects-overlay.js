// ===================================
// 프로젝트 오버레이 (리스트 + 상세)
// ===================================
import { projectsData } from "./projects-data.js";

export function initProjectsOverlay() {
  const viewAllBtn = document.querySelector(".view-all-btn");
  const projectsOverlay = document.getElementById("projectsOverlay");
  const projectDetailOverlay = document.getElementById("projectDetailOverlay");
  const closeProjects = document.getElementById("closeProjects");
  const closeDetail = document.getElementById("closeDetail");
  const backToList = document.getElementById("backToList");
  const projectsGrid = document.getElementById("projectsGrid");
  const detailContent = document.getElementById("detailContent");

  // 메인 페이지의 프로젝트 카드들
  const mainProjectCards = document.querySelectorAll(
    ".projects-section .project-card",
  );

  if (!viewAllBtn || !projectsOverlay || !projectDetailOverlay) {
    console.warn("Projects overlay elements not found");
    return;
  }

  // 메인 페이지 프로젝트 카드 클릭 이벤트
  mainProjectCards.forEach((card) => {
    card.style.cursor = "pointer"; // 커서 변경
    card.addEventListener("click", () => {
      const projectId = card.dataset.projectId;
      if (projectId) {
        // 바로 상세 모달 열기 (메인에서 왔으므로 fromGrid = false)
        openProjectDetail(projectId, false);
      }
    });
  });

  // 프로젝트 그리드 렌더링
  function renderProjectsGrid() {
    projectsGrid.innerHTML = projectsData
      .map(
        (project) => `
      <div class="project-grid-card" data-project-id="${project.id}">
        <div class="project-grid-image">
          <img src="${project.thumbnail}" alt="${project.title}" loading="lazy" />
        </div>
        <div class="project-grid-info">
          <div class="project-grid-category">${project.category}</div>
          <h3 class="project-grid-title">${project.title}</h3>
          <p class="project-grid-description">${project.description}</p>
          <div class="project-grid-tags">
            ${project.tags.map((tag) => `<span class="project-grid-tag">#${tag}</span>`).join("")}
          </div>
        </div>
      </div>
    `,
      )
      .join("");

    // 각 카드에 클릭 이벤트 추가
    document.querySelectorAll(".project-grid-card").forEach((card) => {
      card.addEventListener("click", () => {
        const projectId = card.dataset.projectId;
        // 그리드에서 왔으므로 fromGrid = true
        openProjectDetail(projectId, true);
      });
    });
  }

  // 프로젝트 상세 열기
  function openProjectDetail(projectId, fromGrid = false) {
    const project = projectsData.find((p) => p.id === projectId);
    if (!project) return;

    // Back 버튼 표시/숨김 (그리드에서 온 경우만 표시)
    if (fromGrid) {
      backToList.style.display = "block";
      // 그리드에서 온 경우: 일반 레이아웃 (space-between)
      projectDetailOverlay.classList.remove("no-back-btn");
    } else {
      backToList.style.display = "none";
      // 메인에서 온 경우: 오른쪽 정렬
      projectDetailOverlay.classList.add("no-back-btn");
    }

    // 상세 내용 렌더링
    detailContent.innerHTML = `
      <div class="detail-hero">
        <div class="detail-category">${project.category}</div>
        <h1 class="detail-title">${project.title}</h1>
        <p class="detail-description">${project.overview}</p>
      </div>

      <div class="detail-meta">
        <div class="meta-item">
          <span class="meta-label">Client</span>
          <span class="meta-value">${project.client}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Period</span>
          <span class="meta-value">${project.period}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Role</span>
          <span class="meta-value">${project.role}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Contribution</span>
          <span class="meta-value">${project.contribution}</span>
        </div>
        ${
          project.url !== "#"
            ? `
        <div class="meta-item">
          <span class="meta-label">Website</span>
          <a class="meta-value" href="${project.url}" target="_blank" rel="noopener">Visit Site →</a>
        </div>
        `
            : ""
        }
      </div>

      <div class="detail-section">
        <h2 class="section-title">주요 기능</h2>
        <ul class="features-list">
          ${project.features.map((feature) => `<li>${feature}</li>`).join("")}
        </ul>
      </div>

      <div class="detail-section">
        <h2 class="section-title">프로젝트 이미지</h2>
        <div class="detail-images">
          ${project.images.map((img) => `<img src="${img}" alt="${project.title}" loading="lazy" />`).join("")}
        </div>
      </div>

      <div class="detail-features">
        ${project.tags.map((tag) => `<span class="feature-tag">#${tag}</span>`).join("")}
      </div>
    `;

    // 리스트 오버레이 숨기고 상세 오버레이 표시
    projectsOverlay.classList.remove("active");
    projectDetailOverlay.classList.add("active");

    // 스크롤 방지 (그리드에서 오지 않은 경우에만)
    if (!fromGrid) {
      document.body.classList.add("overlay-open");
    }

    // history.pushState로 해시 변경 (스크롤 이동 방지)
    history.pushState(null, "", `#project/${projectId}`);
  }

  // View All 버튼 클릭
  viewAllBtn.addEventListener("click", () => {
    renderProjectsGrid();
    projectsOverlay.classList.add("active");
    document.body.classList.add("overlay-open");
    // history.pushState로 해시 변경 (스크롤 이동 방지)
    history.pushState(null, "", "#projects");
  });

  // 리스트 닫기
  closeProjects.addEventListener("click", () => {
    projectsOverlay.classList.remove("active");
    document.body.classList.remove("overlay-open");
    history.pushState("", document.title, window.location.pathname);
  });

  // 상세 닫기
  closeDetail.addEventListener("click", () => {
    projectDetailOverlay.classList.remove("active");
    document.body.classList.remove("overlay-open");
    history.pushState("", document.title, window.location.pathname);
  });

  // 리스트로 돌아가기
  backToList.addEventListener("click", () => {
    projectDetailOverlay.classList.remove("active");
    projectsOverlay.classList.add("active");
    // body는 여전히 overlay-open 상태 유지
    history.pushState(null, "", "#projects");
  });

  // ESC 키로 닫기
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (projectDetailOverlay.classList.contains("active")) {
        // 상세에서 그리드로 (Back 버튼이 보이면 그리드로, 아니면 닫기)
        if (backToList.style.display !== "none") {
          projectDetailOverlay.classList.remove("active");
          projectsOverlay.classList.add("active");
          history.pushState(null, "", "#projects");
        } else {
          projectDetailOverlay.classList.remove("active");
          document.body.classList.remove("overlay-open");
          history.pushState("", document.title, window.location.pathname);
        }
      } else if (projectsOverlay.classList.contains("active")) {
        projectsOverlay.classList.remove("active");
        document.body.classList.remove("overlay-open");
        history.pushState("", document.title, window.location.pathname);
      }
    }
  });

  // URL 해시 라우팅
  function handleHashChange() {
    const hash = window.location.hash;

    if (hash === "#projects") {
      renderProjectsGrid();
      projectsOverlay.classList.add("active");
      projectDetailOverlay.classList.remove("active");
      document.body.classList.add("overlay-open");
    } else if (hash.startsWith("#project/")) {
      const projectId = hash.replace("#project/", "");
      renderProjectsGrid();
      openProjectDetail(projectId);
    } else {
      projectsOverlay.classList.remove("active");
      projectDetailOverlay.classList.remove("active");
      document.body.classList.remove("overlay-open");
    }
  }

  // 해시 변경 감지
  window.addEventListener("hashchange", handleHashChange);

  // 페이지 로드 시 해시 확인
  if (window.location.hash) {
    handleHashChange();
  }

  console.log("✨ Projects overlay initialized");
}
