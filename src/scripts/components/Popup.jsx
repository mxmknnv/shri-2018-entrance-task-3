import React from 'react';
import PropTypes from 'prop-types';

function Popup(props) {
  return (
    <div className="popup">
      <div className="popup__window">
        <img className="popup__emoji" src={`./assets/emoji/${props.emoji}.svg`} alt="Emoji" />
        <p className="popup__title">{props.title}</p>
        <div className="popup__lines">
          { props.lines.map(line => (<p className="popup__line" key={line}>{line}</p>)) }
        </div>
        <div className="popup__buttons">
          {
            props.buttons.map(button => (
              <button
                key={button.title}
                type="button"
                className={`popup__button button ${button.type}`}
                onClick={() => {
                  if (typeof button.callback === 'function') {
                    button.callback();
                  }

                  props.closePopup();
                }}
              >
                {button.title}
              </button>
            ))
          }
        </div>
      </div>
    </div>
  );
}

Popup.propTypes = {
  emoji: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  lines: PropTypes.arrayOf(PropTypes.string).isRequired,
  buttons: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    title: PropTypes.string,
    callback: PropTypes.func,
  })).isRequired,
  closePopup: PropTypes.func.isRequired,
};

export default Popup;
