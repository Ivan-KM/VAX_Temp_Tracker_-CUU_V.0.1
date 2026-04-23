import React, { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import DashboardTab from "./pages/DashboardTab";
import AlertsTab from "./pages/AlertsTab";
import AnalyticsTab from "./pages/AnalyticsTab";
import RiskFailureTab from "./pages/RiskFailureTab";
import SummaryTab from "./pages/SummaryTab";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "alerts", label: "Alerts", icon: "🔔" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "risk", label: "Risk & Failure", icon: "🤖" },
    { id: "summary", label: "Summary", icon: "📋" },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab />;
      case "alerts":
        return <AlertsTab />;
      case "analytics":
        return <AnalyticsTab />;
      case "risk":
        return <RiskFailureTab />;
      case "summary":
        return <SummaryTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-gray-900 transition-colors duration-300">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderTab()}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;