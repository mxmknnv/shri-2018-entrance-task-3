import Snap from 'snapsvg';

const config = {
  numberToBegin: 8,
  numberToEnd: 23,
  mobileScreenWidth: 500,
  fontFamily: '"Helvetica Neue", "Open Sans", "sans-serif"',
  cellButtonPlusSize: 12,
  cellButtonPlusStrokeWidth: 2,
  global: {
    desktop: {
      cellWidth: 65,
      cellHeight: 28,
    },
    mobile: {
      cellWidth: 65,
      cellHeight: 58,
    },
  },
  timeline: {
    borderWidth: 1,
    timeArrowHeadWidth: 49,
    timeArrowHeadHeight: 20,
    desktop: {
      height: 46,
      paddingLeft: 31,
      paddingRight: 31,
    },
    mobile: {
      height: 32,
      paddingLeft: 53 + 182,
      paddingRight: 53,
    },
  },
  diagram: {
    desktop: {
      paddingLeft: 31,
      paddingRight: 31,
      paddingTop: 46,
      paddingBottom: 46,
      roomMargin: 24,
      floorMargin: 53,
    },
    mobile: {
      paddingLeft: 53,
      paddingRight: 53,
      paddingTop: 36,
      paddingBottom: 36,
      roomMargin: 2,
      floorMargin: 45,
    },
  },
};

const Chart = {
  // screenMode
  // mql
  // diagramSVGHeight
  // freeSegmentPatterns
  timeline: {
    // paper
    // background
    // border
    // numbers
    // timeArrowHead
    // timeArrowText
    // timeArrowTail
  },
  diagram: {
    // paper
    // contentCells
    // leftPaddingCells
    // rightPaddingCells
    // background
    // grid
    // timeArrowTail
  },
};

Chart.init = function () {
  this.mql = window.matchMedia(`(max-width: ${config.mobileScreenWidth}px)`);
  this.screenMode = this.mql.matches ? 'mobile' : 'desktop';
  this.mql.addListener(this.mqlListener);
};

Chart.mqlListener = function (event) {
  Chart.screenMode = event.matches ? 'mobile' : 'desktop';
  updateTimelineScreenMode();
  updateDiagramScreenMode();
};

Chart.unsubscribe = function () {
  this.mql.removeListener(this.mqlListener);
  window.removeEventListener('resize', this.resizeListener);
  clearInterval(this.intervalTimer);
  cancelAnimationFrame(this.resizeRequestID);
};

