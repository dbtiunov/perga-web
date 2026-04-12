import { describe, it, expect } from 'vitest';
import {
  getStartOfWeek,
  getEndOfWeek,
  formatWeekRange,
  getPrevWeek,
  getNextWeek,
} from './date_utils';

describe('date_utils', () => {
  describe('getStartOfWeek', () => {
    const mondayDate = new Date(2025, 10, 17); // Monday, Nov 17, 2025
    const sundayDate = new Date(2025, 10, 23); // Sunday, Nov 23, 2025

    it('should return Monday when week starts on Monday', () => {
      expect(getStartOfWeek(mondayDate, 'monday').getDay()).toBe(1); // Monday
      expect(getStartOfWeek(sundayDate, 'monday').getDay()).toBe(1); // Monday
      expect(getStartOfWeek(sundayDate, 'monday').getDate()).toBe(17);
    });

    it('should return Sunday when week starts on Sunday', () => {
      expect(getStartOfWeek(mondayDate, 'sunday').getDay()).toBe(0); // Sunday
      expect(getStartOfWeek(mondayDate, 'sunday').getDate()).toBe(16);
      expect(getStartOfWeek(sundayDate, 'sunday').getDay()).toBe(0); // Sunday
      expect(getStartOfWeek(sundayDate, 'sunday').getDate()).toBe(23);
    });
  });

  describe('getEndOfWeek', () => {
    it('should return Sunday when week starts on Monday', () => {
      const date = new Date(2025, 10, 19); // Wednesday, Nov 19
      const end = getEndOfWeek(date, 'monday');
      expect(end.getDay()).toBe(0); // Sunday
      expect(end.getDate()).toBe(23);
    });

    it('should return Saturday when week starts on Sunday', () => {
      const date = new Date(2025, 10, 19); // Wednesday, Nov 19
      const end = getEndOfWeek(date, 'sunday');
      expect(end.getDay()).toBe(6); // Saturday
      expect(end.getDate()).toBe(22);
    });
  });

  describe('formatWeekRange', () => {
    it('should format range within same month', () => {
      const start = new Date(2025, 10, 17);
      const end = new Date(2025, 10, 23);
      expect(formatWeekRange(start, end)).toBe('Nov 17 - 23, 2025');
    });

    it('should format range across months', () => {
      const start = new Date(2025, 10, 27);
      const end = new Date(2025, 11, 3);
      expect(formatWeekRange(start, end)).toBe('Nov 27 - Dec 3, 2025');
    });
  });

  describe('getPrevWeek / getNextWeek', () => {
    it('should move by 7 days', () => {
      const date = new Date(2025, 10, 17);
      expect(getNextWeek(date).getDate()).toBe(24);
      expect(getPrevWeek(date).getDate()).toBe(10);
    });
  });
});
