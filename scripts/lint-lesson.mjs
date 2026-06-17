#!/usr/bin/env node
/**
 * lint-lesson.mjs — 인터랙티브 화학 수업 슬라이드(단일 HTML)용 정적 검사기.
 *
 * 사용법:
 *   node scripts/lint-lesson.mjs <path-to-lesson-index.html>
 *
 * 순수 Node.js ESM (외부 패키지 없음). 다음 검사를 수행하고 ✓/✗ 보고서를 출력한다.
 *   1. JS 문법         (ERROR) — 마지막 <script> 블록을 vm.Script 로 파싱
 *   2. check() ↔ fb id (ERROR) — check(this,…,'XXX',…) 의 'XXX' 마다 id="XXX" 존재
 *   3. data-reveal ↔ id(ERROR) — data-reveal="X" 마다 id="X" 존재
 *   4. 중복 id         (ERROR) — id="…" 가 두 번 이상 쓰였는지
 *   5. 슬라이드 수      (INFO)  — <section class="slide … 개수
 *   6. 이미지 용량      (WARN)  — img/ 의 파일이 2MB 초과인지
 *   7. word-break      (WARN)  — <style> 에 word-break:keep-all 포함 여부
 *
 * ERROR 가 하나라도 있으면 종료 코드 != 0 (WARN/INFO 는 실패시키지 않음).
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const MAX_IMG_BYTES = 2 * 1024 * 1024; // 2MB

/* ---------- 결과 수집 ---------- */
const results = []; // { level: 'error'|'warn'|'info', msg: string }
const add = (level, msg) => results.push({ level, msg });

/* ---------- 입력 ---------- */
const file = process.argv[2];
if (!file) {
  console.error('usage: node scripts/lint-lesson.mjs <path-to-lesson-index.html>');
  process.exit(2);
}
const htmlPath = path.resolve(file);
let html;
try {
  html = fs.readFileSync(htmlPath, 'utf8');
} catch (e) {
  console.error(`✗ cannot read file: ${htmlPath}\n  ${e.message}`);
  process.exit(2);
}
const htmlDir = path.dirname(htmlPath);

/* ---------- 공용 헬퍼 ---------- */
// 주석을 비운 "코드 뷰"를 만든다(문자열 길이/구조는 보존하되 내용만 공백 처리).
// - HTML 주석 <!-- … --> 제거
// - <script> 블록 안의 JS 주석(/* */, //) 제거
// 이렇게 하면 가이드 문서용 주석에 들어 있는 예시 check()/data-reveal 이
//   거짓 양성(false positive)으로 잡히지 않는다.
function stripComments(src) {
  // 1) <script> 블록 내부의 JS 주석 비우기(블록 자체는 그대로 둠).
  let out = src.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, (full, body) => {
    const cleanBody = body
      .replace(/\/\*[\s\S]*?\*\//g, '') // /* … */
      .replace(/(^|[^:])\/\/[^\n\r]*/g, '$1'); // // … (URL의 https:// 보호)
    return full.replace(body, cleanBody);
  });
  // 1b) <style> 블록 내부의 CSS 주석(/* … */) 비우기. 디자인 시스템 CSS 주석에
  //     들어 있는 예시 셀렉터(예: 사례 학습 골격의 <section class="slide single">)가
  //     슬라이드 수·id·속성 검사에 거짓 양성으로 잡히지 않게 한다.
  out = out.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (full, body) => {
    const cleanBody = body.replace(/\/\*[\s\S]*?\*\//g, '');
    return full.replace(body, cleanBody);
  });
  // 2) HTML 주석 비우기.
  out = out.replace(/<!--[\s\S]*?-->/g, '');
  return out;
}

// 마지막 <script>…</script> 블록(프레임워크+수업 스크립트)을 추출.
// src 속성이 있는 외부 스크립트는 본문이 비므로 자연히 마지막 인라인 블록이 잡힌다.
function extractLastScript(src) {
  const re = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let m, last = null;
  while ((m = re.exec(src)) !== null) {
    if (m[1].trim()) last = m[1];
  }
  return last;
}

// 모든 id="…" 값을 등장 순서대로 수집(작은/큰따옴표 모두).
function collectIds(src) {
  const ids = [];
  const re = /\bid\s*=\s*("([^"]*)"|'([^']*)')/gi;
  let m;
  while ((m = re.exec(src)) !== null) {
    ids.push(m[2] !== undefined ? m[2] : m[3]);
  }
  return ids;
}

/* ---------- 검사 1: JS 문법 ---------- */
function checkJsSyntax(src) {
  const code = extractLastScript(src);
  if (code === null) {
    add('warn', 'JS syntax: no inline <script> block found (skipped).');
    return;
  }
  try {
    new vm.Script(code, { filename: 'lesson-script.js' });
    add('info', 'JS syntax: last <script> block parses OK.');
  } catch (e) {
    // vm 은 stack 첫 줄에 "lesson-script.js:LINE" 형식을 남긴다.
    let where = '';
    const mm = /lesson-script\.js:(\d+)/.exec(e.stack || '');
    if (mm) where = ` (script line ${mm[1]})`;
    add('error', `JS syntax error${where}: ${e.message}`);
  }
}

