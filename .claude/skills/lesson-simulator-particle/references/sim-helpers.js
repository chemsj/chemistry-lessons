/* =====================================================================
   미시 입자 시뮬레이션 공통 헬퍼 (재사용 블록)
   ---------------------------------------------------------------------
   · 이 블록은 "보이지 않는 분자 세계의 동적 변화"를 입자로 보여주는
     캔버스 시뮬에 쓰는 재사용 미시 입자 유틸 모음입니다.
   · 슬라이드가 입자 시뮬을 쓸 때에만, 그 수업의 <script> 안
     (data-init 함수들 위)에 이 블록을 그대로 붙여넣으세요.
     입자 시뮬이 없는 슬라이드에는 넣지 않습니다.
   · fitCanvas()는 덱 골격(템플릿 프레임워크)이 이미 제공하므로
     여기 포함하지 않습니다 — 그대로 fitCanvas(cv)로 호출하면 됩니다.
   · 반응 동역학(kinetics) 패턴:
       정반응 속도 Rf = kf·[반응물], 역반응 속도 Rr = kr·[생성물]
       매 프레임 누적: acc += R·dt   (dt = (1/60)*speed)
       acc ≥ 1 이 되면 입자 1개를 전환(반응물→생성물 / 그 반대)하고 acc -= 1.
       평형 상수 K = kf/kr.
   · RAF 루프는 현재 슬라이드일 때만 계산·그리기:
       if(cv.offsetParent !== null){ ... }  (숨은 슬라이드 낭비 방지)
   · 새 분자 모양은 drawMolecule()의 분기에 추가합니다.
   · 자세한 패턴/주의는 ../../references/design-system.md 와 SKILL.md 참고.
   ===================================================================== */

/* ---- 구성 골격(skeleton) — 실제 함수는 이 패턴으로 직접 작성 (README §12) ----
let sim=null;
function simInit(){ const s=sim&&sim.started; sim={run:true,speed:0.4,started:s}; simBuild();
  if(!sim.started){ sim.started=true; requestAnimationFrame(simLoop); } }   // data-init="simInit"
function simLoop(){
  const cv=document.getElementById('simCanvas');
  if(sim&&cv&&cv.offsetParent!==null){               // 현재 슬라이드일 때만
    if(sim.run){
      const dt=(1/60)*sim.speed;                      // 속도를 동역학 전체에 곱함
      // Rf=kf·[반응물], Rr=kr·[생성물] 을 누적해 acc≥1 이면 입자 1개 전환
      // 이력(hA,hB…)에 pushHist 로 값 기록
    }
    const {ctx,w,h}=fitCanvas(cv); ctx.clearRect(0,0,w,h);
    const s=Math.min(w/240,h/150), pad=9;
    for(const p of sim.p){ if(sim.run)pMove(p,0.05,0.95); drawMolecule(ctx,p,pad+p.x*(w-2*pad),pad+p.y*(h-2*pad),s); }
    // lineGraph(graphCanvas, [{data:hA,color:'#2bb894'},{data:hB,color:'#e0922a'}], ymax);
  }
  requestAnimationFrame(simLoop);
}
------------------------------------------------------------------------ */

