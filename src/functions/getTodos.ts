import { APIGatewayProxyHandler } from "aws-lambda"
import { document } from "../utils/dynamodbClient"

import { join } from 'path'
import { S3 } from 'aws-sdk'

interface ITemplate {
    id: string;
    name: string;
    grade: string;
    medal: string;
    date: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
    const { id } = event.pathParameters;

    const response = await document.query({
        TableName: "user_certificate",
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": id
        }
    }).promise();

    const todos = response.Items[0] as ITemplate;

    if (todos) {
        return {
            statusCode: 201,
            body: JSON.stringify({
                name: todos.name,
                todos: todos[]
            })
        }
    }

    return {
        statusCode: 400,
        body: JSON.stringify({
            message: "Todo nao encontrado!"
        })
    }
};