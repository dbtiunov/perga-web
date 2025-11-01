import { NavLink, Outlet } from 'react-router-dom';

const Settings = () => {
  const sections = [
    { label: 'Profile', to: '/settings/profile/' },
    { label: 'Planner', to: '/settings/planner/' },
  ];

  return (
    <div className="container">
      <div className="flex">
        {/* Sidebar */}
        <aside className="min-h-screen w-40 md:w-56 bg-gray-100 px-4 py-6 border-r-1 border-gray-200">
          <nav className="space-y-1" aria-label="Settings sections">
            <h3 className="text-2xl font-light mb-6">Settings</h3>

            {sections.map((section) => (
              <NavLink key={section.to} to={section.to}
                       className={({ isActive }: { isActive: boolean }) =>
                         `block w-full text-left mb-2 px-3 py-2 rounded transition-colors text-sm ${
                           isActive
                             ? 'text-gray-100 bg-gray-600 font-semibold'
                             : 'text-gray-600 hover:bg-gray-200'
                         }`
                       }>
                {section.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <section className="flex-1 px-10 py-6">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default Settings;
