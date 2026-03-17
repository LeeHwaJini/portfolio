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
  const mainProjectCards = document.querySelectorAll(".projects-section .project-card");

  if (!viewAllBtn || !projectsOverlay || !projectDetailOverlay) {
    console.warn("Projects overlay elements not found");
    return;
  }

  const html = document.documentElement;

  const lockScroll = () => html.classList.add("overlay-open");
  const unlockScroll = () => html.classList.remove("overlay-open");
  const resetHistory = () => history.pushState("", document.title, window.location.pathname);

  mainProjectCards.forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      const projectId = card.dataset.projectId;
      if (projectId) openProjectDetail(projectId, false);
    });
  });

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

    document.querySelectorAll(".project-grid-card").forEach((card) => {
      card.addEventListener("click", () => {
        openProjectDetail(card.dataset.projectId, true);
      });
    });
  }

  function openProjectDetail(projectId, fromGrid = false) {
    const project = projectsData.find((p) => p.id === projectId);
    if (!project) return;

    // Back 버튼: 그리드에서 온 경우만 표시
    if (fromGrid) {
      backToList.style.display = "block";
      projectDetailOverlay.classList.remove("no-back-btn");
    } else {
      backToList.style.display = "none";
      projectDetailOverlay.classList.add("no-back-btn");
    }

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

    projectsOverlay.classList.remove("active");
    projectDetailOverlay.classList.add("active");

    if (!fromGrid) lockScroll();
    history.pushState(null, "", `#project/${projectId}`);
  }

  viewAllBtn.addEventListener("click", () => {
    renderProjectsGrid();
    projectsOverlay.classList.add("active");
    lockScroll();
    history.pushState(null, "", "#projects");
  });

  closeProjects.addEventListener("click", () => {
    projectsOverlay.classList.remove("active");
    unlockScroll();
    resetHistory();
  });

  closeDetail.addEventListener("click", () => {
    projectDetailOverlay.classList.remove("active");
    unlockScroll();
    resetHistory();
  });

  backToList.addEventListener("click", () => {
    projectDetailOverlay.classList.remove("active");
    projectsOverlay.classList.add("active");
    history.pushState(null, "", "#projects");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;

    if (projectDetailOverlay.classList.contains("active")) {
      // Back 버튼이 있으면 그리드로, 없으면 완전 닫기
      if (backToList.style.display !== "none") {
        projectDetailOverlay.classList.remove("active");
        projectsOverlay.classList.add("active");
        history.pushState(null, "", "#projects");
      } else {
        projectDetailOverlay.classList.remove("active");
        unlockScroll();
        resetHistory();
      }
    } else if (projectsOverlay.classList.contains("active")) {
      projectsOverlay.classList.remove("active");
      unlockScroll();
      resetHistory();
    }
  });

  function handleHashChange() {
    const hash = window.location.hash;

    if (hash === "#projects") {
      renderProjectsGrid();
      projectsOverlay.classList.add("active");
      projectDetailOverlay.classList.remove("active");
      lockScroll();
    } else if (hash.startsWith("#project/")) {
      const projectId = hash.replace("#project/", "");
      renderProjectsGrid();
      openProjectDetail(projectId);
    } else {
      projectsOverlay.classList.remove("active");
      projectDetailOverlay.classList.remove("active");
      unlockScroll();
    }
  }

  window.addEventListener("hashchange", handleHashChange);

  if (window.location.hash) {
    handleHashChange();
  }
}
