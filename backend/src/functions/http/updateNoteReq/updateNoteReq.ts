import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { noteLogic } from '@businessLogic/NoteLogic';
import { getUserId } from '@libs/utils';
import { noteInit } from '@models/note';
import {createLogger} from "@libs/logger"

const logger = createLogger('postNoteReq');

export const api: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const user = getUserId(event);
  const body: noteInit = JSON.parse(event.body);
  const { noteId } = event.pathParameters;

  try {
    logger.info(`Update NoteId ${noteId} with input: ${event.body}`);
    const note = await new noteLogic().updateNote(user, noteId, body);
    return formatJSONResponse(200, {
      message: note
    });
  }
  catch (err) {
    return formatJSONResponse(502, {
      message: `${err}`
    });
  }
}

export const main = middyfy(api);
