# backend/app/models/schemas.py
"""
Pydantic моделі (схеми) для Interagency Child Protection Ecosystem.
Використовуються для валідації вхідних/вихідних даних API.
"""

from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from datetime import datetime


class MoodLog(BaseModel):
    """Структура одного щоденного логу від дитини"""
    mood_swipe: str = Field(..., description="Свайп настрою монстрика (very_low_energy, low, neutral, good, very_good)")
    text: Optional[str] = Field(None, description="Текст або транскрипт голосу дитини")
    voice_transcribed: Optional[str] = Field(None, description="Транскрипт голосу (якщо є)")
    additional_context: Optional[Dict[str, Any]] = Field(default_factory=dict)


class ChildLogInput(BaseModel):
    """Вхідні дані від дитячого додатку"""
    child_session_id: str = Field(..., description="Анонімізований ID сесії дитини")
    current_log: MoodLog
    history_logs: Optional[List[Dict[str, Any]]] = Field(
        default=None, 
        description="Історія попередніх логів для трендового аналізу"
    )


class CategoryScores(BaseModel):
    depression: float = Field(..., ge=0, le=1)
    anxiety: float = Field(..., ge=0, le=1)
    bullying: float = Field(..., ge=0, le=1)
    family_safety: float = Field(..., ge=0, le=1)
    social_withdrawal: float = Field(..., ge=0, le=1)


class MatchedScaleItem(BaseModel):
    scale: str
    item_id: str
    severity: float = Field(..., ge=0, le=1)
    description: str


class RiskAnalysisResponse(BaseModel):
    """Основна відповідь від Risk Engine (LLM + Rule Engine)"""
    child_session_id: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    
    risk_score: float = Field(..., ge=0, le=1, description="Загальний індекс ризику 0-1")
    risk_level: str = Field(..., pattern="^(LOW|MEDIUM|HIGH|CRITICAL)$")
    
    category_scores: CategoryScores
    
    red_flags: List[str] = Field(default_factory=list)
    
    matched_scale_items: List[MatchedScaleItem]
    
    trend_7days: str = Field(..., pattern="^(improving|stable|worsening)$")
    
    recommended_action: str = Field(
        ..., 
        pattern="^(no_action|monitor|alert_psychologist|urgent_intervention)$"
    )
    
    explanation: str = Field(..., max_length=280, description="Коротке пояснення для фахівця")


class LogResponse(BaseModel):
    """Відповідь після збереження логу"""
    id: str
    child_session_id: str
    timestamp: str
    current_log: Dict[str, Any]
    status: str = "saved"
    analysis: Optional[RiskAnalysisResponse] = None


class DashboardAlert(BaseModel):
    """Модель алерту для дашборду фахівців"""
    child_session_id: str
    risk_level: str
    risk_score: float
    timestamp: str
    main_concern: str
    recommended_action: str


class SyntheticRegistryData(BaseModel):
    """Фейкові дані з державних реєстрів (для MVP демо)"""
    school_grades_trend: str  # "declining", "stable", "improving"
    recent_absences: int
    family_status: str  # "divorce_recent", "single_parent", "stable"
    medical_visits_last_month: int
    known_risks: List[str]


# Додаткові допоміжні моделі
class HealthCheckResponse(BaseModel):
    status: str
    version: str
    timestamp: str
