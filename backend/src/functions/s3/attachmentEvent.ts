import {S3Handler, S3Event} from 'aws-lambda'
import {createLogger} from "@libs/logger"
import { noteAdapter } from '@dataLayer/dynamodb/noteAdapter';


const logger = createLogger('attachmentEvent');

export const handler:S3Handler = async (event:S3Event) => {
    
    logger.info(`S3 event `);

    
    for (const record of event.Records)
    {
        logger.info(`S3 record ${JSON.stringify(record)}`);

        const key = record.s3.object.key
        logger.info("S3 Event for key: " + JSON.stringify(key));

        const parts = key.split("/");
        const noteId = decodeURIComponent(parts[0]);
        const fileId = decodeURIComponent(parts[1]);

        const item = await new noteAdapter().AddAttachment(noteId, fileId);
        logger.info(`Attachment ${fileId} added to item: ${JSON.stringify(item)}`);
    }
}