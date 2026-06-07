# 수업 자료 제작 가이드

이 폴더의 `lesson_template.html` 은 **16:9 인터랙티브 수업 슬라이드**를 만드는 재사용 틀입니다.
화학 평형 수업에서 쓰던 디자인·네비게이션·줌·화학 표기·시뮬레이션 패턴을 그대로 담았습니다.
새 수업은 **이 템플릿을 복사한 뒤 슬라이드 내용만 채우면** 됩니다.

---

## 0. Claude Code에서 빠르게 쓰는 법

1. 이 폴더(`lesson_template.html`, `README_수업제작_가이드.md`, 그리고 참고용 완성본 `equilibrium_lesson_16x9.html`)를 작업 폴더/저장소에 둡니다.
2. 새 수업을 만들 때 Claude Code에 이렇게 요청하세요:
   > "`lesson_template.html` 을 복사해서 `acid_base.html` 을 만들고, 산-염기 단원으로 채워줘. 틀(디자인·네비게이션·줌)은 그대로 두고 슬라이드 내용과 시뮬레이션만 새로 작성해. README 규칙을 따라줘."
3. Claude가 README의 규칙대로 슬라이드를 추가/교체합니다. 검증은 `node --check`(아래 11번).

> 한 파일에 모든 게 들어있는 단일 HTML이라, 만든 파일을 그대로 브라우저로 열거나 LMS·드라이브에 올려 공유할 수 있습니다.

---

## 1. 파일 한눈에 보기

`lesson_template.html` 한 파일은 세 부분입니다.

```
<head><style> … </style></head>   ← 디자인(거의 수정 안 함)
<body>
  <div class="viewport">…<div class="stage" id="main">  ← 여기에 슬라이드를 넣음
      <section class="slide" …>  …  </section>           ← 슬라이드 1장 = section 1개
  …
  <script> … </script>            ← 프레임워크(네비/줌/헬퍼) + 예시 인터랙션
</body>
```

**대부분의 작업은 `<div class="stage" id="main"> … </div>` 안의 `<section>` 들만 편집**하면 됩니다.
제목·진행 점·페이지 수·이전/다음·줌은 모두 자동입니다.

---

## 2. 슬라이드 추가하기

슬라이드 1장 = `<section class="slide">` 1개. 순서대로 놓으면 그 순서로 진행됩니다.
`data-title` 만 적으면 하단 라벨과 진행 점 개수가 자동으로 잡힙니다(JS 수정 불필요).

### (a) 단일 컬럼 (도입·마무리·설명용)

```html
<section class="slide single" data-title="제목">
  <div>
    <span class="kicker"><span class="n">★</span> 라벨</span>
    <h1 class="title">큰 제목</h1>
    <p class="sub">부제/설명</p>
    <div class="card"> … 내용 … </div>
  </div>
</section>
```

### (b) 2단 컬럼 (질문 + 시뮬레이션)  ← 가장 많이 쓰는 형태

```html
<section class="slide" data-title="제목" data-init="myInit">
  <div class="col-l">  <!-- 왼쪽: 질문 + (활동 후) 핵심 정리 -->
    <span class="kicker"><span class="n">1</span> 소단원</span>
    <h1 class="title">핵심 질문</h1>
    <div class="card"><span class="tag q"><i class="dotmark"></i> 생각 열기</span>
      <p class="ask">…질문…</p><p class="helper">…안내…</p></div>
    … (핵심 정리 펼치기 블록, 3번 참고) …
  </div>
  <div class="col-r">  <!-- 오른쪽: 시뮬레이션/활동 -->
    <div class="card"><span class="tag sim"><i class="dotmark"></i> 시뮬레이션 · 직접 조작</span>
      … 시뮬레이션 … </div>
  </div>
</section>
```

**수업 흐름 권장:** 왼쪽 `발문(질문)` → 오른쪽 `시뮬레이션` → (버튼으로) `핵심 정리`.
**모든 시뮬레이션은 오른쪽(col-r)** 에, 질문/확인/정리는 왼쪽(col-l)에 두면 균형이 좋습니다.

> 세로 여백은 자동으로 가운데 정렬됩니다. 콘텐츠가 적은 슬라이드도 휑하지 않게 균형이 잡힙니다.
> 콘텐츠가 화면보다 길면 그 칸만 스크롤됩니다 → 되도록 한 화면에 들어오게 양을 조절하세요.

