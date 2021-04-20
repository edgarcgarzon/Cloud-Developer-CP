export const shareNoteReqSch = {
    type: "object",
    properties: {
      noteId: { type: "string" },
      email:  { type: "string" },
      permissions: { 
        type: "string",
        enum: ["","R", "RW"]
      }
      
    },
    required :["noteId", "email", "permissions" ]
  } as const;;