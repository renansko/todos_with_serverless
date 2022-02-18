import { DynamoDB } from 'aws-sdk'

const options = {
    regions: 'localhost',
    endpoitn: "http://localhost:8000",
    accessKeyId: "x",
    secretAccessKey: "x",
}

const isOffline = () => {
    return process.env.IS_OFFLINE;
}

export const document = isOffline()
    ? new DynamoDB.DocumentClient(options)
    : new DynamoDB.DocumentClient();