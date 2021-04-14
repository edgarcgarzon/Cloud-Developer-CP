import { FromSchema } from "json-schema-to-ts";

export const holaSchema =  {
  type: "object",
  properties: {
    name: { type: 'string' }
  },
  required: ['name']
} as const;

export interface hola extends FromSchema<typeof holaSchema> {}