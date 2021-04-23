import { FromSchema } from "json-schema-to-ts";

export const userSchema = {
    type: "object",
    properties: {
      Id: { type: "string" },
      email: { type: "string" },
    },
    required:["Id"]
  } as const;
  
  export interface iUser extends FromSchema<typeof userSchema> { }
  