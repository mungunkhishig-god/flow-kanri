import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const teamFilter = searchParams.get("team");
    const statusFilter = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    await client.connect();
    const db = client.db("flow-kanri");
    const collection = db.collection("logs");

    const query: any = {};

    if (teamFilter) {
      query.teamId = teamFilter;
    }

    if (statusFilter) {
      query["status-code"] = parseInt(statusFilter);
    }

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate).toISOString();
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.timestamp.$lte = end.toISOString();
      }
    }

    const logs = await collection
      .find(query)
      .sort({ timestamp: -1 })
      .toArray();

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
