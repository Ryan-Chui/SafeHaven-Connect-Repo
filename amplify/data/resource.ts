import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Shelter: a
    .model({
      name: a.string().required(),
      latitude: a.float().required(),
      longitude: a.float().required(),
      address: a.string().required(),
      currentCapacity: a.integer().required(),
      maximumCapacity: a.integer().required(),
      foodNeed: a.integer().required(),
      waterNeed: a.integer().required(),
      medicalSuppliesNeed: a.integer().required(),
      blanketsNeed: a.integer().required(),
      clothingNeed: a.integer().required(),
      otherNeeds: a.string(),
      status: a.enum(['no-action', 'acknowledged', 'in-progress', 'completed']),
      otherInformation: a.string(),
      lastUpdated: a.datetime(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  
  User: a
    .model({
      name: a.string().required(),
      type: a.enum(['shelter', 'responder']),
      shelterId: a.id(),
      latitude: a.float(),
      longitude: a.float(),
      address: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
