
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
  ]
}
