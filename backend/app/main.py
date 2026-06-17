# backend/app/main.py
"""
Головний файл FastAPI застосунку — Interagency Child Protection Ecosystem MVP.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from datetime import datetime

from app.core.config import settings
from app.api.v1.endpoints.logs import router as logs_router
# from app.api.v1.endpoints.dashboard import router as dashboard_router  # буде додано пізніше

app = FastAPI(
    title="Interagency Child Protection Ecosystem",
    description="AI-система раннього попередження та захисту дітей (Україна-Естонія Хакатон)",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — критично важливо для React фронтендів
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],                    # Для хакатону — всі, в проді змінити
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Підключення роутерів
app.include_router(logs_router, prefix="/api/v1")

# TODO: додати пізніше
# app.include_router(dashboard_router, prefix="/api/v1")


@app.get("/", tags=["health"])
async def root():
    """Привітання + базова інформація"""
    return {
        "message": "Interagency Child Protection Ecosystem API",
        "status": "running",
        "version": "0.1.0",
        "documentation": "/docs"
    }


@app.get("/health", tags=["health"])
async def health_check():
    """Health check для моніторингу та деплой систем"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "child-protection-risk-engine",
        "environment": settings.ENVIRONMENT
    }


@app.get("/api/v1/info", tags=["info"])
async def system_info():
    """Інформація про систему (корисно для демо та пітчу)"""
    return {
        "system": "Interagency Child Protection Ecosystem MVP",
        "features": [
            "AI Risk Analysis (RCADS + PHQ-9)",
            "Clinical Mapping",
            "Rule Engine + LLM",
            "100% Anonymization Ready",
            "Synthetic Registry Fusion"
        ],
        "clinical_basis": ["RCADS-11", "PHQ-9A", "SCARED", "CTQ items"],
        "hackathon_mode": True
    }


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