---

## 3. 핵심 정리 "활동 후 펼치기" (게이팅)

정답(정리)을 처음부터 보여주지 않고, 활동 후 버튼으로 펼치게 합니다.

```html
<div class="revealwrap">
  <button class="revealbtn" onclick="reveal(this)" data-reveal="sumA">
    <span class="rdot"></span> 시뮬레이션·활동을 마친 뒤 — 핵심 정리 보기 ↓
  </button>
</div>
<div class="card tight summary" id="sumA">
  <span class="tag sum"><i class="dotmark"></i> 핵심 정리</span>
  <ul class="sumlist">
    <li><span class="b">1</span><div>정리 1</div></li>
    <li><span class="b">2</span><div>정리 2</div></li>
  </ul>
</div>
```

- `data-reveal="sumA"` 의 값과 펼칠 카드의 `id="sumA"` 만 맞추면 됩니다. (슬라이드마다 다른 id 사용: sumA, sumB, …)
- `class="… summary"` 카드는 기본 숨김, 버튼을 누르면 나타납니다.

---

## 4. 형성평가 / 오개념 점검

```html
<div class="oxbox" style="border-style:solid;border-color:var(--line)">
  <div class="oxq"><span class="lab" style="background:var(--primary)">Q1</span> 질문?</div>
  <div class="choices">
    <button class="choice" onclick="check(this,false,'q1fb','오답 해설')"><span class="mk">①</span> 보기1</button>
    <button class="choice" onclick="check(this,true ,'q1fb','정답! 해설')"><span class="mk">②</span> 보기2</button>
  </div>
  <div class="fb" id="q1fb"></div>
</div>
<!-- 점수판(선택) -->
<div class="scoreband"><div class="sc" id="scoreNum">0 / 1</div><span id="scoreMsg">문항을 풀어 보세요.</span></div>
```

- `check(this, 정답여부(true/false), '피드백id', '메시지(HTML 가능)')`
- 정답/오답 색, 잠금, 피드백, 점수(`#scoreNum`)가 자동 처리됩니다.
- 여러 문항이면 `choices`·`fb`·id(q1fb, q2fb, …)를 늘리면 됩니다. 점수 분모는 그 슬라이드의 문항 수로 자동 계산됩니다.
- O/X 점검도 같은 `check()` 로 만듭니다(보기를 O/X 두 개로).

---

## 5. 시뮬레이션 추가하기

슬라이드 `<section>` 에 `data-init="함수이름"` 을 적고, `<script>` 안에 그 함수를 정의하면
**그 슬라이드가 처음 열릴 때 1회 실행**됩니다. (이미 열린 슬라이드는 다시 실행 안 됨)

### 패턴 A) 슬라이더 → 시각 변화 (템플릿의 `initMeter` 예시)

```html
<input class="slider" id="exSlider" type="range" min="0" max="100" value="50" oninput="updMeter()">
```
```js
function initMeter(){ updMeter(); }      // data-init 으로 최초 1회
function updMeter(){ const v=+document.getElementById('exSlider').value; /* …크기/텍스트 갱신… */ }
```

### 패턴 B) 입력값 → 계산 결과 (계산기)

```html
<div class="calcgrid">
  <div class="field"><label>값 x</label><input id="exX" type="number" step="0.01"></div>
  <div class="field"><label>값 y</label><input id="exY" type="number" step="0.01"></div>
</div>
<div class="ctrls" style="justify-content:flex-start;margin-top:12px">
  <button class="btn primary sm" onclick="exCalc()">계산하기</button>
</div>
<div class="result" id="exResult" style="display:none"></div>
```
```js
function exCalc(){ const x=+document.getElementById('exX').value; /* … */
  const box=document.getElementById('exResult'); box.style.display='block'; box.innerHTML='결과 = <b>…</b>'; }
```

### 패턴 C) 캔버스 애니메이션 (입자·그래프 등)

```html
<div class="vessel"><canvas id="myCanvas"></canvas></div>
```
```js
function initAnim(){ requestAnimationFrame(loop); }   // data-init="initAnim"
function loop(){
  const {ctx,w,h}=fitCanvas(document.getElementById('myCanvas'));  // 확대 배율 자동 보정
  ctx.clearRect(0,0,w,h);
  // … 그리기 …
  requestAnimationFrame(loop);
}
```

