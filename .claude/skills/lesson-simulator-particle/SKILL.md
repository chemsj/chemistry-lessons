---
name: lesson-simulator-particle
description: 사용 시점 — 슬라이드에 "보이지 않는 분자 세계의 동적 변화"(가역 반응·평형 이동·용해 등)를 입자로 보여주는 캔버스 시뮬레이션을 넣을 때. data-init + RAF 루프로 입자가 움직이고 종류가 전환되는 미시 모형을 만들 때 참조.
---

# 입자 시뮬레이션 (미시 모형 캔버스)

보이지 않는 분자 세계의 동적 변화를 입자로 보여주는 캔버스 시뮬. 가역 반응(`A ⇌ B`), 평형 이동, 용해 등 "정·역반응이 동시에 일어나는 동적 상태"를 학생이 눈으로 보게 한다. 토큰·클래스는 [design-system](../references/design-system.md) 참고.

## 어디에 두나
- 시뮬은 **항상 오른쪽 `col-r`** (질문/확인/정리는 `col-l`). 2단 슬라이드는 [[lesson-slide-2col]], 사례 학습 단일은 [[lesson-slide-single]].

## 패턴
1. `references/sim-helpers.js` 블록을 **수업 `<script>` 안(data-init 함수들 위)에 먼저 붙여넣는다.** `fitCanvas()`는 덱 골격이 이미 제공하므로 포함하지 않는다.
2. `<canvas>` + 수치 칩(`.readout > .rdchip`) + 속도/일시정지/초기화 컨트롤(`.simrow`)을 둔다.
3. `data-init="initX"`로 1회 시작, RAF 루프는 `cv.offsetParent!==null`(현재 슬라이드)일 때만 계산·그리기.

동역학: `Rf=kf·[반응물]`, `Rr=kr·[생성물]`을 `acc+=R·dt`(`dt=(1/60)*speed`)로 누적해 `acc≥1`이면 입자 1개 전환. 평형 상수 `K=kf/kr`. 새 분자 모양은 `drawMolecule()` 분기에 추가.

```html
<div class="col-r">
  <div class="card">
    <span class="tag sim"><i class="dotmark"></i> 미시 모형 + 그래프</span>
    <div style="display:grid;grid-template-columns:1.05fr 1fr;gap:11px;align-items:stretch">
      <div style="position:relative;height:100%;min-height:170px;background:#0f201d;border-radius:12px;overflow:hidden"><canvas id="myCanvas" style="position:absolute;inset:0;width:100%;height:100%"></canvas></div>
      <div class="graphbox" style="height:100%;min-height:170px"><span class="glabel">세로: 개수 · 가로: 시간</span><canvas id="myGraph" style="width:100%;height:100%"></canvas></div>
    </div>
    <div class="readout">
      <span class="rdchip"><span class="cdot" style="background:#2bb894"></span> A <b id="myNA">0</b></span>
      <span class="rdchip"><span class="cdot" style="background:#e0922a"></span> B <b id="myNB">0</b></span>
    </div>
    <div class="simrow">
      <span class="slabel">속도</span>
      <input class="slider spd" id="mySpeed" type="range" min="5" max="200" value="40" oninput="mySpeedSet()">
      <span class="simval" id="mySpeedV">0.40×</span>
      <button class="btn ghost sm" onclick="myToggle()" id="myPlay">⏸</button>
      <button class="btn primary sm" onclick="myReset()">↺ 초기화</button>
    </div>
  </div>
</div>
```
`simInit`/`simLoop` 골격은 `references/sim-helpers.js` 상단 주석에 있다.

## 정확성 규칙 (필수)
- **표시 개수 = 캔버스에 그린 입자 수 = 그래프 = Q**가 같은 값. 표시용으로 따로 스케일하지 말 것.
- Q에 쓰는 농도는 **연속값(소수)** 으로 — 정수 `round()`만 쓰면 평형 부근에서 "개수는 그대로인데 Q만 변하는" 불일치가 생긴다.
- 수치는 **실측 앵커**에 맞춘다(상댓값은 최후수단·"상댓값" 명시). 속도 슬라이더는 동역학 전체에 곱해질 것.

관련: [[lesson-graph]] · [[chem-pedagogy-guidelines]]
