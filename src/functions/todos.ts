import { APIGatewayProxyHandler } from "aws-lambda"
import { S3 } from "aws-sdk"
import { document } from "../utils/dynamodbClient";
import { v4 as uuidv4 } from 'uuid'

interface ICreateTodo {
    title: string;
    deadline: string;
    user_id: string;
    id: string;
    done: string;
}


export const handler: APIGatewayProxyHandler = async (event) => {
    const { title, deadline } = JSON.parse(event.body) as ICreateTodo
    const { user_id } = event.pathParameters;

    const id = uuidv4();

    const response = await document.query({
        TableName: "todoIgnite",
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": id
        }
    }).promise();

    const userAlreadyExist = response.Items[0];

    if (!userAlreadyExist) {
        await document.put({
            TableName: "todoIgnite",
            Item: {
                id,
                user_id,
                title,
                deadline,
                done: false
            }
        }).promise();
    }

    const s3 = new S3();

    await s3
        .createBucket({
            Bucket: "todoIgnite"
        })
        .promise();

    const todo = response.Items[0] as ICreateTodo

    return {
        statusCode: 201,
        body: JSON.stringify({
            id: todo.id,
            user_id: todo.user_id,
            title: todo.title,
            done: todo.done,
            deadline: todo.deadline,

        })
    }
}