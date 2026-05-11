import { AgentRequest, AgentResponse } from "@/app/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export async function getAgentResponse(request: AgentRequest): Promise<AgentResponse> {
  const res = await fetch(`${API_BASE}/agent/respond`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error(`Agent API error: ${res.status}`);
  return res.json();
}
