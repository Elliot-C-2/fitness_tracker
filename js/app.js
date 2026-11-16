// ══════════════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════════════
const STORE_KEY = 'grind_arcade_v1';
function loadState() { try { const d=localStorage.getItem(STORE_KEY); return d?JSON.parse(d):null; } catch(e) { return null; } }
function saveState() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

let state = loadState() || { startDate:'2026-03-01', workouts:{} };

// ══════════════════════════════════════════════════════
// SCHEDULE  (Mon/Wed/Fri, 7 weeks program + infinite maintenance)
// ══════════════════════════════════════════════════════
let schedule = {};
function buildSchedule() {
  schedule = {};
  const start = parseDate(state.startDate);
  let n = 0;
  // Build 5 years to cover infinite maintenance
  for (let i = 0; i < 260*7; i++) {
    const d   = new Date(start); d.setDate(d.getDate()+i);
    const dow = d.getDay();
    const ds  = dateStr(d);
    if (dow===1 || dow===3 || dow===5) {
      n++;
      const progWeek = Math.ceil(n/3);
      const type     = n%2===1 ? 'A' : 'B';
      const phase    = progWeek <= 7 ? 'program' : 'maintenance';
      schedule[ds]   = { week:progWeek, type, phase };
    } else {
      schedule[ds] = null;
    }
  }
}
buildSchedule();

function getExercises(week, type) {
  if (week > 7) return type==='A' ? MAINTENANCE.dayA : MAINTENANCE.dayB;
  for (const p of PROGRAM) {
    if (p.weeks.includes(week)) return type==='A' ? p.dayA : p.dayB;
  }
  return PROGRAM[PROGRAM.length-1][type==='A'?'dayA':'dayB'];
}
function getSets(week) {
  if (week > 7) return MAINTENANCE.sets;
  for (const p of PROGRAM) if (p.weeks.includes(week)) return p.sets;
  return 3;
}

