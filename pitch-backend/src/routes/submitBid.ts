import { APIGatewayProxyResultV2 } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.CONNECTIONS_TABLE;

export default async function submitBid(event: any, body: any): Promise<APIGatewayProxyResultV2> {
    const { connectionId } = event.requestContext;
    const bid = body.bid;
    const gameId = body.gameId;
    const handId = body.handId;

    console.log(`Received bid: ${bid} in game: ${gameId} and hand: ${handId} from connection: ${connectionId}`);
    

    return {statusCode: 200};
}