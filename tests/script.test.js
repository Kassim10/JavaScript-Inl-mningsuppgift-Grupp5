import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isValidTodo } from '../js/script.js';
 
function buildDOM() {
  document.body.innerHTML = `
    <form>
      <input id="item-input" type="text" />
      <button type="submit">Lägg till</button>
    </form>
    <ul class="items"></ul>
    <button id="clear" hidden>Rensa lista</button>
    <dialog>
      <p id="message"></p>
      <button id="close-modal">Stäng</button>
    </dialog>
  `;
  const dialog = document.querySelector('dialog');
  dialog.showModal = vi.fn();
  dialog.close = vi.fn();
}
 
describe('isValidTodo', () => {
  beforeEach(buildDOM);
 
  it('returns false for an empty todo string', () => {
    expect(isValidTodo('')).toBe(false);
  });
 
  it('returns true for a non-empty todo string', () => {
    expect(isValidTodo('Handla mat')).toBe(true);
  });
});
