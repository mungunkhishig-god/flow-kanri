"use client";

import { useEffect, useState } from "react";
import { Team, Flow } from "@/types/team";

interface FlowListProps {
  teamId: string | null;
}

function getStatusColor(statusCode: number) {
  if (statusCode >= 200 && statusCode < 300) {
    return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
  } else if (statusCode >= 400 && statusCode < 500) {
    return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
  } else if (statusCode >= 500) {
    return "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20";
  }
  return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
}

function FlowCard({ flow }: { flow: Flow }) {
  return (
    <div className="group relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
            {flow["flow-name"]}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Flow ID: <span className="font-mono text-xs">{flow.id}</span>
          </p>
          {flow["error-message"] && (
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">
                {flow["error-message"]}
              </p>
            </div>
          )}
        </div>
        <div
          className={`px-4 py-2 rounded-xl border font-semibold text-sm ${getStatusColor(
            flow["status-code"]
          )}`}
        >
          {flow["status-code"]}
        </div>
      </div>

      {/* Decorative gradient border on hover */}
      <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300 pointer-events-none" />
    </div>
  );
}

export default function FlowList({ teamId }: FlowListProps) {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!teamId) {
      setTeam(null);
      return;
    }

    const fetchTeamData = () => {
      setLoading(true);
      // Fetch only today's flows
      fetch(`/api/teams/${teamId}?today=true`)
        .then((res) => res.json())
        .then((data) => {
          setTeam(data);
        })
        .catch((error) => {
          console.error("Error fetching team:", error);
          setTeam(null);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    // Initial fetch
    fetchTeamData();

    // Poll for updates every 5 seconds for real-time data
    const interval = setInterval(fetchTeamData, 5000);

    return () => clearInterval(interval);
  }, [teamId]);

  if (!teamId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Select a Team
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Choose a team from the sidebar to view its flows
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <p className="text-red-600 dark:text-red-400">Team not found</p>
        </div>
      </div>
    );
  }

  if (team.flows.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br from-gray-500/20 to-gray-600/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No Flows Yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            This team doesn&apos;t have any flows
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {team.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {team.flows.length} {team.flows.length === 1 ? "flow" : "flows"} today
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-medium text-green-700 dark:text-green-400">
              Live
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {team.flows.map((flow) => (
          <FlowCard key={flow.id} flow={flow} />
        ))}
      </div>
    </div>
  );
}
