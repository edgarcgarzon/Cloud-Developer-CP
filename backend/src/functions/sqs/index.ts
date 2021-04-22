
import { handlerPath } from '@libs/handlerResolver';
export default {
    handler: `${handlerPath(__dirname)}/notificationEvent.handler`,
    events: [
      {  
        sqs: {
          //queueName: "${self:provider.environment.SQS_NOTIFICATION}",
          arn: { 'Fn::GetAtt': ["SQSNotification", 'Arn'] }
        }   
      }
    ],
    iamRoleStatements:[
      {
        Effect: "Allow",
        Action: ["dynamodb:Query"],
        Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.NOTE_LITE_TABLE}"
      }
    ]
}