// ══════════════════════════════════════════════════════
// UTILS
// ══════════════════════════════════════════════════════
function dateStr(d) { return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function parseDate(s) { const [y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d); }
function todayStr() { return dateStr(new Date()); }

function getStreak() {
  const todayDs = todayStr();
  const check   = new Date();
  if (schedule[todayDs] && !state.workouts[todayDs]?.done) check.setDate(check.getDate()-1);
  const start = parseDate(state.startDate);
  let streak = 0;
  for (let i=0; i<200; i++) {
    if (check < start) break;
    const ds = dateStr(check);
    if (ds in schedule) {
      if (schedule[ds]) { if (state.workouts[ds]?.done) streak++; else break; }
    }
    check.setDate(check.getDate()-1);
  }
  return streak;
}

function getTotalDone() { return Object.values(state.workouts).filter(w=>w.done).length; }

function getNextWorkout(fromDs) {
  const from = parseDate(fromDs);
  for (let i=1; i<=21; i++) {
    const d=new Date(from); d.setDate(d.getDate()+i);
    const ds=dateStr(d);
    if (schedule[ds] && !state.workouts[ds]?.done) return {ds, sched:schedule[ds], d};
  }
  return null;
}

function nextLabel(fromDs) {
  const n=getNextWorkout(fromDs);
  if (!n) return 'ALL CLEAR';
  const t0=new Date(); t0.setHours(0,0,0,0);
  const diff=Math.round((n.d-t0)/86400000);
  const lbl=diff===1?'TOMORROW':diff===0?'TODAY':DAYS[n.d.getDay()].toUpperCase();
  return lbl+' \u00b7 DAY '+n.sched.type;
}

function buildSections(exs) {
  const s={};
  exs.forEach((e,i)=>{ if(!s[e.section]) s[e.section]=[]; s[e.section].push({...e,idx:i}); });
  return s;
}

function renderSections(sections, clickable, checked) {
  let html='';
  Object.entries(sections).forEach(([sec,exs])=>{
    html+='<div class="section-divider">\u2500\u2500 '+sec+' \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500</div>';
    exs.forEach(e=>{
      const done=checked?!!checked[e.idx]:false;
      const cls=(done?'done ':'')+(clickable?'':'preview-mode');
      const oc=clickable?'onclick="toggleEx('+e.idx+')"':'';
      html+='<div class="ex-card '+cls+'" '+oc+'>'
        +'<div class="pixel-check">'+(done?'&#x2713;':'')+'</div>'
        +'<div class="ex-info"><div class="ex-title-t">'+e.name+'</div><div class="ex-tip-t">'+e.tip+'</div></div>'
        +'<div class="ex-reps-t">'+e.reps+'</div>'
        +'</div>';
    });
  });
  return html;
}

// ══════════════════════════════════════════════════════
// HOME
// ══════════════════════════════════════════════════════
function renderHome() {
  const now     = new Date();
  const todayDs = todayStr();
  const sched   = schedule[todayDs];
  const streak  = getStreak();
  const total   = getTotalDone();

  document.getElementById('home-date').textContent =
    DAYS[now.getDay()].toUpperCase()+', '+now.getDate()+' '+MONTHS_S[now.getMonth()].toUpperCase()+' '+now.getFullYear();

  let badge='';
  if (sched) badge='STAGE '+sched.week+' \u00b7 DAY '+sched.type+(sched.phase==='maintenance'?' \u00b7 MAINT':'');
  else if (todayDs in schedule) badge='REST DAY';
  document.getElementById('week-badge').textContent=badge;

  // Week dots
  const mon=new Date(now);
  mon.setDate(now.getDate()-(now.getDay()===0?6:now.getDay()-1));
  const weekW=[];
  for (let i=0;i<7;i++){
    const d=new Date(mon); d.setDate(mon.getDate()+i);
    const ds=dateStr(d);
    if(schedule[ds]) weekW.push({ds,isToday:ds===todayDs});
  }

  let html='<div class="score-row">'
    +'<div class="score-box"><div class="score-lbl">STREAK</div><div class="score-val">'+streak+'</div><div class="score-sfx">&#x1F525; COMBO</div></div>'
    +'<div class="score-box"><div class="score-lbl">SESSIONS</div><div class="score-val">'+total+'</div><div class="score-sfx">&#x2713; CLEARED</div></div>'
    +'</div>';

  if (weekW.length>0) {
    const doneW=weekW.filter(w=>state.workouts[w.ds]?.done).length;
    html+='<div class="pcard">'
      +'<div class="card-label">THIS WEEK ('+doneW+'/'+weekW.length+')</div>'
      +'<div class="week-dots">'
      +weekW.map(w=>'<div class="week-dot '+(state.workouts[w.ds]?.done?'done':w.isToday?'today':'')+'"></div>').join('')
      +'</div></div>';
  }

  if (!sched) {
    html+='<div class="rest-card">'
      +'<span class="rest-emoji">&#x1F6CB;&#xFE0F;</span>'
      +'<div class="rest-title">REST DAY</div>'
      +'<div class="rest-sub">RECOVERY IS PART OF THE GAME<br>NEXT: '+nextLabel(todayDs)+'</div>'
      +'</div>';
  } else if (state.workouts[todayDs]?.done) {
    html+='<div class="completed-card">'
      +(sched.phase==='maintenance'?'<div class="phase-badge">MAINTENANCE MODE</div><br>':'')
      +'<div class="completed-title">&#x2713; STAGE CLEAR</div>'
      +'<div class="completed-sub">'+streak+' COMBO STREAK &#x1F525;<br>NEXT: '+nextLabel(todayDs)+'</div>'
      +'</div>';
  } else {
    const exs=getExercises(sched.week,sched.type);
    const sets=getSets(sched.week);
    html+='<div class="today-card">'
      +'<div class="today-header">'
      +'<div>'
      +(sched.phase==='maintenance'?'<div style="font-size:5px;color:rgba(10,10,26,0.6);margin-bottom:3px;">&#x2605; MAINTENANCE MODE</div>':'')
      +'<div class="today-title">DAY '+sched.type+' WORKOUT</div>'
      +'<div class="today-stage">STAGE '+sched.week+' \u00b7 '+sets+' SETS \u00b7 ~'+(sets<=2?'20':sets===3?'25':'30')+' MIN</div>'
      +'</div>'
      +'<div style="font-size:28px;">'+(sched.type==='A'?'&#x1F4AA;':'&#x1F9B5;')+'</div>'
      +'</div>'
      +'<div class="today-body">'
      +exs.slice(0,4).map(e=>'<div class="ex-preview-row"><span class="epr-name">'+e.name+'</span><span class="epr-reps">'+e.reps+'</span></div>').join('')
      +(exs.length>4?'<div style="font-size:5px;color:var(--dim2);padding-top:6px;">+ '+(exs.length-4)+' MORE</div>':'')
      +'</div></div>'
      +'<button class="btn btn-pink" onclick="showPage(\'workout\')">&#x25B6; START WORKOUT</button>';
  }

  document.getElementById('home-content').innerHTML=html;
}

// ══════════════════════════════════════════════════════
// WORKOUT
// ══════════════════════════════════════════════════════
let sessionChecked=[];
let sessionDate='';

function renderWorkout() {
  const todayDs=todayStr();
  const sched=schedule[todayDs];
  document.getElementById('workout-page-title').textContent="TODAY'S FIGHT";

  if (!sched) {
    const n=getNextWorkout(todayDs);
    const t0=new Date(); t0.setHours(0,0,0,0);
    const diff=n?Math.round((n.d-t0)/86400000):0;
    const lbl=n?(diff===1?"TOMORROW'S":DAYS[n.d.getDay()].toUpperCase()+"'S"):"NEXT";
    document.getElementById('workout-content').innerHTML=
      '<div class="rest-card">'
      +'<span class="rest-emoji">&#x1F6CB;&#xFE0F;</span>'
      +'<div class="rest-title">REST DAY</div>'
      +'<div class="rest-sub">RECOVERY IS PART OF THE GAME<br>NEXT: '+nextLabel(todayDs)+'</div>'
      +'</div>'
      +'<button class="btn btn-cyan" onclick="renderWorkoutPreview()">&#x25B7; PREVIEW '+lbl+' WORKOUT</button>';
    return;
  }

  if (state.workouts[todayDs]?.done) {
    document.getElementById('workout-content').innerHTML=
      '<div class="completed-card" style="margin-top:8px;">'
      +'<div style="font-size:36px;margin-bottom:10px;">&#x2705;</div>'
      +'<div class="completed-title">STAGE CLEAR</div>'
      +'<div class="completed-sub">WELL PLAYED.<br>NEXT: '+nextLabel(todayDs)+'</div>'
      +'</div>';
    return;
  }

  const exs=getExercises(sched.week,sched.type);
  const sets=getSets(sched.week);
  if (sessionChecked.length!==exs.length || sessionDate!==todayDs) { sessionChecked=exs.map(()=>false); sessionDate=todayDs; }

  function build() {
    const done=sessionChecked.filter(Boolean).length;
    const all=done===exs.length;
    const pct=Math.round((done/exs.length)*100);
    const sections=buildSections(exs);

    let html='<div class="workout-hdr">'
      +'<div>'
      +(sched.phase==='maintenance'?'<div style="font-size:5px;color:var(--yellow);margin-bottom:4px;">&#x2605; MAINTENANCE MODE</div>':'')
      +'<div class="wh-title">DAY '+sched.type+' \u00b7 STAGE '+sched.week+'</div>'
      +'<div class="wh-sub">'+sets+' SETS EACH \u00b7 ~'+(sets<=2?'20':sets===3?'25':'30')+' MIN</div>'
      +'</div>'
      +'<div class="wh-count"><div class="wh-num">'+done+'/'+exs.length+'</div><div class="wh-lbl">CLEARED</div></div>'
      +'</div>';

    html+='<div class="prog-wrap"><div class="prog-fill" style="width:'+pct+'%">'+(pct<100?'<div class="prog-cursor"></div>':'')+'</div></div>';
    html+='<div style="font-size:5px;color:var(--dim2);text-align:right;margin-bottom:10px;">'+pct+'% COMPLETE</div>';

    html+=renderSections(sections, true, sessionChecked);

    if (sets>1) html+='<div style="font-size:5px;color:var(--dim2);text-align:center;padding:4px 0 8px;line-height:2;">COMPLETE ALL '+sets+' SETS BEFORE CHECKING OFF &#x2713;</div>';

    html+='<button class="btn '+(all?'btn-pink':'btn-disabled')+'" id="finish-btn" '
      +(all?'onclick="finishWorkout()"':'disabled')+'>'
      +(all?'&#x25B6; FINISH SESSION':(exs.length-done)+' REMAINING...')
      +'</button>';

    return html;
  }

  document.getElementById('workout-content').innerHTML=build();
}

function toggleEx(idx) {
  sessionChecked[idx]=!sessionChecked[idx];
  renderWorkout();
}

function finishWorkout() {
  const todayDs=todayStr();
  if (!schedule[todayDs]) return;
  state.workouts[todayDs]={done:true};
  sessionChecked=[];
  sessionDate='';
  saveState();

  const streak=getStreak();
  const total=getTotalDone();
  const sched=schedule[todayDs];
  const isMaint=sched&&sched.phase==='maintenance';

  const msgs=[
    'EVERY SESSION BUILDS THE HABIT.',
    streak+' IN A ROW. MUSCLE MEMORY IS BACK.',
    'YOU SHOWED UP. THAT IS WHAT MATTERS.',
    'FUTURE YOU THANKS PRESENT YOU.',
    total+' SESSIONS DONE. YOU ARE BUILDING SOMETHING REAL.',
    'CONSISTENCY BEATS INTENSITY EVERY TIME.',
    'THE GRIND NEVER STOPS.',
  ];

  document.getElementById('cel-title').innerHTML=isMaint?'MAINTENANCE CLEAR!':streak>=5?'&#x1F525; '+streak+' COMBO!':'SESSION CLEAR!';
  document.getElementById('cel-sub').textContent=msgs[total%msgs.length];
  document.getElementById('celebration').classList.add('show');
}

function dismissCelebration() {
  document.getElementById('celebration').classList.remove('show');
  showPage('home');
}

function renderWorkoutPreview() {
  const next=getNextWorkout(todayStr());
  if (!next) {
    document.getElementById('workout-content').innerHTML=
      '<div class="rest-card"><span class="rest-emoji">&#x1F3C1;</span><div class="rest-title">ALL CLEAR</div><div class="rest-sub">NO UPCOMING WORKOUTS.<br>RESET IN CONFIG.</div></div>';
    return;
  }
  const {sched,d}=next;
  const exs=getExercises(sched.week,sched.type);
  const sets=getSets(sched.week);
  const t0=new Date(); t0.setHours(0,0,0,0);
  const diff=Math.round((d-t0)/86400000);
  const dayLbl=diff===1?'TOMORROW':DAYS[d.getDay()].toUpperCase();

  document.getElementById('workout-page-title').textContent='PREVIEW';

  let html='<div class="preview-banner">PREVIEW \u2014 '+dayLbl+' '+d.getDate()+' '+MONTHS_S[d.getMonth()].toUpperCase()
    +' \u00b7 STAGE '+sched.week+' DAY '+sched.type
    +(sched.phase==='maintenance'?' \u00b7 MAINT':'')
    +'</div>'
    +'<div class="workout-hdr">'
    +'<div>'
    +(sched.phase==='maintenance'?'<div style="font-size:5px;color:var(--yellow);margin-bottom:4px;">&#x2605; MAINTENANCE MODE</div>':'')
    +'<div class="wh-title">DAY '+sched.type+' \u00b7 STAGE '+sched.week+'</div>'
    +'<div class="wh-sub">'+sets+' SETS \u00b7 ~'+(sets<=2?'20':sets===3?'25':'30')+' MIN</div>'
    +'</div>'
    +'<div class="wh-count"><div class="wh-num">'+exs.length+'</div><div class="wh-lbl">EXERCISES</div></div>'
    +'</div>'
    +renderSections(buildSections(exs),false,null)
    +'<button class="btn btn-disabled" disabled>PREVIEW ONLY \u2014 NOT LOGGED</button>';

  document.getElementById('workout-content').innerHTML=html;
}

// ══════════════════════════════════════════════════════
// HISTORY
// ══════════════════════════════════════════════════════
function renderHistory() {
  const streak=getStreak();
  const total=getTotalDone();
  document.getElementById('history-sub').textContent=total+' CLEARED \u00b7 '+streak+' COMBO';

  const now=new Date();
  const year=now.getFullYear();
  const month=now.getMonth();
  const firstDow=new Date(year,month,1).getDay();
  const dim=new Date(year,month+1,0).getDate();
  const offset=firstDow===0?6:firstDow-1;

  let calHTML='<div class="pcard">'
    +'<div class="card-label">'+MONTHS[month].toUpperCase()+' '+year+'</div>'
    +'<div class="cal-grid">'
    +['M','T','W','T','F','S','S'].map(n=>'<div class="cal-head">'+n+'</div>').join('')
    +Array(offset).fill('<div class="cal-day empty"></div>').join('');

  for (let d=1;d<=dim;d++) {
    const ds=year+'-'+String(month+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    const isToday=ds===todayStr();
    const date=new Date(year,month,d);
    const isPast=date<=now;
    const sched=schedule[ds];
    let cls='';
    if (!isPast)                    cls='future';
    else if (!sched)                cls='rest-day';
    else if (state.workouts[ds]?.done) cls='done';
    else if (isPast&&!isToday)      cls='missed';
    if (isToday) cls+=' today';
    calHTML+='<div class="cal-day '+cls.trim()+'">'+d+'</div>';
  }

  calHTML+='</div>'
    +'<div class="legend-row">'
    +'<div class="legend-item"><div class="legend-dot" style="background:var(--pink)"></div>DONE</div>'
    +'<div class="legend-item"><div class="legend-dot" style="border:1px solid rgba(255,45,120,0.3)"></div>MISSED</div>'
    +'<div class="legend-item"><div class="legend-dot" style="background:var(--bg3)"></div>REST</div>'
    +'</div></div>';

  const doneDates=Object.keys(state.workouts).filter(ds=>state.workouts[ds].done).sort().reverse();
  let listHTML='';
  if (doneDates.length===0) {
    listHTML='<div class="pcard" style="text-align:center;color:var(--dim2);padding:24px 12px;">NO SESSIONS YET.<br><br>START YOUR FIRST FIGHT!</div>';
  } else {
    listHTML='<div class="pcard"><div class="card-label">SESSIONS ('+doneDates.length+')</div>';
    doneDates.slice(0,30).forEach(ds=>{
      const d=parseDate(ds);
      const sched=schedule[ds];
      const isMaint=sched&&sched.phase==='maintenance';
      listHTML+='<div class="history-item">'
        +'<div><div class="hi-date">'+DAYS[d.getDay()].toUpperCase()+' '+d.getDate()+' '+MONTHS_S[d.getMonth()].toUpperCase()+'</div>'
        +'<div class="hi-type">'+(sched?'DAY '+sched.type+' \u00b7 STAGE '+sched.week+(isMaint?' \u00b7 MAINT':'')+' \u00b7 '+getSets(sched.week)+' SETS':'\u2014')+'</div></div>'
        +'<div class="hi-badge done">CLEAR</div>'
        +'</div>';
    });
    listHTML+='</div>';
  }

  document.getElementById('history-content').innerHTML=calHTML+listHTML;
}

// ══════════════════════════════════════════════════════
// SETTINGS
// ══════════════════════════════════════════════════════
function renderSettings() {
  const total=getTotalDone();
  const streak=getStreak();
  document.getElementById('settings-content').innerHTML=`
    <div class="pcard cyan">
      <div class="card-label">PROGRAM</div>
      <div class="setting-row">
        <div><div class="setting-label">START DATE</div><div class="setting-sub">FIRST MONDAY<br>OF YOUR PROGRAM</div></div>
        <input type="date" class="setting-input" value="${state.startDate}" onchange="updateStart(this.value)"/>
      </div>
      <div class="setting-row" style="border:none;">
        <div style="font-size:5px;color:var(--dim2);">SESSIONS CLEARED</div>
        <div style="font-size:14px;color:var(--yellow);text-shadow:0 0 6px rgba(255,230,0,0.4);">${total}</div>
      </div>
    </div>

    <div class="pcard">
      <div class="card-label">STAGE MAP</div>
      <div style="font-size:5px;color:var(--dim2);">
        <div style="padding:8px 0;border-bottom:1px solid var(--bg3);display:flex;justify-content:space-between;"><span>STAGE 1&#x2013;2</span><span style="color:var(--white);">HABIT BUILD \u00b7 2 SETS</span></div>
        <div style="padding:8px 0;border-bottom:1px solid var(--bg3);display:flex;justify-content:space-between;"><span>STAGE 3&#x2013;4</span><span style="color:var(--white);">POWER UP \u00b7 3 SETS</span></div>
        <div style="padding:8px 0;border-bottom:1px solid var(--bg3);display:flex;justify-content:space-between;"><span>STAGE 5&#x2013;6</span><span style="color:var(--white);">CHALLENGE \u00b7 3 SETS</span></div>
        <div style="padding:8px 0;border-bottom:1px solid var(--bg3);display:flex;justify-content:space-between;"><span>STAGE 7</span><span style="color:var(--pink);">FINAL BOSS \u00b7 3 SETS</span></div>
        <div style="padding:8px 0;display:flex;justify-content:space-between;"><span>STAGE 8+</span><span style="color:var(--yellow);">&#x2605; MAINTENANCE \u00b7 4 SETS</span></div>
      </div>
    </div>

    <div class="pcard">
      <div class="card-label">PLAYER NOTES</div>
      <div style="font-size:5px;color:var(--dim2);line-height:2.5;">
        &#x1F9B4; ALL EXERCISES BILATERAL \u2014 SCOLIOSIS SAFE<br>
        &#x1F3E5; CORE + NECK WORK PHYSIO-APPROVED<br>
        &#x1F35A; EAT 6&#x2013;7PM \u2192 WORKOUT ~9PM \u2192 SHOWER<br>
        &#x1F4AA; AT 50KG YOU WILL RESPOND FAST<br>
        &#x1F7E1; BAND ROWS + FACE PULLS: ANCHOR AT DOOR<br>
        &#x1F534; PULL-APARTS: LIGHT BAND, ARMS STRAIGHT<br>
        &#x26A1; EXTERNAL ROTATION: USE LIGHTEST BAND
      </div>
    </div>

    <div class="pcard">
      <div class="card-label">DATA</div>
      <div class="setting-row">
        <div><div class="setting-label">RESET</div><div class="setting-sub">CLEAR ALL HISTORY<br>KEEPS START DATE</div></div>
        <button class="btn btn-red" style="width:auto;padding:8px 12px;margin:0;font-size:5px;" onclick="resetData()">RESET</button>
      </div>
    </div>

    <div style="text-align:center;font-size:5px;color:var(--dim);padding:16px 0 8px;line-height:2.5;letter-spacing:0.1em;">
      GRIND \u00b7 ARCADE EDITION<br>
      SAFARI \u2192 SHARE \u2192 ADD TO HOME SCREEN
    </div>`;
}

function updateStart(val) {
  if (!val) return;
  state.startDate=val;
  buildSchedule();
  saveState();
}

function resetData() {
  if (!confirm('RESET ALL DATA? THIS CANNOT BE UNDONE.')) return;
  state.workouts={};
  sessionChecked=[];
  saveState();
  showPage('home');
}

// ══════════════════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════════════════
function showPage(name) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
  document.getElementById('nav-'+name).classList.add('active');
  if (name==='home')     renderHome();
  if (name==='workout')  renderWorkout();
  if (name==='history')  renderHistory();
  if (name==='settings') renderSettings();
  window.scrollTo(0,0);
}

renderHome();
