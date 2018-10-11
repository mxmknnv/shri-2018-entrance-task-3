import React from 'react';
import PropTypes from 'prop-types';

import Calendar from './Calendar';

class Plate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      calendarIsActive: false,
    };

    this.openCalendar = this.openCalendar.bind(this);
    this.closeCalendar = this.closeCalendar.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  openCalendar() {
    this.setState({
      calendarIsActive: true,
    });
  }

  closeCalendar() {
    this.setState({
      calendarIsActive: false,
    });
  }

  handleButtonClick(event) {
    const { type } = event.target.dataset;
    const date = new Date(this.props.currentDate);

    if (type === 'left') {
      date.setDate(date.getDate() - 1);
    } else {
      date.setDate(date.getDate() + 1);
    }

    this.props.setCurrentDate(date);
  }

  getTitle() {
    const { currentDate } = this.props;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let title;

    if (currentDate.getTime() === today.getTime()) {
      const localeString = currentDate.toLocaleString('ru', { month: 'short', day: 'numeric' }).slice(0, -1);
      title = `${localeString} · Сегодня`;
    } else {
      const localeString = currentDate.toLocaleString('ru', { month: 'long', day: 'numeric' });
      title = `${localeString} ${currentDate.getFullYear()}`;
    }

    return title;
  }

  render() {
    const extraClassName = this.state.calendarIsActive ? 'plate__date_active' : '';

    return (
      <div className="plate">
        <div className="plate__box">
          <i className="plate__button" data-type="left" onClick={this.handleButtonClick} />
          <span className={`plate__date ${extraClassName}`} onClick={this.openCalendar}>{this.getTitle()}</span>
          <i className="plate__button" data-type="right" onClick={this.handleButtonClick} />
        </div>
        {
          this.state.calendarIsActive ? (
            <Calendar
              mode="plate"
              date={this.props.currentDate}
              onDateSelect={this.props.setCurrentDate}
              closeCalendar={this.closeCalendar}
            />
          ) : (
            null
          )
        }
      </div>
    );
  }
}

Plate.propTypes = {
  currentDate: PropTypes.instanceOf(Date).isRequired,
  setCurrentDate: PropTypes.func.isRequired,
};

export default Plate;
