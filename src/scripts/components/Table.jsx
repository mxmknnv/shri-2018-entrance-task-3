import React from 'react';
import PropTypes from 'prop-types';

import Catalog from './Catalog';
import Plate from './Plate';
import Tooltip from './Tooltip';
import Chart from '../chart';
import getDataToSvgRender from '../getDataToSvgRender';
import getTooltipCoordinates from '../getTooltipCoordinates';

class Table extends React.Component {
  constructor(props) {
    super(props);

    const date = new Date();
    date.setHours(0, 0, 0, 0);

    this.state = {
      currentDate: date,
      selectedRoomId: null,
      tooltip: {
        isActive: false,
        eventId: null,
        cx: null,
        cy: null,
      },
    };

    this.handleEventSegmentClick = this.handleEventSegmentClick.bind(this);
    this.handleEventEditClick = this.handleEventEditClick.bind(this);
    this.handleFreeSegmentMouseOut = this.handleFreeSegmentMouseOut.bind(this);
    this.handleFreeSegmentMouseOver = this.handleFreeSegmentMouseOver.bind(this);
    this.handleFreeSegmentClick = this.handleFreeSegmentClick.bind(this);

    this.setCurrentDate = this.setCurrentDate.bind(this);
    this.closeTooltip = this.closeTooltip.bind(this);

    this.svgRender = this.svgRender.bind(this);
    this.svgRerender = this.svgRerender.bind(this);
  }

  componentDidMount() {
    this.props.makeQueryRequest([
      {
        type: 'eventsByDate',
        data: { date: this.state.currentDate },
        payload: { date: this.state.currentDate },
      },
      {
        type: 'users',
        data: null,
        payload: null,
      },
      {
        type: 'rooms',
        data: null,
        payload: null,
      },
    ])
      .then(this.svgRender);
  }

  componentWillUnmount() {
    Chart.unsubscribe();
  }

  setCurrentDate(date) {
    if (date.getTime() === this.props.events.date.getTime()) {
      return;
    }

    this.setState({
      currentDate: date,
    });

    this.props.makeQueryRequest([
      {
        type: 'eventsByDate',
        data: { date },
        payload: { date },
      },
    ])
      .then(this.svgRerender);
  }

  openTooltip(segment) {
    const bBox = segment.getBBox();
    const eventId = segment.data('eventId');

    Chart.addSelectedView(segment);
    this.selectedEventSegment = segment;

    this.setState({
      tooltip: {
        isActive: true,
        eventId,
        cx: bBox.cx,
        cy: bBox.cy,
      },
    });
  }

  closeTooltip() {
    Chart.removeSelectedView(this.selectedEventSegment);
    this.selectedEventSegment = null;

    this.setState({
      tooltip: {
        isActive: false,
        eventId: null,
        cx: null,
        cy: null,
      },
    });
  }

  handleEventSegmentClick(segment) {
    this.openTooltip(segment);
  }

  handleFreeSegmentMouseOver(roomId) {
    this.setState({
      selectedRoomId: roomId,
    });
  }

  handleFreeSegmentMouseOut() {
    this.setState({
      selectedRoomId: null,
    });
  }

  handleFreeSegmentClick(dateStart, dateEnd, roomId) {
    this.props.openRedactor('timeSegment', { dateStart, dateEnd, roomId });
  }

  handleEventEditClick(eventId) {
    this.props.openRedactor('edit', { eventId });
  }

  svgRender() {
    const dataToRender = getDataToSvgRender(
      this.props.events.data,
      this.props.rooms.data,
      this.state.currentDate,
    );

    Chart.timelineSVG = this.timelineSVG;
    Chart.diagramSVG = this.diagramSVG;
    Chart.handleEventSegmentClick = this.handleEventSegmentClick;
    Chart.handleFreeSegmentMouseOver = this.handleFreeSegmentMouseOver;
    Chart.handleFreeSegmentMouseOut = this.handleFreeSegmentMouseOut;
    Chart.handleFreeSegmentClick = this.handleFreeSegmentClick;

    Chart.init();
    Chart.drawTimeline();
    Chart.drawDiagram(dataToRender);
    Chart.startTimer();
  }

  svgRerender() {
    const dataToRender = getDataToSvgRender(
      this.props.events.data,
      this.props.rooms.data,
      this.state.currentDate,
    );

    Chart.diagramSVG = this.diagramSVG;
    Chart.drawDiagram(dataToRender);
  }

  renderTooltip() {
    const event = this.props.events.data.find(event => event.id === this.state.tooltip.eventId);
    const user = this.props.users.data.find(user => user.id === event.users[0].id);
    const room = this.props.rooms.data.find(room => room.id === event.room.id);
    const usersAmount = event.users.length - 1;

    const coordinates = getTooltipCoordinates(
      this.state.tooltip.cx,
      this.state.tooltip.cy,
      this.tableElement,
      this.diagramElement,
    );

    return (
      <Tooltip
        event={event}
        user={user}
        room={room}
        usersAmount={usersAmount}
        coordinates={coordinates}
        onEdit={this.handleEventEditClick}
        closeTooltip={this.closeTooltip}
      />
    );
  }

  render() {
    if (this.props.events.isLoading
      && this.props.rooms.isLoading
      && this.props.users.isLoading) {
      return (<EmptyTableFrameWithMessage>Загрузка данных...</EmptyTableFrameWithMessage>);
    }

    if (
      this.props.events.isFailure
      || this.props.rooms.isFailure
      || this.props.users.isFailure) {
      return (
        <EmptyTableFrameWithMessage>Не удалось получить данные от сервера...</EmptyTableFrameWithMessage>
      );
    }

    return (
      <section className="table" ref={(element) => { this.tableElement = element; }}>
        <div className="table__header">
          <Plate currentDate={this.state.currentDate} setCurrentDate={this.setCurrentDate} />
          <div className="timeline">
            <svg className="timeline__svg" ref={(element) => { this.timelineSVG = element; }} />
          </div>
        </div>
        <div className="table__content">
          {
            this.props.rooms.isSuccess
            && this.props.users.isSuccess ? (
              <Catalog selectedRoomId={this.state.selectedRoomId} rooms={this.props.rooms.data} />
              ) : (
                null
              )
          }
          {
            this.props.events.isSuccess ? (
              <div className="diagram" ref={(element) => { this.diagramElement = element; }}>
                <svg className="diagram__svg" ref={(element) => { this.diagramSVG = element; }} />
                { this.state.tooltip.isActive ? this.renderTooltip() : null }
              </div>
            ) : (
              <div className="diagram" ref={(element) => { this.diagramElement = element; }}>
                <div className="diagram__message">Загрузка данных...</div>
              </div>
            )
          }
        </div>
      </section>
    );
  }
}

Table.propTypes = {
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
  openRedactor: PropTypes.func.isRequired,
  makeQueryRequest: PropTypes.func.isRequired,
};

export default Table;

function EmptyTableFrameWithMessage(props) {
  return (
    <section className="table">
      <p className="table__message">
        {props.children}
      </p>
    </section>
  );
}

EmptyTableFrameWithMessage.propTypes = {
  children: PropTypes.string.isRequired,
};
