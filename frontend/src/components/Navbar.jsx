import React from "react";
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SummarizeIcon from '@mui/icons-material/Summarize';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from "../context/ThemeContext";

const Navbar = ({ activeTab, setActiveTab }) => {
  const { darkMode, toggleDarkMode } = useTheme();

  const tabs = [
  { id: "dashboard", label: "Home", icon: <DashboardIcon /> },
  { id: "alerts", label: "Alerts", icon: <NotificationsActiveIcon /> },
  { id: "analytics", label: "Analytics", icon: <AnalyticsIcon /> },
  { id: "risk", label: "Risk & Failure", icon: <PsychologyIcon /> },
  { id: "summary", label: "Summary", icon: <SummarizeIcon /> },
];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-dark-bg/95 backdrop-blur-md border-b border-light-border dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">V</span>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">VaxTrack</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Temperature Monitoring Dashboard
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card"
                }`}
              >
                {tab.icon && <span className="mr-2">{tab.icon}</span>}
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-dark-border transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? < LightModeIcon /> : <DarkModeIcon />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;