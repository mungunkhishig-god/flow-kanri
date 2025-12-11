"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import FlowList from "@/components/FlowList";
import { Team } from "@/types/team";

interface ClientWrapperProps {
  teams: Team[];
  initialTeamId: string | null;
}

export default function ClientWrapper({ teams, initialTeamId }: ClientWrapperProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(initialTeamId);

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
