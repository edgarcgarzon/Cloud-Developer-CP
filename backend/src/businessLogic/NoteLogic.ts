import { noteAdapter } from "@dataLayer/dynamodb/noteAdapter";
import { noteInit, iNote } from "@models/note";
import {createLogger} from "@libs/logger"
import * as uuid from 'uuid'
import { auth0Adapter } from "@dataLayer/auth0/auth0Adapter";
import { s3Adapter } from "@dataLayer/S3/s3Adapter";
import { iUser } from "@models/user";


export class noteLogic{


    constructor(
        private readonly logger = createLogger('NoteLogic'),
    ){
    }

    async getNote(userId:string, share:boolean):Promise<any[]>{
        this.logger.info(`Get notes (share: ${share}) for userId ${userId}`);
        const notes =  await new noteAdapter().getNote(userId, share);

        //Put signed url for each attachment in the notes
        notes.forEach( x => {
             x.payload.attachment = x.payload.attachment.map( id =>  
                 id + " : " + new s3Adapter().getGetUrl(x.noteId, id)
                )
            })

        return notes;
    }

    async putNote(userId: iUser, note:noteInit):Promise<iNote>{

        this.logger.info("put note: " + JSON.stringify(note) + " for userId: " + userId);

        //Create the complete body of the note before add it into the DB
        var newNote: iNote ={
            noteId: uuid.v4(),
            userId: userId.Id,
            permissions: "O",
            payload:{
                body: note.body? note.body: "",
                label: note.label? note.label: "",
                reminder: note.reminder? note.reminder : "",
                owner: userId.email,
                LastUpdateBy: userId.email,
                LastUpdateOn: new Date().toLocaleString(),
                attachment: []
            }
        }

        return await new noteAdapter().putPost(newNote);
    }

    /**
     * 
     * @param user 
     * @param noteId 
     * @param body 
     * @returns 
     */
    async updateNote(user: iUser, noteId:string, body: noteInit) {
        
        //Get permissions
        this.logger.info("Get permissions for userId: " + user + " noteId: " + noteId);
        var perms = await new noteAdapter().getPerms(user.Id, noteId);
        this.logger.info("Permissions: " + perms);        

        //If permission allow it, update the note
        if(perms.includes("O") || perms.includes("W"))
        {
            body["LastUpdateBy"] = user.email;
            body["LastUpdateOn"] = new Date().toLocaleString();
            this.logger.info(`Update the note Id: ${noteId} with ${JSON.stringify(body)}` );
            return await new noteAdapter().Update(noteId, body);
        }

        throw new Error(`User does not have enough permissions to update the note`)
    }

    /**
     * 
     * @param ownerUserId 
     * @param noteId 
     * @param targetUserEmail 
     */
    async shareNote(ownerUserId:string, noteId:string, targetUserEmail:string, permissions:string):Promise<any>{
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
        var shareItem = await new noteAdapter().shareNote(noteId, targetUserId, permissions);

        if(!shareItem){
            throw new Error(`Internal problem sharing`)
        }

        return {noteId: noteId, userId: targetUserEmail, permissions: permissions};
    }

    /**
     * 
     * @param user 
     * @param noteId 
     */
    async getUrlAttachment(user: iUser, noteId: string):Promise<string> {

        this.logger.info(`Check for user ${user.Id} pemissions over the note ${noteId}`);
        var perms = await new noteAdapter().getPerms(user.Id, noteId);

        console.log(perms);

        if(!perms.includes("O") && !perms.includes("W")){
             throw new Error("User does not have enough permissions to attach items to the note");
        }

        return new s3Adapter().getUploadUrl(noteId, uuid.v4(), user.email)
    }

    /**
     * 
     * @param userId 
     * @param noteId 
     */
    async deleteNote(userId: string, noteId: string) {

        const noteAdapterHdl = new noteAdapter();
        const perms = await noteAdapterHdl.getPerms(userId, noteId);

        if(!perms.includes("O")){
            throw new Error("User does not have enough permission to delete the note")
        }

        //Delete note
        await noteAdapterHdl.delete(noteId);
    }
}
 