const drawCardsBtn = document.getElementById("drawCardsBtn");
const topicHint = document.getElementById("topicHint");
const fullTopic = document.getElementById("fullTopic");

const cards = [
  { card: document.getElementById("roleCard"), text: document.getElementById("roleText"), key: "role" },
  { card: document.getElementById("situationCard"), text: document.getElementById("situationText"), key: "situation" },
  { card: document.getElementById("twistCard"), text: document.getElementById("twistText"), key: "twist" },
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function drawCards() {
  drawCardsBtn.disabled = true;
  fullTopic.classList.remove("visible");
  fullTopic.textContent = "";
  topicHint.textContent = "Shuffling chaos...";

  cards.forEach(({ card, text }) => {
    card.classList.remove("revealed");
    text.textContent = "—";
  });

  await sleep(450);

  let data;
  try {
    const res = await fetch("/api/cards/draw", { method: "POST" });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Could not draw cards.");
    }
    data = await res.json();
  } catch (error) {
    topicHint.textContent = error.message;
    drawCardsBtn.disabled = false;
    return;
  }

  for (const item of cards) {
    item.text.textContent = data[item.key];
    item.card.classList.add("revealed");
    await sleep(650);
  }

  topicHint.textContent = "The topic has spoken.";
  fullTopic.textContent = data.full_topic;
  fullTopic.classList.add("visible");
  drawCardsBtn.disabled = false;
}

drawCardsBtn.addEventListener("click", drawCards);
