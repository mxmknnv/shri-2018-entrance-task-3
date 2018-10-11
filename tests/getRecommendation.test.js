import { getRecommendation, getRoomsEventsMap, getRoomsDistanceQuality } from '../src/scripts/getRecommendation';

test('getRecommendation rooms all free', () => {
  const date = {
    start: new Date(2018, 2, 20, 12, 0, 0, 0),
    end: new Date(2018, 2, 20, 13, 0, 0, 0),
  };

  const users = [
    { id: '1', login: 'User 1', avatar: '', floor: 1 },
    { id: '2', login: 'User 2', avatar: '', floor: 2 },
    { id: '3', login: 'User 3', avatar: '', floor: 3 },
  ];

  const rooms = [
    { id: '1', title: 'Room 1', capacity: 1, floor: 1 },
    { id: '2', title: 'Room 2', capacity: 2, floor: 2 },
    { id: '3', title: 'Room 3', capacity: 3, floor: 3 },
  ];

  const events = [
    {
      id: '1',
      title: 'Event 1',
      dateStart: new Date(2018, 2, 20, 11, 0, 0, 0),
      dateEnd: new Date(2018, 2, 20, 11, 45, 0, 0),
      users: [{ id: '1' }, { id: '2' }],
      room: { id: '2' },
    },
    {
      id: '2',
      title: 'Event 2',
      dateStart: new Date(2018, 2, 20, 13, 0, 0, 0),
      dateEnd: new Date(2018, 2, 20, 13, 15, 0, 0),
      users: [{ id: '1' }, { id: '2' }],
      room: { id: '2' },
    },
    {
      id: '3',
      title: 'Event 3',
      dateStart: new Date(2018, 2, 20, 15, 0, 0, 0),
      dateEnd: new Date(2018, 2, 20, 18, 0, 0, 0),
      users: [{ id: '2' }, { id: '3' }],
      room: { id: '3' },
    },
  ];

  const res = getRecommendation(date, [users[1], users[2]], { users, rooms, events });
  const answer = [
    {
      date,
      roomId: '2',
      swap: [],
    },
    {
      date,
      roomId: '3',
      swap: [],
    },
  ];

  expect(res).toEqual(answer);
});

test('getRecommendation not all rooms free', () => {
  const date = {
    start: new Date(2018, 2, 20, 12, 0, 0, 0),
    end: new Date(2018, 2, 20, 13, 0, 0, 0),
  };

  const users = [
    { id: '1', login: 'User 1', avatar: '', floor: 1 },
    { id: '2', login: 'User 2', avatar: '', floor: 2 },
    { id: '3', login: 'User 3', avatar: '', floor: 3 },
  ];

  const rooms = [
    { id: '1', title: 'Room 1', capacity: 1, floor: 1 },
    { id: '2', title: 'Room 2', capacity: 2, floor: 2 },
    { id: '3', title: 'Room 3', capacity: 3, floor: 3 },
  ];

  const events = [
    {
      id: '1',
      title: 'Event 1',
      dateStart: new Date(2018, 2, 20, 11, 0, 0, 0),
      dateEnd: new Date(2018, 2, 20, 11, 45, 0, 0),
      users: [{ id: '1' }, { id: '2' }],
      room: { id: '2' },
    },
    {
      id: '2',
      title: 'Event 2',
      dateStart: new Date(2018, 2, 20, 13, 0, 0, 0),
      dateEnd: new Date(2018, 2, 20, 13, 15, 0, 0),
      users: [{ id: '1' }, { id: '2' }],
      room: { id: '2' },
    },
    {
      id: '3',
      title: 'Event 3',
      dateStart: new Date(2018, 2, 20, 15, 0, 0, 0),
      dateEnd: new Date(2018, 2, 20, 18, 0, 0, 0),
      users: [{ id: '2' }, { id: '3' }],
      room: { id: '3' },
    },
    {
      id: '4',
      title: 'Event 4',
      dateStart: new Date(2018, 2, 20, 12, 15, 0, 0),
      dateEnd: new Date(2018, 2, 20, 12, 30, 0, 0),
      users: [{ id: '1' }, { id: '3' }],
      room: { id: '2' },
    },
  ];

  const res = getRecommendation(date, [users[1], users[2]], { users, rooms, events });
  const answer = [
    {
      date,
      roomId: '3',
      swap: [],
    },
  ];

  expect(res).toEqual(answer);
});

