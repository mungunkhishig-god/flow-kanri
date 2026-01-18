import "server-only";

import { MongoClient, Db, ObjectId } from "mongodb";
import { Team, Flow, LogEntry } from "@/types/team";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db("flow-kanri");
}

/**
 * Fetch all teams from the database
 */
export async function getTeams(): Promise<Team[]> {
  const db = await getDb();
  const teams = await db
    .collection("teams")
    .find({})
    .toArray();
  
  return teams.map((team) => ({
    _id: team._id.toString(),
    name: team.name,
    flows: team.flows || [],
  }));
}

/**
 * Fetch a single team by ID with all its flows
 */
export async function getTeamById(teamId: string): Promise<Team | null> {
  const db = await getDb();
  const team = await db
    .collection("teams")
    .findOne({ _id: new ObjectId(teamId) });
  
  if (!team) return null;
  
  return {
    _id: team._id.toString(),
    name: team.name,
    flows: team.flows || [],
  };
}

/**
 * Fetch a single team by name (case-insensitive)
 */
export async function getTeamByName(teamName: string): Promise<Team | null> {
  const db = await getDb();
  const team = await db
    .collection("teams")
    .findOne({ name: { $regex: new RegExp(`^${teamName}$`, 'i') } });
  
  if (!team) return null;
  
  return {
    _id: team._id.toString(),
    name: team.name,
    flows: team.flows || [],
  };
}

/**
 * Update a specific flow within a team
 */
export async function updateFlow(
  teamId: string,
  flowId: string,
  data: Partial<Flow>
): Promise<boolean> {
  const db = await getDb();
  
  const updateFields: Record<string, unknown> = {
    "flows.$.timestamp": new Date().toISOString(),
    "flows.$.lastUpdated": new Date().toISOString(),
  };
  
  if (data["status-code"] !== undefined) {
    updateFields["flows.$.status-code"] = data["status-code"];
  }
  
  if (data["error-message"] !== undefined) {
    updateFields["flows.$.error-message"] = data["error-message"];
  }
  
  const result = await db.collection("teams").updateOne(
    {
      _id: new ObjectId(teamId),
      "flows.id": flowId,
    },
    {
      $set: updateFields,
    }
  );
  
  return result.matchedCount > 0 && result.modifiedCount > 0;
}

/**
 * Add a new flow to a team
 */
export async function addFlow(
  teamId: string,
  flow: Flow
): Promise<boolean> {
  const db = await getDb();
  
  const result = await db.collection("teams").updateOne(
    { _id: new ObjectId(teamId) },
    {
      $push: {
        flows: flow,
      } as unknown as any, // Bypass strict push typing for custom Flow interface
    }
  );
  
  return result.modifiedCount > 0;
}

/**
 * Add a historical log entry
 */
export async function addLogEntry(
  logEntry: LogEntry
): Promise<boolean> {
  const db = await getDb();
  
  const result = await db.collection("logs").insertOne({
    ...logEntry,
    timestamp: logEntry.timestamp || new Date().toISOString(),
  });
  
  return result.acknowledged;
}

export default clientPromise;