> **반드시 `fitCanvas(canvas)` 를 써서** `ctx,w,h` 를 받으세요. 화면 확대/축소·고해상도(레티나)에서도 또렷하게 그려집니다.
> 원자 여러 개를 그릴 땐 원마다 `ctx.beginPath()`로 그려야 연결선 같은 잔상이 안 생깁니다.

---

## 6. 화학식 · 수식 표기 규칙

- 아래첨자: `H<sub>2</sub>O`,  위첨자/전하: `Na<sup>+</sup>`, `[NO<sub>2</sub>]<sup>2</sup>`
  (sub/sup 위치 보정이 CSS에 들어 있어 정확히 아래/위로 나옵니다.)
- 변수는 이탤릭으로: `<span class="var">K</span>`, `<span class="var">Q</span>`, 계수 `<span class="var">a</span>`
- 자주 쓰는 기호(그대로 입력): 가역반응 `⇌`, 화살표 `→ ← ↑ ↓`, 곱 `×`, 나눗셈 `÷`, 근사 `≈`, 부등호 `≪ ≫ ≤ ≥`, 섭씨 `℃`
- **분수는 "/" 대신 분수 꼴**로:

```html
<span class="var">K</span> =
<span class="frac">
  <span class="top">[C]<sup>c</sup>[D]<sup>d</sup></span>
  <span class="bar"></span>
  <span class="bot">[A]<sup>a</sup>[B]<sup>b</sup></span>
</span>
```
(가운데 정렬·큰 분수는 `keq` 컨테이너로 감싸면 됩니다. 완성본 `equilibrium_lesson_16x9.html` 의 평형 상수 슬라이드 참고.)

---

## 7. 디자인 토큰 & 자주 쓰는 클래스

색은 `:root` 의 CSS 변수로 통일되어 있습니다. 가능하면 직접 색을 쓰지 말고 변수를 쓰세요.

| 변수 | 의미 |
|---|---|
| `--primary` / `--primary-d` / `--primary-l` / `--primary-ll` | 메인(틸) 계열 |
| `--accent` / `--accent-l` | 강조(앰버) |
| `--ok` / `--ok-l` | 정답·긍정(초록) |
| `--no` / `--no-l` | 오답·부정(빨강) |
| `--ink` / `--muted` / `--line` | 본문/보조 글자/경계선 |

자주 쓰는 클래스:
- 레이아웃: `slide`, `slide single`, `col-l`, `col-r`, `card`, `card tight`
- 라벨 태그: `tag q`(생각 열기), `tag sim`(시뮬레이션), `tag sum`(핵심 정리)
- 텍스트: `kicker`, `title`, `sub`, `ask`, `helper`, `hl`(형광 강조), `note`
- 정리 목록: `sumlist` > `li` > `span.b` + `div`
- 버튼: `btn primary`, `btn ghost`, `btn sm`
- 평가: `oxbox`, `oxq`, `choices`, `choice`, `mk`, `fb`(+`good`/`bad`), `scoreband`
- 단계 풀이: `steps` > `step`(클릭 펼침) > `sh`/`sb`
- 칩/예시: `chips` > `chip`
- 미터: `kmeter`, `balloon`, `circ react`/`circ prod`, `kreadout`, `slider`
- 막대: `qkstage`, `bargrp`, `bar3d q`/`bar3d k`
- 마인드맵: `mindmap`, `mm-center`, `mm-cols`, `mm-branch`, `mm-h b02`/`b03`, `mm-node`(+`ok`/`mid`/`no`)
- 표: `tbl`(셀에 `res`, 강조 `hi`)

---

## 8. 자동으로 되는 것 (건드릴 필요 없음)

- **네비게이션**: 진행 점 클릭, 이전/다음 버튼, 키보드 `←` `→`
- **제목/페이지수**: `data-title` 로 자동 표시
- **확대/축소**: 상단 가운데 `− / % / +` 버튼, `Ctrl(⌘)+휠`(트랙패드 핀치). 확대 시 스크롤로 이동.
- **세로 정렬**: 콘텐츠 양에 맞춰 가운데 정렬(여백 균형)
- **화면 맞춤**: 16:9 무대가 창 크기에 letterbox로 맞춰짐

