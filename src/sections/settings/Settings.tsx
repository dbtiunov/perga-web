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
    <div className="container">
      <div className="flex">
        {/* Sidebar */}
        <aside className="min-h-screen w-40 md:w-56 bg-gray-100 px-4 py-6 border-r-1 border-gray-200">
          <nav className="space-y-1" aria-label="Settings sections">
            <h3 className="text-2xl font-light mb-6">Settings</h3>

            {Object.values(SettingsSections).map((section) => (
                <button type="button" key={section}
                        onClick={() => setActiveTab(section)}
                        className={`w-full text-left mb-2 px-3 py-2 rounded transition-colors text-sm ${
                          activeTab === section 
                            ? 'text-gray-100 bg-gray-600 font-semibold' 
                            : 'text-gray-600 hover:bg-gray-200'
                        }`}
                        aria-current={activeTab === section ? 'page' : undefined}>
                    {section}
                </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <section className="flex-1 px-10 py-6">
          {activeTab === SettingsSections.Profile && <SettingsProfile />}
          {activeTab === SettingsSections.Planner && <SettingsPlanner />}
        </section>
      </div>
    </div>
  );
};

export default Settings;
