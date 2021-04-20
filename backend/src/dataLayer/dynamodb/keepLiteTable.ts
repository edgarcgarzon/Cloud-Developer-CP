export default {
    Type: "AWS::DynamoDB::Table",
    Properties: {
        TableName: "${self:provider.environment.NOTE_LITE_TABLE}",
        BillingMode: "PAY_PER_REQUEST",
        AttributeDefinitions: [
            {
                AttributeName: "PK",
                AttributeType: "S"
            },
            {
                AttributeName: "SK",
                AttributeType: "S"
            },
            {
                AttributeName: "userId",
                AttributeType: "S"
            }
        ],
        KeySchema:[
            {
                AttributeName: "PK",
                KeyType: "HASH"
            },
            {
                AttributeName: "SK",
                KeyType: "RANGE"
            },
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: "${self:provider.environment.NOTE_LITE_SGI1}",
                KeySchema: [
                    {
                        AttributeName: "userId",
                        KeyType: "HASH"
                    },
                    {
                        AttributeName: "PK",
                        KeyType: "RANGE"
                    }
                ],
                Projection: {
                    ProjectionType: "ALL"
                }
            }
        ]
    }
}