---

## 9. 검증 (만든 뒤 확인)

```bash
# 1) JS 문법 검사: <script> 안의 코드를 뽑아 검사
python3 - <<'PY'
import re; h=open('my_lesson.html',encoding='utf-8').read()
open('_chk.js','w').write(re.search(r'<script>(.*)</script>',h,re.S).group(1))
PY
node --check _chk.js && echo OK
```

- 브라우저로 직접 열어 **각 슬라이드가 한 화면에 들어오는지**(스크롤 없는지), 화학식 첨자, 시뮬레이션 동작을 확인하세요.
- 시뮬레이션 수치는 작은 노드 스크립트로 미리 계산해 검증하면 오류가 줄어듭니다.

---

## 10. 자주 하는 실수 / 주의

- `data-reveal` 의 값과 정리 카드 `id` 가 슬라이드마다 **중복되지 않게**(sumA, sumB, …).
- 형성평가 피드백 id(q1fb, q2fb, …)도 **중복 금지**.
- `data-init` 함수 이름은 전역(window)에 정의해야 호출됩니다(평범한 `function 이름(){}`이면 됨).
- 분수·첨자 안에서 `<` `>` 부등호를 글자로 쓸 땐 `&lt;` `&gt;` 사용(HTML 깨짐 방지).
- 한 슬라이드에 너무 많이 담지 말 것 — 안 들어가면 그 칸만 스크롤됩니다.
- **화학 반응식 계수 확인**: 예) `2NO₂ ⇌ N₂O₄`, `Cr₂O₇²⁻+H₂O ⇌ 2CrO₄²⁻+2H⁺`. 제목·표·마인드맵 등 여러 곳에 같은 식을 쓰므로 **계수를 빠뜨리지 않았는지** 전부 점검.
- **한국어 줄바꿈(외톨이 글자)**: 좁은 박스에서 "…이동"의 "동" 한 글자만 줄 넘어가는 현상 → 박스에 `word-break:keep-all` 적용(이미 `.qkverdict`에 반영) + 문구를 짧게.
- **수치는 연속값으로 표시**: 입자 "개수"를 `round()` 정수로만 보여주면 평형 부근에서 *개수는 그대로인데 Q만 변하는* 불일치가 생김. 계산값(Q)에 쓰는 농도는 **연속값(소수)** 으로 표시해 그래프·칩·Q를 일치시킬 것.
- **RAF 루프는 보일 때만**: 시뮬 루프에서 `if(cv.offsetParent!==null)` 로 *현재 슬라이드일 때만* 계산/그리기(숨은 슬라이드 낭비 방지).

---

## 11. 참고 완성본

- `equilibrium_lesson_16x9.html` — 1세대 예시(화학 평형). 동적 평형 입자 애니메이션, 평형 상수 식 빌더, Q vs K 분수·화살표, 마인드맵.
- `concentration_pressure_lesson.html` — **2세대 예시(화학 평형 이동)**. 아래 12~16장의 패턴(입자 모형+시간 그래프+속도/일시정지/초기화+평형 상수 Q/K 패널)이 모두 적용된 **최신 레퍼런스**. 새 시뮬을 만들 때 이 파일의 농도·압력 슬라이드를 베껴 쓰는 것이 가장 빠릅니다.

---

## 12. 미시 입자 시뮬레이션 (동적 변화 보여주기)

"보이지 않는 분자 세계의 동적 변화"를 보여줄 때 쓰는 패턴. 헬퍼는 템플릿 `<script>` 에 이미 포함되어 있고, 예시 슬라이드(`initDemo`)를 복사해 변형하면 됩니다.

**핵심 헬퍼 (그대로 호출)**
| 함수 | 용도 |
|---|---|
| `pSeed(type)` | 입자 1개 생성(랜덤 위치/속도, `type` 문자열) |
| `pMove(p, xmin, xmax)` | 입자 이동·벽 반사(0~1 정규좌표). 일시정지 시 호출 안 함 |
| `countType(arr,type)` / `pickIdx(arr,type)` | 특정 종류 개수 / 무작위 1개 인덱스 |
| `reconcile(arr,type,target,glowColor)` | 그 종류 개수를 `target` 으로 맞춤(추가/제거) |
| `drawMolecule(ctx,p,X,Y,s)` | 분자 그리기. **새 분자는 이 함수 분기에 추가**(A·B 일반구, NO₂·N₂O₄·Cr₂O₇²⁻·CrO₄²⁻·H⁺ 예시 내장) |
| `atom/ball` | 원자(하이라이트 원)·단색 구 그리기 |

