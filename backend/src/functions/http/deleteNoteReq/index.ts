
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/deleteNoteReq.main`,
  events: [
    {
      http: {
        method: 'delete',
        path: 'note/{noteId}',
        authorizer: 'auth',
      }      
    }
  ],
  iamRoleStatements:[
    {
      Effect: "Allow",
      Action: ["dynamodb:Query", "dynamodb:BatchWriteItem"],
      Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.NOTE_LITE_TABLE}"
    }
  ]
}
