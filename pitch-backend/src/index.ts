import { APIGatewayProxyWebsocketEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { onDealHands } from './routes/dealHands';
import { onConnect } from './routes/connect';
import { onDisconnect } from './routes/disconnect';

export const handler = async (
  event: APIGatewayProxyWebsocketEventV2
): Promise<APIGatewayProxyResultV2> => {
  console.log("Event:", JSON.stringify(event));

  const route = event.requestContext.routeKey;
  let body: any = {};
  try {
    if (event.body) body = JSON.parse(event.body);
  } catch {
    body = {};
  }

  switch (route) {
    case '$connect':
      return await onConnect(event);
    case '$disconnect':
      return await onDisconnect(event);
    case 'dealHands':
      return await onDealHands(event, body);
    default:
      console.warn(`No handler for route: ${route}`);
      return { statusCode: 400, body: 'Unknown route' };
  }
};
