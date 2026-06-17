---
name: lesson-reveal-gate
description: 사용 시점 — 핵심 정리·정답을 처음부터 보여주지 않고 학생이 활동·관찰을 마친 뒤 버튼으로 펼치게 할 때. 정리 카드를 reveal() 토글로 게이팅할 때 참조.
---

# 핵심 정리 게이팅 (reveal 토글)

정답(핵심 정리)을 처음부터 보여주지 않고, 활동·관찰 후 버튼으로 펼치게 하는 게이팅. 탐구 우선 흐름(`발문 → 시뮬/관찰 → 정리`)의 마지막 단계다. 토큰·클래스는 [design-system](../references/design-system.md) 참고.

## 어디에 두나
- 보통 `col-l`(질문 카드 아래) 또는 사례 학습 단일 슬라이드의 시뮬·그래프 아래.

## 패턴
`.revealwrap > button.revealbtn[data-reveal="sumA"]` + `.card.summary#sumA`. `reveal(this)`는 **토글**(다시 누르면 접힘)이며 `.ra` 안 화살표를 `↓↑`로 뒤집는다.

```html
<div class="revealwrap">
  <button class="revealbtn" onclick="reveal(this)" data-reveal="sumA">
    <span class="rdot"></span> 시뮬레이션·활동을 마친 뒤 — 핵심 정리 보기 <span class="ra">↓</span>
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

## 규칙
- **`data-reveal` 값 == 펼칠 카드 `id`**, 슬라이드마다 유니크(sumA, sumB, …). 중복 금지.
- `class="… summary"` 카드는 기본 숨김, 버튼을 눌러야 나타난다.
- 정리 내용은 긴 문장 대신 `.sumlist` 또는 `.flowrow` 칩 흐름(아이콘+조건 → 중간 → 색 칩)으로 — 서술식 금지.
- 펼친 상태가 화면을 넘으면 위쪽 카드 텍스트를 줄여 ~50px 이내로 맞춘다.

관련: [[lesson-activity-types]]
