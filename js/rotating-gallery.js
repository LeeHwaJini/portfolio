// ===================================
// Rotating Gallery (Expertise Section)
// ===================================

export function initRotatingGallery() {
  const { gsap, Draggable } = window;

  if (!gsap || !Draggable) {
    console.warn('GSAP or Draggable not found');
    return;
  }

  const items = gsap.utils.toArray('.gallery-item');
  const imageSize = items.length;
  const total = items.length;
  const degree = 360 / total;

  const init = () => {
    const timeline = gsap.timeline();

    items.forEach((item, index) => {
      const sign = Math.floor((index / 2) % 2) ? 1 : -1;
      const value = Math.floor((index + 4) / 4) * 4;
      const rotation = index > imageSize - 3 ? 0 : sign * value;

      gsap.set(item, {
        rotation: rotation,
        scale: 0.5,
      });

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

      let rotationAngle = index * degree;
      timeline.to(
        item,
        {
          scale: 1,
          duration: 0,
        },
        0.15 * (imageSize / 2 - 1) + 1
      );

      timeline.to(
        item,
        {
          transformOrigin: 'center 200vh',
          rotation:
            index > imageSize / 2 ? -degree * (imageSize - index) : rotationAngle,
          duration: 1,
          ease: 'power1.out',
        },
        0.15 * (imageSize / 2 - 1) + 1
      );
    });
  };

  const draggable = () => {
    let start = 0;
    Draggable.create('.gallery-items', {
      type: 'rotation',

      onDragStart: function () {
        start = this.rotation;
      },
      onDragEnd: function () {
        const rotation = this.rotation;
        const offset = Math.abs(rotation - start);
        if (rotation > start) {
          if (rotation - start < degree / 2) {
            gsap.to('.gallery-items', {
              rotation: `-=${offset}`,
            });
          } else {
            gsap.to('.gallery-items', {
              rotation: `+=${2 * degree - offset}`,
            });
          }
        } else {
          if (Math.abs(rotation - start) < degree / 2) {
            gsap.to('.gallery-items', {
              rotation: `+=${offset}`,
            });
          } else {
            gsap.to('.gallery-items', {
              rotation: `-=${2 * degree - offset}`,
            });
          }
        }
      },
    });
  };

  init();
  draggable();

  console.log('✨ Rotating Gallery initialized');
}
