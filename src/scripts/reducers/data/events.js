import { queryActions } from '../../actions';

const actions = queryActions.eventsByDate;

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
      const data = action.data.eventsByDate.map(event => ({
        ...event,
        dateStart: new Date(event.dateStart),
        dateEnd: new Date(event.dateEnd),
      }));

      return {
        data,
        date: action.payload.date,
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