**구성 골격** (예시 `initDemo`/`demoLoop` 참고)
```js
let sim=null;
function simInit(){ const s=sim&&sim.started; sim={run:true,speed:0.4,started:s}; simBuild();
  if(!sim.started){ sim.started=true; requestAnimationFrame(simLoop); } }   // data-init="simInit"
function simLoop(){
  const cv=document.getElementById('simCanvas');
  if(sim&&cv&&cv.offsetParent!==null){               // 현재 슬라이드일 때만
    if(sim.run){ /* dt=(1/60)*sim.speed 로 반응(전환) 진행 + 이력 기록 */ }
    const {ctx,w,h}=fitCanvas(cv); ctx.clearRect(0,0,w,h);
    const s=Math.min(w/240,h/150), pad=9;
    for(const p of sim.p){ if(sim.run)pMove(p,0.05,0.95); drawMolecule(ctx,p,pad+p.x*(w-2*pad),pad+p.y*(h-2*pad),s); }
  }
  requestAnimationFrame(simLoop);
}
```
> **반응 속도(kinetics)** 는 `Rf=kf·[반응물], Rr=kr·[생성물]` 식으로 누적(`acc+=R·dt`)해 1 이상이면 입자 1개 전환. 평형 상수 `K=kf/kr`. 상수는 작은 노드 스크립트로 미리 검증(평형값·이동 방향)하면 실수가 적습니다.

---

## 13. 시간 그래프 (`lineGraph`)

교과서식 "시간에 따른 농도/개수" 그래프. 변화가 잘 보이게 **세로축을 길게**(2단 배치에서 `align-items:stretch`로 칸 높이에 맞춤) 쓰는 걸 권장.

```html
<div class="graphbox" style="height:100%;min-height:170px">
  <span class="glabel">세로: 개수 · 가로: 시간</span>
  <canvas id="myGraph" style="width:100%;height:100%"></canvas>
</div>
```
```js
let hA=[], hB=[];                              // 이력 배열(초기 seed 2~3개 넣으면 시작부터 보임)
pushHist(hA, 값);                              // 매 몇 프레임마다 기록(cap 기본 200, 슬라이딩)
lineGraph(myGraphCanvas, [{data:hA,color:'#37d39e'},{data:hB,color:'#e8a23a'}], ymax);
```
- 끝점 **현재값 라벨**이 자동 표시되고, 두 선이 가까우면 **세로 간격을 벌려 겹침 방지**. 작은 값(농도)은 유효숫자로 표기.
- **그래프와 칩·계산이 같은 값**이어야 함(§10의 "연속값" 주의).

---

## 14. 시뮬레이션 컨트롤 · 수치 칩

학생이 능동적으로 조작하도록 **속도·일시정지·초기화·변수 조절**을 붙이고, 변화 수치는 항상 칩으로 표기.

```html
<!-- 속도 슬라이더(0.05×~2.0×, 기본 0.40×) + 일시정지 + 초기화 -->
<div class="simrow">
  <span class="slabel">속도</span>
  <input class="slider spd" id="xSpeed" type="range" min="5" max="200" value="40" oninput="xSpeed()">
  <span class="simval" id="xSpeedV">0.40×</span>
  <button class="btn ghost sm" onclick="xToggle()" id="xPlay">⏸</button>
  <button class="btn primary sm" onclick="xReset()">↺ 초기화</button>
</div>
<!-- 수치 칩(항상 표시) -->
<div class="readout">
  <span class="rdchip"><span class="cdot" style="background:#e7c200"></span> 이름 <b id="xN">0</b></span>
</div>
```
```js
function xSpeed(){ sim.speed=(+document.getElementById('xSpeed').value)/100; document.getElementById('xSpeedV').textContent=sim.speed.toFixed(2)+'×'; }
function xToggle(){ sim.run=!sim.run; document.getElementById('xPlay').textContent=sim.run?'⏸':'▶'; }
```
- **속도**는 `dt=(1/60)*sim.speed` 로 반응 진행에 곱함. 기본을 느리게(0.40×) 두고 빠르게도 가능.
- 반짝이는 글로우 효과는 산만하면 빼는 게 깔끔(매 프레임 `p.glow=0` 으로 끔).

