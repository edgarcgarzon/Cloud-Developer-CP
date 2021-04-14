import {holaSchema}  from './holaSchema';
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'hello',
        authorizer: 'auth',
        request: {
          schema: {
            'application/json': holaSchema
          }
        }
      }      
    }
  ]
}
