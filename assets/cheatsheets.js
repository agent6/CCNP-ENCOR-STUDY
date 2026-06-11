const show = makeShow(["menu","sheetView"]);
function goHome(){ show("menu"); }

document.getElementById("sheetCount").textContent = CHEATS.length;
const sheetGrid = document.getElementById("sheetGrid");
CHEATS.forEach((s, i) => {
  const b = document.createElement("button");
  b.className = "chapBtn";
  b.innerHTML = `<span class="num">Ch ${s.num}</span> ${s.title} <span class="cnt">cheat sheet</span>`;
  b.onclick = () => openSheet(i);
  sheetGrid.appendChild(b);
});

function openSheet(i){
  const s = CHEATS[i];
  document.getElementById("sheetTitle").textContent = `Ch ${s.num} — ${s.title}`;
  document.getElementById("sheetBody").innerHTML = s.html;
  show("sheetView");
}
