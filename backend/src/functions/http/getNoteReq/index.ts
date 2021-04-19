
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
  ]
}
