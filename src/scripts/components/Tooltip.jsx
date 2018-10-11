import React from 'react';
import PropTypes from 'prop-types';

class Tooltip extends React.Component {
  constructor(props) {
    super(props);

    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleWindowClick = this.handleWindowClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.handleWindowClick, true);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleWindowClick, true);
  }

  handleWindowClick(event) {
    if (!this.tooltipElement.contains(event.target)) {
      this.props.closeTooltip();
    }
  }

  handleEditClick() {
    this.props.onEdit(this.props.event.id);
    this.props.closeTooltip();
  }

  render() {
    return (
      <div
        className="tooltip"
        style={{ top: `${this.props.coordinates.tooltipTop}px`, left: `${this.props.coordinates.tooltipLeft}px` }}
        ref={(element) => { this.tooltipElement = element; }}
      >
        <p className="tooltip__event-title tooltip_ellipsis">{this.props.event.title}</p>
        <p className="tooltip__event-description tooltip_ellipsis">{getEventDescription(this.props.event, this.props.room)}</p>
        <i className="tooltip__button" onClick={this.handleEditClick} />
        <div className="tooltip__user-block">
          <img className="tooltip__user-avatar" src={this.props.user.avatar} alt={this.props.user.login} />
          <span className="tooltip__user-description">
            <span className="tooltip__user-login tooltip_ellipsis">{this.props.user.login}</span>
            {` и ${this.props.usersAmount} участник(ов)`}
          </span>
        </div>
        <div className={`tooltip__arrow ${this.props.coordinates.arrowClassName}`} style={{ left: `${this.props.coordinates.arrowLeft}px` }} />
      </div>
    );
  }
}

Tooltip.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    dateStart: PropTypes.instanceOf(Date).isRequired,
    dateEnd: PropTypes.instanceOf(Date).isRequired,
    room: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
    users: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  room: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    floor: PropTypes.number.isRequired,
    capacity: PropTypes.number.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    login: PropTypes.string.isRequired,
    floor: PropTypes.number.isRequired,
    avatar: PropTypes.string.isRequired,
  }).isRequired,
  coordinates: PropTypes.shape({
    tooltipTop: PropTypes.number.isRequired,
    tooltipLeft: PropTypes.number.isRequired,
    arrowLeft: PropTypes.number.isRequired,
    arrowClassName: PropTypes.string.isRequired,
  }).isRequired,
  usersAmount: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  closeTooltip: PropTypes.func.isRequired,
};

export default Tooltip;

function getEventDescription(event, room) {
  const date = event.dateStart.toLocaleString('ru', { month: 'long', day: 'numeric' });
  const timeStart = event.dateStart.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
  const timeEnd = event.dateEnd.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });

  return `${date}, ${timeStart}—${timeEnd} · ${room.title}`;
}
