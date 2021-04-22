import { iNote, noteSchema } from "@models/note";
import { FromSchema } from "json-schema-to-ts";


const {properties} = noteSchema;
const {noteId, ...others} = properties;

export const DbItemSchema = {
    type: "object",
    properties: {
        PK: noteId,
        SK: {type:"string"},
        ...others
    },
    required:["PK", "SK", "userId", "permissions", "payload"]
} as const;

export interface DbItem extends FromSchema<typeof DbItemSchema> {}

/**
 * Convert note into DbItem
 * @param note 
 * @returns 
 */
export function convNotetoDBItem(note: iNote): DbItem{
    const {noteId, ...others} = note;
    return {PK: note.noteId, SK: "BODY", ...others} as DbItem;
}

/**
 * Convert note into DbItem
 * @param note 
 * @returns 
 */
 export function convDBItemTonote(item: DbItem): iNote{
    const {PK, SK, ...others} = item;
    return {noteId: PK, ...others} as iNote;
}