test('getRecommendation no free rooms', () => {
  const date = {
    start: new Date(2018, 2, 20, 12, 0, 0, 0),
    end: new Date(2018, 2, 20, 13, 0, 0, 0),
  };

  const users = [
    { id: '1', login: 'User 1', avatar: '', floor: 1 },
    { id: '2', login: 'User 2', avatar: '', floor: 2 },
    { id: '3', login: 'User 3', avatar: '', floor: 3 },
  ];

  const rooms = [
    { id: '1', title: 'Room 1', capacity: 2, floor: 1 },
    { id: '2', title: 'Room 2', capacity: 2, floor: 2 },
    { id: '3', title: 'Room 3', capacity: 2, floor: 3 },
  ];

  const events = [
    {
      id: '1',
      title: 'Event 1',
      dateStart: new Date(2018, 2, 20, 12, 0, 0, 0),
      dateEnd: new Date(2018, 2, 20, 12, 30, 0, 0),
      users: [{ id: '1' }, { id: '2' }],
      room: { id: '1' },
    },
    {
      id: '2',
      title: 'Event 2',
      dateStart: new Date(2018, 2, 20, 12, 0, 0, 0),
      dateEnd: new Date(2018, 2, 20, 12, 45, 0, 0),
      users: [{ id: '2' }, { id: '3' }],
      room: { id: '2' },
    },
    {
      id: '3',
      title: 'Event 3',
      dateStart: new Date(2018, 2, 20, 12, 0, 0, 0),
      dateEnd: new Date(2018, 2, 20, 13, 0, 0, 0),
      users: [{ id: '2' }, { id: '3' }],
      room: { id: '3' },
    },
  ];

  const res = getRecommendation(date, [users[0], users[2]], { users, rooms, events });
  const answer = [
    {
      date: {
        start: new Date(2018, 2, 20, 12, 30, 0, 0),
        end: new Date(2018, 2, 20, 13, 30, 0, 0),
      },
      roomId: '1',
      swap: [],
    },
  ];

  expect(res).toEqual(answer);
});

test('getRecommendation swap #1', () => {
  const date = {
    start: new Date(2018, 2, 20, 12, 0, 0, 0),
    end: new Date(2018, 2, 20, 13, 0, 0, 0),
  };

  const users = [
    { id: '1', login: 'User 1', avatar: '', floor: 1 },
    { id: '2', login: 'User 2', avatar: '', floor: 2 },
    { id: '3', login: 'User 3', avatar: '', floor: 3 },
  ];

  const rooms = [
    { id: '1', title: 'Room 1', capacity: 1, floor: 1 },
    { id: '2', title: 'Room 2', capacity: 2, floor: 2 },
    { id: '3', title: 'Room 3', capacity: 3, floor: 3 },
  ];

  const events = [
    {
      id: '1',
      title: 'Комната #2, 11:00 - 11:45, 2 человека, не мешает',
      dateStart: new Date(2018, 2, 20, 11, 0, 0, 0),
      dateEnd: new Date(2018, 2, 20, 11, 45, 0, 0),
      users: [{ id: '1' }, { id: '2' }],
      room: { id: '2' },
    },
    {
      id: '2',
      title: 'Комната #2, 13:00 - 13:30, 1 человек, не мешает',
      dateStart: new Date(2018, 2, 20, 13, 0, 0, 0),
      dateEnd: new Date(2018, 2, 20, 13, 30, 0, 0),
      users: [{ id: '1' }],
      room: { id: '2' },
    },
    {
      id: '3',
      title: 'Комната #3, 13:15-13:45, 2 человека, не мешает',
      dateStart: new Date(2018, 2, 20, 13, 15, 0, 0),
      dateEnd: new Date(2018, 2, 20, 13, 45, 0, 0),
      users: [{ id: '2' }, { id: '3' }],
      room: { id: '3' },
    },
    {
      id: '4',
      title: 'Комната #3, 11:45-12:45, 2 человека, нужно перенести в команту #2',
      dateStart: new Date(2018, 2, 20, 11, 45, 0, 0),
      dateEnd: new Date(2018, 2, 20, 12, 45, 0, 0),
      users: [{ id: '1' }, { id: '3' }],
      room: { id: '3' },
    },
  ];

  const res = getRecommendation(date, [users[0], users[1], users[2]], { users, rooms, events });
  const answer = [
    {
      date,
      roomId: '3',
      swap: [
        {
          eventId: '4',
          roomId: '2',
        },
      ],
    },
  ];

  expect(res).toEqual(answer);
});

