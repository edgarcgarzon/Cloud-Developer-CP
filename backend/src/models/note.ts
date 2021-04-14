import { FromSchema } from "json-schema-to-ts";


export const noteInitSchema = {
  type: "object",
  properties: {
    body: { type: "string"},
    label: {type: "string"},
    reminder: {type: "string"}
  }
} as const;

export interface noteInit extends FromSchema<typeof noteInitSchema> {}

export const noteSchema  =  {
  type: "object",
  properties: {
    ...noteInitSchema.properties,
    postId: { type: "string"},
    userId:{ type: "string"},
    image: {
      type: "array",
      items: { type: "string"}
    }
  },
  required: [
    "postId", "userId" 
  ]
} as const;

export interface note extends FromSchema<typeof noteSchema> {}

