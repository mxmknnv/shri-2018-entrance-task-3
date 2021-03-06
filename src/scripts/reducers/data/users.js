import { queryActions } from '../../actions';

const actions = queryActions.users;

function reducer(state = null, action) {
  switch (action.type) {
    case actions.loading: {
      return {
        data: [],
        isLoading: true,
        isSuccess: false,
        isFailure: false,
      };
    }

    case actions.success: {
      return {
        data: action.data.users,
        isLoading: false,
        isSuccess: true,
        isFailure: false,
      };
    }

    case actions.failure: {
      return {
        data: [],
        isLoading: false,
        isSuccess: false,
        isFailure: true,
      };
    }

    default:
      return state;
  }
}

export default reducer;
