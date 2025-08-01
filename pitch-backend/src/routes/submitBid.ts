import { APIGatewayProxyResultV2 } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { isValidBid } from '../service/verifyBid';
import { getUserIdByConnectionId, updateHand } from '../service/CRUDs';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.CONNECTIONS_TABLE;

export default async function submitBid(event: any, body: any): Promise<APIGatewayProxyResultV2> {
    const { connectionId } = event.requestContext;
    const bid = body.bid;
    const gameId = body.gameId;
    const handId = body.handId;

    console.log(`Received bid: ${bid} in game: ${gameId} and hand: ${handId} from connection: ${connectionId}`);
    const userId = await getUserIdByConnectionId(connectionId);

    if(!userId) {
        console.log(`connectionId: ${connectionId} didn't match a user`);
        return {statusCode: 400}
    }

    if(await isValidBid(gameId, handId, userId, bid)){
        await updateHand(gameId, handId, userId, bid);
    }

    return {statusCode: 200};
}