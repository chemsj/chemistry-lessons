---
name: lesson-deck-shell
description: 새 수업 index.html 의 빈 덱(16:9, 1280×720)을 만들 때 사용. 상단바·무대·하단 네비·줌·프레임워크 스크립트가 포함된 빈 시작 틀을 깔고, 이후 슬라이드를 한 장씩 추가한다.
---

# lesson-deck-shell — 빈 시작 덱

새 수업의 **빈 시작 덱**(`references/deck-shell.html`)을 제공한다. 디자인 시스템(`<style>`)·상단바·무대(`.stage`)·하단 네비·줌·프레임워크 스크립트가 모두 들어 있고, 본문에는 도입 슬라이드 1장만 남아 있다.

## 새 수업 시작하기
1. `references/deck-shell.html` 를 수업 폴더에 **`index.html`** 로 복사한다.
   (예: `chem-3-equilibrium/05-새단원/index.html`)
2. `<title>` 과 상단바 브랜드 자리(아래)를 수업에 맞게 채운다.
3. `▼▼▼ 슬라이드 삽입 위치` 마커 안에 슬라이드를 한 장씩 추가한다 → `[[slide-compose]]`.

## 프레임워크는 자동 — 절대 건드리지 않는다
스크립트의 프레임워크 영역이 다음을 자동 처리한다. 직접 수정 금지.
- 진행 점(dots) 생성, **이전/다음** 버튼, **키보드 ←→** 이동
- `data-title` → 하단 제목·페이지 수 표시
- 줌·팬(`−/%/+` 버튼, `Ctrl/⌘+휠`), letterbox 화면 맞춤
- `fitCanvas(cv)` (배율 보정 캔버스), `reveal(btn)` (핵심 정리 펼침), `check(...)` (형성평가 채점)

## 슬라이드 추가 위치
- 본문: `▼▼▼ 슬라이드 삽입 위치 ▼▼▼` ~ `▲▲▲ 슬라이드 삽입 위치 끝 ▲▲▲` 사이에 `<section class="slide ...">` 를 추가.
- 스크립트: 슬라이드별 `data-init` 함수는 `▼▼▼ 슬라이드별 data-init 함수를 여기에 추가 ▼▼▼` 마커에 작성.

## 입자 시뮬레이션을 쓰는 슬라이드라면
미시 입자 시뮬(움직이는 분자·캔버스 그래프)을 넣을 때는 `data-init` 함수보다 **먼저**
`lesson-simulator-particle/references/sim-helpers.js` 의 내용을 `<script>` 의 data-init 마커 위치에 붙여넣는다.
(헬퍼: `pSeed·pMove·drawMolecule·reconcile·countType·lineGraph·pushHist` 등)

## 상단바 브랜드 자리 (수업마다 채움)
```html
<div class="brand"><div class="logo">과목</div>
  <div><b>단원 제목</b><span>소단원 A · 소단원 B</span></div></div>
```
- `과목` 로고, `단원 제목`, `소단원 A · 소단원 B` 를 해당 수업 값으로 교체.

## 참고
- 토큰·클래스·시각 언어: [`../references/design-system.md`](../references/design-system.md)
- 슬라이드 작성: `[[slide-compose]]`
