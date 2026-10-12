from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import router as api_v1_router

app = FastAPI(
    title="AI Multi-Agent Interview Service",
    version="1.0.0",
    description="LangGraph-powered AI Interviewing, Coding Analysis, and Evaluation Engine"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_v1_router)

@app.get("/health", tags=["system"])
async def health_check():
    return {
        "status": "healthy",
        "service": "ai-service",
        "framework": "FastAPI + LangGraph"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8006, reload=True)
