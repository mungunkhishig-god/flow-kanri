"use client";

import { Team } from "@/types/team";
import { useState } from "react";

interface SidebarProps {
  teams: Team[];
  selectedTeamId: string | null;
  onTeamSelect: (teamId: string) => void;
}

export default function Sidebar({ teams, selectedTeamId, onTeamSelect }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen w-64 
          bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl
          border-r border-gray-200/50 dark:border-gray-700/50
          transition-transform duration-300 ease-in-out z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
            Flow Kanri
          </h1>

          <nav className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Teams
            </h2>
            {teams.map((team) => (
              <button
                key={team._id}
                onClick={() => {
                  onTeamSelect(team._id);
                  setIsOpen(false);
                }}
                className={`
                  w-full text-left px-4 py-3 rounded-xl
                  transition-all duration-200
                  ${
                    selectedTeamId === team._id
                      ? "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`
                    w-2 h-2 rounded-full
                    ${
                      selectedTeamId === team._id
                        ? "bg-white"
                        : "bg-gray-400 dark:bg-gray-600"
                    }
                  `}
                  />
                  <span className="font-medium">{team.name}</span>
                </div>
              </button>
            ))}
          </nav>

          {/* Logs Link */}
          <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <a
              href="/logs"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="font-medium">View All Logs</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
