import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Express } from "express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "SFC API",
      version: "1.0.0",
      description: "Backend API for SFC NFC Mobile Services",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
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
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: {
              type: "object",
              properties: {
                code: { type: "string", example: "UNAUTHORIZED" },
                message: {
                  type: "string",
                  example: "Invalid or expired token",
                },
              },
              required: ["code", "message"],
            },
          },
          required: ["success", "error"],
        },
      },
    },
  },

  apis: ["./src/modules/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express): void {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

/****
 * test token
 * eyJhbGciOiJSUzI1NiIsImtpZCI6IjE2ZWUwMzFlODZhM2YwZmNkOWI2ZDcwMDJiMDJiMDg2ZDJmNTVkZTQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc2ZjbmZjc2ZjIiwiYXVkIjoic2ZjbmZjc2ZjIiwiYXV0aF90aW1lIjoxNzg1MTEyNTQ5LCJ1c2VyX2lkIjoiYUQzdmNBR3djTllEeU1Ka25ZWW1pclVRWk5NMiIsInN1YiI6ImFEM3ZjQUd3Y05ZRHlNSmtuWVltaXJVUVpOTTIiLCJpYXQiOjE3ODUxMTI1NDksImV4cCI6MTc4NTExNjE0OSwicGhvbmVfbnVtYmVyIjoiKzIzMzUwNTUxODEwMiIsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsicGhvbmUiOlsiKzIzMzUwNTUxODEwMiJdfSwic2lnbl9pbl9wcm92aWRlciI6InBob25lIn19.fL6fjheRgMilrnwBjrD3eDj5Vr_qWAxT01gS743iG3ld2vnTOA1AWmreh2-GgbgH8ikSr3KNyP16zG7zzQLAJnFFobyTQzwS-C-eDAZ9huBxOkVp0hUrB2lEZU39Fjl5Kp-qlvVIet4l01kZ6NJRRsu8vPRc56cjdPctcIQRJUXu8hV6C40KxLLDYrqKzEh4H9qBF0_Nzi2HQok2CC0RBrzvizvjlloZWargR2RG8__8g5gxduCL_n3j7-MmiXLQrJEfmGuD1ETFsU0TDjLLIrghEtQO2d4sxwAFq6WDZsOLlp5F_Gp1bbVGRwn8RaVBXOPHBvWvMd75AW51cMfweg
 */
