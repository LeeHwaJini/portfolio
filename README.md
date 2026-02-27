# 포트폴리오 웹사이트

## 🎯 기술 스택
- **HTML5 / SCSS**
- **JavaScript (ES6 Modules)**
- **GSAP 3.12** (ScrollTrigger, ScrollToPlugin)

## 📁 프로젝트 구조

```
test/
├── index.html              # 메인 HTML
├── style.scss              # SCSS 메인 파일
├── style.css               # 컴파일된 CSS
├── scss/
│   ├── _variables.scss    # 색상, 폰트, 간격 변수
│   ├── _mixins.scss       # 재사용 가능한 mixins
│   └── _reset.scss        # CSS 리셋
├── js/
│   ├── main.js            # 메인 진입점
│   ├── cursor.js          # 커스텀 커서
│   ├── navigation.js      # 네비게이션
│   ├── projects.js        # Projects 섹션 (가로 스크롤)
│   ├── carousel.js        # Tech Showcase 캐러셀 + 모달
│   └── skills.js          # Skills 애니메이션
└── 
```

## 🚀 주요 기능

### 1. **커스텀 커서**
- 마우스 팔로우 애니메이션
- 인터랙티브 요소 호버 시 확대

### 2. **네비게이션**
- 스크롤에 반응하는 헤더
- 햄버거 메뉴 (모바일)

### 3. **Projects 섹션**
- 가로 스크롤 (ScrollTrigger pin)
- 이미지 Reveal 애니메이션
- 3D Card Tilt 효과
- 반응형 (모바일은 세로 스크롤)

### 4. **Tech Showcase 캐러셀**
- 스크롤 기반 카드 전환
- ScrollTrigger로 섹션 고정

### 5. **Skills 섹션**
- Text Split 애니메이션
- 프로그레스 바 카운터
- Tech Nodes 인터랙티브
- Connection Lines SVG 애니메이션

## 🛠️ 개발 환경

### CSS 컴파일
```bash
npx sass style.scss style.css --style compressed --watch
```

## 📝 코드 구조

### 모듈화 구조

```javascript
// js/main.js
import { initCursor } from './cursor.js';
import { initNavigation } from './navigation.js';
import { initProjects } from './projects.js';
import { initTechShowcase } from './carousel.js';
import { initSkillsAnimations } from './skills.js';

// 초기화
init();
```
## 🎨 GSAP 애니메이션

- **ScrollTrigger**: 스크롤 기반 애니메이션
- **Timeline**: 복잡한 시퀀스 애니메이션
- **matchMedia**: 반응형 애니메이션
- **containerAnimation**: 가로 스크롤 내 애니메이션

