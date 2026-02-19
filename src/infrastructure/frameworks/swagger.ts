import swaggerJsdoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Blog API - FIAP Pos Tech",
    version: "1.0.0",
    description: "API REST para gerenciamento de posts de um blog",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor de desenvolvimento",
    },
  ],
  components: {
    schemas: {
      Post: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Meu primeiro post" },
          content: { type: "string", example: "Conteúdo do post aqui..." },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-02-15T10:00:00.000Z",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            example: "2026-02-15T10:00:00.000Z",
          },
        },
      },
      PostInput: {
        type: "object",
        required: ["title", "content"],
        properties: {
          title: { type: "string", example: "Meu primeiro post" },
          content: { type: "string", example: "Conteúdo do post aqui..." },
        },
      },
    },
  },
};

const options: swaggerJsdoc.Options = {
  swaggerDefinition,
  apis: ["./src/interface-adapters/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
