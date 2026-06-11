document.getElementById("labCount").textContent = LABS.reduce((s,g)=>s+g.labs.length,0);
const labList = document.getElementById("labList");
LABS.forEach(group => {
  const h = document.createElement("div");
  h.className = "labSection";
  h.textContent = group.section;
  labList.appendChild(h);
  group.labs.forEach(l => {
    const row = document.createElement("div");
    row.className = "labRow";
    row.innerHTML =
      `<div class="labTitle">${escapeHtml(l.title)}<br><span class="labId">${escapeHtml(l.id)}</span></div>` +
      `<span class="labTasks">${l.tasks} tasks</span>` +
      `<a class="labLink" href="${l.guide}" target="_blank" rel="noopener">Open guide</a>` +
      `<a class="labLink" href="${l.cml}" download>CML YAML</a>`;
    labList.appendChild(row);
  });
});
