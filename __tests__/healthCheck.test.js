const request = require("supertest");
const app = require("../index");

describe("Health Check Endpoint", () => {
  it("should return 200 OK", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("healthy");
  });
});
