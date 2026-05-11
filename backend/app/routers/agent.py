from fastapi import APIRouter
from app.models.schemas import AgentRequest, AgentResponse
from app.services.claude_service import get_agent_response

router = APIRouter(prefix="/agent", tags=["agent"])


@router.post("/respond", response_model=AgentResponse)
async def respond(request: AgentRequest) -> AgentResponse:
    return await get_agent_response(request)
