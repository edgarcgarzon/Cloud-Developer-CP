import { APIGatewayTokenAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify} from 'jsonwebtoken'
import Axios from 'axios'

import { createLogger } from '@libs/logger'
import { JwtPayload } from '@libs/auth/JwtPayload'

const logger = createLogger('auth')
const jwksUrl = 'https://dev-yk6uhsvx.eu.auth0.com/pem'


export const main = async (event: APIGatewayTokenAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  
  logger.info('Authorizing a user: ' + event.authorizationToken)
  
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized: ' + e.message )

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

/**
 * verify the authorization token
 * @param authHeader 
 * @returns 
 */
async function verifyToken(authHeader: string): Promise<JwtPayload> {
  
  logger.info('Verify a token ...');
  const token = getToken(authHeader)
  logger.info('token: ' + token);
  logger.info('Get the certification ...');
  const response = await Axios.get(jwksUrl)
  logger.info("Response certification fetch(get): " + response.data);

  logger.info("Verify token agains certification");
  //return verify(token, response.data, { algorithms: ['RS256'] }) as JwtPayload
  return verify(token, response.data, { algorithms: ['RS256'] }) as JwtPayload
}

/**
 * get Toke from authorizatin header
 * @param authHeader 
 * @returns 
 */
function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
