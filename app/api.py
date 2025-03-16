import asyncio
import datetime
from typing import List, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from app.logger import logger

from .agent.manus import Manus

app = FastAPI()


@app.on_event("startup")
async def startup_event():
    print("FastAPI application started successfully")


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def health_check():
    print("Health check endpoint hit")
    return {
        "status": "ok",
        "message": "API is running",
        "timestamp": datetime.datetime.now().isoformat(),
    }


class LLMSettings(BaseModel):
    model: str
    base_url: str
    api_key: str
    max_tokens: int
    temperature: float
    api_type: str = ""
    api_version: str = ""


@app.post("/api/llm/settings")
async def update_llm_settings(settings: LLMSettings):
    try:
        # Here you would typically save these settings to a database or config file
        # For now, we'll just return success
        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "message": "LLM settings updated successfully",
                "data": settings.dict(exclude={"api_key"}),
            },
        )
    except Exception as e:
        return JSONResponse(
            status_code=500, content={"status": "error", "message": str(e)}
        )


class AgentTool(BaseModel):
    name: str
    description: Optional[str] = None


class AgentConfig(BaseModel):
    name: str
    type: str
    tools: List[AgentTool] = Field(default_factory=list)
    llm_config: LLMSettings


class CommandRequest(BaseModel):
    command: str


@app.post("/api/agents")
async def create_agent(config: AgentConfig):
    try:
        # Here you would typically save the agent configuration
        # For now, we'll just return success with the config
        logger.info(f"Creating agent: {config.name}")
        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "message": f"Agent {config.name} created successfully",
                "data": config.dict(exclude={"llm_config": {"api_key"}}),
            },
        )
    except Exception as e:
        logger.error(f"Agent creation failed: {str(e)}")
        return JSONResponse(
            status_code=500, content={"status": "error", "message": str(e)}
        )


@app.post("/api/execute")
async def execute_command(request: CommandRequest):
    try:
        agent = Manus()
        logger.info(f"Executing command: {request.command}")
        result = await agent.run(request.command)
        return {"status": "success", "result": result}
    except Exception as e:
        logger.error(f"Command execution failed: {str(e)}")
        return {"status": "error", "message": str(e)}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001)