test('getRecommendation swap #2', () => {
  const date = {
    start: new Date(2018, 2, 20, 12, 0, 0, 0),
    end: new Date(2018, 2, 20, 13, 0, 0, 0),
  };

  const users = [
    { id: '1', login: 'User 1', avatar: '', floor: 1 },
    { id: '2', login: 'User 2', avatar: '', floor: 2 },
    { id: '3', login: 'User 3', avatar: '', floor: 3 },
    { id: '4', login: 'User 4', avatar: '', floor: 1 },
    { id: '5', login: 'User 5', avatar: '', floor: 2 },
    { id: '6', login: 'User 6', avatar: '', floor: 3 },
  ];

  const rooms = [
    { id: '1', title: 'Room 1', capacity: 2, floor: 1 },
    { id: '2', title: 'Room 2', capacity: 4, floor: 2 },
    { id: '3', title: 'Room 3', capacity: 6, floor: 3 },
  ];

  const events = [
    {
      id: '1',
      title: 'Комната #3, 11:45-12:15, 2 человека, нужно перенести в комнату #2',
      dateStart: new Date(2018, 2, 20, 11, 45, 0, 0),
      dateEnd: new Date(2018, 2, 20, 12, 15, 0, 0),
      users: [{ id: '2' }, { id: '5' }],
      room: { id: '3' },
    },
    {
      id: '2',
      title: 'Комната #3, 12:15-12:30, 4 человека, нужно перенести в комнату #2',
      dateStart: new Date(2018, 2, 20, 12, 15, 0, 0),
      dateEnd: new Date(2018, 2, 20, 12, 30, 0, 0),
      users: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
      room: { id: '3' },
    },
    {
      id: '3',
      title: 'Комната #3, 12:30-13:15, 4 человека, нужно перенести в комнату #2',
      dateStart: new Date(2018, 2, 20, 12, 30, 0, 0),
      dateEnd: new Date(2018, 2, 20, 13, 15, 0, 0),
      users: [{ id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }],
      room: { id: '3' },
    },
    {
      id: '4',
      title: 'Комната #2, 12:45-13:30, 2 человека, нужно перенести в комнату #3',
      dateStart: new Date(2018, 2, 20, 12, 45, 0, 0),
      dateEnd: new Date(2018, 2, 20, 13, 30, 0, 0),
      users: [{ id: '1' }, { id: '6' }],
      room: { id: '2' },
    },
    {
      id: '5',
      title: 'Комната #2, 12:15-12:30, 2 человека, нужно перенести в комнату #3',
      dateStart: new Date(2018, 2, 20, 12, 15, 0, 0),
      dateEnd: new Date(2018, 2, 20, 12, 30, 0, 0),
      users: [{ id: '3' }, { id: '4' }],
      room: { id: '2' },
    },
  ];

  const res = getRecommendation(
    date,
    [users[0], users[1], users[2], users[3], users[4], users[5]],
    { users, rooms, events },
  );

  const answer = [
    {
      date,
      roomId: '3',
      swap: [
        {
          eventId: '1',
          roomId: '2',
        },
        {
          eventId: '5',
          roomId: '1',
        },
        {
          eventId: '2',
          roomId: '2',
        },
        {
          eventId: '4',
          roomId: '1',
        },
        {
          eventId: '3',
          roomId: '2',
        },
      ],
    },
  ];

  expect(res).toEqual(answer);
});

