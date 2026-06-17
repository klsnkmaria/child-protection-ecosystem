# backend/app/services/openai_service.py
"""
Сервіс для взаємодії з OpenAI API в рамках Interagency Child Protection Ecosystem.
Використовує строгий System Prompt та JSON Schema для гарантованої структури відповіді.
"""

import os
import json
from datetime import datetime
from typing import Dict, Any, Optional

from openai import AsyncOpenAI
from pydantic import ValidationError

from app.utils.prompts import get_full_system_prompt, get_json_schema
from app.models.schemas import RiskAnalysisResponse  # Pydantic модель (буде створено пізніше)

client = AsyncOpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


async def analyze_child_log(
    child_session_id: str,
    current_log: Dict[str, Any],
    history_summary: Optional[str] = None,
    temperature: float = 0.1
) -> RiskAnalysisResponse:
    """
    Аналізує лог дитини та повертає структурований результат ризику.
    
    Args:
        child_session_id: Анонімізований ID сесії
        current_log: Поточний лог (mood_swipe, text, тощо)
        history_summary: Коротке summary історії останніх 7-14 днів
        temperature: Температура (низька для стабільності)
    
    Returns:
        RiskAnalysisResponse — валідована Pydantic модель
    """
    
    timestamp = datetime.utcnow().isoformat()
    
    # Формуємо user message
    user_content = f"""
    child_session_id: {child_session_id}
    timestamp: {timestamp}
    
    Поточний лог:
    {json.dumps(current_log, ensure_ascii=False, indent=2)}
    
    {f'Історія (тренд за 7-14 днів): {history_summary}' if history_summary else ''}
    
    Проаналізуй дані згідно з клінічними правилами та поверни JSON.
    """

    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",          # Швидкий та дешевий для хакатону
            messages=[
                {"role": "system", "content": get_full_system_prompt()},
                {"role": "user", "content": user_content}
            ],
            response_format={"type": "json_object"},   # Примусово JSON
            temperature=temperature,
            max_tokens=800
        )

        raw_content = response.choices[0].message.content.strip()
        
        # Парсимо JSON
        parsed_json = json.loads(raw_content)
        
        # Валідація через Pydantic
        validated_response = RiskAnalysisResponse.model_validate(parsed_json)
        
        return validated_response

    except json.JSONDecodeError as e:
        raise ValueError(f"OpenAI не повернув валідний JSON: {str(e)}")
    except ValidationError as e:
        raise ValueError(f"Помилка валідації відповіді AI: {str(e)}")
    except Exception as e:
        raise RuntimeError(f"Помилка при виклику OpenAI: {str(e)}")


# Синхронна версія (для зручності в тестах / скриптах)
def analyze_child_log_sync(
    child_session_id: str,
    current_log: Dict[str, Any],
    history_summary: Optional[str] = None
) -> RiskAnalysisResponse:
    """Синхронна обгортка (для seed-скриптів та тестів)"""
    import asyncio
    return asyncio.run(analyze_child_log(child_session_id, current_log, history_summary))
