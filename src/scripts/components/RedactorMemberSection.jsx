import React from 'react';
import PropTypes from 'prop-types';

import Select from './Select';

class RedactorMemberSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputText: '',
      selectIsActive: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.addMember = this.addMember.bind(this);
    this.removeMember = this.removeMember.bind(this);
    this.closeSelect = this.closeSelect.bind(this);
  }

  handleInputChange(event) {
    const text = event.target.value;

    this.setState({
      inputText: text,
      selectIsActive: text.trim() !== '',
    });
  }

  handleInputFocus() {
    if (this.state.inputText.trim() !== '') {
      this.setState({
        selectIsActive: true,
      });
    }
  }

  addMember(userId) {
    this.setState({
      inputText: '',
      selectIsActive: false,
    });

    const memberIds = [
      ...this.props.memberIds,
      userId,
    ];

    this.props.onChange(memberIds);
  }

  removeMember(userId) {
    const index = this.props.memberIds.indexOf(userId);

    const memberIds = [
      ...this.props.memberIds.slice(0, index),
      ...this.props.memberIds.slice(index + 1),
    ];

    this.props.onChange(memberIds);
  }

  closeSelect() {
    this.setState({
      selectIsActive: false,
    });
  }

  reset() {
    this.setState({
      inputText: '',
      selectIsActive: false,
    });
  }

  render() {
    const members = getMembers(this.props.memberIds, this.props.users.data);
    const notMembers = getNotMembers(this.props.memberIds, this.props.users.data);

    return (
      <div className="redactor__section redactor__section_separate">
        <div className="field">
          <label className="field__label" htmlFor="selectTextInput" >Участники</label>
          <div className="field__wrapper">
            <input
              type="text"
              id="selectTextInput"
              className="field__input"
              placeholder="Например, Тор Одинович"
              value={this.state.inputText}
              onChange={this.handleInputChange}
              onFocus={this.handleInputFocus}
              ref={(e) => { this.inputElement = e; }}
            />
          </div>
          {
            this.state.selectIsActive && (
              <Select
                users={notMembers}
                inputText={this.state.inputText}
                inputElement={this.inputElement}
                onSelect={this.addMember}
                closeSelect={this.closeSelect}
              />
            )
          }
          <div className="members field__members">
            {
              members.map(user => (
                <div className="members__unit" key={user.id}>
                  <img className="members__avatar" src={user.avatar} alt={user.login} />
                  <span className="members__name">{user.login}</span>
                  <i className="members__icon" onClick={() => this.removeMember(user.id)} />
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}

RedactorMemberSection.propTypes = {
  users: PropTypes.shape({
    data: PropTypes.array,
    isLoading: PropTypes.bool,
    isSuccess: PropTypes.bool,
    isFailure: PropTypes.bool,
  }).isRequired,
  memberIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RedactorMemberSection;

function getMembers(userIds, users) {
  return userIds.map(userId => users.find(user => user.id === userId));
}

function getNotMembers(userIds, users) {
  return users.filter(user => !userIds.includes(user.id));
}
