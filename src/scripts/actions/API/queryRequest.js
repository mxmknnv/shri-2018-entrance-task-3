import graphql from 'graphql.js';

const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/graphql' : '/graphql';
const graph = graphql(url);

export default function queryRequest(list) {
  const requestBody = [];

  for (let i = 0; i < list.length; i++) {
    switch (list[i].type) {
      case 'eventsByDate':
        requestBody.push(`
          eventsByDate(date: "${list[i].data.date.toJSON()}") {
            id,
            title,
            dateStart,
            dateEnd,
            users {
              id
            },
            room {
              id
            }
          }
        `);
        break;
      case 'rooms':
        requestBody.push(`
          rooms {
            id,
            title,
            capacity,
            floor
          }
        `);
        break;
      case 'users':
        requestBody.push(`
          users {
            id,
            login,
            floor,
            avatar
          }
        `);
        break;

      default: requestBody.push('');
    }
  }

  return graph(`query {${requestBody.join('')}}`);
}
