import React from 'react';
import PropTypes from 'prop-types';

class RedactorTitleSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: props.title || '',
      warning: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.reset = this.reset.bind(this);
  }

  handleChange(event) {
    const text = event.target.value;
    let value = null;
    let warning = false;

    if (text.length > 0) {
      value = text.trim();

      if (value.length < 3 || value.length > 255) {
        value = null;
        warning = true;
      }
    }

    this.setState({
      text,
      warning,
    });

    this.props.onChange(value);
  }

  reset() {
    this.setState({
      text: '',
      warning: false,
    });

    this.props.onChange(null);
  }

  render() {
    const extraClassName = this.state.warning ? 'field__input_warning' : '';

    return (
      <div className="redactor__section redactor__section_united">
        <div className="field">
          <label className="field__label" htmlFor="titleInput">Тема</label>
          <div className="field__wrapper">
            <input
              type="text"
              id="titleInput"
              className={`field__input field__input_with-icon ${extraClassName}`}
              placeholder="О чём будете говорить?"
              value={this.state.text}
              onChange={this.handleChange}
            />
            <i
              className="field__icon"
              data-type="close"
              onClick={this.reset}
            />
          </div>
        </div>
      </div>
    );
  }
}

RedactorTitleSection.propTypes = {
  title: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default RedactorTitleSection;
