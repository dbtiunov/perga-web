import { useLocation } from 'react-router-dom';
import { Icon } from '@common/Icon';

interface MobileHeaderProps {
  toggleSidebar: () => void;
}

const MobileHeader = ({ toggleSidebar }: MobileHeaderProps) => {
  const location = useLocation();

  // Get the current section name based on the route
  const getSectionName = () => {
    const path = location.pathname;
    if (path.includes('planner')) return 'Planner';
    if (path.includes('projects')) return 'Projects';
    if (path.includes('notes')) return 'Notes';
    if (path.includes('settings')) return 'Settings';
    return 'Perga';
  };

  return (
    <header className="md:hidden bg-gray-700 text-white p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-40">
      <button 
        onClick={toggleSidebar}
        className="p-1"
        aria-label="Toggle sidebar"
        title="Toggle sidebar"
      >
        <Icon name="hamburger" size={24} className="h-6 w-6" />
      </button>
      <h1 className="text-lg font-semibold">{getSectionName()}</h1>
      <div className="w-6"></div> {/* Empty div for balanced layout */}
    </header>
  );
};

export default MobileHeader;
