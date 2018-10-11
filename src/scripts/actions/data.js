import queryRequest from './API/queryRequest';
import mutationRequest from './API/mutationRequest';

export const queryActions = {
  eventsByDate: {
    loading: 'EVENTS_LOADING',
    success: 'EVENTS_SUCCESS',
    failure: 'EVENTS_FAILURE',
  },
  rooms: {
    loading: 'ROOMS_LOADING',
    success: 'ROOMS_SUCCESS',
    failure: 'ROOMS_FAILURE',
  },
  users: {
    loading: 'USERS_LOADING',
    success: 'USERS_SUCCESS',
    failure: 'USERS_FAILURE',
  },
};

export const mutationActions = {
  loading: 'MUTATION_LOADING',
  success: 'MUTATION_SUCCESS',
  failure: 'MUTATION_FAILURE',
};

export function makeMutationRequest(list) {
  return (dispatch) => {
    console.log('makeMutationRequest.loading');

    dispatch({ type: mutationActions.loading });

    return mutationRequest(list)().then((data) => {
      console.log('makeMutationRequest.success, data', data);

      dispatch({ type: mutationActions.success, data });
      return Promise.resolve(data);
    }).catch((error) => {
      console.log('makeMutationRequest.failure, error:', error);

      dispatch({ type: mutationActions.failure, error });
      return Promise.reject(error);
    });
  };
}

export function makeQueryRequest(list) {
  return (dispatch) => {
    console.log('makeQueryRequest.loading');

    list.forEach(el => dispatch({ type: queryActions[el.type].loading }));

    return queryRequest(list)().then((data) => {
      console.log('makeQueryRequest.success, data', data);

      list.forEach(el => dispatch({
        type: queryActions[el.type].success,
        data,
        payload: el.payload,
      }));

      return Promise.resolve(data);
    }).catch((error) => {
      console.log('makeQueryRequest.failure, error', error);

      list.forEach(el => dispatch({ type: queryActions[el.type].failure, error }));
      return Promise.reject(error);
    });
  };
}
