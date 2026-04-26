import React from "react";

const Tabs = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="border-b border-light-border dark:border-dark-border">
      <div className="flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium transition-all relative ${
              activeTab === tab.id
                ? "text-primary-600 dark:text-primary-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <span className="flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;