import { APIGatewayProxyResultV2 } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import dealHands from '../service/dealHands';
import { createPlayer, getGame, updateConnection, updateGame } from '../service/CRUDs';
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export default async function setGame(event: any, body: any): Promise<APIGatewayProxyResultV2> {
    const { connectionId } = event.requestContext;
    const userId = body.userId;
    const gameId = body.gameId;

    console.log(`userId: ${userId}`);
    console.log(`gameId: ${gameId}`);
    console.log(`body: ${JSON.stringify(body)}`);
    console.log(`event: ${event}`);

    createPlayer(userId, connectionId);
    updateConnection(connectionId, userId);

    const game = await getGame(gameId);
    console.log("existing game:" + JSON.stringify(game));


    if(game){
        if(!game.player1){
            console.log(`setting player1 to ${userId} in game with id ${gameId}`);
            await updateGame(gameId, "player1", userId);
        } else if(!game.player2){
            console.log(`setting player2 to ${userId} in game with id ${gameId}`);
            await updateGame(gameId, "player2", userId);
        } else if(!game.player3){
            console.log(`setting player3 to ${userId} in game with id ${gameId}`);
            await updateGame(gameId, "player3", userId);
        } else if(!game.player4){
            console.log(`setting player4 to ${userId} in game with id ${gameId}`);
            await updateGame(gameId, "player4", userId);
            await dealHands(gameId);
        } else {
            console.log("game full!");
            return {statusCode: 200};
        }
    } else {
        console.log(`no game with id ${gameId} exists, creating a new one and setting player1 to ${userId}`);
        await updateGame(gameId, "player1", userId);
    }

    return {statusCode: 200}
  };
