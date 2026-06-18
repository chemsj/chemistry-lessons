---
name: slide-compose
description: 사용 시점 — blueprint의 슬라이드를 실제로 만들 때. 한 번에 전체를 만들지 않고, 슬라이드 한 장의 내용·레이아웃·요소·배치를 순서대로 하나씩 결정해 index.html에 <section> 하나씩 추가하고, 매 장 뒤 사용자 확인과 흐름 점검을 거친다.
---

# slide-compose — 미시 제작 (슬라이드 1장, 결정 요소를 하나씩)

**한 번에 여러 장을 만들지 않는다.** [[lesson-blueprint]]의 슬라이드 한 칸을 받아, 아래 순서대로 **한 항목씩 결정**하며 한 장을 완성한다. 각 단계는 사용자와 합의할 수 있다. [[chem-pedagogy-guidelines]]를 항상 적용한다.

## 사전 조건
- `docs/specs/<lesson>-blueprint.md` 가 있고 승인됨.
- 첫 슬라이드라면 [[lesson-deck-shell]]로 빈 덱을 수업 폴더 `index.html`로 깔아 둔다(상단바 브랜드= 단원/소단원 채움).

## 결정 순서 (슬라이드 i)
1. **의도** — 이 슬라이드가 학생에게 남길 한 가지(blueprint i번 칸). 없으면 먼저 정한다.
2. **이전 슬라이드 연결** — 무엇을 이어받고 무엇을 새로 던지나(흐름 일관성). 직전 슬라이드를 다시 본다.
3. **레이아웃 — 사용자가 선택(AI는 추천만, 확정 금지)** — **순서가 중요**:
   - **㉠ 먼저 조합 예시를 이미지(와이어프레임)로 보여준다** — `show_widget`(현재 의도에 맞는 추천 조합 + 대안) 또는 `docs/layout-gallery.html`. *처음 쓰는 사람도 '이렇게 답하면 이런 레이아웃이 된다'를 눈으로 보고 알 수 있게.*
   - **㉡ 그 다음 묻는다: ① 상단 박스(제목·질문)? · ② 중단 몇 단(1·2·3)? · ③ 하단 박스(종합·reveal)?**
   - AI는 의도·활동유형에 맞게 추천하고 **사용자가 확정**한다(AI 임의 확정 금지).
   구현은 `.framed`(상 `.row-head` / 중 `.row-mid.cols-1/2/3` / 하 `.row-foot` — 있는 박스만). 프리셋: single=중1 · 2col=중2 · cols3=중3 · headcols=상+중2 · split=상+하.
4. **요소 선택** — [[lesson-activity-types]]에서 이 슬라이드에 넣을 요소를 고른다: 발문 · 입자 시뮬([[lesson-simulator-particle]]) · 그래프([[lesson-graph]]) · 핵심요약 칩 · 이해도 체크([[lesson-comprehension-check]]) · 실험사진 · 슬라이더/계산기 · POE.
5. **배치** — 각 요소를 어디에: **시뮬·그래프는 col-r**, **질문·확인·정리는 col-l**(README §2). 핵심 정리는 [[lesson-reveal-gate]]로 활동 뒤 펼침. single이면 사례 학습 포맷(헤더 2박스→좌시뮬/우그래프→reveal→칩 정리).
6. **내용 작성** — 각 요소의 실제 텍스트·수치. 표기는 학생이 배운 것만, 실측 앵커, 흡열=빨강·발열=파랑. 시뮬 표시값=입자수=그래프=Q 일치(연속값).
7. **생성** — `<section class="slide" …>` **딱 한 개**를 deck-shell의 `▼▼▼ 슬라이드 삽입 위치` 마커 안에 추가(append). 입자 시뮬을 처음 쓰면 `lesson-simulator-particle/references/sim-helpers.js` 내용을 스크립트의 `data-init 함수` 마커에 먼저 붙여넣고, 이 슬라이드의 `data-init` 함수를 그 아래 추가. **전체 파일을 다시 쓰지 말 것 — 섹션 하나만 외과적으로 추가.**
8. **미시 검증** — `node scripts/lint-lesson.mjs <unit>/<NN-slug>/index.html` (0 errors) + 미리보기로 **이 슬라이드가 720px 안에 들어오는지**(세로 넘침 0)·콘솔 오류 0 확인. ([[lesson-verify]] / 라이브 미리보기: python http.server 8770 + Preview MCP `preview_snapshot`.) 자가 점검: 의도를 달성했는가?
9. **체크포인트** — blueprint 표의 i번 상태를 `built`로 갱신 → 사용자에게 보여주고 확인 → [[flow-check]]로 전체 흐름 점검 → 다음 슬라이드(i+1)로.

## 원칙
- 한 슬라이드 = 한 핵심. 안 들어가면 줄인다(과설계 금지).
- 정답을 먼저 보여주지 않는다: 발문 → 시뮬/관찰 → (버튼) 정리.
- `data-reveal` 값=카드 id, 형성평가 `fb` id는 슬라이드마다 **중복 금지**(lint가 잡음).
- 재사용할 만한 레이아웃·예시가 나오면 `docs/layout-gallery.html`에 카드로 등재한다(새 레이아웃이면 `lesson_template.html`·`deck-shell.html`에 CSS·견본도 함께).
- **레이아웃은 사용자 선택** — 매 장 갤러리 후보를 제시하고 AI는 추천만 한다. 절대 AI가 혼자 확정하지 않는다.

다음: [[flow-check]] · 되돌아가기 [[lesson-blueprint]]