---

## 15. 평형 상수 / 반응 지수 패널

"조건 변화 → Q가 K에서 벗어났다가 다시 K로 복귀, **K는 불변**"을 숫자로 보여주는 패널(완성본의 농도·압력 슬라이드 참고).

- 분수식 `Q,K = [생성물]/[반응물]` (`.frac` 사용) + 라이브 `Q`·`K(고정)` 값 + 대입 칩.
- **Q는 표시 칩과 같은 값으로 계산**(연속값). `Q<K→정반응 / Q>K→역반응 / Q=K→평형` 색·문구.
- **상댓값 vs 실제값**: 모형 단순화로 임의 단위를 쓰면 *"※ 이해를 돕기 위한 상대적인 값"* 을 명시. 실제 평형 상수를 반영할 땐 표시 농도를 실제 단위(mol/L)로 환산하고 *"25 °C 실제값 Kc ≈ …"* 를 적기(예: 2NO₂⇌N₂O₄ 의 Kc ≈ 1.6×10²).

---

## 16. 투사 가독성 · 레이아웃

- **글자 크기**: 빔프로젝터 뒷자리 기준으로 본문을 키움(템플릿에 반영). 특히 **단일(single) 슬라이드**는 여백이 크므로 `.slide.single` 전용으로 더 키워 여백을 채움.
- **시뮬 슬라이드 2단 배치**: 오른쪽 칸(col-r) 안에서 다시 `display:grid; grid-template-columns:…; align-items:stretch` 로 **[그래프 | 수치·평형식·컨트롤]** 2단을 만들면 그래프가 칸 높이에 맞춰 길어져 변화가 잘 보임. 조작 버튼은 2단 아래 전체 폭으로 빼면 깔끔.
- **세로 넘침 점검**: 각 칸이 화면을 넘지 않는지 `col.scrollHeight > col.clientHeight` 로 확인(아래 검증).

---

## 17. 검증 루틴 (만든 뒤)

1. **JS 문법**: §9 방식으로 `<script>` 추출 후 `node --check`.
2. **세로 넘침 0**: 브라우저 콘솔/평가로 각 슬라이드 칸 확인 —
   `[...document.querySelectorAll('.slide .col-l,.slide .col-r')].some(c=>c.scrollHeight>c.clientHeight+3)` 가 `false` 여야 함(single 슬라이드는 슬라이드 자체로 확인).
3. **콘솔 오류 0**: 모든 슬라이드를 한 번씩 열어 본 뒤 콘솔에 error 없는지.
4. **시뮬 수치 검증**: 평형값·이동 방향·Q→K 복귀를 작은 노드 스크립트로 미리 계산해 화면 표시와 대조.
5. 빔프로젝터로 띄워 **글자 크기/첨자/계수**를 눈으로 최종 확인.

## 18. 토글 reveal (핵심 정리 펼치기/접기)
- 버튼: `<button class="revealbtn" onclick="reveal(this)" data-reveal="대상id"><span class="rdot"></span> 핵심 정리 보기 <span class="ra">↓</span></button>`
- `reveal()`은 **토글**(다시 누르면 접힘)이며 `.ra` 안의 화살표를 `↓↑`로 뒤집는다. (구버전의 단방향 reveal을 대체)
- col 칸은 `overflow:auto`라 펼침 시 소량 스크롤은 허용. 펼친 상태가 화면을 넘으면 위쪽 카드 텍스트를 줄여 약 50px 이내로 맞춘다.

## 19. 선택 토글 버튼 활성 표시 (`.btn.ghost.done`)
- 흡열/발열, 자료 A/B 전환처럼 **현재 선택**을 보여줄 때: JS에서 `el.classList.toggle('done', 선택여부)`.
- 스타일은 템플릿에 포함(`.btn.ghost.done` = 청록 배경+흰 글씨+그림자).
- ⚠️ **함정**: 일부 렌더링 엔진은 `background:var(--…)` **단축 속성** 안의 `var()`를 무효 처리한다. 활성 배경은 반드시 **`background-color:var(--…)` 롱핸드**로 지정할 것.

