const LETTERS = "abcde";
let session = null;
const show = makeShow(["menu","quiz","results"]);
function goHome(){ session = null; show("menu"); }

/* grids are pre-rendered at build time — just attach handlers */
document.querySelectorAll("#chapterGrid .chapBtn").forEach(b => {
  b.onclick = () => startQuiz(+b.dataset.ch, false);
});
document.querySelector('[data-start="all"]').onclick = () => startQuiz("all", false);
document.querySelector('[data-start="random50"]').onclick = () => startQuiz("all", true);

function buildPool(scope){
  let pool = [];
  BANK.forEach(ch => {
    if(scope === "all" || ch.num === scope){
      ch.questions.forEach(q => pool.push({...q, chNum: ch.num, chTitle: ch.title}));
    }
  });
  return pool;
}

function startQuiz(scope, random50, customPool){
  let pool = customPool ? customPool.slice() : buildPool(scope);
  const doShuffle = document.getElementById("shuffleChk").checked || random50 || customPool;
  if(doShuffle) shuffle(pool);
  if(random50) pool = pool.slice(0, 50);
  session = {
    pool, idx: 0, correct: 0, missed: [],
    perCh: {},
    title: customPool ? "Retry Missed" : (scope === "all" ? (random50 ? "Random 50" : "All Chapters") : "Chapter " + scope)
  };
  show("quiz");
  renderQ();
}

function renderQ(){
  const s = session, q = s.pool[s.idx];
  const multi = q.answer.length > 1;
  q._order = shuffle(q.options.map((_,i)=>i));
  s.selected = new Set();
  s.answered = false;

  document.getElementById("quizTitle").textContent = s.title;
  document.getElementById("quizProgressText").textContent = `Question ${s.idx+1} / ${s.pool.length}`;
  document.getElementById("quizScoreText").textContent = `Score: ${s.correct} ✓`;
  document.getElementById("bar").style.width = (100*s.idx/s.pool.length) + "%";
  document.getElementById("qMeta").textContent = `Ch ${q.chNum} — ${q.chTitle.replace(/\s*\([^)]*\)\s*$/, "")} · Q${q.id}` + (multi ? ` · choose ${q.answer.length}` : "");
  document.getElementById("qText").textContent = q.q;
  const ex = document.getElementById("qExhibit");
  if(q.exhibit){ ex.textContent = q.exhibit; ex.classList.remove("hidden"); }
  else { ex.classList.add("hidden"); }
  document.getElementById("feedback").innerHTML = "";
  document.getElementById("nextBtn").classList.add("hidden");
  document.getElementById("submitBtn").classList.toggle("hidden", !multi);
  document.getElementById("submitBtn").disabled = true;

  const opts = document.getElementById("opts");
  opts.innerHTML = "";
  q._order.forEach((origIdx, dispIdx) => {
    const btn = document.createElement("button");
    btn.className = "opt";
    btn.dataset.orig = origIdx;
    btn.innerHTML = `<span class="letter">${LETTERS[dispIdx]}.</span><span>${escapeHtml(q.options[origIdx])}</span>`;
    btn.onclick = () => multi ? toggleSel(btn) : answerSingle(origIdx);
    opts.appendChild(btn);
  });
}

function toggleSel(btn){
  if(session.answered) return;
  const orig = +btn.dataset.orig;
  if(session.selected.has(orig)){ session.selected.delete(orig); btn.classList.remove("selected"); }
  else { session.selected.add(orig); btn.classList.add("selected"); }
  document.getElementById("submitBtn").disabled = session.selected.size === 0;
}

function answerSingle(origIdx){
  if(session.answered) return;
  grade([origIdx]);
}
function submitMulti(){
  if(session.answered) return;
  grade([...session.selected]);
}