/* ===================== 미시 입자 모형 공통 유틸 (재사용) ===================== */
function rnd(a,b){return a+(b-a)*Math.random();}
function pSeed(type){return {x:rnd(0.08,0.92),y:rnd(0.10,0.90),a:rnd(0,6.2832),sp:rnd(0.55,1.05),type,sc:0,glow:0,gc:'#fff'};}
function pMove(p,xmin,xmax){
  p.x+=Math.cos(p.a)*p.sp*0.0026; p.y+=Math.sin(p.a)*p.sp*0.0026;
  if(p.x<xmin){p.x=xmin;p.a=Math.PI-p.a;} if(p.x>xmax){p.x=xmax;p.a=Math.PI-p.a;}
  if(p.y<0.06){p.y=0.06;p.a=-p.a;} if(p.y>0.94){p.y=0.94;p.a=-p.a;}
  if(Math.random()<0.01)p.a+=rnd(-0.3,0.3);
  if(p.sc<1)p.sc=Math.min(1,p.sc+0.10); if(p.glow>0)p.glow=Math.max(0,p.glow-0.045);
}
function atom(ctx,x,y,r,c){
  const g=ctx.createRadialGradient(x-r*0.35,y-r*0.35,r*0.2,x,y,r);
  g.addColorStop(0,'#ffffff'); g.addColorStop(0.25,c); g.addColorStop(1,c);
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,6.2832); ctx.fill();
}
function ball(ctx,x,y,r,c1,c2){
  const g=ctx.createRadialGradient(x-r*0.35,y-r*0.35,r*0.2,x,y,r);
  g.addColorStop(0,c1); g.addColorStop(1,c2);
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,6.2832); ctx.fill();
}
function glowRing(ctx,x,y,r,p){ if(p.glow>0){ ctx.save(); ctx.globalAlpha=p.glow; ctx.strokeStyle=p.gc; ctx.lineWidth=2.6; ctx.beginPath(); ctx.arc(x,y,r,0,6.2832); ctx.stroke(); ctx.restore(); } }
function pickIdx(arr,type){ const idx=[]; for(let i=0;i<arr.length;i++)if(arr[i].type===type)idx.push(i); return idx.length?idx[(Math.random()*idx.length)|0]:-1; }
function countType(arr,type){ let n=0; for(const q of arr)if(q.type===type)n++; return n; }
/* 목표 개수에 맞게 입자 추가/제거 */
function reconcile(arr,type,target,glowColor){
  let n=countType(arr,type);
  while(n<target){ const q=pSeed(type); q.glow=glowColor?1:0; q.gc=glowColor||'#fff'; arr.push(q); n++; }
  while(n>target){ const i=pickIdx(arr,type); if(i<0)break; arr.splice(i,1); n--; }
}
/* 분자 그리기 — 새 분자는 여기 분기에 추가 (A/B 일반구, NO2/N2O4/Cr2O7/CrO4/H+ 예시) */
function drawMolecule(ctx,p,X,Y,s){
  glowRing(ctx,X,Y,15*s,p);
  if(p.type==='A'){ ball(ctx,X,Y,8*s,'#9af0d3','#2bb894'); }
  else if(p.type==='B'){ ball(ctx,X,Y,8*s,'#ffd98a','#e0922a'); }
  else if(p.type==='NO2'){
    ctx.save(); ctx.fillStyle='rgba(154,52,18,.18)'; ctx.beginPath(); ctx.arc(X,Y,12*s,0,6.2832); ctx.fill(); ctx.restore();
    atom(ctx,X-5*s,Y+3*s,3.4*s,'#c0392b'); atom(ctx,X+5*s,Y+3*s,3.4*s,'#c0392b'); atom(ctx,X,Y-2.5*s,4.2*s,'#3a6ea5');
  } else if(p.type==='N2O4'){
    ctx.save(); ctx.fillStyle='rgba(138,166,189,.16)'; ctx.beginPath(); ctx.arc(X,Y,14*s,0,6.2832); ctx.fill();
    ctx.strokeStyle='#8aa6bd'; ctx.lineWidth=1.6*s; ctx.beginPath(); ctx.moveTo(X-4*s,Y-1*s); ctx.lineTo(X+4*s,Y-1*s); ctx.stroke(); ctx.restore();
    atom(ctx,X-10*s,Y+3*s,3*s,'#c89b9b'); atom(ctx,X-2*s,Y+5*s,3*s,'#c89b9b');
    atom(ctx,X+10*s,Y+3*s,3*s,'#c89b9b'); atom(ctx,X+2*s,Y+5*s,3*s,'#c89b9b');
    atom(ctx,X-4*s,Y-1*s,3.8*s,'#6b93b5'); atom(ctx,X+4*s,Y-1*s,3.8*s,'#6b93b5');
  } else if(p.type==='Di'){ ctx.save(); ctx.strokeStyle='#c85a12'; ctx.lineWidth=2.2*s; ctx.beginPath(); ctx.moveTo(X-4*s,Y); ctx.lineTo(X+4*s,Y); ctx.stroke(); ctx.restore();
    ball(ctx,X-5*s,Y,5.4*s,'#f5a25a','#d2691e'); ball(ctx,X+5*s,Y,5.4*s,'#f5a25a','#d2691e');
  } else if(p.type==='Cr'){ ball(ctx,X,Y,5.6*s,'#fbe88a','#e7c200');
  } else if(p.type==='H'){ ball(ctx,X,Y,2.8*s,'#cfd8e6','#9aa7bd'); }
}
/* 시간에 따른 값 변화 꺾은선 그래프: lines=[{data:[...],color}], ymax=세로축 최대 */
function lineGraph(cv, lines, ymax){
  if(!cv||cv.offsetParent===null)return;
  const {ctx,w,h}=fitCanvas(cv); ctx.clearRect(0,0,w,h);
  const pl=10,pr=10,pt=15,pb=13, x0=pl,x1=w-pr,y0=h-pb,y1=pt;
  ctx.strokeStyle='#e7efec'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x0,y1); ctx.lineTo(x0,y0); ctx.stroke();
  const maxLen=Math.max(2,...lines.map(l=>l.data.length));
  const X=i=>x0+(x1-x0)*(maxLen<=1?0:i/(maxLen-1));
  const Y=v=>y0-(y0-y1)*Math.max(0,Math.min(1,v/ymax));
  lines.forEach((l)=>{ if(!l.data.length)return;
    ctx.strokeStyle=l.color; ctx.lineWidth=2.2; ctx.lineJoin='round'; ctx.beginPath();
    l.data.forEach((v,i)=>{const xx=X(i),yy=Y(v); i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy);}); ctx.stroke();
    const li=l.data.length-1; ctx.fillStyle=l.color; ctx.beginPath(); ctx.arc(X(li),Y(l.data[li]),3.2,0,6.2832); ctx.fill();
  });
  const labs=lines.filter(l=>l.data.length).map(l=>({c:l.color,v:l.data[l.data.length-1],y:Y(l.data[l.data.length-1])}));
  labs.sort((a,b)=>a.y-b.y); const gap=16;
  for(let i=1;i<labs.length;i++){ if(labs[i].y-labs[i-1].y<gap) labs[i].y=labs[i-1].y+gap; }
  for(let i=labs.length-1;i>0;i--){ if(labs[i].y>y0-2){ labs[i].y=y0-2; if(labs[i-1].y>labs[i].y-gap) labs[i-1].y=labs[i].y-gap; } }
  ctx.font='800 14px Georgia,serif'; ctx.textAlign='right';
  labs.forEach(L=>{ ctx.fillStyle=L.c; const t=(Math.abs(L.v)>=1)?(Math.round(L.v*10)/10):(+L.v.toPrecision(2)); ctx.fillText(t, x1-3, Math.max(y1+11,Math.min(y0-2,L.y))); });
  ctx.fillStyle='#9bb0ab'; ctx.font='700 9px Pretendard,sans-serif'; ctx.textAlign='right'; ctx.fillText('시간 →', x1, h-3);
}
function pushHist(arr,v,cap){ arr.push(v); if(arr.length>(cap||200))arr.shift(); }
/* 데이터 점 값 라벨: 선의 법선(위쪽) 방향으로 띄우고 흰 배경 칩을 깔아 '선과 숫자 겹침' 방지.
   px,py=점 좌표, tan={dx,dy}=접선(이웃 점 차), 영역 경계 x0,x1,y0,y1, color=글자색.
   예) drawXY 안에서 각 점마다: chipLabel(ctx, X(t), Y(v), val.toFixed(1), {dx:X(tNext)-X(tPrev),dy:Y(vNext)-Y(vPrev)}, x0,x1,y0,y1, '#0f766e'); */
