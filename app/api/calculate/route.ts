import { NextRequest, NextResponse } from "next/server";
import { getTeams, updateFlow } from "@/lib/mongodb";

interface CalculateRequest {
  teamName: string;
  flowName: string;
  status_code: string | number;
  body?: string | unknown;
}

// Map English team names to Japanese names
const TEAM_NAME_MAP: Record<string, string> = {
  "khadaan": "ハダーン",
  "nomads": "ノマッズ",
  "tenger": "テンゲル",
  "cashmere": "カシミア",
  "bayan": "バヤン"
};

export async function POST(request: NextRequest) {
  try {
    const requestBody: CalculateRequest = await request.json();
    const { teamName, flowName, status_code, body } = requestBody;

    if (!teamName || !flowName) {
      return NextResponse.json(
        { success: false, error: "teamName and flowName are required" },
        { status: 400 }
      );
    }

    // Convert English team name to Japanese if needed
    const normalizedTeamName = teamName.toLowerCase();
    const japaneseTeamName = TEAM_NAME_MAP[normalizedTeamName] || teamName;

    // Look up team by Japanese name
    const teams = await getTeams();
    const team = teams.find(t => t.name === japaneseTeamName);
    
    if (!team) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Team '${teamName}' not found. Available teams: ${Object.keys(TEAM_NAME_MAP).join(', ')}`
        },
        { status: 404 }
      );
    }

    // Find flow by name OR id (case-insensitive, flexible matching)
    // Normalize by lowercasing and removing all non-alphanumeric characters
    // This allows "khadaan flow 001" to match "khadaan-flow-001"
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const searchTarget = normalize(flowName);

    const flow = team.flows.find(f => {
      const dbFlowName = normalize(f["flow-name"]);
      const dbFlowId = normalize(f.id);
      return dbFlowName === searchTarget || dbFlowId === searchTarget;
    });

    if (!flow) {
      const availableFlows = team.flows.map(f => `${f["flow-name"]} (${f.id})`).join(', ');
      return NextResponse.json(
        { 
          success: false, 
          error: `Flow '${flowName}' not found in team '${teamName}'. Available flows: ${availableFlows}`
        },
        { status: 404 }
      );
    }

    // Parse status code
    const statusCode = typeof status_code === 'string' ? parseInt(status_code) : status_code;
    
    // Determine error message from body
    let errorMessage = "";
    if (statusCode >= 400) {
      // If status is error, use body as error message
      errorMessage = typeof body === 'string' ? body : JSON.stringify(body);
    }

    console.log('Received calculation request:', { 
      teamName, 
      flowName, 
      flowId: flow.id,
      status_code: statusCode, 
      body 
    });

    // Update the flow in MongoDB
    const updated = await updateFlow(team._id, flow.id, {
      "status-code": statusCode,
      "error-message": errorMessage,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Flow not found or not updated" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      result: {
        statusCode,
        errorMessage,
        flowId: flow.id,
        flowName: flow["flow-name"]
      },
      message: `Updated flow '${flowName}' in team '${teamName}' with status ${statusCode}`
    });
  } catch (error) {
    console.error("Error in /api/calculate:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
