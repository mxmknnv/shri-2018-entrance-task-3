function getDataToSvgRender(events, rooms, date) {
  const arr1 = splitByRooms(events, rooms);
  const arr2 = splitByFloorsAndSort(arr1);

  for (let i = 0; i < arr2.length; i++) {
    for (let j = 0; j < arr2[i].length; j++) {
      arr2[i][j].free = getSegments(arr2[i][j].events, date);
    }
  }

  return arr2;
}

function splitByRooms(events, rooms) {
  const res = [];

  rooms.forEach((room) => {
    res.push({
      room,
      events: events.filter(event => event.room.id === room.id),
    });
  });

  return res;
}

function splitByFloorsAndSort(arr) {
  const res = [];

  arr.forEach((element) => {
    const { floor } = element.room;

    if (!Array.isArray(res[floor])) {
      res[floor] = [];
    }

    res[floor].push(element);
  });

  res.forEach(element => element.sort((a, b) => a.room.title.localeCompare(b.room.title)));
  res.reverse();

  return res;
}

function getSegments(events, date) {
  const segments = generateSegments(events, date);
  const res = splitSegments(segments);

  return res;
}

function generateSegments(events, date) {
  const segments = [];

  if (events.length === 0) {
    const dayStart = new Date(date);
    const dayEnd = new Date(date);

    dayStart.setHours(8, 0, 0, 0);
    dayEnd.setHours(23, 0, 0, 0);

    segments.push({
      dateStart: dayStart,
      dateEnd: dayEnd,
    });

    return segments;
  }

  const dayStart = new Date(events[0].dateStart);
  const dayEnd = new Date(events[0].dateStart);
  dayStart.setHours(8, 0, 0, 0);
  dayEnd.setHours(23, 0, 0, 0);

  events.sort((a, b) => a.dateStart - b.dateStart);

  if (dayStart.getTime() !== events[0].dateStart.getTime()) {
    segments.push({
      dateStart: dayStart,
      dateEnd: events[0].dateStart,
    });
  }

  for (let i = 1; i < events.length; i++) {
    const t1 = events[i - 1].dateEnd;
    const t2 = events[i].dateStart;

    if (t1.getTime() !== t2.getTime()) {
      segments.push({
        dateStart: t1,
        dateEnd: t2,
      });
    }
  }

  if (dayEnd.getTime() !== events[events.length - 1].dateEnd.getTime()) {
    segments.push({
      dateStart: events[events.length - 1].dateEnd,
      dateEnd: dayEnd,
    });
  }

  return segments;
}

function splitSegments(segments) {
  const res = [];

  segments.forEach((segment) => {
    let t1 = segment.dateStart;
    let t2;

    for (;;) {
      t2 = new Date(t1);
      t2.setHours(t1.getHours() + 1, 0, 0, 0);

      if (t2 < segment.dateEnd) {
        res.push({
          dateStart: t1,
          dateEnd: t2,
        });

        t1 = new Date(t2);
      } else {
        res.push({
          dateStart: t1,
          dateEnd: segment.dateEnd,
        });

        break;
      }
    }
  });

  return res;
}

export default getDataToSvgRender;
