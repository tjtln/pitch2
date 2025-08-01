import * as AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.CONNECTIONS_TABLE;

export default async function dealHands(gameId: string): Promise<Boolean>{
    try {
        const dealer = await getDealer(gameId);
        const handId = await getHandId(gameId);
        const deck = populateDeck();
        const shuffledDeck = shuffleArray(deck);
        const hands = [shuffledDeck.slice(0, 14), shuffledDeck.slice(14, 28), shuffledDeck.slice(28, 41), shuffledDeck.slice(41)];
        await addHandToDB(handId, hands, gameId, dealer);        
        return true;
    } catch (error) {
        console.log(`ERROR: ${error}`)
        return false;
    }
}

function populateDeck(): string[] {
    const deck: string[] = [];
    for (let i = 1; i < 14; i++) {
        for (let j = 0; j < 4; j++) {
            let rank: string;
            switch (i) {
            case 1:
                rank = "A";
                break;
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
                rank = `${i}`;
                break;
            case 11:
                rank = "J";
                break;
            case 12:
                rank = "Q";
                break;
            case 13:
                rank = "K";
                break;
            default:
                rank = "InvalidCard";
            }
            switch (j) {
                case 0:
                deck.push(`${rank}S`);
                break;
                case 1:
                deck.push(`${rank}C`);
                break;
                case 2:
                deck.push(`${rank}D`);
                break;
                case 3:
                deck.push(`${rank}H`);
                break;
            }
        }
    }
    deck.push('JkH');
    deck.push('JkL');

    return deck;
}
  
function shuffleArray(array: string[]): string[] {
for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
}

return array;
}

async function getDealer(gameId: string): Promise<string> {
    const game = await dynamoDB.get({
        TableName: tableName!,
        Key: {
          PK: `GAME#${gameId}`,
        },
    }).promise();

    if(!game.Item){
        throw new Error(`ERROR: no game found with id ${gameId}`);
    }

    if(game.Item){
        if(!game.Item.dealer){
            console.log(`No dealer found in game ${gameId}, setting it to player1`);
            await dynamoDB.update({
                TableName: tableName!,
                Key: {
                    PK: `GAME#${gameId}`,
                },
                UpdateExpression: `SET dealer = :dealer`,
                ExpressionAttributeValues: {
                    ':dealer': 'player1'
                },
            }).promise();
        }
    }

    return game.Item.dealer ?? 'player1';
}

async function getHandId(gameId: string): Promise<number> {
    const game = await dynamoDB.get({
        TableName: tableName!,
        Key: {
          PK: `GAME#${gameId}`,
        },
    }).promise();

    if(!game.Item){
        throw new Error(`ERROR: no game found with id ${gameId}`);
    }

    if(game.Item){
        if(!game.Item.handId){
            console.log(`No handId found in game ${gameId}, setting it to 0`);
            await dynamoDB.update({
                TableName: tableName!,
                Key: {
                    PK: `GAME#${gameId}`,
                },
                UpdateExpression: `SET handId = :handId`,
                ExpressionAttributeValues: {
                    ':handId': 0
                },
            }).promise();
        }
    }

    return game.Item.dealer ?? 0;
}

async function addHandToDB(handId: number, deck: string[][], gameId: string, dealer: string){
    try {
        const dealerNum = parseInt(dealer.charAt(dealer.length-1));
        console.log(`dealer: ${dealer}, dealerNum: ${dealerNum}, gameId: ${gameId}, handId: ${handId}`)
        await dynamoDB.put({
            TableName: tableName!,
            Item: {
                PK: `HAND#${gameId}#${handId}`,
                'player1': deck[(dealerNum+2)%4],
                'player2': deck[(dealerNum+3)%4],
                'player3': deck[(dealerNum)%4],
                'player4': deck[(dealerNum+1)%4],
            },
        }).promise();
    } catch(error) {
        console.log(`ERROR: error`)
        return false
    }
}