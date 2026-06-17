---
name: lesson-slide-layouts
description: 사용 시점 — 2단·단일 외의 레이아웃이 필요할 때. 3단 비교(.cols3)·상하 분할(.split)·헤더+2단(.headcols)·2단 역비율(.cols2wide) 슬라이드를 만들 때 참조하는 HTML 패턴. 적합한 경우·예시를 한눈에 보려면 docs/layout-gallery.html.
---

# 추가 레이아웃 (3단 · 상하 분할 · 헤더+2단 · 2단 역비율)

[[lesson-slide-2col]](2단)·[[lesson-slide-single]](1단) 외에 상황에 맞춰 고르는 4가지. **적합한 경우와 예시를 한눈에** 보려면 `docs/layout-gallery.html`(레이아웃 갤러리). CSS는 이미 `lesson_template.html`·`deck-shell.html`에 정의돼 있어, `<section class="slide XXX">`에 클래스만 붙이면 된다. 토큰·클래스는 [design-system](../references/design-system.md).

## 3단 — `.cols3` (비교 · 3단계 · 세 사례)
각 칸은 `.col`. 셋을 나란히 비교(흡열/발열/촉매, 반응물·정반응·생성물)하거나 3단계 과정·세 사례.
```html
<section class="slide cols3" data-title="제목">
  <div class="col"><div class="card"> …① … </div></div>
  <div class="col"><div class="card"> …② … </div></div>
  <div class="col"><div class="card"> …③ … </div></div>
</section>
```

## 상하 분할 — `.split` (위 제시 · 아래 전개)
위(`.row-t`)는 자동 높이, 아래(`.row-b`)가 남은 공간을 채운다. 위 발문·큰 그래프 + 아래 가로로 넓은 표·선택지.
```html
<section class="slide split" data-title="제목">
  <div class="row-t"> …발문·큰 그래프… </div>
  <div class="row-b"> <div class="card" style="height:100%"> …표·전개… </div> </div>
</section>
```

## 헤더+2단 — `.headcols` (공통 맥락 + 좌우)
`.col-head`가 상단 풀폭(반응식·공통 조건), 아래 `.col-l`/`.col-r`이 좌우 활동.
```html
<section class="slide headcols" data-title="제목">
  <div class="col-head"> …반응식·제목… </div>
  <div class="col-l"> …시뮬… </div>
  <div class="col-r"> …그래프… </div>
</section>
```

## 2단 역비율 — `.cols2wide` (큰 시뮬 · 좁은 설명)
기본 2단과 반대로 **왼쪽이 넓다**. 입자 시뮬·실험사진이 주인공이고 오른쪽은 짧은 관찰 포인트.
```html
<section class="slide cols2wide" data-title="제목">
  <div class="col-l"> …큰 시뮬 / 실험 사진… </div>
  <div class="col-r"> …관찰 포인트(.sumlist)… </div>
</section>
```

## 원칙
- 콘텐츠가 720px를 넘으면 줄인다(한 화면 목표). 시뮬·그래프 등 요소는 [[lesson-activity-types]]에서 골라 넣는다.
- 흐름은 그대로 `발문 → 활동 → reveal 정리`([[lesson-reveal-gate]]). 흡열=빨강·발열=파랑 색 언어 유지.
- 새 레이아웃·예시를 더하면 `docs/layout-gallery.html`에 등재한다.

관련: [[lesson-slide-2col]] · [[lesson-slide-single]] · [[slide-compose]] · [[chem-pedagogy-guidelines]]
