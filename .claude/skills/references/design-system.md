# 디자인 시스템 (단일 진실 원천)

모든 수업 슬라이드가 공유하는 토큰·클래스·시각 언어. `docs/lesson_template.html`의 `:root`와 `docs/README_수업제작_가이드.md` §6·7·20·24에서 추출. **색은 직접 지정하지 말고 변수를 쓴다.**

---

## 덱 규격 (고정)
- 무대(stage): **1280×720 (16:9)**, letterbox로 창에 맞춤. 슬라이드 1장 = `<section class="slide">` 1개.
- 레이아웃 3층: `.topbar`(48~54px) · `.stage`(슬라이드) · `.botbar`(50~56px).
- 줌·팬: 상단 `−/%/+` + `Ctrl/⌘+휠`. 모두 프레임워크가 자동 처리.

## 색 토큰 (`:root`)
| 변수 | 값 | 의미 |
|---|---|---|
| `--primary` / `-d` / `-l` / `-ll` | `#0f766e` / `#0b5650` / `#d6efeb` / `#eafaf7` | 메인(틸) |
| `--accent` / `-l` | `#e08a1e` / `#fcefda` | 강조(앰버) — 질문/생각열기 |
| `--ok` / `-l` | `#10936b` / `#dcf3ea` | 정답·긍정(초록) — 핵심정리 |
| `--no` / `-l` | `#d6435f` / `#fbe2e8` | 오답·부정(빨강) |
| `--ink` / `--muted` / `--line` | `#15302c` / `#5d7470` / `#dbe7e4` | 본문 / 보조 / 경계선 |
| `--bg` / `--bg2` / `--surface` | `#eef4f3` / `#e3eeec` / `#fff` | 배경 / 카드면 |
| `--atomN` / `--atomO` / `--no2` | `#2f6fb0` / `#c0392b` / `#9a3412` | 원자 색(질소·산소·NO₂) |

## 단원 공통 색 언어 (일관성 필수, README §24)
- **흡열 / 냉각 / 붉은 계열**: 글자 `#a31d36` · 배경 `#fde7ec` · 칩 `#d6435f` → CSS `.flowrow.red`
- **발열 / 가열 / 파란 계열**: 글자 `#2b7fb8` · 배경 `#e6f0f7` · 칩 `#2b7fb8` → `.flowrow.blue`
- **중간/연결(초록)**: `.flowrow.grn` 칩 `#2f9e6e`
> 흡열=빨강, 발열=파랑을 모든 단원에서 고정. 절대 뒤집지 말 것.

## 타이포
- 본문 폰트 **Pretendard**(CDN: `cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/...`).
- 변수·수식은 세리프 이탤릭: `<span class="var">K</span>` (Georgia).
- 투사 가독성을 위해 본문을 키움. `.slide.single`은 여백이 크므로 더 크게(전용 규칙 내장).

## 핵심 클래스 카탈로그
- 레이아웃: `slide` · `slide single` · `col-l` · `col-r` · `card` · `card tight`
- 라벨 태그: `tag q`(생각 열기·앰버) · `tag sim`(시뮬레이션·틸) · `tag sum`(핵심 정리·초록)
- 텍스트: `kicker`(+`.n`) · `title` · `sub` · `ask`(+`.hl` 형광) · `helper` · `note`
- 정리 목록: `sumlist > li > span.b + div`
- 버튼: `btn primary` · `btn ghost`(+`.done` 활성) · `btn sm`
- 평가: `oxbox` · `oxq`(+`.lab`) · `choices` · `choice`(+`.mk`) · `fb`(+`good`/`bad`) · `scoreband`(`#scoreNum`/`#scoreMsg`)
- 단계 풀이: `steps > step(클릭 펼침) > sh / sb`
- 게이팅: `revealwrap > revealbtn[data-reveal]` + `card summary#id`
- 미터/슬라이더: `kmeter` · `balloon` · `circ react`/`circ prod` · `slider`(+`.spd` 속도)
- 시뮬 부속: `simrow` · `readout > rdchip` · `graphbox > canvas` · `glegend`
- 사례 학습 헤더: `hgroup`(+`.fx`) · `qchip` · `hbadge` · `meters > meter`
- 칩 흐름: `flowrow`(`.red`/`.blue`/`.grn`) > `fbadge` + `farr` + `fchip`, 결론 `sumconc`
- 마인드맵: `mindmap` · `mm-center` · `mm-cols` · `mm-branch` · `mm-h`(`.b02`/`.b03`) · `mm-node`(`.ok`/`.mid`/`.no`)
- 사진: `figure`(+`.contain`) > `img` + `figcap`(+`.src` 출처) · `photogrid`
- 표: `tbl`(셀 `res`, 강조 `hi`, 잠금 `lkcell > .ans` / 행 `.lcopen`)

## 화학 표기 규칙 (README §6·27)
- 아래첨자 `H<sub>2</sub>O`, 위첨자/전하 `Na<sup>+</sup>` (sub/sup 위치 CSS 보정됨).
- 변수 이탤릭 `<span class="var">K</span>`. 분수는 `/` 대신 **분수 꼴** `<span class="frac"><span class="top">…</span><span class="bar"></span><span class="bot">…</span></span>`.
- 기호 그대로: `⇌ → ← ↑ ↓ × ÷ ≈ ≤ ≥ ℃`.
- 농도는 **대괄호 `[ ]`**(교과서식). `c( )` 등 미학습 표기 금지.
- 부등호를 글자로 쓸 땐 `&lt; &gt;`.

## 한국어 줄바꿈 (README §20)
- 본문 클래스에 `word-break:keep-all`(템플릿 반영). 끊기면 안 되는 식·구절은 `<span style="white-space:nowrap">…</span>`.

## 프레임워크가 자동 처리 (건드리지 않음)
- 네비(점·이전/다음·키보드 ←→), 제목·페이지수(`data-title`), 줌, 세로 가운데 정렬, letterbox.
- 슬라이드 첫 진입 시 `data-init="함수명"` 1회 실행. `reveal()`·`check()`는 전역 헬퍼.
