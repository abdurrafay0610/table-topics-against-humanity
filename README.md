# Table Topics Against Humanity 🎤🃏

> A dramatic, chaotic, family-friendly improv machine for Toastmasters Table Topics.

Welcome to **Table Topics Against Humanity** — a tiny web app built for one noble purpose:

**to lovingly throw innocent Toastmasters into hilarious, unexpected, speakable chaos.**

Instead of preparing fixed Table Topics like a normal, responsible adult, this app lets you run the session like an improv card game.

First, a raffle chooses the next speaker.
Then, three mysterious cards are revealed:

1. **Role** — who the speaker becomes
2. **Situation** — what is happening
3. **Twist** — the strange angle they must include

Example:

```text
Role: You are a retired superhero
Situation: giving career advice to fresh graduates
Twist: but you secretly regret saving the world
```

And suddenly, your speaker has to deliver:

> “You are a retired superhero giving career advice to fresh graduates, but you secretly regret saving the world.”

Funny? Yes.  
Safe? Also yes.  
A little unhinged? Ideally.

---

## What This App Does

This app has two main pages:

### 1. The Raffle Page

The raffle page randomly selects the next Toastmaster from a list of names.

It is designed to add suspense, drama, and just enough emotional damage to keep the room awake.

Features:

- Reads speaker names from `data/names.txt`
- Dramatically cycles through names before selecting one
- Removes the selected person from the active pool
- Prevents the same person from being selected again
- Includes a reset button to reload the original names

Open it here:

```text
http://localhost:8000/raffle
```

---

### 2. The Table Topics Page

This is where the cards are drawn.

The speaker sees three face-down cards:

- **Role**
- **Situation**
- **Twist**

When the reveal button is pressed, the cards flip over and create a fresh table topic on the spot.

Features:

- Animated card reveal
- Random role, situation, and twist selection
- Editable card banks using simple `.txt` files
- Safe, non-NSFW, Toastmasters-friendly format
- Works locally in your browser

Open it here:

```text
http://localhost:8000/topics
```

---

## Project Structure

```text
table_topics_against_humanity/
├── app.py
├── requirements.txt
├── README.md
├── data/
│   ├── names.txt
│   ├── roles.txt
│   ├── situations.txt
│   └── twists.txt
├── static/
│   ├── styles.css
│   ├── raffle.js
│   └── topics.js
└── templates/
    ├── base.html
    ├── raffle.html
    └── topics.html
```

---

## How to Run

### 1. Open the project folder

```bash
cd table_topics_against_humanity
```

### 2. Create a virtual environment

```bash
python -m venv .venv
```

### 3. Activate the virtual environment

On Linux/macOS:

```bash
source .venv/bin/activate
```

On Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Start the app

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Then open these in your browser:

```text
http://localhost:8000/raffle
http://localhost:8000/topics
```

---

## How to Customize the Session

Everything important lives inside the `data/` folder.

### Add Toastmaster names

Edit:

```text
data/names.txt
```

Add one name per line:

```text
Ali
Fatima
Ahmed
Zainab
```

### Add Role cards

Edit:

```text
data/roles.txt
```

Example:

```text
You are a retired superhero
You are an alien anthropologist
You are a pirate giving a TED Talk
```

### Add Situation cards

Edit:

```text
data/situations.txt
```

Example:

```text
giving career advice to fresh graduates
apologizing to your favorite childhood toy
pitching a terrible business idea to investors
```

### Add Twist cards

Edit:

```text
data/twists.txt
```

Example:

```text
but you secretly regret becoming famous
and you must treat this as a life-changing discovery
but you believe the audience is hiding something from you
```

---

## File Format Rules

The data files are intentionally simple.

Use one item per line:

```text
You are a detective who hates mysteries
You are a robot learning emotions
You are a wizard with poor time management
```

Blank lines are ignored.

Lines starting with `#` are also ignored, so you can leave notes for yourself:

```text
# Serious but funny roles below
You are a philosopher stuck in a shopping mall
You are a motivational speaker who needs motivation
```

---

## Recommended Flow for a Toastmasters Session

A smooth session flow could look like this:

1. Open the raffle page.
2. Click the draw button.
3. Dramatically announce the selected speaker.
4. Ask them to come forward.
5. Open the topics page.
6. Let them press the reveal button.
7. Read the full topic aloud.
8. Let the chaos begin.
9. Repeat until the room runs out of courage.

---

## Safety and Vibe Rules

This app is inspired by the random-card format, not by offensive humor.

The intended vibe is:

- Funny
- Witty
- Weird
- Speakable
- Family-friendly
- Toastmasters-safe
- Occasionally philosophical

Avoid cards involving:

- NSFW content
- Personal attacks
- Religion or sectarian jokes
- Political targeting
- Race, ethnicity, or gender stereotypes
- Anything that would make a guest regret attending

A good card combination should make the speaker think:

> “This is ridiculous… but I can speak on it.”

That is the sweet spot.

---

## Troubleshooting

### `favicon.ico 404`

This is harmless.

Your browser is asking for a tab icon. The app does not currently provide one. Nothing is broken.

### `No names left`

Everyone has already been selected from the raffle pool.

Click **Reset Raffle** or add more names to:

```text
data/names.txt
```

### Cards are not showing

Make sure these files exist and each has at least one non-empty line:

```text
data/roles.txt
data/situations.txt
data/twists.txt
```

### The page does not update after editing files

Refresh the browser.

For names, use the raffle reset button to reload `data/names.txt`.

---

## Tech Stack

Built with:

- **FastAPI** for the backend
- **Jinja2** for HTML templates
- **HTML/CSS/JavaScript** for the frontend
- **Uvicorn** as the local development server

No database.  
No login.  
No cloud.  
No corporate nonsense.

Just cards, chaos, and public speaking.

---

## Final Note

Use responsibly.

The goal is not to embarrass speakers.
The goal is to give them a playful stage where they can practice thinking on their feet.

Or, in more official Toastmasters language:

> This application enhances spontaneous speaking practice through randomized role-based prompt generation.

Or, in human language:

> Press button. Flip cards. Survive speech.