## 20. 한국어 줄바꿈 (어절 단위)
- 본문이 **글자 단위**로 끊기지 않도록 `word-break:keep-all`을 본문 클래스 전반(`.ask,.helper,.note,.sub,.sumlist li,.tbl td …`)에 적용(템플릿 반영됨).
- 끊기면 안 되는 화학식/구절은 `<span style="white-space:nowrap">…</span>`로 묶는다.

## 21. 그래프 점 값 라벨 — 선과 겹침 방지 (`chipLabel`)
- 데이터 점 옆 수치가 **선 위에 겹쳐** 안 보이는 문제 방지용 헬퍼(템플릿 `chipLabel`).
- 점 위로만 띄우면 **가파른 선**에서 라벨 옆부분이 선에 닿음 → **선의 법선(위쪽) 방향으로** 약 20px 띄우고 **흰 배경 칩**을 깐다.
- 사용: 각 점에서 이웃 점으로 접선 `tan={dx,dy}`를 만들어 `chipLabel(ctx, px, py, text, tan, x0,x1,y0,y1, color)` 호출. 영역 경계로 자동 clamp.

## 22. 시뮬 수치 ↔ 화면 입자 일치 (필수 점검)
- **칩/표에 표시한 개수 = 캔버스에 실제로 그린 입자 수**여야 한다. 같은 상태값(예: 분율 `f`)에 **동일한 공식**을 쓰고, 표시용으로 따로 스케일(×0.45, 상한 등)하지 말 것.
- 점검: `co.p.filter(p=>p.type==='X').length` 와 칩 `textContent`를 eval로 대조.

## 23. 시뮬은 실제 데이터에 맞춘다 (제작 원칙)
- 시뮬 제작 전 **핵심 수치를 웹 검색·검증**하고, 가능하면 검증된 식을 그대로 사용:
  - 산소해리곡선 = **Hill 식** `S=P^n/(P50^n+P^n)`, P50≈26.6 mmHg, n≈2.7.
  - 기체 용해 = **헨리 법칙** `C ∝ P`(온도↑→용해도↓).
  - 평형 상수 온도 의존 = **van 't Hoff** `K=K₀·exp(−ΔH/R·(1/T−1/T₀))`.
- 절대값을 화면에 맞춰 단순화할 때는 **"상댓값"임을 슬라이드에 명시**하고, 경향·방향은 실제와 일치시킨다. 출처는 figcap `.src` 또는 단원 `출처.md`에 기록.
- **가능하면 상댓값 대신 실측 앵커를 쓴다**(아래 §29). 상댓값은 최후수단.

## 24. 핵심 정리·마무리는 "칩 흐름"으로 시각화 (서술식 금지)
- 핵심 정리/마무리/정리표는 **긴 문장 대신** 아이콘 + 화살표(→) + **색 칩** 흐름으로 표현한다. 학생이 인과 사슬을 한눈에 본다.
- 한 줄 형식: `[아이콘+조건 배지] → [중간(우세 반응 등)] → [결과 색 칩]`. 예:
  `🔥 가열 온도↑ → 흡열·정반응 → [파란색]`, `🔺 흡열 반응 온도↑ → [K 증가 ↑]`
- **단원 공통 색 언어**(일관성 필수): 흡열/냉각/붉은 계열 = `#a31d36`/배경 `#fde7ec`/칩 `#d6435f`, 발열/가열/파란 계열 = `#2b7fb8`/배경 `#e6f0f7`/칩 `#2b7fb8`.
- 보조 결론(예: "온도만 K를 바꾼다")은 흐름 아래 **한 줄 muted 요약**으로.
- 행 박스: `display:flex;align-items:center;gap:7px;flex-wrap:wrap;background:<tint>;border:1px solid <line>;border-radius:12px;padding:8px 11px;font-size:12.5px;font-weight:700`. 결과 칩: `background:<color>;color:#fff;border-radius:7px;padding:2px 10px`.

