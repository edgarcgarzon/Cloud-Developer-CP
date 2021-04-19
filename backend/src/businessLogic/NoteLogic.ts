import { postAdapter as noteAdapter } from "src/dataLayer/noteAdapter";
import { noteInit, note } from "@models/note";
import {createLogger} from "@libs/logger"
import * as uuid from 'uuid'


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
}