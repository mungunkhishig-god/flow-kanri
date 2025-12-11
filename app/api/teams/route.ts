import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if MongoDB URI is set
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: "MONGODB_URI not configured" },
        { status: 500 }
      );
    }

    // Try to import and use MongoDB
    const { getTeams } = await import("@/lib/mongodb");
    const teams = await getTeams();
    
    return NextResponse.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch teams",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
