import { APIGatewayProxyResultV2 } from 'aws-lambda';
import * as AWS from 'aws-sdk';
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export default async function setGame(event: any, body: any): Promise<APIGatewayProxyResultV2> {
    const { connectionId } = event.requestContext;
    const { userId } = body.userId;
    const { gameId } = body.gameId;

    console.log(`userId: ${userId}`);
    console.log(`gameId: ${gameId}`);
    console.log(`body: ${body}`);
    console.log(`event: ${event}`);

    await dynamoDB.update({
        TableName: process.env.CONNECTIONS_TABLE!,
        Key: {
            PK: `CONNECTION#${connectionId}`,
        },
        UpdateExpression: 'SET  gameId = :gameId, userId = :userId',
        ExpressionAttributeValues: {
            ':gameId': gameId,
            ':userId': userId,
        },
        }).promise();
        
    return {statusCode: 200}
  };