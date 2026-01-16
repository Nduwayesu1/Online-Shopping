import { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const setupSwagger = (app: Express): void => {
  const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Online Shopping  API",
        version: "1.0.0",
        description: "API documentation for user authentication and management",
      },
      servers: [
        {
          url: "https://online-shopping-zauq.onrender.com",
          description: "Live server",
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
      },
    },
    apis: [
      "./src/routes/*.ts",
      "./src/routes/**/*.ts",
    ],
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
