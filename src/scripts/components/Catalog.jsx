import React from 'react';
import PropTypes from 'prop-types';

function Catalog(props) {
  const floors = splitRoomsByFloorsAndSort(props.rooms);

  return (
    <div className="catalog">
      {
        floors.map((rooms, index) => (
          <div className="catalog__floor" key={index.toString()}>
            <p className="catalog__floor-title">{`${index} этаж`}</p>
            {
              rooms.map((room) => {
                const extraClassName = room.id === props.selectedRoomId ? 'catalog__room-title_selected' : '';

                return (
                  <div className="catalog__room" key={room.id}>
                    <span className={`catalog__room-title ${extraClassName}`}>{room.title}</span>
                    <span className="catalog__room-capacity">{`${room.capacity} человек`}</span>
                  </div>
                );
              })
            }
          </div>
        )).reverse()
      }
    </div>
  );
}

Catalog.propTypes = {
  selectedRoomId: PropTypes.string,
  rooms: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    floor: PropTypes.number.isRequired,
    capacity: PropTypes.number.isRequired,
  })).isRequired,
};

export default Catalog;

function splitRoomsByFloorsAndSort(rooms) {
  const res = [];

  rooms.forEach((room) => {
    const { floor } = room;

    if (!Array.isArray(res[floor])) {
      res[floor] = [];
    }

    res[floor].push(room);
  });

  res.forEach(arr => arr.sort((a, b) => a.title.localeCompare(b.title)));

  return res;
}
