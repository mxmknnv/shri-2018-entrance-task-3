import React from 'react';
import PropTypes from 'prop-types';

class Select extends React.Component {
  constructor(props) {
    super(props);

    this.handleWindowClick = this.handleWindowClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.handleWindowClick, true);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleWindowClick, true);
  }

  handleWindowClick(event) {
    if (!this.selectElement.contains(event.target)
      && !this.props.inputElement.contains(event.target)) {
      this.props.closeSelect();
    }
  }

  handleUnitClick(userId) {
    this.props.onSelect(userId);
  }

  render() {
    const text = this.props.inputText.trim();
    const users = this.props.users.filter(user => user.login.includes(text));

    const units = users.map(user => (
      <div className="select__unit" key={user.id} onClick={() => this.handleUnitClick(user.id)}>
        <img className="select__avatar" src={user.avatar} alt={user.login} />
        <span className="select__description">
          <span className="select__name">{user.login}</span>
          {` · ${user.floor} этаж`}
        </span>
      </div>
    ));

    const message = (<p className="select-message">Нет пользователей с таким именем</p>);

    return (
      <div className="select" ref={(e) => { this.selectElement = e; }}>
        {
          units.length > 0 ? units : message
        }
      </div>
    );
  }
}

Select.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    login: PropTypes.string.isRequired,
    floor: PropTypes.number.isRequired,
    avatar: PropTypes.string.isRequired,
  })).isRequired,
  inputText: PropTypes.string.isRequired,
  inputElement: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  closeSelect: PropTypes.func.isRequired,
};

export default Select;
