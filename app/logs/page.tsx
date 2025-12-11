"use client";

import { useState, useEffect } from "react";
import { LogEntry, Team } from "@/types/team";
import Link from "next/link";

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

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Fetch teams for filter dropdown
  useEffect(() => {
    fetch("/api/teams")
      .then((res) => res.json())
      .then((data) => setTeams(data))
      .catch((err) => console.error("Error fetching teams:", err));
  }, []);

  // Fetch logs with filters
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedTeam) params.append("team", selectedTeam);
    if (selectedStatus) params.append("status", selectedStatus);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    fetch(`/api/logs?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);
      })
      .catch((err) => console.error("Error fetching logs:", err))
      .finally(() => setLoading(false));
  }, [selectedTeam, selectedStatus, startDate, endDate]);

  const clearFilters = () => {
    setSelectedTeam("");
    setSelectedStatus("");
    setStartDate("");
    setEndDate("");
  };

  const activeFilterCount = [selectedTeam, selectedStatus, startDate, endDate].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-blue-950/30 dark:to-purple-950/30">
      {/* Header */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Flow Logs
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                View and filter all flow executions
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-black/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({activeFilterCount} active)
                </span>
              )}
            </h2>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Team Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Team
              </label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Teams</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status Code
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="200">200 - Success</option>
                <option value="403">403 - Forbidden</option>
                <option value="404">404 - Not Found</option>
                <option value="500">500 - Server Error</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mt-6">
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-black/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {loading ? "Loading..." : `${logs.length} ${logs.length === 1 ? "result" : "results"}`}
              </h3>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No logs found matching your filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50 dark:bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Team
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Flow Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Error
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                    {logs.map((log, index) => (
                      <tr
                        key={`${log.teamId}-${log.id}-${index}`}
                        className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {log.teamName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {log["flow-name"]}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 rounded-lg border text-xs font-semibold ${getStatusColor(
                              log["status-code"]
                            )}`}
                          >
                            {log["status-code"]}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {log.timestamp
                            ? new Date(log.timestamp).toLocaleString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {log["error-message"] || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
