const drawCardsBtn = document.getElementById("drawCardsBtn");
const resetDeckBtn = document.getElementById("resetDeckBtn");
const discardCardsToggle = document.getElementById("discardCardsToggle");
const topicHint = document.getElementById("topicHint");
const deckStatus = document.getElementById("deckStatus");
const fullTopic = document.getElementById("fullTopic");

const cards = [
  { card: document.getElementById("roleCard"), text: document.getElementById("roleText"), key: "role" },
  { card: document.getElementById("situationCard"), text: document.getElementById("situationText"), key: "situation" },
  { card: document.getElementById("twistCard"), text: document.getElementById("twistText"), key: "twist" },
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function updateDeckStatus(counts) {
  if (!counts) return;

  deckStatus.textContent = `Cards left: ${counts.roles} roles · ${counts.situations} situations · ${counts.twists} twists`;
}

async function loadDeckStatus() {
  try {
    const res = await fetch("/api/cards/status");
    if (!res.ok) return;

    const data = await res.json();
    updateDeckStatus(data.remaining_counts);
  } catch (_) {
    deckStatus.textContent = "Deck status unavailable.";
  }
}

async function resetDeck() {
  resetDeckBtn.disabled = true;
  topicHint.textContent = "Resetting the deck. The chaos has been forgiven.";

  try {
    const res = await fetch("/api/cards/reset", { method: "POST" });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Could not reset deck.");
    }

    const data = await res.json();
    updateDeckStatus(data.remaining_counts);
    topicHint.textContent = "Deck reset. All cards are back in play.";
  } catch (error) {
    topicHint.textContent = error.message;
  } finally {
    resetDeckBtn.disabled = false;
  }
}

async function drawCards() {
  drawCardsBtn.disabled = true;
  resetDeckBtn.disabled = true;
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
    const discardUsed = discardCardsToggle.checked;
    const res = await fetch(`/api/cards/draw?discard_used=${discardUsed}`, { method: "POST" });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Could not draw cards.");
    }
    data = await res.json();
  } catch (error) {
    topicHint.textContent = error.message;
    drawCardsBtn.disabled = false;
    resetDeckBtn.disabled = false;
    return;
  }

  for (const item of cards) {
    item.text.textContent = data[item.key];
    item.card.classList.add("revealed");
    await sleep(650);
  }

  topicHint.textContent = data.discard_used
    ? "The topic has spoken. These cards have left the building."
    : "The topic has spoken.";
  fullTopic.textContent = data.full_topic;
  fullTopic.classList.add("visible");
  updateDeckStatus(data.remaining_counts);

  drawCardsBtn.disabled = false;
  resetDeckBtn.disabled = false;
}

drawCardsBtn.addEventListener("click", drawCards);
resetDeckBtn.addEventListener("click", resetDeck);

const DISCARD_KEY = "ttah_discard_used";

// Restore the toggle from the last visit
discardCardsToggle.checked = localStorage.getItem(DISCARD_KEY) === "true";

// Remember it whenever it changes
discardCardsToggle.addEventListener("change", () => {
  localStorage.setItem(DISCARD_KEY, discardCardsToggle.checked);
});

loadDeckStatus();