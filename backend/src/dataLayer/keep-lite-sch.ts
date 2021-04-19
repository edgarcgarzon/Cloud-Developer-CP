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
    }
  }
} as const;

export interface DbItem extends FromSchema<typeof DbItemSchema> {}

/**
 * convert dbitem into note
 * @param dbItem 
 * @returns 
 */
export function convDbItemToNote(dbItem: DbItem): Note{
    return {noteId: dbItem.PK, ...dbItem};
}

/**
 * Convert note into DbItem
 * @param note 
 * @returns 
 */
export function convNotetoDBItem(note: Note): DbItem{
    return {PK: note.noteId, ...note};
}