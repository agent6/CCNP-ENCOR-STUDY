/* INFOGRAPHS stages the FULL v1.2 exam-topic tree; domains/topics render
   only once at least one infographic is attached to them. */
const show = makeShow(["menu","infView"]);
function goHome(){ show("menu"); }

const infFlat = [];
const infList = document.getElementById("infList");
INFOGRAPHS.forEach(dom => {
  const covered = dom.topics.filter(t => t.graphs && t.graphs.length);
  if (!covered.length) return;
  const h = document.createElement("div");
  h.className = "labSection";
  h.textContent = dom.domain;
  infList.appendChild(h);
  covered.forEach(t => t.graphs.forEach(g => {
    const i = infFlat.length;
    infFlat.push({ topic: t.id, title: t.title, file: g.file, webp: g.webp });
    const row = document.createElement("div");
    row.className = "labRow";
    row.innerHTML =
      `<span class="infTopic">${escapeHtml(t.id)}</span>` +
      `<div class="labTitle">${escapeHtml(t.title)}<br><span class="labId">${escapeHtml(g.subtitle || "")}</span></div>` +
      `<a class="labLink" href="#" data-inf="${i}">View</a>` +
      `<a class="labLink" href="${g.file}" target="_blank" rel="noopener">Full size</a>`;
    row.querySelector("[data-inf]").onclick = (e) => { e.preventDefault(); openInf(i); };
    infList.appendChild(row);
  }));
});
document.getElementById("infCount").textContent = infFlat.length;

function openInf(i){
  const g = infFlat[i];
  document.getElementById("infTitle").textContent = `${g.topic} — ${g.title}`;
  const img = document.getElementById("infImg");
  img.src = g.webp || g.file;   // webp preview loads ~5-10x faster
  img.alt = g.title;
  document.getElementById("infFull").href = g.file;
  show("infView");
}