function grade(chosen){
  const s = session, q = s.pool[s.idx];
  s.answered = true;
  const correctSet = new Set(q.answer);
  const isRight = chosen.length === q.answer.length && chosen.every(c => correctSet.has(c));
  if(isRight) s.correct++; else s.missed.push({q, chosen});

  const key = q.chNum;
  s.perCh[key] = s.perCh[key] || {right:0, total:0, title:q.chTitle};
  s.perCh[key].total++; if(isRight) s.perCh[key].right++;

  document.querySelectorAll("#opts .opt").forEach(btn => {
    const orig = +btn.dataset.orig;
    btn.classList.remove("selected");
    if(correctSet.has(orig)) btn.classList.add("correct");
    else if(chosen.includes(orig)) btn.classList.add("wrong");
    else btn.classList.add("dim");
    btn.style.cursor = "default";
  });

  const correctLetters = q.answer.map(a => LETTERS[q._order.indexOf(a)]).sort().join(", ");
  const fb = document.getElementById("feedback");
  fb.innerHTML = `<div class="feedback ${isRight?"good":"bad"}">
      <div class="verdict">${isRight ? "✓ Correct" : "✗ Incorrect — answer: " + correctLetters}</div>
      <div>${escapeHtml(q.explanation || "")}</div></div>`;

  document.getElementById("submitBtn").classList.add("hidden");
  document.getElementById("nextBtn").classList.remove("hidden");
  document.getElementById("quizScoreText").textContent = `Score: ${s.correct} ✓`;
}

function nextQ(){
  session.idx++;
  if(session.idx >= session.pool.length) return showResults();
  renderQ();
}

function pctClass(p){ return p >= 85 ? "pct-good" : p >= 70 ? "pct-mid" : "pct-bad"; }

function showResults(){
  const s = session;
  const pct = Math.round(100 * s.correct / s.pool.length);
  document.getElementById("finalScore").textContent = pct + "%";
  document.getElementById("finalScore").className = "scoreBig " + pctClass(pct);
  document.getElementById("finalSub").textContent = `${s.correct} of ${s.pool.length} correct — ${pct >= 85 ? "exam ready on this material" : pct >= 70 ? "close — review the misses" : "needs another pass"}`;

  const tb = document.querySelector("#breakdownTable tbody");
  tb.innerHTML = "";
  Object.keys(s.perCh).sort((a,b)=>a-b).forEach(k => {
    const c = s.perCh[k];
    const p = Math.round(100*c.right/c.total);
    tb.insertAdjacentHTML("beforeend",
      `<tr><td>Ch ${k} — ${escapeHtml(c.title.replace(/\s*\([^)]*\)\s*$/, ""))}</td><td>${c.right}/${c.total}</td><td class="${pctClass(p)}">${p}%</td></tr>`);
  });
  document.getElementById("chapterBreakdownCard").style.display = Object.keys(s.perCh).length > 1 ? "" : "none";

  const ml = document.getElementById("missedList");
  ml.innerHTML = "";
  if(s.missed.length === 0){
    document.getElementById("missedCard").style.display = "none";
    document.getElementById("retryMissedBtn").style.display = "none";
  } else {
    document.getElementById("missedCard").style.display = "";
    document.getElementById("retryMissedBtn").style.display = "";
    s.missed.forEach(m => {
      const ansText = m.q.answer.map(a => m.q.options[a]).join(" / ");
      const exhibitHtml = m.q.exhibit ? `<pre class="exhibit" style="margin:8px 0;">${escapeHtml(m.q.exhibit)}</pre>` : "";
      ml.insertAdjacentHTML("beforeend",
        `<div class="missedQ"><strong>Q${m.q.id}</strong> (Ch ${m.q.chNum}) — ${escapeHtml(m.q.q)}${exhibitHtml}<br>
         <span class="ans">Answer: ${escapeHtml(ansText)}</span><br>
         <span style="color:var(--muted)">${escapeHtml(m.q.explanation || "")}</span></div>`);
    });
  }
  show("results");
}

function retryMissed(){
  const pool = session.missed.map(m => m.q);
  startQuiz(null, false, pool);
}
