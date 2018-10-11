import { OPEN_REDACTOR, CLOSE_REDACTOR } from '../actions';

function reducer(state = null, action) {
  switch (action.type) {
    case OPEN_REDACTOR: {
      return { ...state, activeSection: 'redactor' };
    }

    case CLOSE_REDACTOR: {
      return { ...state, activeSection: 'table' };
    }

    default:
      return state;
  }
}

export default reducer;
