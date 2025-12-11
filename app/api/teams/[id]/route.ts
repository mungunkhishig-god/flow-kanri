import { NextResponse } from "next/server";
import { getTeamById } from "@/lib/mongodb";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = new URL(request.url).searchParams;
    const todayOnly = searchParams.get("today") === "true";
    
    const team = await getTeamById(id);
    
    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }
    
    // Filter flows to only today's data if requested
    if (todayOnly) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      team.flows = team.flows.filter((flow) => {
        if (!flow.timestamp) return false;
        const flowDate = new Date(flow.timestamp);
        return flowDate >= today && flowDate < tomorrow;
      });
    }
    
    return NextResponse.json(team);
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 }
    );
  }
}