function chipLabel(ctx, px, py, text, tan, x0, x1, y0, y1, color){
  const tw=ctx.measureText(text).width, chw=tw+8, chh=15;
  let dx=tan?tan.dx:0, dy=tan?tan.dy:-1; const len=Math.hypot(dx,dy)||1; dx/=len; dy/=len;
  let nx=-dy, ny=dx; if(ny>0){ nx=-nx; ny=-ny; }          // 법선을 항상 위쪽(y 감소)으로
  let cx=px+nx*20, cy=py+ny*20;                             // 20px 오프셋
  cx=Math.max(x0+chw/2, Math.min(x1-chw/2, cx));
  cy=Math.max(y1+chh/2, Math.min(y0-chh/2, cy));
  const prevBaseline=ctx.textBaseline, prevAlign=ctx.textAlign;
  ctx.textBaseline='middle'; ctx.fillStyle='rgba(255,255,255,.92)';
  if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(cx-chw/2, cy-chh/2, chw, chh, 4); ctx.fill(); }
  else ctx.fillRect(cx-chw/2, cy-chh/2, chw, chh);
  ctx.fillStyle=color; ctx.textAlign='center'; ctx.fillText(text, cx, cy);
  ctx.textBaseline=prevBaseline; ctx.textAlign=prevAlign;
}
/* 두 색(#rrggbb)을 t(0~1)로 보간 → 'rgb(...)' (용액 색 등) */
function mix(c1,c2,t){ const a=parseInt(c1.slice(1),16),b=parseInt(c2.slice(1),16);
  const r=Math.round((a>>16)+(((b>>16)-(a>>16))*t)),g=Math.round(((a>>8)&255)+((((b>>8)&255)-((a>>8)&255))*t)),bl=Math.round((a&255)+(((b&255)-(a&255))*t));
  return 'rgb('+r+','+g+','+bl+')'; }