test('getRecommendation swap #3', () => {
  const date = {
    start: new Date(2018, 2, 20, 12, 0, 0, 0),
    end: new Date(2018, 2, 20, 13, 0, 0, 0),
  };

  const users = [
    { id: '1', login: 'User 1', avatar: '', floor: 1 },
    { id: '2', login: 'User 2', avatar: '', floor: 2 },
    { id: '3', login: 'User 3', avatar: '', floor: 3 },
  ];

  const rooms = [
    { id: '1', title: 'Room 1', capacity: 2, floor: 1 },
    { id: '2', title: 'Room 2', capacity: 2, floor: 2 },
    { id: '3', title: 'Room 3', capacity: 2, floor: 3 },
  ];

  const events = [
    {
      id: '1',
      title: 'Комната #1, 12:00-12:30, 2 человека, нужно перенести в комнату #3',
      dateStart: new Date(2018, 2, 20, 12, 0, 0, 0),
      dateEnd: new Date(2018, 2, 20, 12, 30, 0, 0),
      users: [{ id: '1' }, { id: '2' }],
      room: { id: '1' },
    },
    {
      id: '2',
      title: 'Комната #2, 12:00-12:45, 2 человека, нужно перенести в комнату #3',
      dateStart: new Date(2018, 2, 20, 12, 0, 0, 0),
      dateEnd: new Date(2018, 2, 20, 12, 45, 0, 0),
      users: [{ id: '2' }, { id: '3' }],
      room: { id: '2' },
    },
    {
      id: '3',
      title: 'Комната #3, 12:45-13:00, 2 человека, нужно перенести в комнату #2',
      dateStart: new Date(2018, 2, 20, 12, 45, 0, 0),
      dateEnd: new Date(2018, 2, 20, 13, 0, 0, 0),
      users: [{ id: '2' }, { id: '3' }],
      room: { id: '3' },
    },
  ];

  const res = getRecommendation(date, [users[0], users[2]], { users, rooms, events });
  const answer = [
    {
      date,
      roomId: '1',
      swap: [{ eventId: '1', roomId: '3' }],
    },
    {
      date,
      roomId: '2',
      swap: [{ eventId: '2', roomId: '3' }],
    },
    {
      date,
      roomId: '3',
      swap: [{ eventId: '3', roomId: '2' }],
    },
  ];

  expect(res).toEqual(answer);
});

test('getRoomsEventsMap', () => {
  const rooms = [
    { id: '1', title: 'Room 1', capacity: 1, floor: 1 },
    { id: '2', title: 'Room 2', capacity: 2, floor: 2 },
    { id: '3', title: 'Room 3', capacity: 3, floor: 3 },
  ];

  const events = [
    { id: '1', room: { id: '1' } },
    { id: '2', room: { id: '1' } },
    { id: '3', room: { id: '1' } },
    { id: '4', room: { id: '3' } },
  ];

  const res = getRoomsEventsMap(rooms, events);
  const answer = {
    '1': [events[0], events[1], events[2]],
    '2': [],
    '3': [events[3]],
  };

  expect(res).toEqual(answer);
});

test('getRoomsDistanceQuality', () => {
  const users = [
    { id: '1', login: 'User 1', avatar: '', floor: 1 },
    { id: '2', login: 'User 2', avatar: '', floor: 2 },
    { id: '3', login: 'User 3', avatar: '', floor: 3 },
  ];

  const rooms = [
    { id: '1', title: 'Room 1', capacity: 1, floor: 1 },
    { id: '2', title: 'Room 2', capacity: 2, floor: 2 },
    { id: '3', title: 'Room 3', capacity: 3, floor: 4 },
  ];

  const res = getRoomsDistanceQuality(rooms, users);
  const answer = { '1': 3, '2': 2, '3': 6 };

  expect(res).toEqual(answer);
});
