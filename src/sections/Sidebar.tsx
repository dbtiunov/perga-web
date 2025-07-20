import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '@contexts/AuthContext';
import { Icon } from "@common/Icon";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { 
      path: '/planner', 
      label: 'Planner', 
      icon: <Icon name="planner" size="20" fill="white" className="h-8 w-8" />
    },
    {
      path: '/projects',
      label: 'Projects',
      icon: <Icon name="projects" size="20" fill="white" className="h-8 w-8" />
    },
    {
      path: '/notes',
      label: 'Notes',
      icon: <Icon name="notes" size="20" fill="white" className="h-8 w-8" />
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/signin/');
  };

  return (
    <div className='h-screen bg-gray-700 flex flex-col transition-all duration-300 fixed w-14 md:w-20 pt-16 md:pt-0'>
      <nav className="flex-grow">
        {navItems.map((item) => (
          <Link key={item.path}
                to={item.path}
                arial-label={item.label} title={item.label}
                className={`flex flex-col items-center py-4 hover:bg-gray-800 focus:bg-gray-800 text-gray-300 
                          hover:text-white focus:text-white transition-colors 
                            ${location.pathname === item.path ? 'bg-gray-800 text-white' : ''}`}>
            <div>{item.icon}</div>
            <div className='text-sm hidden md:block'>{item.label}</div>
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <Link to="/settings"
              aria-label="Settings" title="Settings"
              className={`flex flex-col items-center py-4 hover:bg-gray-800 focus:bg-gray-800 text-gray-300 
                        hover:text-white focus:text-white transition-colors 
                          ${location.pathname === '/settings' ? 'bg-gray-800 text-white' : ''}`}>
          <div>
            <Icon name="settings" size="20" className="w-8 h-8" />
          </div>
          <div className='text-sm hidden md:block'>Settings</div>
        </Link>

        <button onClick={handleLogout}
                aria-label="Logout" title="Logout"
                className="flex flex-col items-center py-4 w-full hover:bg-gray-800 focus:bg-gray-800
                         text-gray-300 hover:text-white focus:text-white transition-colors">
          <div>
            <Icon name="logout" size="20" className="w-8 h-8" />
          </div>
          <div className='text-sm hidden md:block'>Logout</div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 
