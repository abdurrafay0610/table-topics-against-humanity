# Table Topics against Humanity

A local FastAPI web app for a Toastmasters Table Topics session.

## Features

- Raffle page that draws one Toastmaster randomly.
- Selected names are removed from the current raffle pool.
- Reset button reloads names from `data/names.txt`.
- Card page with 3 animated face-down cards:
  - Role
  - Situation
  - Twist
- Cards are loaded from simple editable text files.

## Run

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Then open:

- `http://localhost:8000/raffle`
- `http://localhost:8000/topics`

## Edit session data

Put one item per line in these files:

- `data/names.txt`
- `data/roles.txt`
- `data/situations.txt`
- `data/twists.txt`

Blank lines and lines starting with `#` are ignored.
