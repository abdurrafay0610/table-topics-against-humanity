const drawBtn = document.getElementById("drawBtn");
const resetBtn = document.getElementById("resetBtn");
const nameWindow = document.getElementById("nameWindow");
const dramaticLine = document.getElementById("dramaticLine");
const remainingList = document.getElementById("remainingList");
const remainingCount = document.getElementById("remainingCount");

const lines = [
  "The universe is consulting its notes...",
  "Destiny is pretending to be random...",
  "The grammarian has been warned...",
  "A brave speaker approaches the stage...",
  "The chaos committee has reached a decision..."
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadRemaining() {
  const res = await fetch("/api/raffle/list");
  const data = await res.json();
  renderRemaining(data.remaining);
}

function renderRemaining(names) {
  remainingCount.textContent = `${names.length} speaker${names.length === 1 ? "" : "s"} remaining`;
  remainingList.innerHTML = "";
  names.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    remainingList.appendChild(li);
  });
}

async function drawSpeaker() {
  drawBtn.disabled = true;
  resetBtn.disabled = true;
  nameWindow.classList.remove("winner");
  nameWindow.classList.add("spinning");
  dramaticLine.textContent = lines[Math.floor(Math.random() * lines.length)];

  let data;
  try {
    const res = await fetch("/api/raffle/draw", { method: "POST" });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Could not draw a speaker.");
    }
    data = await res.json();
  } catch (error) {
    nameWindow.classList.remove("spinning");
    nameWindow.textContent = "No names left";
    dramaticLine.textContent = error.message;
    drawBtn.disabled = false;
    resetBtn.disabled = false;
    return;
  }

  const pool = data.pool_before;
  const start = performance.now();
  const duration = 2850;
  let delay = 45;

  while (performance.now() - start < duration) {
    const randomName = pool[Math.floor(Math.random() * pool.length)];
    nameWindow.textContent = randomName;
    await sleep(delay);
    delay = Math.min(delay + 5, 145);
  }

  nameWindow.classList.remove("spinning");
  nameWindow.classList.add("winner");
  nameWindow.textContent = data.selected;
  dramaticLine.textContent = "Your topic awaits. No pressure. Except all of it.";
  renderRemaining(data.remaining);

  drawBtn.disabled = false;
  resetBtn.disabled = false;
}

async function resetRaffle() {
  resetBtn.disabled = true;
  const res = await fetch("/api/raffle/reset", { method: "POST" });
  const data = await res.json();
  renderRemaining(data.remaining);
  nameWindow.classList.remove("winner", "spinning");
  nameWindow.textContent = "Ready?";
  dramaticLine.textContent = "Raffle reset. Everyone is in danger again.";
  resetBtn.disabled = false;
}

drawBtn.addEventListener("click", drawSpeaker);
resetBtn.addEventListener("click", resetRaffle);
loadRemaining();
