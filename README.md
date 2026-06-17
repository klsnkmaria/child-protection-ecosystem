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
interagency-child-protection-mvp/
├── README.md                     # Інструкції, як запустити, пітч notes
├── docker-compose.yml            # Для локального запуску (optional)
├── .env.example                  # API keys (OpenAI, Supabase)
│
├── frontend-kid/                 # Дитячий додаток (React + Vite)
│   ├── public/
│   │   └── avatar-monster.svg    # Аватар (можна генерувати)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AvatarChat.tsx
│   │   │   ├── MoodSwiper.tsx
│   │   │   ├── LogInput.tsx
│   │   │   └── MonsterFeedback.tsx
│   │   ├── pages/
│   │   │   └── Home.tsx
│   │   ├── services/
│   │   │   └── api.ts            # calls to backend
│   │   ├── utils/
│   │   │   ├── anonymizer.ts
│   │   │   └── moodMapper.ts
│   │   ├── types/
│   │   │   └── log.ts            # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── tailwind.config.js
│
├── frontend-dashboard/           # Дашборд для фахівців
│   ├── src/
│   │   ├── components/
│   │   │   ├── RiskTimeline.tsx
│   │   │   ├── AlertsPanel.tsx
│   │   │   ├── ChildProfile.tsx
│   │   │   ├── RegistryFusion.tsx
│   │   │   └── CaseNotes.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   └── CaseView.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── store/                # Zustand / Redux
│   │   ├── types/
│   │   └── App.tsx
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                      # Основний бекенд (рекомендую Python FastAPI)
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py       # JWT + role-based
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── endpoints/
│   │   │   │   │   ├── logs.py
│   │   │   │   │   └── dashboard.py
│   │   │   │   └── router.py
│   │   ├── services/
│   │   │   ├── openai_service.py # System Prompt + JSON mode
│   │   │   ├── risk_engine.py    # Mapping + scoring
│   │   │   ├── anonymizer.py     # Presidio wrapper
│   │   │   └── registry_mock.py  # Synthetic data
│   │   ├── models/
│   │   │   └── schemas.py        # Pydantic models (JSON Schema)
│   │   ├── db/
│   │   │   ├── session.py
│   │   │   └── models.py         # SQLAlchemy
│   │   └── utils/
│   │       └── prompts.py        # Повний System Prompt
│   ├── tests/
│   ├── requirements.txt
│   └── alembic/                  # Migrations (optional)
│
├── shared/                       # Спільні типи та constants
│   └── types/
│       ├── risk.ts
│       └── clinical_mapping.json # 7 питань + ваги
│
├── docs/
│   ├── architecture.md
│   ├── clinical_evidence.md      # RCADS, PHQ-9 mapping
│   └── pitch_deck.md
│
└── scripts/
    └── seed_fake_data.py         # Для демо
```
