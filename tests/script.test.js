import { beforeEach, describe, expect, it } from 'vitest';
import { isValidTodo } from '../js/script.js';

describe('isValidTodo', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <dialog>
        <p id="message"></p>
        <button id="close-modal" type="button">Stang</button>
      </dialog>
    `;
  });

  it('returns false for an empty todo string', () => {
    expect(isValidTodo('')).toBe(false);
  });

  it('returns true for a non-empty todo string', () => {
    expect(isValidTodo('Handla mat')).toBe(true);
  });
});
