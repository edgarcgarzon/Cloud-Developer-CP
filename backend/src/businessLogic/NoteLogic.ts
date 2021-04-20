import { noteAdapter } from "@dataLayer/dynamodb/noteAdapter";
import { noteInit, note } from "@models/note";
import {createLogger} from "@libs/logger"
import * as uuid from 'uuid'
import { auth0Adapter } from "@dataLayer/auth0/auth0Adapter";


export class noteLogic{

    constructor(
        private readonly logger = createLogger('NoteLogic'),
    ){
    }

    async getNote(userId:string):Promise<note[]>{
        this.logger.info("Get notes for userId " + userId);
        return await new noteAdapter().getNote(userId);
    }

    async putNote(userId: string, note:noteInit):Promise<note>{

        this.logger.info("put note: " + JSON.stringify(note) + " for userId: " + userId);

        //Create the complete body of the note before add it into the DB
        var newNote: note ={
            noteId: uuid.v4(),
            userId: userId,
            permissions: "O",
            payload:{
                body: note.body? note.body: "",
                label: note.label? note.label: "",
                reminder: note.reminder? note.reminder : "",
                image: []
            }
        }

        return await new noteAdapter().putPost(newNote);
    }

    /**
     * 
     * @param userId 
     * @param noteId 
     * @param body 
     * @returns 
     */
    async updateNote(userId: string, noteId:string, body: noteInit) {
        
        //Get permissions
        this.logger.info("Get permissions for userId: " + userId + " noteId: " + noteId);
        var perms = await new noteAdapter().getPerms(userId, noteId);
        this.logger.info("Permissions: " + perms);        

        //If permission allow it, update the note
        if(perms.includes("O") || perms.includes("W"))
        {
            this.logger.info(`Update the note Id: ${noteId} with ${JSON.stringify(body)}` );
            return await new noteAdapter().Update(noteId, body);
        }

        return undefined;
    }

    /**
     * 
     * @param ownerUserId 
     * @param noteId 
     * @param targetUserEmail 
     */
    async shareNote(ownerUserId:string, noteId:string, targetUserEmail:string):Promise<any>{
        this.logger.info(`Check for user ${ownerUserId} pemissions over the note ${noteId}`);
        var perms = await new noteAdapter().getPerms(ownerUserId, noteId);

        if(!perms.includes("O")){
             throw new Error("User does not have enough permissions to share the note");
        }

        this.logger.info(`Check if the email ${targetUserEmail} is register to an user`)
        var targetUserId = await new auth0Adapter().getUserIdbyEmail(targetUserEmail);

        if(!targetUserId){
            throw new Error(`Email ${targetUserEmail} is not register to any user`);
        }

        this.logger.info('Add the share item to the DB')
        var shareItem = await new noteAdapter().shareNote(noteId, targetUserId);

        if(!shareItem){
            throw new Error(`Internal problem sharing`)
        }

        return {noteId: noteId, userId: targetUserEmail};
    }
}
 