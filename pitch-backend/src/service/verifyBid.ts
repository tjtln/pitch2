import * as AWS from 'aws-sdk';
import { createHand, getGame, updateGame } from './CRUDs';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.CONNECTIONS_TABLE;

export async function isValidBid(gameId: string, handId: string, userId: string, bid: string): Promise<Boolean>{
    return true;
}