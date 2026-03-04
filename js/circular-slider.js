const { gsap } = window;

export function initCircularSlider() {
  const wheel = document.getElementById('wheel');
  const wheelItems = wheel ? wheel.querySelectorAll('li') : [];
  const detailContents = document.querySelectorAll('.detail-content');
  const prevBtn = document.querySelector('.nav-prev, .prev');
  const nextBtn = document.querySelector('.nav-next, .next');
  
  if (!wheel || wheelItems.length === 0) {
    console.warn('Circular slider elements not found');
    return;
  }

  let currentIndex = 0;
  let currentRotation = 0;
  const totalItems = wheelItems.length;
  const anglePerItem = 360 / totalItems; // 90 degrees for 4 items

  // 회전 기준점을 원의 중심(ul 좌상단)으로 고정
  gsap.set(wheel, { transformOrigin: '0 0' });

  // Initialize
  updateActive(currentIndex);

  // Navigation Buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevHandler();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextHandler();
    });
  }

  function nextHandler() {
    currentIndex = (currentIndex + 1) % totalItems;
    rotateDraggable(anglePerItem, dragActive); // 시계 방향
  }

  function prevHandler() {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    rotateDraggable(-anglePerItem, dragActive); // 반시계 방향
  }

  function rotateDraggable(deg, callback) {
    const rot = currentRotation;
    gsap.to(wheel, {
      rotation: rot + deg,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: function() {
        callback();
      }
    });
    currentRotation = rot + deg;
  }

  function dragActive() {
    updateActive(currentIndex);
  }

  function updateActive(index) {
    // Update wheel items
    wheelItems.forEach((item, i) => {
      if (i === index) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update detail contents
    detailContents.forEach((content, i) => {
      if (i === index) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });
  }
}