Chart.drawTimeline = function () {
  const mode = this.screenMode;
  const { height } = config.timeline[mode];
  const fullHeight = height + config.timeline.borderWidth;
  const width = config.timeline[mode].paddingLeft + config.timeline[mode].paddingRight
    + ((config.numberToEnd - config.numberToBegin) * config.global[mode].cellWidth);

  /* Paper */

  const paper = Snap(this.timelineSVG).attr({ width, height: fullHeight });
  this.timeline.paper = paper;

  /* Background & Border */

  this.timeline.background = paper.rect(0, 0, width, height)
    .attr({
      fill: '#FFFFFF',
    });

  this.timeline.border = paper.path(`M 0 ${fullHeight} L ${width} ${fullHeight}`)
    .attr({
      stroke: '#E9ECEF',
      'stroke-width': 2,
    });

  /* Numbers */

  const timeArrowCoordinate = getCoordinateFromTime('timeline');
  this.timeline.numbers = [];

  for (let i = 0; i <= config.numberToEnd - config.numberToBegin; i++) {
    const x = config.timeline[mode].paddingLeft + (config.global[mode].cellWidth * i);
    const y = (height / 2) + 1;
    const hour = config.numberToBegin + i;
    const minute = i > 0 ? '' : ':00';
    const fill = x < timeArrowCoordinate ? '#858E98' : '#252525';

    const number = paper
      .text(x, y, `${hour}${minute}`)
      .attr({
        'font-family': config.fontFamily,
        'font-weight': 700,
        'font-size': 11,
        fill,
        'text-anchor': 'middle',
        'alignment-baseline': 'middle', // do not work in FF
        'dominant-baseline': 'middle', // work in FF
      });

    this.timeline.numbers.push(number);
  }

  /* Time Arrow */

  const timeArrowTextValue = new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
  const timeArrowTailPath = `M ${timeArrowCoordinate} ${(config.timeline[mode].height / 2) + (config.timeline.timeArrowHeadHeight / 2)} `
  + `L ${timeArrowCoordinate} ${fullHeight}`;

  this.timeline.timeArrowHead = paper.rect(
    timeArrowCoordinate - (config.timeline.timeArrowHeadWidth / 2), // x
    (config.timeline[mode].height / 2) - (config.timeline.timeArrowHeadHeight / 2), // y
    config.timeline.timeArrowHeadWidth, // width
    config.timeline.timeArrowHeadHeight, // height
    10, // horizontal radius
    10, // vertical radius
  )
    .attr({
      fill: '#007DFF',
    });

  this.timeline.timeArrowText = paper.text(
    timeArrowCoordinate, // x
    (config.timeline[mode].height / 2) + 1, // y
    timeArrowTextValue, // text
  )
    .attr({
      'font-family': config.fontFamily,
      'font-weight': 700,
      'font-size': 11,
      fill: '#FFFFFF',
      'text-anchor': 'middle',
      'alignment-baseline': 'middle',
      'dominant-baseline': 'middle',
    });

  this.timeline.timeArrowTail = paper.path(timeArrowTailPath)
    .attr({
      stroke: '#007DFF',
      'stroke-width': 1,
    });
};

function updateTimelineScreenMode() {
  const mode = Chart.screenMode;
  const { height } = config.timeline[mode];
  const fullHeight = height + config.timeline.borderWidth;
  const width = config.timeline[mode].paddingLeft + config.timeline[mode].paddingRight
    + ((config.numberToEnd - config.numberToBegin) * config.global[mode].cellWidth);

  /* Paper */

  Chart.timeline.paper.attr({ width, height: fullHeight });

  /* Background & Border */

  Chart.timeline.background.attr({ width, height });
  Chart.timeline.border.attr({ d: `M 0 ${fullHeight} L ${width} ${fullHeight}` });

  /* Numbers */

  Chart.timeline.numbers.forEach((number, index) => {
    const x = config.timeline[mode].paddingLeft + (config.global[mode].cellWidth * index);
    const y = (height / 2) + 1;

    number.attr({ x, y });
  });

  /* Time Arrow */

  Chart.updateTimelineTimeArrow();
}

Chart.getDiagramSVGHeight = function () {
  const rect = Chart.diagramSVG.getBoundingClientRect();

  return rect.bottom - rect.top;
};

