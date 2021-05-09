import { noteAdapter } from "@dataLayer/dynamodb/noteAdapter";
import { SQSAdapter } from "@dataLayer/sqs/SQSAdapter";
import { iNotification } from "@models/notification";
import {createLogger} from "@libs/logger"
import { SESAdapter } from "@dataLayer/ses/SESAdapter";


export class notificationLogic{
    constructor(private readonly logger = createLogger('s3Adapter'),){
        
    }
    /**
     * 
     * @param notification 
     */
    sendNotification(notification:iNotification){
        new SQSAdapter().sendMessage(notification);
    }

    /**
     * 
     * @param notification 
     */
    async NotificationEvent(notification:iNotification){

        //Read all users with notId
        var users = await new noteAdapter().getUsers(notification.noteId);

        //filter the one that update the message
        users = users.filter( x => {
                return x.email != notification.user.email;
        });

        const emails = users.map(x => x.email);

        this.logger.info(`users to send notification email: ${JSON.stringify(emails)}`)

        const subject = `Note-Lite-App: Note shared with you has been updated`;
        const body = `The note ${notification.noteId} has been updated by ${notification.user.email}`

        new SESAdapter().sendMessage(emails,[], subject, body);
    }
}