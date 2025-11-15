import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from '@sections/Sidebar';
import MobileHeader from '@sections/MobileHeader';
import { ToastProvider } from '@contexts/ToastContext';

const Layout = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <ToastProvider>
      <div className="h-screen max-w-full overflow-x-hidden bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
        <div className={`${isSidebarVisible ? 'block' : 'hidden'} md:block z-30 relative`}>
          <Sidebar />
        </div>
        <MobileHeader toggleSidebar={toggleSidebar} />
        <main
          className={`bg-white transition-all duration-300 ${isSidebarVisible ? 'ml-14' : 'ml-0'} md:ml-20 
                         text-gray-600 overflow-x-hidden pt-16 md:pt-0 relative z-20 min-h-screen`}
        >
          <Outlet />
        </main>
      </div>
    </ToastProvider>
  );
};

export default Layout;
