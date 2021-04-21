
import { handlerPath } from '@libs/handlerResolver';
//import { getNoteReqSch } from './getNoteReqSch';

export default {
  handler: `${handlerPath(__dirname)}/getNoteReq.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'note',
        authorizer: 'auth',
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
      Action: ["s3:GetObject"],
      Resource: "arn:aws:s3:::${self:provider.environment.S3_BUCKET_ATTACH}/*"
    }
  ]
}
