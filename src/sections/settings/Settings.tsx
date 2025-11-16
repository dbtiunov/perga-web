import { NavLink, Outlet } from 'react-router-dom';

const Settings = () => {
  const sections = [
    { label: 'Profile', to: '/settings/profile/' },
    { label: 'Planner', to: '/settings/planner/' },
  ];

  return (
    <div className="container">
      <div className="flex flex-col md:flex-row w-full">
        {/* Sidebar */}
        <aside className="w-full md:w-56 md:min-h-screen bg-gray-100 px-4 py-6 border-b-1 md:border-b-0 md:border-r-1 border-gray-200">
          <nav className="space-y-1" aria-label="Settings sections">
            <h3 className="text-2xl font-light mb-6">Settings</h3>

            {sections.map((section) => (
              <NavLink
                key={section.to}
                to={section.to}
                className={({ isActive }: { isActive: boolean }) =>
                  `block w-full text-left mb-2 px-3 py-2 rounded transition-colors text-sm ${
                    isActive
                      ? 'text-gray-100 bg-gray-600 font-semibold'
                      : 'text-text-main hover:bg-bg-hover'
                  }`
                }
              >
                {section.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <section className="w-full md:flex-1 px-10 py-6">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default Settings;
