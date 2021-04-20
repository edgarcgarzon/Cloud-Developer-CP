export const shareNoteReqSch = {
    type: "object",
    properties: {
      noteId: { type: "string" },
      email:  { type: "string" }
      
    },
    required :["noteId", "email" ]
  } as const;;