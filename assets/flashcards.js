let fc = null;
const show = makeShow(["menu","cards"]);
function goHome(){ fc = null; show("menu"); }

const flashTotal = FLASH.reduce((s,c)=>s+c.cards.length,0);
document.getElementById("flashCount").textContent = flashTotal;
const flashGrid = document.getElementById("flashGrid");
FLASH.forEach(ch => {
  const b = document.createElement("button");
  b.className = "chapBtn";
  b.innerHTML = `<span class="num">Ch ${ch.num}</span> ${ch.title} <span class="cnt">${ch.cards.length} cards</span>`;
  b.onclick = () => startCards(ch.num);
  flashGrid.appendChild(b);
});

function startCards(scope){
  let deck = [];
  FLASH.forEach(ch => {
    if(scope === "all" || ch.num === scope)
      ch.cards.forEach(c => deck.push({...c, chNum: ch.num}));
  });
  shuffle(deck);
  fc = { deck, done: 0, total: deck.length, flipped: false,
         title: scope === "all" ? "All Flashcards" : "Chapter " + scope };
  show("cards");
  renderCard();
}

function renderCard(){
  if(fc.deck.length === 0) return finishCards();
  const c = fc.deck[0];
  fc.flipped = false;
  document.getElementById("fcTitle").textContent = fc.title;
  document.getElementById("fcProgress").textContent = `${fc.done} / ${fc.total} done · ${fc.deck.length} left`;
  document.getElementById("fcBar").style.width = (100*fc.done/fc.total) + "%";
  document.getElementById("fcChapter").textContent = "Ch " + c.chNum;
  document.getElementById("fcContent").textContent = c.front;
  document.getElementById("fcContent").className = "fcSide front";
  document.getElementById("fcHint").textContent = "tap to flip";
  document.getElementById("fcAgain").disabled = true;
  document.getElementById("fcGot").disabled = true;
}

function flipCard(){
  if(!fc || fc.deck.length === 0) return;
  const c = fc.deck[0];
  fc.flipped = !fc.flipped;
  const el = document.getElementById("fcContent");
  el.textContent = fc.flipped ? c.back : c.front;
  el.className = "fcSide" + (fc.flipped ? "" : " front");
  document.getElementById("fcHint").textContent = fc.flipped ? "tap to flip back" : "tap to flip";
  document.getElementById("fcAgain").disabled = false;
  document.getElementById("fcGot").disabled = false;
}

function cardAgain(){
  const c = fc.deck.shift();
  const pos = Math.min(fc.deck.length, 5 + Math.floor(Math.random()*5));
  fc.deck.splice(pos, 0, c);
  renderCard();
}

function cardGot(){
  fc.deck.shift();
  fc.done++;
  renderCard();
}

function finishCards(){
  document.getElementById("fcBar").style.width = "100%";
  document.getElementById("fcChapter").textContent = "";
  document.getElementById("fcContent").textContent = "Deck complete — " + fc.total + " cards mastered. 🎉";
  document.getElementById("fcContent").className = "fcSide front";
  document.getElementById("fcHint").textContent = "";
  document.getElementById("fcProgress").textContent = `${fc.done} / ${fc.total} done`;
  document.getElementById("fcAgain").disabled = true;
  document.getElementById("fcGot").disabled = true;
  setTimeout(()=>{ if(fc) goHome(); }, 2200);
}
