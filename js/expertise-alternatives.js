// ===================================
// Alternative Expertise Sections Interactions
// ===================================

const { gsap, ScrollTrigger } = window;

/**
 * Initialize all alternative expertise sections
 */
export function initExpertiseAlternatives() {
  initTagsCloud();
  initRadialGraph();
  initTerminal();
}

// ===================================
// Style 6: Terminal
// ===================================
function initTagsCloud() {
  const cloud = document.getElementById('tagsCloud');
  if (!cloud) return;

  const tags = cloud.querySelectorAll('.tag-item');
  
  // Animate tags on scroll
  tags.forEach((tag, index) => {
    gsap.from(tag, {
      scrollTrigger: {
        trigger: cloud,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      scale: 0,
      opacity: 0,
      duration: 0.6,
      delay: index * 0.05,
      ease: 'back.out(1.7)'
    });
  });

  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;

  cloud.addEventListener('mousemove', (e) => {
    const rect = cloud.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    mouseY = (e.clientY - rect.top) / rect.height - 0.5;

    tags.forEach((tag) => {
      const rect = tag.getBoundingClientRect();
      const tagCenterX = rect.left + rect.width / 2;
      const tagCenterY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - tagCenterX) / 5;
      const deltaY = (e.clientY - tagCenterY) / 5;

      gsap.to(tag, {
        x: -deltaX,
        y: -deltaY,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });

  cloud.addEventListener('mouseleave', () => {
    tags.forEach((tag) => {
      gsap.to(tag, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
      });
    });
  });
}

// ===================================
// Style 4: Radial Graph
// ===================================
function initRadialGraph() {
  const radialSection = document.querySelector('.expertise-radial');
  if (!radialSection) return;

  const nodes = radialSection.querySelectorAll('.radial-node');
  const lines = radialSection.querySelectorAll('.radial-line');

  // Animate on scroll
  gsap.from(lines, {
    scrollTrigger: {
      trigger: radialSection,
      start: 'top 70%',
      toggleActions: 'play none none none'
    },
    strokeDashoffset: 100,
    opacity: 0,
    duration: 1.5,
    stagger: 0.1,
    ease: 'power2.out'
  });

  gsap.from(nodes, {
    scrollTrigger: {
      trigger: radialSection,
      start: 'top 70%',
      toggleActions: 'play none none none'
    },
    scale: 0,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    delay: 0.5,
    ease: 'back.out(1.7)'
  });

  // Hover effects
  nodes.forEach((node) => {
    node.addEventListener('mouseenter', () => {
      gsap.to(node, {
        attr: { r: 35 },
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    node.addEventListener('mouseleave', () => {
      gsap.to(node, {
        attr: { r: 30 },
        duration: 0.3,
        ease: 'power2.in'
      });
    });
  });
}

// ===================================
// Style 6: Terminal
// ===================================
function initTerminal() {
  const terminalSection = document.querySelector('.expertise-terminal');
  if (!terminalSection) return;

  const terminalWindow = terminalSection.querySelector('.terminal-window');

  // Entrance animation
  gsap.from(terminalWindow, {
    scrollTrigger: {
      trigger: terminalSection,
      start: 'top 70%',
      toggleActions: 'play none none none'
    },
    y: 80,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  });

  // Typing effect for cursor
  const cursor = terminalSection.querySelector('.terminal-cursor');
  if (cursor) {
    gsap.to(cursor, {
      opacity: 0,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'steps(1)'
    });
  }
}
