# backend/app/services/registry_mock.py
"""
Mock сервіс державних реєстрів для MVP Interagency Child Protection Ecosystem.
Імітує інтеграцію з:
- Освітніми системами (eKool / Мрія)
- Медичними записами
- Соціальними службами / Реєстром сім'ї
"""

import random
from datetime import datetime, timedelta
from typing import Dict, Any, List

from app.models.schemas import SyntheticRegistryData


class RegistryMockService:
    """
    Фейковий сервіс для демонстрації злиття даних з різних державних реєстрів.
    У реальній системі тут будуть API-клієнти до реальних реєстрів.
    """

    def __init__(self):
        self.school_trends = ["improving", "stable", "declining"]
        self.family_statuses = [
            "stable", 
            "single_parent", 
            "divorce_recent", 
            "high_conflict", 
            "foster_care"
        ]

    def get_synthetic_data(self, child_session_id: str) -> SyntheticRegistryData:
        """Повертає синтетичні дані з реєстрів для конкретної дитини"""
        random.seed(child_session_id)  # Для відтворюваності демо

        return SyntheticRegistryData(
            school_grades_trend=random.choice(self.school_trends),
            recent_absences=random.randint(0, 12),
            family_status=random.choice(self.family_statuses),
            medical_visits_last_month=random.randint(0, 5),
            known_risks=self._generate_known_risks()
        )

    def _generate_known_risks(self) -> List[str]:
        risks_pool = [
            "possible_bullying",
            "family_stress",
            "academic_decline",
            "frequent_medical_visits",
            "behavioral_issues_school",
            "suspected_neglect",
            "peer_conflicts"
        ]
        return random.sample(risks_pool, k=random.randint(1, 3))

    def get_fused_risk_profile(self, child_session_id: str, ai_risk_score: float) -> Dict[str, Any]:
        """
        Злиття AI-аналізу з даними реєстрів — ключова цінність системи.
        """
        registry = self.get_synthetic_data(child_session_id)
        
        # Проста логіка підвищення ризику на основі реєстрів
        registry_multiplier = 1.0
        
        if registry.school_grades_trend == "declining":
            registry_multiplier += 0.25
        if registry.recent_absences > 5:
            registry_multiplier += 0.2
        if registry.family_status in ["divorce_recent", "high_conflict"]:
            registry_multiplier += 0.35
        if "suspected_neglect" in registry.known_risks:
            registry_multiplier += 0.4

        fused_score = min(ai_risk_score * registry_multiplier, 1.0)
        
        risk_level = "CRITICAL" if fused_score >= 0.85 else \
                     "HIGH" if fused_score >= 0.65 else \
                     "MEDIUM" if fused_score >= 0.4 else "LOW"

        return {
            "child_session_id": child_session_id,
            "ai_risk_score": round(ai_risk_score, 3),
            "fused_risk_score": round(fused_score, 3),
            "fused_risk_level": risk_level,
            "registry_data": registry.dict(),
            "interagency_insights": self._generate_insights(registry, ai_risk_score),
            "timestamp": datetime.utcnow().isoformat()
        }

    def _generate_insights(self, registry: SyntheticRegistryData, ai_score: float) -> List[str]:
        """Генерує зрозумілі інсайти для психолога / соцпрацівника"""
        insights = []
        
        if registry.school_grades_trend == "declining" and ai_score > 0.5:
            insights.append("Падіння оцінок корелює з підвищеною тривожністю/депресією за даними Аватара")
        
        if registry.recent_absences > 4:
            insights.append("Часті пропуски школи — можливий індикатор булінгу або сімейних проблем")
        
        if registry.family_status == "divorce_recent":
            insights.append("Нещодавнє розлучення батьків — високий ризик емоційної травми")
        
        if "possible_bullying" in registry.known_risks and ai_score > 0.6:
            insights.append("Підтвердження ризику булінгу з шкільного реєстру + сигнали від дитини")
        
        return insights


# Глобальний екземпляр
registry_mock = RegistryMockService()
