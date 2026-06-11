/* List is pre-rendered at build time; each View link carries its data. */
const show = makeShow(["menu","infView"]);
function goHome(){ show("menu"); }

document.querySelectorAll("#infList [data-file]").forEach(a => {
  a.onclick = (e) => {
    e.preventDefault();
    document.getElementById("infTitle").textContent = a.dataset.topic + " — " + a.dataset.title;
    const img = document.getElementById("infImg");
    img.src = a.dataset.webp || a.dataset.file;   // webp preview loads ~5-10x faster
    img.alt = a.dataset.title;
    document.getElementById("infFull").href = a.dataset.file;
    show("infView");
  };
});
