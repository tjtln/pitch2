import { APIGatewayProxyResultV2 } from "aws-lambda";

export default async function disconnect(event: any): Promise<APIGatewayProxyResultV2>{
    return {statusCode: 200}
}