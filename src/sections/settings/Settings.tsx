import { useState } from 'react';

import SettingsProfile from '@settings/SettingsProfile';
import SettingsPlanner from '@settings/SettingsPlanner';

const Settings = () => {
  enum SettingsSections {
    Profile = "Profile",
    Planner = "Planner",
  }

  const [activeTab, setActiveTab] = useState<SettingsSections>(SettingsSections.Profile);


  return (
    <div className="container px-4 py-6">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-40 md:w-56 pr-4">
          <nav className="space-y-1" aria-label="Settings sections">
            <h3 className="text-2xl font-light mb-6">Settings</h3>

            {Object.values(SettingsSections).map((section) => (
                <button type="button"
                        onClick={() => setActiveTab(section)}
                        className={`w-full text-left mb-2 px-3 py-2 rounded transition-colors text-sm ${
                          activeTab === section ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        aria-current={activeTab === section ? 'page' : undefined}>
                    {section}
                </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <section className="flex-1">
          {activeTab === SettingsSections.Profile && <SettingsProfile />}
          {activeTab === SettingsSections.Planner && <SettingsPlanner />}
        </section>
      </div>
    </div>
  );
};

export default Settings;
