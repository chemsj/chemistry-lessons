---
name: lesson-verify
description: 사용 시점 — 슬라이드를 한 장 만든 직후, 또는 수업 전체를 완료하기 전에 산출물이 올바른지 확인할 때. 완료를 선언하기 전 반드시 검증한다(근거 우선).
---

# lesson-verify — 완료 전 검증

"동작한다/맞다"고 단정하기 전에 확인한다([[chem-pedagogy-guidelines]]: 근거 우선). [[slide-compose]] 8단계(슬라이드별)와 단원 완성 시(전체) 모두에서 쓴다.

## 슬라이드별 (미시, 매 장)
1. **정적 린트** — `node scripts/lint-lesson.mjs <unit>/<NN-slug>/index.html` → **0 errors** (JS 문법 / check↔fb id / data-reveal↔id / 중복 id). WARN(이미지 용량·keep-all)은 확인 후 판단.
2. **세로 넘침 0** — 이 슬라이드가 720px 안에 들어오는가. 라이브 미리보기로 확인:
   - `.claude/launch.json`의 python http.server(포트 8770) 실행 → Preview MCP `preview_start` → 해당 슬라이드로 이동(`go(i)`) → `preview_snapshot`/`preview_inspect`.
   - 2단 슬라이드는 칸 넘침 점검: `[...document.querySelectorAll('.slide.active .col-l,.slide.active .col-r')].some(c=>c.scrollHeight>c.clientHeight+3)` 가 `false`.
3. **콘솔 오류 0** — `preview_console_logs` 로 error 없음.
4. **의도 충족** — 이 슬라이드가 blueprint의 의도를 달성하는가(자가 점검).

## 단원 전체 (거시, 완료 전)
- 모든 슬라이드를 한 번씩 열어 콘솔 오류 0, 넘침 0.
- **시뮬 수치 검증** — 평형값·이동 방향·Q→K 복귀를 작은 노드 스크립트로 미리 계산해 화면 표시와 대조(시뮬 표시값=입자수=그래프=Q 일치).
- **대비** — `node scripts/contrast-report.mjs <file>` 로 본문 가독성 확인.
- **계수·표기** — 반응식 계수가 제목·표·마인드맵에서 일치, 첨자/전하 정확.

검증에 실패하면 완료로 표시하지 말고 [[slide-compose]]로 돌아가 그 슬라이드만 고친다.

관련: [[slide-compose]] · [[flow-check]] · 스크립트 사용법 `scripts/README.md`
