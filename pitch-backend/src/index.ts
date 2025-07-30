import {
  APIGatewayProxyWebsocketEventV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda';

export const handler = async (
  event: APIGatewayProxyWebsocketEventV2
): Promise<APIGatewayProxyResultV2> => {
  console.log("Event:", event);

  switch (event.requestContext.eventType) {
    case 'CONNECT':
      console.log('Client connected:', event.requestContext.connectionId);
      return { statusCode: 200 };

    case 'DISCONNECT':
      console.log('Client disconnected:', event.requestContext.connectionId);
      return { statusCode: 200 };

    case 'MESSAGE':
      console.log('Message received:', event.body);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: `Echo: ${event.body}` }),
      };

    default:
      return { statusCode: 400 };
  }
};
