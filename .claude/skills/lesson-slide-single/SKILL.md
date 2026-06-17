---
name: lesson-slide-single
description: 사용 시점 — 단일 컬럼 슬라이드를 만들 때. 도입·마무리(마인드맵), 사례 학습(좌 시뮬+우 그래프), 형성평가 4문항처럼 좌우 분할 없이 전체 폭을 쓰는 슬라이드를 구성할 때 참조.
---

# 단일 컬럼 슬라이드

좌우 분할 없이 전체 폭을 쓰는 슬라이드. 도입·마무리·사례 학습·형성평가4에 쓴다. 토큰·클래스는 [design-system](../references/design-system.md) 참고.

## (a) 도입 / 마무리
```html
<section class="slide single" data-title="제목">
  <div>
    <span class="kicker"><span class="n">★</span> 라벨</span>
    <h1 class="title">큰 제목</h1>
    <p class="sub">부제/설명</p>
    <div class="card"> … 내용(마무리는 마인드맵 .mindmap) … </div>
  </div>
</section>
```

## (b) 사례 학습 포맷 (README §31, chem-3-04에서 확립 · 권장)
한 사례 = 한 슬라이드. 구조: ① **헤더행** ② **grid 1fr 1fr**(좌 시뮬 / 우 그래프+공유 컨트롤) ③ **reveal** ④ **핵심정리**.

- **① 헤더행**: kicker + title + `.hgroup` 2박스. 1번 = 화학반응식(상태 `(g)(aq)(s)(l)` 필수) + `.hbadge`(평형 이름). 2번 = `.hgroup.fx`에 요인 `.qchip` 2개.
- **② grid**: 좌 시뮬 카드(`<canvas>` + `.readout` 큰 값 + `.qkverdict` — 현재 상태에 연동되는 판정, 고정 임계값 금지) / 우 그래프 카드(`.graphbox`+canvas) + 공유 컨트롤(프리셋 버튼 JS 렌더·활성 강조 + 변인 슬라이더 + `.slider.spd` 속도 + `⏸/▶` + ↺ 초기화).
- **③ reveal**: [[lesson-reveal-gate]].
- **④ 핵심정리**: `.flowrow` 칩 흐름(red/grn/blue) + `.sumconc` 종합.

```html
<section class="slide single" data-title="사례명" data-init="initXxx">
  <div>
    <div style="display:flex;align-items:center;gap:8px 12px;flex-wrap:wrap;margin-bottom:7px">
      <span class="kicker"><span class="n">N</span> 분류</span>
      <h1 class="title" style="font-size:21px;margin:0">사례 — 핵심 평형</h1>
      <span class="hgroup" style="flex:1;justify-content:center;min-width:0">
        <span style="font-size:12.5px;font-weight:800;white-space:nowrap">A(g)+B(aq) ⇌ C(s)+D(aq)</span>
        <span class="hbadge" style="color:#a31d36;background:#fde7ec">평형 이름</span>
      </span>
      <span class="hgroup fx" style="flex:1;justify-content:center;min-width:0">
        <span style="font-size:13px;color:var(--primary-d);font-weight:800;white-space:nowrap">요인</span>
        <span class="qchip">🔺 조건↑ → 정반응</span>
        <span class="qchip">🔻 조건↓ → 역반응</span>
      </span>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:stretch">
      <div class="card" style="display:flex;flex-direction:column"> … 시뮬 canvas + .readout + .qkverdict … </div>
      <div class="card" style="display:flex;flex-direction:column"> … .graphbox + 프리셋/슬라이더/속도/⏸/↺ … </div>
    </div>
    <!-- reveal 버튼 + .card.summary(.flowrow + .sumconc) -->
  </div>
</section>
```
시뮬/그래프 그리기·컨트롤은 `data-init="initXxx"`에 연결([[lesson-simulator-particle]] 헬퍼 재사용). 속도는 핵심 동역학 전체에 곱해질 것. 모든 상태(프리셋·슬라이더·펼침)에서 넘침 0 확인(single은 펼침 시 소량 스크롤 허용).

## (c) 형성평가 4문항
`slide single` 2×2 그리드 + 상단 `.scoreband` → [[lesson-comprehension-check]] (README §33).

관련: [[lesson-activity-types]] · [[lesson-simulator-particle]] · [[lesson-reveal-gate]] · [[chem-pedagogy-guidelines]]