/* ---------- 검사 2: check() ↔ fb id ---------- */
function checkFeedbackIds(src, idSet) {
  // check(this, <2nd>, 'XXX', …) 의 3번째 문자열 인자(피드백 id)를 뽑는다.
  // 2번째 인자(true/false/식)는 콤마를 포함하지 않는다고 가정.
  const re = /check\s*\(\s*this\s*,\s*[^,]+,\s*(['"])([^'"]+)\1/gi;
  const fbIds = [];
  let m;
  while ((m = re.exec(src)) !== null) fbIds.push(m[2]);

  if (fbIds.length === 0) {
    add('info', 'check(): no check() calls found.');
    return;
  }
  const missing = [...new Set(fbIds)].filter((id) => !idSet.has(id));
  if (missing.length) {
    add('error', `check() ↔ id: ${missing.length} feedback id(s) without matching element: ${missing.join(', ')}`);
  } else {
    add('info', `check() ↔ id: all ${new Set(fbIds).size} feedback id(s) have a matching element.`);
  }
}

/* ---------- 검사 3: data-reveal ↔ id ---------- */
function checkRevealIds(src, idSet) {
  const re = /data-reveal\s*=\s*("([^"]+)"|'([^']+)')/gi;
  const targets = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    targets.push(m[2] !== undefined ? m[2] : m[3]);
  }
  if (targets.length === 0) {
    add('info', 'data-reveal: no data-reveal attributes found.');
    return;
  }
  const missing = [...new Set(targets)].filter((id) => !idSet.has(id));
  if (missing.length) {
    add('error', `data-reveal ↔ id: ${missing.length} target(s) without matching id: ${missing.join(', ')}`);
  } else {
    add('info', `data-reveal ↔ id: all ${new Set(targets).size} target(s) have a matching id.`);
  }
}

/* ---------- 검사 4: 중복 id ---------- */
function checkDuplicateIds(ids) {
  const counts = new Map();
  for (const id of ids) counts.set(id, (counts.get(id) || 0) + 1);
  const dups = [...counts.entries()].filter(([, n]) => n > 1);
  if (dups.length) {
    const detail = dups.map(([id, n]) => `${id} (×${n})`).join(', ');
    add('error', `duplicate ids: ${dups.length} id(s) used more than once: ${detail}`);
  } else {
    add('info', `duplicate ids: none (${ids.length} id attributes total).`);
  }
}

/* ---------- 검사 5: 슬라이드 수 ---------- */
function checkSlideCount(src) {
  const re = /<section\b[^>]*\bclass\s*=\s*("([^"]*)"|'([^']*)')/gi;
  let count = 0, m;
  while ((m = re.exec(src)) !== null) {
    const cls = m[2] !== undefined ? m[2] : m[3];
    if (/\bslide\b/.test(cls)) count++;
  }
  add('info', `slide count: ${count} <section class="slide…"> (progress dots are auto-generated).`);
}

/* ---------- 검사 6: 이미지 용량 ---------- */
function checkImgSize(src, dir) {
  const re = /<img\b[^>]*\bsrc\s*=\s*("([^"]*)"|'([^']*)')/gi;
  const srcs = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    const s = m[2] !== undefined ? m[2] : m[3];
    if (/^img\//i.test(s)) srcs.push(s);
  }
  if (srcs.length === 0) {
    add('info', 'img size: no <img src="img/…"> references found.');
    return;
  }
  let big = 0, missing = 0, ok = 0;
  for (const s of srcs) {
    const p = path.resolve(dir, s);
    let st;
    try {
      st = fs.statSync(p);
    } catch {
      add('warn', `img size: file missing, cannot check — ${s}`);
      missing++;
      continue;
    }
    if (st.size > MAX_IMG_BYTES) {
      add('warn', `img size: ${s} is ${(st.size / 1024 / 1024).toFixed(2)}MB (> 2MB).`);
      big++;
    } else {
      ok++;
    }
  }
  if (big === 0 && missing === 0) {
    add('info', `img size: all ${ok} image(s) ≤ 2MB.`);
  }
}

/* ---------- 검사 7: word-break:keep-all ---------- */
function checkWordBreak(src) {
  const styleRe = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  let css = '', m;
  while ((m = styleRe.exec(src)) !== null) css += m[1] + '\n';
  // 공백을 무시하고 word-break:keep-all 을 찾는다.
  if (/word-break\s*:\s*keep-all/i.test(css)) {
    add('info', 'word-break: <style> contains word-break:keep-all (Korean line-break rule).');
  } else {
    add('warn', 'word-break: <style> has no word-break:keep-all (README §20 — Korean line-break).');
  }
}

/* ---------- 실행 ---------- */
// 참조/속성/id 검사는 "주석 제거" 뷰를 기준으로 한다(가이드 주석의 예시가
// 거짓 양성으로 잡히지 않게). JS 문법 검사만 원본(주석 포함)을 쓴다.
const code = stripComments(html);
const ids = collectIds(code);
const idSet = new Set(ids);

checkJsSyntax(html);
checkFeedbackIds(code, idSet);
checkRevealIds(code, idSet);
checkDuplicateIds(ids);
checkSlideCount(code);
checkImgSize(code, htmlDir);
checkWordBreak(html);

/* ---------- 보고서 출력 ---------- */
const mark = { error: '✗', warn: '!', info: '✓' };
console.log(`lint-lesson: ${path.relative(process.cwd(), htmlPath) || htmlPath}`);
console.log('─'.repeat(60));
for (const r of results) {
  console.log(`  ${mark[r.level] || '·'} [${r.level.toUpperCase()}] ${r.msg}`);
}
console.log('─'.repeat(60));
const errors = results.filter((r) => r.level === 'error').length;
const warnings = results.filter((r) => r.level === 'warn').length;
const ew = (n, s) => `${n} ${s}${n === 1 ? '' : 's'}`;
console.log(`lint: ${ew(errors, 'error')}, ${ew(warnings, 'warning')}`);

process.exit(errors > 0 ? 1 : 0);
