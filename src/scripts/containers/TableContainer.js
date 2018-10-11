import { connect } from 'react-redux';

import { openRedactor, makeQueryRequest } from '../actions';
import Table from '../components/Table';

function mapStateToProps(state) {
  return {
    events: state.data.events,
    users: state.data.users,
    rooms: state.data.rooms,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    openRedactor: (mode, setup) => dispatch(openRedactor(mode, setup)),
    makeQueryRequest: list => dispatch(makeQueryRequest(list)),
  };
}

const TableContainer = connect(mapStateToProps, mapDispatchToProps)(Table);

export default TableContainer;
