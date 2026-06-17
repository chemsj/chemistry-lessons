# 수업 슬라이드 검증 스크립트

인터랙티브 화학 수업(단일 HTML) 제작 시 쓰는 **정적 검사 도구** 모음입니다.
모두 **순수 Node.js (ESM, 외부 패키지 없음)** — `npm install` 이 필요 없습니다.
Node 가 설치돼 있으면 바로 실행됩니다.

> 검증 절차 전체는 `docs/README_수업제작_가이드.md` §9·§17 참고.
> 이 스크립트들은 그중 **기계적으로 잡을 수 있는 항목**을 자동화합니다.

---

## 1. `lint-lesson.mjs` — 슬라이드 정적 검사

HTML 한 파일을 읽어 흔한 실수를 잡고 ✓/✗ 보고서를 출력합니다.
**ERROR 가 하나라도 있으면 종료 코드 ≠ 0** (WARN/INFO 는 실패시키지 않음).

```bash
node scripts/lint-lesson.mjs <수업-index.html>

# 예시
node scripts/lint-lesson.mjs chem-3-equilibrium/04-equilibrium-in-life/index.html
```

검사 항목:

| # | 항목 | 수준 | 내용 |
|---|------|------|------|
| 1 | JS 문법 | ERROR | 마지막 `<script>` 블록을 `vm.Script` 로 파싱(문법 오류 시 줄 번호 보고) |
| 2 | `check()` ↔ 피드백 id | ERROR | `check(this,…,'XXX',…)` 의 `'XXX'` 마다 `id="XXX"` 존재 확인 |
| 3 | `data-reveal` ↔ id | ERROR | `data-reveal="X"` 마다 `id="X"` 존재 확인 |
| 4 | 중복 id | ERROR | 같은 `id` 가 두 번 이상 쓰였는지(가이드 §10의 fb/reveal id 재사용 버그) |
| 5 | 슬라이드 수 | INFO | `<section class="slide…">` 개수(진행 점은 자동 생성이라 보고만) |
| 6 | 이미지 용량 | WARN | `<img src="img/…">` 파일이 2MB 초과인지(없으면 알림) |
| 7 | `word-break:keep-all` | WARN | `<style>` 에 한국어 줄바꿈 규칙(가이드 §20)이 있는지 |

> 참고: `check()`/`data-reveal`/id 검사는 **주석(`<!-- -->`, `/* */`, `//`)을 먼저 제거**한 뒤
> 수행합니다. 가이드용 주석에 적힌 예시(`check(this,…,'피드백id',…)` 등)가
> 거짓 양성(false positive)으로 잡히지 않게 하기 위함입니다.

---

## 2. `contrast-report.mjs` — 색 대비(WCAG) 보고서

`<style>` 의 `:root{ … }` 에 정의된 hex 색 변수를 읽어,
주요 **전경/배경 쌍**의 WCAG 2.x 명도 대비를 계산해 표로 출력합니다.

```bash
node scripts/contrast-report.mjs <html파일>

# 예시
node scripts/contrast-report.mjs index.html
node scripts/contrast-report.mjs chem-3-equilibrium/04-equilibrium-in-life/index.html
```

- sRGB → 상대 휘도, `(L1+0.05)/(L2+0.05)` 대비식을 **직접 구현**(외부 라이브러리 없음).
- 판정: 일반 텍스트 **≥4.5 PASS**, 큰 텍스트 **≥3.0 PASS**, 그 외 FAIL.
- 파일에 **실제로 존재하는 변수만** 골라 쌍을 구성하므로, 허브/덱 어느 쪽에도 동작합니다.
  - 허브(`index.html`): `--ink/--paper/--paper-2/--accent/--accent-2/--muted/--line`
  - 덱·템플릿: `--ink/--surface/--muted/--primary-d/--primary-l/--ok/--ok-l/--no/--no-l` 등
- **보고서 성격**입니다 — 파싱에 실패할 때만 종료 코드 ≠ 0. FAIL 이 있어도 0 으로 끝납니다.
  (작은 장식용 라벨에만 쓰는 색이 4.5:1 을 못 넘기는 등, 맥락상 허용되는 경우가 있으므로
   판정은 참고용으로 보고 본문 텍스트 색 위주로 확인하세요.)

---

## 3. 수업 제작 흐름에서의 위치

가이드 §17 "검증 루틴" 중 **자동화 가능한 부분**을 담당합니다.

1. **제작 중 슬라이드마다** → `lint-lesson.mjs` 로 JS 문법·id 연결·중복을 즉시 확인.
2. **허브/완성 수업** → `contrast-report.mjs` 로 색 대비(투사 가독성)를 점검.
3. 두 스크립트를 통과하면 라이브 미리보기로 넘어갑니다.

### 이 스크립트들이 검사하지 **않는** 것

- **720px 세로 넘침**(슬라이드가 한 화면에 들어오는지)은 정적으로 알 수 없습니다.
  → **라이브 미리보기**로 확인하세요: `python -m http.server 8770` 으로 띄운 뒤
    Preview MCP 로 각 슬라이드의 `col.scrollHeight > col.clientHeight` 를 점검(가이드 §17-2).
- 콘솔 오류 0, 시뮬 수치 검증, 빔프로젝터 최종 확인도 미리보기/수동 단계입니다.
