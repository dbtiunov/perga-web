import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '@contexts/hooks/useAuth.ts';
import { Icon } from '@common/Icon';
import { triggerRefresh } from '@common/events';
import Storage from '@common/utils/storage';
import { StorageKeys } from '@common/utils/storageKeys';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [isSpinning, setIsSpinning] = useState(false);
  const spinTimeoutRef = useRef<number | null>(null);

  const [isDarkThemeEnabled, setIsDarkThemeEnabled] = useState<boolean>(() => {
    return Storage.getBoolean(StorageKeys.IsDarkThemeEnabled, false);
  });

  const handleRefreshClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    triggerRefresh();
    e.currentTarget.blur();

    setIsSpinning(true);
    if (spinTimeoutRef.current) {
      window.clearTimeout(spinTimeoutRef.current);
    }
    spinTimeoutRef.current = window.setTimeout(() => {
      setIsSpinning(false);
      spinTimeoutRef.current = null;
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) {
        window.clearTimeout(spinTimeoutRef.current);
      }
    };
  }, []);

  const navItems = [
    {
      path: '/planner/',
      label: 'Planner',
      icon: <Icon name="planner" size="20" fill="white" className="h-8 w-8" />,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/signin/');
  };

  const handleToggleThemeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();

    setIsDarkThemeEnabled((prev) => {
      const next = !prev;
      Storage.setBoolean(StorageKeys.IsDarkThemeEnabled, next);
      return next;
    });
  };

  return (
    <div className="h-screen bg-gray-700 flex flex-col transition-all duration-300 fixed w-14 md:w-20 pt-16 md:pt-0">
      <nav className="flex-grow">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            arial-label={item.label}
            title={item.label}
            className={`flex flex-col items-center py-4 hover:bg-gray-800 focus:bg-gray-800 text-gray-300 
                          hover:text-white focus:text-white transition-colors 
                            ${location.pathname === item.path ? 'bg-gray-800 text-white' : ''}`}
          >
            <div>{item.icon}</div>
            <div className="text-sm hidden md:block">{item.label}</div>
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <button
          onClick={handleRefreshClick}
          aria-label="Refresh data"
          title="Refresh data"
          className="flex flex-col items-center py-4 w-full hover:bg-gray-800 focus:bg-gray-800
                         text-gray-300 hover:text-white focus:text-white transition-colors"
        >
          <div>
            <Icon
              name="refresh"
              size="20"
              className={`w-6 h-6 ${isSpinning ? 'motion-safe:animate-spin' : ''}`}
            />
          </div>
          <div className="text-sm hidden md:block">Refresh</div>
        </button>

        <button
          onClick={handleToggleThemeClick}
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
          className="flex flex-col items-center py-4 w-full hover:bg-gray-800 focus:bg-gray-800
                         text-gray-300 hover:text-white focus:text-white transition-colors"
        >
          <div>
            <Icon name={isDarkThemeEnabled ? 'sun' : 'moon'} size="20" className="w-8 h-8" />
          </div>
          <div className="text-sm hidden md:block">Theme</div>
        </button>

        <Link
          to="/settings/profile/"
          aria-label="Settings"
          title="Settings"
          className={`flex flex-col items-center py-4 hover:bg-gray-800 focus:bg-gray-800 text-gray-300 
                        hover:text-white focus:text-white transition-colors 
                          ${location.pathname.startsWith('/settings') ? 'bg-gray-800 text-white' : ''}`}
        >
          <div>
            <Icon name="settings" size="20" className="w-8 h-8" />
          </div>
          <div className="text-sm hidden md:block">Settings</div>
        </Link>

        <button
          onClick={handleLogout}
          aria-label="Logout"
          title="Logout"
          className="flex flex-col items-center py-4 w-full hover:bg-gray-800 focus:bg-gray-800
                         text-gray-300 hover:text-white focus:text-white transition-colors"
        >
          <div>
            <Icon name="logout" size="20" className="w-8 h-8" />
          </div>
          <div className="text-sm hidden md:block">Logout</div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
