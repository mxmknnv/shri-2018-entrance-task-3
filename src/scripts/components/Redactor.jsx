import React from 'react';
import PropTypes from 'prop-types';

import RedactorTitleSection from './RedactorTitleSection';
import RedactorDateSection from './RedactorDateSection';
import RedactorMemberSection from './RedactorMemberSection';
import RedactorRecommendationSection from './RedactorRecommendationSection';

// mode: new || timeSegment || edit
// setup: {}  || dateStart, dateEnd, roomId || eventId

class Redactor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: null,
      date: null,
      timeStart: null,
      timeEnd: null,
      memberIds: [],
      recommendation: {
        isSelected: false,
        dateStart: null,
        dateEnd: null,
        roomId: null,
        swap: [],
      },
    };

    if (this.props.mode === 'timeSegment') {
      const dateValue = new Date(this.props.setup.dateStart);
      dateValue.setHours(0, 0, 0, 0);

      const timeStartValue = getMillisecondsFromDateObject(this.props.setup.dateStart);
      const timeEndValue = getMillisecondsFromDateObject(this.props.setup.dateEnd);

      this.state.date = dateValue;
      this.state.timeStart = timeStartValue;
      this.state.timeEnd = timeEndValue;

      this.state.recommendation = {
        isSelected: true,
        dateStart: this.props.setup.dateStart,
        dateEnd: this.props.setup.dateEnd,
        roomId: this.props.setup.roomId,
        swap: [],
      };
    }

    if (this.props.mode === 'edit') {
      const event = this.props.events.data.find(event => event.id === this.props.setup.eventId);
      const dateValue = new Date(event.dateStart);
      dateValue.setHours(0, 0, 0, 0);

      const timeStartValue = getMillisecondsFromDateObject(event.dateStart);
      const timeEndValue = getMillisecondsFromDateObject(event.dateEnd);

      this.state.title = event.title;
      this.state.date = dateValue;
      this.state.timeStart = timeStartValue;
      this.state.timeEnd = timeEndValue;
      this.state.memberIds = getUserIdsFromEvent(event);
      this.state.recommendation = {
        isSelected: true,
        dateStart: event.dateStart,
        dateEnd: event.dateEnd,
        roomId: event.room.id,
        swap: [],
      };
    }

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleMemberChange = this.handleMemberChange.bind(this);
    this.handleRecommendationChange = this.handleRecommendationChange.bind(this);

    this.createEvent = this.createEvent.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
    this.removeEvent = this.removeEvent.bind(this);
    this.resetData = this.resetData.bind(this);
  }

  handleTitleChange(value) {
    this.setState({
      title: value,
    });
  }

  handleDateChange(mode, value) {
    this.setState({
      [mode]: value,
      recommendation: {
        isSelected: false,
        dateStart: null,
        dateEnd: null,
        roomId: null,
        swap: [],
      },
    });

    if (mode === 'date' && value !== null) {
      this.requestEvents(value);
    }
  }

  handleMemberChange(value) {
    this.setState({
      memberIds: value,
      recommendation: {
        isSelected: false,
        dateStart: null,
        dateEnd: null,
        roomId: null,
        swap: [],
      },
    });
  }

  handleRecommendationChange(value) {
    this.setState({
      recommendation: value,
    });
  }

  requestEvents(date) {
    if (date.getTime() !== this.props.events.date.getTime()) {
      this.props.makeQueryRequest([
        {
          type: 'eventsByDate',
          data: { date },
          payload: { date },
        },
      ]);
    }
  }

  resetData() {
    this.setState({
      title: null,
      date: null,
      timeStart: null,
      timeEnd: null,
      memberIds: [],
      recommendation: {
        isSelected: false,
        dateStart: null,
        dateEnd: null,
        roomId: null,
        swap: [],
      },
    });

    this.titleSection.reset();
    this.dateSection.reset();
    this.memberSection.reset();
  }

  checkFormIsReadyToSubmit() {
    const warnings = [];

    if (this.state.title === null) warnings.push('Тема встречи');
    if (this.state.date === null) warnings.push('Дата встречи');
    if (this.state.timeStart === null) warnings.push('Начало встречи');
    if (this.state.timeEnd === null) warnings.push('Конц встречи');
    if (this.state.memberIds.length === 0) warnings.push('Участники встречи');
    if (this.state.recommendation.isSelected === false) warnings.push('Переговорка');

    if (warnings.length > 0) {
      this.props.openPopup({
        emoji: 'emoji3',
        title: 'Заполните поля:',
        lines: warnings,
        buttons: [
          {
            type: 'button_blue',
            title: 'Хорошо',
            callback: null,
          },
        ],
      });

      return false;
    }

    return true;
  }

  createEvent() {
    if (!this.checkFormIsReadyToSubmit()) {
      return;
    }

    const request = [{
      type: 'createEvent',
      data: {
        title: this.state.title,
        dateStart: this.state.recommendation.dateStart,
        dateEnd: this.state.recommendation.dateEnd,
        usersIds: this.state.memberIds,
        roomId: this.state.recommendation.roomId,
      },
    }];

    if (this.state.recommendation.swap.length > 0) {
      request.push({
        type: 'changeEventRoom',
        data: {
          swap: this.state.recommendation.swap,
        },
      });
    }

    this.props.makeMutationRequest(request)
      .then((res) => {
        this.props.closeRedactor();

        const room = this.props.rooms.data.find(room => room.id === res.createEvent.room.id);

        this.props.openPopup({
          emoji: 'emoji2',
          title: 'Встреча создана!',
          lines: getEventDescription(res.createEvent.dateStart, res.createEvent.dateEnd, room),
          buttons: [
            {
              type: 'button_blue',
              title: 'Хорошо',
              callback: null,
            },
          ],
        });
      })
      .catch((error) => {
        console.error('makeMutationRequest - createEvent - error');
        console.error(error);
      });
  }

  updateEvent() {
    if (!this.checkFormIsReadyToSubmit()) {
      return;
    }

    const request = [{
      type: 'updateEvent',
      data: {
        id: this.props.setup.eventId,
        title: this.state.title,
        dateStart: this.state.recommendation.dateStart,
        dateEnd: this.state.recommendation.dateEnd,
        usersIds: this.state.memberIds,
        roomId: this.state.recommendation.roomId,
      },
    }];

    if (this.state.recommendation.swap.length > 0) {
      request.push({
        type: 'changeEventRoom',
        data: {
          swap: this.state.recommendation.swap,
        },
      });
    }

    this.props.makeMutationRequest(request)
      .then((res) => {
        this.props.closeRedactor();

        const room = this.props.rooms.data.find(room => room.id === res.updateEvent.room.id);

        this.props.openPopup({
          emoji: 'emoji2',
          title: 'Параметры встречи были изменены!',
          lines: getEventDescription(res.updateEvent.dateStart, res.updateEvent.dateEnd, room),
          buttons: [
            {
              type: 'button_blue',
              title: 'Хорошо',
              callback: null,
            },
          ],
        });
      })
      .catch((error) => {
        console.error('makeMutationRequest - updateEvent - error');
        console.error(error);
      });
  }

  removeEvent() {
    const handleRemove = () => {
      this.props.makeMutationRequest([{
        type: 'removeEvent',
        data: {
          id: this.props.setup.eventId,
        },
      }])
        .then((res) => {
          this.props.closeRedactor();

          const room = this.props.rooms.data.find(room => room.id === res.removeEvent.room.id);

          this.props.openPopup({
            emoji: 'emoji2',
            title: 'Встреча удалена!',
            lines: getEventDescription(res.removeEvent.dateStart, res.removeEvent.dateEnd, room),
            buttons: [
              {
                type: 'button_blue',
                title: 'Хорошо',
                callback: null,
              },
            ],
          });
        })
        .catch((error) => {
          console.error('makeMutationRequest - removeEvent - error');
          console.error(error);
        });
    };

    this.props.openPopup({
      emoji: 'emoji1',
      title: 'Встреча будет удалена безвозвратно',
      lines: [],
      buttons: [
        {
          type: 'button_gray',
          title: 'Отмена',
          callback: null,
        },
        {
          type: 'button_gray',
          title: 'Удалить',
          callback: handleRemove,
        },
      ],
    });
  }

  renderFooter() {
    if (this.props.mode === 'new' || this.props.mode === 'timeSegment') {
      return (
        <footer className="redactor__footer redactor__footer_easy">
          <button type="button" className="footer__button button button_gray" onClick={this.props.closeRedactor}>Отмена</button>
          <button type="button" className="footer__button button button_blue" onClick={this.createEvent}>Создать встречу</button>
        </footer>
      );
    }

    if (this.props.mode === 'edit') {
      return (
        <footer className="redactor__footer">
          <button type="button" className="footer__button button button_gray" onClick={this.props.closeRedactor}>Отмена</button>
          <button type="button" className="footer__button footer__button_event-remove button button_gray" onClick={this.removeEvent}>Удалить встречу</button>
          <button type="button" className="footer__button button button_blue" onClick={this.updateEvent}>Сохранить</button>
        </footer>
      );
    }

    return null;
  }

  render() {
    const title = this.props.mode === 'edit' ? 'Редактирование встречи' : 'Новая встреча';

    return (
      <section className="redactor">
        <div className="redactor__content">
          <p className="redactor__title">{title}</p>
          <i className="redactor__reset-button" onClick={this.resetData} />
          <div className="redactor__sections">
            <RedactorTitleSection
              title={this.state.title}
              onChange={this.handleTitleChange}
              ref={(e) => { this.titleSection = e; }}
            />
            <RedactorDateSection
              date={this.state.date}
              timeStart={this.state.timeStart}
              timeEnd={this.state.timeEnd}
              onChange={this.handleDateChange}
              ref={(e) => { this.dateSection = e; }}
            />
            <RedactorMemberSection
              users={this.props.users}
              memberIds={this.state.memberIds}
              onChange={this.handleMemberChange}
              ref={(e) => { this.memberSection = e; }}
            />
            <RedactorRecommendationSection
              mode={this.props.mode}
              eventId={this.props.mode === 'edit' ? this.props.setup.eventId : ''}
              recommendation={this.state.recommendation}
              memberIds={this.state.memberIds}
              date={this.state.date}
              timeStart={this.state.timeStart}
              timeEnd={this.state.timeEnd}
              events={this.props.events}
              users={this.props.users}
              rooms={this.props.rooms}
              openPopup={this.props.openPopup}
              onChange={this.handleRecommendationChange}
              ref={(e) => { this.recommendationSection = e; }}
            />
          </div>
        </div>
        {
          this.renderFooter()
        }
      </section>
    );
  }
}

