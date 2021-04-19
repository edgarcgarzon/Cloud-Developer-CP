
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
  ]
}