Chart.drawDiagram = function (data) {
  const mode = this.screenMode;
  const width = config.diagram[mode].paddingLeft + config.diagram[mode].paddingRight
    + ((config.numberToEnd - config.numberToBegin) * config.global[mode].cellWidth);

  /* Paper */

  const paper = Snap(this.diagramSVG).attr({ width });
  this.diagram.paper = paper;

  /* Diagram Content */

  let coordY = config.diagram[mode].paddingTop
    - (config.diagram[mode].floorMargin - config.diagram[mode].roomMargin) // #1
    - (config.global[mode].cellHeight + config.diagram[mode].roomMargin); // #2

  this.diagram.contentCells = [];
  this.diagram.leftPaddingCells = [];
  this.diagram.rightPaddingCells = [];

  for (let i = 0; i < data.length; i++) { // floor
    coordY += config.diagram[mode].floorMargin - config.diagram[mode].roomMargin; // #1

    Chart.diagram.contentCells[i] = [];
    Chart.diagram.leftPaddingCells[i] = [];
    Chart.diagram.rightPaddingCells[i] = [];

    for (let j = 0; j < data[i].length; j++) { // room
      coordY += config.global[mode].cellHeight + config.diagram[mode].roomMargin; // #2

      Chart.diagram.contentCells[i][j] = Snap.set();
      Chart.diagram.leftPaddingCells[i][j] = Snap.set();
      Chart.diagram.rightPaddingCells[i][j] = Snap.set();

      /* Left & Right padding cells */

      const lpc = paper.rect(
        0, coordY, // x, y
        config.diagram[mode].paddingLeft, config.global[mode].cellHeight, // width, height
      ).attr({
        fill: '#D5DFE9',
      });

      const rpc = paper.rect(
        width - config.diagram[mode].paddingRight, coordY, // x, y
        config.diagram[mode].paddingRight, config.global[mode].cellHeight, // width, height
      ).attr({
        fill: '#D5DFE9',
      });

      Chart.diagram.leftPaddingCells[i][j].push(lpc);
      Chart.diagram.rightPaddingCells[i][j].push(rpc);

      /* Event segment */

      data[i][j].events.forEach((segment) => {
        const x = getCoordinateFromDate(segment.dateStart);
        const y = coordY;
        const width = getCoordinateFromDate(segment.dateEnd) - x;
        const height = config.global[mode].cellHeight;

        const rect = paper.rect(x, y, width, height).attr({
          fill: '#D5DFE9',
        });

        rect.data('eventId', segment.id);
        rect.click(eventSegmentClickListener);

        Chart.diagram.contentCells[i][j].push(rect);
      });

      /* Free segment */

      data[i][j].free.forEach((segment) => {
        const x = getCoordinateFromDate(segment.dateStart);
        const y = coordY;
        const width = getCoordinateFromDate(segment.dateEnd) - x;
        const height = config.global[mode].cellHeight;

        const rect = paper.rect(x, y, width, height).attr({
          fill: '#FFFFFF',
          cursor: 'pointer',
        });

        rect.data('roomId', data[i][j].room.id);
        rect.data('dateStart', segment.dateStart.toString());
        rect.data('dateEnd', segment.dateEnd.toString());

        rect.mouseover(freeSegmentMouseOverListener);
        rect.mouseout(freeSegmentMouseOutListener);
        rect.click(freeSegmentClickListener);

        Chart.diagram.contentCells[i][j].push(rect);
      });
    }
  }

  /* Set svg element min-height = diagram content height */

  coordY += config.global[mode].cellHeight + config.diagram[mode].paddingBottom;
  Chart.diagramSVG.style.minHeight = `${coordY}px`;

  // const height = Chart.diagramSVG.clientHeight; // do not work in FF

  const height = Chart.getDiagramSVGHeight();
  this.diagramSVGHeight = height;

  /* Background */

  this.diagram.background = paper.rect(0, 0, width, height).attr({
    fill: '#F6F7F9',
  });

  paper.prepend(this.diagram.background);

  /* Grid */

  this.diagram.grid = paper.path(getGridPath(height, mode)).attr({
    stroke: '#1364cd',
    'stroke-opacity': 0.10,
    'stroke-width': 1,
  });

  /* Time Arrow */

  const timeArrowCoordinate = getCoordinateFromTime('diagram');

  this.diagram.timeArrowTail = paper.path(`M ${timeArrowCoordinate} 0 L ${timeArrowCoordinate} ${height}`)
    .attr({
      stroke: '#007DFF',
      'stroke-width': 1,
    });

  window.addEventListener('resize', this.resizeListener);

  createFreeSegmentPatterns();
};

Chart.resizeListener = function () {
  if (Chart.getDiagramSVGHeight() !== Chart.diagramSVGHeight) {
    if (!Chart.resizeIsRunning) {
      Chart.resizeIsRunning = true;
      Chart.resizeRequestID = window.requestAnimationFrame(Chart.resize);
    }
  }
};

Chart.resize = function () {
  const height = Chart.getDiagramSVGHeight();
  const mode = Chart.screenMode;

  Chart.diagramSVGHeight = height;
  Chart.diagram.grid.attr({ d: getGridPath(height, mode) });
  Chart.diagram.background.attr({ height });
  Chart.updateDiagramTimeArrow();

  Chart.resizeIsRunning = false;
};

