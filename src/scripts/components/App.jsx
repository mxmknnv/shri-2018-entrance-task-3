import React from 'react';
import PropTypes from 'prop-types';

import HeaderContainer from '../containers/HeaderContainer';
import TableContainer from '../containers/TableContainer';
import RedactorContainer from '../containers/RedactorContainer';
import PopupContainer from '../containers/PopupContainer';

function App(props) {
  return (
    <React.Fragment>
      <HeaderContainer />
      <main className="content">
        { props.activeSection === 'table' && <TableContainer /> }
        { props.activeSection === 'redactor' && <RedactorContainer /> }
        { props.popupIsActive ? <PopupContainer /> : null }
      </main>
    </React.Fragment>
  );
}

App.propTypes = {
  activeSection: PropTypes.string.isRequired,
  popupIsActive: PropTypes.bool.isRequired,
};

export default App;
