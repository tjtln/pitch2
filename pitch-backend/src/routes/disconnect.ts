import { APIGatewayProxyResultV2 } from "aws-lambda";
import * as AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export default async function onDisconnect(event: any): Promise<APIGatewayProxyResultV2> {
  const { connectionId } = event.requestContext;

  await dynamoDB.update({
    TableName: process.env.CONNECTIONS_TABLE!,
    Key: {
      PK: `CONNECTION#${connectionId}`,
    },
    UpdateExpression: 'SET #status = :status, endedAt = :endedAt',
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':status': 'disconnected',
      ':endedAt': Date.now(),
    },
  }).promise();

  return { statusCode: 200 };
}
