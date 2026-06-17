---
name: lesson-activity-types
description: 사용 시점 — 슬라이드에 "어떤 탐구 활동 요소를 넣을지" 고를 때. blueprint·slide-compose 단계에서 실험사진·입자 시뮬·그래프·POE·슬라이더·계산기·이해도 체크 중 무엇을 쓸지 결정할 때 참조하는 활동 유형 팔레트.
---

# 탐구 활동 유형 팔레트

슬라이드에 넣을 탐구 활동의 7가지 유형. blueprint·slide-compose가 "어떤 요소를 쓸지" 고를 때 이 표를 참조한다. 토큰·클래스는 [design-system](../references/design-system.md) 참고.

| 유형 | 한 줄 용도 | 권장 배치 | 대표 클래스/요소 |
|---|---|---|---|
| 실험사진 | 실제 현상·실험 장면을 사진으로 제시(관찰의 출발점) | col-r 또는 single | `figure`(+`.contain`) > `img` + `figcap`(+`.src` 출처), `photogrid` |
| 입자 시뮬 ([[lesson-simulator-particle]]) | 보이지 않는 분자 세계의 동적 변화를 입자로 | col-r | `<canvas>`, `.readout > .rdchip`, `.simrow` |
| 데이터/그래프 ([[lesson-graph]]) | 시간에 따른 농도/개수 변화. MBL식 한 점씩 누적(README §25) | col-r 또는 single 우측 | `.graphbox > canvas`, `lineGraph`/`pushHist` |
| 예측-관찰-설명(POE) | 예측 → 시뮬 관찰 → reveal 정리로 오개념 직면 | 2col(좌 예측·정리 / 우 시뮬) | `.oxbox`/버튼 예측 + 시뮬 + `revealbtn` |
| 슬라이더 미터 | 변인을 직접 조작해 크기·비율 변화를 즉시 봄 | col-r | `.kmeter`, `.balloon`, `circ react`/`circ prod`, `.slider` |
| 계산기 | 입력값 → 계산 결과(평형식·수율 등) | col-r | `.calcgrid > .field`, 버튼 → `.result` |
| 이해도 체크 ([[lesson-comprehension-check]]) | 객관식 형성평가·오개념(O/X) 점검 | col-r 또는 single 2×2 | `.oxbox`/`.choices`/`.choice` `check()`, `.scoreband` |

## 고를 때
- 흐름은 항상 `발문 → 활동(위 유형) → reveal 정리`([[lesson-reveal-gate]]). 시뮬/활동은 `col-r`, 질문/정리는 `col-l`([[lesson-slide-2col]]).
- 데이터 탐구는 "측정하듯" 한 점씩(자동 시작 금지), 시뮬 수치는 실측 앵커에 맞춘다.
- 사례 학습은 입자 시뮬+그래프를 한 단일 슬라이드에 합친다([[lesson-slide-single]]).

관련: [[chem-pedagogy-guidelines]]
