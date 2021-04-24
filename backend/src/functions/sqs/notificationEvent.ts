import { SQSAdapter } from "@dataLayer/sqs/SQSAdapter";
import {createLogger} from "@libs/logger"
import { SQSEvent } from "aws-lambda";
import { SQSHandler } from 'aws-lambda';


const logger = createLogger('notificationEvent');

export const handler:SQSHandler = async (event:SQSEvent) => {

    for (const record of event.Records){
        logger.info(`SQS event: ${JSON.stringify(record)}`);

        //Parse the message and send notification to logic
        new SQSAdapter().receiveMessageEvent(record);
    }    
}