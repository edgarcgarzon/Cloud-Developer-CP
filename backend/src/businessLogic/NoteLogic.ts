import { postAdapter } from "src/dataLayer/noteAdapter";
import { noteInit, note } from "src/models/note";
import * as uuid from 'uuid'


export class noteLogic{
    constructor(){
    }

    async getNote(userId:string, label?: string):Promise<note[]>{
        return await new postAdapter().getPost(userId, label);
    }

    async putNote(userId: string, note:noteInit):Promise<note>{

        //Create the complete body of the note before add it into the DB
        var newNote: note ={
            noteId: uuid.v4(),
            userId: userId,
            body: note.body? note.body: "",
            label: note.label? note.label: "",
            reminder: note.reminder? note.reminder : "",
            image: []
        }

        return await new postAdapter().putPost(newNote);
    }
}