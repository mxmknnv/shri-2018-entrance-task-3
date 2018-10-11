import { connect } from 'react-redux';

import App from '../components/App';

function mapStateToProps(state) {
  return {
    activeSection: state.interface.activeSection,
    popupIsActive: state.popup.isActive,
  };
}

const AppContainer = connect(mapStateToProps, null)(App);

export default AppContainer;
