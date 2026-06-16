ICPE - Interagency Child Protection Ecosystem

> UA–EE Hackathon MVP · Early Warning System for child risk detection

## Architecture

```
Child Avatar App (React)
        │  raw text + mood
        ▼
De-identification (Presidio)
        │  anon vector
        ▼
FastAPI Backend
  ├─ Prompt Builder  (injects CBT/RCADS rules)
  ├─ OpenAI API      (intent NLP → risk JSON)
  └─ Risk Scorer     (threshold + flag logic)
        │
        ├──► Postgres  (anon sessions + alerts)
        └──► Case Dashboard (React)
               ├─ Child profile  (avatar score + mock registry merge)
               ├─ Alert timeline
               └─ Action panel
```

## Repo structure

```
icpe/
├── backend/          # FastAPI · Python 3.11
│   ├── app/
│   │   ├── api/      # route handlers
│   │   ├── core/     # config, security, logging
│   │   ├── models/   # SQLAlchemy ORM
│   │   ├── schemas/  # Pydantic I/O schemas
│   │   └── services/ # business logic (pipeline, scorer, presidio)
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
├── infra/
│   └── docker-compose.yml
├── docs/
│   ├── architecture.md
│   └── data-model.md
└── .github/
    └── workflows/ci.yml
```

> **Frontends live in separate repos** linked as git submodules (or sibling dirs):
> `icpe-child-app/` (React) · `icpe-dashboard/` (React)

## Quick start

```bash
cp backend/.env.example backend/.env   # add OPENAI_API_KEY
cd infra && docker compose up --build
# API: http://localhost:8000
# Docs: http://localhost:8000/docs
```

## Privacy model

All child text is de-identified via Microsoft Presidio **before** any AI call.
The AI model receives only anonymous vectors — never names, IDs, or raw speech.
