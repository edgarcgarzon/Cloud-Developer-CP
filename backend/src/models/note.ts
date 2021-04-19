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
    payload: {
      type: "object",
      properties: {
        body: { type: "string" },
        label: { type: "string" },
        reminder: { type: "string" },
        image: {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
      },
      required: ["body", "label", "reminder", "image"]
    }
  },
  required:["noteId", "userId", "payload"]
} as const;

export interface note extends FromSchema<typeof noteSchema> { }

