import {createLogger} from "@libs/logger"
import { SQSEvent } from "aws-lambda";
import { SQSHandler } from 'aws-lambda';


const logger = createLogger('notificationEvent');

export const handler:SQSHandler = async (event:SQSEvent) => {
    
    for (const record of event.Records){
        logger.info(`SQS event: ${JSON.stringify(record)}`)
    }    
}