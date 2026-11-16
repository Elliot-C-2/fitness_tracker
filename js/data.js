// ══════════════════════════════════════════════════════
// PROGRAM DATA
// ══════════════════════════════════════════════════════
const PROGRAM = [
  { weeks:[1,2], phase:'program', sets:2,
    dayA:[
      {name:'PUSHUPS',               reps:'5 REPS',       section:'PUSH',             tip:'Keep core tight, chest to floor'},
      {name:'SHOULDER PRESS',        reps:'8 REPS',       section:'PUSH',             tip:'5kg each hand, press straight up'},
      {name:'LATERAL RAISES',        reps:'8 REPS',       section:'PUSH',             tip:'5kg, raise to shoulder height, slow'},
      {name:'BAND PULL-APARTS',      reps:'10 REPS',      section:'POSTURE',          tip:'Light band, arms straight, pull apart to a T, squeeze at end'},
      {name:'PLANK',                 reps:'20 SEC',       section:'CORE',             tip:'Forearms down, flat back, breathe'},
      {name:'DEAD BUGS',             reps:'6/SIDE',       section:'CORE',             tip:'Lower back pressed to floor the whole time'},
      {name:'CHIN TUCKS',            reps:'8 REPS',       section:'NECK',             tip:'Pull chin straight back, hold 3s'},
    ],
    dayB:[
      {name:'BAND ROWS',             reps:'8 REPS',       section:'PULL',             tip:'Door anchor at waist height, lean back, pull to hips'},
      {name:'BAND FACE PULLS',       reps:'10 REPS',      section:'PULL',             tip:'Anchor high, pull to forehead, elbows up and out'},
      {name:'BAND EXTERNAL ROTATION',reps:'10/SIDE',      section:'POSTURE',          tip:'Elbow at 90deg against side, rotate outward, hold 2s'},
      {name:'SQUATS',                reps:'10 REPS',      section:'LEGS',             tip:'Feet shoulder-width, knees over toes'},
      {name:'GLUTE BRIDGES',         reps:'10 REPS',      section:'LEGS',             tip:'Squeeze glutes at top, hold 1s'},
      {name:'ROMANIAN DEADLIFT',     reps:'8 REPS',       section:'LEGS',             tip:'5kg each hand, hinge at hips, feel hamstrings'},
      {name:'BIRD DOGS',             reps:'6/SIDE',       section:'CORE',             tip:'On all fours, extend opposite arm and leg, hold 2s'},
    ]
  },
  { weeks:[3,4], phase:'program', sets:3,
    dayA:[
      {name:'PUSHUPS',               reps:'10 REPS',      section:'PUSH',             tip:'Control the descent, 2 seconds down'},
      {name:'SHOULDER PRESS',        reps:'10 REPS',      section:'PUSH',             tip:'5kg each hand, full range of motion'},
      {name:'LATERAL RAISES',        reps:'10 REPS',      section:'PUSH',             tip:'Slow and controlled, no swinging'},
      {name:'BAND PULL-APARTS',      reps:'12 REPS',      section:'POSTURE',          tip:'Arms stay straight, full stretch at end, controlled back'},
      {name:'PLANK',                 reps:'30 SEC',       section:'CORE',             tip:"Squeeze everything, don't let hips drop"},
      {name:'DEAD BUGS',             reps:'8/SIDE',       section:'CORE',             tip:'Slow and controlled, no arching'},
      {name:'CHIN TUCKS',            reps:'10 REPS',      section:'NECK',             tip:'Hold 3s each rep, feel the stretch'},
    ],
    dayB:[
      {name:'BAND ROWS',             reps:'12 REPS',      section:'PULL',             tip:'Pause and squeeze at the top for 1s'},
      {name:'BAND FACE PULLS',       reps:'12 REPS',      section:'PULL',             tip:'Pull to nose level, externally rotate at peak'},
      {name:'BAND EXTERNAL ROTATION',reps:'12/SIDE',      section:'POSTURE',          tip:'Slow and controlled, hold 2s at peak rotation'},
      {name:'SQUATS',                reps:'15 REPS',      section:'LEGS',             tip:'Go below parallel if comfortable'},
      {name:'GLUTE BRIDGES',         reps:'15 REPS',      section:'LEGS',             tip:'Drive hips as high as possible'},
      {name:'ROMANIAN DEADLIFT',     reps:'10 REPS',      section:'LEGS',             tip:'Slow on the way down, feel the stretch'},
      {name:'BIRD DOGS',             reps:'8/SIDE',       section:'CORE',             tip:"Hold 3s, don't let hips rotate"},
    ]
  },
  { weeks:[5,6], phase:'program', sets:3,
    dayA:[
      {name:'PUSHUPS',               reps:'15 REPS',      section:'PUSH',             tip:'3 second descent, full range'},
      {name:'SHOULDER PRESS',        reps:'12 REPS',      section:'PUSH',             tip:'Full lockout at top, controlled down'},
      {name:'LATERAL RAISES',        reps:'12 REPS',      section:'PUSH',             tip:'No swinging, pure shoulder'},
      {name:'BAND PULL-APARTS',      reps:'15 REPS',      section:'POSTURE',          tip:'Try a slightly heavier band, full range'},
      {name:'PLANK',                 reps:'45 SEC',       section:'CORE',             tip:"Every second counts, don't give up"},
      {name:'DEAD BUGS',             reps:'10/SIDE',      section:'CORE',             tip:'Breathe out as you extend, back stays flat'},
      {name:'CHIN TUCKS',            reps:'12 REPS',      section:'NECK',             tip:'Add a gentle nod at the end of each rep'},
    ],
    dayB:[
      {name:'BAND ROWS',             reps:'15 REPS',      section:'PULL',             tip:'3s down, explosive pull, 1s squeeze at top'},
      {name:'BAND FACE PULLS',       reps:'15 REPS',      section:'PULL',             tip:'Hold 2s at peak, elbows stay high throughout'},
      {name:'BAND EXTERNAL ROTATION',reps:'15/SIDE',      section:'POSTURE',          tip:'Full rotation range, hold 3s, feel the rear delt'},
      {name:'SQUATS',                reps:'20 REPS',      section:'LEGS',             tip:'Tempo: 3s down, 1s pause, up'},
      {name:'GLUTE BRIDGES',         reps:'20 REPS',      section:'LEGS',             tip:'Pause 2s at the top'},
      {name:'ROMANIAN DEADLIFT',     reps:'12 REPS',      section:'LEGS',             tip:'Feel the hamstring stretch, controlled'},
      {name:'BIRD DOGS',             reps:'10/SIDE',      section:'CORE',             tip:'Hold 3s, super slow, no rotation'},
    ]
  },
  { weeks:[7], phase:'program', sets:3,
    dayA:[
      {name:'PUSHUPS',               reps:'20 REPS',      section:'PUSH',             tip:"Full range, perfect form — you've earned this"},
      {name:'SHOULDER PRESS',        reps:'15 REPS',      section:'PUSH',             tip:'Last week of break, give everything'},
      {name:'LATERAL RAISES',        reps:'15 REPS',      section:'PUSH',             tip:'Slow, controlled, feel every rep'},
      {name:'BAND PULL-APARTS',      reps:'15 REPS',      section:'POSTURE',          tip:'Heavier band if available, peak week execution'},
      {name:'PLANK',                 reps:'60 SEC',       section:'CORE',             tip:'One minute. You got this.'},
      {name:'DEAD BUGS',             reps:'12/SIDE',      section:'CORE',             tip:'Perfect form, no shortcuts'},
      {name:'CHIN TUCKS',            reps:'15 REPS',      section:'NECK',             tip:'Your neck will thank you in 20 years'},
    ],
    dayB:[
      {name:'BAND ROWS',             reps:'18 REPS',      section:'PULL',             tip:'Hardest pull set of the program. Go.'},
      {name:'BAND FACE PULLS',       reps:'15 REPS',      section:'PULL',             tip:'Peak week — perfect form, no rushing'},
      {name:'BAND EXTERNAL ROTATION',reps:'15/SIDE',      section:'POSTURE',          tip:'Hold 3s, full rotation, peak week precision'},
      {name:'SQUATS',                reps:'25 REPS',      section:'LEGS',             tip:'Slow tempo, deep squat'},
      {name:'GLUTE BRIDGES',         reps:'25 REPS',      section:'LEGS',             tip:'3s hold at the top every rep'},
      {name:'ROMANIAN DEADLIFT',     reps:'15 REPS',      section:'LEGS',             tip:'Max stretch, controlled all the way'},
      {name:'BIRD DOGS',             reps:'12/SIDE',      section:'CORE',             tip:'Hold 4s, peak week precision'},
    ]
  },
];

