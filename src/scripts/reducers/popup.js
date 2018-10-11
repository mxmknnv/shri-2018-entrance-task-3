import { OPEN_POPUP, CLOSE_POPUP } from '../actions';

function reducer(state = null, action) {
  switch (action.type) {
    case OPEN_POPUP: {
      return { isActive: true, ...action.setup };
    }

    case CLOSE_POPUP: {
      return { isActive: false };
    }

    default:
      return state;
  }
}

export default reducer;
