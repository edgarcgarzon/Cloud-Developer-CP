import {S3Handler, S3Event} from 'aws-lambda'
import {createLogger} from "@libs/logger"
import { noteAdapter } from '@dataLayer/dynamodb/noteAdapter';
import { s3Adapter } from '@dataLayer/S3/s3Adapter';


const logger = createLogger('attachmentEvent');

export const handler:S3Handler = async (event:S3Event) => {
    
    logger.info(`S3 event `);

    
    for (const record of event.Records)
    {
        logger.info(`S3 record ${JSON.stringify(record)}`);

        const key = record.s3.object.key
        const metadata = await new s3Adapter().getMetadata(key);
        logger.info(`S3 Event for key ${JSON.stringify(key)} and Metadata ${JSON.stringify(metadata)}`);

        const parts = key.split("/");
        const noteId = decodeURIComponent(parts[0]);
        const fileId = decodeURIComponent(parts[1]);

        const item = await new noteAdapter().AddAttachment(noteId, fileId, metadata["publisher"], new Date().toLocaleString());
        logger.info(`Attachment ${fileId} added to item: ${JSON.stringify(item)}`);
    }
}