"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import FlowList from "@/components/FlowList";
import { Team } from "@/types/team";

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeams() {
      try {
        const response = await fetch("/api/teams");
        if (!response.ok) {
          throw new Error("Failed to fetch teams");
        }
        const data = await response.json();
        setTeams(data);
        if (data.length > 0 && !selectedTeamId) {
          setSelectedTeamId(data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoading(false);
      }
    }
    
    // Initial fetch
    fetchTeams();
    
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchTeams, 10000);
    
    return () => clearInterval(interval);
  }, [selectedTeamId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-blue-950/30 dark:to-purple-950/30">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-blue-950/30 dark:to-purple-950/30">
      <Sidebar
        teams={teams}
        selectedTeamId={selectedTeamId}
        onTeamSelect={setSelectedTeamId}
      />
      <main className="flex-1 overflow-auto">
        <FlowList teamId={selectedTeamId} />
      </main>
    </div>
  );
}
