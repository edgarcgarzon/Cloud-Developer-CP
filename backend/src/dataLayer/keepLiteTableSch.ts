import { note as Note } from "@models/note";
import { FromSchema } from "json-schema-to-ts";


export const DbItemSchema = {
    type: "object",
    properties: {
        PK: { type: "string"},
        SK: { type: "string"},
        userId: {type: "string"},
        payload: {
            type: "object",
            properties: {
                body: { type: "string"},
                label: { type: "string"},
                reminder: { type: "string"},
                image:{   
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
            }
        },
    },
    required:["PK", "SK", "userId"],
    additionalProperties: false
    
} as const;

export interface DbItem extends FromSchema<typeof DbItemSchema> {}

/**
 * Convert note into DbItem
 * @param note 
 * @returns 
 */
export function convNotetoDBItem(note: Note): DbItem{
    const {noteId, ...others} = note;
    return {PK: note.noteId, SK: "BODY", ...others} as DbItem;
}

