import { FromSchema } from "json-schema-to-ts";


export const noteInitSchema = {
  type: "object",
  properties: {
    body: { type: "string" },
    label: { type: "string" },
    reminder: { type: "string" }
  }
} as const;

export interface noteInit extends FromSchema<typeof noteInitSchema> { }

export const noteSchema = {
  type: "object",
  properties: {
    noteId: { type: "string" },
    userId: { type: "string" },
    permissions: { type: "string" },
    payload: {
      type: "object",
      properties: {
        body: { type: "string" },
        label: { type: "string" },
        reminder: { type: "string" },
        owner:{ type: "string" },
        LastUpdateBy:{ type: "string" },
        LastUpdateOn:{ type: "string" },
        attachment: {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
      },
      required: ["body", "label", "reminder", "attachment"]
    }
  },
  required:["noteId", "userId", "permissions", "payload"]
} as const;

export interface iNote extends FromSchema<typeof noteSchema> { }

