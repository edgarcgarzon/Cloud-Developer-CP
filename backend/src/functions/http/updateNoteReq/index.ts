
import { handlerPath } from '@libs/handlerResolver';
import {updateNoteReqSch} from './updateNoteReqSch'

export default {
  handler: `${handlerPath(__dirname)}/updateNoteReq.main`,
  events: [
    {
      http: {
        method: 'patch',
        path: 'note/{noteId}',
        authorizer: 'auth',
        request: {
          schema: {
            'application/json': updateNoteReqSch
          }
        }
      }      
    }
  ],
  iamRoleStatements:[
    {
      Effect: "Allow",
      Action: ["dynamodb:Query"],
      Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.NOTE_LITE_TABLE}/index/${self:provider.environment.NOTE_LITE_SGI1}"
    },
    {
      Effect: "Allow",
      Action: ["dynamodb:UpdateItem"],
      Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.NOTE_LITE_TABLE}"
    },
    {
      Effect: "Allow",
      Action: ["sqs:SendMessage", "sqs:GetQueueUrl"],
      Resource: { 'Fn::GetAtt': ["SQSNotification", 'Arn'] }
    }
  ]
}
