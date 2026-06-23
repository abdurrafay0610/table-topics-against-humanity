from __future__ import annotations

import random
from pathlib import Path
from typing import Dict, List

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

app = FastAPI(title="Table Topics against Humanity")
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

# In-memory session state. Restarting the app resets the raffle and the card deck.
remaining_names: List[str] | None = None
remaining_cards: Dict[str, List[str]] | None = None

CARD_FILES = {
    "roles": "roles.txt",
    "situations": "situations.txt",
    "twists": "twists.txt",
}


def read_lines(filename: str) -> List[str]:
    """Read a text/CSV-ish file: one item per line, blank lines and # comments ignored."""
    path = DATA_DIR / filename
    if not path.exists():
        raise FileNotFoundError(f"Missing data file: {path}")

    items: List[str] = []
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        items.append(line)
    return items


def read_card_deck() -> Dict[str, List[str]]:
    return {category: read_lines(filename) for category, filename in CARD_FILES.items()}


def get_remaining_names() -> List[str]:
    global remaining_names
    if remaining_names is None:
        remaining_names = read_lines("names.txt")
    return remaining_names


def get_remaining_cards() -> Dict[str, List[str]]:
    global remaining_cards
    if remaining_cards is None:
        remaining_cards = read_card_deck()
    return remaining_cards


def card_counts(deck: Dict[str, List[str]]) -> Dict[str, int]:
    return {category: len(cards) for category, cards in deck.items()}


@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse(request=request, name="raffle.html", context={"title": "Raffle"})


@app.get("/raffle", response_class=HTMLResponse)
def raffle_page(request: Request):
    return templates.TemplateResponse(request=request, name="raffle.html", context={"title": "Raffle"})


@app.get("/topics", response_class=HTMLResponse)
def topics_page(request: Request):
    return templates.TemplateResponse(request=request, name="topics.html", context={"title": "Table Topics"})


@app.get("/api/raffle/list")
def raffle_list():
    names = get_remaining_names()
    return {"remaining": names, "count": len(names)}


@app.post("/api/raffle/draw")
def draw_speaker():
    names = get_remaining_names()
    if not names:
        raise HTTPException(status_code=409, detail="No names left. Reset the raffle or add names.")

    pool_before = names.copy()
    selected = random.choice(names)
    names.remove(selected)

    return {
        "selected": selected,
        "pool_before": pool_before,
        "remaining": names,
        "remaining_count": len(names),
    }


@app.post("/api/raffle/reset")
def reset_raffle():
    global remaining_names
    remaining_names = read_lines("names.txt")
    return {"remaining": remaining_names, "count": len(remaining_names)}


@app.get("/api/cards/status")
def cards_status():
    deck = get_remaining_cards()
    return {"remaining_counts": card_counts(deck)}


@app.post("/api/cards/reset")
def reset_cards():
    global remaining_cards
    remaining_cards = read_card_deck()
    return {"remaining_counts": card_counts(remaining_cards)}


@app.post("/api/cards/draw")
def draw_cards(discard_used: bool = False):
    """
    Draw one Role, one Situation, and one Twist.

    If discard_used=true, the selected cards are removed from the in-memory deck,
    so they cannot appear again until /api/cards/reset is called or the app restarts.
    """
    source_deck = get_remaining_cards() if discard_used else read_card_deck()

    if not source_deck["roles"] or not source_deck["situations"] or not source_deck["twists"]:
        raise HTTPException(
            status_code=409,
            detail="The deck is out of cards in at least one category. Reset the deck or add more cards.",
        )

    role = random.choice(source_deck["roles"])
    situation = random.choice(source_deck["situations"])
    twist = random.choice(source_deck["twists"])

    if discard_used:
        source_deck["roles"].remove(role)
        source_deck["situations"].remove(situation)
        source_deck["twists"].remove(twist)

    return {
        "role": role,
        "situation": situation,
        "twist": twist,
        "full_topic": f"{role} {situation} {twist}",
        "discard_used": discard_used,
        "remaining_counts": card_counts(get_remaining_cards()),
    }