# scripts/seed_fake_data.py
"""
Скрипт для генерації фейкових даних для демо Interagency Child Protection Ecosystem.
Використовується для:
- Тестування Risk Engine
- Демо дашборду
- Пітчу на хакатоні
"""

import asyncio
import json
from datetime import datetime, timedelta
import random

from app.models.schemas import (
    ChildLogInput, 
    MoodLog, 
    RiskAnalysisResponse, 
    SyntheticRegistryData
)
from app.services.risk_engine import risk_engine
from app.services.openai_service import analyze_child_log_sync


def generate_fake_logs(n: int = 12):
    """Генерує фейкові логи для однієї дитини"""
    moods = ["very_low_energy", "low", "neutral", "good", "very_good"]
    texts = [
        "Монстрик сьогодні сумний і не хоче гратися з друзями",
        "В школі хтось обзиває монстрика",
        "Монстрик боїться йти додому",
        "Все добре, монстрик веселий!",
        "Монстрик дуже втомлений і хвилюється через оцінки",
        "Хтось штовхав монстрика на перерві",
        "Монстрик хоче бути сам",
    ]

    logs = []
    start_date = datetime.utcnow() - timedelta(days=n)
    
    for i in range(n):
        date = start_date + timedelta(days=i)
        mood = random.choice(moods)
        text = random.choice(texts) if random.random() > 0.4 else ""
        
        logs.append({
            "timestamp": date.isoformat(),
            "mood_swipe": mood,
            "text": text
        })
    
    return logs


async def seed_sample_child():
    """Створює повний демо-профіль дитини з аналізом ризиків"""
    child_session_id = "demo_child_anon_748392"
    
    print(f"🚀 Генеруємо демо-дані для дитини {child_session_id}...")
    
    # 1. Генерація логів
    history_logs = generate_fake_logs(12)
    current_log = history_logs[-1]
    
    print("📊 Поточний лог:")
    print(json.dumps(current_log, ensure_ascii=False, indent=2))
    
    # 2. Аналіз через Risk Engine
    log_input = ChildLogInput(
        child_session_id=child_session_id,
        current_log=MoodLog(
            mood_swipe=current_log["mood_swipe"],
            text=current_log.get("text")
        ),
        history_logs=history_logs[:-1]
    )
    
    try:
        analysis = await risk_engine.analyze_log(
            openai_service=None,  # використовуємо внутрішній виклик
            child_session_id=child_session_id,
            current_log=log_input.current_log.dict(),
            history_logs=log_input.history_logs
        )
        
        print("\n✅ Аналіз ризику:")
        print(json.dumps(analysis.dict(), ensure_ascii=False, indent=2))
        
        # 3. Synthetic Registry Data (імітація державних реєстрів)
        registry_data = SyntheticRegistryData(
            school_grades_trend="declining",
            recent_absences=random.randint(2, 8),
            family_status="divorce_recent",
            medical_visits_last_month=random.randint(0, 3),
            known_risks=["possible_bullying", "family_stress"]
        )
        
        print("\n🏛️ Synthetic Registry Data:")
        print(json.dumps(registry_data.dict(), ensure_ascii=False, indent=2))
        
        # 4. Збереження в JSON для дашборду
        demo_data = {
            "child_session_id": child_session_id,
            "analysis": analysis.dict(),
            "registry": registry_data.dict(),
            "history_logs": history_logs,
            "generated_at": datetime.utcnow().isoformat()
        }
        
        with open("scripts/demo_data.json", "w", encoding="utf-8") as f:
            json.dump(demo_data, f, ensure_ascii=False, indent=2)
            
        print("\n💾 Демо-дані збережено в scripts/demo_data.json")
        
    except Exception as e:
        print(f"❌ Помилка: {e}")


def generate_multiple_children(count: int = 5):
    """Генерує дані для кількох дітей (для дашборду)"""
    children = []
    for i in range(count):
        child = {
            "child_session_id": f"demo_child_anon_{1000 + i}",
            "risk_score": round(random.uniform(0.15, 0.92), 2),
            "risk_level": random.choice(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
            "main_concern": random.choice(["depression", "bullying", "family_safety", "anxiety"]),
            "last_active": (datetime.utcnow() - timedelta(days=random.randint(0, 3))).isoformat()
        }
        children.append(child)
    
    with open("scripts/dashboard_demo_children.json", "w", encoding="utf-8") as f:
        json.dump(children, f, ensure_ascii=False, indent=2)
    
    print(f"📈 Згенеровано {count} фейкових дітей для дашборду")


if __name__ == "__main__":
    print("🌱 Запуск seed fake data для Child Protection MVP...\n")
    
    # Запуск асинхронного сідингу
    asyncio.run(seed_sample_child())
    
    # Дані для дашборду
    generate_multiple_children(8)
    
    print("\n🎉 Seed completed! Готово до демо.")