Redactor.propTypes = {
  mode: PropTypes.string.isRequired,
  setup: PropTypes.shape({
    dateStart: PropTypes.instanceOf(Date),
    dateEnd: PropTypes.instanceOf(Date),
    roomId: PropTypes.string,
    eventId: PropTypes.string,
  }).isRequired,
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
  openPopup: PropTypes.func.isRequired,
  closeRedactor: PropTypes.func.isRequired,
  makeQueryRequest: PropTypes.func.isRequired,
  makeMutationRequest: PropTypes.func.isRequired,
};

export default Redactor;

function getMillisecondsFromDateObject(date) {
  const h = date.getHours();
  const m = date.getMinutes();

  return (((h * 60) + m) * 60) * 1000;
}

function getUserIdsFromEvent(event) {
  return event.users.map(user => user.id);
}

function getEventDescription(dateStartString, dateEndString, room) {
  const dateStart = new Date(dateStartString);
  const dateEnd = new Date(dateEndString);

  const date = dateStart.toLocaleString('ru', { month: 'long', day: 'numeric' });
  const timeStart = dateStart.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
  const timeEnd = dateEnd.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });

  return [
    `${date}, ${timeStart}—${timeEnd}`,
    `${room.title} · ${room.floor} этаж`,
  ];
}
