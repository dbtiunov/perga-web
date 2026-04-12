import React, { useMemo } from 'react';

import { Dropdown } from '@common/components/Dropdown';
import { Icon } from '@common/components/Icon';
import { Toggle, ToggleOption } from '@common/components/Toggle';
import { PlannerViewMode } from '@planner/types';

interface PlannerConfigProps {
  viewMode: PlannerViewMode;
  onViewModeChange: (mode: PlannerViewMode) => void;
}

const PlannerConfig: React.FC<PlannerConfigProps> = ({ viewMode, onViewModeChange }) => {
  const viewModeOptions = useMemo<ToggleOption<PlannerViewMode>[]>(
    () => [
      { value: 'daily', label: 'Daily' },
      { value: 'weekly', label: 'Weekly' },
    ],
    [],
  );

  return (
    <>
      <Dropdown
        buttonIcon={<Icon name="settings" size={20} />}
        buttonTitle="Preferences"
        buttonClassName="p-2 text-text-muted hover:text-text-main transition-colors"
        dropdownClassName="w-72 p-4"
      >
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-text-main">Planner View</span>

          <Toggle options={viewModeOptions} value={viewMode} onChange={onViewModeChange} />
        </div>
      </Dropdown>
    </>
  );
};

export default PlannerConfig;
