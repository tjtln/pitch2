import * as AWS from 'aws-sdk';
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const onConnect = async (event: any) => {
    const { connectionId } = event.requestContext;

    await dynamoDB.put({
        TableName: process.env.CONNECTIONS_TABLE!,
        Item: {
          PK: `CONNECTION#${connectionId}`,
          SK: `META`,
          connectionId,
          status: 'connected',
          createdAt: Date.now(),
        },
      }).promise();
  };
