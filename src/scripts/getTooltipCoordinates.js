function getTooltipCoordinates(cellCenterX, cellCenterY, tableElement, diagramElement) {
  const mq = window.matchMedia('(max-width: 500px)');
  const mode = mq.matches ? 'mobile' : 'desktop';

  const cell = {
    desktop: {
      height: 28,
    },
    mobile: {
      height: 58,
    },
  };

  const tooltip = {
    desktop: {
      width: 338,
      height: 113,
    },
    mobile: {
      width: 360,
      height: 129,
    },
  };

  const arrowWidth = 14;
  const tooltipBorderRadius = 8;
  const arrowOffsetLimit = (tooltip[mode].width / 2) - (arrowWidth / 2) - tooltipBorderRadius;

  const tableOffsetWidth = tableElement.offsetWidth;
  const tableScrollLeft = tableElement.scrollLeft;
  const diagramOffsetLeft = diagramElement.offsetLeft;
  const diagramClientRect = diagramElement.getBoundingClientRect();
  const screenClientHeight = document.documentElement.clientHeight;

  const clientLeftEdge = tableScrollLeft - diagramOffsetLeft;
  const clientRightEdge = (tableScrollLeft + tableOffsetWidth) - diagramOffsetLeft;
  const clientBottomEdge = screenClientHeight - diagramClientRect.top;

  const tooltipLeftEdge = cellCenterX - (tooltip[mode].width / 2);
  const tooltipRightEdge = cellCenterX + (tooltip[mode].width / 2);
  const tooltipBottomEdge = cellCenterY + (cell[mode].height / 2) + tooltip[mode].height;

  let tooltipLeft = cellCenterX - (tooltip[mode].width / 2);
  let tooltipTop = cellCenterY + (cell[mode].height / 2);
  let arrowLeft = (tooltip[mode].width / 2) - (arrowWidth / 2);
  let arrowClassName = 'tooltip__arrow_top';

  if (clientLeftEdge > tooltipLeftEdge) {
    const dif = clientLeftEdge - tooltipLeftEdge;
    tooltipLeft += dif;
    arrowLeft -= dif < arrowOffsetLimit ? dif : arrowOffsetLimit;
  }

  if (clientRightEdge < tooltipRightEdge) {
    const dif = tooltipRightEdge - clientRightEdge;
    tooltipLeft -= dif;
    arrowLeft += dif < arrowOffsetLimit ? dif : arrowOffsetLimit;
  }

  if (clientBottomEdge < tooltipBottomEdge) {
    tooltipTop -= cell[mode].height + tooltip[mode].height;
    arrowClassName = 'tooltip__arrow_bottom';
  }

  return {
    tooltipLeft,
    tooltipTop,
    arrowLeft,
    arrowClassName,
  };
}

export default getTooltipCoordinates;
