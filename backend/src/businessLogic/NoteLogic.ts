import { postAdapter } from "src/dataLayer/noteAdapter";
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
        return await new postAdapter().getNote(userId);
    }

    async putNote(userId: string, note:noteInit):Promise<note>{

        this.logger.info("put note: " + JSON.stringify(note) + " for userId: " + userId);

        //Create the complete body of the note before add it into the DB
        var newNote: note ={
            noteId: uuid.v4(),
            userId: userId,
            payload:{
                body: note.body? note.body: "",
                label: note.label? note.label: "",
                reminder: note.reminder? note.reminder : "",
                image: []
            }
        }

        return await new postAdapter().putPost(newNote);
    }
}