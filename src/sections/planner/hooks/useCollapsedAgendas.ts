import { useState, useEffect } from 'react';

const COLLAPSED_AGENDAS_STORAGE_KEY = 'collapsed_agendas';

export const useCollapsedAgendas = () => {
  // Initialize collapsedAgendas from localStorage if available
  const [collapsedAgendas, setCollapsedAgendas] = useState<Record<number, boolean>>(() => {
    try {
      const savedState = localStorage.getItem(COLLAPSED_AGENDAS_STORAGE_KEY);
      return savedState ? JSON.parse(savedState) : {};
    } catch (error) {
      console.error('Error loading collapsed agendas state from localStorage:', error);
      return {};
    }
  });

  // Save collapsed agendas state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSED_AGENDAS_STORAGE_KEY, JSON.stringify(collapsedAgendas));
    } catch (error) {
      console.error('Error saving collapsed agendas state to localStorage:', error);
    }
  }, [collapsedAgendas]);

  return {
    collapsedAgendas,
    setCollapsedAgendas,
  };
};
