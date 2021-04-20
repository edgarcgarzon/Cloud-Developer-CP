
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/attachmentNoteReq.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'note/{noteId}/attachment',
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
      Action: ["s3:PutObject"],
      Resource: "arn:aws:s3:::${self:provider.environment.S3_BUCKET_ATTACH}/*"
    }
  ]
}
