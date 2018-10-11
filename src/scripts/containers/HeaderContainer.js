import { connect } from 'react-redux';

import { openRedactor } from '../actions';
import Header from '../components/Header';

function mapStateToProps(state) {
  return {
    activeSection: state.interface.activeSection,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    openRedactor: (mode, setup) => dispatch(openRedactor(mode, setup)),
  };
}

const HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header);

export default HeaderContainer;