// MAINTENANCE PHASE — loops forever after week 7
const MAINTENANCE = {
  phase:'maintenance', sets:4,
  dayA:[
    {name:'PUSHUPS',               reps:'25 REPS',      section:'PUSH',             tip:'Add a book on your back for extra load'},
    {name:'PIKE PUSHUPS',          reps:'10 REPS',      section:'PUSH',             tip:'Hips high, head through arms at the bottom'},
    {name:'SHOULDER PRESS',        reps:'15 REPS',      section:'PUSH',             tip:'Slow tempo, full lockout'},
    {name:'LATERAL RAISES',        reps:'15 REPS',      section:'PUSH',             tip:'No momentum, pure shoulder'},
    {name:'BAND PULL-APARTS',      reps:'20 REPS',      section:'POSTURE',          tip:'Use red or green band now, full range'},
    {name:'PLANK',                 reps:'75 SEC',       section:'CORE',             tip:'Full tension — squeeze glutes and abs'},
    {name:'DEAD BUGS',             reps:'12/SIDE',      section:'CORE',             tip:'Perfect form, slow and controlled'},
    {name:'CHIN TUCKS',            reps:'15 REPS',      section:'NECK',             tip:'Hold 5s, deep cervical flexion'},
  ],
  dayB:[
    {name:'BAND ROWS',             reps:'20 REPS',      section:'PULL',             tip:'Step further back for more resistance'},
    {name:'BAND FACE PULLS',       reps:'15 REPS',      section:'PULL',             tip:'Full external rotation, squeeze hard at peak'},
    {name:'BAND EXTERNAL ROTATION',reps:'15/SIDE',      section:'POSTURE',          tip:'Use a slightly heavier band, hold 3s'},
    {name:'SQUATS',                reps:'30 REPS',      section:'LEGS',             tip:'Hold 5kg dumbbells for added load'},
    {name:'GLUTE BRIDGES',         reps:'25 REPS',      section:'LEGS',             tip:'Single leg if bodyweight too easy'},
    {name:'ROMANIAN DEADLIFT',     reps:'15 REPS',      section:'LEGS',             tip:'Slow eccentric, max stretch'},
    {name:'BIRD DOGS',             reps:'12/SIDE',      section:'CORE',             tip:'Hold 4s, no rotation at all'},
    {name:'SIDE PLANK',            reps:'30 SEC/SIDE',  section:'CORE',             tip:'Both sides equal — important for scoliosis'},
  ]
};

const DAYS     = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS   = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_S = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
