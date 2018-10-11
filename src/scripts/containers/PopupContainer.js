import { connect } from 'react-redux';

import { closePopup } from '../actions';
import Popup from '../components/Popup';

function mapStateToProps(state) {
  return { ...state.popup };
}

function mapDispatchToProps(dispatch) {
  return {
    closePopup: () => dispatch(closePopup()),
  };
}

const PopupContainer = connect(mapStateToProps, mapDispatchToProps)(Popup);

export default PopupContainer;
