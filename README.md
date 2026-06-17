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



# Interagency Child Protection Ecosystem

**AI-система раннього попередження та захисту дітей**  
*Українсько-естонський GovTech хакатон 2026*

Система об’єднує дані з різних державних реєстрів (освіта, медицина, соціальні служби) та щоденний гейміфікований емоційний моніторинг дитини через Аватара-монстрика для **проактивного виявлення ризиків**.

---

## 🎯 Мета проєкту

1. **Interagency Ecosystem** — єдиний цифровий шлях дитини від народження до повноліття.
2. **Proactive Risk Detection** — раннє виявлення "червоних прапорців" (тривога, депресія, булінг, насильство).
3. **Case Management** — сучасний інструмент для Служб у справах дітей та шкільних психологів.

---

## ✨ Ключові особливості

- Гейміфікований інтерфейс дитини (Аватар-монстрик)
- Аналіз на основі **валідованих клінічних інструментів**: RCADS-11, PHQ-9A, SCARED, CTQ
- 100% анонімізація даних (готовність до Microsoft Presidio)
- Інтеграція з державними реєстрами (MVP — synthetic data fusion)
- Rule Engine + LLM (GPT-4o-mini) гібридна архітектура
- Два фронтенди: дитячий + професійний дашборд

---

## 📁 Повна структура проєкту

```bash
interagency-child-protection-mvp/
├── backend/                          # FastAPI бекенд
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   │   └── config.py
│   │   ├── api/
│   │   │   └── v1/
│   │   │       └── endpoints/
│   │   │           └── logs.py
│   │   ├── models/
│   │   │   └── schemas.py
│   │   ├── services/
│   │   │   ├── openai_service.py
│   │   │   ├── risk_engine.py
│   │   │   └── registry_mock.py
│   │   └── utils/
│   │       └── prompts.py
│   ├── scripts/
│   │   └── seed_fake_data.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend-kid/                     # Дитячий гейміфікований додаток
│   ├── src/
│   │   ├── components/
│   │   │   └── AvatarChat.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── frontend-dashboard/               # Дашборд для фахівців
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── AlertsPanel.tsx
│   │   │   ├── ChildProfile.tsx
│   │   │   ├── RiskTimeline.tsx
│   │   │   └── RegistryFusion.tsx
│   │   ├── pages/
│   │   │   └── Dashboard.tsx
│   │   ├── store/
│   │   │   └── useDashboardStore.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
├── README.md
└── scripts/
    └── demo_data.json                # Генерується автоматично
```
## 🚀 Інструкція з запуску

### 1. Клонування проєкту

```bash
git clone <repository-url>
cd interagency-child-protection-mvp
2. Налаштування OpenAI API ключа (обов’язково)

Скопіюйте приклад змінних середовища:

Bashcp backend/.env.example backend/.env

Відкрийте файл backend/.env та вставте свій ключ:

envOPENAI_API_KEY=sk-proj-your-key-here
ENVIRONMENT=development
Як отримати OpenAI ключ:

Перейдіть на platform.openai.com/api-keys
Натисніть "Create new secret key"
Скопіюйте ключ і вставте у файл .env


3. Запуск через Docker (рекомендований спосіб)
Bashdocker-compose up --build -d


4. Локальний запуск (для розробки)
Backend
Bashcd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
Frontend Kid (Дитячий додаток)
Bashcd frontend-kid
npm install
npm run dev
Frontend Dashboard (для фахівців)
Bashcd frontend-dashboard
npm install
npm run dev

5. Генерація тестових даних
Bashcd backend
python scripts/seed_fake_data.py

🧪 Тестування системи

Відкрийте дитячий додаток → http://localhost:3000
Оберіть настрій монстрика та напишіть повідомлення
Натисніть "Відправити"
Перейдіть на дашборд → http://localhost:3001
Перевірте оновлений ризик, timeline та алерти


🔑 Основні технологічні рішення

Анонімізація: Підготовлено під Microsoft Presidio
Risk Engine: Гібрид LLM + Rule-based з вагами клінічних шкал
Data Fusion: registry_mock.py імітує злиття даних з державних реєстрів
Clinical Basis: RCADS-11, PHQ-9A, SCARED, CTQ items


📋 Для суддів хакатону

Наукова основа — доказова психологія (валідовані інструменти)
Privacy by Design — анонімізація на вході
Scalability — готова до реальних державних API
MVP за 48 годин — повноцінний робочий прототип


🛡️ Безпека та приватність

Всі дані анонімізуються перед відправкою в OpenAI
Використовуються pseudonymized UUID
Рольова модель доступу в дашборді


🚀 Майбутній розвиток

Реальна інтеграція з eKool / Мрія
Whisper для розпізнавання голосу
Повноцінні ML-моделі замість rule-based
Мобільний додаток (React Native)


Команда
Senior GovTech Architect, AI Data Engineer & Clinical Child Psychologist
