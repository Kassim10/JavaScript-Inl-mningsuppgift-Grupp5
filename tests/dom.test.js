import { describe, it, expect } from 'vitest';
import { createHtml } from '../js/dom.js';
 
describe('createHtml', () => {
  it('returns an <li> element', () => {
    const el = createHtml('Handla mat');
    expect(el.tagName).toBe('LI');
  });
 
  it('stores the todo text in firstChild.textContent', () => {
    const el = createHtml('Handla mat');
    expect(el.firstChild.textContent).toBe('Handla mat');
  });
 
  it('contains a button with class btn-delete', () => {
    const el = createHtml('Städa');
    expect(el.querySelector('.btn-delete')).not.toBeNull();
  });
 
  it('the delete button contains an ion-icon element', () => {
    const el = createHtml('Städa');
    expect(el.querySelector('ion-icon')).not.toBeNull();
  });
 
  it('returns a new element on every call', () => {
    expect(createHtml('A')).not.toBe(createHtml('A'));
  });
 
  it('works with Swedish characters', () => {
    const el = createHtml('Köp mjölk');
    expect(el.firstChild.textContent).toBe('Köp mjölk');
  });
});
 