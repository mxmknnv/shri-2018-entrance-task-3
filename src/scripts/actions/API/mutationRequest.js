import graphql from 'graphql.js';

const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/graphql' : '/graphql';
const graph = graphql(url);

export default function mutationRequest(list) {
  const requestedEventBody = 'id, title, dateStart, dateEnd, users { id }, room { id }';
  const requestBody = [];

  for (let i = 0; i < list.length; i++) {
    switch (list[i].type) {
      case 'createEvent':
        requestBody.push(`
          createEvent(
            input: {
              title: "${list[i].data.title}",
              dateStart: "${list[i].data.dateStart.toJSON()}",
              dateEnd: "${list[i].data.dateEnd.toJSON()}",
            },
            usersIds: [${list[i].data.usersIds}],
            roomId: "${list[i].data.roomId}"
          ) { ${requestedEventBody} }
        `);
        break;
      case 'updateEvent':
        requestBody.push(`
          updateEvent(
            id: "${list[i].data.id}",
            input: {
              title: "${list[i].data.title}",
              dateStart: "${list[i].data.dateStart.toJSON()}",
              dateEnd: "${list[i].data.dateEnd.toJSON()}",
            },
            usersIds: [${list[i].data.usersIds}],
            roomId: "${list[i].data.roomId}"
          ) { ${requestedEventBody} }
        `);
        break;
      case 'removeEvent':
        requestBody.push(`
          removeEvent(
            id: "${list[i].data.id}",
          ) { ${requestedEventBody} }
        `);
        break;
      case 'changeEventRoom':
        requestBody.push(`
          changeEventRoom(
            swap: ${swapToString(list[i].data.swap)}
          ) { ${requestedEventBody} }
        `);
        break;

      default: requestBody.push('');
    }
  }

  return graph(`mutation {${requestBody.join('')}}`);
}

function swapToString(swap) {
  const els = swap.map(el => `{eventId: "${el.eventId}", roomId: "${el.roomId}"}`);
  return `[${els.join(',')}]`;
}
