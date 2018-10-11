export const OPEN_POPUP = 'OPEN_POPUP';
export const CLOSE_POPUP = 'CLOSE_POPUP';

export function openPopup(setup) {
  return {
    type: OPEN_POPUP,
    setup,
  };
}

export function closePopup() {
  return {
    type: CLOSE_POPUP,
  };
}
