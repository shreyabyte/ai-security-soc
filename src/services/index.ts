import AWS from 'aws-sdk';

export class Service {
    private s3: AWS.S3;
    private dynamoDB: AWS.DynamoDB;

    constructor() {
        this.s3 = new AWS.S3();
        this.dynamoDB = new AWS.DynamoDB();
    }

    public async uploadFile(bucketName: string, key: string, body: Buffer | string): Promise<AWS.S3.PutObjectOutput> {
        const params = {
            Bucket: bucketName,
            Key: key,
            Body: body,
        };
        return this.s3.upload(params).promise();
    }

    public async fetchData(tableName: string, key: AWS.DynamoDB.DocumentClient.Key): Promise<AWS.DynamoDB.DocumentClient.GetItemOutput> {
        const params = {
            TableName: tableName,
            Key: key,
        };
        return this.dynamoDB.get(params).promise();
    }
}