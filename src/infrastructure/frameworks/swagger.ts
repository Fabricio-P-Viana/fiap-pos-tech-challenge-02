import swaggerJsdoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Blog API - FIAP Pos Tech",
    version: "1.0.0",
    description: "API REST para gerenciamento de posts de um blog",
  },
  tags: [
    { name: "Post", description: "Operações relacionadas a posts" },
    { name: "User", description: "Operações relacionadas a usuários" },
    { name: "Auth", description: "Autenticação e login" },
  ],
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor de desenvolvimento",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
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
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Fulano" },
          email: { type: "string", example: "fulano@mail.com" },
          role: { type: "string", example: "TEACHER" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      UserInput: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Fulano" },
          email: { type: "string", example: "fulano@mail.com" },
          password: { type: "string", example: "senha123" },
        },
      },
      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", example: "fulano@mail.com" },
          password: { type: "string", example: "senha123" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          token: { type: "string", example: "eyJhbGciOiJI..." },
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
