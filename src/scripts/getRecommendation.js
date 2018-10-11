const TIME_SHIFT = 15 * 60 * 1000; // 15 минут
let mapRoomsEvents = {};
let badSwaps = {};

function getRecommendation(date, members, db) {
  let { start, end } = date;
  let reс = [];

  const dayEnd = new Date(start);
  dayEnd.setHours(23, 0, 0, 0);

  mapRoomsEvents = getRoomsEventsMap(db.rooms, db.events);

  for (;;) {
    badSwaps = {};
    reс = getRec({ start, end }, members, db);

    if (reс.length > 0) {
      mapRoomsEvents = null;
      badSwaps = null;
      return reс;
    }

    start = new Date(start.getTime() + TIME_SHIFT);
    end = new Date(end.getTime() + TIME_SHIFT);

    if (end.getTime() > dayEnd.getTime()) {
      mapRoomsEvents = null;
      badSwaps = null;
      return reс;
    }
  }
}

function getRec(date, members, db) {
  const roomsFilteredByCapacity = filterRoomsByCapacity(db.rooms, members.length);
  const roomsSortedByDistance = sortRoomsByDistance(roomsFilteredByCapacity, members);

  const recomendations = [];
  const stack = [];

  roomsSortedByDistance.forEach((room) => {
    const events = mapRoomsEvents[room.id];
    const intersections = [];

    for (let i = 0; i < events.length; i++) {
      if (!(events[i].dateEnd <= date.start || date.end <= events[i].dateStart)) {
        intersections.push(events[i]);
      }
    }

    if (intersections.length === 0) {
      recomendations.push({
        date,
        roomId: room.id,
        swap: [],
      });
    } else {
      stack.push({
        roomId: room.id,
        intersections,
      });
    }
  });

  if (recomendations.length > 0) {
    return recomendations;
  }

  // Если нет рекоммендаций

  stack.forEach(({ roomId, intersections }) => {
    let swap = [];

    for (let k = 0; k < intersections.length; k++) {
      const event = intersections[k];
      const rooms = badSwaps[event.id]
        ? db.rooms.filter(room => room.id !== roomId && !badSwaps[event.id].has(room.id))
        : db.rooms.filter(room => room.id !== roomId);

      if (rooms.length === 0) {
        return;
      }

      const rec = getRec(
        { start: event.dateStart, end: event.dateEnd },
        getMembersFromEvent(event.users, db.users),
        { users: db.users, events: db.events, rooms },
      );

      if (rec.length === 0) {
        if (!badSwaps[event.id]) {
          badSwaps[event.id] = new Set();
        }

        badSwaps[event.id].add(...rooms.map(room => room.id));
        return;
      }

      swap = [...swap, ...rec[0].swap, { eventId: event.id, roomId: rec[0].roomId }];
    }

    recomendations.push({ date, roomId, swap });
  });

  return recomendations;
}

function filterRoomsByCapacity(rooms, requiredCapacity) {
  return rooms.filter(room => room.capacity >= requiredCapacity);
}

function sortRoomsByDistance(rooms, members) {
  const roomsDistanceQuality = getRoomsDistanceQuality(rooms, members);

  return rooms.sort((a, b) => roomsDistanceQuality[a.id] - roomsDistanceQuality[b.id]);
}

function getRoomsDistanceQuality(rooms, members) {
  const res = {};

  for (let i = 0; i < rooms.length; i++) {
    let distance = 0;

    for (let j = 0; j < members.length; j++) {
      distance += Math.abs(rooms[i].floor - members[j].floor);
    }

    res[rooms[i].id] = distance;
  }

  return res;
}

function getRoomsEventsMap(rooms, events) {
  const res = {};

  for (let i = 0; i < rooms.length; i++) {
    const roomId = rooms[i].id;
    res[roomId] = [];
  }

  for (let i = 0; i < events.length; i++) {
    const roomId = events[i].room.id;

    if (Array.isArray(res[roomId])) {
      res[roomId].push(events[i]);
    }
  }

  return res;
}

function getMembersFromEvent(eventUsers, users) {
  const res = [];

  for (let i = 0; i < eventUsers.length; i++) {
    const memberId = eventUsers[i].id;
    const member = users.find(user => user.id === memberId);

    res.push(member);
  }

  return res;
}

export { getRecommendation, getRoomsEventsMap, getRoomsDistanceQuality };
