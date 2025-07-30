import { APIGatewayProxyResultV2 } from "aws-lambda";

export default async function dealHands(event: any, message: any): Promise<APIGatewayProxyResultV2>{
    return {statusCode: 200}
}