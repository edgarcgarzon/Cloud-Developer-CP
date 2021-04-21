import { note as Note } from "@models/note";
import { FromSchema } from "json-schema-to-ts";


export const DbItemSchema = {
    type: "object",
    properties: {
        PK: { type: "string"},
        SK: { type: "string"},
        userId: {type: "string"},
        permissions:{type: "string"},
        payload: {
            type: "object",
            properties: {
                body: { type: "string"},
                label: { type: "string"},
                reminder: { type: "string"},
                attachment:{   
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
            }
        },
    },
    required:["PK", "SK", "userId", "permissions", "payload"]
    
} as const;

export interface DbItem extends FromSchema<typeof DbItemSchema> {}

/**
 * Convert note into DbItem
 * @param note 
 * @returns 
 */
export function convNotetoDBItem(note: Note): DbItem{
    const {noteId, ...others} = note;
    return {PK: note.noteId, SK: "BODY", permissions: "O", ...others} as DbItem;
}

/**
 * Convert note into DbItem
 * @param note 
 * @returns 
 */
 export function convDBItemTonote(item: DbItem): Note{
    const {PK, SK, permissions, ...others} = item;
    return {noteId: PK, ...others} as Note;
}

