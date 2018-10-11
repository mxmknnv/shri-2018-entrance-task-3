import { mutationActions } from '../../actions';

function eventReducer(state = null, action) {
  switch (action.type) {
    case mutationActions.loading: {
      return {
        data: null,
        isLoading: true,
        isSuccess: false,
        isFailure: false,
      };
    }

    case mutationActions.success: {
      return {
        data: action.data,
        isLoading: false,
        isSuccess: true,
        isFailure: false,
      };
    }

    case mutationActions.failure: {
      return {
        data: null,
        isLoading: false,
        isSuccess: false,
        isFailure: true,
      };
    }

    default:
      return state;
  }
}

export default eventReducer;
