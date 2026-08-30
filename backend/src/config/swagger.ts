import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Event Planning API",
      version: "1.0.0",
      description:
        "REST API for the Event Planning app. Authenticate via the /auth/login endpoint to get a Bearer token, then click **Authorize** above.",
    },
    servers: [
      {
        url: "http://localhost:4000/api/v1",
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          schema: "bearer",
          bearerFormat: "JWT",
          description: "Paste the accessToken returned by POST /auth/login",
        },
      },
      schemas: {
        SignupRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Alice Smith", minLength: 2 },
            email: {
              type: "string",
              format: "email",
              example: "alice@example.com",
            },
            password: { type: "string", minLength: 8, example: "Secret123" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "alice@example.com",
            },
            password: { type: "string", example: "Secret123" },
          },
        },
        AuthUser: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Alice Smith" },
            email: { type: "string", example: "alice@example.com" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        Event: {
          type: "object",
          properties: {
            id: { type: "integer", example: 42 },
            title: { type: "string", example: "Team Hackathon" },
            description: { type: "string", example: "Annual hack day" },
            location: { type: "string", example: "New York" },
            event_date: { type: "string", format: "date-time" },
            type: { type: "string", enum: ["public", "private"] },
            creator_id: { type: "integer", example: 1 },
            creator_name: { type: "string", example: "Alice Smith" },
            tags: {
              type: "array",
              items: { $ref: "#components/schemas/Tag" },
              example: [
                { id: 1, name: "hackathon" },
                { id: 3, name: "networking" },
              ],
            },
            rsvps: {
              $ref: "#/components/schemas/RsvpSummary",
            },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        CreateEventRequest: {
          type: "object",
          required: ["title", "event_date"],
          properties: {
            title: { type: "string", example: "Team Hackathon" },
            description: { type: "string", example: "Annual hack day" },
            location: { type: "string", example: "New York" },
            event_date: {
              type: "string",
              format: "date-time",
              example: "2025-09-15T09:00:00Z",
            },
            type: {
              type: "string",
              enum: ["public", "private"],
              default: "public",
            },
            tag_ids: {
              type: "array",
              items: { type: "integer" },
              example: [1, 3],
            },
          },
        },
        Tag: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "hackathon" },
          },
        },
        RsvpSummary: {
          type: "object",
          properties: {
            yes: { type: "integer", example: 12 },
            no: { type: "integer", example: 3 },
            maybe: { type: "integer", example: 5 },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: {
              type: "object",
              properties: {
                code: { type: "string", example: "VALIDATION_ERROR" },
                message: { type: "string", example: "Invalid input" },
                details: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      field: { type: "string" },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
        PaginationMeta: {
          type: "object",
          properties: {
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 10 },
            total: { type: "integer", example: 42 },
            totalPages: { type: "integer", example: 5 },
          },
        },
      },
    },
  },
  apis: ["./src/modules/**/*.routes.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
