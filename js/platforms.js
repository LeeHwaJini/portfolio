// ===================================
// Platforms & Solutions Swiper
// ===================================

export function initPlatforms() {
  const section = document.querySelector('.platforms-section');
  if (!section) return;

  const filterBtns = section.querySelectorAll('.filter-btn');
  const swiperElement = section.querySelector('.platform-swiper');
  
  if (!swiperElement) return;

  // Swiper 초기화
  const swiper = new Swiper('.platform-swiper', {
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 30,
    loop: false,
    grabCursor: true,
    navigation: {
      nextEl: '.platform-next',
      prevEl: '.platform-prev',
    },
    keyboard: {
      enabled: true,
    },
    breakpoints: {
      320: {
        spaceBetween: 20,
        slidesPerView: 1,
      },
      640: {
        spaceBetween: 24,
        slidesPerView: 'auto',
      },
      968: {
        spaceBetween: 30,
        slidesPerView: 'auto',
      },
    },
    on: {
      init: function() {
        updateSlideClasses(this);
      },
      slideChange: function() {
        updateSlideClasses(this);
      }
    }
  });

  // 슬라이드 클래스 업데이트
  function updateSlideClasses(swiperInstance) {
    const slides = swiperInstance.slides;
    slides.forEach((slide, index) => {
      slide.classList.remove('swiper-slide-active', 'swiper-slide-prev', 'swiper-slide-next');
      
      if (index === swiperInstance.activeIndex) {
        slide.classList.add('swiper-slide-active');
      } else if (index === swiperInstance.activeIndex - 1) {
        slide.classList.add('swiper-slide-prev');
      } else if (index === swiperInstance.activeIndex + 1) {
        slide.classList.add('swiper-slide-next');
      }
    });
  }

  let currentFilter = 'all';

  // 필터 버튼 이벤트
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 활성 버튼 변경
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // 필터 값
      const filter = btn.dataset.filter;
      currentFilter = filter;

      // 슬라이드 필터링
      const slides = swiper.slides;
      let firstVisibleIndex = -1;

      slides.forEach((slide, index) => {
        const category = slide.dataset.category;
        
        if (filter === 'all' || category === filter) {
          slide.classList.remove('hidden');
          if (firstVisibleIndex === -1) {
            firstVisibleIndex = index;
          }
        } else {
          slide.classList.add('hidden');
        }
      });

      // Swiper 업데이트 및 첫 번째 보이는 슬라이드로 이동
      swiper.update();
      if (firstVisibleIndex !== -1) {
        swiper.slideTo(firstVisibleIndex, 500);
      }
    });
  });

  // 초기 애니메이션 (GSAP)
  if (typeof gsap !== 'undefined') {
    gsap.from('.platform-card', {
      opacity: 0,
      y: 50,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        once: true
      }
    });
  }
}
