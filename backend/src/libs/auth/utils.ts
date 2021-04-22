import { iUser } from '@models/user'
import { decode } from 'jsonwebtoken'

import { JwtPayload } from './JwtPayload'

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): iUser {
  const decodedJwt = decode(jwtToken) as JwtPayload
  return {Id: decodedJwt.sub, email: decodedJwt.email} as iUser;
}