function updateDiagramScreenMode() {
  const mode = Chart.screenMode;
  const width = config.diagram[mode].paddingLeft + config.diagram[mode].paddingRight
    + ((config.numberToEnd - config.numberToBegin) * config.global[mode].cellWidth);

  /* Paper */

  Chart.diagram.paper.attr({ width });

  /* Diagram Content */

  let coordY = config.diagram[mode].paddingTop
    - (config.diagram[mode].floorMargin - config.diagram[mode].roomMargin) // #1
    - (config.global[mode].cellHeight + config.diagram[mode].roomMargin); // #2

  const difference = config.diagram.mobile.paddingLeft - config.diagram.desktop.paddingLeft;
  const сoefficient = mode === 'mobile' ? 1 : (-1);

  for (let i = 0; i < Chart.diagram.contentCells.length; i++) { // floor
    coordY += config.diagram[mode].floorMargin - config.diagram[mode].roomMargin; // #1

    for (let j = 0; j < Chart.diagram.contentCells[i].length; j++) { // room
      coordY += config.global[mode].cellHeight + config.diagram[mode].roomMargin; // #2

      Chart.diagram.leftPaddingCells[i][j].attr({
        y: coordY,
        width: config.diagram[mode].paddingLeft,
        height: config.global[mode].cellHeight,
      });

      Chart.diagram.rightPaddingCells[i][j].attr({
        x: `+=${сoefficient * difference}`,
        y: coordY,
        width: config.diagram[mode].paddingLeft,
        height: config.global[mode].cellHeight,
      });

      Chart.diagram.contentCells[i][j].attr({
        x: `+=${сoefficient * difference}`,
        y: coordY,
        height: config.global[mode].cellHeight,
      });
    }
  }

  /* Set svg object min-height = diagram content height */

  coordY += config.global[mode].cellHeight + config.diagram[mode].paddingBottom;
  Chart.diagramSVG.style.minHeight = `${coordY}px`;

  /* Background */

  const height = Chart.getDiagramSVGHeight();

  Chart.diagram.background.attr({ width, height });

  /* Grid */

  Chart.diagram.grid.attr({
    d: getGridPath(height, mode),
  });

  /* Time Arrow */

  Chart.updateDiagramTimeArrow();
}

function getGridPath(height, mode) {
  let result = '';

  for (let i = 0; i <= config.numberToEnd - config.numberToBegin; i++) {
    const x = config.diagram[mode].paddingLeft + (config.global[mode].cellWidth * i);
    result += `M ${x} 0 L ${x} ${height} `;
  }

  return result;
}

function getCoordinateFromDate(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const mode = Chart.screenMode;
  const { numberToBegin } = config;
  const { cellWidth } = config.global[mode];
  const { paddingLeft } = config.diagram[mode];

  const result = paddingLeft
    + (cellWidth * (hours - numberToBegin))
    + Math.round((cellWidth / 4) * Math.floor(minutes / 15));

  return result;
}

function getCoordinateFromTime(type) {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const mode = Chart.screenMode;
  const { numberToBegin } = config;
  const { cellWidth } = config.global[mode];
  const { paddingLeft } = config[type][mode];

  return paddingLeft
   + (cellWidth * (hours - numberToBegin))
   + Math.round((cellWidth / 60) * minutes);
}

// Обновляет координаты TimeArrow (timeArrowHead, timeArrowText, timeArrowTail)

