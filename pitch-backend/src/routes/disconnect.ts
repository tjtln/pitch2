import { APIGatewayProxyResultV2 } from "aws-lambda";
import * as AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
export default async function onDisconnect(event: any): Promise<APIGatewayProxyResultV2> {
    const { connectionId } = event.requestContext;

    await dynamoDB.put({
        TableName: process.env.CONNECTIONS_TABLE!,
        Item: {
          PK: `CONNECTION#${connectionId}`,
          connectionId,
          status: 'disconnected',
          endedAt: Date.now(),
        },
      }).promise();
      
      return {statusCode: 200}
  };