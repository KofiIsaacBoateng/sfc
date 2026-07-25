import "../shared/config/loadEnv.js";
import request from "supertest";
import { describe, expect, it } from "vitest";
import buildApp from "../app/app.js";

describe("Health Endpoint", () => {
  const app = buildApp();
  it("should return 200 OK", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
  });

  it("should return success as true", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.body.success).toBe(true);
  });

  it("should return status as UP", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.body.data.status).toBe("UP");
  });

  it("should return a timestamp", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.body.data.timestamp).toBeDefined();
  });

  it("should return the application version", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.body.data.version).toBeDefined();
  });
});
