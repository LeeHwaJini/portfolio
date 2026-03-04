// ===================================
// 유틸리티 함수
// ===================================

/**
 * 선형 보간 (Linear Interpolation)
 * @param {number} v0 - 시작 값
 * @param {number} v1 - 끝 값
 * @param {number} t - 보간 비율 (0~1)
 * @returns {number} 보간된 값
 */
export const lerp = (v0, v1, t) => v0 * (1 - t) + v1 * t;

/**
 * 값의 범위를 다른 범위로 매핑
 * @param {number} a - 입력 값
 * @param {number} b - 입력 최소값
 * @param {number} c - 입력 최대값
 * @param {number} d - 출력 최소값
 * @param {number} e - 출력 최대값
 * @returns {number} 매핑된 값
 */
export const scale = (a, b, c, d, e) => (a - b) * (e - d) / (c - b) + d;

/**
 * 디바운스 (연속 호출 방지)
 * @param {Function} fn - 실행할 함수
 * @param {number} delay - 지연 시간(ms)
 * @returns {Function} 디바운스된 함수
 */
export const debounce = (fn, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

/**
 * 랜덤 범위 값
 * @param {number} min - 최소값
 * @param {number} max - 최대값
 * @returns {number} 랜덤 값
 */
export const random = (min, max) => Math.random() * (max - min) + min;

/**
 * 클램프 (값을 범위 내로 제한)
 * @param {number} value - 입력 값
 * @param {number} min - 최소값
 * @param {number} max - 최대값
 * @returns {number} 제한된 값
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
