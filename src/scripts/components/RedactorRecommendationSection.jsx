import React from 'react';
import PropTypes from 'prop-types';

import { getRecommendation } from '../getRecommendation';

class RedactorRecommendationSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleSelect(rec) {
    const dateStart = new Date(this.props.date.getTime() + this.props.timeStart);
    let warnings = [];

    if (rec.date.start.getTime() !== dateStart.getTime()) {
      const timeFrom = dateStart.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
      const timeTo = rec.date.start.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });

      warnings.push(`При выборе данной переговорки начало встречи (${timeTo}) будет отличатся от указанного (${timeFrom}).`);
    }

    if (rec.swap.length > 0) {
      warnings.push('Следующие встречи будут перенесены:');
      warnings = warnings.concat(
        getTextDesctiptionForSwap(rec.swap, this.props.events, this.props.rooms)
      );
    }

    if (warnings.length > 0) {
      this.props.openPopup({
        emoji: 'emoji4',
        title: 'Обратите внимание!',
        lines: warnings,
        buttons: [
          {
            type: 'button_blue',
            title: 'Хорошо',
            callback: () => { this.handleSelectHelper(rec); },
          },
        ],
      });
    } else {
      this.handleSelectHelper(rec);
    }
  }

  handleSelectHelper({ date, roomId, swap }) {
    this.props.onChange({
      isSelected: true,
      dateStart: date.start,
      dateEnd: date.end,
      roomId,
      swap,
    });
  }

  handleUnselect() {
    this.props.onChange({
      isSelected: false,
      dateStart: null,
      dateEnd: null,
      roomId: null,
      swap: [],
    });
  }

  renderSelectedRec() {
    const rec = {
      date: {
        start: this.props.recommendation.dateStart,
        end: this.props.recommendation.dateEnd,
      },
      roomId: this.props.recommendation.roomId,
    };

    const room = this.props.rooms.data.find(room => room.id === rec.roomId);

    return (
      <div className="recommendations">
        <div className="recommendations__room recommendations__room_selected">
          <span className="recommendations__time">{getTimeInterval(rec.date)}</span>
          <span className="recommendations__description">
            <span className="recommendations__title">{room.title}</span>
            {` · ${room.floor} этаж`}
          </span>
          <i className="recommendations__icon" onClick={() => { this.handleUnselect(); }} />
        </div>
      </div>
    );
  }

  renderAllRecs() {
    if (!this.props.events.isSuccess
      || this.props.date === null
      || this.props.timeStart === null
      || this.props.timeEnd === null
    ) {
      return null;
    }

    const date = {
      start: new Date(this.props.date.getTime() + this.props.timeStart),
      end: new Date(this.props.date.getTime() + this.props.timeEnd),
    };

    const members = getMembers(this.props.memberIds, this.props.users.data);

    const events = this.props.mode === 'edit'
      ? this.props.events.data.filter(event => event.id !== this.props.eventId)
      : this.props.events.data;

    const recs = getRecommendation(date, members, {
      events,
      rooms: this.props.rooms.data,
      users: this.props.users.data,
    });

    return (
      <div className="recommendations">
        {
          recs.length > 0 ? (
            recs.map((rec) => {
              const room = this.props.rooms.data.find(room => room.id === rec.roomId);

              return (
                <div className="recommendations__room" key={rec.roomId} onClick={() => { this.handleSelect(rec); }}>
                  <span className="recommendations__time">{getTimeInterval(rec.date)}</span>
                  <span className="recommendations__description">
                    <span className="recommendations__title">{room.title}</span>
                    {` · ${room.floor} этаж`}
                  </span>
                </div>
              );
            })
          ) : (
            <p className="recommendations__message">Нет подходящих переговорок</p>
          )
        }
      </div>
    );
  }

  getRecLabel() {
    if (this.props.events.isLoading) return 'Загрузка данных';
    if (this.props.events.isFailure) return 'Невозможно получить данные от сервера!';
    if (this.props.recommendation.isSelected) return 'Ваша переговорка';

    return 'Рекомендованные переговорки';
  }

  render() {
    return (
      <div className="redactor__section redactor__section_separate">
        <div className="field">
          <p className="field__label">{this.getRecLabel()}</p>
          {
            this.props.recommendation.isSelected ? this.renderSelectedRec() : this.renderAllRecs()
          }
        </div>
      </div>
    );
  }
}

export default RedactorRecommendationSection;

RedactorRecommendationSection.propTypes = {
  mode: PropTypes.string.isRequired,
  eventId: PropTypes.string.isRequired,
  recommendation: PropTypes.shape({
    isSelected: PropTypes.bool,
    dateStart: PropTypes.instanceOf(Date),
    dateEnd: PropTypes.instanceOf(Date),
    roomId: PropTypes.string,
    swap: PropTypes.array,
  }).isRequired,
  memberIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  date: PropTypes.instanceOf(Date),
  timeStart: PropTypes.number,
  timeEnd: PropTypes.number,
  events: PropTypes.shape({
    data: PropTypes.array,
    date: PropTypes.instanceOf(Date),
    isLoading: PropTypes.bool,
    isSuccess: PropTypes.bool,
    isFailure: PropTypes.bool,
  }).isRequired,
  rooms: PropTypes.shape({
    data: PropTypes.array,
    isLoading: PropTypes.bool,
    isSuccess: PropTypes.bool,
    isFailure: PropTypes.bool,
  }).isRequired,
  users: PropTypes.shape({
    data: PropTypes.array,
    isLoading: PropTypes.bool,
    isSuccess: PropTypes.bool,
    isFailure: PropTypes.bool,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  openPopup: PropTypes.func.isRequired,
};

function getTimeInterval(date) {
  const start = date.start.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
  const end = date.end.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });

  return `${start} - ${end}`;
}

// swap: [{eventId, roomId}]

function getTextDesctiptionForSwap(swap, events, rooms) {
  const res = [];

  for (let i = 0; i < swap.length; i++) {
    const event = events.find(event => event.id === swap[i].eventId);
    const roomTo = rooms.find(room => room.id === swap[i].roomId);
    const roomFrom = rooms.find(room => room.id === event.room.id);

    res.push(`"${event.title}" из "${roomFrom.title}" в "${roomTo.title}"`);
  }

  return res;
}

function getMembers(userIds, users) {
  return userIds.map(userId => users.find(user => user.id === userId));
}
