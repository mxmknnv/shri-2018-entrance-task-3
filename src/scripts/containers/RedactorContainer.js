import { connect } from 'react-redux';

import {
  openPopup,
  closeRedactor,
  makeMutationRequest,
  makeQueryRequest,
} from '../actions';

import Redactor from '../components/Redactor';

function mapStateToProps(state) {
  return {
    mode: state.redactor.mode,
    setup: state.redactor.setup,
    events: state.data.events,
    users: state.data.users,
    rooms: state.data.rooms,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    openPopup: setup => dispatch(openPopup(setup)),
    closeRedactor: () => dispatch(closeRedactor()),
    makeMutationRequest: list => dispatch(makeMutationRequest(list)),
    makeQueryRequest: list => dispatch(makeQueryRequest(list)),
  };
}

const RedactorContainer = connect(mapStateToProps, mapDispatchToProps)(Redactor);

export default RedactorContainer;
