import { beforeEach, describe, expect, it } from 'vitest';
import {
  STORAGE_KEY,
  getFromStorage,
  addToStorage,
  removeFromStorage,
  clearStorage,
} from '../js/script.js';

describe('STORAGE_KEY', () => {
  it('is the string "todos"', () => {
    expect(STORAGE_KEY).toBe('todos');
  });
});
 
describe('getFromStorage', () => {
  beforeEach(() => localStorage.clear());
 
  it('returns an empty array when nothing is stored', () => {
    expect(getFromStorage(STORAGE_KEY)).toEqual([]);
  });
 
  it('returns the stored array', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['Handla', 'Städa']));
    expect(getFromStorage(STORAGE_KEY)).toEqual(['Handla', 'Städa']);
  });
});
 
describe('addToStorage', () => {
  beforeEach(() => localStorage.clear());
 
  it('persists a new item', () => {
    addToStorage('Läsa bok', STORAGE_KEY);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toContain('Läsa bok');
  });
 
  it('appends without removing existing items', () => {
    addToStorage('Första', STORAGE_KEY);
    addToStorage('Andra', STORAGE_KEY);
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(stored).toContain('Första');
    expect(stored).toContain('Andra');
  });
});
 
describe('removeFromStorage', () => {
  beforeEach(() => localStorage.clear());
 
  it('removes the specified item', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['Behåll', 'Ta bort']));
    removeFromStorage('Ta bort', STORAGE_KEY);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).not.toContain('Ta bort');
  });
 
  it('keeps other items intact', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['Behåll', 'Ta bort']));
    removeFromStorage('Ta bort', STORAGE_KEY);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toContain('Behåll');
  });
 
  it('does not throw when the item does not exist', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['Behåll']));
    expect(() => removeFromStorage('Finns inte', STORAGE_KEY)).not.toThrow();
  });
});
 
describe('clearStorage', () => {
  beforeEach(() => localStorage.clear());
 
  it('removes the key from localStorage entirely', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['A', 'B']));
    clearStorage(STORAGE_KEY);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
