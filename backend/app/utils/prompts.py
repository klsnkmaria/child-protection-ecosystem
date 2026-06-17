# backend/app/utils/prompts.py
"""
Централізоване зберігання всіх промптів для AI-системи Interagency Child Protection Ecosystem.
"""

SYSTEM_PROMPT = """Ти — клінічний інтерпретатор даних для системи раннього попередження захисту дітей (Interagency Child Protection Ecosystem). 
Ти працюєш виключно з анонімізованими даними. Ти ніколи не бачиш персональних даних дитини.

Твоя задача — аналізувати щоденні гейміфіковані логи взаємодії дитини з Аватаром-монстриком, використовуючи ТІЛЬКИ валідовані клінічні інструменти:
- RCADS-11 (Revised Children's Anxiety and Depression Scale)
- PHQ-9A (Patient Health Questionnaire for Adolescents)
- Ключові items зі SCARED та Childhood Trauma Questionnaire (bullying / family safety)

Ти НЕ генеруєш нові питання. Ти інтерпретуєш лише надані логи.

Правила аналізу:
1. Кожна відповідь дитини мапиться на відповідні пункти з RCADS/PHQ-9A.
2. Використовуй вагову модель (0.0–1.0) для кожного маркера.
3. Обчислюй загальний risk_score (0.0–1.0) та суб-скори.
4. Враховуй динаміку (погіршення/покращення за останні 7 днів).
5. Критичні червоні прапорці (особливо суїцидальні думки, насильство, сильна ізоляція) мають пріоритет.

Вхідні дані приходять у форматі:
- Поточний лог (настрій монстрика + текст/голос дитини)
- Історія останніх 7–14 логів (для трендового аналізу)

Вихід повинен бути валідним JSON згідно з JSON Schema. 
Не додавай жодного тексту поза JSON. Не пояснюй, не коментуй.
"""

JSON_SCHEMA = {
    "type": "object",
    "properties": {
        "child_session_id": {"type": "string"},
        "timestamp": {"type": "string", "format": "date-time"},
        "risk_score": {"type": "number", "minimum": 0, "maximum": 1},
        "risk_level": {"enum": ["LOW", "MEDIUM", "HIGH", "CRITICAL"]},
        "category_scores": {
            "type": "object",
            "properties": {
                "depression": {"type": "number", "minimum": 0, "maximum": 1},
                "anxiety": {"type": "number", "minimum": 0, "maximum": 1},
                "bullying": {"type": "number", "minimum": 0, "maximum": 1},
                "family_safety": {"type": "number", "minimum": 0, "maximum": 1},
                "social_withdrawal": {"type": "number", "minimum": 0, "maximum": 1}
            },
            "required": ["depression", "anxiety", "bullying", "family_safety", "social_withdrawal"]
        },
        "red_flags": {
            "type": "array",
            "items": {"type": "string"}
        },
        "matched_scale_items": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "scale": {"type": "string"},
                    "item_id": {"type": "string"},
                    "severity": {"type": "number", "minimum": 0, "maximum": 1},
                    "description": {"type": "string"}
                },
                "required": ["scale", "item_id", "severity", "description"]
            }
        },
        "trend_7days": {"enum": ["improving", "stable", "worsening"]},
        "recommended_action": {
            "type": "string",
            "enum": ["no_action", "monitor", "alert_psychologist", "urgent_intervention"]
        },
        "explanation": {"type": "string", "maxLength": 280}
    },
    "required": [
        "child_session_id", "timestamp", "risk_score", "risk_level",
        "category_scores", "red_flags", "matched_scale_items",
        "trend_7days", "recommended_action", "explanation"
    ]
}

CLINICAL_MAPPING = {
    "questions": [
        {
            "id": 1,
            "clinical_marker": "Anhedonia",
            "scale": "PHQ-9 + RCADS",
            "game_question": "Як сьогодні енергія в твого монстрика? Хоче гратися?",
            "weight": 0.9,
            "category": "depression"
        },
        {
            "id": 2,
            "clinical_marker": "Depressed mood / Hopelessness",
            "scale": "PHQ-9",
            "game_question": "Монстрик сьогодні сумний чи спокійний?",
            "weight": 0.85,
            "category": "depression"
        },
        {
            "id": 3,
            "clinical_marker": "Excessive worry",
            "scale": "RCADS GAD + SCARED",
            "game_question": "Монстрик хвилюється через школу, друзів чи щось інше?",
            "weight": 0.8,
            "category": "anxiety"
        },
        {
            "id": 4,
            "clinical_marker": "Fear of home / Family safety",
            "scale": "Trauma / DV items",
            "game_question": "Монстрик радіє йти додому чи боїться?",
            "weight": 0.95,
            "category": "family_safety"
        },
        {
            "id": 5,
            "clinical_marker": "Bullying / Peer victimization",
            "scale": "CTQ / Bullying items",
            "game_question": "Хтось обзиває, штовхає чи дражнить монстрика?",
            "weight": 0.9,
            "category": "bullying"
        },
        {
            "id": 6,
            "clinical_marker": "Social withdrawal",
            "scale": "RCADS Social Phobia",
            "game_question": "Монстрик сьогодні хоче бути з друзями чи сам?",
            "weight": 0.75,
            "category": "social_withdrawal"
        },
        {
            "id": 7,
            "clinical_marker": "Fatigue / Sleep issues",
            "scale": "PHQ-9 + RCADS",
            "game_question": "Монстрик добре спав? Чи втомлений сьогодні?",
            "weight": 0.7,
            "category": "depression"
        }
    ]
}


def get_full_system_prompt() -> str:
    """Повертає повний system prompt з інструкціями."""
    return SYSTEM_PROMPT


def get_json_schema() -> dict:
    """Повертає JSON Schema для валідації відповіді OpenAI."""
    return JSON_SCHEMA


def get_clinical_mapping() -> dict:
    """Повертає мапінг питань для risk_engine."""
    return CLINICAL_MAPPING
