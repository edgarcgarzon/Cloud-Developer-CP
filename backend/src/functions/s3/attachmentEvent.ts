import {S3Handler, S3Event} from 'aws-lambda'
import {createLogger} from "@libs/logger"
import { s3Adapter } from '@dataLayer/S3/s3Adapter';


const logger = createLogger('attachmentEvent');

export const handler:S3Handler = async (event:S3Event) => {
    
    logger.info(`S3 event `);

    
    for (const record of event.Records)
    {
        logger.info(`S3 record ${JSON.stringify(record)}`);
        await new s3Adapter().S3PutObjectEvent(record.s3.object.key);
    
    }
}