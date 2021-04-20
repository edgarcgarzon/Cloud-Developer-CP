import { noteInitSchema } from "@models/note";

export const updateNoteReqSch =  {
    ...noteInitSchema,
    minProperties: 1,
};