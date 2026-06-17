---
name: lesson-comprehension-check
description: 사용 시점 — 슬라이드에 객관식 형성평가나 오개념(O/X) 점검을 넣을 때. 학생이 보기를 고르면 정답/오답 색·피드백·점수가 자동 처리되는 check() 문항을 만들 때 참조.
---

# 형성평가 / 오개념 점검 (객관식)

학생의 이해도와 오개념을 점검하는 객관식 문항. 보기를 누르면 정답/오답 색·잠금·피드백·점수가 자동 처리된다. 토큰·클래스는 [design-system](../references/design-system.md) 참고.

## 어디에 두나
- 2단 슬라이드면 보통 `col-r`(형성평가 카드). 4문항이면 [[lesson-slide-single]]의 `slide single` 2×2 그리드(README §33).

## 패턴
`.oxbox > .oxq(.lab) + .choices > button.choice + .fb#qNfb`. 채점은 `check(this, true|false, 'fbid', '메시지')`.

```html
<div class="oxbox" style="border-style:solid;border-color:var(--line)">
  <div class="oxq"><span class="lab" style="background:var(--primary)">Q1</span> 질문?</div>
  <div class="choices">
    <button class="choice" onclick="check(this,false,'q1fb','오답 해설')"><span class="mk">①</span> 보기1</button>
    <button class="choice" onclick="check(this,true ,'q1fb','정답! 해설')"><span class="mk">②</span> 보기2</button>
    <button class="choice" onclick="check(this,false,'q1fb','오답 해설')"><span class="mk">③</span> 보기3</button>
  </div>
  <div class="fb" id="q1fb"></div>
</div>
<!-- 점수판(선택) — 분모는 슬라이드 내 .choices 수로 자동 집계 -->
<div class="scoreband"><div class="sc" id="scoreNum">0 / 1</div><span id="scoreMsg">문항을 풀어 보세요.</span></div>
```

## 규칙
- **피드백 id는 슬라이드마다 유니크**(q1fb, q2fb, …). 중복 금지.
- `.scoreband`(`#scoreNum`/`#scoreMsg`)는 그 슬라이드의 `.choices` 개수를 total로 자동 집계 → 점수판 HTML만 넣으면 동작.
- O/X 점검도 같은 `check()`로(보기를 O/X 두 개로).
- 4문항은 2단 칼럼에 넣으면 피드백 펼침 시 넘침 → `slide single` 2×2 그리드 + 상단 `.scoreband`.
- 문항은 사례를 고르게 포괄(산업·생명·환경·건강), 흔한 오개념을 겨냥해 설계.

관련: [[chem-pedagogy-guidelines]]
