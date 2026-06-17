#!/usr/bin/env node
/**
 * contrast-report.mjs — :root CSS 변수(hex 색)를 읽어 WCAG 2.x 명도 대비를 계산하는 보고서.
 *
 * 사용법:
 *   node scripts/contrast-report.mjs <path-to-html>
 *
 * 순수 Node.js ESM (외부 패키지 없음).
 *   - sRGB → 상대 휘도(relative luminance) 와 (L1+0.05)/(L2+0.05) 대비식을 직접 구현.
 *   - 파일 안에 실제로 존재하는 변수만 골라 의미 있는 전경/배경 쌍의 대비를 출력.
 *   - 허브 파일: --ink/--paper/--paper-2/--accent/--accent-2/--muted/--line
 *   - 덱/템플릿:  --ink/--surface/--muted/--primary-d/--primary-l/--ok/--ok-l/--no/--no-l 등
 *   - 판정: 일반 텍스트 ≥4.5 PASS, 큰 텍스트 ≥3.0 PASS, 그 외 FAIL.
 *
 * 보고서 성격(파싱 실패가 아니면 종료 코드 0).
 */
import fs from 'node:fs';
import path from 'node:path';

/* ---------- 입력 ---------- */
const file = process.argv[2];
if (!file) {
  console.error('usage: node scripts/contrast-report.mjs <path-to-html>');
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

/* ---------- :root CSS 변수 파싱 ---------- */
// 첫 번째 :root{ … } 블록 안의 --name:#hex; 들을 모은다.
function parseRootVars(src) {
  const rootRe = /:root\s*\{([\s\S]*?)\}/i;
  const m = rootRe.exec(src);
  if (!m) return null;
  const body = m[1];
  const vars = {};
  const declRe = /(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g;
  let d;
  while ((d = declRe.exec(body)) !== null) {
    vars[d[1].slice(2)] = normalizeHex(d[2]);
  }
  return vars;
}

// #rgb / #rrggbb / #rrggbbaa → {r,g,b} (0..255). 알파는 무시.
function normalizeHex(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length === 4) h = h.slice(0, 3).split('').map((c) => c + c).join(''); // #rgba → rgb
  if (h.length === 8) h = h.slice(0, 6); // #rrggbbaa → rrggbb
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

/* ---------- WCAG 상대 휘도 & 대비 ---------- */
function channelLinear(c8) {
  const c = c8 / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function relLuminance({ r, g, b }) {
  return 0.2126 * channelLinear(r) + 0.7152 * channelLinear(g) + 0.0722 * channelLinear(b);
}
function contrastRatio(fg, bg) {
  const L1 = relLuminance(fg);
  const L2 = relLuminance(bg);
  const hi = Math.max(L1, L2);
  const lo = Math.min(L1, L2);
  return (hi + 0.05) / (lo + 0.05);
}

/* ---------- 실행 ---------- */
const vars = parseRootVars(html);
if (!vars || Object.keys(vars).length === 0) {
  console.error(`✗ parse failed: no :root{} hex variables found in ${htmlPath}`);
  process.exit(2);
}

const has = (n) => Object.prototype.hasOwnProperty.call(vars, n);

// 파일에 존재하는 변수만으로 의미 있는 전경/배경 쌍을 구성한다.
// [전경var, 배경var, 라벨, '큰텍스트' 여부]
const candidatePairs = [
  // 본문 텍스트 — 배경(허브: paper/paper-2, 덱: surface)
  ['ink', 'paper', 'ink on paper', false],
  ['ink', 'paper-2', 'ink on paper-2 (card)', false],
  ['ink', 'surface', 'ink on surface', false],
  ['muted', 'paper', 'muted on paper', false],
  ['muted', 'paper-2', 'muted on paper-2', false],
  ['muted', 'surface', 'muted on surface', false],
  // 강조색 텍스트
  ['accent', 'paper', 'accent on paper', false],
  ['accent-2', 'paper', 'accent-2 on paper', false],
  ['accent-2', 'paper-2', 'accent-2 on paper-2', false],
  ['primary-d', 'primary-l', 'primary-d on primary-l (chip)', false],
  ['primary-d', 'surface', 'primary-d on surface', false],
  // 정답/오답 피드백 색(보통 큰 굵은 텍스트)
  ['ok', 'ok-l', 'ok on ok-l (good fb)', true],
  ['no', 'no-l', 'no on no-l (bad fb)', true],
];

const rows = [];
for (const [fgN, bgN, label, large] of candidatePairs) {
  if (!has(fgN) || !has(bgN)) continue;
  const ratio = contrastRatio(vars[fgN], vars[bgN]);
  const threshold = large ? 3.0 : 4.5;
  const verdict = ratio >= threshold ? 'PASS' : 'FAIL';
  rows.push({ label, ratio, kind: large ? 'large' : 'normal', threshold, verdict });
}

/* ---------- 보고서 출력 ---------- */
console.log(`contrast-report: ${path.relative(process.cwd(), htmlPath) || htmlPath}`);
console.log(`  parsed ${Object.keys(vars).length} :root color variables`);
console.log('─'.repeat(72));

if (rows.length === 0) {
  console.log('  (no recognized foreground/background variable pairs present)');
  console.log('─'.repeat(72));
  process.exit(0);
}

const labelW = Math.max(...rows.map((r) => r.label.length), 'pair'.length);
const header =
  '  ' + 'pair'.padEnd(labelW) + '   ratio   type     min    verdict';
console.log(header);
console.log('  ' + '─'.repeat(header.length - 2));
for (const r of rows) {
  const ratio = r.ratio.toFixed(2).padStart(6);
  const type = r.kind.padEnd(6);
  const min = r.threshold.toFixed(1).padStart(4);
  const mark = r.verdict === 'PASS' ? '✓ PASS' : '✗ FAIL';
  console.log(`  ${r.label.padEnd(labelW)}  ${ratio}:1  ${type}  ${min}   ${mark}`);
}
console.log('─'.repeat(72));
const fails = rows.filter((r) => r.verdict === 'FAIL').length;
console.log(`contrast: ${rows.length} pair(s) checked, ${fails} below AA threshold`);
process.exit(0);
