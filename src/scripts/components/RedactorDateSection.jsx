import React from 'react';
import PropTypes from 'prop-types';

import Calendar from './Calendar';

class RedactorDateSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: {
        text: '',
        warning: false,
      },
      timeStart: {
        text: '',
        warning: false,
      },
      timeEnd: {
        text: '',
        warning: false,
      },
      calendarIsActive: false,
    };

    if (props.date !== null && props.timeStart !== null && props.timeEnd !== null) {
      this.state.date.text = getTextDateFromDateObject(props.date);
      this.state.timeStart.text = getTextTimeFromDateObject(new Date(props.date.getTime()
        + props.timeStart));
      this.state.timeEnd.text = getTextTimeFromDateObject(new Date(props.date.getTime()
        + props.timeEnd));
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDateSelect = this.handleDateSelect.bind(this);
    this.openCalendar = this.openCalendar.bind(this);
    this.closeCalendar = this.closeCalendar.bind(this);
  }

  handleInputChange(event) {
    const text = event.target.value;
    const { type } = event.target.dataset;
    const value = type === 'date' ? getDateObjectFromTextDate(text) : getMillisecondsFromTextTime(text);

    this.setState({
      [type]: {
        text,
        warning: text.length > 0 && value === null,
      },
    });

    this.props.onChange(type, value);
  }

  handleDateSelect(date) {
    const text = getTextDateFromDateObject(date);

    this.setState({
      date: {
        text,
        warning: false,
      },
    });

    this.props.onChange('date', date);
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

  reset() {
    this.setState({
      date: {
        text: '',
        warning: false,
      },
      timeStart: {
        text: '',
        warning: false,
      },
      timeEnd: {
        text: '',
        warning: false,
      },
      calendarIsActive: false,
    });
  }

  render() {
    const dateExtraClassName = this.state.date.warning ? 'field__input_warning' : '';
    const timeStartExtraClassName = this.state.timeStart.warning ? 'field__input_warning' : '';
    const timeEndExtraClassName = this.state.timeEnd.warning ? 'field__input_warning' : '';

    return (
      <div className="redactor__section redactor__section_united">
        <div className="field field_date">
          <label htmlFor="dateInput" className="field__label">Дата</label>
          <div className="field__wrapper">
            <input
              type="text"
              id="dateInput"
              className={`field__input field__input_date field__input_with-icon ${dateExtraClassName}`}
              data-type="date"
              placeholder="dd mm, yyyy"
              value={this.state.date.text}
              onChange={this.handleInputChange}
            />
            <i className="field__icon" data-type="calendar" onClick={this.openCalendar} />
            {
              this.state.calendarIsActive && (
                <Calendar
                  mode="field"
                  date={getDateObjectFromTextDate(this.state.date.text)}
                  onDateSelect={this.handleDateSelect}
                  closeCalendar={this.closeCalendar}
                />
              )
            }
          </div>
        </div>
        <div className="field field_time-start">
          <label className="field__label" htmlFor="timeStartInput">Начало</label>
          <input
            type="text"
            id="timeStartInput"
            className={`field__input field__input_time ${timeStartExtraClassName}`}
            data-type="timeStart"
            placeholder="hh:mm"
            value={this.state.timeStart.text}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="field field_time-end">
          <label className="field__label" htmlFor="timeEndInput">Конец</label>
          <input
            type="text"
            id="timeEndInput"
            className={`field__input field__input_time ${timeEndExtraClassName}`}
            data-type="timeEnd"
            placeholder="hh:mm"
            value={this.state.timeEnd.text}
            onChange={this.handleInputChange}
          />
        </div>
      </div>
    );
  }
}

// Формат даты: "dd mm, yyyy"

function getDateObjectFromTextDate(text) {
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const regExp = /^(\d{1,2}) (января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря), (\d{4})$/g;
  const res = regExp.exec(text.trim());

  if (res !== null) {
    const d = Number.parseInt(res[1], 10);
    const m = months.indexOf(res[2]);
    const y = Number.parseInt(res[3], 10);

    return new Date(y, m, d);
  }

  return null;
}

function getTextDateFromDateObject(date) {
  const dm = date.toLocaleString('ru', { month: 'long', day: 'numeric' });
  const y = date.toLocaleString('ru', { year: 'numeric' });

  return `${dm}, ${y}`;
}

// Формат времени: "hh:mm"

function getMillisecondsFromTextTime(text) {
  const regExp = /^(\d{1,2}):(\d{2})$/;
  const res = regExp.exec(text.trim());

  if (res !== null) {
    const h = Number.parseInt(res[1], 10);
    const m = Number.parseInt(res[2], 10);

    if ((h >= 0 && h <= 23) && (m >= 0 && m <= 59)) {
      return (((h * 60) + m) * 60) * 1000;
    }
  }

  return null;
}

function getTextTimeFromDateObject(date) {
  return date.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
}

RedactorDateSection.propTypes = {
  date: PropTypes.instanceOf(Date),
  timeStart: PropTypes.number,
  timeEnd: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

export default RedactorDateSection;
