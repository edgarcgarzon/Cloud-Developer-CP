
import { handlerPath } from '@libs/handlerResolver';
export default {
    handler: `${handlerPath(__dirname)}/attachmentEvent.handler`,
    events: [
      {
        s3: {
            bucket: "${self:provider.environment.S3_BUCKET_ATTACH}",
            events: ["s3:ObjectCreated:Put"],
            existing: true
        }      
      }
    ],
    iamRoleStatements:[
      {
        Effect: "Allow",
        Action: ["dynamodb:UpdateItem"],
        Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.NOTE_LITE_TABLE}"
      }
    ]
}