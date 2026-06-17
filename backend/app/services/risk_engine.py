# backend/app/services/risk_engine.py
"""
Risk Engine —核心 модуль розрахунку ризику для Interagency Child Protection Ecosystem.
Поєднує:
- LLM-аналіз (OpenAI)
- Rule-based клінічне мапінг (RCADS / PHQ-9)
- Вагову модель
- Трендовий аналіз
"""

import json
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional

from app.utils.prompts import get_clinical_mapping
from app.models.schemas import RiskAnalysisResponse, ChildLogInput


class RiskEngine:
    def __init__(self):
        self.mapping = get_clinical_mapping()
        self.question_map = {q["id"]: q for q in self.mapping["questions"]}

    def calculate_base_score(self, current_log: Dict[str, Any]) -> Dict[str, float]:
        """
        Базовий rule-based розрахунок на основі відповідей дитини.
        Використовується як fallback або для посилення LLM-результату.
        """
        category_scores = {
            "depression": 0.0,
            "anxiety": 0.0,
            "bullying": 0.0,
            "family_safety": 0.0,
            "social_withdrawal": 0.0,
        }

        mood = current_log.get("mood_swipe", "").lower()
        text = current_log.get("text", "").lower()

        # Прості евристики на основі свайпів
        mood_weights = {
            "very_low_energy": 0.9,
            "low": 0.7,
            "neutral": 0.3,
            "good": 0.1,
            "very_good": 0.0,
        }

        base_mood_score = mood_weights.get(mood, 0.4)

        # Мапінг текстових ключових слів (можна розширити)
        keywords = {
            "depression": ["сумний", "не хоче", "втомлений", "нічого не хочеться", "безнадія"],
            "anxiety": ["хвилююся", "боюсь", "страшно", "школа", "тест"],
            "bullying": ["обзивають", "штовхають", "дражнять", "погані", "бʼють"],
            "family_safety": ["додому", "батьки", "кричать", "бояться", "секрет"],
            "social_withdrawal": ["сам", "один", "друзі не", "не хочу гратися"],
        }

        for category, words in keywords.items():
            if any(word in text for word in words):
                category_scores[category] = max(category_scores[category], 0.75)

        # Застосовуємо базовий настрій
        category_scores["depression"] = max(category_scores["depression"], base_mood_score * 0.9)

        return category_scores

    def merge_with_llm_result(
        self,
        llm_response: RiskAnalysisResponse,
        rule_based_scores: Dict[str, float]
    ) -> RiskAnalysisResponse:
        """
        Об'єднує результат від LLM з rule-based оцінками для підвищення надійності.
        """
        # Просте усереднення (можна зробити більш розумне зважування)
        for category, score in rule_based_scores.items():
            if category in llm_response.category_scores:
                llm_response.category_scores[category] = round(
                    (llm_response.category_scores[category] + score) / 2, 3
                )

        # Перерахунок загального risk_score
        weights = {"depression": 0.3, "anxiety": 0.25, "bullying": 0.2,
                   "family_safety": 0.15, "social_withdrawal": 0.1}
        
        total = sum(llm_response.category_scores[cat] * weights[cat] 
                   for cat in weights)
        
        llm_response.risk_score = round(min(total, 1.0), 3)
        
        # Оновлення risk_level
        if llm_response.risk_score >= 0.85:
            llm_response.risk_level = "CRITICAL"
        elif llm_response.risk_score >= 0.65:
            llm_response.risk_level = "HIGH"
        elif llm_response.risk_score >= 0.4:
            llm_response.risk_level = "MEDIUM"
        else:
            llm_response.risk_level = "LOW"

        return llm_response

    async def analyze_log(
        self,
        openai_service,
        child_session_id: str,
        current_log: Dict[str, Any],
        history_logs: Optional[List[Dict]] = None
    ) -> RiskAnalysisResponse:
        """
        Головний метод: аналіз одного логу з використанням LLM + rule engine.
        """
        # Підготовка історії
        history_summary = self._generate_history_summary(history_logs) if history_logs else None

        # Отримання аналізу від OpenAI
        llm_result = await openai_service.analyze_child_log(
            child_session_id=child_session_id,
            current_log=current_log,
            history_summary=history_summary
        )

        # Rule-based посилення
        rule_scores = self.calculate_base_score(current_log)

        # Фінальний результат
        final_result = self.merge_with_llm_result(llm_result, rule_scores)

        return final_result

    def _generate_history_summary(self, history_logs: List[Dict]) -> str:
        """Генерує коротке summary для промпту OpenAI."""
        if not history_logs:
            return ""
        
        recent = history_logs[-7:]  # Останні 7 днів
        low_energy_count = sum(1 for log in recent if "low" in str(log.get("mood_swipe", "")).lower())
        
        return f"За останні 7 днів: {low_energy_count} разів низька енергія. " \
               f"Загальна кількість логів: {len(recent)}."


# Глобальний екземпляр
risk_engine = RiskEngine()
