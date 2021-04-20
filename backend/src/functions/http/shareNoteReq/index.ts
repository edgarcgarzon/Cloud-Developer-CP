
import { handlerPath } from '@libs/handlerResolver';
import {shareNoteReqSch} from './shareNoteReqSch'

export default {
  handler: `${handlerPath(__dirname)}/shareNoteReq.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'note/share',
        authorizer: 'auth',
        request: {
          schema: {
            'application/json': shareNoteReqSch
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
      Action: ["dynamodb:PutItem"],
      Resource: "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.NOTE_LITE_TABLE}"
    }
  ]
}
