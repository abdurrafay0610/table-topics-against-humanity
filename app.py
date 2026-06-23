from __future__ import annotations

import random
from pathlib import Path
from typing import List

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

app = FastAPI(title="Table Topics against Humanity")
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

# In-memory session state. Restarting the app resets the raffle.
remaining_names: List[str] | None = None


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


def get_remaining_names() -> List[str]:
    global remaining_names
    if remaining_names is None:
        remaining_names = read_lines("names.txt")
    return remaining_names


@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    # return templates.TemplateResponse("raffle.html", {"request": request, "title": "Raffle"})
    return templates.TemplateResponse(request=request, name="raffle.html", context={"title": "Raffle"})


@app.get("/raffle", response_class=HTMLResponse)
def raffle_page(request: Request):
    # return templates.TemplateResponse("raffle.html", {"request": request, "title": "Raffle"})
    return templates.TemplateResponse(request=request, name="raffle.html", context={"title": "Raffle"})


@app.get("/topics", response_class=HTMLResponse)
def topics_page(request: Request):
    # return templates.TemplateResponse("topics.html", {"request": request, "title": "Table Topics"})
    return templates.TemplateResponse(request=request, name="topics.html", context={"title": "Table Topics against Humanity"})


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


@app.post("/api/cards/draw")
def draw_cards():
    roles = read_lines("roles.txt")
    situations = read_lines("situations.txt")
    twists = read_lines("twists.txt")

    if not roles or not situations or not twists:
        raise HTTPException(
            status_code=400,
            detail="roles.txt, situations.txt, and twists.txt must each contain at least one card.",
        )

    role = random.choice(roles)
    situation = random.choice(situations)
    twist = random.choice(twists)

    return {
        "role": role,
        "situation": situation,
        "twist": twist,
        "full_topic": f"{role} {situation} {twist}",
    }
