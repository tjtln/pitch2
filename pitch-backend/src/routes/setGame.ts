import { APIGatewayProxyResultV2 } from 'aws-lambda';
import * as AWS from 'aws-sdk';
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export default async function setGame(event: any, body: any): Promise<APIGatewayProxyResultV2> {
    const { connectionId } = event.requestContext;
    const userId = body.userId;
    const gameId = body.gameId;
    const tableName = process.env.CONNECTIONS_TABLE;

    console.log(`userId: ${userId}`);
    console.log(`gameId: ${gameId}`);
    console.log(`body: ${JSON.stringify(body)}`);
    console.log(`event: ${event}`);

    await dynamoDB.update({
        TableName: tableName!,
        Key: {
            PK: `CONNECTION#${connectionId}`,
        },
        UpdateExpression: 'SET  gameId = :gameId, userId = :userId',
        ExpressionAttributeValues: {
            ':gameId': gameId,
            ':userId': userId,
        },
    }).promise();

    const game = await dynamoDB.get({
        TableName: tableName!,
        Key: {
          PK: `GAME#${gameId}`,
        },
    }).promise();     

    console.log("exising game:" + game);
                    
    const row = game.Item;

    console.log(row);

    return {statusCode: 200}
  };