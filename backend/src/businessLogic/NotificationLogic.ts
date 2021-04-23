import { noteAdapter } from "@dataLayer/dynamodb/noteAdapter";
import { SQSAdapter } from "@dataLayer/sqs/SQSAdapter";
import { iNotification } from "@models/notification";


export class notificationLogic{
    constructor(){
        
    }
    /**
     * 
     * @param notification 
     */
    sendNotification(notification:iNotification){
        const {message, ...others} = notification;
        new SQSAdapter().sendMessage(message,others);
    }

    /**
     * 
     * @param notification 
     */
    async NotificationEvent(notification:iNotification){

        //Read all users with notId
        const users = await new noteAdapter().getUsers(notification.noteId);

        //filter the one that update the message
        users.filter( x => {
                x.email != notification.user.email;
        });

        //Send an email to the rest
        users.forEach( user => {
            
        })


    }
}