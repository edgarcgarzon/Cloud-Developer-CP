
import { handlerPath } from '@libs/handlerResolver';
import {postNoteReqSch} from './postNoteReqSch'

export default {
  handler: `${handlerPath(__dirname)}/postNoteReq.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'note',
        authorizer: 'auth',
        request: {
          schema: {
            'application/json': postNoteReqSch
          }
        }
      }      
    }
  ]
}
