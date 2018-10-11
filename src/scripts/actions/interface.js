export const OPEN_REDACTOR = 'OPEN_REDACTOR';
export const CLOSE_REDACTOR = 'CLOSE_REDACTOR';

export function openRedactor(mode, setup) {
  return {
    type: OPEN_REDACTOR,
    mode,
    setup,
  };
}

export function closeRedactor() {
  return {
    type: CLOSE_REDACTOR,
  };
}
