---
name: lesson-graph
description: 사용 시점 — 슬라이드에 "시간에 따른 농도/개수" 변화를 교과서식 꺾은선 그래프로 보여줄 때. 시뮬 진행에 맞춰 값이 한 점씩 쌓이는 시간 그래프(lineGraph)를 캔버스에 그릴 때 참조.
---

# 시간 그래프 (lineGraph)

시간에 따른 농도/개수 변화를 꺾은선으로 보여주는 그래프. 시뮬레이션 진행에 맞춰 값을 누적해 변화를 한눈에 보게 한다. 토큰·클래스는 [design-system](../references/design-system.md) 참고. `lineGraph`/`pushHist` 헬퍼는 [[lesson-simulator-particle]]의 `references/sim-helpers.js`에 함께 들어 있다.

## 어디에 두나
- 입자 시뮬과 짝으로 `col-r` 또는 사례 학습 단일 슬라이드의 우측 칸. 2단 배치에서는 `align-items:stretch`로 칸 높이를 채워 세로축을 길게 → 변화가 잘 보인다.

## 패턴
1. `.graphbox > canvas`를 둔다.
2. 매 몇 프레임마다 `pushHist(arr, 값)`으로 이력 배열에 기록(cap 기본 200, 슬라이딩). 초기 seed 2~3개를 넣으면 시작부터 보인다.
3. `lineGraph(cv, [{data,color},...], ymax)` 호출.

```html
<div class="graphbox" style="height:100%;min-height:170px">
  <span class="glabel">세로: 개수 · 가로: 시간</span>
  <canvas id="myGraph" style="width:100%;height:100%"></canvas>
</div>
```
```js
let hA=[], hB=[];                              // 이력 배열(시작 seed 2~3개 권장)
pushHist(hA, 값);                              // 매 몇 프레임마다 기록
lineGraph(document.getElementById('myGraph'),
  [{data:hA,color:'#2bb894'},{data:hB,color:'#e0922a'}], ymax);
```

## 주의
- 끝점 **현재값 라벨**이 자동으로 흰 칩 위에 그려지고, 두 선이 가까우면 세로 간격을 벌려 겹침을 방지한다. 작은 값(농도)은 유효숫자로 표기.
- **그래프 = 수치 칩 = Q 계산이 같은 값**이어야 한다(연속값 주의 → [[chem-pedagogy-guidelines]]).
- 데이터 탐구는 한꺼번에 띄우지 말고 "측정하듯" 한 점씩 누적(자동 시작 금지).

관련: [[lesson-simulator-particle]]
