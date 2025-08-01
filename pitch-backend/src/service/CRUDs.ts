import * as AWS from 'aws-sdk';
import { AttributeMap } from 'aws-sdk/clients/dynamodb';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.CONNECTIONS_TABLE;

export async function getUserIdByConnectionId(connectionId: string): Promise<string | null>{
  const row = await dynamoDB.get({
    TableName: tableName!,
    Key: {
      PK: `CONNECTION#${connectionId}`,
    },
  }).promise();

  if(!row.Item){
    console.log(`Cannot find connection: ${connectionId}`);
    return null;
  }
  if(!row.Item.userId){
    console.log(`Connection has no userId listed: ${connectionId}`);
    return null;
  }
  return row.Item.userId;
}

export async function getConnectionIdByUserId(userId: string): Promise<string | null>{
  const row = await dynamoDB.get({
    TableName: tableName!,
    Key: {
      PK: `PLAYER#${userId}`,
    },
  }).promise();

  if(!row.Item){
    console.log(`Cannot find user: ${userId}`);
    return null;
  }
  if(!row.Item.userId){
    console.log(`Connection has no userId listed: ${userId}`);
    return null;
  }
  return row.Item.userId;
}

export async function createPlayer(userId: string, connectionId: string): Promise<Boolean>{
  try {
    await dynamoDB.put({
      TableName: tableName!,
      Item: {
          PK: `PLAYER#${userId}`,
          connectionId,
        },
    }).promise();
  } catch(error) {
    console.log(`ERROR: ${error}`)
    return false;
  }
  return true;
}

export async function updateConnection(connectionId: string, userId: string): Promise<Boolean> {
  try{
    await dynamoDB.update({
      TableName: tableName!,
      Key: {
          PK: `CONNECTION#${connectionId}`,
      },
      UpdateExpression: `SET userId = :userId`,
      ExpressionAttributeValues: {
          ':userId': userId
      },
    }).promise();
    return true;
  } catch(error){
    console.log(`ERROR: ${error}`);
    return false;
  }
}

export async function getGame(gameId: string): Promise<AttributeMap | null> {
  const row = await dynamoDB.get({
    TableName: tableName!,
    Key: {
      PK: `GAME#${gameId}`,
    },
  }).promise();

  if(!row.Item){
    console.log(`Cannot find game: ${gameId}`);
    return null;
  }
  return row.Item;
}

export async function updateGame(gameId: string, column: string, value: any){
  try{
    await dynamoDB.update({
        TableName: tableName!,
        Key: {
            PK: `GAME#${gameId}`,
        },
        UpdateExpression: `SET ${column} = :${column}`,
        ExpressionAttributeValues: {
            [`:${column}`]: value
        },
    }).promise();
    return true;
  } catch(error){
    console.log(`ERROR: ${error}`);
    return false;
  }
}

export async function createHand(gameId: string, handId: number, dealer: string, dealerNum: number, deck: string[][]): Promise<Boolean> {
  try{
    await dynamoDB.put({
      TableName: tableName!,
      Item: {
          PK: `HAND#${gameId}#${handId}`,
          'dealer': dealer,
          'turn': `player${(dealerNum+1)%4}`,
          'phase': 'bidding',
          'player1': deck[(dealerNum+2)%4],
          'player2': deck[(dealerNum+3)%4],
          'player3': deck[(dealerNum)%4],
          'player4': deck[(dealerNum+1)%4],
      },
    }).promise();
    return true;
  } catch(error){
    return false;
  }
}