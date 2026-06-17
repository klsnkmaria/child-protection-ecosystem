# backend/app/api/v1/endpoints/logs.py
"""
API ендпоінти для прийому та аналізу дитячих логів (Child App → Backend).
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime

from app.models.schemas import (
    ChildLogInput, 
    RiskAnalysisResponse, 
    LogResponse
)
from app.services.risk_engine import risk_engine
from app.services.openai_service import analyze_child_log

router = APIRouter(
    prefix="/logs",
    tags=["logs"],
    responses={404: {"description": "Not found"}},
)


@router.post("/analyze", response_model=RiskAnalysisResponse)
async def analyze_child_log_endpoint(
    log_input: ChildLogInput
) -> RiskAnalysisResponse:
    """
    Основний ендпоінт: приймає лог від дитячого додатку,
    виконує повний аналіз (LLM + Rule Engine) та повертає оцінку ризику.
    """
    try:
        result = await risk_engine.analyze_log(
            openai_service=None,  # risk_engine сам викликає openai_service
            child_session_id=log_input.child_session_id,
            current_log=log_input.current_log,
            history_logs=log_input.history_logs
        )
        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Помилка аналізу логу: {str(e)}"
        )


@router.post("/save", response_model=LogResponse)
async def save_log(
    log_input: ChildLogInput
) -> LogResponse:
    """
    Зберігає лог у базу даних (без негайного аналізу).
    Аналіз можна зробити пізніше.
    """
    # Тут буде виклик репозиторію для збереження в DB
    # Для MVP — імітуємо збереження
    
    saved_log = {
        "id": f"log_{int(datetime.utcnow().timestamp())}",
        "child_session_id": log_input.child_session_id,
        "timestamp": datetime.utcnow().isoformat(),
        "current_log": log_input.current_log,
        "status": "saved"
    }
    
    return LogResponse(**saved_log)


@router.get("/history/{child_session_id}", response_model=List[dict])
async def get_log_history(
    child_session_id: str,
    limit: int = 14
) -> List[dict]:
    """
    Повертає історію логів дитини (для трендового аналізу).
    У реальній системі — запит до Feature Store.
    """
    # Для MVP — повертаємо фейкові дані
    # В майбутньому замінити на реальний DB query
    fake_history = [
        {
            "timestamp": (datetime.utcnow() - timedelta(days=i)).isoformat(),
            "mood_swipe": "neutral" if i % 3 != 0 else "low",
            "text": "Монстрик трохи сумний" if i % 4 == 0 else ""
        }
        for i in range(limit)
    ]
    return fake_history


@router.post("/analyze-and-save", response_model=RiskAnalysisResponse)
async def analyze_and_save_log(
    log_input: ChildLogInput
) -> RiskAnalysisResponse:
    """
    Комбінований ендпоінт: аналіз + збереження в одному запиті.
    Найчастіше використовуватиметься з дитячого додатку.
    """
    try:
        # 1. Аналіз ризику
        analysis_result = await risk_engine.analyze_log(
            openai_service=None,
            child_session_id=log_input.child_session_id,
            current_log=log_input.current_log,
            history_logs=log_input.history_logs
        )
        
        # 2. Збереження логу (імітація)
        # await save_log_to_db(...)  # TODO: додати пізніше
        
        return analysis_result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
