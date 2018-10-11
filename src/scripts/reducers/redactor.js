import { OPEN_REDACTOR, CLOSE_REDACTOR } from '../actions';

function reducer(state = null, action) {
  switch (action.type) {
    case OPEN_REDACTOR: {
      return { mode: action.mode, setup: action.setup };
    }

    case CLOSE_REDACTOR: {
      return { mode: null, setup: {} };
    }

    default:
      return state;
  }
}

export default reducer;