Chart.updateTimelineTimeArrow = function () {
  const mode = Chart.screenMode;
  const timeArrowCoordinate = getCoordinateFromTime('timeline');
  const timeArrowTextValue = new Date().toTimeString().substr(0, 5);
  const timeArrowTailPath = `M ${timeArrowCoordinate} ${(config.timeline[mode].height / 2) + (config.timeline.timeArrowHeadHeight / 2)} `
    + `L ${timeArrowCoordinate} ${config.timeline[mode].height + config.timeline.borderWidth}`;

  Chart.timeline.timeArrowHead.attr({
    x: timeArrowCoordinate - (config.timeline.timeArrowHeadWidth / 2),
    y: (config.timeline[mode].height / 2) - (config.timeline.timeArrowHeadHeight / 2),
  });

  Chart.timeline.timeArrowText.attr({
    x: timeArrowCoordinate,
    y: (config.timeline[mode].height / 2) + 1,
    text: timeArrowTextValue,
  });

  Chart.timeline.timeArrowTail.attr({
    d: timeArrowTailPath,
  });

  Chart.timeline.numbers.forEach((number) => {
    const { cx } = number.getBBox();

    if (cx < timeArrowCoordinate) {
      number.attr({
        fill: '#858E98',
      });
    }
  });
};

Chart.updateDiagramTimeArrow = function () {
  const timeArrowCoordinate = getCoordinateFromTime('diagram');
  const height = Chart.getDiagramSVGHeight();
  const timeArrowTailPath = `M ${timeArrowCoordinate} 0 L ${timeArrowCoordinate} ${height}`;

  Chart.diagram.timeArrowTail.attr({
    d: timeArrowTailPath,
  });
};


Chart.addSelectedView = function (segment) {
  segment.attr({ fill: '#98A9B9' });
};

Chart.removeSelectedView = function (segment) {
  segment.attr({ fill: '#D5DFE9' });
};

Chart.startTimer = function () {
  this.intervalTimer = setInterval(() => {
    Chart.updateTimelineTimeArrow();
    Chart.updateDiagramTimeArrow();
  }, 1000);
};

function eventSegmentClickListener() {
  Chart.handleEventSegmentClick(this);
}

function createFreeSegmentPatterns() {
  Chart.freeSegmentPatterns = {
    mobile: create(
      config.global.mobile.cellWidth,
      config.global.mobile.cellHeight,
    ),
    desktop: create(
      config.global.desktop.cellWidth,
      config.global.desktop.cellHeight,
    ),
  };

  function create(cellWidth, cellHeight) {
    const x1 = (cellWidth / 2) - (config.cellButtonPlusSize / 2);
    const y1 = cellHeight / 2;
    const x2 = cellWidth / 2;
    const y2 = (cellHeight / 2) - (config.cellButtonPlusSize / 2);

    const plusPath = `M ${x1} ${y1} L ${x1 + config.cellButtonPlusSize} ${y1}`
      + ` M ${x2} ${y2} L ${x2} ${y2 + config.cellButtonPlusSize}`;

    const rect = Chart.diagram.paper.rect(0, 0, cellWidth, cellHeight)
      .attr({
        fill: '#1D54FE',
      });

    const plus = Chart.diagram.paper.path(plusPath)
      .attr({
        stroke: '#FFFFFF',
        'stroke-width': config.cellButtonPlusStrokeWidth,
      });

    const group = Chart.diagram.paper.group(rect, plus);

    const pattern = group.toPattern(0, 0, 1, 1).attr({
      viewBox: `0 0 ${cellWidth} ${cellHeight}`,
      patternUnits: 'objectBoundingBox',
      preserveAspectRatio: 'xMidYMid slice',
    });

    return pattern;
  }
}

function freeSegmentMouseOverListener() {
  const mode = Chart.screenMode;
  const roomId = this.data('roomId');

  this.attr({
    fill: Chart.freeSegmentPatterns[mode],
    rx: 2,
    ry: 2,
  });

  Chart.handleFreeSegmentMouseOver(roomId);
}

function freeSegmentMouseOutListener() {
  this.attr({
    fill: '#FFFFFF',
    rx: 0,
    ry: 0,
  });

  Chart.handleFreeSegmentMouseOut();
}

function freeSegmentClickListener() {
  const roomId = this.data('roomId');
  const dateStart = new Date(this.data('dateStart'));
  const dateEnd = new Date(this.data('dateEnd'));

  Chart.handleFreeSegmentClick(dateStart, dateEnd, roomId);
}

export default Chart;
