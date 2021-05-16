import { noteAdapter } from "@dataLayer/dynamodb/noteAdapter";
import { SQSAdapter } from "@dataLayer/sqs/SQSAdapter";
import { iNotification } from "@models/notification";
import {createLogger} from "@libs/logger"
import { SESAdapter } from "@dataLayer/ses/SESAdapter";


export class notificationLogic{
    constructor(private readonly logger = createLogger('NotificationLogic'),){
        
    }
    /**
     * 
     * @param notification 
     */
    async  sendNotification(notification:iNotification){
        await new SQSAdapter().sendMessage(notification);
    }

    /**
     * 
     * @param notification 
     */
    async NotificationEvent(notification:iNotification){

        this.logger.info(`New notification: ${JSON.stringify(notification)}`);

        //Read all users with noteId
        var users = await new noteAdapter().getUsers(notification.noteId);

        //Filter the one that update the message
        users = users.filter( x => {
                return x.email != notification.user.email;
        });
        this.logger.info(`Users to send the notification: ${JSON.stringify(users)}`)
        

        const emails = users.map(x => x.email);
        this.logger.info(`Users to send notification email: ${JSON.stringify(emails)}`)

        const subject = `Note-Lite-App: Note shared with you has been updated`;
        const body = `The note ${notification.noteId} has been updated by ${notification.user.email}`

        await new SESAdapter().sendMessage(emails,[], subject, body);
    }
}