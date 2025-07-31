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

    await dynamoDB.put({
        TableName: tableName!,
        Item: {
            PK: `CONNECTION#${userId}`,
            connectionId,
          },
    }).promise();

    const game = await dynamoDB.get({
        TableName: tableName!,
        Key: {
          PK: `GAME#${gameId}`,
        },
    }).promise();     

    console.log("existing game:" + JSON.stringify(game));


    if(game.Item){
        if(!game.Item.player1){
            console.log(`setting player1 to ${userId} in game with id ${gameId}`);
            await setPlayer(gameId, userId, "player1");
        } else if(!game.Item.player2){
            console.log(`setting player2 to ${userId} in game with id ${gameId}`);
            await setPlayer(gameId, userId, "player2");
        } else if(!game.Item.player3){
            console.log(`setting player3 to ${userId} in game with id ${gameId}`);
            await setPlayer(gameId, userId, "player3");
        } else if(!game.Item.player4){
            console.log(`setting player4 to ${userId} in game with id ${gameId}`);
            await setPlayer(gameId, userId, "player4");
        } else {
            console.log("game full!");
            return {statusCode: 200};
        }
    } else {
        console.log(`no game with id ${gameId} exists, creating a new one and setting player1 to ${userId}`);
        await setPlayer(gameId, userId, "player1");
    }

    async function setPlayer(gameId: string, userId: string, column: string){
        await dynamoDB.update({
            TableName: tableName!,
            Key: {
                PK: `GAME#${gameId}`,
            },
            UpdateExpression: `SET  gameId = :gameId, ${column} = :${column}`,
            ExpressionAttributeValues: {
                [`:${column}`]: userId,
            },
        }).promise();
    }

    return {statusCode: 200}
  };