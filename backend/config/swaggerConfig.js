import swaggerJSDoc from "swagger-jsdoc";
const port = 5000;

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "B&G API Documentation",
      version: "1.0.0",
      description: "API documentation using Swagger & Node.js",
    },
    customSiteTitle: "My API Docs",  // This sets the HTML page title
    servers: [
      {
        url: `http://localhost:${process.env.PORT || port}`,
        description: "Development server",
      },
    ],
  },
  apis: ["./routes/**/*.js"]  // Include subdirectories
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);