## 25. 데이터 그래프는 "MBL 측정"처럼 — 한 점씩 쌓이게
- 온도-K 등 데이터 탐구는 결과를 한꺼번에 띄우지 말고 **측정하듯 한 점씩** 표·그래프에 누적한다(센서 실험 느낌).
- **자동 시작 금지**: 슬라이드를 열면 "측정 대기" 상태. 버튼은 처음 **"측정 시작"** → 한 번이라도 측정하면 **"다시 측정"**으로 라벨 변경.
- 데이터셋 선택 버튼(흡열/발열 등)은 **선택만**(대기), 실행은 시작 버튼이 담당.
- 미측정 표 행은 흐리게(`·`), 방금 측정한 행은 강조. 그래프는 **축을 전체 범위로 고정**하고 점이 차오르게(최근 점 펄스 링). rAF 프레임 카운터로 일정 간격 reveal.
- 점 개수는 3개로 부족 → **실측 앵커 양끝 + van 't Hoff 보간**으로 6점 내외(§29).

## 26. 인터랙티브 예측 + "탐구하면 채워지는" 표
- 르샤틀리에 종합처럼 정리표는 **버튼으로 직접 예측**하게 만든다: 조건 버튼 → 평형 위치 마커 슬라이드 + 방향 화살표(펄스) + 결과(이동 방향·K) 표시.
- 우측 정리표의 답 칸은 처음엔 **흐리게(blur)+"?"로 잠금**, 해당 조건을 시도하면 그 행이 채워짐. 모든 조건을 시도하면 보충 노트가 나타남.
- 구체 예시 반응을 제시(추상 "반응물⇌생성물" 대신 `2A(g) ⇌ B(g)`처럼 **계수로 분자수 변화를 보여줌**). "기체 분자 수 감소" 같은 설명 문구는 식이 대신하므로 생략.

## 27. 표기는 학생이 배운 것만 (교과서 표기 우선)
- 농도는 **대괄호 `[ ]`**(교과서식)로 표기. `c( )` 같은 미학습 표기는 쓰지 않는다.
- 화학식의 `[ ]`(착이온)와 농도의 `[ ]`가 겹쳐도, 학생 익숙도를 우선해 대괄호로 통일(맥락으로 구분). 불필요한 주석("[ ]는 몰 농도" 등)은 군더더기이므로 생략.

## 28. 그래프 라벨은 흰 배경 칩 (선·숫자 겹침 금지)
- 데이터 점/끝값 라벨이 선 위에 겹쳐 안 보이지 않게 **반투명 흰 칩**(`rgba(255,255,255,.9)`)을 깐다.
- 점 라벨은 **법선 방향 오프셋**(`chipLabel`, §21), `lineGraph` 끝값 라벨도 흰 칩 배경 적용(템플릿 반영됨).

## 29. 시뮬은 "실측 앵커 + 표시값으로 검산 가능"하게
- 절대 K가 표현 가능하면 **실측값을 앵커**로: 예) CoCl₂ `K(25℃)=1.7×10⁻³`(U.Colorado/Purdue), 온도 의존은 van 't Hoff.
- **표시한 농도(mol/L)를 식에 그대로 넣으면 화면의 Q가 나오도록** 모형을 구성(평형에서 Q=K). "값이 안 맞는다"는 오개념을 원천 차단.
  - 방법: 평형 분율 `f`를 `Q(f)=K(T)` 이분법으로 풀고, 농도=`f·C_tot` 등으로 표시. 그래프·칩 단위(mol/L)도 일치시킴.
- 입자 그림과 정량 패널의 역할 분리: 과량 성분(예 Cl⁻)은 입자는 정성(소수)로, 정량은 패널 mol/L로.

## 30. 애니메이션·레이아웃 함정
- **스크롤바 깜빡임**: `transform:scale` 펄스를 **전체 폭 블록**에 주면 순간적으로 칼럼을 넘쳐 가로/세로 스크롤바가 깜빡인다 → 펄스는 **inline 요소**에만 주고, **고정 높이 + `overflow:hidden`** 컨테이너로 감싼다.
- **2단 카드 높이 정렬**: 좌·우 카드 바닥을 맞추려면 칼럼을 `display:flex;flex-direction:column` + 카드 `flex:1`. 표로 카드를 채우려면 표를 `flex:1` 래퍼에 넣고 `table{height:100%}`(행이 늘어 빈 여백 제거).
- single/2단 모두 펼침·완성 등 **모든 상태에서 넘침 0**을 eval로 확인.
