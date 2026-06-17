---
name: lesson-slide-2col
description: 사용 시점 — 개념 학습 슬라이드를 만들 때(가장 많이 쓰는 형태). 왼쪽에 발문/핵심 정리, 오른쪽에 시뮬레이션을 두는 2단 컬럼 슬라이드를 구성할 때 참조.
---

# 2단 컬럼 슬라이드 (좌 질문 · 우 시뮬)

가장 많이 쓰는 개념 학습 슬라이드. 왼쪽에 발문(질문)과 활동 후 핵심 정리, 오른쪽에 시뮬레이션을 둔다. 권장 흐름은 `왼쪽 발문 → 오른쪽 시뮬 → (버튼으로) 핵심 정리`. 토큰·클래스는 [design-system](../references/design-system.md) 참고.

## 컨벤션 (README §2)
- **시뮬레이션은 항상 `col-r`**, 질문/확인/정리는 `col-l` — 균형이 좋다.
- `data-title`만 적으면 하단 라벨·진행 점이 자동. `data-init="함수명"`은 슬라이드 첫 진입 시 1회 실행.
- 세로 여백은 자동 가운데 정렬. 콘텐츠가 720px를 넘으면 줄인다(한 화면 목표).

## 패턴
```html
<section class="slide" data-title="제목" data-init="myInit">
  <div class="col-l">  <!-- 질문 + (활동 후) 핵심 정리 -->
    <span class="kicker"><span class="n">1</span> 소단원</span>
    <h1 class="title">핵심 질문</h1>
    <div class="card">
      <span class="tag q"><i class="dotmark"></i> 생각 열기</span>
      <p class="ask">…오른쪽 시뮬로 확인할 질문…</p>
      <p class="helper">…무엇을 조작하고 무엇을 관찰할지 안내…</p>
    </div>
    <!-- 핵심 정리 펼치기 → [[lesson-reveal-gate]] -->
  </div>
  <div class="col-r">  <!-- 시뮬레이션 -->
    <div class="card">
      <span class="tag sim"><i class="dotmark"></i> 시뮬레이션 · 직접 조작</span>
      … 시뮬레이션 …
    </div>
  </div>
</section>
```

오른쪽 시뮬 카드 안에서 다시 `display:grid; align-items:stretch`로 `[그래프 | 수치·컨트롤]` 2단을 만들면 그래프가 칸 높이에 맞춰 길어진다.

관련: [[lesson-reveal-gate]] · [[lesson-simulator-particle]] · [[lesson-slide-single]] · [[chem-pedagogy-guidelines]]
