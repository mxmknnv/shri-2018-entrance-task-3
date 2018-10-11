import React from 'react';
import PropTypes from 'prop-types';

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    const date = this.props.date || new Date();
    date.setHours(0, 0, 0, 0);

    const currentMonth = new Date(date);
    currentMonth.setDate(1);

    this.state = {
      currentMonth,
    };

    this.handleWindowClick = this.handleWindowClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleCalendarDayClick = this.handleCalendarDayClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.handleWindowClick, true);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleWindowClick, true);
  }

  handleWindowClick(event) {
    if (!this.body.contains(event.target)) {
      this.props.closeCalendar();
    }
  }

  handleCalendarDayClick(event) {
    const { string } = event.target.dataset;
    const date = new Date(string);

    this.props.onDateSelect(date);
    this.props.closeCalendar();
  }

  handleButtonClick(event) {
    const { type } = event.target.dataset;
    const month = new Date(this.state.currentMonth);

    if (type === 'left') {
      month.setMonth(month.getMonth() - 1);
    } else {
      month.setMonth(month.getMonth() + 1);
    }

    this.setState({
      currentMonth: month,
    });
  }

  getDays(date) {
    const days = [];
    const month = date.getMonth();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let placeholdersCounter = 0;

    for (let i = 0; i < getDay(date); i++) {
      const key = `month-${date.getMonth()}_day-placeholder-${placeholdersCounter}`;
      placeholdersCounter += 1;

      days.push(<div className="calendar__day calendar__day_placeholder" key={key} />);
    }

    for (; date.getMonth() === month;) {
      const day = date.getDate();
      const key = `month-${date.getMonth()}_day-${day}`;
      const extraClassName = date.getTime() === today.getTime() ? 'calendar__day_today' : '';

      days.push(
        <div
          className={`calendar__day ${extraClassName}`}
          key={key}
          data-string={date.toString()}
          onClick={this.handleCalendarDayClick}
        >
          {day}
        </div>,
      );

      date.setDate(day + 1);
    }

    if (getDay(date) !== 0) {
      for (let i = getDay(date); i < 7; i++) {
        const key = `month-${date.getMonth() - 1}_day-placeholder-${placeholdersCounter}`;
        placeholdersCounter += 1;

        days.push(<div className="calendar__day calendar__day_placeholder" key={key} />);
      }
    }

    function getDay(date) {
      let day = date.getDay();

      if (day === 0) {
        day = 7;
      }

      return day - 1;
    }

    return days;
  }

  getWeeks(date) {
    const days = this.getDays(new Date(date));
    const weeks = [];

    for (let i = 0; days.length > 0; i++) {
      const key = `month-${date.getMonth()}_week-${i}`;
      weeks.push(<div className="calendar__week" key={key}>{days.splice(0, 7)}</div>);
    }

    return weeks;
  }

  getMonth(date) {
    const key = `month-${date.getMonth()}`;

    let title = date.toLocaleString('ru', { month: 'long' });
    title = title.charAt(0).toUpperCase() + title.slice(1);
    title += ` ${date.getFullYear()}`;

    return (
      <div className="calendar__month" key={key}>
        <div className="calendar__header">
          <p className="calendar__title">{title}</p>
          <div className="calendar__day-names">
            <span className="calendar__day-name">Пн</span>
            <span className="calendar__day-name">Вт</span>
            <span className="calendar__day-name">Ср</span>
            <span className="calendar__day-name">Чт</span>
            <span className="calendar__day-name">Пт</span>
            <span className="calendar__day-name">Сб</span>
            <span className="calendar__day-name">Вс</span>
          </div>
        </div>
        <div className="calendar__weeks">
          {
            this.getWeeks(date)
          }
        </div>
      </div>
    );
  }

  getMonths() {
    const currentMonth = new Date(this.state.currentMonth);

    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(currentMonth.getMonth() + 1);

    const previousMonth = new Date(currentMonth);
    previousMonth.setMonth(currentMonth.getMonth() - 1);

    const months = [
      this.getMonth(previousMonth),
      this.getMonth(currentMonth),
      this.getMonth(nextMonth),
    ];

    return (
      <div className="calendar__months">{months}</div>
    );
  }

  render() {
    const modeToExtraClassName = { field: 'field__calendar', plate: 'plate__calendar' };
    const extraClassName = modeToExtraClassName[this.props.mode];

    return (
      <div className={`calendar ${extraClassName}`} ref={(element) => { this.body = element; }}>
        <i className="calendar__button" data-type="left" onClick={this.handleButtonClick} />
        <i className="calendar__button" data-type="right" onClick={this.handleButtonClick} />
        {
          this.getMonths()
        }
      </div>
    );
  }
}

Calendar.propTypes = {
  date: PropTypes.instanceOf(Date),
  mode: PropTypes.string.isRequired,
  onDateSelect: PropTypes.func.isRequired,
  closeCalendar: PropTypes.func.isRequired,
};

export default Calendar;
