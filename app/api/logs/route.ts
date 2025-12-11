import { NextRequest, NextResponse } from "next/server";
import { getTeams } from "@/lib/mongodb";
import { LogEntry } from "@/types/team";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const teamFilter = searchParams.get("team");
    const statusFilter = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Fetch all teams
    const teams = await getTeams();

    // Flatten all flows into log entries
    let logs: LogEntry[] = [];
    teams.forEach((team) => {
      team.flows.forEach((flow) => {
        logs.push({
          ...flow,
          teamId: team._id,
          teamName: team.name,
        });
      });
    });

    // Apply filters
    if (teamFilter) {
      logs = logs.filter((log) => log.teamId === teamFilter);
    }

    if (statusFilter) {
      const statusCode = parseInt(statusFilter);
      logs = logs.filter((log) => log["status-code"] === statusCode);
    }

    if (startDate) {
      logs = logs.filter((log) => {
        if (!log.timestamp) return false;
        return new Date(log.timestamp) >= new Date(startDate);
      });
    }

    if (endDate) {
      logs = logs.filter((log) => {
        if (!log.timestamp) return false;
        return new Date(log.timestamp) <= new Date(endDate);
      });
    }

    // Sort by timestamp (newest first)
    logs.sort((a, b) => {
      const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
