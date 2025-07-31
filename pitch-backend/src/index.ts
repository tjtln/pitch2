import { APIGatewayProxyWebsocketEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import  setGame  from './routes/setGame';
import  onConnect  from './routes/connect';
import  onDisconnect  from './routes/disconnect';

export const handler = async (
  event: APIGatewayProxyWebsocketEventV2
): Promise<APIGatewayProxyResultV2> => {
  console.log("Event:", JSON.stringify(event));

  const route = event.requestContext.routeKey;
  const body: any = event.body ? JSON.parse(event.body) : {};

  switch (route) {
    case '$connect':
      console.log("connecting");
      return await onConnect(event);
    case '$disconnect':
      return await onDisconnect(event);
    case 'setGame':
      return await setGame(event, body);
    default:
      console.warn(`No handler for route: ${route}`);
      return { statusCode: 400, body: 'Unknown route' };
  }
};
