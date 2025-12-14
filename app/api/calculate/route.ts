import { NextRequest, NextResponse } from "next/server";
import { getTeams, updateFlow, addFlow } from "@/lib/mongodb";
import { Flow } from "@/types/team";

interface ErrorData {
  code?: string;
  message?: string;
}

interface RequestData {
  error?: ErrorData;
  status?: string;
  [key: string]: any;
}

interface CalculateRequest {
  teamName: string;
  flowName: string;
  status_code: string | number;
  data?: RequestData;
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
    const { teamName, flowName, status_code, data } = requestBody;

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
          error: `Team '${teamName}' not found.`
        },
        { status: 404 }
      );
    }

    // Parse status code
    const statusCode = typeof status_code === 'string' ? parseInt(status_code) : status_code;
    
    // Determine error message from data object
    let errorMessage = "";
    if (data?.error?.message) {
      errorMessage = data.error.message;
    } else if (statusCode >= 400 && typeof data === 'string') {
       errorMessage = data;
    }

    // Find flow by name OR id (case-insensitive, flexible matching)
    // Normalize by lowercasing and removing all non-alphanumeric characters
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const searchTarget = normalize(flowName);

    const flow = team.flows.find(f => {
      const dbFlowName = normalize(f["flow-name"]);
      const dbFlowId = normalize(f.id);
      return dbFlowName === searchTarget || dbFlowId === searchTarget;
    });

    if (flow) {
      // UPDATE existing flow
      const updated = await updateFlow(team._id, flow.id, {
        "status-code": statusCode,
        "error-message": errorMessage,
      });

       if (!updated) {
        return NextResponse.json(
          { success: false, error: "Failed to update existing flow" },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: `Updated flow '${flowName}' in team '${teamName}'`,
        result: {
           statusCode,
           errorMessage
        }
      });

    } else {
      // CREATE new flow
      // Generate ID: teamName-flowName (normalized)
      const newFlowId = `${normalizedTeamName}-${flowName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      
      const newFlow: Flow = {
        id: newFlowId,
        "flow-name": flowName,
        "status-code": statusCode,
        "error-message": errorMessage,
        timestamp: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      const added = await addFlow(team._id, newFlow);

      if (!added) {
        return NextResponse.json(
          { success: false, error: "Failed to create new flow" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Created new flow '${flowName}' in team '${teamName}'`,
        result: {
           statusCode,
           errorMessage,
           flowId: newFlowId
        }
      });
    }

  } catch (error) {
    console.error("Error in /api/calculate:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
