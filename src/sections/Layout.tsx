import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from '@sections/Sidebar';
import MobileHeader from '@sections/MobileHeader';

const Layout = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="h-screen max-w-full overflow-x-hidden">
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarVisible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" 
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        />
      )}

      <div className={`${isSidebarVisible ? 'block' : 'hidden'} md:block z-30 relative`}>
        <Sidebar />
      </div>
      <MobileHeader toggleSidebar={toggleSidebar} />
      <main className={`bg-white transition-all duration-300 ${isSidebarVisible ? 'ml-14' : 'ml-0'} md:ml-20 
                       text-gray-600 overflow-x-hidden pt-16 md:pt-0 relative z-20 min-h-screen`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 
